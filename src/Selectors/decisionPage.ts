import { getTenant } from '@policyme/global-libjs-utils';
import { POLICIES_STATUS, USER_TYPES } from '../utils/const';
import { getHDAppPlanType, getMainProduct } from './helpers/productApp';
import { isGIProduct } from './hdSession';
import { isJoint, isPolicymePartner } from './userControl';
import { getFamilyDecision, getFamilyExclusions } from './hdDecision';
import { isPermanentInsurance } from './metadata';
import { State } from '../store/types/State';

const getUserDecisionProps = (state, userType) => {
  return {
    first_name: state[userType].household.firstName,
    last_name: state[userType].household.lastName,
    // HD fields
    hd_active_decision: state[userType].hdDecision.active_decision,
    hd_policy_in_force: state[userType].hdDecision.policy_status === POLICIES_STATUS.IN_FORCE_PAID,
    hd_policy_status: state[userType].hdDecision.policy_status,
    hd_payment_initial_complete: state[userType].hdPolicy.payment_initial_completed,
    tenantName: getTenant().name,
    underwritingMethod: state.primary?.hdApp?.underwriting_method,
    selectedPlanType: getHDAppPlanType(state),
    isGi: isGIProduct(state),
    isJoint: isJoint(state),
    application_language: state[userType].household.application_language,
  };
};

const getFamilyDecisionProps = (state) => {
  return {
    family_exclusions: getFamilyExclusions(state),
    family_decision: getFamilyDecision(state),
  };
};

const getDecisionPageProps = (state: State) => ({
  primary: {
    ...getUserDecisionProps(state, USER_TYPES.PRIMARY),
  },
  secondary: {
    ...getUserDecisionProps(state, USER_TYPES.SECONDARY),
  },
  family: {
    ...getFamilyDecisionProps(state),
  },
  hasPartnerApplication: state.userControl.hasPartnerApplication,
  currentUser: state.userControl.currentUser,
  backPressed: state.metadata.backPressed,
  fromDropJourney: state.metadata.fromDropJourney,
  fromAccounts: state.metadata.fromAccounts,
  dashboardUser: state.userControl.dashboardUser,
  mainProduct: getMainProduct(state, state.userControl.dashboardUser),
  isPolicymePartner: isPolicymePartner(state),
  dependent_keys: state.dependents?.dependent_keys,
  dependents: state.dependents?.dependents,
  isPermanent: isPermanentInsurance(state),
  isAffiliate: !!state.userControl.affiliate.affiliateName,
});

const getProductDecisionData = (state, userType, product) => {
  const productDecision = state[userType]?.[`${product}Decision`] || {};

  const totalDebits = productDecision.uw_total_debits || 0;
  const flatExtraDebits = productDecision.uw_flat_extra_debits || 0;
  const smokingDiscrepancyFlag = productDecision.smoking_discrepancy_flag || false;

  const hasRatingsOrSmokingDiscrepancy =
  !!(totalDebits || flatExtraDebits > 0 || smokingDiscrepancyFlag);

  return {
    totalDebits,
    flatExtraDebits,
    smokingDiscrepancyFlag,
    hasRatingsOrSmokingDiscrepancy,
  };
};

export {
  getDecisionPageProps,
  getProductDecisionData,
};
