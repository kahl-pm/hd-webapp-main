import { sentryError, sentryInfo } from '@policyme/global-libjs-utils';

import { postCrm } from './fetch';
import {
  CRM_SYNC_TYPES, CRM_LIFE_SESSION_FIELDS, USER_LEAD_SOURCES_VALUES,
} from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { allProducts } from '../utils/helpers';

export const hasOtherSourceSpecified = (userLeadSource) => {
  return userLeadSource === USER_LEAD_SOURCES_VALUES.INFLUENCER.value
    || userLeadSource === USER_LEAD_SOURCES_VALUES.PODCAST_OR_RADIO.value
    || userLeadSource === USER_LEAD_SOURCES_VALUES.OTHER.value;
};

// No-op: Life joint deal properties sync removed for HD-only flow
export const doCrmSyncJointLifeDealProps = () => {
  return (dispatch, getState) => {
    // No-op for HD-only flow
    return Promise.resolve();
  };
};

export const doCrmSyncReferrer = (userType) => {
  return (dispatch, getState) => {
    const state = getState();
    const userLeadSource = state.metadata[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE];
    const userLeadSourceOther = hasOtherSourceSpecified(userLeadSource) ?
      state.metadata[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER] : '';

    const payload = {
      [CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE]:
        state.metadata[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE],
      [CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER]:
        userLeadSourceOther,
    };

    return dispatch(doCrmSyncUpsertContactAndDeal(userType, payload));
  };
};

export const doCrmSyncPatchContact = (userType, product, data = {}) => {
  return (dispatch, getState) => {
    const state = getState();
    const pathname = state.router && state.router.location
      && state.router.location.pathname;

    const payload = {
      sync_type: CRM_SYNC_TYPES.PATCH_CONTACT,
      identifiers: {
        email: state[userType].household.email,
        session_id: state[userType].session[`${product}_session_id`],
      },
      data,
      source: `HD - ${pathname || 'unknown'}`,
    };

    return postCrm(payload)
      .catch(err => {
        sentryError(err, { tags: { rootCause: 'crm_sqs' } });
        return Promise.resolve();
      });
  };
};

export const doCrmSyncUpsertContact = (userType, data = {}) => {
  return (dispatch, getState) => {
    const state = getState();
    const pathname = state.router && state.router.location
      && state.router.location.pathname;
    const product = getMainProduct(state, userType);
    const session_id = state[userType].session[`${product}_session_id`];

    const payload = {
      sync_type: CRM_SYNC_TYPES.UPSERT_CONTACT,
      identifiers: {
        email: state[userType].household.email,
        session_id,
      },
      data,
      source: `HD - ${pathname || 'unknown'}`,
    };

    return postCrm(payload)
      .catch(err => {
        sentryError(err, { tags: { rootCause: 'crm_sqs' } });
        return Promise.resolve();
      });
  };
};

export const doCrmSyncUpsertContactAndDeal = (userType, data = {}) => {
  return (dispatch, getState) => {
    const state = getState();
    const pathname = state.router && state.router.location
      && state.router.location.pathname;

    const product = getMainProduct(state, userType);
    // identifier is the product session_id (e.g. hd_session_id)
    const session_id = state[userType].session[`${product}_session_id`];
    const email = state[userType].household.email;

    // Log to Sentry if email or session_id are missing BEFORE making API call
    if (!email || !session_id) {
      sentryInfo('CRM sync attempted with missing identifiers', {
        tags: {
          rootCause: 'crm_missing_identifiers',
          userType,
          pathname: pathname || 'unknown',
        },
        extras: {
          hasEmail: !!email,
          hasSessionId: !!session_id,
          product,
          locationHistory: state.metadata?.locationHistory,
          prevRoute: state.metadata?.prevRoute,
          currRoute: state.router?.location?.pathname,
          backPressed: state.metadata?.backPressed,
          forwardPressed: state.metadata?.forwardPressed,
          routerAction: state.router?.action,
          routerSearch: state.router?.location?.search,
          routerHash: state.router?.location?.hash,
          routerKey: state.router?.location?.key,
          paymentCompleted: state[userType].hdDecision?.paymentInitialCompleted || false,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          referrer: typeof document !== 'undefined' ? document.referrer : undefined,
          navigationType: typeof performance !== 'undefined' && performance.getEntriesByType ?
            (performance.getEntriesByType('navigation')[0]?.type || undefined) : undefined,
        },
      });
    }

    const payload = {
      sync_type: CRM_SYNC_TYPES.UPSERT_CONTACT_DEAL,
      identifiers: {
        email: state[userType].household.email,
        session_id,
      },
      data,
      source: `HD - ${pathname || 'unknown'}`,
    };

    return postCrm(payload)
      .catch(err => {
        sentryError(err, { tags: { rootCause: 'crm_sqs' } });
        return Promise.resolve();
      });
  };
};

export const doCrmSyncPatchDeal = (userType, product, data) => {
  return (dispatch, getState) => {
    const state = getState();
    const pathname = state.router && state.router.location
      && state.router.location.pathname;

    const payload = {
      sync_type: CRM_SYNC_TYPES.PATCH_DEAL,
      identifiers: {
        session_id: state[userType].session[`${product}_session_id`],
      },
      data,
      source: `HD - ${pathname || 'unknown'}`,
    };

    return postCrm(payload)
      .catch(err => {
        sentryError(err, { tags: { rootCause: 'crm_sqs' } });
        return Promise.resolve();
      });
  };
};

export const doCrmSyncPatchDealAllProducts = allProducts((product,
  userType, data) => {
  return (dispatch, getState) => {
    return dispatch(doCrmSyncPatchDeal(userType, product, data));
  };
});

// No-op: Life/CI followup submission removed for HD-only flow
export const doCrmSyncSubmitFollowup = (
  userType, followupType, timestamp,
) => {
  return (dispatch, getState) => {
    // No-op for HD-only flow
    return Promise.resolve();
  };
};
