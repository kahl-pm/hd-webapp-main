import cloneDeep from 'lodash/cloneDeep';
import { SSO_CONNECTION_TYPES } from '../constants/socialSignOn';

export const initialState = {
  household_id: '',
  household_id_vers: '',
  hd_session_id: '',
  hd_application_id: '',
  hd_policy_id: '',
  hd_family_id: '',
  aura_session_id: '',
  promo_code: '',
  auth_num_attempts_remaining: '',
  auth_num_otp_attempts_remaining: '',
  auth_otp_authorized: '',
  auth_medium: '',
  auth_validate_email_phone: '',
  auth_verify_access_code: '',
  helcim_customer_code: '',
  twilio_token: '',
  user_id: '',
  account_id: '',
  is_logged_in: false,
};

const makeSessionGeneralReducer = (slice) => {
  return (state, action) => {
    switch (action.type) {
      case `@@${slice}/update`:
        return {
          ...state,
          [action.property]: action.value,
        };
      case `@@${slice}/update_household`:
        return {
          ...state,
          household_id: action.value.hh_info_id,
          household_id_vers: action.value.hh_info_id_vers,
        };
      case `@@${slice}/debug`:
        return {
          ...state,
          ...action.value,
        };
      default:
        return state;
    }
  };
};

const SLICE_NAME = 'session';

export default (user) => (state = initialState, action) => (
  makeSessionGeneralReducer(`${user}/${SLICE_NAME}`)(state, action));
