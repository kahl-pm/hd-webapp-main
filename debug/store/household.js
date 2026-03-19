import store from '../../src/store';

import { RESIDENCE_TYPES, GENDERS } from '../../src/utils/const';
import { getStore } from '../utils';

const storeName = 'household';
const data = getStore(`primary/${storeName}`);
const initialState = data || {
  assetsTotOverride: 0,
  birthdate: '01/01/2000',
  creditCards: '',
  debtsTotOverride: 0,
  email: 'jeff.mckay+test1-approved@policyme.com',
  existingCoverage: {
    spouse: {
      group: '',
      individual: '',
    },
    user: {
      group: '',
      individual: '',
    },
  },
  firstName: 'JeffTest1',
  hasDebts: false,
  hasExistingCoverage: false,
  hasKids: true,
  hasPartner: true,
  hasSavings: false,
  health: false,
  homeEquityLoans: '',
  kids: [
    {
      age: '4',
      reactId: 'Pa-On3tzx',
    },
    {
      age: '0',
      reactId: 'Wy_TFYYQ9',
    },
  ],
  lastName: 'McKay',
  linesOfCredit: '',
  mortgage: '',
  nonRetirementSavings: '',
  otherDebt: '',
  partnerAge: '30',
  partnerGender: '',
  partnerIncome: 34343,
  partnerIncomeOverride: '',
  phone: '12345678888',
  residence: '',
  residenceType: 'rent',
  retirementSavings: '',
  smoke: false,
  studentLoans: '',
  userGender: 'Male',
  userIncome: 75000,
  userIncomeOverride: 75000,
};

const dataSecondary = getStore(`secondary/${storeName}`);
const secondaryInitialState = dataSecondary || {
  assetsTotOverride: 0,
  birthdate: '01/01/2000',
  creditCards: '',
  debtsTotOverride: 0,
  email: 'jeff.mckay+test1-approved@policyme.com',
  existingCoverage: {
    spouse: {
      group: '',
      individual: '',
    },
    user: {
      group: '',
      individual: '',
    },
  },
  firstName: 'JeffTest1',
  hasDebts: false,
  hasExistingCoverage: false,
  hasKids: true,
  hasPartner: true,
  hasSavings: false,
  health: false,
  homeEquityLoans: '',
  kids: [
    {
      age: '4',
      reactId: 'Pa-On3tzx',
    },
    {
      age: '0',
      reactId: 'Wy_TFYYQ9',
    },
  ],
  lastName: 'McKay',
  linesOfCredit: '',
  mortgage: '',
  nonRetirementSavings: '',
  otherDebt: '',
  partnerAge: '30',
  partnerGender: '',
  partnerIncome: 34343,
  partnerIncomeOverride: '',
  phone: '12345678888',
  residence: '',
  residenceType: 'rent',
  retirementSavings: '',
  smoke: false,
  studentLoans: '',
  userGender: 'Male',
  userIncome: 75000,
  userIncomeOverride: 75000,
};

function reInitState(user, value) {
  return {
    type: `@@${user}/household/debug`,
    value,
  };
}

store.dispatch(reInitState('primary', initialState));
store.dispatch(reInitState('secondary', secondaryInitialState));
