import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'disclosure';
const data = getStore(`primary/${storeName}`);
const initialState = data ? data : {
  disclosures: {},
  order: [],
  sections: [],
  submitted: false,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary ? dataSecondary : {
  disclosures: {},
  order: [],
  sections: [],
  submitted: false,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/disclosure/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
