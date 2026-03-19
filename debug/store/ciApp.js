import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'ciApp';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  birthplace: '',
  birthplace_provstate: '',
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  birthplace: '',
  birthplace_provstate: '',
};

function reInitState(user, value) {
  return {
    type: `@@${user}/ciApp/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
