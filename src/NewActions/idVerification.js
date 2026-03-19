import { USER_TYPES } from '../utils/const';

// No-op: Life/CI ID verification removed for HD-only flow
export function backgroundIdVerificationCheck(userType = USER_TYPES.PRIMARY) {
  return async (dispatch, getState) => {
    // No-op for HD-only flow
  };
}
