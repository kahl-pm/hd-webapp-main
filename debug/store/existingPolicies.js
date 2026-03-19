import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'existingPolicies';
const data = getStore(`${storeName}`);
const initialState = data || {};

function reInitState(value) {
  return {
    type: `@@existingPolicies/debug`,
    value,
  };
}

store.dispatch(reInitState(initialState));
