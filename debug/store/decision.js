import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'Decision';

const lifePrimaryData = getStore(`primary/life${storeName}`);
const lifePrimaryInitData = lifePrimaryData || {
  active_decision: 'Approved',
  initial_decision: 'Approved',
  policy_status: '',
  aps_field_required_flag: 'N',
  mvr_required_flag: 'N',
  nurse_visit_required_flag: 'N',
  aura_uw_decision_error_flag: 'N',
  risks: [],
};

const lifeSecondaryData = getStore(`secondary/life${storeName}`);
const lifeSecondaryInitData = lifeSecondaryData || {
  active_decision: 'Approved',
  initial_decision: 'Approved',
  policy_status: '',
  aps_field_required_flag: 'N',
  mvr_required_flag: 'N',
  nurse_visit_required_flag: 'N',
  aura_uw_decision_error_flag: 'N',
  risks: [],
};

const ciPrimaryData = getStore(`primary/ci${storeName}`);
const ciPrimaryInitData = ciPrimaryData || {
  active_decision: 'Approved',
  initial_decision: 'Approved',
  policy_status: '',
  aps_field_required_flag: 'N',
  mvr_required_flag: 'N',
  nurse_visit_required_flag: 'N',
  aura_uw_decision_error_flag: 'N',
  risks: [],
};

const ciSecondaryData = getStore(`secondary/ci${storeName}`);
const ciSecondaryInitData = ciSecondaryData || {
  active_decision: 'Approved',
  initial_decision: 'Approved',
  policy_status: '',
  aps_field_required_flag: 'N',
  mvr_required_flag: 'N',
  nurse_visit_required_flag: 'N',
  aura_uw_decision_error_flag: 'N',
  risks: [],
};

function reInitState(user, product, value) {
  return {
    type: `@@${user}/${product}Decision/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', 'life', lifePrimaryInitData));
store.dispatch(reInitState('secondary', 'life', lifeSecondaryInitData));
store.dispatch(reInitState('primary', 'ci', ciPrimaryInitData));
store.dispatch(reInitState('secondary', 'ci', ciSecondaryInitData));
