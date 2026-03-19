import _ from 'lodash';
import shortid from 'shortid';
import * as constants from '../../src/utils/const';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
    birthplace: '',
    birthplace_provstate: '',
    product_added: '',
    buying_method: 'Cross-sell',
  },
  [STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]: {
    birthplace: 'CA',
    birthplace_provstate: 'OLI_CAN_AB',
    product_added: true,
    buying_method: 'Stand-alone',
  },
  [STATES_ENUM.JOURNEY_JOINT_HD_GI]: {
    birthplace: 'CA',
    birthplace_provstate: 'OLI_CAN_AB',
    product_added: true,
    buying_method: 'Stand-alone',
    underwriting_method: constants.UNDERWRITING_METHODS.GUARANTEED_ISSUE,
  },
  [STATES_ENUM.JOURNEY_HD_QUOTES]: {
    birthplace: 'CA',
    birthplace_provstate: 'OLI_CAN_AB',
    product_added: true,
    buying_method: 'Stand-alone',
    underwriting_method: constants.UNDERWRITING_METHODS.GUARANTEED_ISSUE,
  },
};

export class HdApp {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setHdAppProp(prop, val) {
    this.formData[prop] = val;
    return this;
  }
}
