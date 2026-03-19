import { cloneDeep } from 'lodash';
import {
  getSessionQuotesInputs,
  getSessionSelectedQuotes,
  isFullyUWProduct,
  isGIProduct,
  shouldHideEconomicPlan,
} from '../../src/Selectors/hdSession';
import { INSURANCE_OWNERSHIP_TYPES, PM_PRODUCT_PREFIX } from '../../src/utils/const';

jest.mock('@policyme/global-libjs-utils', () => { //had to mock this because it was causing an error with spyon
  const originalModule = jest.requireActual('@policyme/global-libjs-utils');

  return {
    __esModule: true, 
    ...originalModule,
    hasFlag: jest.fn(),
  };
});
import { hasFlag, } from '@policyme/global-libjs-utils';

const EMPTY_STATE = {
  primary: {
    session: {},
    household: {},
    quotes: {
      hd: {
        userQuotes: {
        },
      },
    },
  },
  secondary: {
    session: {},
    household: {},
    quotes: {
      hd: {
        userQuotes: {
        },
      },
    },
  },
  dependents: {
    dependent_keys: [],
    dependents: {},
  },
  userControl: {
    hasPartnerApplication: false,
  },
};

describe('hdSession', () => {
  describe('isGIProduct', () => {
    test('it should return true if the underwriting_method is guaranteed issue', () => {
      const state = {
        primary: {
          hdApp: {
            underwriting_method: 'guaranteed_issue',
          },
        },
      };
      const result = isGIProduct(state);
      expect(result).toBe(true);
    });

    test('it should return false if the underwriting_method is not guaranteed issue', () => {
      const state = {
        primary: {
          hdApp: {
            underwriting_method: 'fully_underwritten',
          },
        },
      };
      const result = isGIProduct(state);
      expect(result).toBe(false);
    });

    test('it should return false if the underwriting_method is not set', () => {
      const state = {
        primary: {
          hdApp: {},
        },
      };
      const result = isGIProduct(state);
      expect(result).toBe(false);
    });
  });

  describe('isFullyUnderwrittenProduct', () => {
    test('it should return true if the underwriting_method is fully_underwritten', () => {
      const state = {
        primary: {
          hdApp: {
            underwriting_method: 'fully_underwritten',
          },
        },
      };
      const result = isFullyUWProduct(state);
      expect(result).toBe(true);
    });
    test('it should return false if the underwriting_method is not set', () => {
      const state = {
        primary: {
          hdApp: {
          },
        },
      };
      const result = isFullyUWProduct(state);
      expect(result).toBe(false);
    });
  });

  describe('getSessionQuotesInputs', () => {
    test('it should not fail if state is empty', () => {
      const result = getSessionQuotesInputs(EMPTY_STATE);
      expect(result).toEqual([
        {
          birthday: undefined,
          birthmon: undefined,
          birthyr: undefined,
          province: undefined,
          quote_id: 'undefined-undefined-undefined',
          discount_codes: '',
          is_joint: false,
          has_dependents: false,
          family_role: 'primary',
          insurance_ownership_type: undefined,
          application_date: null,
        },
      ]);
    });

    test('it should not fail if state is empty in joint', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.userControl.hasPartnerApplication = true;
      const result = getSessionQuotesInputs(state);
      expect(result).toEqual([
        {
          birthday: undefined,
          birthmon: undefined,
          birthyr: undefined,
          province: undefined,
          quote_id: 'undefined-undefined-undefined',
          discount_codes: '',
          is_joint: true,
          has_dependents: false,
          family_role: 'primary',
          insurance_ownership_type: undefined,
          application_date: null,
        },
        {
          birthday: undefined,
          birthmon: undefined,
          birthyr: undefined,
          province: undefined,
          quote_id: 'undefined-undefined-undefined',
          discount_codes: '',
          is_joint: true,
          has_dependents: false,
          family_role: 'secondary',
          insurance_ownership_type: undefined,
          application_date: null,
        },
      ]);
    });

    test('it should return the correct data for a single user', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.household = {
        birthdate: '01/10/1990',
        province: 'ON',
        healthcard_province: 'ON',
      };
      state.primary[`${PM_PRODUCT_PREFIX.HD}App`] = {
        insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
      };
      const result = getSessionQuotesInputs(state);
      expect(result).toEqual([
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          province: 'ON',
          quote_id: '123',
          discount_codes: '',
          is_joint: false,
          has_dependents: false,
          family_role: 'primary',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
      ]);
    });

    test('it should return the correct data for a joint application', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.household = {
        birthdate: '01/10/1990',
        province: 'ON',
        healthcard_province: 'ON',
      };
      state.primary[`${PM_PRODUCT_PREFIX.HD}App`] = {
        insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
      };
      state.secondary.session = {
        household_id: '456',
      };
      state.secondary.household = {
        birthdate: '01/10/1990',
        province: 'ON',
        healthcard_province: 'ON',
      };
      state.userControl.hasPartnerApplication = true;
      const result = getSessionQuotesInputs(state);
      expect(result).toEqual([
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          province: 'ON',
          quote_id: '123',
          discount_codes: '',
          is_joint: true,
          has_dependents: false,
          family_role: 'primary',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          province: 'ON',
          quote_id: '456',
          discount_codes: '',
          is_joint: true,
          has_dependents: false,
          family_role: 'secondary',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
      ]);
    });

    test('it should return the correct data for a joint application with dependents', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.household = {
        birthdate: '01/10/1990',
        province: 'ON',
        healthcard_province: 'ON',
      };
      state.primary[`${PM_PRODUCT_PREFIX.HD}App`] = {
        insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
      };
      state.secondary.session = {
        household_id: '456',
      };
      state.secondary.household = {
        birthdate: '01/10/1990',
        province: 'ON',
        healthcard_province: 'ON',
      };
      state.userControl.hasPartnerApplication = true;
      state.dependents.dependent_keys = ['789'];
      state.dependents.dependents = {
        789: {
          session: {
            household_id: '789',
          },
          household: {
            birthdate: '01/10/1990',
            province: 'ON',
            healthcard_province: 'ON',
          },
        },
      };
      const result = getSessionQuotesInputs(state);
      expect(result).toEqual([
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          // hospital_addon: false,
          province: 'ON',
          quote_id: '123',
          discount_codes: '',
          is_joint: true,
          has_dependents: true,
          family_role: 'primary',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          province: 'ON',
          quote_id: '456',
          discount_codes: '',
          is_joint: true,
          has_dependents: true,
          family_role: 'secondary',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
        {
          birthday: 1,
          birthmon: 10,
          birthyr: 1990,
          province: 'ON',
          quote_id: '789',
          discount_codes: '',
          is_joint: true,
          has_dependents: true,
          family_role: 'dependent',
          insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
          application_date: null,
        },
      ]);
    });
  });

  describe('getSessionSelectedQuotes', () => {
    test('it should not fail if state is empty', () => {
      const result = getSessionSelectedQuotes(EMPTY_STATE);
      expect(result).toEqual([{
        hh_info_id: undefined,
      }]);
    });

    test('it should not fail if state is empty in joint', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.userControl.hasPartnerApplication = true;
      const result = getSessionSelectedQuotes(state);
      expect(result).toEqual([{
        hh_info_id: undefined,
      }, {
        hh_info_id: undefined,
      }]);
    });

    test('it should return the correct data for a single user', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.quotes.hd.userQuotes.individual = [{
        selected: true,
        plan_type: 'essential',
        mn_prems: 100,
      }];

      const result = getSessionSelectedQuotes(state);
      expect(result).toEqual([{
        hh_info_id: '123',
        plan_type: 'essential',
        mn_prems: 100,
      }]);
    });

    test('it should return the correct data for a joint application', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.quotes.hd.userQuotes.individual = [{
        selected: true,
        plan_type: 'essential',
        mn_prems: 100,
      }];
      state.secondary.session = {
        household_id: '456',
      };
      state.secondary.quotes.hd.userQuotes.individual = [{
        selected: true,
        plan_type: 'essential',
        mn_prems: 100,
      }];
      state.userControl.hasPartnerApplication = true;
      const result = getSessionSelectedQuotes(state);
      expect(result).toEqual([{
        hh_info_id: '123',
        plan_type: 'essential',
        mn_prems: 100,
      }, {
        hh_info_id: '456',
        plan_type: 'essential',
        mn_prems: 100,
      }]);
    });

    test('it should return the correct data for a joint application with dependents', () => {
      const state = cloneDeep(EMPTY_STATE);
      state.primary.session = {
        household_id: '123',
      };
      state.primary.quotes.hd.userQuotes.individual = [{
        selected: true,
        plan_type: 'essential',
        mn_prems: 100,
      }];
      state.secondary.session = {
        household_id: '456',
      };
      state.secondary.quotes.hd.userQuotes.individual = [{
        selected: true,
        plan_type: 'essential',
        mn_prems: 100,
      }];
      state.userControl.hasPartnerApplication = true;
      state.dependents.dependent_keys = ['789'];
      state.dependents.dependents = {
        789: {
          session: {
            household_id: '789',
          },
          quotes: {
            hd: {
              userQuotes: {
                individual: [{
                  selected: true,
                  plan_type: 'essential',
                  mn_prems: 100,
                }],
              },
            },
          },
        },
      };
      const result = getSessionSelectedQuotes(state);
      expect(result).toEqual([{
        hh_info_id: '123',
        plan_type: 'essential',
        mn_prems: 100,
      }, {
        hh_info_id: '456',
        plan_type: 'essential',
        mn_prems: 100,
      }, {
        hh_info_id: '789',
        plan_type: 'essential',
        mn_prems: 100,
      }]);
    });
  });

  describe('shouldHideEconomicPlan', () => {
  it.each(
    [
      [false, '01/10/1990', '', false],
      [true, '01/10/1990', '01/10/1990', false],
      [true, '01/10/1990', '', false],
      [true, '01/10/1990', '01/10/1990', false],
      [true, '01/10/1940', '', true],
      [true, '01/10/1990', '01/10/1940', true],
      [true, '01/10/1940', '01/10/1940', true],
    ],
  )('should return %s if the primary is born on %s and the secondary is born on %s and the hide economic value flag is %s', (flag, primary, secondary, expected) => {
    hasFlag.mockReturnValueOnce(flag);
    const state = {
      primary: {
        household: {
          birthdate: primary,
        },
      },
      secondary: {
        household: {
          birthdate: secondary,
        },
      },
    };
    const result = shouldHideEconomicPlan(state);
    expect(result).toBe(expected);
    expect(hasFlag).toHaveBeenCalledTimes(1);
    });
  });
});