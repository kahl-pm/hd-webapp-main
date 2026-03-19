import { goBack, push, replace } from 'connected-react-router';
import jsCookie from 'js-cookie';
import { getUrls, sentryInfo, segmentReset, sentryError, isCookieSecure } from '@policyme/global-libjs-utils';
import { getRouteABTestOverride } from '../components/Customisation/helpers';
import {
  postFamily,
  postHouseholdInfos,
  patchHouseholdInfos,
  getTraceId,
  getLoginStatus,
} from './fetch';
import { handleBeginDisclosure, handleNeedsAssessmentStart, handleNeedsAssessmentSubmit, handleReferrerSteps } from './handle';
import { makePostProductAppRecord } from './helpers/productApp';
import { postProductSession } from './helpers/productFetch';
import {
  patchHouseholdByVal,
  patchHouseholdInfoNeedsAssessmentFields,
} from './household';
import {
  enableBeforeUnload, makeUpdateMetadataSessionProp, trackABTest, updateMetadata,
} from './metadata';

import { COVERAGES } from '../constants/session';
import {
  getHDAppPlanType,
  getMainProduct,
  getMainProductEventPrefix,
} from '../Selectors/helpers/productApp';
import { getABTestBand } from '../Selectors/metadata';
import {
  PM_PRODUCT_PREFIX,
  ROUTE_REGEX,
  ROUTES,
  USER_TYPES,
  ACCOUNT_ROUTES,
  SEGMENT_EVENTS,
  UserType,
  PLAN_TYPES,
  JourneyIngressPoint,
  JOURNEY_INGRESS_POINTS,
  ProductType,
  LEGACY_SEGMENT_EVENTS,
} from '../utils/const';
import {
  allProducts,
  allUsers,
  calcDefaultTermAndCoverage,
  findClosestPolicyTerm,
  getAvailableTerms,
  getRouteWithProductType,
  getRouteWithUserType,
  hasValue,
  stripTrailingSlash,
  withErrorModalOnFail,
  getCookieDomain,
  getMatchingRoute,
  isSocialSignOnFeatureEnabled,
} from '../utils/helpers';
import { isPartnerSameAddress } from '../Selectors/jointMetadata';
import { canRequote, canRequoteHD } from '../Selectors/quotes';
import {
  getCurrentUser,
  getUserSlice,
  isJoint,
  isLoggedInUser,
  isMortgageBroker,
} from '../Selectors/userControl';

import { trackUtm } from '../utils/utm';
import { updateAllUserSessionProp, updateAllUserSessionPropAllProducts } from './helpers/productSession';
import { makeUpdatePaymentDetails } from './payment';
import { preDecisionRequoteActual } from './quotes';
import { updateDependentSession } from './dependents';
import { getHealthDentalSessionQuotes } from './hdSession';
import { authGetUserInfo } from './auth';
import { sendSegmentPageEvent, sendSegmentTrackEvent } from './analytics';
import { getDisclosureNextQuestionPathName } from './helpers/session';
import { getRoutePageOptions } from '../config/pageOptionsConfig';
import { getJourneyContext } from '../Journey/JourneyContext';
import { JourneyContext, JourneyPath } from '../Journey/types';
import { ACTIVE_TESTS } from '../ABTests';
import { getJourneyFromState } from '../Journey';
import { shouldJumpToDecision } from '../Selectors/session';
import { isPMEnvironment } from '../tenant/helpers';
import { sendSegmentTrackEventLegacy } from './legacyAnalytics';

const TOKEN_EXPIRY_IN_MINUTES = 300;

export const makeUpdateSessionProp = (slice) => {
  return (property, value) => {
    return {
      type: `@@${slice}/session/update`,
      property,
      value,
    };
  };
};

export const updateSessionPropPrimary = makeUpdateSessionProp('primary');
export const updateSessionPropSecondary = makeUpdateSessionProp('secondary');

export const updateAppId = (value, userType, product) => {
  return (dispatch, getState) => {
    const expiration = TOKEN_EXPIRY_IN_MINUTES / (60 * 24); // Convert minutes to days
    jsCookie.set('app_id', value, { domain: getCookieDomain(), expires: expiration, secure: true, sameSite: 'strict' });
    return dispatch(makeUpdateSessionProp(userType)(`${product}_application_id`, value));
  };
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link updateAccountId} instead
 */
export const updateUserId = (value, userType) => {
  return (dispatch, getState) => {
    const expiration = TOKEN_EXPIRY_IN_MINUTES / (60 * 24); // Convert minutes to days
    jsCookie.set('user_id', value, { domain: getCookieDomain(), expires: expiration, secure: true, sameSite: 'strict' });
    return dispatch(makeUpdateSessionProp(userType)('user_id', value));
  };
};

export const updateAccountId = (value, userType) => {
  return (dispatch, getState) => {
    const expiration = TOKEN_EXPIRY_IN_MINUTES / (60 * 24); // Convert minutes to days
    jsCookie.set('account_id', value, { domain: getCookieDomain(), expires: expiration, secure: true, sameSite: 'strict' });
    return dispatch(makeUpdateSessionProp(userType)('account_id', value));
  };
};

export const makeUpdateSessionHouseholdProp = (slice) => {
  return (value) => {
    return {
      type: `@@${slice}/session/update_household`,
      value,
    };
  };
};
export const updateSessionHouseholdPropPrimary = makeUpdateSessionHouseholdProp('primary');
export const updateSessionHouseholdPropSecondary = makeUpdateSessionHouseholdProp('secondary');


export const getMaxCovAndRequote = (product) => {
  return async (dispatch, getState) => {
    // Life/CI requote logic removed — HD-only webapp
  };
};

/*
* prioritizeRecommendationCovAndTerm was added to fix a bug - https://policyme.atlassian.net/browse/PART-1390
* where the user was not seeing the recommended coverage and term when they were redirected
* to the quotes page from CAA member advice page (/caa-member-advice) instead they were seeing
* the default coverage and term.
*/
export const updateUserSessionCovAndTermDefaultsAndFetchQuotes = (
  mainProduct,
  prioritizeRecommendationCovAndTerm = false,
) => {
  return async (dispatch, getState) => {
    let state = getState();
    let availableProducts = state.userControl.availableProducts;

    // Life/CI default term/coverage computation removed — HD-only webapp

    if (canRequote(getState(), USER_TYPES.PRIMARY)) {
      availableProducts.forEach((async product => {
        await dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
      }));
    }

    if (mainProduct === PM_PRODUCT_PREFIX.HD) {
      // Fetch HD quotes
      if (canRequoteHD(getState(), USER_TYPES.PRIMARY)) {
        await dispatch(getHealthDentalSessionQuotes());
      }
    }
  };
};

export const updateUserSessionCovAndTermDefaultsForAdviceAndFetchQuotes = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let availableProducts = state.userControl.availableProducts;

    // Life/CI term/coverage default computation removed — HD-only webapp

    if (canRequote(getState(), USER_TYPES.PRIMARY) === true) {
      availableProducts.forEach((async product => {
        await dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
      }));
    }
  };
};

export const updateUserSessionCovAndTermDefaultsForQuotesCopilotAndFetchQuotes = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let availableProducts = state.userControl.availableProducts;

    // Life/CI term/coverage default computation removed — HD-only webapp

    if (canRequote(getState(), USER_TYPES.PRIMARY) === true) {
      availableProducts.forEach((async product => {
        await dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
      }));
    }
  };
};

export function jumpToStart() {
  return async (dispatch, getState) => {
    const { pathname } = getState().router.location;
    sentryInfo('jumpToStart', { extras: { pathname } });
    dispatch(replace(ROUTES.GETTING_STARTED));
  };
}

export function jumpToQuotesPage(product: ProductType = PM_PRODUCT_PREFIX.HD) {
  return async (dispatch, getState) => {
    let state = getState();
    let productPrefix = getMainProductEventPrefix(state, state.userControl.currentUser);
    dispatch(sendSegmentTrackEvent(`${productPrefix} - SMQ Want to make a change`));
    dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, product)));
  };
}

export function jumpToFamily(product: ProductType = PM_PRODUCT_PREFIX.HD) {
  return async (dispatch, getState) => {
    dispatch(replace(getRouteWithProductType(ROUTES.FAMILY, product)));
  };
}

export function jumpToVerification() {
  return async (dispatch, getState) => {
    dispatch(replace(ROUTES.VERIFICATION));
  };
}

//
// wrapper function to perform on upon successful loading
// of a high-level component (pages)
//
export function onComponentLoad(callback = null) {
  return (dispatch, getState) => {
    // check that the screen has the correct state to load
    dispatch(checkForValidState(() => {
      const state = getState();
      // track the marketing effectiveness of our campaigns
      const userType = state.userControl.currentUser;

      // send segment page calls once page is loaded
      dispatch(sendSegmentPageEvent(state.router.location.pathname));
      // only do UTM and ab testing for life and CI for now
      trackUtm(dispatch, getState());
      // send ab-test data to the backend
      dispatch(trackABTest());
      callback && callback();
    }));
  };
}

export function goToFirstDisclosure() {
  return async (dispatch, getState) => {
    await dispatch(_beginDisclosure());

    const state = getState();
    const pathname = getDisclosureNextQuestionPathName(state, state.userControl.currentUser);
    return dispatch(push(pathname));
  };
}

const _beginDisclosure = allUsers((userType, key) => {
  return (dispatch, getState) => {
    const state = getState();

    const isPrimary = userType === USER_TYPES.PRIMARY;
    const isSecondary = userType === USER_TYPES.SECONDARY;

    if (isPrimary || isSecondary) {
      const {
        address_line1,
        address_line2,
        city,
        province,
        healthcard_province,
        country,
        postal_code,
        userIncomeOverride,
        partnerIncomeOverride,
        assetsTotOverride,
        debtsTotOverride,
      } = state[userType].household;
      return dispatch(patchHouseholdByVal(userType, {
        user: {
          address_line1,
          address_line2,
          city,
          country,
          postal_code,
          province,
          healthcard_province,
        },
        overrides: {
          savings_tot_override: assetsTotOverride,
          debts_tot_override: debtsTotOverride,
          income_override: userIncomeOverride,
          partner_income_override: partnerIncomeOverride,
        },
      }));
    }

    const {
      address_line1,
      address_line2,
      city,
      province,
      healthcard_province,
      country,
      postal_code,
      userIncomeOverride,
      partnerIncomeOverride,
      assetsTotOverride,
      debtsTotOverride,
    } = state.dependents.dependents[key].household;
    return dispatch(patchHouseholdByVal(userType, {
      user: {
        address_line1,
        address_line2,
        city,
        country,
        postal_code,
        province,
        healthcard_province,
      },
      overrides: {
        savings_tot_override: assetsTotOverride,
        debts_tot_override: debtsTotOverride,
        income_override: userIncomeOverride,
        partner_income_override: partnerIncomeOverride,
      },
    }, key));
  };
});

export function upsertHouseholdId(
  userType: UserType = USER_TYPES.PRIMARY,
  key,
  allowHouseholdIdCreationIfEmpty = false,
) {
  return async (dispatch, getState) => {
    let state = getState();
    // ensuring that promise is not resolved even if backPressed is true
    // fixes a bug where if user on advice journey reaches the /questions/partner page
    // using a back button the API hit will not work and user will have to restart the journey again
    if (
      state.metadata.backPressed &&
      !(allowHouseholdIdCreationIfEmpty && (!state.primary.session.household_id))
    ) {
      return Promise.resolve();
    }
    let application_language;
    let advisor_id;
    let quote_source;

    let household_id;
    let hh_id_vers;
    if (userType === USER_TYPES.DEPENDENT) {
      household_id = state.dependents.dependents[key].session.household_id;
      hh_id_vers = state.dependents.dependents[key].session.household_id_vers ?? 0;
      application_language = state.dependents.dependents[key].household.application_language;
    } else {
      household_id = state[userType].session.household_id;
      hh_id_vers = state[userType].session.household_id_vers ?? 0;
      application_language = state[userType].household.application_language;
      advisor_id = state[userType].household.advisor_id;
      quote_source = state[userType].household.quote_source;
    }

    const reqPayload = {
      application_language,
      ...(advisor_id && { advisor_id }),
      ...(advisor_id && quote_source && { quote_source }),
    };

    // create a new household_id if one does not already exist
    if (!household_id || household_id === '') {
      const fetchedData = await withErrorModalOnFail(postHouseholdInfos, dispatch)(reqPayload);
      if (userType === USER_TYPES.SECONDARY) {
        dispatch(updateSessionHouseholdPropSecondary(fetchedData.data));
      } else if (userType === USER_TYPES.PRIMARY) {
        dispatch(updateSessionHouseholdPropPrimary(fetchedData.data));
      } else {
        const { hh_info_id, hh_info_id_vers } = fetchedData.data;
        dispatch(updateDependentSession(key, 'household_id', hh_info_id));
        dispatch(updateDependentSession(key, 'household_id_vers', hh_info_id_vers));
      }
    } else if (!getState().metadata.fromStartApp) {
      await withErrorModalOnFail(patchHouseholdInfos, dispatch)(household_id,
        hh_id_vers, reqPayload);
    }
    return Promise.resolve();
  };
}

export const _handleAddFamilyToProduct = (product, userType, key) => {
  return async (dispatch, getState) => {
    let state = getState();
    if (state.metadata.backPressed) {
      return Promise.resolve();
    }
    const { session } = getUserSlice(state, userType, key);
    const family_id = session[`${product}_family_id`];

    if (!family_id) {
      const hh_info_id = session.household_id;
      const famReq = {
        hh_info_id,
        family_role: USER_TYPES.PRIMARY,
      };
      const fetchedData = await withErrorModalOnFail(postFamily, dispatch)(famReq);
      if (fetchedData?.data?.family_id) {
        dispatch(makeUpdateSessionProp(userType)(`${product}_family_id`, fetchedData.data.family_id));
      }
    }
    return Promise.resolve();
  };
};

export const handleAddToFamily = allProducts(_handleAddFamilyToProduct);

export const healthDentalAddUserToFamily = (userType, key) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { session } = getUserSlice(getState(), userType, key);
    const payload: Record<string, string> = {
      hh_info_id: session.household_id,
      family_role: userType,
    };
    const family_id = state[USER_TYPES.PRIMARY].session.hd_family_id;

    if (family_id) {
      payload.family_id = family_id;
    }

    const { data: family } = await withErrorModalOnFail(postFamily, dispatch)(payload);

    if (userType === USER_TYPES.DEPENDENT) {
      dispatch(updateDependentSession(key, 'hd_family_id', family.family_id));
    } else {
      dispatch(makeUpdateSessionProp(userType)('hd_family_id', family.family_id));
    }
  };
};

export function upsertSessionId(
  userType,
  product,
  allowHouseholdIdCreationIfEmpty = false,
) {
  return async (dispatch, getState) => {
    let state = getState();
    let session = null;
    let session_id = null;
    session = state[userType].session;
    session_id = session[`${[product]}_session_id`];
    // ensuring that promise is not resolved even if backPressed is true
    // fixes a bug where if user on advice journey reaches the /questions/partner page
    // using a back button the API hit will not work and user will have to restart the journey again
    if (
      state.metadata.backPressed && !allowHouseholdIdCreationIfEmpty) {
      return Promise.resolve();
    }

    // create a new session_id if one does not already exist
    if (!session_id || session_id === '') {
      const slice = {
        ...session,
        plan_type: getHDAppPlanType(state),
        determine_plan: state.primary?.hdSession?.determine_plan,
        existing_hd_plan_flag: state.primary?.hdSession?.existing_hd_plan_flag,
        existing_hd_plan_option: state.primary?.hdSession?.existing_hd_plan_option,
        prescription_drug_flag: state.primary?.hdSession?.prescription_drug_flag,
        losing_benefits: state.primary?.hdSession?.losing_benefits,
        affiliate_id: state.userControl.affiliateId,
        coverage_fit_flag: state.primary.hdSession.coverage_fit_flag,
        family_composition_flag: state.primary.hdSession.family_composition_flag,
        household_income: state.primary.hdSession.household_income,
      };
      const fetchedData = await withErrorModalOnFail(postProductSession, dispatch)(product, slice);
      if (product === PM_PRODUCT_PREFIX.HD) {
        dispatch(updateSessionPropPrimary('hd_session_id', fetchedData.data.session_id));
      }
    }
    return Promise.resolve();
  };
}

export function upsertAppId(userType, product) {
  return async (dispatch, getState) => {
    let state = getState();

    if (state.metadata.backPressed) {
      return Promise.resolve();
    }

    const application_id = state[userType].session[`${product}_application_id`];

    // create a new application_id if one does not already exist
    if (application_id === '') {
      const app_data = await dispatch(makePostProductAppRecord(userType, product));
      dispatch(makeUpdateSessionProp(userType)(`${product}_application_id`, app_data.app_id));
      // TODO (FORM-1013): Remove temporary hack to get prefixed product events
      dispatch(makeUpdateMetadataSessionProp(userType)(
        `${product}_application_id`, app_data.app_id,
      ));
    }
    return Promise.resolve();
  };
}

export const submitHouseholdInfoNeedsAssessmentFields = (userType, options?: { showLoader?: boolean }) => {
  return async (dispatch, getState) => {
    let state = getState();

    if (state.metadata.backPressed) {
      return Promise.resolve();
    }

    await dispatch(patchHouseholdInfoNeedsAssessmentFields(userType));
  };
};

function handleStartAppGoBack(product: ProductType = PM_PRODUCT_PREFIX.HD) {
  return (dispatch, getState) => {
    const { metadata: { hasLocalHistory } } = getState();
    if (hasLocalHistory) {
      return dispatch(goBack());
    }
    return dispatch(push(getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, product)));
  };
}

/**
 * All the side-effects that used to be in the nextQuestion actions are enumerated here.
 * @param fromPath the path we're routing from
 * @param toPath the path we're routing to
 * @param context the current journey context
 * @returns true if we should prevent the default routing behavior
 */
const handleNextQuestionSideEffects = (
  fromPath: JourneyPath,
  toPath: JourneyPath,
  context: JourneyContext,
) => {
  return async (dispatch, getState): Promise<boolean> => {
    const isSocialSignOnEnabled_ = isSocialSignOnFeatureEnabled();
    if (fromPath === ROUTES.QUESTIONS_INTRO && toPath === ROUTES.QUESTIONS_KIDS) {
      await dispatch(handleNeedsAssessmentStart());
    }

    if (fromPath === ROUTES.QUESTIONS_DEBTS) {
      await dispatch(handleNeedsAssessmentSubmit());
    }

    if (
      (getMatchingRoute(ROUTES.START_APP, fromPath) && toPath === ROUTES.VERIFICATION) ||
      (fromPath === ROUTES.KEEP_EXISTING_APP && toPath === ROUTES.VERIFICATION)
    ) {
      if (isLoggedInUser(getState())) {
        // INFO: since we skip verification flow, we need to hydrate user info data
        // Usually done by magic link verification callback
        await dispatch(authGetUserInfo());

        // If social sign on is enabled, redirect to basic details page instead of full address
        if (isSocialSignOnEnabled_) {
          dispatch(replace(
            getRouteWithUserType(ROUTES.APPLICATION_BASIC_DETAILS, USER_TYPES.PRIMARY),
          ));
        } else {
          dispatch(replace(
            getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY),
          ));
        }
        return true;
      }
    }

    if (
      toPath === ROUTES.APPLICATION_CONSENT && (
        fromPath === ROUTES.APPLICATION_FULL_ADDRESS ||
        fromPath === ROUTES.APPLICATION_PARTNER_INFO ||
        getMatchingRoute(ROUTES.APPLICATION_FULL_ADDRESS, fromPath)
      )
    ) {
      dispatch(handleReferrerSteps());
    }

    if (
      getMatchingRoute(ROUTES.APPROVED_REVIEW_ESIGN_POLICY, fromPath) &&
      getMatchingRoute(ROUTES.APPROVED_PAYMENT_FORM, toPath)
    ) {
      dispatch(makeUpdatePaymentDetails(USER_TYPES.PRIMARY)('planType', PLAN_TYPES.MONTHLY));
    }

    if (getMatchingRoute(ROUTES.APPLICATION_BEGIN_DISCLOSURE, toPath)) {
      // Kick off the disclosure flow
      await dispatch(handleBeginDisclosure());
      return true;
    }

    // support moving to DIGITAL_CONSENT_DASHBOARD_PAGE instead of DECISION_DASHBOARD_PAGE
    if (
      fromPath === ROUTES.DECISION_DASHBOARD_CALLBACK
    ) {
      // Use replace to avoid the back button going back to the callback page
      dispatch(replace(toPath));
      return true;
    }

    if (
      (getMatchingRoute(ROUTES.QUOTES_COMPARE_CONTINUED, fromPath) ||
        getMatchingRoute(ROUTES.QUOTES_ADVICE, fromPath)) &&
      (context.mainProduct === PM_PRODUCT_PREFIX.HD)
    ) {
      if (isPMEnvironment()) {
        dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.QUOTE_RECEIVED, USER_TYPES.PRIMARY));
      } else {
        dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.QUOTE_RECEIVED, USER_TYPES.PRIMARY));
      }
        if ( context.isJoint && isPMEnvironment()) {
          dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.QUOTE_RECEIVED, USER_TYPES.SECONDARY));
        } else if (context.isJoint) {
          dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.QUOTE_RECEIVED, USER_TYPES.SECONDARY));
        }
    }

    // Handle POLICY_OTP_ENTER stuff.
    // Really don't think this should be using nextQuestion, but I don't want
    // to do a deeper refactor right now.
    if (fromPath === ROUTES.POLICY_OTP_ENTER) {
      if (context.otpAuthorised || context.isJoint) {
        dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
      } else {
        dispatch(push(ROUTES.POLICY_OTP_UNSUCCESSFUL));
      }
      return true;
    }
    // if (fromPath === ROUTES.POLICY_DOWNLOAD_OTP_ENTER) {
    //   if (context.otpAuthorised) {
    //     dispatch(push(ROUTES.POLICY_DOWNLOAD_DOWNLOAD_PAGE
    //       + context.policyDownloadQueryString));
    //   } else {
    //     dispatch(push(ROUTES.POLICY_DOWNLOAD_OTP_UNSUCCESSFUL
    //       + context.policyDownloadQueryString));
    //   }
    //   return true;
    // }

    return false;
  };
};

/**
 * This action is responsible for routing, except disclosure
 * Calling it 'nextQuestion' is probably a misnomer at this point...
 */
export const nextQuestion = () => {
  return async (dispatch, getState) => {
    dispatch(enableBeforeUnload()); // only enables once
    // Set this so we know if we can use goBack()
    dispatch(updateMetadata('hasLocalHistory', true));

    const pathname = stripTrailingSlash(getState().router.location.pathname);

    // Check for any AB test overrides
    const testBand = getABTestBand(getState());
    const routeOverride = getRouteABTestOverride(pathname, getState(), ACTIVE_TESTS, testBand);
    if (routeOverride) {
      // Using a route overridden by an enabled AB test
      return dispatch(push(routeOverride));
    }

    // Non-standard routing for drop-journeys and blockers
    if (shouldJumpToDecision(getState())) {
      return dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
    }

    const journey = getJourneyFromState(getState());
    const nextPage = journey.getNextPage(pathname) ?? journey.getFirstPage();

    const routed = await dispatch(handleNextQuestionSideEffects(
      pathname,
      nextPage,
      getJourneyContext(getState()),
    ));

    if (routed) {
      return Promise.resolve();
    }

    return dispatch(push(nextPage));
  };
};

/**
 * This action is responsible for non-standard routing into a Journey
 * For example, going straight to DecisionDashboard during a drop journey
 * @param ingressPoint The point in the journey to ingress at
 */
export const journeyIngress = (ingressPoint: JourneyIngressPoint) => {
  return (dispatch, getState) => {
    const journey = getJourneyFromState(getState());
    const ingressPage = journey.getIngressPage(ingressPoint) ?? journey.getFirstPage();
    return dispatch(replace(ingressPage));
  };
};

//
// check to make sure there is valid state to render the page
//
const runPageStateValidation = (stateValidationObject) => {
  return (dispatch, getState) => {
    const state = getState();
    if (stateValidationObject.validationQuery(state)) {
      const product = getMainProduct(state, state.userControl.currentUser);
      switch (stateValidationObject.failAction) {
        case 'JUMP_TO_START':
          dispatch(jumpToStart());
          break;
        case 'START_APP_GO_BACK':
          dispatch(updateMetadata('hasCustomError', true));
          dispatch(handleStartAppGoBack());
          break;
        case 'REDIRECT_NOT_FOUND':
          window.location.href = `${getUrls().homepage}/404`;
          break;
        case 'REDIRECT_NOT_FOUND_WITH_PARAMS':
          // For docusign redirect
          // If they refreshed the page, goto the short url which gets stored from query params
          // If there's no query param for some reason, do nothing and they'll be stuck
          window.location.href = `${getUrls().homepage}/u/${state.metadata.eappValidateShortCode}`;
          break;
        case 'QUOTES_COMPARE_GO_BACK':
          dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE, product)));
          break;
        case 'INTENT_GO_BACK':
          dispatch(replace(getRouteWithProductType(ROUTES.USER_INTENT, PM_PRODUCT_PREFIX.HD)));
          break;
        default:
          break;
      }
    }
  };
};

function isJointValid(state) {
  if (state.userControl.hasPartnerApplication) {
    if (
      !hasValue(state.secondary.household.birthdate) ||
      !hasValue(state.secondary.household.userGender) ||
      !hasValue(state.secondary.household.smoke)
    ) {
      return false;
    }
  }
  return true;
}

function isHdHouseholdValid(state, userType) {
  return (
    hasValue(state[userType].household.healthcard_province) &&
    hasValue(state[userType].household.birthdate) &&
    hasValue(state[userType].household.userGender) &&
    hasValue(state[userType].household.smoke)
  );
}

export function checkForValidState(nextAction) {
  return (dispatch, getState) => {
    let state = getState();
    const abTestBand = getABTestBand(state);
    const {
      primary: {
        session: {
          household_id, hd_session_id,
        },
      },
    } = state;
    const has_session_id = hd_session_id;

    let { pathname } = state.router.location;
    pathname = stripTrailingSlash(pathname);

    const pageOption = getRoutePageOptions(abTestBand, pathname);
    // !!!! NEW ROUTE VALIDATION GOES HERE !!!!
    // Define stateValidation in pageOptionsConfig.js
    if (pageOption.stateValidation) {
      dispatch(runPageStateValidation(pageOption.stateValidation));
    }

    // TODO: PORT THESE ROUTES TO THE PAGE OPTIONS OBJECT
    // Define the state validation for these old routes in pageOptionsConfig.js
    // !!!! STOP - DO NOT ADD ANY NEW STATE VALIDATION HERE !!!!

    // this should be part of the switch statement below but I can't do
    // regex matching on a switch statement so I opted with an if condition instead
    // this case is to redirect to the start page for users refreshing the page
    if (pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION) &&
      (!household_id || !has_session_id)) {
      dispatch(jumpToStart());
      return true;
    }
    // TODO: PORT THESE ROUTES TO THE PAGE OPTIONS OBJECT
    // Define the state validation for these old routes in pageOptionsConfig.js
    // !!!! STOP - DO NOT ADD ANY NEW STATE VALIDATION HERE !!!!
    switch (pathname) {
      case ROUTES.GETTING_STARTED:
      case ROUTES.QUESTIONS_PARTNER:
        break;

      case ROUTES.QUESTIONS_KIDS:
      case ROUTES.QUESTIONS_KIDS_HOUSING:
      case ROUTES.QUESTIONS_KIDS_EDUCATION:
      case ROUTES.QUESTIONS_BIRTHDATE:
      case ROUTES.QUESTIONS_GENDER:
      case ROUTES.QUESTIONS_SMOKE:
      case ROUTES.QUESTIONS_HEALTH:
      case ROUTES.QUESTIONS_INCOME:
      case ROUTES.QUESTIONS_RESIDENCE:
      case ROUTES.QUESTIONS_EXISTING_COVERAGE:
      case ROUTES.QUESTIONS_SAVINGS:
      case ROUTES.QUESTIONS_DEBTS:
      case ROUTES.QUESTIONS_EXPENSES:
      case ROUTES.QUESTIONS_EMAIL:
      case getRouteWithProductType(ROUTES.QUOTES_ADVICE, PM_PRODUCT_PREFIX.HD):
      case ROUTES.QUESTIONS_EXISTING_POLICIES:
      case ROUTES.APPLICATION_PARTNER_SAME_ADDRESS:
      case ROUTES.APPLICATION_BIRTH_LOCATION:
      case ROUTES.APPLICATION_FINANCES:
      case ROUTES.APPLICATION_EXISTING_POLICIES:
      case ROUTES.APPLICATION_REPLACE_EXISTING_POLICIES:
      case ROUTES.APPLICATION_PENDING_POLICIES:
      case ROUTES.APPLICATION_COMMON_PRIMARY_BENEFICIARIES:
      case ROUTES.APPLICATION_PRIMARY_BENEFICIARIES:
      case ROUTES.APPLICATION_SECONDARY_BENEFICIARIES:
      case ROUTES.APPLICATION_TRUSTEE:
      case ROUTES.APPLICATION_PARTNER_EMAIL:
      case ROUTES.APPLICATION_CELL_PHONE:
      case ROUTES.APPLICATION_REFERRER:
      case ROUTES.APPLICATION_INTEREST:
      case ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL:
      case ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER:
      case ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF:
      case ROUTES.APPLICATION_PARTNER_INFO:
      case ROUTES.APPLICATION_PRIMARY_TRANSITION:
      case ROUTES.APPLICATION_CONSENT:
      case ROUTES.APPLICATION_BASIC_DETAILS:
      case getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY):
      case getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.SECONDARY):
        if (!household_id || !has_session_id) {
          dispatch(jumpToStart());
          return true;
        }
        break;

      case getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD): {
        // Check if any quote in hd_quotes is selected
        // Note: health & dental does not use the selected_quote property under the session object like life & ci, it uses the hd_quotes object instead
        const hdQuotes = state.userControl.hd_quotes || {};
        const hasSelectedQuote = Object.values(hdQuotes).some((quote: any) => quote?.selected);

        if (!hasSelectedQuote) {
          dispatch(updateMetadata('hasCustomError', true));
          // If a user refreshes or starts on the app-start, they will be redirected to the quotes page
          // but the fromStartApp metadata will be true, so we need to set it back to false
          // otherwise the action to create user data will be skipped
          dispatch(updateMetadata('fromStartApp', false));
          dispatch(updateMetadata('allowNoAppIdStartapp', false));
          dispatch(updateMetadata('isShadowAccountStartApp', false));
          dispatch(handleStartAppGoBack(PM_PRODUCT_PREFIX.HD));
          return true;
        }
        break;
      }
      case getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD):
        if (!hasValue(state.primary.household.birthdate)
          || !hasValue(state.primary.household.userGender)
          || !hasValue(state.primary.household.smoke
            || !isJointValid(state))) {
          dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD)));
        }
        break;

      // for HD pages
      case getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD):
        if (!isHdHouseholdValid(state, USER_TYPES.PRIMARY)
          || (isJoint(state) && !isHdHouseholdValid(state, USER_TYPES.SECONDARY))) {
          dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD)));
        }
        break;
      case getRouteWithProductType(ROUTES.GROUP_BENEFITS, PM_PRODUCT_PREFIX.HD):
        if (!isHdHouseholdValid(state, USER_TYPES.PRIMARY)
          || (isJoint(state) && !isHdHouseholdValid(state, USER_TYPES.SECONDARY))) {
          dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD)));
        }
        break;
      case getRouteWithProductType(ROUTES.COVERAGE_FIT_QUESTION, PM_PRODUCT_PREFIX.HD):
        if (!isHdHouseholdValid(state, USER_TYPES.PRIMARY)
          || (isJoint(state) && !isHdHouseholdValid(state, USER_TYPES.SECONDARY))) {
          dispatch(replace(getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD)));
        }
        break;
      default:
        break;
    }

    return nextAction();
  };
}

export function logout() {
  return (dispatch, getState) => {
    segmentReset();
    window.location.href = getUrls().accounts.concat('/account/logout');
  };
}

export function navigateToAccounts() {
  return (dispatch, getState) => {
    const state = getState();
    window.location.replace(`${getUrls().accounts}${ACCOUNT_ROUTES.POLICIES}`);
  };
}

export function navigateToProcessingPayment() {
  return (dispatch, getState) => {
    const state = getState();
    const userType = state.userControl.currentUser;
    dispatch(push(getRouteWithUserType(ROUTES.PAYMENT_IN_PROGRESS, userType)));
  };
}

export function navigateToThankYou() {
  return (dispatch, getState) => {
    const state = getState();
    const user = state.userControl.dashboardUser;
    dispatch(push(getRouteWithUserType(ROUTES.APPROVED_THANK_YOU, user)));
  };
}

export const updateUserSession = (property, value, userType, key = null) => {
  return (dispatch, getState) => {
    if (userType === USER_TYPES.DEPENDENT) {
      return dispatch(updateDependentSession(key, property, value));
    }
    return dispatch(makeUpdateSessionProp(userType)(property, value));
  };
};

export const skipPhoneNumberPage = (state) => {
  const mainProduct = getMainProduct(state, state.userControl.currentUser);
  const skipPrimaryPhone = state.metadata.primary.hasPreExistingPhoneNumber;
  const skipSecondaryPhone = state.metadata.secondary.hasPreExistingPhoneNumber;
  if (!isJoint(state) || mainProduct === PM_PRODUCT_PREFIX.HD) {
    return skipPrimaryPhone;
  }
  return skipPrimaryPhone && skipSecondaryPhone;
};

export const handleConsentPageFlow = () => {
  return (dispatch, getState) => {
    const state = getState();
    if (isMortgageBroker(state) && state.metadata.user_lead_source !== '') {
      dispatch(handleReferrerSteps());
      return dispatch(push(ROUTES.APPLICATION_CONSENT));
    }
    return dispatch(push(ROUTES.APPLICATION_REFERRER));
  };
};

export const checkTraceId = () => {
  return async (dispatch, getState) => {
    const traceId = jsCookie.get('x-policyme-trace-id');
    if (!traceId) {
      await getTraceId();
    }
  };
};

export const checkLoginStatus = (user = null) => {
  return async (dispatch, getState) => {
    const state = getState();
    const userType = user || state.userControl.currentUser;
    try {
      const { logged_in } = await getLoginStatus();
      dispatch(makeUpdateSessionProp(userType)('is_logged_in', logged_in));
      return logged_in;
    } catch (error) {
      sentryError(error);
      dispatch(makeUpdateSessionProp(userType)('is_logged_in', false));
      return false;
    }
  };
};
