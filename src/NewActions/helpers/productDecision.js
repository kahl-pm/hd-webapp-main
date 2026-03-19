import { sentryInfo, sentryError } from '@policyme/global-libjs-utils';
import jsCookie from 'js-cookie';

import { USER_TYPES, AURA_REASONS,
  POLICIES_STATUS, POLICIES_PREMIUM_CLASS,
  AUTHORIZATION_TYPE, CRM_LIFE_SESSION_FIELDS, PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, DIGITAL_CONSENT_STATUS, SESSION_STORAGE_LOGGING, APP_FORM_FIELDS } from '../../utils/const';
import { hasValue, allProducts, makeUpdateProductSessionProp } from '../../utils/helpers';
import { getPmUserTypeQuote, getPmQuoteBreakdownUserType } from '../../Selectors/quotes';
import { getProductTotalAmt, getProductSessionTerm } from '../../Selectors/helpers/productSession';
import { postProductPolicies, sendProductEligibilityStatus } from './productFetch';
import { updateMetadata } from '../metadata';
import { makeUpdateSessionProp } from '../session';
import { postAuraAuthorization } from '../fetch';
import { calcAgeNearest } from '../../utils/helpers';
import { makeUpdateProductPolicyProp } from './productPolicy';
import { getSessionSelectedQuotes } from '../../Selectors/hdSession';
import { updateDependentDecision } from '../dependents';
import { setHealthDentalDependentSessionQuotes } from '../hdSession';
import { getAppUnderwritingMethod } from '../../Selectors/helpers/productApp';
import { showDigitalConsentPage, isDigitalConsentJourney } from '../../Selectors/userControl';
import { AURA_CONSENT_TYPES, DEFAULT_CONSENT_VERSIONS } from '../../utils/consentVersion';
import { getTenantCode } from '../../tenant/helpers';

// calculateSiliMaxCoverage removed: Life-specific SILI logic not needed for HD-only flow

export const makeUpdateDecisionProp = (user, product) => (property, value) => {
  return {
    type: `@@${user}/${product}Decision/update_decision_prop`,
    property,
    value,
  };
};

export const makeAddRisks = (user, product) => (value) => {
  return {
    type: `@@${user}/${product}Decision/add_risks`,
    value,
  };
};

export const storeRisks = (risks, userType, product) => {
  return async (dispatch, getState) => {
    if (hasValue(risks) && risks.length > 0) {
      dispatch(makeAddRisks(userType, product)(risks));
      let unknown_ruw_risks = risks.filter((risk) => {
        const hasUnknownRisk = !(risk.risk_code in AURA_REASONS);
        return risk.decision === 'RUW' && hasUnknownRisk;
      });
      // flag out ruw risks not in the lookup table to sentry
      if (hasValue(unknown_ruw_risks) && unknown_ruw_risks.length > 0) {
        sentryInfo('Unknown aura risks', { extras: { unknown_ruw_risks } });
      }
    }
  };
};

// Remark: productType has to be the first argument of passed in fn
export const createPolicyIdRecord = allProducts((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();

    const payload = getPolicyCreatePayload(state, userType, product);

    const fetchedData = await postProductPolicies(product, payload);

    return dispatch(makeUpdateSessionProp(userType)(`${product}_policy_id`, fetchedData.policy_id));
  };
});

const getPolicyCreatePayload = (state, userType, product) => {
  let selectedQuote = getPmUserTypeQuote(state, userType, product);
  const app_id = state[userType].session[`${product}_application_id`];
  const issue_age = calcAgeNearest(state[userType].household.birthdate);
  const smoke = state[userType].household.smoke;
  const digital_consent_status = showDigitalConsentPage(state) ?
    DIGITAL_CONSENT_STATUS.PENDING : DIGITAL_CONSENT_STATUS.INACTIVE;
  if (product === PM_PRODUCT_PREFIX.HD) {
    const selectedPlanQuotes = getSessionSelectedQuotes(state);
    return {
      app_id,
      family_id: state.primary.session.hd_family_id,
      undiscounted_monthly_premiums_applied: selectedQuote.original_mn_prems,
      // plan_type: selectedPlanQuotes[0]?.plan_type,
      prices: selectedPlanQuotes,
      issue_age,
      policy_status: POLICIES_STATUS.PENDING,
      from_primary_user: userType === USER_TYPES.PRIMARY,
      affiliate_id: state.userControl.affiliateId,
    };
  }
  return {};
};

const getHDAuthenticationPayload = (underwritingMethod) => {
  const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][PM_PRODUCT_PREFIX.HD];
  if (underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN) {
    return {
      authorization_type: AUTHORIZATION_TYPE.FUW_HD,
      authorization_vers: consentVersions[AUTHORIZATION_TYPE.FUW_HD],
    };
  }

  return {
    authorization_type: AUTHORIZATION_TYPE.GI,
    authorization_vers: consentVersions[AUTHORIZATION_TYPE.GI],
  };
};

// Remark: productType has to be the first argument of passed in fn
export const createAuraAuthenticationRecord = allProducts((product, userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const policy_id = state[userType].session[`${product}_policy_id`];
    const underwritingMethod = getAppUnderwritingMethod(state, userType, product);
    const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][product];

    let payload;

    if (product === PM_PRODUCT_PREFIX.HD) {
      payload = getHDAuthenticationPayload(underwritingMethod);
    } else {
      // Non-HD products not expected in HD-only flow
      payload = {};
    }

    return postAuraAuthorization(policy_id, payload);
  };
});

export const populateDependentDecision = (dependentKey, decisionData) => {
  return async (dispatch, getState) => {
    const {
      decision,
      aps_required,
      nurse_visit_required,
      mvr_required,
      risks,
      quote_breakdown,
    } = decisionData;

    // INFO: we only need active_decision for GI
    dispatch(updateDependentDecision(dependentKey, 'active_decision', decision));

    dispatch(updateDependentDecision(dependentKey, 'initial_decision', decisionData.initial_decision));
    dispatch(updateDependentDecision(dependentKey, 'risks', risks));
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.APS_FIELD_REQUIRED_FLAG, aps_required ? 'Y' : 'N'));
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.NURSE_VISIT_REQUIRED_FLAG, nurse_visit_required ? 'Y' : 'N'));
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.MVR_REQUIRED_FLAG, mvr_required ? 'Y' : 'N'));
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'N'));

    if (quote_breakdown) {
      dispatch(setHealthDentalDependentSessionQuotes(dependentKey, quote_breakdown));
    }

    // update decision state
    dispatch(updateDependentDecision(dependentKey, CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'N'));
    dispatch(updateDependentDecision(dependentKey, 'tobacco_rating_flag', decisionData.tobacco_rating_flag));
    dispatch(updateDependentDecision(dependentKey, 'smoking_discrepancy_flag', decisionData.smoking_discrepancy_flag));
    dispatch(updateDependentDecision(dependentKey, 'uw_total_debits', decisionData.uw_total_debits));
    dispatch(updateDependentDecision(dependentKey, 'uw_flat_extra_debits', decisionData.uw_lat_extra_debits));
    dispatch(updateDependentDecision(dependentKey, 'exclusions', decisionData.exclusions));
  };
};

export const populateProductDecision = (userType, product, res) => {
  return async (dispatch, getState) => {
    let state = getState();
    const {
      decision, active_decision, aps_required, nurse_visit_required, mvr_required, risks,
    } = res;
    // TODO: NP2-2314 backend should use return active_decision
    dispatch(makeUpdateDecisionProp(userType, product)('active_decision', decision));

    if (res.initial_decision) {
      dispatch(makeUpdateDecisionProp(userType, product)('initial_decision', res.initial_decision));
    }

    dispatch(storeRisks(risks, userType, product));

    dispatch(makeUpdateDecisionProp(userType, product)(
      CRM_LIFE_SESSION_FIELDS.APS_FIELD_REQUIRED_FLAG, aps_required ? 'Y' : 'N',
    ));
    dispatch(makeUpdateDecisionProp(userType, product)(
      CRM_LIFE_SESSION_FIELDS.NURSE_VISIT_REQUIRED_FLAG, nurse_visit_required ? 'Y' : 'N',
    ));
    dispatch(makeUpdateDecisionProp(userType, product)(
      CRM_LIFE_SESSION_FIELDS.MVR_REQUIRED_FLAG, mvr_required ? 'Y' : 'N',
    ));
    dispatch(makeUpdateDecisionProp(userType, product)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'N'));

    await dispatch(makeUpdateProductPolicyProp(userType, product)('coverageAmount', res.coverage_amount));
    await dispatch(makeUpdateProductPolicyProp(userType, product)('term', res.term));

    // update policy state
    dispatch(makeUpdateProductPolicyProp(userType, product)('coverage_amount', res.coverage_amount));
    dispatch(makeUpdateProductPolicyProp(userType, product)('premium_class', res.premium_class));
    dispatch(makeUpdateProductPolicyProp(userType, product)('annual_premiums_issued', res.annual_premiums_issued));
    dispatch(makeUpdateProductPolicyProp(userType, product)('monthly_premiums_issued', res.monthly_premiums_issued));
    dispatch(makeUpdateProductPolicyProp(userType, product)('original_annual_premiums_issued', res.original_annual_premiums_issued));
    dispatch(makeUpdateProductPolicyProp(userType, product)('original_monthly_premiums_issued', res.original_monthly_premiums_issued));

    // CORE-1087: ONLY USED FOR RUW
    dispatch(makeUpdateProductPolicyProp(userType, product)('monthly_premiums_applied', res.monthly_premiums_applied));

    dispatch(makeUpdateProductPolicyProp(userType, product)('discounts', res.discounts));

    // quote_breakdow can be null if there were no ratings during the decision process,
    // if thats the case use the current quote_breakdown
    if (res.quote_breakdown) {
      dispatch(makeUpdateProductPolicyProp(userType, product)('quote_breakdown', res.quote_breakdown));
    } else {
      dispatch(makeUpdateProductPolicyProp(userType, product)('quote_breakdown', getPmQuoteBreakdownUserType(
        state,
        userType,
        product,
      )));
    }

    // update decision state
    dispatch(makeUpdateDecisionProp(userType, product)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG, 'N'));
    dispatch(makeUpdateDecisionProp(userType, product)('tobacco_rating_flag', res.tobacco_rating_flag));
    dispatch(makeUpdateDecisionProp(userType, product)('smoking_discrepancy_flag', res.smoking_discrepancy_flag));
    dispatch(makeUpdateDecisionProp(userType, product)('uw_total_debits', res.uw_total_debits));
    dispatch(makeUpdateDecisionProp(userType, product)('uw_flat_extra_debits', res.uw_flat_extra_debits));
    dispatch(makeUpdateDecisionProp(userType, product)('active_maximum_eligible_coverage', res.active_maximum_eligible_coverage));
    dispatch(makeUpdateDecisionProp(userType, product)('exclusions', res.exclusions));
  };
};

// Simplified for HD-only flow: HD eligibility is handled differently
export const checkProductEligibilityWithBackend = allProducts((product, userType) => {
  return async (dispatch, getState) => {
    // HD products skip eligibility check (handled server-side)
    if (product === PM_PRODUCT_PREFIX.HD) {
      return Promise.resolve();
    }
    // Non-HD products not expected in HD-only flow
    return Promise.resolve();
  };
});

const _eligibilityRequest = async (product, application_id, payload, state) => {
  const res = await sendProductEligibilityStatus(
    product,
    application_id,
    payload,
  );
  return res.has_eligibility_issue;
};
