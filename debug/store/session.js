import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'session';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  household_id: '77fd1a67-41f7-4ade-863d-12350e4f869e',
  household_id_vers: 0,
  life_application_id: 'b7a6e443-c915-46de-8790-55eddf4fab11',
  life_session_id: 'fcd4f172-41b7-4605-af4e-aed01fa68310',
  life_session_id_vers: 0,
  life_policy_id: '',
  aura_session_id: '78e31225-b637-4cdd-b85d-8aa92269a33e',
  ci_session_id: 'd414e811-5ce5-4369-8fe2-76ff84fa3fc5',
  ci_application_id: 'ffaccde2-23da-4dc2-b9ce-669f248936d7',
  ci_policy_id: '',
  auth_num_attempts_remaining: 7,
  auth_num_otp_attempts_remaining: 5,
  auth_otp_authorized: true,
  auth_medium: 'sms',
  auth_validate_email_phone: '5555555555',
  auth_verify_access_code: '082767',
  helcim_customer_code: null,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  household_id: '77fd1a67-41f7-4ade-863d-12350e4f869e',
  household_id_vers: 0,
  life_application_id: 'b7a6e443-c915-46de-8790-55eddf4fab11',
  life_session_id: 'fcd4f172-41b7-4605-af4e-aed01fa68310',
  life_session_id_vers: 0,
  life_policy_id: '',
  aura_session_id: '78e31225-b637-4cdd-b85d-8aa92269a33e',
  ci_session_id: 'd414e811-5ce5-4369-8fe2-76ff84fa3fc5',
  ci_application_id: 'ffaccde2-23da-4dc2-b9ce-669f248936d7',
  ci_policy_id: '',
  auth_num_attempts_remaining: 7,
  auth_num_otp_attempts_remaining: 5,
  auth_otp_authorized: true,
  auth_medium: 'sms',
  auth_validate_email_phone: '5555555555',
  auth_verify_access_code: '082767',
  helcim_customer_code: null,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/session/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
