import store from '../../src/store';
import { JOINT_ROLES } from '../../src/utils/const';
import { getStore } from '../utils';

const storeName = 'ciSession';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  override_amt: 40000,
  recmd_cov_amt: 1325000,
  selected_opt: 1,
  selected_quote_type: 1,
  joint_role: JOINT_ROLES.PRIMARY,
  selected_term: 10,
  term: 65,
  max_eligible_coverage: 600000,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  override_amt: 40000,
  recmd_cov_amt: 1325000,
  selected_opt: 1,
  selected_quote_type: 1,
  joint_role: JOINT_ROLES.SECONDARY,
  selected_term: 10,
  term: 65,
  max_eligible_coverage: 600000,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/ci/session/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
