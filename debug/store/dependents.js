import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'dependents';
const data = getStore(`${storeName}`);
const initialState = data || {};

function reInitState(user, value) {
  return {
    type: `@@dependents/debug`,
    value,
  };
}

store.dispatch(reInitState('dependents', initialState));
