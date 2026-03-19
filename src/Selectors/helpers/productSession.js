import { PM_PRODUCT_PREFIX } from '../../utils/const';
import { CAA_DISCOUNTS } from '../../utils/discounts';
import { getQuotesDiscountCodes } from '../quotes';

const getProductTotalAmt = (state, userType, product) => {
  let ret = 0;
  const override_amt = state[userType][`${product}Session`].override_amt;
  const recmd_cov_amt = state[userType][`${product}Session`].recmd_cov_amt;

  if (product === PM_PRODUCT_PREFIX.HD) {
    // TODO: verify this works when we implement ci logic
    ret = state[userType][`${product}Session`].coverage_amount;
    if (!ret && state[userType][`${product}Session`].default_coverage) {
      ret = state[userType][`${product}Session`].default_coverage;
    }
    if (override_amt > 0) {
      ret = override_amt;
    } else if (recmd_cov_amt) {
      ret = recmd_cov_amt;
    }
  }

  return ret;
};

const getProductSessionTerm = (state, userType, product) => {
  let ret = '';
  const term = state[userType][`${product}Session`].term;
  const selected_term = state[userType][`${product}Session`].selected_term;
  if (selected_term) {
    ret = selected_term;
  } else if (term) {
    ret = term;
  }

  return ret;
};

const getProductApplicationDate = (state, userType, product) => {
  return state[userType][`${product}Policy`].applicationDate;
};

const getProductDiscountCodes = (state, userType, product) => {
  return state[userType][`${product}Policy`]?.discounts?.map(item => item.discountCode) ?? [];
};

const getAllProductDiscountCodes = (state, userType) => {
  const hdDiscounts = getProductDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD);
  return [...new Set([...hdDiscounts])];
};

const getAllQuotesDiscountCodes = (state, userType) => {
  const hdDiscounts = getQuotesDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD);
  return [...new Set([...hdDiscounts])];
};

const hasFreeMonthsDiscount = (state, userType, product) => {
  return state[userType][`${product}Policy`].discounts.some(item => item.hasFreeMonths);
};

const needsAddtlCoverage = (state, userType, product) => {
  return state[userType][`${product}Session`].recmd_cov_amt > 0;
};

const productContainsCaaDiscount = (state, userType) => {
  return getAllProductDiscountCodes(state, userType).some(code => CAA_DISCOUNTS.includes(code));
}

// HD-only webapp — senior lower limit only applied to Life products
const isSeniorLowerLimit = (_product, _isJoint, _primaryAge, _secondaryAge) => {
  return false;
}

// Life-specific accelerated RUW logic removed for HD-only webapp
const getAcceleratedRUWValue = (product, isJoint, primaryAge, secondaryAge) => {
  return 0;
};

export {
  getProductTotalAmt,
  getProductApplicationDate,
  getProductSessionTerm,
  getProductDiscountCodes,
  getAllProductDiscountCodes,
  getAllQuotesDiscountCodes,
  hasFreeMonthsDiscount,
  needsAddtlCoverage,
  productContainsCaaDiscount,
  isSeniorLowerLimit,
  getAcceleratedRUWValue,
};
