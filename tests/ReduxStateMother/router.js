import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      query: {},
    },
    action: 'POP',
  },
  [STATES_ENUM.DEV_INIT]: {
    location: {
      pathname: '/approved/primary/review-esign-policy',
      search: '?life_policy_id=5f611562-a202-4cc3-a80a-43cbfbe77c0f',
      hash: '',
      key: '32ri8x',
      query: {
        life_policy_id: '5f611562-a202-4cc3-a80a-43cbfbe77c0f',
      },
    },
    action: 'PUSH',
  },
  [STATES_ENUM.JOINT]: {
    location: {
      pathname: '/decision-dashboard',
      search: '',
      hash: '',
      key: 'rz76dx',
      query: {},
    },
    action: 'PUSH',
  },
};

export class Router {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setPathname(val) {
    this.location.pathname = val;
    return this;
  }
}
