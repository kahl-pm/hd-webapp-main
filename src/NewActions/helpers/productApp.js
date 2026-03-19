import { sentryError } from '@policyme/global-libjs-utils';
import {
  getAppBuyingMethod,
  getAppFamilyId,
  getHDAppPlanType,
  getAppProductAdded,
  getAppUnderwritingMethod,
  getMainProduct,
  getAppInsuranceOwnershipType,
} from '../../Selectors/helpers/productApp';
import { getProductSessionTerm, getProductTotalAmt } from '../../Selectors/helpers/productSession';
import { isPermanentInsurance } from '../../Selectors/metadata';
import { getPmUserTypeQuote } from '../../Selectors/quotes';
import {
  APP_FORM_SCHEMA_VERS, BUYING_METHOD, PM_PRODUCT_PREFIX, PM_PRODUCT_TYPE, USER_TYPES,
} from '../../utils/const';
import {
  withErrorModalOnFail,
  allUsers,
  caaProductNameToPM,
} from '../../utils/helpers';
import { doCrmSyncUpsertContactAndDeal } from '../crm';
import { makeUpdateMetadata, makeUpdateMetadataAppProp } from '../metadata';
import { patchProductApp, postProductApp, postProductAppForAccount, patchInsuranceOwnershipType } from './productFetch';
import { allCrossSellableUsers } from './userWrappers';
import { getExternalAdvisorId } from '../../Selectors/productApp';
import { isJoint } from '../../Selectors/userControl';
import { updateSessionPropPrimary, updateSessionPropSecondary } from '../session';
import { accountIdWrapper } from '@policyme/global-libjs-utils';

export const getApplicationPayload = (state, userType, product) => {
  let selectedQuote = getPmUserTypeQuote(state, userType, product);
  let aura_recent_labs_and_vitals_disclosure = '';
  if (state[userType][`${product}App`].aura_recent_labs_and_vitals_disclosure === 'Unsure') {
    aura_recent_labs_and_vitals_disclosure =
      state[userType][`${product}App`].aura_recent_labs_and_vitals_disclosure;
  } else if (state.jointMetadata.has_done_blood_urine_height_weight !== '') {
    aura_recent_labs_and_vitals_disclosure =
      state[userType][`${product}App`].aura_recent_labs_and_vitals_disclosure ?
        'Y' :
        'N';
  }

  let payload = {
    email: state[userType].household.email,
    cov_amt: getProductTotalAmt(state, userType, product),
    term_len: getProductSessionTerm(state, userType, product),
    insurer: selectedQuote.company,
    mn_prems: selectedQuote.mn_prems,
    yr_prems: selectedQuote.yr_prems,
    is_from_saved_quote: state[userType][`${product}App`].is_from_saved_quote,
    aura_recent_labs_and_vitals_disclosure,
    product_added: getAppProductAdded(state, userType, product),
  };

  if (product === PM_PRODUCT_PREFIX.HD) {
    let plan_type = getHDAppPlanType(state);
    payload = {
      ...payload,
      hd_session_id: state.primary.session.hd_session_id,
      plan_type,
    };
  }

  return payload;
};

export const makePostProductAppRecord = (userType, product) => {
  return accountIdWrapper(makePostProductAppRecordUserId, makePostProductAppRecordAccountId, userType, product);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link makePostProductAppRecordAccountId} instead
 */
const makePostProductAppRecordUserId = (userType, product) => {
  return async (dispatch, getState) => {
    const state = getState();
    let payload = getApplicationPayload(state, userType, product);

    const product_session_id = state[userType].session[`${product}_session_id`];

    // buying method & user_id should only be set in the create step
    payload = {
      ...payload,
      user_id: state[userType].session.user_id,
      buying_method: getAppBuyingMethod(state, userType, product),
      family_id: getAppFamilyId(state, userType, product),
      underwriting_method: getAppUnderwritingMethod(state, userType, product),
      external_advisor_id: getExternalAdvisorId(state),
      insurance_ownership_type: getAppInsuranceOwnershipType(state, userType, product),
    };
    return withErrorModalOnFail(postProductApp, dispatch)(product, product_session_id, payload);
  };
};

const makePostProductAppRecordAccountId = (userType, product) => {
  return async (dispatch, getState) => {
    const state = getState();
    let payload = getApplicationPayload(state, userType, product);

    const product_session_id = state[userType].session[`${product}_session_id`];

    // buying method & account_id should only be set in the create step
    payload = {
      ...payload,
      account_id: state[userType].session.account_id,
      buying_method: getAppBuyingMethod(state, userType, product),
      family_id: getAppFamilyId(state, userType, product),
      underwriting_method: getAppUnderwritingMethod(state, userType, product),
      external_advisor_id: getExternalAdvisorId(state),
      insurance_ownership_type: getAppInsuranceOwnershipType(state, userType, product),
    };
    return withErrorModalOnFail(postProductAppForAccount, dispatch)(product, product_session_id, payload);
  };
};

export const makePatchProductAppRecord = (userType, product) => {
  return (dispatch, getState) => {
    const state = getState();
    const app_id = state[userType].session[`${product}_application_id`];
    const payload = getApplicationPayload(state, userType, product);

    return withErrorModalOnFail(patchProductApp, dispatch)(product, app_id, payload);
  };
};

export const makePatchInsuranceOwnershipType = (userType, product) => {
  return (dispatch, getState) => {
    const state = getState();
    const app_id = state[userType].session[`${product}_application_id`];
    if (!app_id) {
      return Promise.resolve();
    }
    const insuranceOwnershipType = getAppInsuranceOwnershipType(state, userType, product);
    const payload = {
      insurance_ownership_type: insuranceOwnershipType,
    };

    return withErrorModalOnFail(patchInsuranceOwnershipType, dispatch)(app_id, payload);
  };
};

export const makeReInitProductApp = (slice, product) => {
  return () => {
    return {
      type: `@@${slice}/${product}App/reinit`,
    };
  };
};

// No-op: Cross-sell linked applications removed for HD-only flow
export const createCrossSellLinkedApplications = (userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
};

export const makeUpdateProductAppProp = (product, userType) => {
  return (property, value) => {
    return {
      type: `@@${userType}/${product}App/update`,
      property,
      value,
    };
  };
};

export const updateProductBuyingMethod = (buying_method, userType, product) => {
  return (dispatch, getState) => {
    dispatch(makeUpdateProductAppProp(product, userType)('buying_method', buying_method));
    // TODO (FORM-1013): Remove temporary hack to get prefixed product events
    dispatch(makeUpdateMetadataAppProp(product, userType)('buying_method', buying_method));
    const payload = { buying_method };
    const app_id = getState()[userType].session[`${product}_application_id`];
    return withErrorModalOnFail(patchProductApp, dispatch)(product, app_id, payload);
  };
};

export const updateProductAdded = (product_added, userType, product) => {
  return (dispatch, getState) => {
    dispatch(makeUpdateProductAppProp(product, userType)('product_added', product_added));
    // TODO (FORM-1013): Remove temporary hack to get prefixed product events
    dispatch(makeUpdateMetadataAppProp(product, userType)('product_added', product_added));
    const payload = { product_added };
    const app_id = getState()[userType].session[`${product}_application_id`];
    return withErrorModalOnFail(patchProductApp, dispatch)(product, app_id, payload);
  };
};

// No-op: CI after-sell logic removed for HD-only flow
export const updateCIOptedInAfterSell = (userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
};

// Remark: userType has to be the first argument of passed in fn
export const setAppBuyingMethodAndProductAdded =
  allCrossSellableUsers((userType, mainProduct, buyingMethodOverride = null) => {
    return async (dispatch, getState) => {
      let state = getState();

      const {
        userControl: { availableProducts },
      } = state;

      return availableProducts.forEach(product => {
        // skip current iteration if we already have it
        if (getAppBuyingMethod(state, userType, product)) {
          return Promise.resolve();
        }
        let buying_method = null;
        let product_added = null;
        if (mainProduct === PM_PRODUCT_PREFIX.HD) {
          buying_method = product === PM_PRODUCT_PREFIX.HD ?
            BUYING_METHOD.STAND_ALONE : BUYING_METHOD.CROSS_SELL;
          if (product === PM_PRODUCT_PREFIX.HD && buying_method === BUYING_METHOD.STAND_ALONE) {
            product_added = true;
          }
        }

        dispatch(makeUpdateProductAppProp(product, userType)('buying_method', buying_method));
        dispatch(makeUpdateProductAppProp(product, userType)('product_added', product_added));
        // TODO (FORM-1013): Remove temporary hack to get prefixed product events
        dispatch(makeUpdateMetadataAppProp(product, userType)('buying_method', buying_method));
        dispatch(makeUpdateMetadataAppProp(product, userType)('product_added', product_added));
        return Promise.resolve();
      });
    };
  });

// No-op: Life-specific simplified/guaranteed issue app creation removed for HD-only flow
export const createSimplifiedLifeApp = allUsers((userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
});

// No-op: Life-specific simplified/guaranteed issue app creation removed for HD-only flow
export const createGuaranteedIssueLifeApp = allUsers((userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
});
