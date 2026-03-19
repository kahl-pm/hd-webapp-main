import { goBack, push } from 'connected-react-router';
import { sentryError, sentryWarning, segmentTrackEvent, accountIdWrapper } from '@policyme/global-libjs-utils';
import { getABTestTrackingData } from '../components/Customisation/helpers';
import { ROUTES, USER_TYPES, PM_PRODUCT_PREFIX, UserType, EXPERIENCE_LEVEL } from '../utils/const';
import { postABTestData, upsertUserMetadata, upsertAccountMetadata } from './fetch';
import { transformUserKey } from '../utils/helpers';
import { nextQuestion } from './session';
import { getCurrentDisclosureID } from '../Selectors/disclosure';
import { getMainProductEventPrefix } from '../Selectors/helpers/productApp';
import { getABTestBand } from '../Selectors/metadata';
import { ACTIVE_TESTS } from '../ABTests';

export function incrementSeqNum(product) {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return {
      type: '@@metadata/increment_hd_seq_num',
    };
  }
  return {};
}

export function getSeqNum(product) {
  return (dispatch, getState) => {
    if (product === PM_PRODUCT_PREFIX.HD) {
      return getState().metadata.hd_seq_num;
    }
    return null;
  };
}

export function initializedApp() {
  return {
    type: '@@metadata/initialized_app',
  };
}

export function updateMetadata(property, value) {
  return {
    type: '@@metadata/update_metadata',
    property,
    value,
  };
}

export function updateUserViewedPriceInfo(userType, value) {
  return {
    type: `@@metadata/${userType}/userViewedPriceInfo`,
    value,
  };
}

export function updateUtm(data) {
  return {
    type: '@@metadata/update_utm',
    data,
  };
}

export function closeErrorModal() {
  return {
    type: '@@metadata/close_modal',
  };
}

export function addVerifiedEmail(value) {
  return {
    type: '@@metadata/add_verified_email',
    value,
  };
}

export const addDisclosuresAnswered = (user) => (value) => {
  let userType = transformUserKey(user)[0];
  if (userType === USER_TYPES.DEPENDENT) userType = USER_TYPES.PRIMARY;
  return {
    type: `@@metadata/${userType}/add_disclosures_answered`,
    value,
  };
};

export const makeUpdateMetadata = (user) => (property, value) => {
  return {
    type: `@@metadata/${user}/update_metadata_prop`,
    property,
    value,
  };
};

// TODO (FORM-1013): Remove temporary hack to get prefixed product events
export const makeUpdateMetadataSessionProp = (user) => {
  return (property, value) => {
    return {
      type: `@@metadata/${user}/session/update`,
      property,
      value,
    };
  };
};

// TODO (FORM-1013): Remove temporary hack to get prefixed product events
export const makeUpdateMetadataAppProp = (product, user) => {
  return (property, value) => {
    return {
      type: `@@metadata/${user}/update_metadata_product_app_prop`,
      product,
      property,
      value,
    };
  };
};

export const updateExistingPolicyFlags = (property, value) => {
  return {
    type: '@@metadata/existingPolicies/update',
    property,
    value,
  };
};

// User selected they want to retry when presented with the error modal
// close the error modal and return a promise that calls the function to retry
// This can happen until retryFn resolves or the user clicks back, triggering cancelRequest
export function retryRequest() {
  return (dispatch, getState) => {
    let { retryFn, resolveRetry } = getState().metadata;
    dispatch(closeErrorModal());
    return resolveRetry(retryFn());
  };
}

// User selected they don't want to retry and instead go back
// this will reject the promise being retried and send the user back
// in browser history
export function cancelRequest() {
  return (dispatch, getState) => {
    getState().metadata.rejectRetry();
    dispatch(closeErrorModal());
    dispatch(goBack());
  };
}

const preventNavigation = (navigationEvent) => {
  navigationEvent.preventDefault();
  navigationEvent.returnValue = 'You have unsaved changes that will be lost, are you sure you want to leave?';
};

const trackUnload = (navigationEvent) => {
  segmentTrackEvent('Left Page', {});
};

export function enableBeforeUnload() {
  return (dispatch, getState) => {
    if (!getState().metadata.isBeforeUnloadEnabled) {
      dispatch(updateMetadata('isBeforeUnloadEnabled', true));
      window.addEventListener('beforeunload', preventNavigation);
      window.addEventListener('unload', trackUnload);
    }
  };
}

export function disableBeforeUnload() {
  window.removeEventListener('beforeunload', preventNavigation);
  // commenting out, will send a mixpanel event everytime the user leaves the site
  // window.removeEventListener('unload', trackUnload);
  return {
    type: '@@metadata/update_metadata',
    property: 'isBeforeUnloadEnabled',
    value: false,
  };
}

export function sendPrevAnalytics() {
  return (dispatch, getState) => {
    const state = getState();
    if (state.metadata.sendAnalyticsCb) {
      state.metadata.sendAnalyticsCb();
    }
    // set to undefined
    // updateMetadata('sendAnalyticsCb', undefined);
  };
}

export function beginAdvice() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(updateMetadata('fromQuoteCompare', false));
    dispatch(push(ROUTES.GETTING_STARTED));
  };
}

export function beginAdvicePartner() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(updateMetadata('fromQuoteCompare', false));
    dispatch(updateMetadata('experienceLevel', EXPERIENCE_LEVEL.NOVICE));
    dispatch(push(ROUTES.QUESTIONS_INTRO));
  };
}

export function beginBuildPolicy() {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(updateMetadata('fromQuoteCompare', false));
    dispatch(push(ROUTES.QUESTIONS_PARTNER));
  };
}

export function showConfirmationModal(confirmationHeader, confirmationBodyText) {
  return {
    type: '@@metadata/show_confirmation_modal',
    confirmationHeader,
    confirmationBodyText,
  };
}

export function hideConfirmationModal() {
  return {
    type: '@@metadata/hide_confirmation_modal',
  };
}

export function initChatbot() {
  return {
    type: '@@metadata/init_chatbot',
  };
}

export function initFbFlag() {
  return {
    type: '@@metadata/init_fb_flag',
  };
}

export function queueFbEvent(value) {
  return {
    type: '@@metadata/queue_fb_event',
    value,
  };
}

export function clearFbQueue() {
  return {
    type: '@@metadata/clear_fb_queue',
  };
}

export function initABTestBand(band:string) {
  return {
    type: '@@metadata/init_ab_test_band',
    data: band,
  };
}

export function trackABTest(userType:UserType = USER_TYPES.PRIMARY) {
  return (dispatch, getState) => {
    const state = getState();
    const hd_session_id = state[userType].session.hd_session_id;

    const {
      metadata: { hasSubmittedABTestData, abRequestInFlight },
    } = state;
    const anySessionId = hd_session_id;
    // skip request if request is already running or if all session_ids are empty
    // or hasSubmittedABTestData flag is true
    if ((abRequestInFlight || !anySessionId || hasSubmittedABTestData)
      && userType === USER_TYPES.PRIMARY) {
      return Promise.resolve();
    }

    // Resolve test band into a list of tests
    // This gets persisted to the abtest db table for the purposes
    // of syncing to Hubspot. It is not used for persistence.
    // 'a' variant is disabled, 'b' is enabled
    const testBand = getABTestBand(state);
    const payload = getABTestTrackingData(ACTIVE_TESTS, testBand);

    dispatch(updateMetadata('abRequestInFlight', true));

    return postABTestData(anySessionId, payload)
      .then(() => {
        dispatch(updateMetadata('hasSubmittedABTestData', true));
        dispatch(updateMetadata('abRequestInFlight', false));
      })
      .catch(async err => {
        sentryError(err);
        dispatch(updateMetadata('abRequestInFlight', false));
      });
  };
}

export function initLocationData() {
  return (dispatch, getState) => {
    if (process.env.BROWSER) {
      try {
        dispatch(updateMetadata('documentReferrer', document.referrer));
        dispatch(updateMetadata('initialWindowLocationHref', window.location.href));
      } catch (e) {
        sentryWarning(e, { extras: { rootCause: 'unable to get document.referrer or window.location.href' } });
      }
    }
  };
}

export function updateMetadataAndNext(property, val) {
  return async (dispatch, getState) => {
    await dispatch(updateMetadata(property, val));
    dispatch(nextQuestion());
  };
}

export function updateDisclosureAnswered(userType, question) {
  return (dispatch, getState) => {
    dispatch(addDisclosuresAnswered(userType)(question));
  };
}

export function clearUnansweredDisclosures(userKeyType) {
  return (dispatch, getState) => {
    const state = getState();
    const [userType, key] = transformUserKey(userKeyType);
    if (userType === USER_TYPES.DEPENDENT) return;
    const currentDisclosureID = getCurrentDisclosureID(state);
    let disclosuresAnswered = state.metadata[userType].disclosuresAnswered.filter(
      disclosure => disclosure < currentDisclosureID,
    );
    dispatch(makeUpdateMetadata(userType)('disclosuresAnswered', disclosuresAnswered));
  };
}

export const doBannerSliderAnimation = () => {
  return (dispatch) => {
    dispatch(updateMetadata('paymentSliderDown', true));
    setTimeout(() => {
      dispatch(updateMetadata('paymentSliderDown', false));
    }, 5000);
  };
};

export function updateAirMilesMetadata(optionSelected: string, airmilesNumber?: string) {
  return {
    type: '@@metadata/update_metadata',
    property: 'airmiles',
    value: {
      optionSelected,
      number: airmilesNumber || '',
    },
  };
}

export function handleUpdateAirmilesNumber(userType) {
  return accountIdWrapper(handleUpdateAirmilesNumberUserId, handleUpdateAirmilesNumberAccountId, userType);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleUpdateAirmilesNumberAccountId} instead
 */
function handleUpdateAirmilesNumberUserId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const { user_id } = state[userType].session;
    await upsertUserMetadata(user_id, 'airmiles_number', state.metadata.airmiles?.number || '');
  };
}

function handleUpdateAirmilesNumberAccountId(userType) {
  return async (dispatch, getState) => {
    const state = getState();
    const { account_id } = state[userType].session;
    await upsertAccountMetadata(account_id, 'airmiles_number', state.metadata.airmiles?.number || '');
  };
}
