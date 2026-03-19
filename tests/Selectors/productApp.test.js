import { PM_PRODUCT_PREFIX, PM_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';
import { getAppFamilyId, getHDAppPlanType, getProductFromCurrRoute } from '../../src/Selectors/helpers/productApp';

describe('productApp', () => {
  describe('getAppFamilyId', () => {
    test('should return primary HD family id if product is HD', () => {
      const state = {
        primary: {
          session: {
            hd_family_id: '123',
          },
        },
      };
      expect(getAppFamilyId(state, 'secondary', 'hd')).toBe('123');
    });

    test('should return null if product is HD and primary HD family id is not set', () => {
      const state = {
        primary: {
          session: {},
        },
      };
      expect(getAppFamilyId(state, 'primary', 'hd')).toBeNull();
    });
  });

  describe('getHDAppPlanType', () => {
    test('should return null when state is null', () => {
      const state = null;
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when userControl is null', () => {
      const state = {
        userControl: null,
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when hd_quotes is null', () => {
      const state = {
        userControl: {
          hd_quotes: null,
        },
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when state is empty', () => {
      const state = {};
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when userControl is empty', () => {
      const state = {
        userControl: {},
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when hd_quotes is empty', () => {
      const state = {
        userControl: {
          hd_quotes: {},
        },
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when no plan type is selected', () => {
      const state = {
        userControl: {
          hd_quotes: {
            dental_care: {
              mn_prems: 70,
              selected: false,
            },
            advanced: {
              mn_prems: 70,
              selected: false,
            },
            economic: {
              mn_prems: 70,
              selected: false,
            },
            classic: {
              mn_prems: 70,
              selected: false,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return null when plan type selected is invalid', () => {
      const state = {
        userControl: {
          hd_quotes: {
            invalid: {
              mn_prems: 70,
              selected: true,
            },
            advanced: {
              mn_prems: 70,
              selected: false,
            },
            economic: {
              mn_prems: 70,
              selected: false,
            },
            classic: {
              mn_prems: 70,
              selected: false,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBeNull();
    });

    test('should return "dental_care" as the selected plan type', () => {
      const state = {
        userControl: {
          hd_quotes: {
            dental_care: {
              mn_prems: 70,
              selected: true,
            },
            advanced: {
              mn_prems: 70,
              selected: false,
            },
            economic: {
              mn_prems: 70,
              selected: false,
            },
            classic: {
              mn_prems: 70,
              selected: false,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBe(PM_HD_PLAN_TYPES.DENTAL_CARE);
    });

    test('should return "economic" as the selected plan type', () => {
      const state = {
        userControl: {
          hd_quotes: {
            dental_care: {
              mn_prems: 70,
              selected: false,
            },
            advanced: {
              mn_prems: 70,
              selected: false,
            },
            economic: {
              mn_prems: 70,
              selected: true,
            },
            classic: {
              mn_prems: 70,
              selected: false,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBe(PM_HD_PLAN_TYPES.ECONOMIC);
    });

    test('should return "classic" as the selected plan type', () => {
      const state = {
        userControl: {
          hd_quotes: {
            dental_care: {
              mn_prems: 70,
              selected: false,
            },
            advanced: {
              mn_prems: 70,
              selected: false,
            },
            economic: {
              mn_prems: 70,
              selected: false,
            },
            classic: {
              mn_prems: 70,
              selected: true,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBe(PM_HD_PLAN_TYPES.CLASSIC);
    });

    test('should return "advanced" as the selected plan type', () => {
      const state = {
        userControl: {
          hd_quotes: {
            dental_care: {
              mn_prems: 70,
              selected: false,
            },
            advanced: {
              mn_prems: 70,
              selected: true,
            },
            economic: {
              mn_prems: 70,
              selected: false,
            },
            classic: {
              mn_prems: 70,
              selected: false,
            },
          },
        },
      };
      expect(getHDAppPlanType(state)).toBe(PM_HD_PLAN_TYPES.ADVANCED);
    });
  });
  describe('getProductFromCurrRoute', () => {
    it.each(
      [
        ['/hd/intent', PM_PRODUCT_PREFIX.HD],
        ['/hd/life-insurance-continued?external_advisor_id=123e4567-e89b-12d3-a456-426614174000&from_advisor=true', PM_PRODUCT_PREFIX.HD],
      ],
    )(('should return the right product type when current route is %s'), (route, expected) => {
      const state = {
        router: {
          location: {
            pathname: route,
          },
        },
      };
      expect(getProductFromCurrRoute(state)).toBe(expected);
    });
  });
});
