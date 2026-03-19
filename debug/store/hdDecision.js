import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'hdDecision';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  active_decision: '',
  initial_decision: '',
  policy_status: '',
  aps_field_required_flag: '',
  mvr_required_flag: '',
  nurse_visit_required_flag: '',
  aura_uw_decision_error_flag: '',
  risks: [],
  tobacco_rating_flag: false,
  smoking_discrepancy_flag: false,
  uw_total_debits: 0,
  uw_flat_extra_debits: 0,
  active_maximum_eligible_coverage: '',
  exclusions: [],
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  active_decision: '',
  initial_decision: '',
  policy_status: '',
  aps_field_required_flag: '',
  mvr_required_flag: '',
  nurse_visit_required_flag: '',
  aura_uw_decision_error_flag: '',
  risks: [],
  tobacco_rating_flag: false,
  smoking_discrepancy_flag: false,
  uw_total_debits: 0,
  uw_flat_extra_debits: 0,
  active_maximum_eligible_coverage: '',
  exclusions: [],
};

function reInitState(user, value) {
  return {
    type: `@@${user}/hdDecision/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
