/* eslint-disable max-len */
import moment from 'moment';
import { push, replace } from 'connected-react-router';
import {
  CAA_HD_PLAN_TYPES,
  getUrls,
  hasFlag,
  segmentTrackEvent,
  sentryError,
  TENANT_FLAGS,
  getConsent,
  accountIdWrapper,
  flagsmithIsFlagEnabled,
} from '@policyme/global-libjs-utils';
import jsCookie from 'js-cookie';
import { parseInt } from 'lodash';
import {
  allProducts,
  allProductsSynchronous,
  allUsers,
  allUsersParallel,
  calcAge,
  findClosestPolicyTerm,
  getCookieDomain,
  getMaxEligibleCoverageTier,
  getOtherUserType,
  getRouteWithErrorType,
  getRouteWithUserType,
  hasValue,
  openFile,
  processHbmResponse,
  productPrefixToProductType,
  snakeToCamelCase,
  transformUserKey,
  withErrorModalOnFail,
  createUserPriceViewedDataPayload,
  makeUpdateProductSessionProp,
  withLoading,
  isSocialSignOnFeatureEnabled,
  isDebugEnv
} from '../utils/helpers';
import { sendEventAll, sendSegmentIdentifyEvent, sendSegmentTrackEvent } from './analytics';
import { authGetUserInfo, setupNavBar } from './auth';
import { initiateAuth0Validation } from './auth0';
import {
  doCrmSyncPatchContact,
  doCrmSyncPatchDeal,
  doCrmSyncPatchDealAllProducts,
  doCrmSyncReferrer,
  doCrmSyncUpsertContactAndDeal,
} from './crm';
import { startAuraDecisionCalc, startAuraHDDecisionCalc, startAuraOverallDecisionCalc } from './decision';
import {
  getNextAuraDisclosure,
  initializeAuraDisclosure,
  submitDisclosureAnswer,
  unknownCurrentDisclosure,
} from './disclosure';
import { getDocusignEnvelopeAndOpen, openDocusignEnvelope, postDocusignResults } from './docusign';
import { openErrorModal } from './helpersMetadata';
import { verifyEmail } from './emailVerification';
import { updateExpenses } from './expenses';
import {
  checkPhoneNumberExists,
  closeInProgressPolicies,
  closeInProgressPoliciesForAccount,
  downloadHDConsentDoc,
  downloadPolicyCoverageTerms,
  downloadQADocument,
  getAffiliateInfo,
  getInProgressPolicies,
  getAllInProgressPolicies,
  getUserAccountInformation,
  getAccountInformation,
  getWebappUserAccountInformation,
  getWebappAccountInformation,
  patchAuthUser,
  patchMarketingCommunicationsConsent,
  patchMarketingCommsConsent,
  postAccountRecord,
  postAccountsRecord,
  postAuraAuthorization,
  postCreateHDSubscriptionAndFinalizeStripeSubscription,
  postCreateHDSubscriptionAndFinalizeStripeSubscriptionForAccount,
  postCreateSubscriptionAndFinalizeStripeSubscription,
  postCreateSubscriptionAndFinalizeStripeSubscriptionForAccount,
  postDigitalConsentStatus,
  postGenerateAdvisor,
  postGenerateAndUploadConsentDocuments,
  postGiAuraSession,
  postHDExclusionsDeclaration,
  postSetupHbm,
  postStripeCreateSetupIntent,
  postStripeCreateSetupIntentForAccount,
  postUpsertCustomerID,
  postUpsertCustomerIDForAccount,
  postValidateDigitalConsentDocuments,
  sendVerificationAuth0Email,
  updatePartnerPlaceholderEmail,
  verifyEmailMagicLink,
  verifyEmailMagicLinkAccountId,
  saveUserConsent,
  saveUserConsentForAccount,
  postAdvisorLedCheckout,
  removeProductSessionDiscounts,
  addProductSessionDiscounts,
  patchUtm,
} from './fetch';
import {
  makePatchProductAppRecord,
  makePatchInsuranceOwnershipType,
  setAppBuyingMethodAndProductAdded,
  updateProductAdded,
} from './helpers/productApp';
import {
  checkProductEligibilityWithBackend,
  createAuraAuthenticationRecord,
  createPolicyIdRecord,
  makeUpdateDecisionProp,
} from './helpers/productDecision';
import {
  makeAssociateJointProductSessions,
  makePatchProductSessionRecord,
  postSessionDiscounts,
  updateAllUserSessionProp,
  updateAllUserSessionPropAllProducts,
} from './helpers/productSession';
import {
  makeUpdateHouseholdProp,
  patchHouseholdByVal,
  patchHouseholdContact,
  updateExistingPrimary,
  updateExistingSecondary,
  updateHouseholdPropAll,
  updateHouseholdPropPrimary,
  updateHouseholdPropSecondary,
} from './household';
import { backgroundIdVerificationCheck } from './idVerification';
import { updateJointMetadata } from './jointMetadata';
import {
  disableBeforeUnload,
  makeUpdateMetadata,
  trackABTest,
  updateDisclosureAnswered,
  updateExistingPolicyFlags,
  updateMetadata,
} from './metadata';
import { addQuotesDiscount, removeQuotesDiscount, replaceUserQuotesWithMaxCovQuotes, updateUserQuotes } from './quotes';
import {
  checkLoginStatus,
  getMaxCovAndRequote,
  goToFirstDisclosure,
  handleAddToFamily,
  healthDentalAddUserToFamily,
  journeyIngress,
  makeUpdateSessionProp,
  navigateToProcessingPayment,
  nextQuestion,
  submitHouseholdInfoNeedsAssessmentFields,
  updateSessionPropPrimary,
  updateSessionPropSecondary,
  updateUserId,
  updateAccountId,
  upsertAppId,
  upsertHouseholdId,
  upsertSessionId,
} from './session';
import { updateHasPartnerApplication, updateUserControlProp } from './userControl';

import {
  getCurrentBaseDisclosureID,
  getCurrentDisclosureID,
  getCurrentDisclosureUserType,
  getDisclosureRoute,
  getNextDisclosureID,
  isLastDisclosureID,
  isNextDisclosureABaseDisclosure,
} from '../Selectors/disclosure';
import { getJointMaxEligibilityCI, getMaxEligibleCoverage, isEligible3, isEligibleCI } from '../Selectors/eligibility';
import {
  allProductsOptedIn,
  allUnpaidProducts,
  getHDAppPlanType,
  getMainProduct,
  getMainProductEventPrefix,
  isAppOptedEmpty,
  isAppProductAdded,
  isHDOptedIn,
  isSigningComplete,
} from '../Selectors/helpers/productApp';
import { areAnalyticsBlocked, getABTestBand } from '../Selectors/metadata';
import {
  getACHCSSGroupName,
  getAffiliateName,
  getProductName,
  getUserSlice,
  hasDependents,
  isACHCSSAffiliate,
  isDigitalConsentJourney,
  isJoint,
  isLoggedInUser,
  isMortgageBroker,
  showDigitalConsentPage,
} from '../Selectors/userControl';

import { hasFreeMonthsDiscount } from '../Selectors/helpers/productSession';
import {
  DOCUSIGN_NO_MEDICAL_POWERFORM_URL,
  GLOBAL_ROUTE,
  PM_ENABLE_DEFAULT_MONTHLY_PAYMENT,
  PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS,
  PM_ENABLE_QUEBEC_PRODUCT,
  PM_ENABLE_SEPT2025_PROMO,
  PM_SKIP_MAGIC_LINK,
} from '../config';
import { TERMS } from '../constants/session';
import {
  APP_FORM_FIELDS,
  AURA_DECISION_TYPES,
  AUTHORIZATION_TYPE,
  CONVERSION_TYPES,
  COUNTRY_CODES,
  CRM_CONTACT_FIELDS,
  CRM_LIFE_SESSION_FIELDS,
  DIGITAL_CONSENT_STATUS,
  DOCUSIGN_SOURCE_TYPE,
  DOCUSIGN_URL_STATUS,
  EXISTING_HD_PLAN_OPTION,
  FAMILY_DATA_VALUE,
  FAMILY_REDUCER_MAPPING,
  INELIGIBLE_PROVINCES,
  JOURNEY_INGRESS_POINTS,
  LEGACY_SEGMENT_EVENTS,
  PLAN_TYPES,
  PM_PRODUCT_PREFIX,
  PM_PRODUCT_TYPE,
  POLICY_SIGNED_STATUS,
  PRESCRIPTION_DRUG_FLAG,
  ProductTypeFull,
  QA_DOCUMENT_ORIGIN,
  QUEBEC_PROVINCE_VALUE,
  QUOTE_TYPES,
  ROUTES,
  SEGMENT_EVENTS,
  SESSION_STORAGE_LOGGING,
  STRIPE_SUBSCRIPTION_STATUS,
  UNDERWRITING_METHODS,
  USER_TYPES,
  UserType,
  VERIFICATION_ERROR_TYPE,
  WHAT_MATTERS_MOST_TO_YOU_OPTIONS,
} from '../utils/const';

import { isGIProduct, isPortableCoverageProduct } from '../Selectors/hdSession';
import { isQuebecHousehold } from '../Selectors/household';
import { isInBackdoorMode, isInExternalAdvisorMode } from '../Selectors/productApp';
import { getTenantCode, isCAAEnvironment, isHDEnabled, isPMEnvironment } from '../tenant/helpers';
import { DISCOUNT_CODES } from '../utils/discounts';
import { isHDFullyUWEnabled } from '../utils/flagHelpers';
import { trackConversion } from '../utils/utm';
import { saveHouseholdCookies, saveUserFamilyCompositionCookies } from './cookies';
import { updateDependentSession } from './dependents';
import { updateHDAppPropertyPrimary, updateHDAppPropertySecondary } from './hdApp';
import { getHealthDentalSessionQuotes, upsertHealthDentalSessionQuotes } from './hdSession';
import { generateRenewals, patchProductPolicies } from './helpers/productFetch';
import { makeUpdateProductPolicyProp } from './helpers/productPolicy';
import { getDisclosureNextQuestionPathName } from './helpers/session';
import { makeUpdatePaymentDetails, updateStripePaymentComplete } from './payment';
import {
  canSkipDecisionPage,
  completedJointNeedsAssesment,
  completedNeedsAssesment,
  doesPolicyIdExist,
  getProductAppId,
  getProductPolicyId,
} from '../Selectors/session';
import { DEFAULT_CONSENT_VERSIONS } from '../utils/consentVersion';
import { formatDateByLocale } from '../utils/reactIntlHelpers';
import { isDentalPlan } from '../pages/health-and-dental/plans';
import { MetadataPerson, State } from '../store/types/State';
import { DB_LOGIN_METHOD_TYPE_MAPPER, SSO_CONNECTION_TYPES } from '../constants/socialSignOn';
import { getSocialSignOnUrl } from '../utils/socialSignOn';
import { getNonDiscountedMonthlyUserTypePrem, getNonDiscountedYearlyUserTypePrem } from '../Selectors/quotes';
import { FLAGSMITH_FLAGS } from '../utils/flagsmith';
import { sendSegmentTrackEventLegacy } from './legacyAnalytics';

export const handleAdviceStart = () => {
  return (dispatch, getState) => {
    return withLoading(async () => {
      await dispatch(_handleAdviceStart());
      return dispatch(nextQuestion());
    }, dispatch)();
  };
};

export const handleNeedsAssessmentStart = () => {
  return (dispatch, getState) => {
    return withLoading(async () => {
      await dispatch(_handleAdviceStart());
    }, dispatch)();
  };
};

// Todo: remove isFromQuotesCopilotFlow if we end AB test 87 into A variant
export const handleNeedsAssessmentSubmit = (isFromQuotesCopilotFlow = false) => {
  return async (dispatch, getState) => {
    let state = getState();
    let group = 0; // HD-only: no existing Life/CI coverage
    let individual = 0; // HD-only: no existing Life/CI coverage

    if (group > 0 || individual > 0) {
      await dispatch(updateHouseholdPropPrimary('hasExistingCoverage', true));
    }

    await dispatch(updateExistingPrimary('group', group));
    await dispatch(updateExistingPrimary('individual', individual));

    if (state.userControl.hasPartnerApplication) {
      await dispatch(updateHouseholdPropPrimary('partnerAge', calcAge(state.secondary.household.birthdate)));
    }

    if (state.userControl.hasPartnerApplication && (isQuebecHousehold(state) || isFromQuotesCopilotFlow)) {
      await dispatch(updateHouseholdPropSecondary('partnerAge', calcAge(state.primary.household.birthdate)));

      let groupSecondary = 0; // HD-only: no existing Life/CI coverage
      let individualSecondary = 0; // HD-only: no existing Life/CI coverage

      if (groupSecondary > 0 || individualSecondary > 0) {
        await dispatch(updateHouseholdPropSecondary('hasExistingCoverage', true));
      }

      await dispatch(updateExistingSecondary('group', groupSecondary));
      await dispatch(updateExistingSecondary('individual', individualSecondary));
    }

    const householdOptions = isFromQuotesCopilotFlow ? { showLoader: false } : undefined;
    await dispatch(_handleHouseholdAndPreferences(USER_TYPES.PRIMARY, householdOptions));
    if (state.userControl.hasPartnerApplication && (isQuebecHousehold(state) || isFromQuotesCopilotFlow)) {
      // Make sure we aren't touching estimates for secondary unless go through the flow
      await dispatch(_handleHouseholdAndPreferences(USER_TYPES.SECONDARY, householdOptions));
    }

    await dispatch(updateExpenses());

    if (!isFromQuotesCopilotFlow) {
      await dispatch(handleFetchAndApplyCIRecommendations(false));
    }
  };
};

export const handleFetchAndApplyCIRecommendations = (_isFromQuotesCopilotFlow: boolean) => {
  return async (_dispatch, _getState) => {
    // no-op: CI recommendations removed as part of HD-only webapp migration
  };
};

const _handleHouseholdAndPreferences = (userType, options?: { showLoader?: boolean }) => {
  return async (dispatch, getState) => {
    await dispatch(submitHouseholdInfoNeedsAssessmentFields(userType, options));
    // patchPreferences removed: Life session preferences not applicable in HD-only webapp
  };
};

const _handleAdviceStart = allUsers((userType) => {
  return (dispatch, getState) => {
    return withLoading(async () => {
      await dispatch(handlePostAccountRecord(userType, undefined, false));
      await dispatch(upsertHouseholdId(userType, undefined, true));
    }, dispatch)();
  };
});

// Remark: productType has to be the first argument of passed in fn
// HD-only: always use HD product
export const handleUpsertIds = (userType, key?) => {
  return async (dispatch, getState) => {
    // create ids if they don't exist
    await dispatch(upsertSessionId(userType, PM_PRODUCT_PREFIX.HD));
    await dispatch(upsertAppId(userType, PM_PRODUCT_PREFIX.HD));
  };
};

// Remark: once ENABLE_SOCIAL_SIGN_ON is enabled, this function will be deprecated and can be removed
export function handleStartAppNextSteps(mainProduct) {
  return (dispatch, getState) => {
    return withLoading(async () => {
      let state = getState();
      let { currentUser: userType } = state.userControl;

      if (isACHCSSAffiliate(state)) {
        jsCookie.set('utm_term', getACHCSSGroupName(state));
      }

      if (!isLoggedInUser(state)) {
        if (isPMEnvironment()) {
          dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.LOGIN_INITIATED));
        } else {
          dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.LOGIN_INITIATED));
        }
      }
      if ((!isJoint(state) && completedNeedsAssesment(state, USER_TYPES.PRIMARY, mainProduct)) ||
        completedJointNeedsAssesment(state, mainProduct)) {
        dispatch(updateMetadata('needsAssessmentStartedAfterStartApp', false));
      }
      // verify email
      try {
        await dispatch(verifyEmail(userType));
      } catch (error) {
        dispatch(makeUpdateHouseholdProp(userType)('isValidEmail', false));
        return Promise.reject(error);
      }

      dispatch(makeUpdateHouseholdProp(userType)('isValidEmail', true));

      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        // TODO: No cross-sell hd for now
        await dispatch(updateUserControlProp('availableProducts', [PM_PRODUCT_PREFIX.HD]));
      }

      // set buying_method and product_added to redux state
      await dispatch(setAppBuyingMethodAndProductAdded(mainProduct));

      // create account record
      await dispatch(handlePostAccountRecord(USER_TYPES.PRIMARY, undefined, true));
      await dispatch(handleStartAppUpsertSteps(mainProduct));
      if (getState().metadata.hasInProgressPolicy) {
        return Promise.resolve();
      }
      // force going through preApp flow if user is asked to go back to quotes page and edit province
      // having dummytoken alone would block from proceeding to nextQuestion
      if (!getState().metadata.isforceRedoStartApp && getState().primary.session.twilio_token === 'dummytoken') {
        return Promise.resolve();
      }
      dispatch(updateMetadata('isforceRedoStartApp', false));
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.APPLICATION_STARTED, userType));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.APPLICATION_STARTED, userType));
      }
      return dispatch(nextQuestion());
    }, dispatch)();
  };
}

export function handleStartAppNextStepsForSocialSignOn(mainProduct) {
  return (dispatch, getState) => {
    return withLoading(async () => {
      let state = getState();
      let { currentUser: userType } = state.userControl;

      if (isACHCSSAffiliate(state)) {
        jsCookie.set('utm_term', getACHCSSGroupName(state));
      }

      // clear the auth0 response
      dispatch(updateMetadata('auth0Resp', '')); // Clear the auth0 response

      if (!isLoggedInUser(state)) {
        if (isPMEnvironment()) {
          dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.LOGIN_INITIATED));
        } else {
          dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.LOGIN_INITIATED));
        }
      }
      if ((!isJoint(state) && completedNeedsAssesment(state, USER_TYPES.PRIMARY, mainProduct)) ||
        completedJointNeedsAssesment(state, mainProduct)) {
        dispatch(updateMetadata('needsAssessmentStartedAfterStartApp', false));
      }
      // verify email only if login method is magic link
      if (state.metadata.login_method === SSO_CONNECTION_TYPES.MAGIC_LINK) {
        try {
          await dispatch(verifyEmail(userType));
        } catch (error) {
          return Promise.reject(error);
        }
      }

      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        await dispatch(updateUserControlProp('availableProducts', [PM_PRODUCT_PREFIX.HD]));
      }

      // set buying_method and product_added to redux state
      await dispatch(setAppBuyingMethodAndProductAdded(mainProduct));

      // create account record
      await dispatch(handlePostAccountRecord(USER_TYPES.PRIMARY, undefined, true));
      await dispatch(handleStartAppUpsertSteps(mainProduct));
      if (state.metadata.hasInProgressPolicy) {
        return Promise.resolve();
      }
      // force going through preApp flow if user is asked to go back to quotes page and edit province
      // having dummytoken alone would block from proceeding to nextQuestion
      if (!state.metadata.isforceRedoStartApp && state.primary.session.twilio_token === 'dummytoken') {
        return Promise.resolve();
      }
      dispatch(updateMetadata('isforceRedoStartApp', false));
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.APPLICATION_STARTED, userType));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.APPLICATION_STARTED, userType));
      }

      // if the user is logged in or the login method is magic link, proceed to next question
      // otherwise we will be redirected to social sign on link
      if (isLoggedInUser(state) || state.metadata.login_method === SSO_CONNECTION_TYPES.MAGIC_LINK) {
        dispatch(sendSegmentIdentifyEvent(state[userType].session.user_id));
        return dispatch(nextQuestion());
      }
      return Promise.resolve();
    }, dispatch)();
  };
}

export function handleBasicDetailsNextSteps() {
  return (dispatch, getState) => {
    return withLoading(async () => {
      const state = getState();
      const mainProduct = getMainProduct(state, USER_TYPES.PRIMARY);
      let { currentUser: userType } = state.userControl;

      // create account record
      await dispatch(handleStartAppUpsertSteps(mainProduct));
      if (getState().metadata.hasInProgressPolicy) {
        return Promise.resolve();
      }

      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        dispatch(_doHhPatchAllUsersHD())
      }

      if (isACHCSSAffiliate(state)) {
        const trackingId = jsCookie.get('utm_tracking_id') ?? state.metadata.utm_tracking_id;
        const globalId = jsCookie.get('utm_global_id') ?? state.metadata.utm_global_id;
        const groupName = getACHCSSGroupName(state);
        if (trackingId && globalId) {
          patchUtm(globalId, trackingId, {
            utm_term: `ACHCCS ${groupName}`,
          });
        }
      }

      // This will populate the navbar first name and last name
      // After first and last name are populated
      dispatch(setupNavBar());

      // This is used to determine if the user filled out basic details or not so we can skip the basic details page
      // if the name has already been prepopulated before filling out basic details
      updateMetadata('filledOutBasicDetails', true);
      return dispatch(nextQuestion());
    }, dispatch)();
  };
}

export function canPatchAdvisorIdAndHhInfoId() {
  return async (dispatch, getState) => {
    const hh_info_id = getState().primary.session.household_id;
    const advisor_id = getState().primary.household.advisor_id;
    const canPatchHousehold = hh_info_id && advisor_id;
    if (canPatchHousehold) {
      await dispatch(patchHouseholdByVal(USER_TYPES.PRIMARY, { advisor_id }, null));
    }
  };
}

export function handleTemporarySept2025Promo() {
  return async (dispatch, getState) => {
    // No-op: Life-specific promo, not applicable to HD-only webapp
    return null;
  };
}

export function handleStartAppUpsertSteps(mainProduct) {
  return async (dispatch, getState) => {
    // set buying_method and product_added to redux state
    const isSocialSignOnEnabled_ = isSocialSignOnFeatureEnabled();
    await dispatch(setAppBuyingMethodAndProductAdded(mainProduct));

    const fromStartApp = getState().metadata.fromStartApp;
    const isShadowAccountStartApp = getState().metadata.isShadowAccountStartApp;
    const allowNoAppIdStartapp = getState().metadata.allowNoAppIdStartapp;
    const userType = getState().userControl.currentUser;
    const hasAppId = hasValue(getState()[userType].session[`${mainProduct}_application_id`]);

    const fromStartAppWithPermittedNoAppId = allowNoAppIdStartapp && fromStartApp && !hasAppId;

    if ((!isShadowAccountStartApp && (fromStartAppWithPermittedNoAppId || !fromStartApp) && mainProduct !== PM_PRODUCT_PREFIX.HD) || (!hasAppId && mainProduct === PM_PRODUCT_PREFIX.HD)) {
      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        await dispatch(_handleStartAppNextStepsHD());
      }
    }

    if (fromStartApp) {
      await dispatch(canPatchAdvisorIdAndHhInfoId());
    }

    // update email and account if changed
    // INFO: Do not update email in account in any circumstance

    // make request to store ab test for primary
    await dispatch(trackABTest(USER_TYPES.PRIMARY));
    if (getState().userControl.hasPartnerApplication) {
      await dispatch(trackABTest(USER_TYPES.SECONDARY));
    }

    // associate primary with secondary + ab test + discounts for secondary
    if (getState().userControl.hasPartnerApplication &&
      !getState().metadata.association_complete &&
      (!getState().metadata.fromStartApp || fromStartAppWithPermittedNoAppId) &&
      mainProduct !== PM_PRODUCT_PREFIX.HD) {
      getState().userControl.availableProducts.forEach(async (product) => {
        await dispatch(makeAssociateJointProductSessions(product));
      });
      await dispatch(updateMetadata('association_complete', true));
    }


    if (!isSocialSignOnEnabled_ && isACHCSSAffiliate(getState())) {
      const state = getState();
      const trackingId = jsCookie.get('utm_tracking_id') ?? state.metadata.utm_tracking_id;
      const globalId = jsCookie.get('utm_global_id') ?? state.metadata.utm_global_id;
      const groupName = getACHCSSGroupName(state);
      if (trackingId && globalId) {
        patchUtm(globalId, trackingId, {
          utm_term: `ACHCCS ${groupName}`,
        });
      }
    }

    // crm sync for primary only since we don't have email for secondary yet
    // Only sync if login method is magic link
    if ((isSocialSignOnEnabled_ && getState().metadata.login_method === SSO_CONNECTION_TYPES.MAGIC_LINK) || !isSocialSignOnEnabled_) {
      await dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));

      // crm sync for user intent once we have session and email available
      if (getState().metadata.userIntent) {
        const payload = { user_intent: getState().metadata.userIntent };
        await dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));
        await dispatch(doCrmSyncPatchContact(USER_TYPES.PRIMARY, mainProduct, payload));
      }
    }

    const isLoggedIn = await dispatch(checkLoginStatus());
    const is_backdoor = (jsCookie.get('backdoor_flag') === 'true'
      && isLoggedIn
      && jsCookie.get('portal_owner_id') !== undefined);
    const payload = {
      [CRM_LIFE_SESSION_FIELDS.ADVISOR_SUBMISSION_FLAG]: 'Y',
    };
    if (is_backdoor && jsCookie.get('portal_owner_id') !== 'None') {
      payload[CRM_LIFE_SESSION_FIELDS.DEDICATED_CS_REPRESENTATIVE] = jsCookie.get('portal_owner_id');
    }
    if (is_backdoor) {
      dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));
    }
    // let's wait for contact & deal to be processed before we apply the patch
    // send magic link logic only if user is not logged in
    if (!isLoggedInUser(getState())) {
      //  If social sign on is enabled and login method is magic link, send verification email, or if social sign on is disabled, send verification email
      if ((isSocialSignOnEnabled_ && getState().metadata.login_method === SSO_CONNECTION_TYPES.MAGIC_LINK) || !isSocialSignOnEnabled_) {
        !isInExternalAdvisorMode(getState()) && await dispatch(handleSendVerificationEmail());
      } else {
        // If social sign on is enabled and login method is not magic link, redirect to social sign on link
        await dispatch(handleRedirectToSocialSignOnLink());
      }
    } else {
      let hasInProgressPolicy;
      if (flagsmithIsFlagEnabled(FLAGSMITH_FLAGS.PM_ENABLE_ACCOUNT_ID_VERSION)) {
        const account_id = jsCookie.get('account_id');
        hasInProgressPolicy = await withErrorModalOnFail(getAllInProgressPolicies, dispatch)(
          account_id, productPrefixToProductType(mainProduct), false,
        );
      } else {
        const user_id = jsCookie.get('user_id');
        hasInProgressPolicy = await withErrorModalOnFail(getInProgressPolicies, dispatch)(
          user_id, productPrefixToProductType(mainProduct), false,
        );
      }
      if (hasInProgressPolicy) {
        await dispatch(updateMetadata('hasInProgressPolicy', hasInProgressPolicy));
        return dispatch(push(ROUTES.KEEP_EXISTING_APP));
      }
      // if no existing policy in BE then clear redux store
      await dispatch(updateMetadata('hasInProgressPolicy', ''));
    }

    // we need app id and life session id to be generated before we send this event
    // EMAIL_CREATED is QUOTE_SELECTED in Impact
    // APP_STARTED is to notify Taboola
    dispatch(trackConversion(CONVERSION_TYPES.EMAIL_CREATED));
    dispatch(trackConversion(CONVERSION_TYPES.APP_STARTED));
    return null;
  };
}

export const handlePostAccountRecord = (userType, key, disableUpdateIfExists = false) => {
  return accountIdWrapper(handlePostAccountRecordUserId, handlePostAccountRecordAccountId, userType, key, disableUpdateIfExists);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handlePostAccountRecordAccountId} instead
 */
const handlePostAccountRecordUserId = (userType, key, disableUpdateIfExists = false) => {
  return async (dispatch, getState) => {
    const userSlice = getUserSlice(getState(), userType, key);
    // usually for secondary users email is empty string
    // which is okay backend will create a placeholder email
    const { email } = userSlice.household;
    const { user_id } = userSlice.session;
    const account_language_preference = userSlice.household.application_language;
    const testBand = getABTestBand(getState());
    const analyticsBlocked = areAnalyticsBlocked(getState());
    const initial_login_method_attempt = DB_LOGIN_METHOD_TYPE_MAPPER[getState().metadata.login_method];
    if (user_id === '' || disableUpdateIfExists) {
      const res = await withErrorModalOnFail(postAccountRecord, dispatch)(
        email,
        account_language_preference,
        testBand,
        analyticsBlocked,
        initial_login_method_attempt,
        disableUpdateIfExists,
      );
      if (userType === USER_TYPES.DEPENDENT) {
        dispatch(updateDependentSession(key, 'user_id', res.user_id));
        dispatch(updateDependentSession(key, 'account_id', res.account_id));
      } else {
        dispatch(makeUpdateSessionProp(userType)('user_id', res.user_id));
        dispatch(makeUpdateSessionProp(userType)('account_id', res.account_id));
      }
    }
  };
};

const handlePostAccountRecordAccountId = (userType, key, disableUpdateIfExists = false) => {
  return async (dispatch, getState) => {
    const userSlice = getUserSlice(getState(), userType, key);
    // usually for secondary users email is empty string
    // which is okay backend will create a placeholder email
    const { email } = userSlice.household;
    const { account_id } = userSlice.session;
    const account_language_preference = userSlice.household.application_language;
    const testBand = getABTestBand(getState());
    const analyticsBlocked = areAnalyticsBlocked(getState());
    const initial_login_method_attempt = DB_LOGIN_METHOD_TYPE_MAPPER[getState().metadata.login_method];
    if (account_id === '' || disableUpdateIfExists) {
      const res = await withErrorModalOnFail(postAccountsRecord, dispatch)(
        email,
        account_language_preference,
        testBand,
        analyticsBlocked,
        initial_login_method_attempt,
        disableUpdateIfExists,
      );
      if (userType === USER_TYPES.DEPENDENT) {
        dispatch(updateDependentSession(key, 'user_id', res.user_id));
        dispatch(updateDependentSession(key, 'account_id', res.account_id));
      } else {
        dispatch(makeUpdateSessionProp(userType)('user_id', res.user_id));
        dispatch(makeUpdateSessionProp(userType)('account_id', res.account_id));
      }
    }
  };
};

// Remark: productType has to be the first argument of passed in fn
const _patchProductSessionApp = allProducts((product, userType) => {
  return async (dispatch, getState) => {
    await dispatch(makePatchProductSessionRecord(userType, product));
    await dispatch(makePatchProductAppRecord(userType, product));
  };
});

const _patchHouseholdInfoStartApp = (userType, key) => {
  return async (dispatch, getState) => {
    const state = getState();
    if (userType === USER_TYPES.DEPENDENT && key) {
      const dependentInfo = state.dependents.dependents[key].household;
      await dispatch(patchHouseholdByVal(userType, {
        user: {
          first_name: dependentInfo.firstName,
          last_name: dependentInfo.lastName,
          birthdate: dependentInfo.birthdate,
          gender: dependentInfo.userGender,
          healthcard_province: dependentInfo.healthcard_province,
        },
      }, key));
    } else {
      const userInfo = state[userType].household;
      const spouseInfo = state[getOtherUserType(userType)].household;
      const payload = {
        children: userInfo.kids,
        user: {
          first_name: userInfo.firstName,
          last_name: userInfo.lastName,
          birthdate: userInfo.birthdate,
          email: userInfo.email,
          gender: userInfo.userGender,
          province: userInfo.province,
          healthcard_province: userInfo.healthcard_province,
          use_tobacco: userInfo.smoke,
          user_family_composition: userInfo.user_family_composition,
        },
        spouse: {
          birthdate: spouseInfo.birthdate,
          first_name: spouseInfo.firstName,
          last_name: spouseInfo.lastName,
          gender: spouseInfo.userGender,
          use_tobacco: userInfo.smoke,
        },
      };
      await dispatch(patchHouseholdByVal(userType, payload));
    }
  };
};

const _doHhAndFamilyUpsertAllUsersHD = allUsers((userType, key) => {
  return async (dispatch, useState) => {
    await dispatch(upsertHouseholdId(userType, key));
    await dispatch(healthDentalAddUserToFamily(userType, key));
  };
});

const _doHhPatchAllUsersHD = allUsers((userType, key) => {
  return async (dispatch, useState) => {
    await dispatch(_patchHouseholdInfoStartApp(userType, key));
  };
});

export const createGiAuraSessions = allUsers((userType, key, product) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userSlice = getUserSlice(state, userType, key);

    const app_id = state.primary.session[`${product}_application_id`];
    const family_id = userSlice.session[`${product}_family_id`];
    const hh_info_id = userSlice.session.household_id;

    const payload = { app_id, family_id, hh_info_id };
    const ret = await withErrorModalOnFail(postGiAuraSession, dispatch)(payload);
    dispatch(makeUpdateSessionProp(userType)('aura_session_id', ret.aura_session_id));
  };
});

const patchAppRecordsHd = allProducts(allUsers((userType, product) => {
  return async (dispatch, getState) => {
    await dispatch(makePatchProductAppRecord(userType, product));
  };
}));

const handleUpsertIdsHD = allUsers((userType) => {
  return async (dispatch, getState) => {
    await dispatch(upsertSessionId(userType, PM_PRODUCT_PREFIX.HD));
    await dispatch(upsertAppId(userType, PM_PRODUCT_PREFIX.HD));
  };
});

const _handleStartAppNextStepsHD = () => {
  return async (dispatch, getState) => {
    await dispatch(_doHhAndFamilyUpsertAllUsersHD());

    await dispatch(handleUpsertIdsHD());

    await dispatch(_doHhPatchAllUsersHD());

    await dispatch(patchAppRecordsHd());

    // upsert session quotes
    await dispatch(upsertHealthDentalSessionQuotes());

    // apply discount information
    await dispatch(postSessionDiscounts());

    await dispatch(updateMetadata('completedStartApp', true));
  };
};

export function handleAffiliateInfo(affiliateId) {
  return async (dispatch, getState) => {
    await withLoading(getAffiliateInfo, dispatch)(affiliateId)
      .then(affiliateInfo => {
        dispatch(updateUserControlProp('affiliateId', affiliateId));
        dispatch(updateUserControlProp('affiliate', {
          affiliateName: affiliateInfo.affiliate_name,
          affiliateCategory: affiliateInfo.category,
        }));

        const updatedState = getState();
        // Apply discount codes from affiliate info
        if (affiliateInfo.discount_codes) {
          Object.keys(affiliateInfo.discount_codes).forEach((productType) => {
            affiliateInfo.discount_codes[productType].forEach((discountCode) => {
              dispatch(addQuotesDiscount(USER_TYPES.PRIMARY, productType)(discountCode));
              dispatch(addQuotesDiscount(USER_TYPES.SECONDARY, productType)(discountCode));
            });
          });
        }
      })
      .catch(error => {
        dispatch(updateUserControlProp('affiliate', {}));
        dispatch(updateUserControlProp('affiliateId', ''));
      });
  };
}

export function handleMortgageAppParams(params) {
  return async (dispatch, getState) => {
    dispatch(updateMetadata(CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE, getAffiliateName(getState())));

    // Hydrate primary user info
    const mortgageAppKeys = ['firstName', 'lastName', 'email', 'phone'];
    const updatedParams = snakeToCamelCase(params);
    mortgageAppKeys.forEach(key => {
      if (key in updatedParams) {
        dispatch(updateHouseholdPropPrimary(key, updatedParams[key]));
      }
    });
    // Hydrate address
    const addressKeys = ['address_line1', 'address_line2', 'city', 'country', 'postal_code', 'province'];
    const validAddress = addressKeys.every(key => key in params);
    if (validAddress) {
      addressKeys.forEach(key => {
        dispatch(updateHouseholdPropPrimary(key, params[key]));
      });
    }
    // Default recommended amount based on mortgage balance removed — Life-specific, not applicable for HD-only webapp
  };
}

export function handleSubmitFullAddress(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    let { province, country } = state[userType].household;
    if (state.jointMetadata.user_partner_same_address_flag === 'Y') {
      dispatch(updateHouseholdPropSecondary('address_line1', state.primary.household.address_line1));
      dispatch(updateHouseholdPropSecondary('address_line2', state.primary.household.address_line2));
      dispatch(updateHouseholdPropSecondary('city', state.primary.household.city));
      dispatch(updateHouseholdPropSecondary('province', state.primary.household.province));
      dispatch(updateHouseholdPropSecondary('country', state.primary.household.country));
      dispatch(updateHouseholdPropSecondary('postal_code', state.primary.household.postal_code));
      province = state.primary.household.province;
      country = state.primary.household.country;
    }

    // required to sync addresses to update hubspot for ineligible province/country
    await dispatch(patchHouseholdContact(userType));

    // note we can't do sync for secondary because
    // we don't have their email to sync to hubspot at this step
    if (userType === USER_TYPES.PRIMARY) {
      dispatch(doCrmSyncUpsertContactAndDeal(userType));
    }

    if ((INELIGIBLE_PROVINCES.includes(province) || country !== COUNTRY_CODES.CA) ||
      (hasFlag(TENANT_FLAGS.QUEBEC_DISABLED) && province === QUEBEC_PROVINCE_VALUE)) {
      let productPrefix = getMainProductEventPrefix(getState(), userType);
      if (!hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
        segmentTrackEvent(`${productPrefix} - MODAL Ineligible Province or Country`, {});
      }
      return Promise.resolve(false);
    }
    dispatch(nextQuestion());
    return Promise.resolve(true);
  };
}

// INFO: Save phone number for primary and secondary users in household info and sync it to CRM
const _handleSaveAndSyncCellPhone = allUsersParallel((userType) => {
  return async (dispatch, getState) => {
    if (userType === USER_TYPES.DEPENDENT) return;

    const state = getState();
    const { phone } = state[userType].household;

    if (phone) {
      // Save phone number to household info and sync crm
      await dispatch(patchHouseholdContact(userType));
      dispatch(doCrmSyncUpsertContactAndDeal(userType));
    }
  };
});

export function handleSubmitCellPhone() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      await dispatch(_handleSaveAndSyncCellPhone());
      dispatch(nextQuestion());
    }, dispatch)();
  };
}

export function handleSubmitFinances() {
  return (dispatch, getState) => {
    // HD is always eligible for finances
    const eligible = true;
    dispatch(nextQuestion());
    return Promise.resolve(eligible);
  };
}

export const acceptMaxEligibleCoverageAndNext = () => {
  return async (dispatch, getState) => {
    await dispatch(_acceptMaxEligibleCoverageAndNext());
    if (isJoint(getState())) {
      return dispatch(push(ROUTES.APPLICATION_PRIMARY_TRANSITION));
    }
    return dispatch(handleBeginDisclosure());
  };
};

export const _acceptMaxEligibleCoverageAndNext = allUsers((userType) => {
  return (dispatch, getState) => {
    const mainProduct = getMainProduct(getState(), userType);
    dispatch(replaceUserQuotesWithMaxCovQuotes(userType, mainProduct));
    const maxCov = getJointMaxEligibilityCI(getState());
    dispatch(makeUpdateProductSessionProp(userType, mainProduct)('override_amt', maxCov));
    return withLoading(async () => {
      await dispatch(makePatchProductSessionRecord(userType, mainProduct));
      await dispatch(makePatchProductAppRecord(userType, mainProduct));
      // note we can't do sync for secondary because
      // we don't have their email to sync to hubspot at this step
      if (userType === USER_TYPES.PRIMARY) {
        dispatch(doCrmSyncUpsertContactAndDeal(userType));
      }
    }, dispatch)();
  };
});

export function handlePartnerEmailVerifyAndNext() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      try {
        await dispatch(verifyEmail(USER_TYPES.SECONDARY));
        await dispatch(checkLoginStatus(USER_TYPES.SECONDARY));
      } catch (error) {
        return Promise.reject(error);
      }
      const state = getState();

      const mainProduct = getMainProduct(state, USER_TYPES.SECONDARY);
      const app_id = state[USER_TYPES.SECONDARY].session[`${mainProduct}_application_id`];

      const {
        [USER_TYPES.SECONDARY]: {
          household: { email },
        },
      } = state;

      const payload = {
        email,
      };

      const resp = await withErrorModalOnFail(updatePartnerPlaceholderEmail, dispatch)(
        app_id, payload,
      );

      if (flagsmithIsFlagEnabled(FLAGSMITH_FLAGS.PM_ENABLE_ACCOUNT_ID_VERSION)) {
        dispatch(updateSessionPropSecondary('account_id', resp.account_id));
        dispatch(updateSessionPropSecondary('user_id', resp.user_id));
        const inProgressPolicies = await withErrorModalOnFail(getAllInProgressPolicies, dispatch)(
          resp.account_id, productPrefixToProductType(mainProduct), false,
        );
        if (inProgressPolicies) {
          const closePolicyPayload = { product: productPrefixToProductType(mainProduct) };
          await withErrorModalOnFail(closeInProgressPoliciesForAccount, dispatch)(closePolicyPayload, resp.account_id, false);
          dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));
        }
      } 
      else {
        dispatch(updateSessionPropSecondary('user_id', resp.user_id));
        dispatch(updateSessionPropSecondary('account_id', resp.account_id));
        const inProgressPolicies = await withErrorModalOnFail(getInProgressPolicies, dispatch)(
          resp.user_id, productPrefixToProductType(mainProduct), false,
        );
        if (inProgressPolicies) {
          const closePolicyPayload = { product: productPrefixToProductType(mainProduct) };
          await withErrorModalOnFail(closeInProgressPolicies, dispatch)(closePolicyPayload, resp.user_id, false);
          dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));
        }
      }

      const partnerPhoneDetails = await withErrorModalOnFail(checkPhoneNumberExists, dispatch)(app_id);
      if (partnerPhoneDetails.phone) {
        await dispatch(makeUpdateHouseholdProp(USER_TYPES.SECONDARY)('phone', partnerPhoneDetails.phone));
        await dispatch(makeUpdateMetadata(USER_TYPES.SECONDARY)('hasPreExistingPhoneNumber', true));
      }

      return dispatch(nextQuestion());
    }, dispatch)();
  };
}

export function handleReferrerNextSteps() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      const mainProduct = getMainProduct(getState(), USER_TYPES.PRIMARY);
      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        await dispatch(handleUserReferrerSteps(USER_TYPES.PRIMARY));
      } else {
        await dispatch(handleReferrerSteps());
      }
      return dispatch(nextQuestion());
    }, dispatch)();
  };
}

export function handleInterestNextSteps(val) {
  const interest = val.join(';');
  return async (dispatch, getState) => {
    return withLoading(async () => {
      dispatch(updateMetadata('productInterest', interest));
      const payload = { product_interest: interest };
      const mainProduct = getMainProduct(getState(), USER_TYPES.PRIMARY);
      await dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));

      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        await dispatch(handleUserReferrerSteps(USER_TYPES.PRIMARY));
      } else {
        await dispatch(handleReferrerSteps());
      }

      return dispatch(nextQuestion());
    }, dispatch)();
  };
}

export const handleUserReferrerSteps = (userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const availableProducts = state.userControl.availableProducts;
    return withLoading(async () => {
      await dispatch(
        patchHouseholdByVal(userType, {
          user: {
            phone: state[userType].household.phone,
            email: state[userType].household.email,
          },
        }),
      );
      await dispatch(doCrmSyncReferrer(userType)); // sync referrer stuff, don't wait for response
      const isLoggedIn = await dispatch(checkLoginStatus());
      const is_backdoor = (jsCookie.get('backdoor_flag') === 'true'
        && isLoggedIn
        && jsCookie.get('portal_owner_id') !== undefined);
      if (is_backdoor) {
        const payload = {
          [CRM_LIFE_SESSION_FIELDS.ADVISOR_SUBMISSION_FLAG]: 'Y',
        };
        const portalOwnerId = jsCookie.get('portal_owner_id');
        if (portalOwnerId !== 'None') {
          payload[CRM_LIFE_SESSION_FIELDS.DEDICATED_CS_REPRESENTATIVE] = portalOwnerId;
        }
        dispatch(doCrmSyncUpsertContactAndDeal(userType, payload));
      }
    }, dispatch)();
  };
};

export const handleReferrerSteps = allUsers(handleUserReferrerSteps);

export function handleConsentNextSteps() {
  return (dispatch, getState) => {
    const state = getState();
    const userType = state.userControl.dashboardUser;
    dispatch(updateMetadata('decisionHasBeenMade', true));
    if (canSkipDecisionPage(state)) {
      // Moving straight from Consent to Approved flow, so need to handle approved steps
      dispatch(handleApprovedSteps(userType));
    }
    return dispatch(nextQuestion());
  };
}

export function handleSubmitAuthorization() {
  return async (dispatch, getState) => {
    const state = getState();
    const mainProduct = getMainProduct(state, USER_TYPES.PRIMARY);
    let productPrefix = getMainProductEventPrefix(state, USER_TYPES.PRIMARY);

    if (mainProduct === PM_PRODUCT_PREFIX.HD) {
      await dispatch(submitHDApp());
    } else {
      await dispatch(_handleSubmitAuthorization());
      // remove eligibility logs from session storage once eligibility data is  sent to backend
      sessionStorage.removeItem(SESSION_STORAGE_LOGGING.ELIGIBILITY_LOGS);
    }
    const isLoggedIn = await dispatch(checkLoginStatus());
    const is_backdoor = (jsCookie.get('backdoor_flag') === 'true'
      && isLoggedIn
      && jsCookie.get('portal_owner_id') !== undefined
      && jsCookie.get('portal_owner_id') !== 'None');

    if (!is_backdoor) {
      await dispatch(_handlePostGenerateAdvisor());
    }

    dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));
    dispatch(updateMetadata('isAppSubmitComplete', true));
    // APP_SUBMITTED is POLICY_CREATED in Impact
    dispatch(trackConversion(CONVERSION_TYPES.APP_SUBMITTED));
    let ret = dispatch(updateMetadata('isMakingDecisionRequests', false));
    if (!isJoint(getState()) || mainProduct === PM_PRODUCT_PREFIX.HD) {
      dispatch(updateMetadata('decisionHasBeenMade', true));
    }
    return ret;
  };
}

const _handleSubmitAuthorization = allUsersParallel((userType) => {
  return async (dispatch, getState) => {
    return dispatch(submitApp(userType));
  };
});

const _handlePostGenerateAdvisor = () => {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const product = getMainProduct(state, USER_TYPES.PRIMARY);
      const app_id = state[USER_TYPES.PRIMARY].session[`${product}_application_id`];
      const payload = {
        app_id,
        is_homeowner: false, // HD-only webapp — no Life product
      };
      const { advisor_id, advisor_full_name } = await postGenerateAdvisor(payload);
      dispatch(updateMetadata('advisor_id', advisor_id || ''));
      dispatch(updateMetadata('advisor_full_name', advisor_full_name || ''));
    } catch (error) {
      sentryError(error);
    }
  };
};

export function handleBeginDisclosure() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      await dispatch(handleTemporarySept2025Promo());
      await dispatch(_handleBeginDisclosure());
      return dispatch(goToFirstDisclosure());
    }, dispatch)();
  };
}

export const _handleBeginDisclosure = allUsers((userType, key) => {
  return async (dispatch, getState) => {
    await dispatch(initializeAuraDisclosure(key || userType));
  };
});

export function handleSubmitDisclosure() {
  return async (dispatch, getState) => {
    const state = getState();
    const userType = getCurrentDisclosureUserType(state);
    await dispatch(submitDisclosureAnswer(userType));
    await dispatch(getNextAuraDisclosure(userType));
    dispatch(updateDisclosureAnswered(userType, getCurrentDisclosureID(getState())));
    return dispatch(_nextDisclosureQuestion(userType));
  };
}

export function handleUnknownDisclosure() {
  return async (dispatch, getState) => {
    const state = getState();
    const userKey = getCurrentDisclosureUserType(state);
    const [userType, key] = transformUserKey(userKey);
    await dispatch(unknownCurrentDisclosure(userType));
    await dispatch(getNextAuraDisclosure(userType));
    return dispatch(_nextDisclosureQuestion(userType));
  };
}

/**
 * Used to determine if we need to switch to the primary user, if we can continue with the next Dependent
 * @param state
 * @param currentUser
 * @returns {*|string}
 * @private
 */
const _handleDependents = (state, currentUser) => {
  if (isDependentDisclosureExhausted(state, currentUser, getCurrentBaseDisclosureID(state, currentUser))) {
    return USER_TYPES.PRIMARY;
  }
  return retrieveNextDependentKeySupportingCurrentDisclosure(state, currentUser, getCurrentBaseDisclosureID(state, currentUser));
};

/**
 * Used to determine what user we need to switch to if we are switching to a new users base question
 */
const getNextQuestionUserKey = (currentUser, state) => {
  const hasPartner = isJoint(state);
  const hasDeps = hasDependents(state);

  const isSecondaryAndHasDependents = currentUser === USER_TYPES.SECONDARY && hasDeps;
  const isSecondaryAndDoesNotHaveDependents = currentUser === USER_TYPES.SECONDARY && !hasDeps;
  const isPrimaryAndHasDependents = currentUser === USER_TYPES.PRIMARY && hasDeps;
  const isPrimaryAndHasPartner = currentUser === USER_TYPES.PRIMARY && hasPartner;

  if (isSecondaryAndHasDependents) {
    return _handleDependents(state, currentUser);
  }
  if (isSecondaryAndDoesNotHaveDependents) {
    return USER_TYPES.PRIMARY;
  }
  if (isPrimaryAndHasPartner) {
    return USER_TYPES.SECONDARY;
  }
  if (isPrimaryAndHasDependents) {
    return _handleDependents(state, currentUser);
  }
  if (hasDeps) {
    return _handleDependents(state, currentUser);
  }
  return USER_TYPES.PRIMARY;
};

const isDependentDisclosureExhausted = (state, userKey, currentDisclosureId) => {
  const doesHaveValidNextKey = retrieveNextDependentKeySupportingCurrentDisclosure(state, userKey, currentDisclosureId);
  return doesHaveValidNextKey === undefined;
};

const retrieveNextDependentKeySupportingCurrentDisclosure = (state, userKey, currentDisclosureId) => {
  const dependentKeys = state.dependents.dependent_keys;
  const dependentsObj = state.dependents.dependents;

  const retrieveNextDependentQuestions = (nextDependentIndex) => {
    const nextDependentSections = dependentsObj[dependentKeys[nextDependentIndex]].disclosure.sections;
    return nextDependentSections.map(section => section.question_ids).flat(Infinity);
  };

  const retrieveNextDependentOrder = (nextDependentIndex) => {
    return dependentsObj[dependentKeys[nextDependentIndex]].disclosure.order;
  };

  // const isNextDependentAnAdult = (nextDependentIndex) => {
  //   const dob = dependentsObj[dependentKeys[nextDependentIndex]].household.birthdate;
  //   return calcAgeNearest(dob) >= 18;
  // };

  for (let nextDependentIndex = dependentKeys.indexOf(userKey) + 1; nextDependentIndex < dependentKeys.length; nextDependentIndex++) {
    const questions = retrieveNextDependentQuestions(nextDependentIndex);
    const order = retrieveNextDependentOrder(nextDependentIndex);
    const isDisclosureInNextDependent = questions.includes(currentDisclosureId) || order.includes(currentDisclosureId);
    // const isAdult = isNextDependentAnAdult(nextDependentIndex);
    // if (isDisclosureInNextDependent || isAdult) {
    if (isDisclosureInNextDependent) {
      return dependentKeys[nextDependentIndex];
    }
  }
  return undefined;
};

const _dispatchNextUserKeyDisclosureRoute = (userType, state, disclosureId, dispatch) => {
  const nextUser = getNextQuestionUserKey(userType, state);
  const nextDisclosureRoute = getDisclosureRoute(nextUser, disclosureId);
  return dispatch(push(nextDisclosureRoute));
};

const _retrieveDisclosureId = (state, isSecondaryAndDoesNotHaveDependents, isSecondaryAndHasDependents, isDependent, isDependentsExhausted) => {
  const isDependentsNotExhausted = !isDependentsExhausted;

  if (isSecondaryAndDoesNotHaveDependents) {
    return getNextDisclosureID(state, USER_TYPES.SECONDARY);
  }

  if (isSecondaryAndHasDependents) {
    return getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
  }

  if (isDependentsExhausted) {
    return getNextDisclosureID(state, USER_TYPES.PRIMARY);
  }

  if (isDependentsNotExhausted) {
    return getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
  }
  return getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
};

const _shouldHandleReferrerSteps = (state, pathName) => {
  return pathName === ROUTES.APPLICATION_CONSENT
    && isMortgageBroker(state)
    && !isJoint(state)
    && hasValue(state.primary.household.phone)
    && hasValue(state.metadata.user_lead_source);
};

export function _nextDisclosureQuestion(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const isPrimary = userType === USER_TYPES.PRIMARY;
    const isSecondary = userType === USER_TYPES.SECONDARY;
    const isDependent = transformUserKey(userType)[0] === USER_TYPES.DEPENDENT;

    const hasPartner = state.userControl.hasPartnerApplication;
    const hasDeps = hasDependents(state);

    let disclosureId;

    if (hasPartner || hasDeps) {
      if (isNextDisclosureABaseDisclosure(state, userType)) {
        if (isSecondary && !hasDeps) {
          disclosureId = getNextDisclosureID(state, USER_TYPES.SECONDARY);
        } else if (isSecondary && hasDeps) {
          if (isDependentDisclosureExhausted(state, userType, getCurrentBaseDisclosureID(state, userType))) {
            disclosureId = getNextDisclosureID(state, userType);
          } else {
            disclosureId = getCurrentBaseDisclosureID(state, USER_TYPES.SECONDARY);
          }
        } else if (isDependent) {
          if (isDependentDisclosureExhausted(state, userType, getCurrentBaseDisclosureID(state, userType))) {
            disclosureId = getNextDisclosureID(state, userType);
          } else {
            disclosureId = getCurrentBaseDisclosureID(state, userType);
          }
        } else if (isPrimary && hasPartner) {
          disclosureId = getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
        } else if (isPrimary && !hasPartner && hasDeps) {
          if (isDependentDisclosureExhausted(state, userType, getCurrentBaseDisclosureID(state, userType))) {
            disclosureId = getNextDisclosureID(state, userType);
          } else {
            disclosureId = getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
          }
        } else {
          disclosureId = getNextDisclosureID(state, userType);
        }
        return _dispatchNextUserKeyDisclosureRoute(userType, state, disclosureId, dispatch);
      } else if (isLastDisclosureID(state, userType)) {
        if (isPrimary) {
          // Go to the last secondary base disclosure
          disclosureId = getCurrentBaseDisclosureID(state, USER_TYPES.PRIMARY);
          return _dispatchNextUserKeyDisclosureRoute(userType, state, disclosureId, dispatch);
        } else if (isSecondary && hasDeps) {
          disclosureId = getCurrentBaseDisclosureID(state, USER_TYPES.SECONDARY);
          return _dispatchNextUserKeyDisclosureRoute(userType, state, disclosureId, dispatch);
        } else if (isDependent) {
          if (!isDependentDisclosureExhausted(state, userType, getCurrentBaseDisclosureID(state, userType))) {
            disclosureId = getCurrentBaseDisclosureID(state, userType);
            return _dispatchNextUserKeyDisclosureRoute(userType, state, disclosureId, dispatch);
          }
        }
      }
    }

    const pathName = getDisclosureNextQuestionPathName(state, userType);

    if (_shouldHandleReferrerSteps(state, pathName)) {
      dispatch(handleReferrerSteps());
    }

    return dispatch(push(pathName));
  };
}

export const handleApprovedSteps = (userType) => {
  return (dispatch, getState) => {
    // Set this so we know if we can use goBack()
    dispatch(updateMetadata('hasLocalHistory', true));
    dispatch(updateMetadata('isPostDecision', true));
    if (hasFreeMonthsDiscount(getState(), userType, PM_PRODUCT_PREFIX.HD) ||
      PM_ENABLE_DEFAULT_MONTHLY_PAYMENT === '1') {
      // Skip select payment frequency page and go to payment form page if X months off discount is applied
      dispatch(makeUpdatePaymentDetails(userType)('planType', PLAN_TYPES.MONTHLY));
    }
  };
};

export const handleApprovedStepsPage = (userType) => {
  return (dispatch, getState) => {
    dispatch(handleApprovedSteps(userType));
    dispatch(nextQuestion());
  };
};

export function handleChooseMyOwnBeneficiaries() {
  return (dispatch, getState) => {
    dispatch(push(
      getRouteWithUserType(ROUTES.APPLICATION_PRIMARY_BENEFICIARIES, USER_TYPES.PRIMARY),
    ));
  };
}

export const pushPostAddonsRoute = (userType) => {
  return (dispatch, getState) => {
    return dispatch(push(
      getRouteWithUserType(`${ROUTES.APPROVED_REVIEW_ESIGN_POLICY}`, userType),
    ));
  };
};

export const navigateToSecondaryBeneficiaryPreDecision = (isSelected) => {
  return (dispatch, getState) => {
    dispatch(nextQuestion());
  };
};

function _handleAddonsCompleted(userType) {
  return async (dispatch, getState) => {
    // No-op: Life addon logic not applicable to HD-only webapp
  };
}

export function handleCIAddon(userType) {
  return async (dispatch, getState) => {
    // No-op: CI addon logic not applicable to HD-only webapp
  };
}

export function handleDocusignOpen(
  userType = USER_TYPES.PRIMARY,
  product = PM_PRODUCT_PREFIX.HD,
) {
  return async (dispatch, getState) => {
    const { docusignUrlStatus } = getState().metadata;

    if (docusignUrlStatus === DOCUSIGN_URL_STATUS.READY) {
      return dispatch(openDocusignEnvelope(userType));
    } else if (docusignUrlStatus === DOCUSIGN_URL_STATUS.PENDING) {
      // not sure what to do here
    }
    return dispatch(getDocusignEnvelopeAndOpen(userType, product,
      DOCUSIGN_SOURCE_TYPE.LIFE_POLICY));
  };
}

export function handleDocusignCallback(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const { productDocusign } = state.metadata;
    dispatch(updateMetadata('isPostDecision', true));
    await dispatch(authGetUserInfo());
    const app_id = jsCookie.get('app_id');

    const isLoggedIn = await dispatch(checkLoginStatus());
    if (!app_id || !isLoggedIn) {
      return dispatch(replace(ROUTES.GETTING_STARTED));
    }
    await dispatch(postDocusignResults(userType, productDocusign));
    return dispatch(doCrmSyncUpsertContactAndDeal(userType));
  };
}

export function handlePostDocusignRouting(userType) {
  return (dispatch, getState) => {
    const state = getState();
    // Set this so we know if we can use goBack()
    dispatch(updateMetadata('hasLocalHistory', true));
    if (isSigningComplete(state, userType)) {
      return dispatch(push(getRouteWithUserType(ROUTES.APPROVED_PAYMENT_FORM, userType)));
    }
    return dispatch(replace(
      getRouteWithUserType(`${ROUTES.APPROVED_REVIEW_ESIGN_POLICY}`, userType),
    ));
  };
}

export function handleDocusignPolicyDownloadCallback(userType) {
  return async (dispatch, getState) => {
    await dispatch(authGetUserInfo());
    return dispatch(replace(
      getRouteWithUserType(`${ROUTES.POLICY_DOWNLOAD_DOWNLOAD_PAGE}`, userType),
    ));
  };
}

export function handlePaymentPlans(userType) {
  return async (dispatch, getState) => {
    dispatch(push(getRouteWithUserType(ROUTES.APPROVED_PAYMENT_FORM, userType)));
  };
}

export function handlePaymentForm(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    if (isHDOptedIn(state, userType)) {
      // INFO: wait for HBM enrollment but don't block customer on failure
      try {
        await dispatch(handleHbmEnrollment());
      } catch (error) {
        sentryError(error);
      }

      await dispatch(navigateToProcessingPayment());
    }
    // Verify if cardholder name matches either the user or the partner
    const cardholderName = state[userType].payment.cardFirstName + state[userType].payment.cardLastName;
    const allUserNames = Object.values(USER_TYPES).map((u) => {
      if (u === USER_TYPES.DEPENDENT) {
        return null;
      }
      return state[u].household.firstName.toLowerCase() + state[u].household.lastName.toLowerCase();
    });
    const payload = {
      [CRM_LIFE_SESSION_FIELDS.CARDHOLDER_NAME_MATCH]:
        allUserNames.includes(cardholderName.toLowerCase()) ? 'Y' : 'N',
    };
    await dispatch(doCrmSyncPatchDealAllProducts(userType, payload));
  };
}

export function syncPaymentReceived(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const mainProduct = getMainProduct(state, userType);
    dispatch(makeUpdateProductPolicyProp(userType,
      mainProduct)('payment_initial_completed', true));
    dispatch(makeUpdateProductPolicyProp(userType,
      mainProduct)('payment_recurring_completed', true));
    // Run verification only after updating state that payment is completed
    // without payment complete state update, if user goes back fast enough,
    // they can access the payment form again
    await dispatch(backgroundIdVerificationCheck(userType));
    dispatch(doCrmSyncUpsertContactAndDeal(userType)); // sync id verification + payment changes
  };
}

export function handlePaymentReceived(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    isAppProductAdded(state, userType, PM_PRODUCT_PREFIX.HD) && dispatch(isPMEnvironment() ? sendSegmentTrackEvent(SEGMENT_EVENTS.PAYMENT_RECEIVED, userType, PM_PRODUCT_PREFIX.HD) :
    sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.PAYMENT_RECEIVED, userType, PM_PRODUCT_PREFIX.HD)),
    await dispatch(push(getRouteWithUserType(ROUTES.APPROVED_THANK_YOU, userType)));
    // Need to occur at the end so blocker page doesn't get triggered
    dispatch(syncPaymentReceived(userType)); // sync id verification + payment changes
  };
}

export function openNoMedicalPowerForm() {
  const url = `${DOCUSIGN_NO_MEDICAL_POWERFORM_URL}`;
  typeof window !== 'undefined' && window.open(url, '_blank');
}

export function handlePendingPoliciesFlag(val) {
  return (dispatch, getState) => {
    return dispatch(updateExistingPolicyFlags('hasPendingPolicies', val));
  };
}

export function handlePendingPoliciesKeepingFlag(val) {
  return (dispatch, getState) => {
    return dispatch(updateExistingPolicyFlags('existingPoliciesPendingKeepingFlag', val));
  };
}

export function handleExistingPoliciesFlag(val) {
  return (dispatch, getState) => {
    return dispatch(updateExistingPolicyFlags('hasExistingPolicies', val));
  };
}

// TODO: This is added because of JOINT_CONTEXT_IMPROVEMENTS
// Please remove or refactor once this ab test closes
export function handleRedirectToStartApp() {
  return (dispatch, getState) => {
    dispatch(replace(ROUTES.START_APP));
  };
}

export function handleSubmitFamilyComposition(mainProduct) {
  return (dispatch, getState) => {
    const state = getState();
    let family_composition = state.primary.household.user_family_composition;
    dispatch(saveUserFamilyCompositionCookies(family_composition));

    // Only add HD into availableProducts if it's main and enabled by env variable
    // TODO: review this logic once cross-sale is implemented
    if (mainProduct === PM_PRODUCT_PREFIX.HD && isHDEnabled()) {
      dispatch(updateUserControlProp('availableProducts', [PM_PRODUCT_PREFIX.HD]));
    }

    return dispatch(nextQuestion());
  };
}

export function handleSubmitUserIntent(val: String[], mainProduct: string) {
  const intents = val.join(' | ');
  return (dispatch) => {
    dispatch(updateMetadata('userIntent', intents));
    return dispatch(nextQuestion());
  };
}

export function submitQuotesCompareSubmission() {
  return (dispatch, getState) => {
    dispatch(saveHouseholdCookies());
    return dispatch(nextQuestion());
  };
}

export function submitQuotesCopilotPartnerInfoSubmission() {
  return (dispatch, getState) => {
    dispatch(saveHouseholdCookies());
  };
}

export function handleSelectFamilyComposition(val, setHasKids = true) {
  return (dispatch) => {
    dispatch(updateHouseholdPropAll('user_family_composition', FAMILY_DATA_VALUE[val].enum_value));
    const hasPartner = FAMILY_REDUCER_MAPPING[val].hasPartner;
    const hasKids = FAMILY_REDUCER_MAPPING[val].hasKids;
    if (PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS === '1' && isCAAEnvironment()) {
      if (hasPartner || hasKids) {
        dispatch(addQuotesDiscount(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)(
          DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
        ));
        dispatch(addQuotesDiscount(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)(
          DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
        ));
      } else {
        dispatch(removeQuotesDiscount(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)(
          DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
        ));
        dispatch(removeQuotesDiscount(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)(
          DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
        ));
      }
    }
    dispatch(updateHasPartnerApplication(hasPartner));
    // when this function is called from life/ci input quotes page
    // we do not ask for kids info, so assuming here the value to be true or false
    // is not correct, hence not seeting it.
    if (setHasKids) {
      dispatch(updateHouseholdPropAll('hasKids', hasKids));
    }
    dispatch(updateAllUserSessionPropAllProducts(
      'selected_quote_type',
      hasPartner ? QUOTE_TYPES.JOINT : QUOTE_TYPES.PRIMARY,
    ));
  };
}

export function handleHasDoneBloodUrineHeightAndWeight(val, hasPartner) {
  return (dispatch, getState) => {
    dispatch(updateJointMetadata('has_done_blood_urine_height_weight', val));
    if (hasPartner) {
      if (!val) { // reset case the true option is handled by checkboxes in page
        dispatch(updateHDAppPropertyPrimary('aura_recent_labs_and_vitals_disclosure', val));
        dispatch(updateHDAppPropertySecondary('aura_recent_labs_and_vitals_disclosure', val));
      }
    } else {
      dispatch(updateHDAppPropertyPrimary('aura_recent_labs_and_vitals_disclosure', val));
    }
  };
}

export function submitApp(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const mainProduct = getMainProduct(state, userType);
    const digital_consent_status = showDigitalConsentPage(state) ?
      DIGITAL_CONSENT_STATUS.PENDING : DIGITAL_CONSENT_STATUS.INACTIVE;
    try {
      dispatch(updateMetadata('isMakingDecisionRequests', true));
      await dispatch(checkProductEligibilityWithBackend(userType, { includeSili: false }));
      // runs for both users if joint app
      await dispatch(createPolicyIdRecord(userType));
      dispatch(makeUpdateProductPolicyProp(userType, mainProduct)('digital_consent_status', digital_consent_status));
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.APPLICATION_SUBMITTED, userType));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.APPLICATION_SUBMITTED, userType));
      }
      // start aura calculations
      await dispatch(createAuraAuthenticationRecord(userType));
      await dispatch(startAuraDecisionCalc(userType));
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.DECISION_RECEIVED, userType));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.DECISION_RECEIVED, userType));
      }
      await dispatch(startAuraOverallDecisionCalc(userType));

      await dispatch(doCrmSyncUpsertContactAndDeal(userType)); // sync changes after overall decision
      await dispatch(updateUserControlProp('dashboardUser', getState().userControl.currentUser));
      return dispatch(updateMetadata('isComingFromConsentPage', true)); // needed to activate confetti
    } catch (error) {
      console.log(error);
      sentryError(error);
      return dispatch(makeUpdateDecisionProp(userType, PM_PRODUCT_PREFIX.HD)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'Y'));
    }
  };
}

export function submitHDApp() {
  return async (dispatch, getState) => {
    try {
      dispatch(updateMetadata('isMakingDecisionRequests', true));
      // Create a single policy id record
      await dispatch(createPolicyIdRecord(USER_TYPES.PRIMARY));
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.APPLICATION_SUBMITTED));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.APPLICATION_SUBMITTED));
      }

      // Create aura_authorization record
      await dispatch(createAuraAuthenticationRecord(USER_TYPES.PRIMARY));

      // Calculate decision for each family member (primary, secondary and dependents)
      await dispatch(startAuraHDDecisionCalc());
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.DECISION_RECEIVED));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.DECISION_RECEIVED));
      }

      // Calculate overall decision for the family
      await dispatch(startAuraOverallDecisionCalc(USER_TYPES.PRIMARY));

      await dispatch(updateUserControlProp('dashboardUser', getState().userControl.currentUser));
      return dispatch(updateMetadata('isComingFromConsentPage', true)); // needed to activate confetti
    } catch (error) {
      sentryError(error);
      return dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'Y'));
    }
  };
}

export function handleDecisionIsMade() {
  return (dispatch, getState) => {
    const state = getState();
    const isHD = getMainProduct(state, USER_TYPES.PRIMARY) === PM_PRODUCT_PREFIX.HD;
    const {
      isMakingDecisionRequests,
    } = state.metadata;
    // if there's ongoing requests, have them wait on the consent page
    if (isMakingDecisionRequests) {
      return dispatch(push(ROUTES.APPLICATION_CONSENT));
    }
    if (isHD && (isGIProduct(state) || isPortableCoverageProduct(state))) {
      return dispatch(push(getRouteWithUserType(ROUTES.APPROVED_EFFECTIVE_DATE, USER_TYPES.PRIMARY)));
    }

    return dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
  };
}

export function handleEffectiveDate(effectiveDate) {
  return (dispatch, getState) => {
    dispatch(makeUpdateProductPolicyProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('effective_date', effectiveDate));
  };
}

export function handlePolicyIsSetup() {
  return (dispatch, getState) => {
    const state = getState();
    return dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
  };
}

export const handleUpdateCIQuotes = (
  userType,
  selectedTerm,
  selectedCoverage,
  individualQuote,
) => {
  return async (dispatch, getState) => {
    // No-op: CI quotes not applicable to HD-only webapp
  };
};

export function handleAppOptedUpdate(userType, product, opted) {
  return async (dispatch, getState) => {
    await dispatch(updateProductAdded(opted, userType, product));
    return dispatch(doCrmSyncUpsertContactAndDeal(userType));
  };
}

export function handleStartNewApp() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      const state = getState();
      const loggedInUser = isLoggedInUser(state);
      if (loggedInUser) {
        await dispatch(authGetUserInfo());
      }
      const mainProduct = getMainProduct(state, USER_TYPES.PRIMARY);
      const email = state.primary.household.email;
      const closePolicyPayload = { email, product: productPrefixToProductType(mainProduct) };
      if (flagsmithIsFlagEnabled(FLAGSMITH_FLAGS.PM_ENABLE_ACCOUNT_ID_VERSION)) {
        const account_id = state.primary.session.account_id;
        await withErrorModalOnFail(closeInProgressPoliciesForAccount, dispatch)(closePolicyPayload, account_id, false);
      }
      else {
        const user_id = state.primary.session.user_id;
        await withErrorModalOnFail(closeInProgressPolicies, dispatch)(closePolicyPayload, user_id, false);
      }
      await dispatch(updateMetadata('hasInProgressPolicy', ''));
      dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));
    }, dispatch)();
  };
}

export function handleKeepPreviousApp(url) {
  return () => {
    window.location.href = url;
  };
}

export const handleSendVerificationEmail = () => {
  return async (dispatch, getState) => {
    const { closePolicyFlag } = getState().metadata;
    const mainProduct = getMainProduct(getState(), USER_TYPES.PRIMARY);
    const app_id = getState().primary.session[`${mainProduct}_application_id`];
    // delete backdoor cookie when user logins with authentication
    jsCookie.remove('backdoor_flag', { domain: getCookieDomain() });
    const ret = await withErrorModalOnFail(sendVerificationAuth0Email, dispatch)(
      app_id,
      closePolicyFlag,
    );
    // User has reached retry limit
    if (!ret.success && ret.max_attempt_reached) {
      dispatch(replace(getRouteWithErrorType(ROUTES.VERIFICATION_ERROR, VERIFICATION_ERROR_TYPE.MAX_RETRIES)));
    }
    // if return value contains callback,
    // it means we skip magic link process, we mock the callbackurl that Twilio is supposed to send us
    if (ret.callback_url) {
      dispatch(disableBeforeUnload());
      // need to update this here because replace doesn't trigger parseQueryParam
      dispatch(updateSessionPropPrimary('twilio_token', 'dummytoken'));
      if (PM_SKIP_MAGIC_LINK === '1') {
        // When skipping magic link locally, use client-side navigation to preserve Redux state
        // instead of window.location.replace which causes a full page reload and loses all state
        dispatch(replace(ret.callback_url));
      } else {
        // replaced with window.href to refresh the page
        // see https://policyme.atlassian.net/browse/CORE-1671
        window.location.replace(`${getUrls().homepage}${GLOBAL_ROUTE}${ret.callback_url}`);
      }
    }
    return Promise.resolve(ret);
  };
};

/**
 *
 * This function is used to redirect the user to the social sign on link on auth0
 */
export const handleRedirectToSocialSignOnLink = () => {
  return async (dispatch, getState) => {
    const mainProduct = getMainProduct(getState(), USER_TYPES.PRIMARY);
    const app_id = getState().primary.session[`${mainProduct}_application_id`];
    jsCookie.remove('backdoor_flag', { domain: getCookieDomain() });
    // disable before unload so prompt doesn't show up when user clicks on social sign on link
    dispatch(disableBeforeUnload());
    const socialSignOnUrl = getSocialSignOnUrl(getState().metadata.login_method, app_id);
    window.location.href = socialSignOnUrl;
  };
};

export const handleSkipEmailMagicLink = () => {
  return accountIdWrapper(handleSkipEmailMagicLinkUserId, handleSkipEmailMagicLinkAccountId);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleSkipEmailMagicLinkAccountId} instead
 */
const handleSkipEmailMagicLinkUserId = () => {
  return async (dispatch, getState) => {
    // Magic link callback param uses primary app id as temporary app id.
    // it will get corrected after rehydration logic.     dispatch(enableBeforeUnload());
    // 🚨🚨🚨  We are going to depricate this method after we remove feature flag of auth0 🚨🚨🚨
    // 🚨🚨🚨 Please also modify handleVerifyAuth0EmailMagicLink function if you modify this function 🚨🚨🚨
    const { hd_application_id, twilio_token: code } = getState().primary.session;
    const temp_app_id = hd_application_id;
    const ret = await withErrorModalOnFail(verifyEmailMagicLink, dispatch)(
      code, temp_app_id,
    );
    await dispatch(updateHouseholdPropPrimary('email', ret.email));
    if (ret.success) {
      await dispatch(updateUserId(ret.user_id, USER_TYPES.PRIMARY));
      await dispatch(updateAccountId(ret.account_id, USER_TYPES.PRIMARY));
      await dispatch(authGetUserInfo());
      const mainProduct = getMainProduct(getState(), getState().userControl.currentUser);
      const today_epoch = Date.now(); // UNIX formatted timestamps in milliseconds (epoch)
      const contactPayload = {
        [CRM_CONTACT_FIELDS.LAST_LOGIN_DATE]: today_epoch,
      };
      // patch Magic Link Verification for main product deal
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.MAGIC_LINK_VERIFICATION]: 'Y',
      };
      dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));
      dispatch(doCrmSyncPatchContact(USER_TYPES.PRIMARY, mainProduct, contactPayload));
      const user_id = ret.user_id;
      let hasInProgressPolicy = await withErrorModalOnFail(getInProgressPolicies, dispatch)(
        user_id, productPrefixToProductType(mainProduct), false,
      );
      if (hasInProgressPolicy) {
        await dispatch(updateMetadata('hasInProgressPolicy', hasInProgressPolicy));
        return dispatch(push(ROUTES.KEEP_EXISTING_APP));
      }
      await dispatch(handleSaveUserConsent(user_id));
      // if no existing policy in BE then clear redux store
      await dispatch(updateMetadata('hasInProgressPolicy', ''));
      dispatch(sendSegmentIdentifyEvent(ret.user_id));
      console.log('Magic Link Verification Success >>>>>>>>');
      dispatch(nextQuestion());
    } else {
      console.log('Magic Link Verification Failed >>>>>>>>');
      if ('application_language' in ret) {
        dispatch(makeUpdateHouseholdProp(USER_TYPES.PRIMARY)('application_language', ret.application_language));
      }
      dispatch(replace(getRouteWithErrorType(ROUTES.VERIFICATION_ERROR, VERIFICATION_ERROR_TYPE.EXPIRED)));
    }
    return Promise.resolve(ret);
  };
};

const handleSkipEmailMagicLinkAccountId = () => {
  return async (dispatch, getState) => {
    // Magic link callback param uses primary app id as temporary app id.
    // it will get corrected after rehydration logic.     dispatch(enableBeforeUnload());
    // 🚨🚨🚨  We are going to depricate this method after we remove feature flag of auth0 🚨🚨🚨
    // 🚨🚨🚨 Please also modify handleVerifyAuth0EmailMagicLink function if you modify this function 🚨🚨🚨
    const { hd_application_id, twilio_token: code } = getState().primary.session;
    const temp_app_id = hd_application_id;
    const ret = await withErrorModalOnFail(verifyEmailMagicLinkAccountId, dispatch)(
      code, temp_app_id,
    );
    await dispatch(updateHouseholdPropPrimary('email', ret.email));
    if (ret.success) {
      await dispatch(updateUserId(ret.user_id, USER_TYPES.PRIMARY));
      await dispatch(updateAccountId(ret.account_id, USER_TYPES.PRIMARY));
      await dispatch(authGetUserInfo());
      const mainProduct = getMainProduct(getState(), getState().userControl.currentUser);
      const today_epoch = Date.now(); // UNIX formatted timestamps in milliseconds (epoch)
      const contactPayload = {
        [CRM_CONTACT_FIELDS.LAST_LOGIN_DATE]: today_epoch,
      };
      // patch Magic Link Verification for main product deal
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.MAGIC_LINK_VERIFICATION]: 'Y',
      };
      dispatch(doCrmSyncPatchDeal(USER_TYPES.PRIMARY, mainProduct, payload));
      dispatch(doCrmSyncPatchContact(USER_TYPES.PRIMARY, mainProduct, contactPayload));
      const account_id = ret.account_id;
      let hasInProgressPolicy = await withErrorModalOnFail(getAllInProgressPolicies, dispatch)(
        account_id, productPrefixToProductType(mainProduct), false,
      );
      if (hasInProgressPolicy) {
        await dispatch(updateMetadata('hasInProgressPolicy', hasInProgressPolicy));
        return dispatch(push(ROUTES.KEEP_EXISTING_APP));
      }
      await dispatch(handleSaveUserAccountConsent(account_id));
      // if no existing policy in BE then clear redux store
      await dispatch(updateMetadata('hasInProgressPolicy', ''));
      dispatch(sendSegmentIdentifyEvent(ret.user_id));
      console.log('Magic Link Verification Success >>>>>>>>');
      dispatch(nextQuestion());
    } else {
      console.log('Magic Link Verification Failed >>>>>>>>');
      if ('application_language' in ret) {
        dispatch(makeUpdateHouseholdProp(USER_TYPES.PRIMARY)('application_language', ret.application_language));
      }
      dispatch(replace(getRouteWithErrorType(ROUTES.VERIFICATION_ERROR, VERIFICATION_ERROR_TYPE.EXPIRED)));
    }
    return Promise.resolve(ret);
  };
};

export const handleVerifyAuth0EmailMagicLink = () => {
  return async (dispatch, getState) => {
    return initiateAuth0Validation(dispatch, getState);
  };
};

export const handleInitAccountInfo = () => {
  return accountIdWrapper(handleInitAccountInfoUserId, handleInitAccountInfoAccountId);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleInitAccountInfoAccountId} instead
 */
const handleInitAccountInfoUserId = () => {
  return async (dispatch, getState) => {
    // Hydrate basic information if empty
    const state = getState();
    const userType = state.userControl.currentUser;
    const { email, firstName, lastName } = state[userType].household;
    const { user_id } = state[userType].session;
    if (!email || !firstName || !lastName) {
      let ret: any;
      if (isInExternalAdvisorMode(getState())) {
        ret = await withErrorModalOnFail(getWebappUserAccountInformation, dispatch)(user_id);
      } else {
        ret = await withErrorModalOnFail(getUserAccountInformation, dispatch)(user_id);
      }
      dispatch(makeUpdateHouseholdProp(userType)('email', ret.email));
      dispatch(updateMetadata('navbarFirstName', ret.user_first_name));
      dispatch(updateMetadata('navbarLastName', ret.user_last_name));
    }
  };
};

const handleInitAccountInfoAccountId = () => {
  return async (dispatch, getState) => {
    // Hydrate basic information if empty
    const state = getState();
    const userType = state.userControl.currentUser;
    const { email, firstName, lastName } = state[userType].household;
    const { account_id } = state[userType].session;
    if (!email || !firstName || !lastName) {
      let ret: any;
      if (isInExternalAdvisorMode(getState())) {
        ret = await withErrorModalOnFail(getWebappAccountInformation, dispatch)(account_id);
      } else {
        ret = await withErrorModalOnFail(getAccountInformation, dispatch)(account_id);
      }
      dispatch(makeUpdateHouseholdProp(userType)('email', ret.email));
      dispatch(updateMetadata('navbarFirstName', ret.user_first_name));
      dispatch(updateMetadata('navbarLastName', ret.user_last_name));
    }
  };
};

export const handleHydration = () => {
  return accountIdWrapper(handleHydrationUserId, handleHydrationAccountId);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleHydrationAccountId} instead
 */
const handleHydrationUserId = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const userType = state.userControl.currentUser;
    const {
      user_id, hd_application_id, account_id
    } = state[userType].session;
    const userId = user_id || jsCookie.get('user_id');
    const accountId = account_id || jsCookie.get('account_id');

    const app_id = hd_application_id;
    const fromStartApp = state.metadata.fromStartApp;
    const isCurrentlyHydratingData = state.metadata.isCurrentlyHydratingData;
    const finishedHydrating = state.metadata.finishedHydrating;
    const isLoggedIn = await dispatch(checkLoginStatus());
    if (!isLoggedIn || !userId || isCurrentlyHydratingData || finishedHydrating) {
      // check for valid state handles kicking user back to homepage, so no additional action needed here
      return false;
    }

    // if user id is not present in redux store, set it
    if (!user_id) {
      dispatch(updateUserId(userId, userType));
    }

    // if account id is not present in redux store, set it
    if (!account_id) {
      dispatch(updateAccountId(accountId, userType));
    }

    // Hydrate basic information
    // if app_id is populated, getUserInfo will handle the hydration, so we can avoid doing it here
    // TODO: move get userInfo logic into handleHydration for post decision pages
    if (!app_id) {
      await dispatch(handleInitAccountInfo());
    } else if (isLoggedInUser(state) && app_id && fromStartApp) {
      // CORE-2467: hydrate startapp users who are logged in and has an app_id
      await dispatch(authGetUserInfo());
    }

    return true;
  };
};

const handleHydrationAccountId = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const userType = state.userControl.currentUser;
    const {
      account_id, user_id, hd_application_id,
    } = state[userType].session;
    const accountId = account_id || jsCookie.get('account_id');
    const userId = user_id || jsCookie.get('user_id');
    const app_id = hd_application_id;
    const fromStartApp = state.metadata.fromStartApp;
    const isCurrentlyHydratingData = state.metadata.isCurrentlyHydratingData;
    const finishedHydrating = state.metadata.finishedHydrating;
    const isLoggedIn = await dispatch(checkLoginStatus());
    if (!isLoggedIn || !accountId || isCurrentlyHydratingData || finishedHydrating) {
      // check for valid state handles kicking user back to homepage, so no additional action needed here
      return false;
    }

    // if account id is not present in redux store, set it
    if (!account_id) {
      // if account_id is not in redux store, then set it using the value we got from the cookie
      dispatch(updateAccountId(accountId, userType));
    }

    // if user id is not present in redux store, set it
    if (!user_id) {
      dispatch(updateUserId(userId, userType));
    }

    // Hydrate basic information
    // if app_id is populated, getUserInfo will handle the hydration, so we can avoid doing it here
    // TODO: move get userInfo logic into handleHydration for post decision pages
    if (!app_id) {
      await dispatch(handleInitAccountInfo());
    } else if (isLoggedInUser(state) && app_id && fromStartApp) {
      // CORE-2467: hydrate startapp users who are logged in and has an app_id
      await dispatch(authGetUserInfo());
    }

    return true;
  };
};

export function handleNeedsAssessmentRequired() {
  return (dispatch, getState) => {
    dispatch(updateMetadata('needsAssessmentStartedAfterStartApp', true));
    dispatch(push(ROUTES.QUESTIONS_INTRO));
  };
}

export function handlePostUpsertCustomerID(userType) {
  return accountIdWrapper(handlePostUpsertCustomerIDUserId, handlePostUpsertCustomerIDAccountId, userType);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handlePostUpsertCustomerIDAccountId} instead
 */
function handlePostUpsertCustomerIDUserId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const payload = {
      user_id: userType && state[userType].session.user_id,
      // we can attach this to the payload to test stripe debug mode in lower environments
      is_stripe_debug_mode: state.metadata.isStripeDebugMode,
    };
    const ret = await withErrorModalOnFail(postUpsertCustomerID, dispatch)(payload);
    if (ret?.stripe_customer_id) {
      await dispatch(makeUpdatePaymentDetails(userType)('stripeCustomerID', ret.stripe_customer_id));
    }
    return Promise.resolve(ret);
  };
}

function handlePostUpsertCustomerIDAccountId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const payload = {
      account_id: userType && state[userType].session.account_id,
      // we can attach this to the payload to test stripe debug mode in lower environments
      is_stripe_debug_mode: state.metadata.isStripeDebugMode,
    };
    const ret = await withErrorModalOnFail(postUpsertCustomerIDForAccount, dispatch)(payload);
    if (ret?.stripe_customer_id) {
      await dispatch(makeUpdatePaymentDetails(userType)('stripeCustomerID', ret.stripe_customer_id));
    }
    return Promise.resolve(ret);
  };
}

export function handlePostStripeCreateSetupIntent(userType) {
  return accountIdWrapper(handlePostStripeCreateSetupIntentUserId, handlePostStripeCreateSetupIntentAccountId, userType);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handlePostStripeCreateSetupIntentAccountId} instead
 */
function handlePostStripeCreateSetupIntentUserId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const stripeCustomerID = userType && state[userType].payment.stripeCustomerID;
    const user_id = userType && state[userType].session.user_id;
    const payload = {
      stripe_customer_id: stripeCustomerID,
    };
    const ret = await withErrorModalOnFail(postStripeCreateSetupIntent, dispatch)(payload, user_id);
    if (ret?.setup_intent_client_secret) {
      await dispatch(makeUpdatePaymentDetails(userType)('setupIntentClientSecret', ret.setup_intent_client_secret));
    }
    return Promise.resolve(ret);
  };
}

function handlePostStripeCreateSetupIntentAccountId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const stripeCustomerID = userType && state[userType].payment.stripeCustomerID;
    const account_id = userType && state[userType].session.account_id;
    const payload = {
      stripe_customer_id: stripeCustomerID,
    };
    const ret = await withErrorModalOnFail(postStripeCreateSetupIntentForAccount, dispatch)(payload, account_id);
    if (ret?.setup_intent_client_secret) {
      await dispatch(makeUpdatePaymentDetails(userType)('setupIntentClientSecret', ret.setup_intent_client_secret));
    }
    return Promise.resolve(ret);
  };
}

export function handleStripeErrorSetup(userType, setClientSecret) {
  return async (dispatch, getState) => {
    const handleErrors = (error, errorDescription) => {
      const sentryMessage = error ? `${errorDescription} - ${error}` : errorDescription;
      sentryError(sentryMessage);
    };

    const fetchData = async () => {
      try {
        await dispatch(handlePostUpsertCustomerID(userType));
      } catch (err) {
        handleErrors(err, 'Error creating stripe customer ID');
        return;
      }
      try {
        const res = await dispatch(handlePostStripeCreateSetupIntent(userType));
        setClientSecret(res?.setup_intent_client_secret);
      } catch (err) {
        handleErrors(err, 'Error creating stripe setup intent');
      }
    };
    fetchData();
  };
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link getPostCreateStripeSubscriptionsAndFinalizePayloadAccountId} instead
 */
export const getPostCreateStripeSubscriptionsAndFinalizePayload = (
  state: State,
  product: typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX],
  userType: UserType,
) => {
  const stripeCustomerID = userType && state[userType].payment.stripeCustomerID;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const user_id = userType && state[userType].session.user_id;
  const userPricedViewedData = createUserPriceViewedDataPayload(
    state,
    userType,
    product,
  );

  const payment_method = state[userType].payment.paymentMethod;
  const payload = {
    stripe_customer_id: stripeCustomerID,
    policy_id: state[userType].session[`${product}_policy_id`],
    plan_type: state[userType].payment.planType,
    customer_timezone: timeZone,
    payment_method_id: state[userType].payment.stripePaymentMethodID,
    user_price_viewed_data: userPricedViewedData,
    payment_method,
  };

  return {
    user_id,
    ...payload,
  };
};

export const getPostCreateStripeSubscriptionsAndFinalizePayloadAccountId = (
  state: State,
  product: typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX],
  userType: UserType,
) => {
  const stripeCustomerID = userType && state[userType].payment.stripeCustomerID;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const account_id = userType && state[userType].session.account_id;
  const userPricedViewedData = createUserPriceViewedDataPayload(
    state,
    userType,
    product,
  );

  const payment_method = state[userType].payment.paymentMethod;
  const payload = {
    stripe_customer_id: stripeCustomerID,
    policy_id: state[userType].session[`${product}_policy_id`],
    plan_type: state[userType].payment.planType,
    customer_timezone: timeZone,
    payment_method_id: state[userType].payment.stripePaymentMethodID,
    user_price_viewed_data: userPricedViewedData,
    payment_method,
  };

  return {
    account_id,
    ...payload,
  };
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link retryPostSubscriptionsAndFinalizeForAccount} instead
 */
export const retryPostSubscriptionsAndFinalize = (product, userType, user_id, payload) => {
  let modified_payload = payload;
  return async (dispatch, getState) => {
    const state = getState();
    let ret;
    try {
      if (product === PM_PRODUCT_PREFIX.HD) {
        modified_payload.hd_plan_type = getHDAppPlanType(state);
        // For now we only have effective date on primary user
        const effective_date = state.primary.hdPolicy.effective_date?.date;
        if (effective_date) {
          // Ex. 2021-04-03T00:00:00-05:00 (Time is always 00:00:00)
          modified_payload.effective_date = effective_date.format();
        }
        ret = await withErrorModalOnFail(postCreateHDSubscriptionAndFinalizeStripeSubscription, dispatch)(modified_payload, user_id);
      }
    } catch (err) {
      return Promise.reject(err);
    }
    ret.product = product;
    ret.policyId = state[userType].session[`${product}_policy_id`];
    if (ret?.subscription_status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
      ret?.subscription_status === STRIPE_SUBSCRIPTION_STATUS.TRIALING) {
      /**
       * If subscription is active or trialing, the payment is successful, the reason
       * we're not using payment_initial_complete or other such states to infer if a product
       * has been paid for, is that the db isn't updated during the execution of these endpoints
       * and we don't rehydrate when a product's payment fails.
       * See https://policyme.atlassian.net/browse/FORM-3164
       */
      dispatch(updateStripePaymentComplete(userType)(product, true));
    }
    return Promise.resolve(ret);
  };
};

export const retryPostSubscriptionsAndFinalizeForAccount = (product, userType, account_id, payload) => {
  let modified_payload = payload;
  return async (dispatch, getState) => {
    const state = getState();
    let ret;
    try {
      if (product === PM_PRODUCT_PREFIX.HD) {
        modified_payload.hd_plan_type = getHDAppPlanType(state);
        // For now we only have effective date on primary user
        const effective_date = state.primary.hdPolicy.effective_date?.date;
        if (effective_date) {
          // Ex. 2021-04-03T00:00:00-05:00 (Time is always 00:00:00)
          modified_payload.effective_date = effective_date.format();
        }
        ret = await withErrorModalOnFail(postCreateHDSubscriptionAndFinalizeStripeSubscriptionForAccount, dispatch)(modified_payload, account_id);
      }
    } catch (err) {
      return Promise.reject(err);
    }
    ret.product = product;
    ret.policyId = state[userType].session[`${product}_policy_id`];
    if (ret?.subscription_status === STRIPE_SUBSCRIPTION_STATUS.ACTIVE ||
      ret?.subscription_status === STRIPE_SUBSCRIPTION_STATUS.TRIALING) {
      /**
       * If subscription is active or trialing, the payment is successful, the reason
       * we're not using payment_initial_complete or other such states to infer if a product
       * has been paid for, is that the db isn't updated during the execution of these endpoints
       * and we don't rehydrate when a product's payment fails.
       * See https://policyme.atlassian.net/browse/FORM-3164
       */
      dispatch(updateStripePaymentComplete(userType)(product, true));
    }
    return Promise.resolve(ret);
  };
};

export const handlePostCreateStripeSubscriptionsAndFinalize = allUnpaidProducts((product, userType) => {
  return accountIdWrapper(handlePostCreateStripeSubscriptionsAndFinalizeUserId, handlePostCreateStripeSubscriptionsAndFinalizeForAccount, product, userType);
});

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handlePostCreateStripeSubscriptionsAndFinalizeForAccount} instead
 */
const handlePostCreateStripeSubscriptionsAndFinalizeUserId = (product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    // use primary customer id to make payment
    const {
      user_id,
      ...payload
    } = getPostCreateStripeSubscriptionsAndFinalizePayload(state, product, userType);
    return dispatch(retryPostSubscriptionsAndFinalize(product, userType, user_id, payload));
  };
};

const handlePostCreateStripeSubscriptionsAndFinalizeForAccount = (product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    // use primary customer id to make payment
    const {
      account_id,
      ...payload
    } = getPostCreateStripeSubscriptionsAndFinalizePayloadAccountId(state, product, userType);
    return dispatch(retryPostSubscriptionsAndFinalizeForAccount(product, userType, account_id, payload));
  };
};

export const handleSetAdvisorLedCheckout = allUnpaidProducts((product, userType) => {
  return async (_dispatch, getState) => {
    const state = getState();
    const isAdvisorMode = isInExternalAdvisorMode(state);
    const isBackdoorMode = isInBackdoorMode(state);
    const isAdvisorLedCheckout = isAdvisorMode || isBackdoorMode;
    if (!isAdvisorLedCheckout) {
      return Promise.resolve(null);
    }
    const appId = getProductAppId(state, userType, product);
    try {
      const ret = await postAdvisorLedCheckout({
        isAdvisorLedCheckout: true,
        appId,
      });
      return ret;
    } catch (err) {
      return Promise.reject(err);
    }
  };
});

export const handleHbmEnrollment = () => {
  return async (dispatch, getState) => {
    const policy_id = getState().primary.session.hd_policy_id;
    const res = await postSetupHbm(policy_id);
    await patchAuthUser(policy_id);
    dispatch(makeUpdateProductPolicyProp(
      USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD,
    )(
      'hbm_status', processHbmResponse(res.status),
    ));
    dispatch(doCrmSyncUpsertContactAndDeal(USER_TYPES.PRIMARY));
  };
};

export const handleMarketingCommunicationsConsent = (userType) => {
  return accountIdWrapper(handleMarketingCommunicationsConsentUserId, handleMarketingCommunicationsConsentAccountId, userType);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleMarketingCommunicationsConsentAccountId} instead
 */
const handleMarketingCommunicationsConsentUserId = (userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userId = state[userType].session.user_id;
    const marketingCommunicationsConsent = state[userType].household.marketingCommunicationsConsent;
    await patchMarketingCommunicationsConsent(userId, marketingCommunicationsConsent);
  };
};

const handleMarketingCommunicationsConsentAccountId = (userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const accountId = state[userType].session.account_id;
    const marketingCommunicationsConsent = state[userType].household.marketingCommunicationsConsent;
    await patchMarketingCommsConsent(accountId, marketingCommunicationsConsent);
  };
};

export const handleNeedsPrescriptionDrugs = (answer) => {
  // used in FUW triage flow to set the prescription drug flag
  return async (dispatch, getState) => {
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', answer));
    dispatch(nextQuestion());
  };
};

export const handleSetPresciptionDrugFlag = (planType) => {
  // creatd for the no FUW triage flow to set the prescription drug flag, since we still want to know
  // if the user selected a plan that includes prescription drugs
  return async (dispatch, getState) => {
    if (isDentalPlan(planType)) {
      return dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.NEITHER));
    }
    return dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.BOTH));
  };
};

export const handleExistingHdCoverage = (existing_hd_plan_flag, existing_hd_plan_option) => {
  return async (dispatch, getState) => {
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('existing_hd_plan_flag', existing_hd_plan_flag));
    if (existing_hd_plan_flag) {
      dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('existing_hd_plan_option', existing_hd_plan_option));
    }
    dispatch(nextQuestion());
  };
};

export const handleLosingBenefits = (losingBenefits) => {
  return async (dispatch, getState) => {
    const state = getState();
    const underwritingMethod = losingBenefits ? UNDERWRITING_METHODS.PORTABLE_COVERAGE :
      UNDERWRITING_METHODS.GUARANTEED_ISSUE;

    // Set losingBenefits + underwriting_method for primary
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('losing_benefits', losingBenefits));
    dispatch(updateHDAppPropertyPrimary('underwriting_method', underwritingMethod));

    // Set losingBenefits + underwriting_method for secondary
    if (state.userControl.hasPartnerApplication) {
      dispatch(makeUpdateProductSessionProp(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)('losing_benefits', losingBenefits));
      dispatch(updateHDAppPropertySecondary('underwriting_method', underwritingMethod));
    }
    if (!isHDFullyUWEnabled()) {
      dispatch(handleDetermineUnderwritingMethod(WHAT_MATTERS_MOST_TO_YOU_OPTIONS.COVER_FUTURE_MEDICATION));
    }
  };
};

export const handleCoverageFitResponse = (coverageFitResponse) => {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('coverage_fit_flag', coverageFitResponse));

    if (state.userControl.hasPartnerApplication) {
      dispatch(makeUpdateProductSessionProp(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)('coverage_fit_flag', coverageFitResponse));
    }
  };
};

export const handleFamilyCompositionResponse = (familyCompositionResponse) => {
  return async (dispatch, getState) => {
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('family_composition_flag', familyCompositionResponse));
  };
};

const _bothTakingDrugs = (prescription_drug_flag, isJointApp) => {
  if (isJointApp) {
    return prescription_drug_flag === PRESCRIPTION_DRUG_FLAG.BOTH;
  }
  return prescription_drug_flag === PRESCRIPTION_DRUG_FLAG.PRIMARY_ONLY ||
    prescription_drug_flag === PRESCRIPTION_DRUG_FLAG.BOTH;
};

export const handleDetermineUnderwritingMethod = (CoverPrescriptions) => {
  return async (dispatch, getState) => {
    const state = getState();
    // https://www.figma.com/file/4DcIc74Kn4nLFhPbbjcbTu/2024-02-12%3A-H%26D-Triaging-Logic?type=whiteboard&node-id=0-1&t=LKjtOKxommFeD0gZ-0
    const hasJoint = isJoint(state);
    const losingBenefits = state.primary.hdSession.losing_benefits;
    let existing_hd_plan_flag = state.primary.hdSession.existing_hd_plan_flag;
    if ([EXISTING_HD_PLAN_OPTION.NOT_SURE, EXISTING_HD_PLAN_OPTION.OTHER].includes(state.primary.hdSession.existing_hd_plan_option)) {
      existing_hd_plan_flag = false; // the NOT_SURE and OTHER options are treated as no
    }

    const prescription_drug_flag = state.primary.hdSession.prescription_drug_flag;
    let spends_on_prescription_drugs = false;
    if (hasValue(prescription_drug_flag) && _bothTakingDrugs(prescription_drug_flag, hasJoint)) {
      spends_on_prescription_drugs = true;
    }
    let defaultPlanSlide;
    let underwritingMethod;

    if (existing_hd_plan_flag || losingBenefits) {
      underwritingMethod = UNDERWRITING_METHODS.PORTABLE_COVERAGE;
      if (CoverPrescriptions === WHAT_MATTERS_MOST_TO_YOU_OPTIONS.COVER_FUTURE_MEDICATION) {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.STANDARD;
      } else {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.DENTAL_SECURE;
      }
    } else if (spends_on_prescription_drugs) {
      if (CoverPrescriptions === WHAT_MATTERS_MOST_TO_YOU_OPTIONS.COVER_FUTURE_MEDICATION) {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.STANDARD;
      } else {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.DENTAL_SECURE;
      }
      underwritingMethod = UNDERWRITING_METHODS.GUARANTEED_ISSUE;
    } else if (CoverPrescriptions === WHAT_MATTERS_MOST_TO_YOU_OPTIONS.COVER_FUTURE_MEDICATION
      && isHDFullyUWEnabled()
    ) {
      underwritingMethod = UNDERWRITING_METHODS.FULLY_UNDERWRITTEN;
      defaultPlanSlide = CAA_HD_PLAN_TYPES.STANDARD;
    } else {
      underwritingMethod = UNDERWRITING_METHODS.GUARANTEED_ISSUE;
      if (isHDFullyUWEnabled()) {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.DENTAL_SECURE;
      } else {
        defaultPlanSlide = CAA_HD_PLAN_TYPES.STANDARD;
      }
    }

    // // Set CoverPrescriptions + underwriting_method for primary
    await dispatch(updateHDAppPropertyPrimary('underwriting_method', underwritingMethod));

    await dispatch(updateMetadata('defaultPlanSlide', defaultPlanSlide));

    // // Set CoverPrescriptions + underwriting_method for secondary
    if (state.userControl.hasPartnerApplication) {
      await dispatch(makeUpdateProductSessionProp(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)('determine_plan', CoverPrescriptions));
      await dispatch(updateHDAppPropertySecondary('underwriting_method', underwritingMethod));
    }

    // Fetch HD quotes with new UW method
    await dispatch(getHealthDentalSessionQuotes());
  };
};

export function handleCoverPrescriptions(CoverPrescriptions) {
  return async (dispatch, getState) => {
    dispatch(handleDetermineUnderwritingMethod(CoverPrescriptions));
    dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('determine_plan', CoverPrescriptions));
    // Fetch HD quotes with new UW method
    await dispatch(getHealthDentalSessionQuotes());
  };
}

export const handleDiscountsForCAA = (userType, key, isCAAMember) => {
  return async (dispatch, getState) => {
    if (isCAAMember) {
      dispatch(addQuotesDiscount(userType, PM_PRODUCT_PREFIX.HD)(
        DISCOUNT_CODES.CAA_HD_DISCOUNT,
      ));
    } else {
      dispatch(removeQuotesDiscount(userType, PM_PRODUCT_PREFIX.HD)(
        DISCOUNT_CODES.CAA_HD_DISCOUNT,
      ));
    }
  };
};

export const handleDiscountsForCAAAllUsers = allUsers(handleDiscountsForCAA);

export const handleUpsertHDExclusionsDeclaration = (userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policyId = state[userType].session.hd_policy_id;

    dispatch(makeUpdateProductPolicyProp(userType, PM_PRODUCT_PREFIX.HD)('exclusions_declaration', true));
    const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][PM_PRODUCT_PREFIX.HD];

    await withErrorModalOnFail(postHDExclusionsDeclaration, dispatch)(
      policyId,
      { authorization_vers: `${consentVersions[AUTHORIZATION_TYPE.EXCLUSION]}` },
    );
  };
};

export function handleQADocumentDownload(product_prefix, userType) {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      const state = getState();
      const product_type = productPrefixToProductType(product_prefix) as ProductTypeFull;
      const app_id = state[userType].session[`${product_prefix}_application_id`];
      const hasPolicy = doesPolicyIdExist(state, userType);
      const is_digital_consent_application = showDigitalConsentPage(state);

      const options: Parameters<typeof downloadQADocument>[0] = {
        product_type,
        app_id,
        is_digital_consent_application,
      };
      if (isDigitalConsentJourney(state) && hasPolicy) {
        // Digital Consent uses this endpoint to show the Q&A document
        // on the payment page, so we need to set the origin to Policy Contract
        options.qa_document_origin = QA_DOCUMENT_ORIGIN.POLICY_CONTRACT;
        options.is_digital_consent_application = true;
      }

      try {
        const [documentBlob, documentName] = await withErrorModalOnFail(downloadQADocument, dispatch)(options);

        openFile(documentBlob, documentName);
      } catch (err) {
        sentryError(err);
      }
    }, dispatch)();
  };
}

export function handleHDConfirmationDocDownload() {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      const state = getState();
      const product_prefix = PM_PRODUCT_PREFIX.HD;
      const app_id = state.primary.session[`${product_prefix}_application_id`];

      try {
        const [documentBlob, documentName] = await withErrorModalOnFail(downloadHDConsentDoc, dispatch)({
          product_type: PM_PRODUCT_TYPE.HEALTH_AND_DENTAL,
          app_id,
        });

        openFile(documentBlob, documentName);
      } catch (err) {
        sentryError(err);
      }
    }, dispatch)();
  };
}

export function handleDownloadPolicyCoverageTerms(user_type, product_prefix) {
  return async (dispatch, getState) => {
    return withLoading(async () => {
      const state = getState();
      const policy_id = state[`${user_type}`].session[`${product_prefix}_policy_id`];

      try {
        const [documentBlob, documentName] = await withErrorModalOnFail(downloadPolicyCoverageTerms, dispatch)({
          policy_id,
          product_type: productPrefixToProductType(product_prefix) as ProductTypeFull,
        });

        openFile(documentBlob, documentName);
      } catch (err) {
        sentryError(err);
      }
    }, dispatch)();
  };
}

export const handleDigitalConsentCheckout = (userType) => {
  return async (dispatch, getState) => {
    try {
      await dispatch(validateProductOnCheckout(userType));
    } catch (error) {
      sentryError(error, {
        extras: { source: 'validateProductOnCheckout' },
        tags: { source: 'validateProductOnCheckout' },
      });
      dispatch(openErrorModal(() => dispatch(handleDigitalConsentCheckout(userType)), error));
      throw error;
    }
    await dispatch(handleAuraDigitalConsentRecords(userType));
    await dispatch(handleValidateDigitalConsentDocuments(userType));
    await dispatch(handleDigitalConsent(userType));
  };
};

const validateProductOnCheckout = allProductsOptedIn((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const active_decision = state[userType][`${product}Decision`].active_decision;
    if (active_decision !== AURA_DECISION_TYPES.APPROVED) {
      const err_message = `Attempting to checkout with ${product} decision not approved: ${active_decision}`;
      sentryError(err_message);
      
      return Promise.reject(new Error(err_message));
    }
    return Promise.resolve();
  };
});

const handleAuraDigitalConsentRecords = allProductsOptedIn((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policy_id = state[userType].session[`${product}_policy_id`];
    const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][product];

    const digital_checkout_auth_payload = {
      authorization_type: AUTHORIZATION_TYPE.CHECKOUT_CONSENT,
      authorization_vers: consentVersions[AUTHORIZATION_TYPE.CHECKOUT_CONSENT],
    };

    await withErrorModalOnFail(postAuraAuthorization, dispatch)(policy_id, digital_checkout_auth_payload);
  };
});

const handleValidateDigitalConsentDocuments = allProductsOptedIn((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policy_id = getProductPolicyId(state, userType, product);
    try {
      await withErrorModalOnFail(postValidateDigitalConsentDocuments, dispatch)(
        policy_id,
        productPrefixToProductType(product) as ProductTypeFull,
      );
    } catch (err) {
      sentryError(err);
      throw err;
    }
  };
});

const handleDigitalConsent = allProductsOptedIn((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policy_id = state[userType].session[`${product}_policy_id`];
    const application_language = state[userType].household.application_language;

    dispatch(makeUpdateProductPolicyProp(userType, product)('digital_consent_status', DIGITAL_CONSENT_STATUS.CONSENTED));
    try {
      await withErrorModalOnFail(postDigitalConsentStatus, dispatch)(policy_id, DIGITAL_CONSENT_STATUS.CONSENTED);
      // Patch policy signed status since consent is given
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.POLICY_SIGNED_STATUS]: POLICY_SIGNED_STATUS.COMPLETED,
        [CRM_LIFE_SESSION_FIELDS.ANNUAL_PAYMENT_DAY]: moment().format('MMMM Do'),
        [CRM_LIFE_SESSION_FIELDS.MONTHLY_PAYMENT_DAY]: moment().format('Do'),
        [CRM_LIFE_SESSION_FIELDS.ANNUAL_PAYMENT_DAY_CLIENT_FACING]:
          formatDateByLocale(application_language),
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
    } catch (err) {
      // Patch failure if it fails to get saved to the DB
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.POLICY_SIGNED_STATUS]: POLICY_SIGNED_STATUS.FAILED,
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
      throw err;
    }

    // Renewals generation — only applicable for Life/CI, skipped in HD-only webapp

    // 🚨🚨🚨 note - postGenerateAndUploadConsentDocuments makes a crm sync call at BE 🚨🚨🚨
    const product_type = productPrefixToProductType(product) as ProductTypeFull;
    postGenerateAndUploadConsentDocuments(
      policy_id,
      product_type,
    );
  };
});

export function handleRemovePartnerHousehold(product) {
  return (dispatch) => {
    product === PM_PRODUCT_PREFIX.HD ?
      dispatch(updateHouseholdPropSecondary('healthcard_province', '')) :
      dispatch(updateHouseholdPropSecondary('province', ''));
    dispatch(updateHouseholdPropSecondary('birthdate', ''));
    dispatch(updateHouseholdPropSecondary('userGender', ''));
    dispatch(updateHouseholdPropSecondary('smoke', ''));
  };
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleSaveUserAccountConsent} instead
 */
export function handleSaveUserConsent(user_id) {
  return async () => {
    const _consent = getConsent();
    const consent = {
      functional: Boolean(_consent.Functional),
      advertising: Boolean(_consent.Advertising),
      performance: Boolean(_consent.Performance),
    };
    const res = await saveUserConsent({ user_id, consent });
    return res;
  };
}

export function handleSaveUserAccountConsent(account_id) {
  return async () => {
    const _consent = getConsent();
    const consent = {
      functional: Boolean(_consent.Functional),
      advertising: Boolean(_consent.Advertising),
      performance: Boolean(_consent.Performance),
    };
    const res = await saveUserConsentForAccount({ account_id, consent });
    return res;
  };
}

const handleUpdateInsuranceOwnershipType = allProductsSynchronous((product, userType) => {
  return (dispatch, getState) => {
    dispatch(makePatchInsuranceOwnershipType(userType, product));
  };
});
