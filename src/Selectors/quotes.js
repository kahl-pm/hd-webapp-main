import cloneDeep from 'lodash/cloneDeep';

import { getTenant, sentryError } from '@policyme/global-libjs-utils';
import {
  calcAgeNearest,
  getCPPEligibleCoverage,
  isEmptyObj,
  validateDDMMYYYY,
  validateGender,
  validateSmoke,
  getOtherUserType,
  hasValue,
} from '../utils/helpers';
import { HD_COMPARE_PLANS_URLS, INSURERS, PLAN_TYPES, PM_PRODUCT_PREFIX, USER_TYPES } from '../utils/const';
import { CAA_DISCOUNTS } from '../utils/discounts';
import { getAppUnderwritingMethod } from './helpers/productApp';
import { getOverallSelectedQuote } from './hdSession';
import { AgeValidator } from '../utils/ageValidator';

function _canRequoteBase(state, userType) {
  const ageValidator = new AgeValidator();

  return ageValidator.validateAge(state[userType].household.birthdate)
    && validateDDMMYYYY(state[userType].household.birthdate)
    && validateGender(state[userType].household.userGender)
    && validateSmoke(state[userType].household.smoke);
}

function _canRequoteBaseHD(state, userType) {
  return _canRequoteBase(state, userType)
    && hasValue(state[userType].household.healthcard_province);
}

function canRequote(state, userType) {
  return _canRequoteBase(state, userType)
    && (state.userControl.hasPartnerApplication ?
      _canRequoteBase(state, getOtherUserType(userType)) : true);
}

function canRequoteHD(state, userType) {
  return _canRequoteBaseHD(state, userType)
  && (state.userControl.hasPartnerApplication ?
    _canRequoteBaseHD(state, getOtherUserType(userType)) : true);
}

const getUserQuotes = (state, product) => {
  let ret = [];
  if (state.userControl.hasPartnerApplication) {
    ret = getUserJointQuotes(state, product);
  } else {
    const userType = state.userControl.currentUser;
    ret = getUserTypeQuotes(state, userType, product);
  }
  return ret;
};

// Filters out quotes for some insurers
const getNonCPPUserQuotes = (state, product) => {
  const quotes = getUserQuotes(state, product);
  return quotes.filter(quote => {
    return quote.company !== INSURERS.CPP;
  });
};

const getAllUserQuotes = (state, product) => {
  const ret = {
    primary: state.primary.quotes[product].userQuotes.individual,
    secondary: state.secondary.quotes[product].userQuotes.individual,
    joint: state.primary.quotes[product].userQuotes.joint,
    seq_num: state.primary.quotes[product].userQuotes.seq_num,
  };
  return ret;
};

const getMaxCovQuotes = (state, userType, product) => {
  let ret = [];
  // in case we want to support joint
  ret = getMaxCovUserTypeQuotes(state, userType, product);
  return ret;
};

const getAllMaxCovQuotes = (state, product) => {
  return {
    primary: state.primary.quotes[product].maxCovQuotes.individual,
    secondary: state.secondary.quotes[product].maxCovQuotes.individual,
    joint: state.primary.quotes[product].maxCovQuotes.individual,
    seq_num: state.primary.quotes[product].maxCovQuotes.seq_num,
  };
};

const getMaxCovUserTypeQuotes = (state, userType, product) => {
  let ret = [];
  if (state[userType].quotes[product].maxCovQuotes.individual) {
    ret = state[userType].quotes[product].maxCovQuotes.individual;
  }
  ret = cloneDeep(ret);
  ret = ret.sort(sortQuotes);
  return ret;
};

const getMaxMonthlyPrem = (state, userType, product) => {
  let ret = 0;
  let maxCovQuotes = getMaxCovQuotes(state, userType, product);
  if (maxCovQuotes) {
    const selectedQuote = maxCovQuotes.find(q => q.company === INSURERS.PM);
    if (!selectedQuote) {
      return 0;
    }
    return selectedQuote.mn_prems;
  }

  return 0; // not sure what to do here if not PM
};

const sortQuotes = (first, second) => {
  if (first.invalid && second.invalid) {
    return 0;
  } else if (first.invalid) {
    return 1;
  } else if (second.invalid) {
    return -1;
  }

  if (first.not_found && second.not_found) {
    return 0;
  } else if (first.not_found) {
    return 1;
  } else if (second.not_found) {
    return -1;
  }

  if (first.mn_prems < second.mn_prems) {
    return -1;
  } else if (first.mn_prems > second.mn_prems) {
    return 1;
  }

  // price is the same, order by ID
  if (first.id < second.id) {
    return -1;
  } else if (first.id > second.id) {
    return 1;
  }
  return 0;
};

// fake quotes generator - remove when backend is ready
const getQuotes = (quotes) => {
  let ret = quotes;
  ret = cloneDeep(ret);
  ret = ret.sort(sortQuotes);
  return ret;
};

const getUserTypeQuotes = (state, userType, product) => {
  let ret = [];
  if (!state[userType].quotes[product]) {
    return ret;
  }
  const quote = state[userType].quotes[product].userQuotes.individual;
  if (quote) {
    if (Array.isArray(quote)) {
      ret = quote;
    } else {
      ret = [state[userType].quotes[product].userQuotes.individual];
    }
  }
  ret = cloneDeep(ret);
  ret = ret.sort(sortQuotes);
  return ret;
};

const getUserJointQuotes = (state, product) => {
  let ret = [];
  if (state.primary.quotes[product].userQuotes.joint) {
    ret = state.primary.quotes[product].userQuotes.joint;
  }
  ret = cloneDeep(ret);
  ret = ret.sort(sortQuotes);
  return ret;
};

const getRecmdQuotes = (state) => {
  let ret = [];
  if (state.userControl.hasPartnerApplication) {
    ret = getRecmdJointQuotes(state);
  } else {
    ret = getRecmdPrimaryQuotes(state);
  }
  return ret;
};

const getAllRecmdQuotes = (state) => {
  return {
    primary: state.primary.quotes.life.recmdQuotes.individual,
    secondary: state.secondary.quotes.life.recmdQuotes.individual,
    joint: state.primary.quotes.life.recmdQuotes.individual,
    seq_num: state.primary.quotes.life.recmdQuotes.seq_num,
  };
};

const getQuotesForDisplay = (state, userType, product) => {
  if (!isEmptyObj(state[userType].quotes[product].userQuotes)) {
    return state[userType].quotes[product].userQuotes;
  }
  return state[userType].quotes[product].recmdQuotes;
};

const getRecmdPrimaryQuotes = (state) => {
  let ret = [];
  if (state.primary.quotes.life.recmdQuotes.individual) {
    ret = state.primary.quotes.life.recmdQuotes.individual;
  }
  return ret;
};

const getRecmdJointQuotes = (state) => {
  let ret = [];
  if (state.primary.quotes.life.recmdQuotes.joint) {
    ret = state.primary.quotes.life.recmdQuotes.joint;
  }
  return ret;
};

const getSimplifiedIssueQuotes = (state, product) => {
  return getUserQuotes(state, product).filter(x => (x.company === INSURERS.CPP));
};

const getPmQuote = (state, product) => {
  let userQuotes = getUserQuotes(state, product);
  if (!userQuotes) return '';
  const selectedQuote = userQuotes.find(q => q.company === 'PM');
  if (!selectedQuote) {
    return '';
  }
  return selectedQuote;
};

const getPmUserTypeQuote = (state, userType, product) => {
  let userQuotes = getUserTypeQuotes(state, userType, product);
  if (!state[userType][`${product}Session`] || !userQuotes) return '';
  const selectedQuote = userQuotes.find(q => q.company === 'PM');
  if (!selectedQuote) {
    return '';
  }
  return selectedQuote;
};

const getPmQuoteId = (state, product) => {
  let userQuotes = getUserQuotes(state, product);
  let pmQuote = userQuotes.find(q => q.company === 'PM');
  if (pmQuote === undefined) {
    return '';
  }
  return pmQuote.id;
};

const getPmMonthlyPrem = (state, product) => {
  const pmQuote = getPmQuote(state, product);
  if (pmQuote === '') {
    return '';
  }
  return pmQuote.mn_prems;
};

const getHDNonDiscountedMonthlyUserTypePrem = (state, userType) => {
  const { original_mn_prems } = getOverallSelectedQuote(state);
  if (original_mn_prems === undefined) {
    return '';
  }
  return original_mn_prems.toFixed(2);
};

const getNonDiscountedMonthlyUserTypePrem = (state, userType, product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return getHDNonDiscountedMonthlyUserTypePrem(state, userType);
  }

  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '') {
    return '';
  }
  if (!pmQuote.original_mn_prems) {
    return '';
  }
  return parseFloat(pmQuote.original_mn_prems).toFixed(2);
};

const getFirstMonthlyUserTypePremFromBreakdown = (state, userType, product) => {
  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '' || !('quote_breakdown' in pmQuote)) {
    return '';
  }
  return parseFloat(getFirstSignificantQuote(pmQuote.quote_breakdown.monthly).value).toFixed(2);
};

const getLastMonthlyUserTypePremFromBreakdown = (state, userType, product) => {
  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '' || !('quote_breakdown' in pmQuote)) {
    return '';
  }
  const breakdownObj = pmQuote.quote_breakdown.monthly;
  return parseFloat(breakdownObj[breakdownObj.length - 1].value).toFixed(2);
};

const getNonDiscountedYearlyUserTypePrem = (state, userType, product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return '';
  }

  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '') {
    return '';
  }
  if (!pmQuote.original_yr_prems) {
    return '';
  }
  return parseFloat(pmQuote.original_yr_prems).toFixed(2);
};

const getPmYearlyUserTypePrem = (state, userType, product) => {
  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '') {
    return '';
  }
  return parseFloat(pmQuote.yr_prems).toFixed(2);
};

const getPmQuoteBreakdownUserType = (state, userType, product) => {
  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '') {
    return {};
  }
  return pmQuote.quote_breakdown;
};

// Life-specific: always returns 0 in HD-only webapp
const getMaximumEligibleNoMedicalCoverage = (state, userType) => {
  return 0;
};

const getPmMonthlyUserTypeAppliedDiscounts = (state, userType, product) => {
  const pmQuote = getPmUserTypeQuote(state, userType, product);
  if (pmQuote === '') {
    return '';
  }
  return pmQuote.applied_discounts;
};

const getPolicyDiscountedRateFromBreakdown = (state, userType, product, planType) => {
  const quoteBreakdown = state[userType][`${product}Policy`].quote_breakdown;
  if (quoteBreakdown === undefined || isEmptyObj(quoteBreakdown)) {
    return '';
  }
  let breakdownObject;
  if (planType === PLAN_TYPES.MONTHLY) {
    breakdownObject = quoteBreakdown.monthly;
  } else {
    breakdownObject = quoteBreakdown.annual;
  }
  return breakdownObject ? parseFloat(breakdownObject[0].value).toFixed(2) : null;
};

const getPolicyFinalRateFromBreakdown = (state, userType, product, planType) => {
  const quoteBreakdown = state[userType][`${product}Policy`].quote_breakdown;
  if (quoteBreakdown === undefined || isEmptyObj(quoteBreakdown)) {
    return '';
  }
  let breakdownObject;
  if (planType === PLAN_TYPES.MONTHLY) {
    breakdownObject = quoteBreakdown.monthly;
  } else {
    breakdownObject = quoteBreakdown.annual;
  }
  return breakdownObject
    ? parseFloat(breakdownObject[breakdownObject.length - 1].value).toFixed(2)
    : null;
};

const getQuotesDiscountCodes = (state, userType, product) => {
  return state[userType].quotes[product].discountCodes;
};

const getFirstSignificantQuote = (quoteBreakdown) => {
  return quoteBreakdown ? quoteBreakdown.filter(quote => Number(quote.value) > 0.01)[0] : null;
};

const getFirstSignificantPaymentDate = (state, userType, product, planType) => {
  const quoteBreakdown = state[userType][`${product}Policy`].quote_breakdown;
  if (quoteBreakdown === undefined || isEmptyObj(quoteBreakdown)) {
    return '';
  }
  let breakdownObject;
  if (planType === PLAN_TYPES.MONTHLY) {
    breakdownObject = quoteBreakdown.monthly;
  } else {
    breakdownObject = quoteBreakdown.annual;
  }
  const firstPaymentDate = getFirstSignificantQuote(breakdownObject).start_date;
  return firstPaymentDate;
};

const getFirstSignificantPaymentValue = (state, userType, product, planType) => {
  const quoteBreakdown = state[userType][`${product}Policy`].quote_breakdown;
  if (quoteBreakdown === undefined || isEmptyObj(quoteBreakdown)) {
    return '';
  }
  let breakdownObject;
  if (planType === PLAN_TYPES.MONTHLY) {
    breakdownObject = quoteBreakdown.monthly;
  } else {
    breakdownObject = quoteBreakdown.annual;
  }
  return breakdownObject
    ? parseFloat(getFirstSignificantQuote(breakdownObject).value).toFixed(2)
    : null;
};

const quotesContainsCaaDiscount = (state, userType, product) => {
  return getQuotesDiscountCodes(state, userType, product)
    .some(code => CAA_DISCOUNTS.includes(code));
};

const getHdComparePlansUrl = (state) => {
  const tenantCode = getTenant().code;
  const product = PM_PRODUCT_PREFIX.HD; // currently on HD has comparePlans pdfs
  const userType = USER_TYPES.PRIMARY; // HD plans share the same underwriting methods
  const underwritingMethod = getAppUnderwritingMethod(state, userType, product);
  const locale = state.primary.household.application_language;

  const documentUrl = getTenant()?.documentUrls?.hd?.[underwritingMethod]?.[locale] || '';
  if (documentUrl === '') {
    sentryError(`getHdComparePlansUrl: No hd document URL found for ${tenantCode} ${underwritingMethod} ${locale}`);
  }

  return `https://${window.location.host}/${documentUrl}`;
};

export {
  canRequote,
  canRequoteHD,
  getUserQuotes,
  getNonCPPUserQuotes,
  getAllUserQuotes,
  getAllMaxCovQuotes,
  getMaxCovUserTypeQuotes,
  getUserTypeQuotes,
  getMaxMonthlyPrem,
  getRecmdQuotes,
  getAllRecmdQuotes,
  getSimplifiedIssueQuotes,
  getQuotesForDisplay,
  getPmMonthlyPrem,
  getPmQuoteId,
  getPmYearlyUserTypePrem,
  getQuotes,
  getMaximumEligibleNoMedicalCoverage,
  getNonDiscountedMonthlyUserTypePrem,
  getFirstMonthlyUserTypePremFromBreakdown,
  getLastMonthlyUserTypePremFromBreakdown,
  getNonDiscountedYearlyUserTypePrem,
  getPmMonthlyUserTypeAppliedDiscounts,
  getPmUserTypeQuote,
  getPmQuoteBreakdownUserType,
  getPolicyDiscountedRateFromBreakdown,
  getPolicyFinalRateFromBreakdown,
  getQuotesDiscountCodes,
  getFirstSignificantPaymentDate,
  getFirstSignificantPaymentValue,
  getFirstSignificantQuote,
  quotesContainsCaaDiscount,
  getHdComparePlansUrl,
};
