import {
  BMOI_HD_PLAN_TYPES,
  CAA_HD_PLAN_TYPES,
  getTenant,
  PM_HD_PLAN_TYPES,
  test as testUtils,
  THEMES,
} from '@policyme/global-libjs-utils';
import { getProductName } from '../../src/Selectors/userControl';
import { PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, USER_TYPES } from '../../src/utils/const';

const getTenantFromTheme = testUtils.getTenantFromTheme;
jest.mock('@policyme/global-libjs-utils', () => {
  const actual = jest.requireActual('@policyme/global-libjs-utils');
  return {
    ...actual,
    getTenant: jest.fn(), // ← no return value yet
  };
});

describe('getProductName', () => {
  describe('H&D product names', () => {
    afterAll(() => {
      getTenant.mockRestore();
    });

    test.each([
      [CAA_HD_PLAN_TYPES.DENTAL_SECURE, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.CAA, 'CAA Health and Dental Insurance - Guaranteed Issue Dental Secure Plan'],
      [CAA_HD_PLAN_TYPES.DENTAL_SECURE, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.CAA, ''],
      [CAA_HD_PLAN_TYPES.ENHANCED, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.CAA, 'CAA Health and Dental Insurance - Guaranteed Issue Enhanced Plan'],
      [CAA_HD_PLAN_TYPES.STANDARD, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.CAA, 'CAA Next Health and Dental Insurance - Standard Plan'],
      [CAA_HD_PLAN_TYPES.ESSENTIAL, UNDERWRITING_METHODS.FULLY_UNDERWRITTEN, THEMES.CAA, 'CAA Health and Dental Insurance - Fully Underwritten Essential Plan'],
      [PM_HD_PLAN_TYPES.DENTAL_CARE, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.policyme_original, 'PolicyMe Health and Dental Insurance - Guaranteed Issue Dental Care Plan'],
      [PM_HD_PLAN_TYPES.DENTAL_CARE, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.policyme_original, ''],
      [PM_HD_PLAN_TYPES.ADVANCED, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.policyme_original, 'PolicyMe Health and Dental Insurance - Guaranteed Issue Advanced Plan'],
      [PM_HD_PLAN_TYPES.CLASSIC, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.policyme_original, 'PolicyMe Protect Health and Dental Insurance - Classic Plan'],
      [PM_HD_PLAN_TYPES.ECONOMIC, UNDERWRITING_METHODS.FULLY_UNDERWRITTEN, THEMES.policyme_original, 'PolicyMe Health and Dental Insurance - Fully Underwritten Economic Plan'],
      [BMOI_HD_PLAN_TYPES.BASIC, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.BMOI, 'BMO Insurance - Basic Health & Dental plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.BMOI, 'BMO Insurance - Standard Health & Dental plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD_NO_DENTAL, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.BMOI, 'BMO Insurance - Standard Health (No Dental) plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.BMOI, 'BMO Insurance - Standard Health & Dental (No Drug) plan​'],
      [BMOI_HD_PLAN_TYPES.ENHANCED, UNDERWRITING_METHODS.GUARANTEED_ISSUE, THEMES.BMOI, 'BMO Insurance - Enhanced Health & Dental plan​'],
      [BMOI_HD_PLAN_TYPES.BASIC, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.BMOI, 'BMO Insurance - Basic Health & Dental plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.BMOI, 'BMO Insurance - Standard Health & Dental plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD_NO_DENTAL, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.BMOI, 'BMO Insurance - Standard Health (No Dental) plan​'],
      [BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.BMOI, 'BMO Insurance - Standard Health & Dental (No Drug) plan​'],
      [BMOI_HD_PLAN_TYPES.ENHANCED, UNDERWRITING_METHODS.PORTABLE_COVERAGE, THEMES.BMOI, 'BMO Insurance - Enhanced Health & Dental plan​'],
    ])('Should return expected value for plan type of %s and underwriting method of %s and tenant of %s', (plan_type, underwriting_method, theme, expected) => {
      const tenant = getTenantFromTheme(theme);
      getTenant.mockReturnValue(tenant);

      const state = {
        primary: {
          hdApp: {
            underwriting_method,
          },
          quotes: {
            hd: {
              userQuotes: {
                individual: [{ selected: true, plan_type }],
              },
            },
          },
        },
        userControl: {
          currentUser: USER_TYPES.PRIMARY,
        },
      };

      expect(getProductName(state, PM_PRODUCT_PREFIX.HD)).toEqual(expected);
    });
  });
});
