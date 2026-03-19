import { has } from 'cypress/types/lodash';
import { PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, USER_TYPES, FAMILY_ROLE, USER_PLAN_AGE_ELIBIGILITY } from '../utils/const';
import { getBirthdateParts, getUserQuoteIdentifier, isEmpty, calcAge } from '../utils/helpers';
import { getDependent, getDependentKeys } from './dependents';
import { getQuotesDiscountCodes } from './quotes';
import { isJoint, hasDependents } from './userControl';
import { hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';

// #region Quotes Input
function getUserQuotesInput(
  userSession,
  userHousehold,
  isJointHousehold,
  hasDependentsHousehold,
  family_role,
  discountCodes = [],
  insuranceOwnershipType,
  applicationDate = null,
) {
  const [birthday, birthmon, birthyr] = getBirthdateParts(userHousehold?.birthdate);
  const userQuoteIdentifier = getUserQuoteIdentifier(userSession, userHousehold);

  return {
    birthday,
    birthmon,
    birthyr,
    province: userHousehold?.healthcard_province,
    quote_id: userQuoteIdentifier,
    is_joint: isJointHousehold,
    has_dependents: hasDependentsHousehold,
    discount_codes: discountCodes.join(','),
    family_role,
    insurance_ownership_type: insuranceOwnershipType,
    application_date: applicationDate,
  };
}

export function getSessionQuotesInputs(state) {
  const quotesInputs = [getUserQuotesInput(
    state.primary?.session,
    state.primary?.household,
    isJoint(state),
    hasDependents(state),
    FAMILY_ROLE.PRIMARY,
    getQuotesDiscountCodes(state, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD),
    state.primary[`${PM_PRODUCT_PREFIX.HD}App`]?.insurance_ownership_type,
    state.primary[`${PM_PRODUCT_PREFIX.HD}Policy`]?.applicationDate,
  )];

  if (isJoint(state)) {
    quotesInputs.push(
      getUserQuotesInput(
        state.secondary?.session,
        state.secondary?.household,
        isJoint(state),
        hasDependents(state),
        FAMILY_ROLE.SECONDARY,
        getQuotesDiscountCodes(state, USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD),
        state.primary[`${PM_PRODUCT_PREFIX.HD}App`]?.insurance_ownership_type,
        state.primary[`${PM_PRODUCT_PREFIX.HD}Policy`]?.applicationDate,
      ),
    );
  }

  state.dependents.dependent_keys.forEach((key) => {
    const dependent = state.dependents?.dependents?.[key];
    quotesInputs.push(getUserQuotesInput(
      dependent.session,
      dependent.household,
      isJoint(state),
      hasDependents(state),
      FAMILY_ROLE.DEPENDENT,
      // We must use the primary's discount, since we don't store discount in dependents
      getQuotesDiscountCodes(state, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD),
      state.primary[`${PM_PRODUCT_PREFIX.HD}App`]?.insurance_ownership_type,
      state.primary[`${PM_PRODUCT_PREFIX.HD}Policy`]?.applicationDate,
    ));
  });

  return quotesInputs;
}
// #endregion

// #region Selected Quote
function getUserIndividualQuote(userQuotes) {
  const quote = userQuotes?.individual?.find(plan_quote => plan_quote.selected);

  if (quote) {
    const { mn_prems, plan_type } = quote;
    return {
      mn_prems, plan_type,
    };
  }
  return null;
}

export function getUserSelectedQuote(state, userType) {
  return {
    ...getUserIndividualQuote(state[userType]?.quotes?.hd?.userQuotes),
    hh_info_id: state[userType]?.session?.household_id,
  };
}

export function getDependentSelectedQuote(dependentKey, state) {
  const dependent = getDependent(state, dependentKey);
  return {
    ...getUserIndividualQuote(
      dependent.quotes?.hd?.userQuotes,
    ),
    hh_info_id: dependent.session?.household_id,
  };
}

export function getOverallSelectedQuote(state) {
  const hdQuotes = state.userControl.hd_quotes;
  let selected = {};
  if (isEmpty(hdQuotes)) {
    return {};
  }
  if (Object.keys(hdQuotes).length > 0) {
    selected = Object.entries(hdQuotes).find((quote) => {
      return quote[1].selected;
    });
  }
  return Array.isArray(selected) ? selected[1] : {};
}

export function getSessionSelectedQuotes(state) {
  const selectedQuotes = [
    getUserSelectedQuote(state, USER_TYPES.PRIMARY),
  ];

  if (isJoint(state)) {
    selectedQuotes.push(getUserSelectedQuote(state, USER_TYPES.SECONDARY));
  }

  getDependentKeys(state).forEach((key) => {
    selectedQuotes.push(getDependentSelectedQuote(key, state));
  });

  return selectedQuotes;
}
// #endregion

// #region Helpers
export const isGIProduct = (state) => {
  return state.primary.hdApp.underwriting_method === UNDERWRITING_METHODS.GUARANTEED_ISSUE;
};
// #endregion

export const isPortableCoverageProduct = (state) => {
  return state.primary.hdApp.underwriting_method === UNDERWRITING_METHODS.PORTABLE_COVERAGE;
};

// #region Helpers
export const isFullyUWProduct = (state) => {
  return state.primary.hdApp.underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN;
};
// #endregion

// helper to decide if the economic plan should be hidden
export const shouldHideEconomicPlan = (state) => {
  return  (
    hasFlag(TENANT_FLAGS.HIDE_ECONOMIC_PLAN) &&
    (
      calcAge(state.primary.household.birthdate) > USER_PLAN_AGE_ELIBIGILITY.ECONOMIC_PLAN_MAX_AGE || 
        (
          state.secondary.household.birthdate && 
          calcAge(state.secondary.household.birthdate)) > USER_PLAN_AGE_ELIBIGILITY.ECONOMIC_PLAN_MAX_AGE)
  );
};

