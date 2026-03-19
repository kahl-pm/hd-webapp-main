import moment from 'moment';
import { getUrls, sentryError, segmentTrackEvent } from '@policyme/global-libjs-utils';
import { sendEventAll } from './analytics';
import {
  postDocusignEnvelope,
  postDocusignEnvelopeUpload,
} from './fetch';
import { patchProductPolicies } from './helpers/productFetch';
import {
  updateMetadata,
  disableBeforeUnload,
} from './metadata';
import {
  doCrmSyncPatchDeal,
} from './crm';
import {
  ROUTES,
  DOCUSIGN_INITIALIZE_ENVELOPE_CODES,
  DOCUSIGN_SOURCE_TYPE,
  DOCUSIGN_URL_STATUS,
  CRM_LIFE_SESSION_FIELDS,
  DOCUSIGN_EVENT_CODE,
  DOWNLOAD_MY_POLICY_STATUSES,
  POLICY_SIGNED_STATUS,
  USER_TYPES,
  PM_PRODUCT_PREFIX,
} from '../utils/const';
import { GLOBAL_ROUTE } from '../config';
import { makeUpdateProductPolicyProp } from './helpers/productPolicy';
import { getMainProductEventPrefix } from '../Selectors/helpers/productApp';
import { formatDateByLocale } from '../utils/reactIntlHelpers';

// docusign links expire (default after 5 min) so this action removes
// an existing link from memory to prevent its use
export const expireDocusignLink = () => {
  return (dispatch, getState) => {
    dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.UNINITIALIZED));
    return dispatch(updateMetadata('docusignUrl', ''));
  };
};

export const sendDocusignDownloadPolicyFailedStatus = (dispatch, userType, product) => {
  const payload = {
    [CRM_LIFE_SESSION_FIELDS.DOWNLOAD_MY_POLICY_STATUS]:
      DOWNLOAD_MY_POLICY_STATUSES.FAILED,
  };
  dispatch(doCrmSyncPatchDeal(userType, product, payload));
};

export const getDocusignEnvelope = (userType, product, source) => {
  return (dispatch, getState) => {
    const state = getState();
    const { is_download_policy_journey } = getState().metadata;

    // if request in flight or docusign event code is declined, we return right away
    if (getState().metadata.docusignUrlStatus === DOCUSIGN_URL_STATUS.PENDING ||
      getState().metadata.docusignEvent === DOCUSIGN_EVENT_CODE.DECLINE) {
      return Promise.resolve();
    }

    dispatch(disableBeforeUnload());

    const policy_id = state[userType].session[`${product}_policy_id`];
    dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.PENDING));
    return postDocusignEnvelope(
      policy_id, source, userType, is_download_policy_journey,
    )
      .then((res) => {
        if (res.code === DOCUSIGN_INITIALIZE_ENVELOPE_CODES.OKAY) {
          let { url, ...rest } = res.data;
          // dispatch(sendEventAll('WW - DocuSign - DocuSign Load Success'));
          dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.READY));
          return dispatch(updateMetadata('docusignUrl', url));
        } else if (res.code === DOCUSIGN_INITIALIZE_ENVELOPE_CODES.SKIP) {
          // back end determines we can skip docusigning
          // skipping the envelope when testing on prod
          // show thank you page for docusigned
          let url = `${getUrls().homepage}${GLOBAL_ROUTE}${ROUTES.DOCUSIGN_APPLICATION_CALLBACK}`;
          dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.READY));
          return dispatch(updateMetadata('docusignUrl', url));
        }
        // unknown error code
        if (is_download_policy_journey) {
          sendDocusignDownloadPolicyFailedStatus(dispatch, userType, product);
        }
        dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.ERROR));
        sentryError(new Error(
          'unknown initialize envelope code', {
            extras: { rootCause: 'DocuSign' },
            tags: { rootCause: 'DocuSign' },
          },
        ));
        return Promise.resolve();
      })
      .catch((err) => {
        if (is_download_policy_journey) {
          sendDocusignDownloadPolicyFailedStatus(dispatch, userType, product);
        }
        dispatch(updateMetadata('docusignUrl', undefined));
        dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.ERROR));
        dispatch(sendEventAll('WW - DocuSign - DocuSign Load Error'));
        sentryError(
          'error getting docusign URL', {
            extras: { rootCause: 'DocuSign' },
            tags: { rootCause: 'DocuSign' },
          },
        );
        return Promise.reject(err);
      });
  };
};

export const postDocusignResults = (userType, product) => {
  return (dispatch, getState) => {
    const event = getState().metadata.docusignEvent;
    const policy_id = getState()[userType].session[`${product}_policy_id`];
    const application_language = getState()[userType].household.application_language;

    if (!event) {
      // This means payments will fail, since it checks for a valid effective date and
      // that the document is signed, which we are not able to update below because of
      // this missing status.  We don't have a good error message at this time so we go forward
      // TODO: NP2-317 can we show an error here?
      sentryError('Docusign - no event result from docusign after redirecting to policyme');
      return Promise.resolve();
    }
    let productPrefix = getMainProductEventPrefix(getState(), userType);
    segmentTrackEvent(`${productPrefix} - Docusign Callback event=${event}`);
    if (event === DOCUSIGN_EVENT_CODE.SIGNING_COMPLETE) {
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.POLICY_SIGNED_STATUS]: POLICY_SIGNED_STATUS.COMPLETED,
        [CRM_LIFE_SESSION_FIELDS.ANNUAL_PAYMENT_DAY]: moment().format('MMMM Do'),
        [CRM_LIFE_SESSION_FIELDS.MONTHLY_PAYMENT_DAY]: moment().format('Do'),
        [CRM_LIFE_SESSION_FIELDS.ANNUAL_PAYMENT_DAY_CLIENT_FACING]:
          formatDateByLocale(application_language),
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
    } else if (event === DOCUSIGN_EVENT_CODE.VIEWING_COMPLETE) {
      // Do nothing, already set it to signed
    } else if (event === DOCUSIGN_EVENT_CODE.CANCEL) {
      // User pressed finish later
      // Don't send anything now, user will be redirected back to try again
    } else if (event === DOCUSIGN_EVENT_CODE.SESSION_TIMEOUT) {
      // User stayed on docusign too long and session has timed out
      // Don't send anything now, user will be redirected back to try again
    } else if (event === DOCUSIGN_EVENT_CODE.TTL_EXPIRED) {
      // User attempted to use a single-use link twice
      // Don't send anything now, user will be redirected back to try again
    } else if (event === DOCUSIGN_EVENT_CODE.DECLINE) {
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.POLICY_SIGNED_STATUS]: POLICY_SIGNED_STATUS.DECLINED,
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
    } else {
      let currentUrl;
      if (typeof window !== 'undefined') {
        currentUrl = window.location.href;
      }
      sentryError('Docusign - Signing process failed', { extras: { current_url: currentUrl } });
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.POLICY_SIGNED_STATUS]: POLICY_SIGNED_STATUS.FAILED,
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
    }
    // TODO: NP2-317 set this status to failed in certain failure cases
    const payload = {
      policy_document_signature_completed: false,
    };
    if (
      event === DOCUSIGN_EVENT_CODE.SIGNING_COMPLETE
      || event === DOCUSIGN_EVENT_CODE.VIEWING_COMPLETE
    ) {
      // backend logic will handle effective date when signature is completed
      payload.policy_document_signature_completed = true;
      dispatch(makeUpdateProductPolicyProp(userType,
        product)('policy_document_signature_completed', true));
      dispatch(handleSignedEnvelopeAutoUploadToBox(policy_id));
    }

    return patchProductPolicies(product, policy_id, payload);
  };
};

export const handleSignedEnvelopeAutoUploadToBox = (policy_id) => {
  return (dispatch, getState) => {
    return postDocusignEnvelopeUpload(policy_id)
      .catch(err => {
        sentryError('Unable to upload signed docusign envelope to box', { extras: { policy_id } });
        return Promise.resolve();
      });
  };
};

export const openDocusignEnvelope = (userType, product) => {
  return (dispatch, getState) => {
    const { docusignUrl } = getState().metadata;
    dispatch(updateMetadata('docusignUrlStatus', DOCUSIGN_URL_STATUS.UNINITIALIZED));
    dispatch(updateMetadata('docusignUrl', ''));
    const { is_download_policy_journey } = getState().metadata;
    if (is_download_policy_journey) {
      const payload = {
        [CRM_LIFE_SESSION_FIELDS.DOWNLOAD_MY_POLICY_STATUS]: DOWNLOAD_MY_POLICY_STATUSES.SUCCESS,
      };
      dispatch(doCrmSyncPatchDeal(userType, product, payload));
      if (typeof window !== 'undefined') {
        window.location.href = docusignUrl;
      }
    } else if (typeof window !== 'undefined') {
      window.location.href = docusignUrl;
    }
  };
};

export const getDocusignEnvelopeAndOpen = (userType, product, source) => {
  return async (dispatch, getState) => {
    await dispatch(getDocusignEnvelope(userType, product, source));
    return dispatch(openDocusignEnvelope(userType, product));
  };
};

export function handleDocusignNewLink() {
  return (dispatch, getState) => {
    return dispatch(getDocusignEnvelope(USER_TYPES.PRIMARY, DOCUSIGN_SOURCE_TYPE.EMAIL));
  };
}

// No-op: Life/CI docusign envelope logic removed for HD-only flow
export const getProductDocusignEnvelope = (userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
};
