import { createMatchSelector } from 'connected-react-router';
import { getTenant, sentryError } from '@policyme/global-libjs-utils';

import {
  PM_PRODUCT_PREFIX,
  USER_TYPES,
  AFFILIATE_CATEGORIES,
  DIGITAL_CONSENT_STATUS,
  AFFILIATE_NAMES,
} from '../utils/const';
import { GROUP_NAMES } from '../tenant/consts';
import { getMainProduct, getDigitalConsentStatus, getAppUnderwritingMethod, ProductPrefix } from './helpers/productApp';
import { getUserSelectedQuote } from './hdSession';
import { State } from '../store/types/State';

const makeCreateMatchSelector = (path) => createMatchSelector({ path });

const getCurrentUser = (state) => state.userControl.currentUser;

const getDashboardUser = (state) => state.userControl.dashboardUser;

/**
 * Since dependents have been added we need a better way of getting a users specific slice,
 * instead of just using state[userType].<slice>
 * we can use getUserSlice(state, userType, key).<slice>
 *
 * @param {Object} state
 * @param {String} userType
 * @param {Strinbg} key
 * @returns the slice of state for that user
 */
const getUserSlice = (state, userType, key = null) => {
  if (userType === USER_TYPES.PRIMARY) {
    return state.primary;
  } else if (userType === USER_TYPES.SECONDARY) {
    return state.secondary;
  } else if (userType === USER_TYPES.DEPENDENT) {
    return state.dependents.dependents[key];
  }
  return null;
};

const isJoint = (state: State): boolean => {
  return state.userControl.hasPartnerApplication;
};

const hasDependents = (state) => {
  return state.dependents.dependent_keys.length > 0;
};

const isLoggedInUser = (state) => {
  // is_logged_in is set to true when the user is logged in, or dropping in callbacks
  // we will hit a checkLoginStatus API to check if the user is logged in and set this field
  const currentUser = state.userControl.currentUser;
  const loggedIn = state[currentUser]?.session?.is_logged_in;
  return loggedIn;
};

const isACHCSSAffiliate = (state: State): boolean => {
  return state.userControl?.affiliate?.affiliateName === AFFILIATE_NAMES.ACHCCS;
};

const getACHCSSGroupName = (state: State): typeof GROUP_NAMES[number] | null => {
  return state.userControl?.affiliate?.group_name ?? null;
  // shouldn't ever return null but we don't want to throw an error in the off chance it does
};

const isAffiliate = (state) => !!state.userControl.affiliateId;

const isMortgageBroker = (state) => state.userControl.affiliate.affiliateCategory
  === AFFILIATE_CATEGORIES.MORTGAGE_BROKER;

const isPolicymePartner = (state) => {
  return state.userControl.affiliate.affiliateCategory === AFFILIATE_CATEGORIES.POLICYME_PARTNER;
};

const isPolicymeEmployee = (state) => {
  return state.userControl.affiliate.affiliateCategory === AFFILIATE_CATEGORIES.POLICYME_EMPLOYEE;
};

const getAffiliateName = (state) => state.userControl.affiliate.affiliateName;

const _getHDProductName = (state) => {
  const { plan_type } = getUserSelectedQuote(state, state.userControl.currentUser);
  // if plan_type is not defined, meaning we are at the start of the application
  // and the user has not selected a plan yet, return an empty string
  // therefore we don't have a product_name to show
  // https://policyme.atlassian.net/browse/CORE-4021
  if (!plan_type) {
    return '';
  }
  const underwriting_method = getAppUnderwritingMethod(state,
    state.userControl.currentUser, PM_PRODUCT_PREFIX.HD);
  let product_name = '';
  const tenantObj = getTenant();
  if (tenantObj.productNames.hd?.[underwriting_method]?.[plan_type]) {
    product_name = tenantObj.productNames.hd[underwriting_method][plan_type];
  } else {
    sentryError(`Trying to get the name of an unexisting hd product with plan_type=${plan_type} underwriting_method=${underwriting_method}`);
  }

  return product_name;
};

const getProductName = (state, product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return _getHDProductName(state);
  }
  return '';
};

// HD-only webapp — partner discount UI is not applicable for HD
const showPartnerDiscountUI = (_state, _userType, _product) => {
  return false;
};

const getMortgageAmount = (state) => {
  return isMortgageBroker(state) && state.userControl.mortgage.mortgageAmount
    ? state.userControl.mortgage.mortgageAmount
    : null;
};

const isHealthAndDentalApplication = state => {
  return state.userControl.isHealthAndDental;
};

// HD-only webapp — digital consent is only for Life/CI, always return false
const showDigitalConsentPage = (_state) => {
  return false;
};

const isDigitalConsentJourney = state => {
  // Use this post decision to decide if a user is on the digital consent journey
  const mainUser = getCurrentUser(state);
  const mainProduct = getMainProduct(state, mainUser);
  return showDigitalConsentPage(state) &&
    getDigitalConsentStatus(state, mainUser, mainProduct) !== DIGITAL_CONSENT_STATUS.INACTIVE;
};

const isJointQuote = (currentUserType, isUpdatingPartner) => (state: State): boolean => {
  return isJoint(state) || isUpdatingPartner || currentUserType !== USER_TYPES.PRIMARY;
};

const getCurrentUserInfo = (state: State) => {
  const currentUser = getCurrentUser(state);
  const userSlice = getUserSlice(state, currentUser);
  return {
    firstName: userSlice?.household?.firstName || '',
    lastName: userSlice?.household?.lastName || '',
    email: userSlice?.household?.email || '',
  };
};

export {
  makeCreateMatchSelector,
  getCurrentUser,
  getDashboardUser,
  isJoint,
  hasDependents,
  isAffiliate,
  isMortgageBroker,
  isPolicymePartner,
  isPolicymeEmployee,
  getAffiliateName,
  getProductName,
  showPartnerDiscountUI,
  getMortgageAmount,
  isHealthAndDentalApplication,
  isLoggedInUser,
  getUserSlice,
  showDigitalConsentPage,
  isDigitalConsentJourney,
  isJointQuote,
  isACHCSSAffiliate,
  getACHCSSGroupName,
  getCurrentUserInfo,
};
