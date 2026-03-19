import cloneDeep from 'lodash/cloneDeep';

import { productSessionState, makeProductSessionReducer } from './helpers/productSession';
import { PM_PRODUCT_PREFIX } from '../utils/const';

const copyState = cloneDeep(productSessionState);
const initialState = {
  ...copyState,
  plan_type: '',
  determine_plan: null,
  prescription_drug_flag: null,
  losing_benefits: null,
  family_composition_flag: null,
  household_income: null,
};

export default (userType) => (state = initialState, action) => (
  makeProductSessionReducer(userType, PM_PRODUCT_PREFIX.HD)(state, action));
