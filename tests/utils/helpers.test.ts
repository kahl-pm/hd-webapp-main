import moment from 'moment';
import '@testing-library/jest-dom';
import { LOCALE, THEMES, getTenant, test as testUtils } from '@policyme/global-libjs-utils';
import {
  toNameFormat, fromStrToNull,
  addPossessiveApostrophe,
  truthyValuesToYesNoStrings,
  listResolvedAndRejectedPromises,
  getTranslatedRelationship,
  getUserQuoteIdentifier,
  getBirthdateParts,
  processHbmResponse,
  getCookieDomain, getNextPageTwoFaFlow, isAgeEligibleForPermanentInsurance,
  shouldEnablePermForPermMilestonV2AgeRequirement,
  getUserLeadSources,
  getCategoriesFromPlans,
  isStatutoryHoliday,
  isDisabledDate,
  parsePriceFormattedString,
  isCSPolicyMeEmailModifier,
} from '../../src/utils/helpers';

import {
  PM_PRODUCT_PREFIX,
  TWO_FACTOR_STATUS, TWO_FACTOR_FLOW,
  USER_TYPES,
} from '../../src/utils/const';
import ReduxState from '../ReduxStateMother';

import * as constants from '../../src/utils/const';
import { getAllOptedInProducts, allProductsOptedIn } from '../../src/Selectors/helpers/productApp';
import { AgeValidator } from '../../src/utils/ageValidator';

describe('toNameFormat', () => {
  test('capitalizes first letter', () => {
    expect(toNameFormat('marc')).toBe('Marc');
  });

  test('downcases 2nd + letters if multiple are uppercase', () => {
    expect(toNameFormat('MCKAY')).toBe('Mckay');
  });

  test('does not change if first and one other letter are capitalized', () => {
    expect(toNameFormat('McKay')).toBe('McKay');
  });

  test('Capitalizes first letter even if one other letter is capitalized', () => {
    expect(toNameFormat('mcKay')).toBe('McKay');
  });

  test('will do both uppercasing first letter and downcasing the rest', () => {
    expect(toNameFormat('mCKay')).toBe('Mckay');
  });

  test('applies to multiple tokens, will capitalize single letters', () => {
    expect(toNameFormat('r l stine')).toBe('R L Stine');
  });

  test('it formats multiple tokens', () => {
    expect(toNameFormat('marc MCKAY Mckay mcKay mCKay')).toBe('Marc Mckay Mckay McKay Mckay');
  });

  test('removes extra whitespace', () => {
    expect(toNameFormat('    ronald    MacDonald      ')).toBe('Ronald MacDonald');
  });

  test('returns empty string when passed undefined', () => {
    expect(toNameFormat()).toBe('');
  });

  test('doesn\'t change numbers or specicial characters', () => {
    expect(toNameFormat('!@#$%^&*() 1234567890')).toBe('!@#$%^&*() 1234567890');
  });
});

describe('fromStrToNull', () => {
  test('The input is an array which should give the original array back', () => {
    expect(fromStrToNull([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('One of the values in null which should replace the empty string by null', () => {
    expect(fromStrToNull([1, '', 3])).toEqual([1, null, 3]);
  });

  test('One of the values in an instance of object which applies the transform function recursively on it', () => {
    expect(fromStrToNull([1, 2, [1, 2]])).toEqual([1, 2, [1, 2]]);
  });

  test('The input is an empty array which should give an empty array', () => {
    expect(fromStrToNull([])).toEqual([]);
  });

  test('The input is an an undefined array which should an empty object', () => {
    expect(fromStrToNull()).toEqual({});
  });

  test('The input is null should return an empty object', () => {
    expect(fromStrToNull(null)).toEqual({});
  });

  test('The input is an empty object should return an empty object', () => {
    expect(fromStrToNull({})).toEqual({});
  });
});

describe('validateAge', () => {
  test('Age is 18 and should give true', () => {
    const ageValidator = new AgeValidator();
    const dobStr = moment().subtract(18, 'years').format('DD/MM/YYYY');

    expect(ageValidator.validateAge(dobStr)).toBe(true);
  });

  test('Age is less than 18 and should give false', () => {
    const ageValidator = new AgeValidator();
    const dobStr = moment().subtract(17, 'years').format('DD/MM/YYYY');

    expect(ageValidator.validateAge(dobStr)).toBe(false);
  });

  test('Age is 74 and should give true', () => {
    const ageValidator = new AgeValidator();
    const dobStr = moment().subtract(74, 'years').format('DD/MM/YYYY');

    expect(ageValidator.validateAge(dobStr)).toBe(true);
  });

  test('Age is 76 and should give false', () => {
    const ageValidator = new AgeValidator();
    const dobStr = moment().subtract(76, 'years').format('DD/MM/YYYY');
    expect(ageValidator.validateAge(dobStr)).toBe(false);
  });

  test('Age is 99 and should give true for HD', () => {
    const ageValidator = new AgeValidator(PM_PRODUCT_PREFIX.HD);
    const dobStr = moment().subtract(99, 'years').format('DD/MM/YYYY');
    expect(ageValidator.validateAge(dobStr)).toBe(true);
  });

  test('Age is 100 and should give false for HD', () => {
    const ageValidator = new AgeValidator(PM_PRODUCT_PREFIX.HD);
    const dobStr = moment().subtract(100, 'years').format('DD/MM/YYYY');
    expect(ageValidator.validateAge(dobStr)).toBe(false);
  });

  test('Age is empty and should give false', () => {
    const ageValidator = new AgeValidator();
    expect(ageValidator.validateAge('')).toBe(false);
  });

  // Current date is 1st March 2024
  test('Born on a leap year date which is less than 18 years and should give false', () => {
    const ageValidator = new AgeValidator();
    const mockedDate = new Date(2024, 2, 1);
    const obj = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockedDate);

    expect(ageValidator.validateAge('29/02/2020')).toBe(false);

    // Unmocking
    obj.mockRestore();
  });

  test('Undefined age input anmd should give TypeError', () => {
    const ageValidator = new AgeValidator();
    expect(() => { ageValidator.validateAge(); }).toThrow(TypeError);
  });
});



describe('addPossessiveApostrophe', () => {
  test('English locale', () => {
    expect(addPossessiveApostrophe('Sam', LOCALE.EN_CA)).toBe(`Sam's`);
    expect(addPossessiveApostrophe('Thomas', LOCALE.EN_CA)).toBe(`Thomas'`);
    expect(addPossessiveApostrophe('', LOCALE.EN_CA)).toBe('');
  });
  test('French locale', () => {
    expect(addPossessiveApostrophe('Sam', LOCALE.FR_CA)).toBe(`de Sam`);
    expect(addPossessiveApostrophe('Thomas', LOCALE.FR_CA)).toBe(`de Thomas`);
    expect(addPossessiveApostrophe('Harry', LOCALE.FR_CA)).toBe(`d'Harry`);
    expect(addPossessiveApostrophe('Oliver', LOCALE.FR_CA)).toBe(`d'Oliver`);
    expect(addPossessiveApostrophe('Alice', LOCALE.FR_CA)).toBe(`d'Alice`);
    expect(addPossessiveApostrophe('Ernest', LOCALE.FR_CA)).toBe(`d'Ernest`);
    expect(addPossessiveApostrophe('', LOCALE.FR_CA)).toBe('');
  });
});

test('truthyValuesToYesNoStrings', () => {
  expect(truthyValuesToYesNoStrings({
    a: true,
    b: { c: false, d: true },
  })).toEqual({
    a: 'Y',
    b: { c: 'N', d: 'Y' },
  });
});

test('listResolvedAndRejectedPromises', async () => {
  const promise1 = Promise.resolve(3);
  const promise2 = 42;
  const promise3 = new Promise((resolve, reject) => {
    setTimeout(reject, 100, 'foo');
  });

  // eslint-disable-next-line max-len
  const { resolved, rejected } = await listResolvedAndRejectedPromises([promise1, promise2, promise3]);
  expect(resolved.length).toEqual(2);
  expect(resolved[0].status).toEqual('fulfilled');
  expect(resolved[0].value).toEqual(3);
  expect(resolved[1].status).toEqual('fulfilled');
  expect(resolved[1].value).toEqual(42);

  expect(rejected.length).toEqual(1);
  expect(rejected[0].status).toEqual('rejected');
  expect(rejected[0].reason).toEqual('foo');
});

describe('getTranslatedRelationship', () => {
  describe.each([
    ['Spouse', constants.FORMATTED_RELATIONSHIP_NAMES.SPOUSE],
    ['Aunt', constants.FORMATTED_RELATIONSHIP_NAMES.AUNT],
    ['Ex-partner', constants.FORMATTED_RELATIONSHIP_NAMES.EX_PARTNER],
    ['Invalid', null],
    ['', null],
  ])('relationship: %s', (relationship, expected) => {
    test('', () => {
      expect(getTranslatedRelationship(relationship)).toBe(expected);
    });
  });
});

describe('getUserQuoteIdentifier', () => {
  test('should return user household info id if it exists', () => {
    const userSession = {
      household_id: 123,
    };
    expect(getUserQuoteIdentifier(userSession, null)).toBe(123);
  });

  test('should return custom id if household info id does not exist', () => {
    const userHousehold = {
      birthdate: '28/09/1992',
      userGender: 'Male',
      smoke: false,
    };
    expect(getUserQuoteIdentifier(null, userHousehold)).toBe('28091992-male-false');
  });
});

describe('getBirthdateParts', () => {
  test('should get birthday parts', () => {
    expect(getBirthdateParts('28/09/1992')).toStrictEqual([28, 9, 1992]);
  });

  test('should return empty list if birthdate is null', () => {
    expect(getBirthdateParts(null)).toStrictEqual([]);
  });

  test('should return empty list if birthdate is undefined', () => {
    expect(getBirthdateParts(undefined)).toStrictEqual([]);
  });
});

// Mock the 'fn' function that is passed to 'allProductsOptedIn'
const fn = jest.fn((product, ...params) => Promise.resolve(product));

describe('allProductsOptedIn wrapper', () => {
  let mockState;
  let params;
  let actionCreator;
  let userType = 'primary';
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn();
    params = [userType];
    mockState = new ReduxState();
    mockState.userControl.currentUser = userType;
    mockState[userType].hdApp.product_added = true;
    mockState[userType].session.hd_policy_id = 'hd_policy_id';
    actionCreator = allProductsOptedIn(fn)(...params);
  });

  test('allProductsOptedIn runs for all optedInProducts', async () => {
    const getState = jest.fn(() => mockState);

    await actionCreator(dispatch, getState);
    const optedInProducts = getAllOptedInProducts(mockState, userType);

    optedInProducts.forEach((product) => {
      expect(fn).toHaveBeenCalledWith(product, ...params);
    });

    expect(dispatch).toHaveBeenCalledTimes(optedInProducts.length);
  });

  test('allProductsOptedIn does not run when there is no product added', async () => {
    mockState[userType].hdApp.product_added = false;
    const getState = jest.fn(() => mockState);

    await actionCreator(dispatch, getState);
    const optedInProducts = getAllOptedInProducts(mockState, userType);
    expect(optedInProducts.length).toBe(0);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });
});

describe('processHbmResponse test', () => {
  test('test success numbe', () => {
    expect(processHbmResponse(200)).toBe('success');
  });
  test('test success string', () => {
    expect(processHbmResponse('200')).toBe('success');
  });
  test('test failure number', () => {
    expect(processHbmResponse(401)).toBe('failure');
  });
  test('test failure string', () => {
    expect(processHbmResponse('500')).toBe('failure');
  });
});

describe('getCookieDomain', () => {
  test('should return localhost', () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      host: 'http://localhost:3000',
    };
    process.env.PM_ONDEMAND_ENV = 'true';
    expect(getCookieDomain()).toBe('localhost');
  });

  test('should return ondemand.', () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      host: 'infr-1663.life-health.caa.ondemand.policyme.com',
    };
    process.env.PM_ONDEMAND_ENV = '';
    expect(getCookieDomain()).toBe('infr-1663.life-health.caa.ondemand.policyme.com');
  });
  test('should return policyme.com', () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      host: 'www.policyme.com',
    };
    process.env.PM_ONDEMAND_ENV = '';
    expect(getCookieDomain()).toBe('policyme.com');
  });
  test('should return test.policyme.com', () => {
    delete global.window.location;
    global.window = Object.create(window);
    global.window.location = {
      host: 'test.policyme.com',
    };
    process.env.PM_ONDEMAND_ENV = '';
    expect(getCookieDomain()).toBe('test.policyme.com');
  });
});

describe('getNextPageTwoFaFlow', () => {
  test('should return the next page based on the two fa status', () => {
    expect(getNextPageTwoFaFlow(TWO_FACTOR_STATUS.ENABLED))
      .toBe(TWO_FACTOR_FLOW.SHOW_OTP_PAGE);
    expect(getNextPageTwoFaFlow(TWO_FACTOR_STATUS.DISABLED))
      .toBe(TWO_FACTOR_FLOW.SHOW_DASHBOARD_PAGE);
    expect(getNextPageTwoFaFlow(TWO_FACTOR_STATUS.PENDING))
      .toBe(TWO_FACTOR_FLOW.SHOW_PHONE_PAGE);
    expect(getNextPageTwoFaFlow(TWO_FACTOR_STATUS.SKIPPED))
      .toBe(TWO_FACTOR_FLOW.SHOW_DASHBOARD_PAGE);
    expect(getNextPageTwoFaFlow(null))
      .toBe(TWO_FACTOR_FLOW.SHOW_CREATE_ACCOUNT_PAGE);
  });
});

describe('ageVerificationForPermanentInsurance', () => {
  it.each([
    [18, 65, true, false],
    [50, 50, true, false],
    [67, 71, true, false],
    [71, 71, true, false],
    [76, 71, true, false],
    [35, 76, true, false],
    [41, NaN, true, false],
  ])('testing for primary %s and secondary %s should return %s', (primaryAge, secondaryAge, isJoint, expected) => {
    expect(isAgeEligibleForPermanentInsurance(primaryAge, secondaryAge, isJoint)).toBe(expected);
  });
});

describe('shouldEnablePermForPermMilestonV2AgeRequirement', () => {
  it.each([
    [50, undefined, false, false],
    [60, undefined, false, false],
    [61, undefined, false, false],
    [70, 50, true, false],
    [50, 70, true, false],
  ])('testing for primary %s and secondary %s should return %s', (primaryAge, secondaryAge, isJoint, expected) => {
    expect(
      shouldEnablePermForPermMilestonV2AgeRequirement(
        primaryAge, secondaryAge, isJoint,
      ),
    ).toBe(expected);
  });
});

jest.mock('@policyme/global-libjs-utils', () => {
  const actual = jest.requireActual('@policyme/global-libjs-utils');
  return {
    ...actual,
    getTenant: jest.fn(), // ← no return value yet
  };
});

describe('getUserLeadSources', () => {
  beforeEach(() => {
  });
  it.each([
    [THEMES.policyme_original, [
      'Youtube',
      'Podcast, Radio, Spotify',
      'Billboard / Transit / Outdoor Ad',
      'Employee Rewards Platform',
      'Search Engine (Google, Bing, etc.)',
      'Linkedin',
      'Facebook / Instagram',
      'Influencer',
      'Word of Mouth (Friends, Family, Co-workers, etc.)',
      'TikTok',
      'Reddit',
      'AI Tool (ChatGPT, Gemini, Perplexity, Copilot, etc.)',
      'PolicyMe Blog Article',
      'Other',
      'I Don\'t Recall',
    ]],
    [THEMES.AMA, [
      'Article or Blog',
      'Search Engine (Google, Bing, etc.)',
      'Facebook / Instagram',
      'Linkedin',
      'Youtube',
      'In-Branch',
      'Brochure',
      'CAA Magazine',
      'CAA Advisor',
      'Email',
      'Other',
      'I Don\'t Recall',
    ]],
    [THEMES.BCL, [
      'Article or Blog',
      'Facebook / Instagram',
      'Linkedin',
      'Youtube',
      'Google Search',
      'Bing Search',
      'Referral from Insurance Agent',
      'Banner Advertisement',
      'Other',
      'I Don\'t Recall',
    ]],
  ])('User lead sources for %s', (theme, expected) => {
    const tenant = testUtils.getTenantFromTheme(theme);
    getTenant.mockReturnValue(tenant);
    const actual = getUserLeadSources(tenant).map((source) => source.value);
    expect(actual.length).toEqual(expected.length);
    expect(actual.sort()).toEqual(expected.sort());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});

describe('getCategoriesFromPlans', () => {
  it.each([
    [
      [
        { category: 'Category 1', plan: 'Plan 1' },
        { category: 'Category 1', plan: 'Plan 2' },
        { category: 'Category 2', plan: 'Plan 3' },
      ],
      ['Category 1', 'Category 2'],
    ],
    [
      [
        { category: 'Category 1', plan: 'Plan 1' },
        { category: 'Category 1', plan: 'Plan 2' },
        { category: 'Category 1', plan: 'Plan 3' },
      ],
      ['Category 1'],
    ],
    [
      [
        { category: 'Category 1', plan: 'Plan 1' },
        { category: 'Category 2', plan: 'Plan 2' },
        { category: 'Category 3', plan: 'Plan 3' },
      ],
      ['Category 1', 'Category 2', 'Category 3'],
    ],
  ])('Getting categories from plans', (plans, expected) => {
    expect(getCategoriesFromPlans(plans)).toEqual(expected);
  });
});

describe('isStatutoryHoliday', () => {
  it('should return true for dates that are statutory holidays', () => {
    constants.STATUTORY_HOLIDAYS.forEach(holiday => {
      const date = moment(holiday);
      expect(isStatutoryHoliday(date)).toBe(true);
    });
  });

  it('should return false for dates that are not statutory holidays', () => {
    const randomDate = moment('2025-10-16'); // A random date that is not a statutory holiday

    expect(isStatutoryHoliday(randomDate)).toBe(false);
  });
});

describe('isDisabledDate', () => {
  it('should return true for weekends if disableWeekends is true', () => {
    const saturday = moment('2025-02-01'); // A Saturday
    const sunday = moment('2025-04-27'); // A Sunday

    expect(isDisabledDate(saturday, { disableWeekends: true })).toBe(true);
    expect(isDisabledDate(sunday, { disableWeekends: true })).toBe(true);
  });

  it('should return false for weekdays if disableWeekends is true', () => {
    const monday = moment('2025-07-21'); // A Monday

    expect(isDisabledDate(monday, { disableWeekends: true })).toBe(false);
  });

  it('should return true for statutory holidays if disableStatutoryHolidays is true', () => {
    const holiday = moment('2025-12-25'); // Assuming this is a statutory holiday
    jest.doMock('../../src/utils/helpers', () => ({
      isStatutoryHoliday: jest.fn(() => true),
    }));

    expect(isDisabledDate(holiday, { disableStatutoryHolidays: true })).toBe(true);
  });

  it('should return false for non-holidays if disableStatutoryHolidays is true', () => {
    const nonHoliday = moment('2025-10-16'); // Assuming this is not a statutory holiday
    jest.doMock('../../src/utils/helpers', () => ({
      isStatutoryHoliday: jest.fn(() => false),
    }));

    expect(isDisabledDate(nonHoliday, { disableStatutoryHolidays: true })).toBe(false);
  });

  it('should return true for weekends and holidays if both options are true', () => {
    const saturdayHoliday = moment('2025-07-26'); // Assuming this is a Saturday and a holiday
    jest.doMock('../../src/utils/helpers', () => ({
      isStatutoryHoliday: jest.fn(() => true),
    }));

    expect(isDisabledDate(saturdayHoliday, { disableWeekends: true, disableStatutoryHolidays: true })).toBe(true);
  });

  it('should return false if neither option is true', () => {
    const date = moment('2025-10-16'); // Any date
    jest.doMock('../../src/utils/helpers', () => ({
      isStatutoryHoliday: jest.fn(() => false),
    }));

    expect(isDisabledDate(date, {})).toBe(false);
  });

  it('should return true for dates beyond maxDaysInFuture', () => {
    const today = moment();
    const futureDate = today.clone().add(31, 'days'); // Assuming maxDaysInFuture is 30

    expect(isDisabledDate(futureDate, { maxDaysInFuture: 30 })).toBe(true);
  });

  it('should return false for dates within maxDaysInFuture', () => {
    const today = moment();
    const validDate = today.clone().add(15, 'days'); // Assuming maxDaysInFuture is 30

    expect(isDisabledDate(validDate, { maxDaysInFuture: 30 })).toBe(false);
  });

  it('should return false for today if maxDaysInFuture is 0', () => {
    const today = moment();

    expect(isDisabledDate(today, { maxDaysInFuture: 0 })).toBe(false);
  });

  it('should return true for tomorrow if maxDaysInFuture is 0', () => {
    const tomorrow = moment().add(1, 'day');

    expect(isDisabledDate(tomorrow, { maxDaysInFuture: 0 })).toBe(true);
  });

  it('should return false for dates exactly at maxDaysInFuture', () => {
    const today = moment();
    const boundaryDate = today.clone().add(30, 'days'); // Assuming maxDaysInFuture is 30

    expect(isDisabledDate(boundaryDate, { maxDaysInFuture: 30 })).toBe(false);
  });

  it('should return true for dates beyond maxDaysInFuture even if disableWeekends is false', () => {
    const today = moment();
    const futureDate = today.clone().add(31, 'days'); // Assuming maxDaysInFuture is 30

    expect(isDisabledDate(futureDate, { maxDaysInFuture: 30, disableWeekends: false })).toBe(true);
  });

  it('should return true for dates beyond maxDaysInFuture even if disableStatutoryHolidays is false', () => {
    const today = moment();
    const futureDate = today.clone().add(31, 'days'); // Assuming maxDaysInFuture is 30

    expect(isDisabledDate(futureDate, { maxDaysInFuture: 30, disableStatutoryHolidays: false })).toBe(true);
  });
});

describe('parsePriceFormattedString', () => {
  // --- Standard English format (dot decimal, comma thousands) ---
  test('should parse English style with dot and comma: "$1,234.56"', () => {
    expect(parsePriceFormattedString('$1,234.56')).toBe(1234.56);
  });
  test('should parse English style with only dot: "$26.08"', () => {
    expect(parsePriceFormattedString('$26.08')).toBe(26.08);
  });
  test('should parse English style negative: "-1,234.56"', () => {
    expect(parsePriceFormattedString('-1,234.56')).toBe(-1234.56);
  });
  test('should parse English style negative with currency: "-$2.61"', () => {
    expect(parsePriceFormattedString('-$2.61')).toBe(-2.61);
  });

  // --- French/European style (when dot and comma are present, comma is decimal) ---
  test('should parse French style with dot and comma: "1.234,56"', () => {
    expect(parsePriceFormattedString('1.234,56')).toBe(1234.56);
  });
  test('should parse French style negative with dot and comma: "-$1.234,56"', () => {
    expect(parsePriceFormattedString('-$1.234,56')).toBe(-1234.56);
  });

  // --- Cases with ONLY Commas (no dots) ---
  test('should parse with single comma as decimal (2-digit tail): "123,45"', () => {
    expect(parsePriceFormattedString('123,45')).toBe(123.45);
  });
  test('should parse with multiple commas, last as decimal (2-digit tail, as per TSDoc): "1,234,56"', () => {
    expect(parsePriceFormattedString('1,234,56')).toBe(1234.56);
  });
  test('should parse with negative, multiple commas, last as decimal (2-digit tail, as per TSDoc): "-$1,234,56"', () => {
    expect(parsePriceFormattedString('-$1,234,56')).toBe(-1234.56);
  });
  test('should parse with comma as thousands (3-digit tail): "123,456"', () => {
    expect(parsePriceFormattedString('123,456')).toBe(123456);
  });
  test('should parse with multiple commas as thousands (3-digit tail): "$1,234,567"', () => {
    expect(parsePriceFormattedString('$1,234,567')).toBe(1234567);
  });
  test('should parse French style from TSDoc with space and comma: "8 550,67 $"', () => {
    expect(parsePriceFormattedString('8 550,67 $')).toBe(8550.67);
  });

  // --- Integer cases (no separators) ---
  test('should parse integer string: "1000"', () => {
    expect(parsePriceFormattedString('1000')).toBe(1000);
  });
  test('should parse integer with currency: "$1000"', () => {
    expect(parsePriceFormattedString('$1000')).toBe(1000);
  });

  // --- Zero cases ---
  test('should parse "0"', () => {
    expect(parsePriceFormattedString('0')).toBe(0);
  });
  test('should parse "0.00"', () => {
    expect(parsePriceFormattedString('0.00')).toBe(0);
  });
  test('should parse "$0.00"', () => {
    expect(parsePriceFormattedString('$0.00')).toBe(0);
  });
  test('should parse French style zero "0,00"', () => {
    expect(parsePriceFormattedString('0,00')).toBe(0.00);
  });
  test('should parse "-0"', () => {
    expect(parsePriceFormattedString('-0')).toBe(-0); // Or just 0
  });

  // --- Handling of spaces and currency symbols
  // (covered by other tests implicitly but good to have one explicit) ---
  test('should handle leading/trailing spaces and currency symbol: "   €1.234,56   "', () => {
    expect(parsePriceFormattedString('   €1.234,56   ')).toBe(1234.56);
  });
});

describe('isCSPolicyMeEmailModifier', () => {
  test.each([
    ['cs-email-siliapproved@policyme.com', true],
    ['john.doe+cs-email-skip-aura-tlruw-siliapproved@policyme.com', true],
    ['user+cs-email-siliapproved@policyme.com', true],
    ['test.cs-email-siliapproved@policyme.com', true],
    ['cs-email-siliapproved@example.com', false],
    ['test@policyme.com', false],
    ['test@example.com', false],
  ])('returns %s for email "%s"', (email, expected) => {
    expect(isCSPolicyMeEmailModifier(email)).toBe(expected);
  });
});
