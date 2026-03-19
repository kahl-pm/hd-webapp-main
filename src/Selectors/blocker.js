import {
  stripTrailingSlash, getMatchingRouteParam,
} from '../utils/helpers';
import {
  ROUTES, ROUTE_REGEX, ROUTES_ORDER, ROUTE_SECTIONS,
  APPROVED_PAYMENT_ROUTES,
  USER_TYPES, PM_PRODUCT_PREFIX,
} from '../utils/const';
import { getMainProduct, hasPaidForAppliedProducts } from './helpers/productApp';
import { isJoint } from './userControl';

// gets all data related for blocker from our redux state
const getBlockerData = (state, userType) => {
  const {
    metadata: {
      currRoute,
      isMakingDecisionRequests,
      decisionHasBeenMade,
      dealLinkProductType,
    },
    [userType]: {
      hdPolicy: {
        policy_document_signature_completed: hd_policy_document_signature_completed,
      },
    },
  } = state;
  return {
    pathname: stripTrailingSlash(state.router.location.pathname),
    currRouteIdx: ROUTES_ORDER[currRoute],
    isMakingDecisionRequests,
    decisionHasBeenMade,
    hd_policy_document_signature_completed,
    isAfterSell: false,
    hasPaidForOptedInPolicies: hasPaidForAppliedProducts(state, userType),
  };
};

const _isBeforeApprovedRoute = (pathname, currRouteIdx) => (
  pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION) ||
  pathname.match(ROUTE_REGEX.APPLICATION_FULL_ADDRESS) ||
  (pathname.includes(ROUTE_SECTIONS.APPLICATION) &&
    !pathname.match(ROUTE_REGEX.DOCUSIGN_APPLICATION_CALLBACK))
);

const isDecisionIsMadeBlocker = (state) => {
  const {
    isMakingDecisionRequests, decisionHasBeenMade, pathname, currRouteIdx,
  } = getBlockerData(state, USER_TYPES.PRIMARY);

  const isDisclosure = pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION);

  // checks if the user clicked back from
  // consent page while a decision is processing
  const isDecisionProcessing = isMakingDecisionRequests &&
    (
      isDisclosure ||
      pathname.match(ROUTE_REGEX.APPLICATION_FULL_ADDRESS) ||
      currRouteIdx < ROUTES_ORDER[ROUTES.APPLICATION_CONSENT]
    );

  // checks if the user is in the application journey
  // even after proceeding past the consent page
  const isDecisionMade = decisionHasBeenMade &&
    (
      isDisclosure ||
      currRouteIdx < ROUTES_ORDER[ROUTES.APPLICATION_CONSENT]
    );

  return isDecisionProcessing || isDecisionMade;
};

// blocks approval pages after all steps complete
const isPolicyIsSetupBlocker = (state, userType) => {
  const mainProduct = getMainProduct(state, userType);
  const {
    pathname, currRouteIdx,
    hasPaidForOptedInPolicies,
  } = getBlockerData(state, userType);

  const _validUserTypes = Object.values(USER_TYPES);
  const isPaymentRoute = APPROVED_PAYMENT_ROUTES.find(
    route => {
      const userTypeParam = getMatchingRouteParam(route, pathname, 'userType');
      return (
        userTypeParam === userType || // userType param matches current userType
        (!!userTypeParam && !_validUserTypes.includes(userTypeParam))
        // there's a match on route but userTypeParam is not one of the USER_TYPES
      );
    },
  ) !== undefined;

  const esignUserTypeParam = getMatchingRouteParam(ROUTES.APPROVED_REVIEW_ESIGN_POLICY, pathname, 'userType');
  const isEsignPolicyRoute = esignUserTypeParam === userType ||
    (!!esignUserTypeParam && !_validUserTypes.includes(esignUserTypeParam));

  return (
    (mainProduct === PM_PRODUCT_PREFIX.HD && hasPaidForOptedInPolicies &&
      isPaymentRoute)
    ||
    (hasPaidForOptedInPolicies &&
    (
      _isBeforeApprovedRoute(pathname, currRouteIdx) ||
      isPaymentRoute ||
      isEsignPolicyRoute
    )
    ));
};

const hasAnyBlocker = (state) => (
  isDecisionIsMadeBlocker(state) ||
  [USER_TYPES.PRIMARY, USER_TYPES.SECONDARY].some((userType) => {
    if (userType === USER_TYPES.SECONDARY && !isJoint(state)) return false;
    return (
      isPolicyIsSetupBlocker(state, userType)
    );
  })
);

export {
  isDecisionIsMadeBlocker,
  isPolicyIsSetupBlocker,
  hasAnyBlocker,
};
