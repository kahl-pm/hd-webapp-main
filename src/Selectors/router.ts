import { getRoutePageOptions } from '../config/pageOptionsConfig';
import { PM_PRODUCT_PREFIX, ROUTES, ROUTE_REGEX } from '../utils/const';
import { getRouteWithProductType } from '../utils/helpers';
import { isGIProduct } from './hdSession';
import { getMainProduct } from './helpers/productApp';
import { getABTestBand } from './metadata';

const isBaseEligibilitySelfIncome = (state) => {
  return state.router.location.pathname === ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF;
};

const isBaseEligibilityPartnerIncome = (state) => {
  return state.router.location.pathname === ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER;
};

const allowLanguageToggle = (state) => {
  const completedStartApp = state.metadata.completedStartApp;
  if (completedStartApp) {
    // Do not allow language toggle if start app is completed
    // Even if user goes back, they can't change language because of a limitation with
    // starting aura disclosures in a different language
    // To change their language, they have to restart their app from accounts page
    return false;
  }
  const pathname = state.router.location.pathname;
  const startAppRoutes = [
    getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD),
  ];
  // Disable language toggle if user comes from start app URL
  if (startAppRoutes.includes(pathname)) {
    return !state.metadata.fromStartApp;
  }

  const allowLanguageToggleRoutes = [
    ROUTES.GETTING_STARTED,
    getRouteWithProductType(ROUTES.FAMILY, PM_PRODUCT_PREFIX.HD),
    ROUTES.GROUP_BENEFITS,
    getRouteWithProductType(ROUTES.QUOTES_ADVICE, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.CAA_MEMBER, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.GROUP_BENEFITS, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.PRESCRIPTION_DRUGS, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.COVER_PRESCRIPTIONS, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.USER_INTENT, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.COVERAGE_FIT_QUESTION, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.FAMILY_COMPOSITION, PM_PRODUCT_PREFIX.HD),
    getRouteWithProductType(ROUTES.HOUSEHOLD_INCOME, PM_PRODUCT_PREFIX.HD),
  ];
  return allowLanguageToggleRoutes.includes(pathname) || pathname.match(ROUTE_REGEX.QUESTIONS);
};

const checkForBackToDashButton = (userType, route, state) => {
  const product = getMainProduct(state, userType);
  if (product === PM_PRODUCT_PREFIX.HD && isGIProduct(state)) {
    return false;
  }
  const abTestBand = getABTestBand(state);
  const pageOption = getRoutePageOptions(abTestBand, route);
  return pageOption.hasBackToDashboard;
};

const checkForShowBackButton = (userType, pathname, state, showBackToDash) => {
  const mainProduct = getMainProduct(state, userType);
  const abTestBand = getABTestBand(state);
  const pageOption = getRoutePageOptions(abTestBand, pathname);
  return state.metadata.hasLocalHistory &&
  !pageOption.noBackButton(mainProduct) &&
  !showBackToDash;
};

export {
  allowLanguageToggle,
  isBaseEligibilityPartnerIncome, isBaseEligibilitySelfIncome,
  checkForBackToDashButton, checkForShowBackButton,
};
