import cloneDeep from 'lodash/cloneDeep';

import { PM_PRODUCT_PREFIX } from '../utils/const';
import makePolicyGeneralReducer, { productPolicyState } from './helpers/productPolicy';

const copyState = cloneDeep(productPolicyState);

export const initialState = {
  ...copyState,
  hbm_status: null,
  effective_date: '',
};

export default (user) => (state = initialState, action) => (
  makePolicyGeneralReducer(user, PM_PRODUCT_PREFIX.HD)(state, action));
