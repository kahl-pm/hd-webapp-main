import { State } from '../../store/types/State';
import { AURA_DECISION_TYPES, BUYING_METHOD, DOCUSIGN_EVENT_CODE, InsuranceOwnershipType, PM_PRODUCT_PREFIX, POLICIES_STATUS, ProductType, UnderwritingMethod, UserType } from '../../utils/const';
import { getHDPlanTypeListForTenant, isEmpty } from '../../utils/helpers';

export const isAppProductAdded = (state, userType, product) => {
  return state[userType][`${product}App`].product_added === true;
};

export const isCiOptedIn = (_state, _userType) => {
  return false;
};

export const isLifeOptedIn = (_state, _userType) => {
  return false;
};

export const isHDOptedIn = (state, userType) => {
  return isAppProductAdded(state, userType, PM_PRODUCT_PREFIX.HD);
};

export const getAppProductAdded = (state, userType, product) => {
  return state[userType][`${product}App`].product_added;
};

export const isAppOptedEmpty = (state, userType, product) => {
  return isEmpty(getAppProductAdded(state, userType, product));
};

export const areMultipleProductsOptedIn = (_state, _userType) => {
  return false;
};

export const getAppBuyingMethod = (state, userType, product) => {
  return state[userType][`${product}App`].buying_method;
};

export const getAppUnderwritingMethod = (state: State,
  userType: UserType,
  product: ProductType): UnderwritingMethod => {
  return state[userType][`${product}App`].underwriting_method;
};

export const getAppInsuranceOwnershipType = (
  state: State,
  userType: UserType,
  product: ProductType,
): InsuranceOwnershipType => {
  return state[userType][`${product}App`].insurance_ownership_type;
};

export const getHDAppPlanType = (state) => {
  const findPlanType = (s) => {
    const selectedPlanType = s && Object.keys(s).find(key => s[key]?.selected);
    // cast to readonly string[] for .includes ts error
    const isValidHDPlanType = selectedPlanType
      && (Object.values(getHDPlanTypeListForTenant()) as readonly string[])
        .includes(selectedPlanType);
    return isValidHDPlanType ? selectedPlanType : null;
  };
  return findPlanType(state?.userControl?.hd_quotes);
};

export const getAppFamilyId = (state, userType, product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    // TODO: check where are we going to set family_id for HD products
    return state?.primary?.session?.hd_family_id ?? null;
  }

  return state[userType]?.session?.[`${product}_family_id`] ?? null;
};

export const isStandAloneTermLifeJourney = (_state, _userType) => {
  return false;
};

export const isAfterSellCIJourney = (_state, _userType) => {
  return false;
};

export const isAfterSellTermLifeJourney = (_state, _userType) => {
  return false;
};

export const isStandAloneCIJourney = (_state, _userType) => {
  return false;
};

export const isStandAloneHDJourney = (state, userType) => {
  const hd_buying_method = getAppBuyingMethod(state, userType, PM_PRODUCT_PREFIX.HD);
  return hd_buying_method === BUYING_METHOD.STAND_ALONE;
};

const _getMainProductDecisionPageHDLink = (_state, _userType) => {
  return PM_PRODUCT_PREFIX.HD;
};

export const getMainProductDecisionPage = (state, userType, dropLinkProduct) => {
  if (dropLinkProduct === PM_PRODUCT_PREFIX.HD) {
    return _getMainProductDecisionPageHDLink(state, userType);
  }
  return null;
};

export const getMainProduct = (state, userTypeKey): ProductPrefix => {
  // HD is the only product in this webapp
  return PM_PRODUCT_PREFIX.HD;
};

export type ProductPrefix = typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX];
export const getProductEventPrefix = (product: ProductPrefix) => {
  return 'H&D';
};

export const getMainProductEventPrefix = (state, userType) => {
  return 'H&D';
};

export const shouldShowOptionalEsignCard = (_state, _userType) => {
  return false;
};

export const isCIAfterSellOrStandAlone = (_state, _userType) => {
  return false;
};

export const hasPaidForAppliedProducts = (state, userType) => {
  const {
    [userType]: {
      session: {
        hd_policy_id,
      },
      hdPolicy: {
        payment_initial_completed: hd_payment_initial_completed,
        payment_recurring_completed: hd_payment_recurring_completed,
      },
    },
  } = state;
  const isBuyingHd = isHDOptedIn(state, userType) && hd_policy_id;
  const paidForHd = hd_payment_initial_completed && hd_payment_recurring_completed;

  return !!(isBuyingHd && paidForHd);
};

export const getAllOptedInProducts = (state, userType) => {
  const { hd_policy_id } = state[userType].session;
  const isBuyingHd = isHDOptedIn(state, userType) && hd_policy_id;

  if (isBuyingHd) {
    return [PM_PRODUCT_PREFIX.HD];
  }
  return [];
};

// Remark: product has to be the first argument of passed in fn
export const allProductsOptedIn = (fn) => (userType) => async (dispatch, getState) => {
  const state = getState();
  const allOptedInProducts = getAllOptedInProducts(state, userType);
  const promiseList = [];

  allOptedInProducts.forEach((product) => {
    promiseList.push(
      dispatch(fn(product, userType)),
    );
  });

  return Promise.all(promiseList);
};
export const isStripePaymentComplete = (state, userType, product) => {
  return state[userType].payment.stripePaymentComplete[product];
};
export const getAllUnpaidProducts = (state, userType) => {
  if (!isStripePaymentComplete(state, userType, PM_PRODUCT_PREFIX.HD)) {
    return [PM_PRODUCT_PREFIX.HD];
  }
  return [];
};

export const allUnpaidProducts = (fn) => (userType) => async (dispatch, getState) => {
  const state = getState();
  const unpaidProducts = getAllUnpaidProducts(state, userType);
  const promiseList = [];

  unpaidProducts.forEach((product) => {
    promiseList.push(
      dispatch(fn(product, userType)),
    );
  });

  return Promise.all(promiseList);
};

export const isSigningComplete = (state, userType) => {
  const { docusignEvent } = state.metadata;
  return (docusignEvent === DOCUSIGN_EVENT_CODE.SIGNING_COMPLETE ||
    docusignEvent === DOCUSIGN_EVENT_CODE.VIEWING_COMPLETE);
};

export const policyDocumentSignatureCompleted = (state, userType, productPrefix) => state[userType][`${productPrefix}Policy`].policy_document_signature_completed;

export const canEditCoverageOrTermLength = (
  state,
  userType,
  product,
) => {
  const isPolicyDocumentSignatureCompleted =
    policyDocumentSignatureCompleted(state, userType, product);
  const policyStatusInForce =
    state[userType][`${product}Decision`].policy_status === POLICIES_STATUS.IN_FORCE_PAID;
  const activeDecision = state[userType][`${product}Decision`].active_decision;

  if (activeDecision !== AURA_DECISION_TYPES.APPROVED || policyStatusInForce) {
    return false;
  }
  if (isPolicyDocumentSignatureCompleted) {
    return false;
  }

  return true;
};

export const getDigitalConsentStatus = (state, userType, productPrefix) => {
  return state[userType][`${productPrefix}Policy`].digital_consent_status;
};

/**
 * Get the product type from the current route
 * This is required because when we parse params globally, we don't have
 * access to the preAppMainProduct / the product type from application logic.
 * Old approach was to set the product type per route because we parsed params
 * per product route, but now we parse params globally.
 * @param state : State
 * @returns : ProductType
 */
export const getProductFromCurrRoute = (state: State): ProductType => {
  /**
   * This uses the same logic as the routeRegexMatch in utm.js,
   * where we extract the product prefix from the route.
   * This essentially checks the routes for the /:product/ prefix and
   * maps it to the corresponding product prefix.
   */
  const routeRegexMatch = state.router.location.pathname.match(/^\/(\w+\/)/);
  if (!routeRegexMatch) {
    return null;
  }
  switch (routeRegexMatch[0]) {
    case '/hd/':
      return PM_PRODUCT_PREFIX.HD;
    default:
      return null;
  }
};
