import store from '../../src/store';
import { getStore } from '../utils';

const storeName = 'beneficiary';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  beneficiary_keys: [
    '',
  ],
  beneficiaries: {},
  beneficiaries_secondary_flag: 'N',
  standard_beneficiary_flag: '',
  isSecondaryBeneficiaryChosen: false,
  beneficiaries_estate_flag: '',
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  beneficiary_keys: [
    '',
  ],
  beneficiaries: {},
  beneficiaries_secondary_flag: 'N',
  standard_beneficiary_flag: '',
  isSecondaryBeneficiaryChosen: false,
  beneficiaries_estate_flag: '',
};

function reInitState(user, value) {
  return {
    type: `@@${user}/beneficiary/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
