import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'ciPolicy';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/ciPolicy/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
