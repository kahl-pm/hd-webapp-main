import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'lifeSession';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  addtl: {
    abroad: '',
    disability: '',
    education: '',
    parents: '',
  },
  cov_type: 'MARRIED',
  cover_education: false,
  cover_housing: '',
  initialized: true,
  options: [
    {
      amt: 1325000,
      amt_unrounded: 1325000,
      extra_fields: {
        breakdown: {
          debts: 0,
          existing_coverage: 0,
          kids_education_costs: 0,
          kids_expenses: 525000,
          non_retirement_savings: 0,
          spouse_expenses: 1850000,
          spouse_future_income: 1050000,
          total_savings: 0,
        },
      },
      fullname: 'Tuna Fish',
      id: 1,
      name: 'tunafish',
      type: 6,
    },
  ],
  override_amt: 400000,
  quotes: [],
  recmd_cov_amt: 1325000,
  selected_opt: 1,
  selected_quote: 1,
  selected_term: 10,
  term: 65,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  addtl: {
    abroad: '',
    disability: '',
    education: '',
    parents: '',
  },
  cov_type: 'MARRIED',
  cover_education: false,
  cover_housing: '',
  initialized: true,
  options: [
    {
      amt: 1325000,
      amt_unrounded: 1325000,
      extra_fields: {
        breakdown: {
          debts: 0,
          existing_coverage: 0,
          kids_education_costs: 0,
          kids_expenses: 525000,
          non_retirement_savings: 0,
          spouse_expenses: 1850000,
          spouse_future_income: 1050000,
          total_savings: 0,
        },
      },
      fullname: 'Tuna Fish',
      id: 1,
      name: 'tunafish',
      type: 6,
    },
  ],
  override_amt: 400000,
  quotes: [],
  recmd_cov_amt: 1325000,
  selected_opt: 1,
  selected_quote: 1,
  selected_term: 10,
  term: 65,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/life/session/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
