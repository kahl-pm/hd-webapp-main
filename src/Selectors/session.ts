import { PM_PRODUCT_PREFIX, ROUTES, USER_TYPES } from '../utils/const';
import { hasValue, stripTrailingSlash } from '../utils/helpers';

const getBlockPrimaryQueryString = (state) => {
  return `?blockPrimaryPages=true`;
};

const completedNeedsAssesment = (state, userType, product) => {
  return hasValue(state[userType][`${product}Session`].recmd_cov_amt);
};

const completedJointNeedsAssesment = (state, product) => {
  return hasValue(state.primary[`${product}Session`].recmd_cov_amt) &&
    hasValue(state.secondary[`${product}Session`].recmd_cov_amt);
};
const getProductPolicyId = (state, userType, product) => {
  return state[userType]?.session[`${product}_policy_id`];
};
const getProductSessionId = (state, userType, product) => {
  return state[userType]?.session[`${product}_session_id`];
};
const getProductAppId = (state, userType, product) => {
  return state[userType]?.session[`${product}_application_id`];
};

const doesPolicyIdExist = (state, userType) => {
  const hd_policy_id = getProductPolicyId(state, userType, PM_PRODUCT_PREFIX.HD);
  return Boolean(hd_policy_id);
};

const doesSessionIdExist = (state, userType) => {
  const hd_session_id = getProductSessionId(state, userType, PM_PRODUCT_PREFIX.HD);
  return Boolean(hd_session_id);
};

const doesAppIdExist = (state, userType) => {
  const hd_app_id = getProductAppId(state, userType, PM_PRODUCT_PREFIX.HD);
  return Boolean(hd_app_id);
};

const canSkipDecisionPage = (_state) => {
  // In HD-only webapp, never skip the decision page via Life/CI logic
  return false;
};

const shouldJumpToDecision = (state) => {
  const pathname = stripTrailingSlash(state.router.location.pathname);
  switch (pathname) {
    case ROUTES.DECISION_DASHBOARD_CALLBACK:
      return true;
    case ROUTES.SKIP_MAGIC_LINK_CALLBACK:
    case ROUTES.MAGIC_LINK_AUTH_CALLBACK:
    case ROUTES.OTP_VERIFICATION:
    case ROUTES.TWO_FACTOR_VERIFICATION_CODE:
      return doesPolicyIdExist(state, USER_TYPES.PRIMARY);
    default:
      return false;
  }
};

export {
  getBlockPrimaryQueryString,
  completedNeedsAssesment,
  completedJointNeedsAssesment,
  getProductPolicyId,
  getProductAppId,
  doesPolicyIdExist,
  doesSessionIdExist,
  doesAppIdExist,
  canSkipDecisionPage,
  shouldJumpToDecision,
};
