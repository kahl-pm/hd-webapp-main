import { push, replace } from 'connected-react-router';
import jsCookie from 'js-cookie';
import { segmentTrackEvent, accountIdWrapper } from '@policyme/global-libjs-utils';
import { getMainProductExternalAdvisor, isPurchaseMode } from '../Selectors/productApp';
import {
  getInProgressPolicies,
  getAllInProgressPolicies,
  getUser2FaStatus,
  getUserAccount2FaStatus,
  IPostSendOTPResponse,
  IValidatePurchaseJourneyParamsRequest,
  IValidatePurchaseJourneyParametersRequest,
  IVerifyOTPResponse,
  postPhoneNumberFor2Fa,
  postPhoneNumberForAccount2Fa,
  postSendOTP,
  postVerifyOTP,
  validatePurchaseJourneyParams,
  validatePurchaseJourneyParameters,
  verifyAuth0EmailMagicLink,
  verifyAuth0MagicLink,
  verifyOTP,
  verifyAccountOTP,
} from './fetch';
import { checkLoginStatus, logout, nextQuestion, updateUserId, updateAccountId } from './session';
import {
  CRM_CONTACT_FIELDS,
  CRM_LIFE_SESSION_FIELDS,
  LEGACY_SEGMENT_EVENTS,
  ProductType,
  ROUTES,
  SEGMENT_EVENTS,
  TWO_FACTOR_STATUS,
  USER_TYPES,
  VERIFICATION_ERROR_TYPE,
} from '../utils/const';
import { getMainProduct, getProductFromCurrRoute } from '../Selectors/helpers/productApp';
import { doCrmSyncPatchContact, doCrmSyncPatchDeal } from './crm';
import { getRouteWithErrorType, productPrefixToProductType, withErrorModalOnFail } from '../utils/helpers';
import { updateMetadata } from './metadata';
import { makeUpdateHouseholdProp, updateEmailPrimary, updateHouseholdPropPrimary } from './household';
import { authGetUserInfo } from './auth';
import { State } from '../store/types/State';
import { sendSegmentIdentifyEvent, sendSegmentTrackEvent } from './analytics';
import { isPMEnvironment } from '../tenant/helpers';
import { sendSegmentTrackEventLegacy } from './legacyAnalytics';

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleUserAccountHydration} instead
 */
export const handleUserHydration = async (dispatch, { user_id, account_id }) => {
  await dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
  await dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
  await dispatch(authGetUserInfo());
};

export const handleUserAccountHydration = async (dispatch, { account_id, user_id }) => {
  await dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
  await dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
  await dispatch(authGetUserInfo());
};

export const handleCrmSync = async (getState, dispatch) => {
  const mainProduct = getMainProduct(getState(), getState().userControl.currentUser);
  const today_epoch = Date.now(); // UNIX formatted timestamps in milliseconds (epoch)
  const contactPayload = {
    [CRM_CONTACT_FIELDS.LAST_LOGIN_DATE]: today_epoch,
  };
    // patch Magic Link Verification for main product deal
  const payload = {
    [CRM_LIFE_SESSION_FIELDS.MAGIC_LINK_VERIFICATION]: 'Y',
  };
  await dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));
  await dispatch(doCrmSyncPatchContact(USER_TYPES.PRIMARY, mainProduct, contactPayload));
  return mainProduct;
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleAllInProgressPolicies} instead
 */
const handleInProgressPolicies = async (
  getState, dispatch, user_id, mainProduct, isPermanent,
) => {
  // eslint-disable-next-line max-len
  let hasInProgressPolicy = await withErrorModalOnFail(getInProgressPolicies, dispatch)(
    user_id, productPrefixToProductType(mainProduct), isPermanent,
  );
  const state = getState();
  if (isPurchaseMode(state)) {
    dispatch(push(ROUTES.DECISION_DASHBOARD_CALLBACK));
  } else {
    // if no existing policy in BE then clear redux store
    await dispatch(updateMetadata('hasInProgressPolicy', ''));
    dispatch(nextQuestion());
  }
};

const handleAllInProgressPolicies = async (
  getState, dispatch, account_id, mainProduct, isPermanent,
) => {
  // eslint-disable-next-line max-len
  let hasInProgressPolicy = await withErrorModalOnFail(getAllInProgressPolicies, dispatch)(
    account_id, productPrefixToProductType(mainProduct), isPermanent,
  );
  const state = getState();
  if (isPurchaseMode(state)) {
    dispatch(push(ROUTES.DECISION_DASHBOARD_CALLBACK));
  } else {
    // if no existing policy in BE then clear redux store
    await dispatch(updateMetadata('hasInProgressPolicy', ''));
    dispatch(nextQuestion());
  }
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleAuth0MagicLink} instead
 */
export const handleAuth0Link = async (getState, dispatch, user_id, account_id) => {
  const ret = await validateAuth0Link(getState, dispatch, user_id);
  if (ret.success) {
    await verifiedAuthFlow(dispatch,
      { user_id, account_id },
      getState);
  } else {
    if ('application_language' in ret) {
      dispatch(makeUpdateHouseholdProp(USER_TYPES.PRIMARY)('application_language', ret.application_language));
    }
    // eslint-disable-next-line max-len
    dispatch(replace(getRouteWithErrorType(ROUTES.VERIFICATION_ERROR, VERIFICATION_ERROR_TYPE.EXPIRED)));
  }
  return ret;
};

export const handleAuth0MagicLink = async (getState, dispatch, account_id, user_id) => {
  const ret = await validateAuth0MagicLink(getState, dispatch, account_id);
  if (ret.success) {
    await verifiedAuthFlowForAccount(dispatch,
      { account_id, user_id },
      getState);
  } else {
    if ('application_language' in ret) {
      dispatch(makeUpdateHouseholdProp(USER_TYPES.PRIMARY)('application_language', ret.application_language));
    }
    // eslint-disable-next-line max-len
    dispatch(replace(getRouteWithErrorType(ROUTES.VERIFICATION_ERROR, VERIFICATION_ERROR_TYPE.EXPIRED)));
  }
  return ret;
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link verifiedAuthFlowForAccount} instead
 */
export const verifiedAuthFlow = async (dispatch, { user_id, account_id }, getState) => {
  // merge the dummy account for primary user with existing account if available
  await handleUserHydration(dispatch, { user_id, account_id });
  const mainProduct = await handleCrmSync(getState, dispatch);
  const currentUser = getState().userControl.currentUser;
  if (isPMEnvironment()) {
    dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.LOGIN_SUCCESSFUL, currentUser, mainProduct, {
      login_method: getState()?.metadata?.login_method,
    }));
  } else {
    dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.LOGIN_SUCCESSFUL, currentUser, mainProduct, {
      login_method: getState()?.metadata?.login_method,
    }));
  }
  await handleInProgressPolicies(
    getState,
    dispatch,
    user_id,
    mainProduct,
    false, // isPermanent is always false for HD-only flow
  );
};

export const verifiedAuthFlowForAccount = async (dispatch, { account_id, user_id }, getState) => {
  // merge the dummy account for primary user with existing account if available
  await handleUserAccountHydration(dispatch, { account_id, user_id });
  const currentUser = getState().userControl.currentUser;
  const mainProduct = await handleCrmSync(getState, dispatch);
  if (isPMEnvironment()) {
    dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.LOGIN_SUCCESSFUL, currentUser, mainProduct, {
      login_method: getState()?.metadata?.login_method,
    }));
  } else {
    dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.LOGIN_SUCCESSFUL, currentUser, mainProduct, {
      login_method: getState()?.metadata?.login_method,
    }));
  }
  await handleAllInProgressPolicies(
    getState,
    dispatch,
    account_id,
    mainProduct,
    false, // isPermanent is always false for HD-only flow
  );
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link validateAuth0MagicLink} instead
 */
export const validateAuth0Link = async (getState, dispatch, user_id) => {
  // Magic link callback param uses primary HD app id as temporary app id.
  // it will get corrected after rehydration logic. dispatch(enableBeforeUnload());
  const { hd_application_id } = getState().primary.session;
  const temp_app_id = hd_application_id;
  const ret = await withErrorModalOnFail(verifyAuth0EmailMagicLink, dispatch)(
    temp_app_id, user_id,
  );
  await dispatch(updateHouseholdPropPrimary('email', ret.email));
  return ret;
};

export const validateAuth0MagicLink = async (getState, dispatch, account_id) => {
  // Magic link callback param uses primary HD app id as temporary app id.
  // it will get corrected after rehydration logic. dispatch(enableBeforeUnload());
  const { hd_application_id } = getState().primary.session;
  const temp_app_id = hd_application_id;
  const ret = await withErrorModalOnFail(verifyAuth0MagicLink, dispatch)(
    temp_app_id, account_id,
  );
  await dispatch(updateHouseholdPropPrimary('email', ret.email));
  return ret;
};

export function handleMaxAttemptsClose() {
  return async (dispatch, getState) => {
    // TODO confirm with Product about this flow
    dispatch(logout());
    dispatch(push(ROUTES.GETTING_STARTED));
  };
}

export const handleVerify2FaOtp = (verificationCode) => {
  return accountIdWrapper(handleVerify2FaOtpUserId, handleVerify2FaOtpAccountId, verificationCode);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleVerify2FaOtpAccountId} instead
 */
const handleVerify2FaOtpUserId = (verificationCode) => {
  return async (dispatch, getState) => {
    const { user_id, account_id } = getState().primary.session;
    const res = await verifyOTP(user_id, verificationCode);
    const {
      failed,
      success,
      expired,
      num_otp_attempts_remaining,
    } = res.data;
    const isLoggedIn = await dispatch(checkLoginStatus());
    if (isLoggedIn) {
      await handleAuth0Link(getState, dispatch, user_id, account_id);
      return res.data;
    } else if (failed) {
      // show banner with attempts left
      if (num_otp_attempts_remaining === 0 && !expired) {
        dispatch(push(ROUTES.TWO_FACTOR_MAX_ATTEMPTS));
      }
      return res.data;
    }
    return Promise.reject(res.error);
  };
};

const handleVerify2FaOtpAccountId = (verificationCode) => {
  return async (dispatch, getState) => {
    const { account_id, user_id } = getState().primary.session;
    const res = await verifyAccountOTP(account_id, verificationCode);
    const {
      failed,
      success,
      expired,
      num_otp_attempts_remaining,
    } = res.data;
    const isLoggedIn = await dispatch(checkLoginStatus());
    if (isLoggedIn) {
      await handleAuth0MagicLink(getState, dispatch, account_id, user_id);
      return res.data;
    } else if (failed) {
      // show banner with attempts left
      if (num_otp_attempts_remaining === 0 && !expired) {
        dispatch(push(ROUTES.TWO_FACTOR_MAX_ATTEMPTS));
      }
      return res.data;
    }
    return Promise.reject(res.error);
  };
};

export const handlePostPhoneNumberFor2Fa = () => {
  return accountIdWrapper(handlePostPhoneNumberFor2FaUserId, handlePostPhoneNumberFor2FaAccountId);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handlePostPhoneNumberFor2FaAccountId} instead
 */
const handlePostPhoneNumberFor2FaUserId = () => {
  return async (dispatch, getState) => {
    const { user_id } = getState().primary.session;
    const { phone } = getState().primary.household;
    const res = await postPhoneNumberFor2Fa(user_id, phone);
    const {
      failed,
      invalid,
      num_resend_attempts,
      success,
      num_attempts_remaining,
    } = res.data;
    if (success) {
      return res.data;
    } else if (failed) {
      const MAX_RESEND_ATTEMPTS_ALLOWED = 7;
      if (num_resend_attempts >= MAX_RESEND_ATTEMPTS_ALLOWED) {
        dispatch(push(ROUTES.TWO_FACTOR_MAX_ATTEMPTS));
      }
    }
    return Promise.reject(res.error);
  };
};

const handlePostPhoneNumberFor2FaAccountId = () => {
  return async (dispatch, getState) => {
    const { account_id } = getState().primary.session;
    const { phone } = getState().primary.household;
    const res = await postPhoneNumberForAccount2Fa(account_id, phone);
    const {
      failed,
      invalid,
      num_resend_attempts,
      success,
      num_attempts_remaining,
    } = res.data;
    if (success) {
      return res.data;
    } else if (failed) {
      const MAX_RESEND_ATTEMPTS_ALLOWED = 7;
      if (num_resend_attempts >= MAX_RESEND_ATTEMPTS_ALLOWED) {
        dispatch(push(ROUTES.TWO_FACTOR_MAX_ATTEMPTS));
      }
    }
    return Promise.reject(res.error);
  };
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link hydrateAccount2Fa} instead
 */
export const hydrate2Fa = (dispatch, account) => {
  // Partial Hydration, fields that are needed for 2Fa
  const { email, phone, user_id, account_id } = account;
  dispatch(updateEmailPrimary(email));
  dispatch(updateHouseholdPropPrimary('phone', phone));
  dispatch(updateMetadata('hasPreExistingPhoneNumber', !!phone));
  dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
  dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
};

export const hydrateAccount2Fa = (dispatch, account) => {
  // Partial Hydration, fields that are needed for 2Fa
  const { email, phone, account_id, user_id } = account;
  dispatch(updateEmailPrimary(email));
  dispatch(updateHouseholdPropPrimary('phone', phone));
  dispatch(updateMetadata('hasPreExistingPhoneNumber', !!phone));
  dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
  dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleAccount2FactorFlow} instead
 */
export const handle2FactorFlow = async (dispatch, { user_id }, getState) => {
  const res = await withErrorModalOnFail(getUser2FaStatus, dispatch)(
    user_id,
  );
  const account = res?.data;
  if (!account) {
    return Promise.reject(new Error('Error in getting user 2FA status'));
  }
  if (account.two_factor_status === TWO_FACTOR_STATUS.ENABLED) {
    hydrate2Fa(dispatch, { ...account, user_id });
    dispatch(push(ROUTES.TWO_FACTOR_VERIFICATION_CODE));
    await dispatch(sendSegmentIdentifyEvent(user_id));
    return Promise.resolve(account);
  }
  if (account.two_factor_status !== TWO_FACTOR_STATUS.ENABLED) {
    hydrate2Fa(dispatch, { ...account, user_id });
    // call verify endpoint, with empty string to get the user_jwt_token
    // the backend will return the user_jwt_token in the response
    // when the 2Fa status matches certain conditions
    // await handleAuth0Link(getState, dispatch, user_id);
    await handleVerify2FaOtp(null)(dispatch, getState);
    await dispatch(sendSegmentIdentifyEvent(user_id));
    return Promise.resolve(account);
  }
  return Promise.resolve(account);
};

export const handleAccount2FactorFlow = async (dispatch, { account_id, user_id }, getState) => {
  const res = await withErrorModalOnFail(getUserAccount2FaStatus, dispatch)(
    account_id,
  );
  const account = res?.data;
  if (!account) {
    return Promise.reject(new Error('Error in getting user 2FA status'));
  }
  if (account.two_factor_status === TWO_FACTOR_STATUS.ENABLED) {
    hydrateAccount2Fa(dispatch, { ...account, account_id, user_id });
    dispatch(push(ROUTES.TWO_FACTOR_VERIFICATION_CODE));
    await dispatch(sendSegmentIdentifyEvent(user_id));
    return Promise.resolve(account);
  }
  if (account.two_factor_status !== TWO_FACTOR_STATUS.ENABLED) {
    hydrateAccount2Fa(dispatch, { ...account, account_id, user_id });
    // call verify endpoint, with empty string to get the user_jwt_token
    // the backend will return the user_jwt_token in the response
    // when the 2Fa status matches certain conditions
    await handleVerify2FaOtp(null)(dispatch, getState);
    await dispatch(sendSegmentIdentifyEvent(user_id));
    return Promise.resolve(account);
  }
  return Promise.resolve(account);
};

export const initiateAuth0Validation = async (dispatch, getState) => {
  return accountIdWrapper(initiateAuth0ValidationUserId, initiateAuth0ValidationAccountId, dispatch, getState);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link initiateAuth0ValidationAccountId} instead
 */
const initiateAuth0ValidationUserId = async (dispatch, getState) => {
  const user_id = jsCookie.get('user_id');
  await handle2FactorFlow(dispatch, { user_id }, getState);
  return Promise.resolve({});
};

const initiateAuth0ValidationAccountId = async (dispatch, getState) => {
  const account_id = jsCookie.get('account_id');
  const user_id = jsCookie.get('user_id');
  await handleAccount2FactorFlow(dispatch, { account_id, user_id }, getState);
  return Promise.resolve({});
};

export const handleSendOTPEmail = () => {
  return async (dispatch, getState: () => State): Promise<IPostSendOTPResponse | {}> => {
    const mainProduct = getMainProductExternalAdvisor(getState());
    const app_id = getState().primary.session[`${mainProduct}_application_id`];
    const application_lang = getState().primary.household.application_language;
    const ret: IPostSendOTPResponse = await withErrorModalOnFail(
      postSendOTP, dispatch,
    )(app_id, application_lang);

    return ret.data;
  };
};

export const handleVerifyOTP = (otp: string) => {
  return accountIdWrapper(handleVerifyOTPUserId, handleVerifyOTPAccountId, otp);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleVerifyOTPAccountId} instead
 */
const handleVerifyOTPUserId = (otp: string) => {
  return async (dispatch, getState: () => State): Promise<IVerifyOTPResponse['data'] | {}> => {
    const mainProduct = getMainProductExternalAdvisor(getState());
    const app_id = getState().primary.session[`${mainProduct}_application_id`];
    const user_id = getState().primary.session.user_id;
    const account_id = getState().primary.session.account_id;

    const ret: IVerifyOTPResponse = await postVerifyOTP(app_id, otp);
    const {
      success,
    } = ret.data;
    if (success) {
      dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
      dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
      return initiateAuth0Validation(dispatch, getState);
    }
    return ret.data;
  };
};

const handleVerifyOTPAccountId = (otp: string) => {
  return async (dispatch, getState: () => State): Promise<IVerifyOTPResponse['data'] | {}> => {
    const mainProduct = getMainProductExternalAdvisor(getState());
    const app_id = getState().primary.session[`${mainProduct}_application_id`];
    const account_id = getState().primary.session.account_id;
    const user_id = getState().primary.session.user_id;
    const ret: IVerifyOTPResponse = await postVerifyOTP(app_id, otp);
    const {
      success,
    } = ret.data;
    if (success) {
      dispatch(updateAccountId(account_id, USER_TYPES.PRIMARY));
      dispatch(updateUserId(user_id, USER_TYPES.PRIMARY));
      return initiateAuth0Validation(dispatch, getState);
    }
    return ret.data;
  };
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleValidatePurchaseJourneyParameters} instead
 */
export const handleValidatePurchaseJourneyParams = async (
  params: IValidatePurchaseJourneyParamsRequest,
) => {
  const ret = await validatePurchaseJourneyParams(params);
  return ret.data;
};

export const handleValidatePurchaseJourneyParameters = async (
  params: IValidatePurchaseJourneyParametersRequest,
) => {
  const ret = await validatePurchaseJourneyParameters(params);
  return ret.data;
};
