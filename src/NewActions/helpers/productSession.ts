import { COVERAGES, TERMS } from '../../constants/session';
import { getProductSessionTerm, getProductTotalAmt } from '../../Selectors/helpers/productSession';
import {
  canRequote,
  getAllUserQuotes,
  getNonDiscountedMonthlyUserTypePrem,
  getNonDiscountedYearlyUserTypePrem,
  getPmMonthlyUserTypeAppliedDiscounts,
  getUserQuotes,
  getQuotesDiscountCodes,
} from '../../Selectors/quotes';
import {
  allProducts,
  allUsers,
  calcAge,
  calcAgeNearest,
  getAvailableTerms,
  makeUpdateProductSessionProp,
  makeUpdateAllUsersSessionProp,
  makeUpdateTerm,
  makeUpdateCustomCoverage,
  makeResetAllQuoteSelection,
  withErrorModalOnFail,
} from '../../utils/helpers';
import { preDecisionRequoteActual, requoteRecmd } from '../quotes';
import { updateHasPartnerApplication } from '../userControl';
import { patchProductSession, postAssociateJointProductSessions } from './productFetch';

import { PM_PRODUCT_PREFIX, QUOTE_TYPES, USER_TYPES } from '../../utils/const';

import { postProductSessionDiscounts } from '../fetch';
import { reInitJointMetadata } from '../jointMetadata';
import { makeReInitProductApp } from './productApp';
import { hasDependents, isJoint } from '../../Selectors/userControl';
import { ProductPrefix } from '../../Selectors/helpers/productApp';

export function getSelectedRecommendedAmt(
  state,
  userType = USER_TYPES.PRIMARY,
  product = PM_PRODUCT_PREFIX.HD,
) {
  let optionAmount = 0;
  const session = state[userType][`${product}Session`];
  if (session.options.length && session.selected_opt) {
    const selectedOption = session.options.find(o => o.id === session.selected_opt);
    optionAmount = selectedOption.amt;
  }
  return Math.max(0, optionAmount);
}

export const updateAllUserSessionPropAllProducts = (property, value) => {
  return (dispatch, getState) => {
    const state = getState();
    const products = state.userControl.availableProducts;
    products.forEach(p => {
      dispatch(makeUpdateAllUsersSessionProp(p)(property, value));
    });
  };
};

export const updateSessionPropAllProducts = (property, value, userType) => {
  return (dispatch, getState) => {
    const state = getState();
    const products = state.userControl.availableProducts;
    products.forEach(p => {
      dispatch(makeUpdateProductSessionProp(userType, p)(property, value));
    });
  };
};

export const updateAllUserSessionProp = (property, value, product) => {
  return (dispatch, getState) => {
    dispatch(makeUpdateAllUsersSessionProp(product)(property, value));
  };
};

// No-op: Life-specific recommendation requote removed for HD-only flow
export function updateRecmdAndRequote() {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
}

export const updateCustomCoverageAllProducts = (value) => {
  return (dispatch, getState) => {
    const state = getState();
    const products = state.userControl.availableProducts;
    products.forEach(p => {
      dispatch(makeUpdateCustomCoverage(p)(value));
    });
  };
};

export function updateCustomCoverageAndRequoteAllProducts(value,
  mainProduct: ProductPrefix = PM_PRODUCT_PREFIX.HD) {
  return async (dispatch, getState) => {
    const products = getState().userControl.availableProducts;
    products.forEach(async (p) => {
      let cov = value;
      await dispatch(makeUpdateCustomCoverage(p)(cov));
      await dispatch(makeResetAllQuoteSelection(p));
      if (canRequote(getState(), USER_TYPES.PRIMARY)) {
        return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, p));
      }
      return Promise.resolve();
    });
  };
}

export function updateCustomCoverageAndRequote(value, product = PM_PRODUCT_PREFIX.HD) {
  return async (dispatch, getState) => {
    await dispatch(makeUpdateCustomCoverage(product)(value));
    await dispatch(makeResetAllQuoteSelection(product));
    if (canRequote(getState(), USER_TYPES.PRIMARY)) {
      return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
    }
    return Promise.resolve();
  };
}

export function updateTermAndRequoteAllProducts(value:number) {
  return async (dispatch, getState) => {
    const products = getState().userControl.availableProducts;

    products.forEach(async (p:string) => {
      await dispatch(makeUpdateTerm(p)(value));

      await dispatch(makeResetAllQuoteSelection(p));
      if (canRequote(getState(), USER_TYPES.PRIMARY)) {
        return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, p));
      }
      return Promise.resolve();
    });
  };
}

// private action, we need userControl set before we do most of this
// so it's split into another helper action
export const _updateJointQuoteAndRequote = allUsers((userType, key, product, _quoteType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const hasPartnerApplication = state.userControl.hasPartnerApplication;
    let quoteType = _quoteType;
    if (hasPartnerApplication && userType === USER_TYPES.SECONDARY) {
      quoteType = QUOTE_TYPES.SECONDARY;
    }
    await dispatch(
      makeUpdateProductSessionProp(userType, product)(
        'selected_quote_type',
        quoteType,
      ),
    );
    await dispatch(makeResetAllQuoteSelection(product));
    // Reset state for lifeapps when switching between joint & single
    dispatch(makeReInitProductApp(USER_TYPES.PRIMARY, product));
    dispatch(makeReInitProductApp(USER_TYPES.SECONDARY, product));
    dispatch(reInitJointMetadata());
    // reInitExistingPolicies removed (Life/CI only)
  };
});

export const updateJointQuoteAndRequote = (quoteType, product = PM_PRODUCT_PREFIX.HD) => {
  return async (dispatch, getState) => {
    dispatch(updateHasPartnerApplication(quoteType === QUOTE_TYPES.JOINT));
    dispatch(_updateJointQuoteAndRequote(product, quoteType));

    // only want to requote once, not per-user
    if (canRequote(getState(), USER_TYPES.PRIMARY)) {
      return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
    }
    return Promise.resolve();
  };
};

// Simplified for HD-only flow
const updateSelectedTermIfNotEligible = () => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow: term eligibility is Life/CI-specific
  };
};

export const updateJointQuoteAndRequoteAllProducts = (quoteType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const products = state.userControl.availableProducts;

    products.forEach(product => {
      dispatch(updateHasPartnerApplication(quoteType === QUOTE_TYPES.JOINT));
      dispatch(_updateJointQuoteAndRequote(product, quoteType));

      // only want to requote once, not per-user
      if (canRequote(getState(), USER_TYPES.PRIMARY)) {
        return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, product));
      }
      return Promise.resolve();
    });
  };
};

export function updateSelectedQuote(value, product) {
  return (dispatch, getState) => {
    dispatch(updateAllUserSessionProp('selected_quote', value, product));
    if (!getState().userControl.hasPartnerApplication) {
      dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, product)('selected_quote_type', QUOTE_TYPES.PRIMARY));
    }
  };
}

export function updateSelectedQuoteToInsurer(insurer, product) {
  return (dispatch, getState) => {
    const userQuotes = getUserQuotes(getState(), product);
    const selectedQuote = userQuotes.find(q => q.company === insurer);
    if (selectedQuote) {
      dispatch(updateSelectedQuote(selectedQuote.id, product));
    }
  };
}

const patchProductSessionPayload = (state, userType, product) => {
  return {
    override_amt: getProductTotalAmt(state, userType, product),
    selected_term: getProductSessionTerm(state, userType, product),
    selected_quote: state[userType][`${product}Session`].selected_quote,
    selected_quote_type: state[userType][`${product}Session`].selected_quote_type,
    joint_role: state[userType][`${product}Session`].joint_role,
    quotes: getAllUserQuotes(state, product),
  };
};

export const makePatchProductSessionRecord = (userType, product) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { session } = state[userType];
    const payload = patchProductSessionPayload(state, userType, product);
    return withErrorModalOnFail(patchProductSession, dispatch)(
      product, session, payload,
    );
  };
};

export const makeAssociateJointProductSessions = (product) => {
  return (dispatch, getState) => {
    const {
      primary: { session: { [`${product}_application_id`]: primary_app_id } },
      secondary: { session: { [`${product}_application_id`]: secondary_app_id } },
    } = getState();

    return withErrorModalOnFail(postAssociateJointProductSessions, dispatch)(
      product, primary_app_id, secondary_app_id,
    );
  };
};

export const postSessionDiscounts = allProducts((product, userType = USER_TYPES.PRIMARY) => {
  return async (dispatch, getState) => {
    const state = getState();

    const session_id = state[userType].session[`${product}_session_id`];
    // skip discounts if no life_session record exists
    if (!session_id) {
      return null;
    }
    let discounts;
    let orig_mn_prems;
    let orig_yr_prems;
    if (product === PM_PRODUCT_PREFIX.HD) {
      discounts = getQuotesDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD);
      // Not needed for health and dental
      orig_mn_prems = 0;
      orig_yr_prems = 0;
    } else {
      // Non-HD products not expected in HD-only flow
      discounts = [];
      orig_mn_prems = 0;
      orig_yr_prems = 0;
    }
    const payload = {
      discounts,
      orig_mn_prems,
      orig_yr_prems,
      is_joint: state.userControl.hasPartnerApplication,
      has_dependents: hasDependents(state),
      product_prefix: product,
    };
    return withErrorModalOnFail(postProductSessionDiscounts, dispatch)(session_id, payload);
  };
});
