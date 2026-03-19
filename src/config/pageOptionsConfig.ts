import { memoize } from 'lodash';
import { getPageOptionsABTestOverride } from '../components/Customisation/helpers';
import { PM_PRODUCT_PREFIX, ROUTES, USER_TYPES } from '../utils/const';
import { getUserFromURL } from '../utils/helpers';
import { ACTIVE_TESTS } from '../ABTests';
import { doesAppIdExist, doesPolicyIdExist, doesSessionIdExist } from '../Selectors/session';
import { isJoint } from '../Selectors/userControl';
import { PageOptions, PartialPageOptions } from './pageOptionsConfigTypes';

const _pageOptions: Record<string, PartialPageOptions> = {
  [ROUTES.GETTING_STARTED]: {
    noBackButton: (_p) => true,
    stateValidation: {
      validationQuery: (state) => false,
      failAction: 'JUMP_TO_START',
    },
  },
  // Payment routes
  [ROUTES.APPROVED_PAYMENT_FORM]: {
    hideAffiliateLogo: true,
    isPaymentFormPage: true,
    hasBackToDashboard: true,
    noBackButton: (product) => product === PM_PRODUCT_PREFIX.HD,
    stateValidation: {
      validationQuery: (state) => {
        return !doesPolicyIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  [ROUTES.APPROVED_PAYMENT_PLANS]: {
    hideAffiliateLogo: false,
    hasBackToDashboard: true,
    stateValidation: {
      validationQuery: (state) => {
        return !doesPolicyIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  [ROUTES.APPROVED_EFFECTIVE_DATE]: {
    hideAffiliateLogo: false,
    hasBackToDashboard: true,
    stateValidation: {
      validationQuery: (state) => {
        return !doesPolicyIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  [ROUTES.PAYMENT_RECEIVED]: {
    hideAffiliateLogo: false,
    stateValidation: {
      validationQuery: (state) => {
        const user = getUserFromURL(state.router.location.pathname) ??
          state.userControl.currentUser;
        return !doesPolicyIdExist(state, user);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  // Thank you pages
  [ROUTES.APPROVED_THANK_YOU]: {
    hideAffiliateLogo: false,
    hasBackToDashboard: true,
    stateValidation: {
      validationQuery: (state) => {
        const user = getUserFromURL(state.router.location.pathname) ??
          state.userControl.currentUser;
        return (
          !doesPolicyIdExist(state, user) ||
          !doesSessionIdExist(state, user));
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  // Docusign esign pages
  [ROUTES.APPROVED_REVIEW_ESIGN_POLICY]: {
    hasBackToDashboard: true,
    isEappStartSignPage: true,
    stateValidation: {
      validationQuery: (state) => {
        return !doesAppIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  // Decision Dashboard
  [ROUTES.DECISION_DASHBOARD_PAGE]: {
    noBackButton: (_p) => true,
    stateValidation: {
      validationQuery: (state) => {
        return isJoint(state) ?
          !doesPolicyIdExist(state, USER_TYPES.PRIMARY) &&
          !doesAppIdExist(state, USER_TYPES.PRIMARY) &&
          !doesPolicyIdExist(state, USER_TYPES.SECONDARY) &&
          !doesAppIdExist(state, USER_TYPES.SECONDARY)
          : !doesPolicyIdExist(state, USER_TYPES.PRIMARY) &&
          !doesAppIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  // Digital Decision Dashboard shares the same logic with Decision Dashboard
  [ROUTES.DIGITAL_CONSENT_DASHBOARD_PAGE]: {
    noBackButton: (_p) => true,
    stateValidation: {
      validationQuery: (state) => {
        return isJoint(state) ?
          !doesPolicyIdExist(state, USER_TYPES.PRIMARY) &&
          !doesAppIdExist(state, USER_TYPES.PRIMARY) &&
          !doesPolicyIdExist(state, USER_TYPES.SECONDARY) &&
          !doesAppIdExist(state, USER_TYPES.SECONDARY)
          : !doesPolicyIdExist(state, USER_TYPES.PRIMARY) &&
          !doesAppIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  [ROUTES.COMBINED_CHECKOUT_HD]: {
    hasBackToDashboard: true,
    isEappStartSignPage: true,
    stateValidation: {
      validationQuery: (state) => {
        return !doesAppIdExist(state, USER_TYPES.PRIMARY);
      },
      failAction: 'REDIRECT_NOT_FOUND',
    },
  },
  // not completed
};

// set default values if not specified
// stateValidation must be defined
interface DefaultOptions extends Omit<PageOptions, 'stateValidation'> {
  stateValidation: null;
}

export const defaultOptions: DefaultOptions = {
  hideAffiliateLogo: false,
  isPaymentFormPage: false,
  isDisclosurePage: false,
  isEappStartSignPage: false,
  hasBackToDashboard: false,
  noBackButton: (_p) => false,
  stateValidation: null, // must be defined
  useAlternateNavBackground: false,
  hideProgressCardEstimateRateExpanded: false,
};

// set default values for page options if not specified
const pageOptions: Record<string, PageOptions> = Object.keys(_pageOptions).reduce((acc, key) => {
  acc[key] = {
    ...defaultOptions,
    ..._pageOptions[key],
  };
  return acc;
}, {});

export const getRoutePageOptions: (
  (abTestBand:string, route: string) => PageOptions | DefaultOptions
) = memoize((abTestBand, route) => {
  // not all routes have been specified in pageOptions yet, use default config if not found
  const userRegex = /\/(primary|secondary)\//;
  const routeWithUserWildCard = route.replace(userRegex, '/:userType/');
  const pageOptionsOverride = getPageOptionsABTestOverride<PartialPageOptions>(
    routeWithUserWildCard,
    ACTIVE_TESTS,
    abTestBand,
  );
  return {
    ...defaultOptions,
    ...pageOptions[routeWithUserWildCard],
    ...pageOptionsOverride,
  };
}, (abTestBand, route) => `${abTestBand}-${route}`);
