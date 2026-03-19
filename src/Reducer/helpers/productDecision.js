import {
  AURA_REASONS, RISKS_BLACKLIST, CRM_LIFE_SESSION_FIELDS,
} from '../../utils/const';
import { toTitleCase } from '../../utils/helpers';

export const productDecisionState = {
  active_decision: '',
  initial_decision: '',
  policy_status: '',
  // TODO: CI-product  confirm hs field name for CI
  [CRM_LIFE_SESSION_FIELDS.APS_FIELD_REQUIRED_FLAG]: '',
  [CRM_LIFE_SESSION_FIELDS.MVR_REQUIRED_FLAG]: '',
  [CRM_LIFE_SESSION_FIELDS.NURSE_VISIT_REQUIRED_FLAG]: '',
  [CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG]: '',
  risks: [],
  tobacco_rating_flag: false,
  smoking_discrepancy_flag: false,
  uw_total_debits: 0.0,
  uw_flat_extra_debits: 0.0,
  active_maximum_eligible_coverage: '',
  exclusions: [],
};

const makeDecisionGeneralReducer = (userType, product) => {
  return (state, action) => {
    let ruw_risks;
    let sorted_risks;
    switch (action.type) {
      case `@@${userType}/${product}Decision/update_decision_prop`:
      case `@@all/${product}Decision/update_decision_prop`:
        return {
          ...state,
          [action.property]: action.value,
        };
      case `@@${userType}/${product}/add_risks`:
      case `@@${userType}/${product}Decision/add_risks`:
      case `@@all/${product}Decision/add_risks`:
        ruw_risks = action.value.filter((risk) => (
          risk.decision === 'RUW' && !RISKS_BLACKLIST.includes(risk.risk_code)
        ));
        ruw_risks = ruw_risks.map((risk) => {
          const risk_code = risk.risk_code;
          const customerFriendlyReason = risk_code in AURA_REASONS ? AURA_REASONS[risk_code].customer_friendly_reason : '';
          const priority = risk_code in AURA_REASONS && customerFriendlyReason !== '' ? AURA_REASONS[risk_code].priority : null;

          return {
            risk: risk_code,
            customerFriendlyReason: toTitleCase(customerFriendlyReason),
            priority,
          };
        });
        sorted_risks = ruw_risks.sort((a, b) => {
          if (a.priority === b.priority) { // sort by alphabetical order if same priority
            return a.risk.localeCompare(b.risk);
          }
          if (a.priority === null || a.customer_friendly_reason === '') { // has lowest priority
            return 1;
          }
          return a.priority > b.priority ? 1 : -1; // priority = 0 is highest priority
        });
        return {
          ...state,
          risks: [...sorted_risks],
        };
      case `@@${userType}/${product}Decision/debug`:
      case `@@all/${product}Decision/debug`:
        return {
          ...state,
          ...action.value,
        };
      default:
        return state;
    }
  };
};

export default makeDecisionGeneralReducer;
