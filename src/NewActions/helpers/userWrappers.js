import { USER_TYPES } from '../../utils/const';

/**
 * HD-only simplified version - always dispatches for PRIMARY only.
 * HD never does secondary cross-sell.
 */
export const allCrossSellableUsers = (fn) => (...params) => async (
  dispatch, getState,
) => {
  let primaryRes = await dispatch(fn(USER_TYPES.PRIMARY, ...params));
  return [primaryRes, undefined];
};

/**
 * HD-only simplified version - always dispatches for PRIMARY only.
 * HD never does secondary cross-sell.
 */
export const allCrossSellableUsersExcludeProductArg = (fn) => (...params) => async (
  dispatch, getState,
) => {
  let primaryRes = await dispatch(fn(USER_TYPES.PRIMARY, ...params.slice(1)));
  return [primaryRes, undefined];
};
