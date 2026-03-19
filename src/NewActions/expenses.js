import { allUsers } from '../utils/helpers';
import { patchExpenses } from './fetch';

export function updateExpensesProp(property, value) {
  return {
    type: '@@expenses/update',
    property,
    value,
  };
}

export function setFromEstimate(expenses) {
  return {
    type: '@@expenses/set_from_estimates',
    expenses,
  };
}

export function getPatchExpensePayload(allExpenses) {
  let exps = Object.keys(allExpenses).reduce((acc, key) => {
    if (key.startsWith('exps_')) {
      if (allExpenses[key]) {
        acc[key] = allExpenses[key];
      } else {
        acc[key] = 0.0;
      }
    }
    return acc;
  }, {});
  let { exps_other, totalEstimatedExpenses } = allExpenses;
  let otherAmt = exps_other === '' ? 0.0 : exps_other;
  let other = [{ type: 'other1', amount: otherAmt }];
  return {
    expenses: {
      ...exps,
      exps_other: other,
    },
  };
}

export const updateExpenses = allUsers((userType) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { expenses, [userType]: { session: { household_id, household_id_vers } } } = state;
    if (!household_id) {
      return Promise.resolve();
    }
    const payload = getPatchExpensePayload(expenses);
    return patchExpenses(household_id, household_id_vers, payload);
  };
});
