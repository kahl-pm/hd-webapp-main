import _ from 'lodash';
import { STATES_ENUM } from './const';
import { JOINT_ROLES, UNDERWRITING_METHODS, QUOTE_TYPES } from '../../src/utils/const';

const states = {
  [STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]: {
    selected_quote: 1,
    selected_term: '',
    term: '',
    override_amt: '',
    selected_quote_type: QUOTE_TYPES.PRIMARY,
    joint_role: JOINT_ROLES.NONE,
    max_eligible_coverage: '',
    plan_type: 'standard',
    underwriting_method: UNDERWRITING_METHODS.GUARANTEED_ISSUE,
  },
  [STATES_ENUM.DEV_INIT]: {
    losing_benefits: null,
  }
};

export class HdSession {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setHdSessionProp(prop, value) {
    this[prop] = value;
    return this;
  }
}
