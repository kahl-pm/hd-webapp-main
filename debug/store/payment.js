import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'payment';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  planType: 'monthly',
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  planType: 'monthly',
};

function reInitState(user, value) {
  return {
    type: `@@${user}/payment/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
