import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'lifePolicy';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
  add_ons_completed: false,
  beneficiaries_completed: false,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
  add_ons_completed: false,
  beneficiaries_completed: false,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/lifePolicy/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
