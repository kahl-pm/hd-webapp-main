import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'userControl';
const data = getStore(`${storeName}`);
const initialState = data || {
  currentUser: 'primary',
  hasPartnerApplication: false,
  availableProducts: [
    'life',
    'ci',
    'hd',
  ],
};

function reInitState(value) {
  return {
    type: `@@user_control/debug`,
    value,
  };
}

store.dispatch(reInitState(initialState));
