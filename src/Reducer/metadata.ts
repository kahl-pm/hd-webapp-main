import { TENANT_FLAGS, hasFlag, segmentTrackEvent, CAA_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';
import {
  ROUTES_ORDER, CRM_LIFE_SESSION_FIELDS, DOCUSIGN_SOURCE_TYPE,
  DOCUSIGN_URL_STATUS, INITIAL_VALIDATE_RETRIES,
  USER_TYPES,
} from '../utils/const';
import { facebookTrackCustom } from '../utils/facebookHelpers';
import { getBackEventName, getBackEventNameNoPrefix, getPageViewName, stripTrailingSlash, getGenericRoute, hasValue, isDebugEnv } from '../utils/helpers';
import { isDisclosureIntegrationPage } from '../Selectors/metadata';
import { getPreAppMainProductMetadata } from './helpers/metadata';
import { Metadata } from '../store/types/State';
import { SSO_CONNECTION_TYPES } from '../constants/socialSignOn';

const initialState: Partial<Metadata> = {
  initialized: false, // needed solely to detect a browser refresh
  paymentSliderDown: false,
  redirectedTo: '', // need to check if we already tried to redirect to this url
  isLoading: false,
  hasError: false,
  error: '',
  hasCustomError: false,
  currRoute: '',
  backPressed: false,
  forwardPressed: false,
  isQuoting: false,
  fromQuoteCompare: false,
  fromStartApp: false,
  fromDocusign: false,
  fromDropJourney: false,
  fromAccounts: false,
  emailRefVers: undefined,
  sendAnalyticsCb: undefined,
  dateTime: '',
  question: '',
  isContactModalOpen: false,
  name: '',
  isBookingAdvisorReview: undefined,
  isConfirmationOpen: false,
  debugFlag: false,
  suggestedEmail: null,
  emailIsDeliverable: false,
  hasLocalHistory: false,
  sentEappsMessage: false,
  isChatbotInitialized: false,
  [CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE]: '',
  [CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER]: '',
  fbInitFlag: false,
  fbEventQueue: [],
  abTestBand: 'control',
  segmentBlocked: false,
  docusignUrl: undefined,
  docusignUrlStatus: DOCUSIGN_URL_STATUS.UNINITIALIZED,
  utm_global_id: undefined,
  utm_tracking_id: undefined,
  docusignEvent: undefined,
  docusignSource: DOCUSIGN_SOURCE_TYPE.LIFE_WEBAPP_MAIN, // DOCUSIGN_SOURCE_TYPE
  experienceLevel: '',
  isJoint: '',
  isPartnerFormComplete: false,
  verifiedEmails: [],
  hasCheckedSecondaryApp: false,
  eappValidateValue: '',
  eappValidateMedium: '',
  eappValidateShortCode: '',
  app_insurer_url: '',
  numValidateAttemptsRemaining: INITIAL_VALIDATE_RETRIES,
  hasSubmittedSecondaryApp: false,
  hasSubmittedABTestData: false,
  isSearchLoading: false,
  consentMIBPull: false,
  consentPrivacyPolicy: false,
  decisionLoadingStep: 0,
  isMakingDecisionRequests: false,
  isAppSubmitComplete: false,
  decisionHasBeenMade: false,
  isComingFromConsentPage: false,
  selectedApprovedSteps: false,
  hasEligibilityIssue: false,
  ineligibleUser: null,
  abRequestInFlight: false,
  konami: false,
  is_download_policy_journey: false,
  savings: undefined,
  advisor_id: '',
  advisor_full_name: '',
  secondary_submitted: false,
  syncNurseVisitClickRate: '',
  noMedicalClickRateStatus: '',
  documentReferrer: '',
  initialWindowLocationHref: '',
  locationHistory: [],
  fromPrimaryUser: false,
  blockPrimaryPages: false,
  smq_quote_num: '',
  smq_mn_prems: '',
  smq_secondary_mn_prems: '',
  association_complete: false,
  isFirstRendering: false,
  isCurrentlyHydratingData: false,
  completedStartApp: false,
  hasInProgressPolicy: false,
  finishedHydrating: false,
  isStripeDebugMode: false,
  primary: {
    disclosuresAnswered: [],
    applications_links_created: false,
    accRatedCallbackRequested: false,
    hasPreExistingPhoneNumber: false,
    userViewedPriceInfo: {
      isExclusivePerkDiscountApplied: false,
      isJointDiscountApplied: false,
      isCaaDiscountApplied: false,
      isFamilyDiscountApplied: false,
      isSeptemberTLDiscountApplied: false,
      jointDiscountSavingsApplied: 0,
      septemberTLDiscountSavingsApplied: 0,
      caaDiscountSavingsApplied: 0,
      familyDiscountSavingsApplied: 0,
      totalMonthlyNonDiscountedPrice: {
        hd: 0,
      },
    },
  },
  secondary: {
    disclosuresAnswered: [],
    applications_links_created: false,
    accRatedCallbackRequested: false,
    hasPreExistingPhoneNumber: false,
    userViewedPriceInfo: {
      isExclusivePerkDiscountApplied: false,
      isJointDiscountApplied: false,
      isCaaDiscountApplied: false,
      isFamilyDiscountApplied: false,
      isSeptemberTLDiscountApplied: false,
      jointDiscountSavingsApplied: 0,
      septemberTLDiscountSavingsApplied: 0,
      caaDiscountSavingsApplied: 0,
      familyDiscountSavingsApplied: 0,
      totalMonthlyNonDiscountedPrice: {
        hd: 0,
      },
    },
  },
  fromBlog: false,
  productDocusign: '',
  docusignCallbackType: '',
  primaryReviewEsignCompleted: false,
  secondaryReviewEsignCompleted: false,
  dealLinkProductType: null,
  // TODO (FORM-1013): Remove temporary hack to get prefixed product events
  currentUser: USER_TYPES.PRIMARY,

  isShadowAccountStartApp: false,
  allowNoAppIdStartapp: false,
  closePolicyFlag: false,
  authorizedCitizenship: false,

  existingPolicies: {
    hasExistingPolicies: '',
    hasReplacingPolicies: false,
    hasPendingPolicies: '',
    existingPoliciesPendingKeepingFlag: null,
  },

  planTypeStartApp: 'standard',
  navbarFirstName: '',
  navbarLastName: '',
  defaultPlanSlide: CAA_HD_PLAN_TYPES.STANDARD,
  isCypressStripeForm: false,
  isRebrandDesignEnabled: true,
  needsAssessmentStartedAfterStartApp: false,
  externalAdvisorMode: false,
  purchaseMode: false,
  /**
   * This is only to be used in places where
   * we cannot infer the product from the route AND, the
   * application logic to bootstrap a main product is not yet available.
   * Currently being used to resume the buying journey from the
   * OTP Verification page.
   */
  postAppMainProduct: '',
  login_method: SSO_CONNECTION_TYPES.MAGIC_LINK,
};

function getRouteOrder(route) {
  let order = ROUTES_ORDER[route];
  if (order === undefined) {
    return -1;
  }
  return order;
}

export default (state = initialState, action) => {
  let pathname;
  let backPressed;
  let forwardPressed;
  let retryFn;
  let resolveRetry;
  let rejectRetry;
  let data;
  let confirmationHeader;
  let confirmationBodyText;
  let { isLoading, hasError } = state;
  let eventName;
  let prevRoute;
  let isFirstRendering;
  let genericRoute;
  let productPrefix;
  let userType;
  let preAppMainProduct = state.preAppMainProduct;
  let error;
  // TODO (FORM-1013): Remove temporary hack to get prefixed product events
  switch (action.type) {
    case '@@metadata/initialized_app': // needed solely to detect a browser refresh
      return {
        ...state,
        initialized: true,
      };
    case '@@metadata/update_metadata':
      if (action.property === 'isCypressStripeForm') {
        // This should only be set in non-prod environments,
        // which will remove the postal code field
        // for Cypress tests.
        // See https://policyme.atlassian.net/wiki/spaces/EN/pages/3184230401
        return {
          ...state,
          [action.property]: isDebugEnv ? action.value : false,
        };
      }

      return {
        ...state,
        [action.property]: action.value,
      };
    case '@@router/LOCATION_CHANGE':
      console.log(`location change ${JSON.stringify(action)}`);
      prevRoute = stripTrailingSlash(state.currRoute);
      pathname = stripTrailingSlash(action.payload.location.pathname);
      genericRoute = getGenericRoute(pathname);
      isFirstRendering = action.payload.isFirstRendering;

      if (action.payload.action === 'POP' && !isFirstRendering) {
        backPressed = true;
        forwardPressed = false;
        isLoading = false;
      } else if (action.payload.action === 'PUSH' && prevRoute !== pathname) {
        backPressed = false;
        forwardPressed = true;
      }

      // Putting this here to automatically send GA page views/events on route change
      // Handling this in middleware is too complex and putting it in every component is unreliable

      // always send pageview

      userType = state.currentUser ? state.currentUser : USER_TYPES.PRIMARY;
      // HD-only: simplified product prefix logic
      {
        let product;
        [product, productPrefix] = getPreAppMainProductMetadata(pathname);

        // Set preAppMainProduct once
        if (!hasValue(state.preAppMainProduct) && product) {
          preAppMainProduct = product;
        }
      }

      if (action.payload.action === 'REPLACE') {
        // the user is being redirected somewhere because they're not allowed
        // on currRoute, don't send an event in this case
      } else if (state.currRoute === '') { // initial page load
        // enable this to send events for when the page is loaded
        // eventName = getLoadedEventName(pathname);
        eventName = getPageViewName(genericRoute, productPrefix);
      } else if (isDisclosureIntegrationPage(genericRoute)) {
        // if we are on a disclosure question page,
        // avoid the normal event tracking
        eventName = '';
      } else if (backPressed) {
        eventName = getBackEventName(genericRoute, productPrefix);
        const segmentEventName = getBackEventNameNoPrefix(genericRoute);
        if (!hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
          segmentTrackEvent(`Back ${segmentEventName}`, {
            name: segmentEventName,
            product_type: productPrefix,
          });
        }
      } else {
        eventName = getPageViewName(genericRoute, productPrefix);
      }
      if (eventName) {
        facebookTrackCustom(eventName, {}, state);
      }

      return {
        ...state,
        backPressed,
        forwardPressed,
        isLoading,
        hasError,
        error,
        currRoute: pathname,
        prevRoute,
        isFirstRendering,
        locationHistory: [...state.locationHistory, action.payload.location.pathname],
        preAppMainProduct,
      };
    case '@@metadata/request_error':
      ({ retryFn, resolveRetry, rejectRetry, error } = action);
      return {
        ...state,
        hasError: true,
        error,
        retryFn,
        resolveRetry,
        rejectRetry,
      };
    case '@@metadata/close_modal':
      return {
        ...state,
        hasError: false,
        hasCustomError: false,
        error: null,
        retryFn: '',
        resolveRetry: '',
        rejectRetry: '',
      };
    case '@@metadata/update_utm':
      ({ data } = action);
      return {
        ...state,
        ...data,
      };
    case '@@metadata/show_confirmation_modal':
      ({ confirmationHeader, confirmationBodyText } = action);
      return {
        ...state,
        confirmationHeader,
        confirmationBodyText,
        isConfirmationOpen: true,
      };
    case '@@metadata/hide_confirmation_modal':
      return {
        ...state,
        confirmationHeader: undefined,
        confirmationBodyText: undefined,
        isConfirmationOpen: false,
      };
    case '@@metadata/init_chatbot':
      return {
        ...state,
        isChatbotInitialized: true,
      };
    case '@@metadata/init_fb_flag':
      return {
        ...state,
        fbInitFlag: true,
      };
    case '@@metadata/queue_fb_event':
      return {
        ...state,
        fbEventQueue: [...state.fbEventQueue, action.value],
      };
    case '@@metadata/clear_fb_queue':
      return {
        ...state,
        fbEventQueue: [],
      };
    case '@@metadata/add_verified_email':
      return {
        ...state,
        verifiedEmails: [
          ...state.verifiedEmails,
          action.value,
        ],
      };
    case '@@metadata/primary/add_disclosures_answered':
      return {
        ...state,
        primary: {
          ...state.primary, // TODO (FORM-1013): Remove line
          disclosuresAnswered: [
            ...state.primary.disclosuresAnswered,
            action.value,
          ],
        },
      };
    case '@@metadata/secondary/add_disclosures_answered':
      return {
        ...state,
        secondary: {
          ...state.secondary, // TODO (FORM-1013): Remove line
          disclosuresAnswered: [
            ...state.secondary.disclosuresAnswered,
            action.value,
          ],
        },
      };
    case '@@metadata/primary/update_metadata_prop':
      return {
        ...state,
        primary: {
          ...state.primary,
          [action.property]: action.value,
        },
      };
    case '@@metadata/secondary/update_metadata_prop':
      return {
        ...state,
        secondary: {
          ...state.secondary,
          [action.property]: action.value,
        },
      };
    case '@@metadata/primary/update_metadata_product_app_prop':
      return {
        ...state,
        primary: {
          ...state.primary, // TODO (FORM-1013): Remove line
          [`${action.product}App`]: {
            ...state.primary[`${action.product}App`],
            [action.property]: action.value,
          },
        },
      };
    case '@@metadata/secondary/update_metadata_product_app_prop':
      return {
        ...state,
        secondary: {
          ...state.secondary, // TODO (FORM-1013): Remove line
          [`${action.product}App`]: {
            ...state.secondary[`${action.product}App`],
            [action.property]: action.value,
          },
        },
      };
    case '@@metadata/debug':
      return {
        ...state,
        ...action.value,
      };
    case '@@metadata/init_ab_test_band':
      return {
        ...state,
        abTestBand: action.data,
      };
    case `@@metadata/primary/session/update`:
      return {
        ...state,
        primary: {
          ...state.primary,
          session: {
            [action.property]: action.value,
          },
        },
      };
    case `@@metadata/secondary/session/update`:
      return {
        ...state,
        secondary: {
          ...state.secondary,
          session: {
            [action.property]: action.value,
          },
        },
      };
    case '@@metadata/existingPolicies/update':
      return {
        ...state,
        existingPolicies: {
          ...state.existingPolicies,
          [action.property]: action.value,
        },
      };
    case `@@metadata/primary/userViewedPriceInfo`: {
      // eslint-disable-next-line no-case-declarations
      const { totalMonthlyNonDiscountedPrice, productType, ...rest } = action.value;
      return {
        ...state,
        primary: {
          ...state.primary,
          userViewedPriceInfo: {
            ...state.primary.userViewedPriceInfo,
            ...rest,
            totalMonthlyNonDiscountedPrice: {
              ...state.primary.userViewedPriceInfo?.totalMonthlyNonDiscountedPrice,
              ...(
                productType
                  ? {
                    [productType]: (totalMonthlyNonDiscountedPrice[productType] || 0),
                  }
                  : {}
              ),
            },
          },
        },
      };
    }
    case `@@metadata/secondary/userViewedPriceInfo`: {
      // eslint-disable-next-line no-case-declarations
      const { totalMonthlyNonDiscountedPrice, productType, ...rest } = action.value;
      return {
        ...state,
        secondary: {
          ...state.secondary,
          userViewedPriceInfo: {
            ...state.secondary.userViewedPriceInfo,
            ...rest,
            totalMonthlyNonDiscountedPrice: {
              ...state.secondary.userViewedPriceInfo?.totalMonthlyNonDiscountedPrice,
              ...(
                productType
                  ? {
                    [productType]: (totalMonthlyNonDiscountedPrice[productType] || 0),
                  }
                  : {}
              ),
            },
          },
        },
      };
    }
    default:
      return state;
  }
};
