import ReduxState from '../ReduxStateMother';
import {
  getExistingCoverage,
  getNetWorth,
  getSavings,
  getDebts,
  getDebtsWithMtge,
  hasValidEmail,
  contactCustomerInformation,
  isQuebecHousehold,
  isQuebecHealthCardProvince,
} from '../../src/Selectors/household';
import { STATES_ENUM } from '../ReduxStateMother/const';
import { USER_TYPES } from '../../src/utils/const';

describe.each([
  [STATES_ENUM.DEFAULT],
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT],
])('Household with state strategy %s', (stateStrategy) => {
  describe('getExistingCoverage', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });

    test('Should add group coverage', () => {
      stateObj1.primary.household.setUser('group', 23).setUser('individual', 23);
      expect(getExistingCoverage(stateObj1, USER_TYPES.PRIMARY)).toBe(46);
    });

    test('Should add individual coverage', () => {
      stateObj1.primary.household.setUser('individual', 22).setUser('group', 0);
      expect(getExistingCoverage(stateObj1, USER_TYPES.PRIMARY)).toBe(22);
    });

    test('Should sum group and individual coverage', () => {
      stateObj1.primary.household.setUser('individual', 22)
        .setUser('group', 23);
      expect(getExistingCoverage(stateObj1, USER_TYPES.PRIMARY)).toBe(45);
    });
  });

  describe('getNetWorth', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });
    test.each([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, '', '', '', '', '', '', '', ''],
      [1079, 100, 1000, 1, 2, 3, 4, 5, 6],
      [-2070, 10, 20, 100, 200, 300, 400, 500, 600],
      [23, 23, 0, 0, 0, 0, 0, 0, 0],
      [23, 0, 23, 0, 0, 0, 0, 0, 0],
      [-23, 0, 0, 23, 0, 0, 0, 0, 0],
      [-23, 0, 0, 0, 23, 0, 0, 0, 0],
      [-23, 0, 0, 0, 0, 23, 0, 0, 0],
      [-23, 0, 0, 0, 0, 0, 23, 0, 0],
      [-23, 0, 0, 0, 0, 0, 0, 23, 0],
      [-23, 0, 0, 0, 0, 0, 0, 0, 23],
      [10, undefined, 20, '', 0, 0, 0, 10, 0],
    ])(`Should return %s when retirementSavings is %s, nonRetirement savings is %s, mortgage is %s, creditCards is %s, 
     studentLoans is %s, homeEquityLonas is %s, linesOfCredit is %s and otherdebt is %s`, (expected, retirement, nonRetirement, mortgage, creditCards, studentLoans, homeEquityLoans, linesOfCredit, otherDebt) => {
      stateObj1.primary.household.setHouseholdProp('retirementSavings', retirement)
        .setHouseholdProp('nonRetirementSavings', nonRetirement)
        .setHouseholdProp('mortgage', mortgage)
        .setHouseholdProp('creditCards', creditCards)
        .setHouseholdProp('studentLoans', studentLoans)
        .setHouseholdProp('homeEquityLoans', homeEquityLoans)
        .setHouseholdProp('linesOfCredit', linesOfCredit)
        .setHouseholdProp('otherDebt', otherDebt);
      expect(getNetWorth(stateObj1.primary)).toBe(expected);
    });
  });

  describe('getSavings', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });
    test.each([[3, 3, 0], [50, 50, 0], [150, 50, 100], [0, '', undefined]])('Should return %s when retirement savings is %s and non retirement savings is %s', (expected, retirement, nonRetirement) => {
      stateObj1.primary.household.setHouseholdProp('retirementSavings', retirement)
        .setHouseholdProp('nonRetirementSavings', nonRetirement);
      expect(getSavings(stateObj1.primary)).toBe(expected);
    });
  });

  describe('getDebts', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });
    test.each([[0, 0, 0, 0, 0, 0], [70, 50, 0, 0, 20, 0], [237, 0, 100, 33, 99, 5], [99, undefined, undefined, 0, 99, '']])('Should return %s when homeEquity loans is %s, otherDebt is %s, creditCards is %s, studentLoans is %s, linesOfCredit is %s', (expected, homeEquity, otherDebt, creditCards, studentLoans, linesOfCredit) => {
      stateObj1.primary.household.setHouseholdProp('homeEquityLoans', homeEquity)
        .setHouseholdProp('otherDebt', otherDebt)
        .setHouseholdProp('creditCards', creditCards)
        .setHouseholdProp('studentLoans', studentLoans)
        .setHouseholdProp('linesOfCredit', linesOfCredit);
      expect(getDebts(stateObj1.primary)).toBe(expected);
    });
  });

  describe('getDebtsWithMtge', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });
    test.each([[0, 0, 0, 0, 0, 0, 0], [50, 0, 0, 0, 0, 0, 50], [240, 1, 100, 33, 99, 5, 2], [199, undefined, 100, '', 99, undefined, 0]])('Should return %s when homeEquity loans is %s, otherDebt is %s, creditCards is %s, studentLoans is %s, linesOfCredit is %s and mortage is %s', (expected, homeEquity, otherDebt, creditCards, studentLoans, linesOfCredit, mortgage) => {
      stateObj1.primary.household.setHouseholdProp('homeEquityLoans', homeEquity)
        .setHouseholdProp('otherDebt', otherDebt)
        .setHouseholdProp('creditCards', creditCards)
        .setHouseholdProp('studentLoans', studentLoans)
        .setHouseholdProp('linesOfCredit', linesOfCredit)
        .setHouseholdProp('mortgage', mortgage);
      expect(getDebtsWithMtge(stateObj1.primary)).toBe(expected);
    });
  });

  describe('hasValidEmail', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });

    test.each([
      [false, 'email', 'xyz.com'],
      [true, 'email', 'xyz@gmail.com'],
      [false, 'email', 'xyz#$%@$%^gmail.com'],
      [true, 'email', 'xyz-.1.2.3-@7.-gm.ail.com'],
      [false, 'email', 'xyz-.1.2.3-@7.-gm.ail.co.m'],
      [false, 'email', ' '],
      [true, 'email', 'xyz.34@abc.co.uk'],
      [true, 'email', 'xyz34@yahoo.com'],
      [true, 'email', 'xyz34@yahoo.orgorgorgorgorgorgorgorg'],
    ])('Should return %s if %s is %s', (expected, prop, email) => {
      stateObj1.primary.household.setHouseholdProp(prop, email);
      expect(hasValidEmail(stateObj1.primary)).toBe(expected);
    });

    test('Undefined input should give TypeError', () => {
      expect(() => {
        hasValidEmail();
      }).toThrow(TypeError);
    });
  });

  describe('contactCustomerInformation', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
    });

    test('Should contain the following fields', () => {
      stateObj1.primary.household.setHouseholdProp('birthdate', '08/08/1999')
        .setHouseholdProp('smoke', true)
        .setHouseholdProp('userGender', 'Female');
      expect(contactCustomerInformation(stateObj1.primary)).toEqual(`Birthdate: 08/08/1999
  Gender: Female
  Smoke: true`);
    });
  });
});

describe('Test isQuebecHousehold selector', () => {
  let stateObj1;
  beforeEach(() => {
    stateObj1 = new ReduxState(STATES_ENUM.DEFAULT);
  });

  test('Primary Quebec applicant', () => {
    stateObj1.primary.household.province = 'QC';
    stateObj1.secondary.household.province = 'ON';
    expect(isQuebecHousehold(stateObj1)) === true;
  });

  test('Secondary Quebec applicant', () => {
    stateObj1.primary.household.province = 'ON';
    stateObj1.secondary.household.province = 'QC';
    expect(isQuebecHousehold(stateObj1)) === true;
  });

  test('No Quebec applicants', () => {
    stateObj1.primary.household.province = 'ON';
    stateObj1.secondary.household.province = 'ON';
    expect(isQuebecHousehold(stateObj1)) === false;
  });
});

describe('Test isQuebecHealthCardProvince selector', () => {
  let stateObj1;
  beforeEach(() => {
    stateObj1 = new ReduxState(STATES_ENUM.DEFAULT);
  });

  test('Primary Quebec applicant having healthcard_province as Quebec', () => {
    stateObj1.primary.household.healthcard_province = 'QC';
    stateObj1.secondary.household.healthcard_province = 'ON';
    expect(isQuebecHealthCardProvince(stateObj1)) === true;
  });

  test('Secondary Quebec applicant having healthcard_province as Quebec', () => {
    stateObj1.primary.household.healthcard_province = 'ON';
    stateObj1.secondary.household.healthcard_province = 'QC';
    expect(isQuebecHealthCardProvince(stateObj1)) === true;
  });

  test('No household members have healthcard_province as Quebec', () => {
    stateObj1.primary.household.healthcard_province = 'ON';
    stateObj1.secondary.household.healthcard_province = 'ON';
    expect(isQuebecHealthCardProvince(stateObj1)) === false;
  });
});
