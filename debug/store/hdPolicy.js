import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'hdPolicy';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
  premium_class: '',
  annual_premiums_issued: '',
  annual_premiums_applied: '',
  monthly_premiums_issued: '',
  monthly_premiums_applied: '',
  original_monthly_premiums_issued: '',
  original_annual_premiums_issued: '',
  discounts: [],
  coverageAmount: '',
  term: '',
  quote_breakdown: {},
  add_ons_completed: false,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  applicationDate: '',
  payment_initial_completed: false,
  payment_recurring_completed: false,
  policy_document_signature_completed: false,
  exclusions_flag: false,
  premium_class: '',
  annual_premiums_issued: '',
  annual_premiums_applied: '',
  monthly_premiums_issued: '',
  monthly_premiums_applied: '',
  original_monthly_premiums_issued: '',
  original_annual_premiums_issued: '',
  discounts: [],
  coverageAmount: '',
  term: '',
  quote_breakdown: {},
  add_ons_completed: false,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/hdPolicy/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
