import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'hdApp';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  birthplace: '',
  birthplace_provstate: '',
  product_added: '',
  buying_method: '',
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  birthplace: '',
  birthplace_provstate: '',
  product_added: '',
  buying_method: '',
};

function reInitState(user, value) {
  return {
    type: `@@${user}/hdApp/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
