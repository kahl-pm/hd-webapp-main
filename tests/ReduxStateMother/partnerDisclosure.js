import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
    disclosures: {},
    order: [],
    sections: [],
    submitted: false,
  },
  [STATES_ENUM.DEV_INIT]: {
    disclosures: {},
    order: [],
    sections: [],
    submitted: false,
  },
  [STATES_ENUM.JOINT]: {
    disclosures: {},
    order: [],
    sections: [],
    submitted: false,
  },
};

export class PartnerDisclosure {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setPartnerDisclosureProp(prop, value) {
    this[prop] = value;
    return this;
  }
}
