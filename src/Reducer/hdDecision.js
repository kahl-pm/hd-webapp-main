import cloneDeep from 'lodash/cloneDeep';

import { PM_PRODUCT_PREFIX } from '../utils/const';
import makeDecisionGeneralReducer, { productDecisionState } from './helpers/productDecision';

const copyState = cloneDeep(productDecisionState);

export const initialState = {
  ...copyState,
};

export default (user) => (state = initialState, action) => (
  makeDecisionGeneralReducer(user, PM_PRODUCT_PREFIX.HD)(state, action));
