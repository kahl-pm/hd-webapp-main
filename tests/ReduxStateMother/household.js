import _ from 'lodash';
import { LOCALE } from '@policyme/global-libjs-utils';
import { isJointStrategy } from '../util';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
    email: '',
    firstName: '',
    lastName: '',
    hasPartner: '',
    partnerAge: '',
    partnerGender: '',
    userIncome: '',
    userIncomeOverride: '', // from app form
    userGender: '',
    hasSavings: '',
    partnerIncome: '',
    partnerIncomeOverride: '', // from app form
    hasDebts: '',
    residenceType: '',
    birthdate: '',
    smoke: '',
    health: '',
    phone: '',
    hasKids: '',
    kids: [],
    nonRetirementSavings: '',
    retirementSavings: '',
    assetsTotOverride: '', // from app form, used in partner hh_info
    creditCards: '',
    linesOfCredit: '',
    homeEquityLoans: '',
    mortgage: '',
    otherDebt: '',
    studentLoans: '',
    debtsTotOverride: '', // from app form, used in partner hh_info
    hasExistingCoverage: '',
    address_line1: '',
    address_line2: '',
    city: '',
    country: '',
    postal_code: '',
    province: '',
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
    user_family_composition: '',
  },
  [STATES_ENUM.DEV_INIT]: {
    email: 'selby.gomes+test_redux@policyme.com',
    firstName: 'testapp',
    lastName: 'testapp',
    hasPartner: false,
    partnerAge: '',
    partnerGender: '',
    userIncome: 100000,
    userIncomeOverride: 100000,
    userGender: 'Male',
    hasSavings: false,
    partnerIncome: '',
    partnerIncomeOverride: '',
    hasDebts: false,
    residenceType: 'rent',
    birthdate: '01/01/1990',
    smoke: false,
    health: false,
    phone: '0000000000',
    hasKids: false,
    kids: [],
    nonRetirementSavings: '',
    retirementSavings: '',
    assetsTotOverride: '',
    creditCards: '',
    linesOfCredit: '',
    homeEquityLoans: '',
    mortgage: '',
    otherDebt: '',
    studentLoans: '',
    debtsTotOverride: '',
    hasExistingCoverage: false,
    address_line1: '325 Front St W',
    address_line2: '',
    city: 'toronto',
    country: 'CA',
    postal_code: 'K1Y 2C3',
    province: 'AB',
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
    user_family_composition: '',
    residence: '',
    application_language: LOCALE.EN_CA,
  },
  [STATES_ENUM.JOINT]: {
    email: 'selby.gomes+test_redux_2@policyme.com',
    firstName: 'testapp',
    lastName: 'testapp',
    hasPartner: true,
    partnerAge: '30',
    partnerGender: '',
    userIncome: 50000,
    userIncomeOverride: 50000,
    userGender: 'Male',
    hasSavings: false,
    partnerIncome: 50000,
    partnerIncomeOverride: 50000,
    hasDebts: false,
    residenceType: 'rent',
    birthdate: '01/01/1990',
    smoke: false,
    health: false,
    phone: '0000000000',
    hasKids: true,
    kids: [
      {
        age: '7',
      },
    ],
    nonRetirementSavings: '',
    retirementSavings: '',
    assetsTotOverride: '',
    creditCards: '',
    linesOfCredit: '',
    homeEquityLoans: '',
    mortgage: '',
    otherDebt: '',
    studentLoans: '',
    debtsTotOverride: '',
    hasExistingCoverage: false,
    address_line1: '325 Front St W',
    address_line2: '',
    city: 'toronto',
    country: 'CA',
    postal_code: 'K1Y 2C3',
    province: 'AB',
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
    user_family_composition: '',
    residence: '',
  },
};

states[STATES_ENUM.JOURNEY_INDIVIDUAL_QUEBEC_HOUSEHOLD] = {
  ...states[STATES_ENUM.DEV_INIT],
  province: 'QC',
};

states[STATES_ENUM.JOURNEY_JOINT_QUEBEC_HOUSEHOLD] = {
  ...states[STATES_ENUM.JOINT],
  province: 'QC',
};

states[STATES_ENUM.JOURNEY_1_INDIV_QUEBEC] = {
  ...states[STATES_ENUM.DEV_INIT],
  province: 'QC',
};

states[STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI] = {
  ...states[STATES_ENUM.DEV_INIT],
  application_language: LOCALE.EN_CA,
};

export class Household {
  constructor(strategy) {
    const stateObj = states[strategy] ?
      states[strategy] :
      isJointStrategy(strategy) ?
        states[STATES_ENUM.JOINT] : states[STATES_ENUM.DEV_INIT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  removeKidsByAge(value) {
    this.kids = this.kids.filter(key => key !== value);
    return this;
  }

  removeAllKids() {
    this.kids = [];
    return this;
  }

  setUser(prop, value) {
    this.existingCoverage.user[prop] = value;
    return this;
  }

  setHouseholdProp(prop, value) {
    this[prop] = value;
    return this;
  }

  addKids(value) {
    this.kids.push(value);
    return this;
  }
}
