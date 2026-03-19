import store from '../../src/store';
import { JOINT_ROLES } from '../../src/utils/const';
import { getStore } from '../utils';

const storeName = 'hdSession';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  selected_quote: '',
  selected_term: '',
  term: '',
  override_amt: '',
  selected_quote_type: 1,
  joint_role: 0,
  max_eligible_coverage: '',
  plan_type: '',
  underwriting_method: 'guaranteed_issued',
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  selected_quote: '',
  selected_term: '',
  term: '',
  override_amt: '',
  selected_quote_type: 1,
  joint_role: 0,
  max_eligible_coverage: '',
  plan_type: '',
  underwriting_method: 'guaranteed_issued',
};

function reInitState(user, value) {
  return {
    type: `@@${user}/hd/session/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
