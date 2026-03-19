import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]: {
    active_decision: 'Approved',
    initial_decision: '',
    policy_status: 'Pending',
    aps_field_required_flag: '',
    mvr_required_flag: '',
    nurse_visit_required_flag: '',
    aura_uw_decision_error_flag: 'N',
    risks: [],
    tobacco_rating_flag: false,
    smoking_discrepancy_flag: false,
    uw_total_debits: 0,
    uw_flat_extra_debits: 0,
    active_maximum_eligible_coverage: '',
    exclusions: [],
  },
};

export class HdDecision {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setHdDecisionProp(propName, val) {
    this[propName] = val;
    return this;
  }
}
