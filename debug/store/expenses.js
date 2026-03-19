import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'expenses';
const data = getStore(storeName);
const initialState = data ? data : {
  exps_childcare: 1300,
  exps_discretionary: 550,
  exps_food: 1000,
  exps_other: 0,
  exps_residence: 3000,
  exps_shopping: 550,
  exps_telecom: 250,
  exps_transportation: 450,
  exps_utilities: 300,
  recmd_exps_childcare: 1300,
  recmd_exps_discretionary: 550,
  recmd_exps_food: 1000,
  recmd_exps_other: 0,
  recmd_exps_residence: 3000,
  recmd_exps_shopping: 550,
  recmd_exps_telecom: 250,
  recmd_exps_transportation: 450,
  recmd_exps_utilities: 300,
  totalEstimatedExpenses: 7400,
};

function reInitState(value) {
  return {
    type: '@@expenses/debug',
    value,
  };
}

store.dispatch(reInitState(initialState));
