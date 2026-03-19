import { createIntl, createIntlCache } from 'react-intl';
import { LOCALE } from '@policyme/global-libjs-utils';
import { getHealthDentalDependentsPricingFields, getHealthDentalOverallPricingFields, getHealthDentalUserPricingFields } from '../../src/Selectors/hdPricing';
import { USER_TYPES } from '../../src/utils/const';

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/api/#createintl
const cache = createIntlCache();
// https://github.com/formatjs/formatjs/issues/1441
const enIntl = createIntl({
  locale: LOCALE.EN_CA,
  messages: {},
}, cache);

const frIntl = createIntl({
  locale: LOCALE.FR_CA,
  messages: {},
}, cache);

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
    hd_quotes: [],
  },
};

describe('hdPricing', () => {
  describe('getHealthDentalOverallPricingFields', () => {
    it('should return default pricing fields if no overall quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
      };
      expect(getHealthDentalOverallPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        todayPaymentText: '',
        totalFirstPayment: 0,
        totalFirstPaymentCurrency: '$0.00',
        totalFirstPaymentMonthlyAmount: 0,
        totalFirstPaymentYearlyAmount: 0,
        totalInitialPayment: 0,
        totalLastPayment: 0,
        totalLastPaymentDisplay: '$0.00',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 0,
      });
    });

    it('should return pricing fields if overall quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
        userControl: {
          ...EMPTY_STATE.userControl,
          hd_quotes: [
            {
              plan_type: 'essential',
              mn_prems: 200,
              selected: true,
            },
          ],
        },
      };
      expect(getHealthDentalOverallPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        todayPaymentText: '',
        totalFirstPayment: 200,
        totalFirstPaymentCurrency: '$200.00',
        totalFirstPaymentMonthlyAmount: 200,
        totalFirstPaymentYearlyAmount: 2400,
        totalInitialPayment: 200,
        totalLastPayment: 200,
        totalLastPaymentDisplay: '$200.00',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 200,
      });
    });

    it('should return pricinf fields if overall quote is selected with hospital add on', () => {
      const state = {
        ...EMPTY_STATE,
        userControl: {
          ...EMPTY_STATE.userControl,
          hd_quotes: [
            {
              plan_type: 'essential',
              mn_prems: 200,
              selected: true,
            },
          ],
        },
      };
      expect(getHealthDentalOverallPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        todayPaymentText: '',
        totalFirstPayment: 200,
        totalFirstPaymentCurrency: '$200.00',
        totalFirstPaymentMonthlyAmount: 200,
        totalFirstPaymentYearlyAmount: 2400,
        totalInitialPayment: 200,
        totalLastPayment: 200,
        totalLastPaymentDisplay: '$200.00',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 200,
      });
    });
  });

  describe('getHealthDentalDependentsPricingFields', () => {
    it('should return default pricing fields if there are no dependents', () => {
      const state = {
        ...EMPTY_STATE,
      };
      expect(getHealthDentalDependentsPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({});
    });

    it('should return default pricing fields if no dependent quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
        dependents: {
          ...EMPTY_STATE.dependents,
          dependent_keys: ['1'],
          dependents: {
            1: {
              quotes: {
                hd: {
                  userQuotes: {
                    individual: [{
                      plan_type: 'essential',
                      mn_prems: 200,
                      selected: false,
                    }],
                  },
                },
              },
            },
          },
        },
      };
      expect(getHealthDentalDependentsPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        1: {
          hd: {
            approvedFirstPayment: 0,
            approvedFirstPaymentCurrency: '$0.00',
            perMonthRecmdMin: '',
            perMonthMin: '',
            preDecisionFirstPayment: 0,
            preDecisionFirstPaymentCurrency: '$0.00',
            preDecisionLastPayment: 0,
            preDecisionLastPaymentCurrency: '$0.00',
            preDecisionNonDiscountedPriceCurrency: '',
            approvedFirstMonthlyPayment: 0,
            approvedFirstMonthlyPaymentCurrency: '$0.00',
            approvedFirstYearlyPayment: 0,
            approvedFirstYearlyPaymentCurrency: '$0.00',
            approvedInitialPayment: '',
            approvedLastMonthlyPayment: 0,
            approvedLastMonthlyPaymentCurrency: '$0.00',
            approvedLastYearlyPayment: 0,
            approvedLastYearlyPaymentCurrency: '$0.00',
            approvedLastPayment: 0,
            approvedLastPaymentCurrency: '$0.00',
            selectedMonthlyPremiumsCurrency: '$0.00',
            approvedNonDiscountedPrice: 0,
            approvedNonDiscountedPriceCurrency: '$0.00',
            approvedDiscountedPrice: 0,
            approvedNonDiscountedMonthlyPrice: '',
            approvedNonDiscountedYearlyPrice: '',
          },
        },
      });
    });

    it('should return pricing fields if dependent quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
        dependents: {
          ...EMPTY_STATE.dependents,
          dependent_keys: ['1'],
          dependents: {
            1: {
              quotes: {
                hd: {
                  userQuotes: {
                    individual: [{
                      plan_type: 'essential',
                      mn_prems: 200,
                      selected: true,
                    }],
                  },
                },
              },
            },
          },
        },
      };
      expect(getHealthDentalDependentsPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        1: {
          hd: {
            approvedFirstPayment: 200,
            approvedFirstPaymentCurrency: '$200.00',
            perMonthRecmdMin: '',
            perMonthMin: '',
            preDecisionFirstPayment: 200,
            preDecisionFirstPaymentCurrency: '$200.00',
            preDecisionLastPayment: 200,
            preDecisionLastPaymentCurrency: '$200.00',
            preDecisionNonDiscountedPriceCurrency: '',
            approvedFirstMonthlyPayment: 200,
            approvedFirstMonthlyPaymentCurrency: '$200.00',
            approvedFirstYearlyPayment: 2400,
            approvedFirstYearlyPaymentCurrency: '$2,400.00',
            approvedInitialPayment: '',
            approvedLastMonthlyPayment: 200,
            approvedLastMonthlyPaymentCurrency: '$200.00',
            approvedLastYearlyPayment: 2400,
            approvedLastYearlyPaymentCurrency: '$2,400.00',
            approvedLastPayment: 200,
            approvedLastPaymentCurrency: '$200.00',
            selectedMonthlyPremiumsCurrency: '$200.00',
            approvedNonDiscountedPrice: 0,
            approvedNonDiscountedPriceCurrency: '$0.00',
            approvedDiscountedPrice: 200,
            approvedNonDiscountedMonthlyPrice: '',
            approvedNonDiscountedYearlyPrice: '',
          },
        },
      });
    });

    it('should return pricing fields if dependent quote is selected with hospital add on', () => {
      const state = {
        ...EMPTY_STATE,
        dependents: {
          ...EMPTY_STATE.dependents,
          dependent_keys: ['1'],
          dependents: {
            1: {
              quotes: {
                hd: {
                  userQuotes: {
                    individual: [{
                      plan_type: 'lite',
                      mn_prems: 200,
                      selected: true,
                    }],
                  },
                },
              },
            },
          },
        },
      };
      expect(getHealthDentalDependentsPricingFields(state, {
        enIntl,
        frIntl,
      })).toEqual({
        1: {
          hd: {
            approvedFirstPayment: 200,
            approvedFirstPaymentCurrency: '$200.00',
            perMonthRecmdMin: '',
            perMonthMin: '',
            preDecisionFirstPayment: 200,
            preDecisionFirstPaymentCurrency: '$200.00',
            preDecisionLastPayment: 200,
            preDecisionLastPaymentCurrency: '$200.00',
            preDecisionNonDiscountedPriceCurrency: '',
            approvedFirstMonthlyPayment: 200,
            approvedFirstMonthlyPaymentCurrency: '$200.00',
            approvedFirstYearlyPayment: 2400,
            approvedFirstYearlyPaymentCurrency: '$2,400.00',
            approvedInitialPayment: '',
            approvedLastMonthlyPayment: 200,
            approvedLastMonthlyPaymentCurrency: '$200.00',
            approvedLastYearlyPayment: 2400,
            approvedLastYearlyPaymentCurrency: '$2,400.00',
            approvedLastPayment: 200,
            approvedLastPaymentCurrency: '$200.00',
            selectedMonthlyPremiumsCurrency: '$200.00',
            approvedNonDiscountedPrice: 0,
            approvedNonDiscountedPriceCurrency: '$0.00',
            approvedDiscountedPrice: 200,
            approvedNonDiscountedMonthlyPrice: '',
            approvedNonDiscountedYearlyPrice: '',
          },
        },
      });
    });
  });

  describe('getHealthDentalUserPricingFields', () => {
    it('should return default pricing fields if no user quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
      };
      expect(getHealthDentalUserPricingFields(state, USER_TYPES.PRIMARY, {
        enIntl,
        frIntl,
      })).toEqual({
        approvedFirstMonthlyPayment: 0,
        approvedFirstMonthlyPaymentCurrency: '$0.00',
        approvedFirstPayment: 0,
        approvedFirstPaymentCurrency: '$0.00',
        approvedFirstYearlyPayment: 0,
        approvedFirstYearlyPaymentCurrency: '$0.00',
        approvedInitialPayment: '',
        approvedLastMonthlyPayment: 0,
        approvedLastMonthlyPaymentCurrency: '$0.00',
        approvedLastPayment: 0,
        approvedLastPaymentCurrency: '$0.00',
        selectedMonthlyPremiumsCurrency: '$0.00',
        approvedLastYearlyPayment: 0,
        approvedLastYearlyPaymentCurrency: '$0.00',
        approvedNonDiscountedMonthlyPrice: '',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 0,
        approvedNonDiscountedYearlyPrice: '',
        perMonthMin: '',
        perMonthRecmdMin: '',
        preDecisionFirstPayment: 0,
        preDecisionFirstPaymentCurrency: '$0.00',
        preDecisionLastPayment: 0,
        preDecisionLastPaymentCurrency: '$0.00',
        preDecisionNonDiscountedPriceCurrency: '',
      });
    });

    it('should return pricing fields if user quote is selected', () => {
      const state = {
        ...EMPTY_STATE,
        primary: {
          ...EMPTY_STATE.primary,
          quotes: {
            hd: {
              userQuotes: {
                individual: [{
                  plan_type: 'essential',
                  mn_prems: 200,
                  selected: true,
                }],
              },
            },
          },
        },
      };
      expect(getHealthDentalUserPricingFields(state, USER_TYPES.PRIMARY, {
        enIntl,
        frIntl,
      })).toEqual({
        approvedFirstMonthlyPayment: 200,
        approvedFirstMonthlyPaymentCurrency: '$200.00',
        approvedFirstPayment: 200,
        approvedFirstPaymentCurrency: '$200.00',
        approvedFirstYearlyPayment: 2400,
        approvedFirstYearlyPaymentCurrency: '$2,400.00',
        approvedInitialPayment: '',
        approvedLastMonthlyPayment: 200,
        approvedLastMonthlyPaymentCurrency: '$200.00',
        approvedLastPayment: 200,
        approvedLastPaymentCurrency: '$200.00',
        selectedMonthlyPremiumsCurrency: '$200.00',
        approvedLastYearlyPayment: 2400,
        approvedLastYearlyPaymentCurrency: '$2,400.00',
        approvedNonDiscountedMonthlyPrice: '',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 200,
        approvedNonDiscountedYearlyPrice: '',
        perMonthMin: '',
        perMonthRecmdMin: '',
        preDecisionFirstPayment: 200,
        preDecisionFirstPaymentCurrency: '$200.00',
        preDecisionLastPayment: 200,
        preDecisionLastPaymentCurrency: '$200.00',
        preDecisionNonDiscountedPriceCurrency: '',
      });
    });

    it('should return pricing fields if user quote is selected with hospital add on', () => {
      const state = {
        ...EMPTY_STATE,
        primary: {
          ...EMPTY_STATE.primary,
          quotes: {
            hd: {
              userQuotes: {
                individual: [{
                  plan_type: 'essential',
                  mn_prems: 200,
                  selected: true,
                }],
              },
            },
          },
        },
      };
      expect(getHealthDentalUserPricingFields(state, USER_TYPES.PRIMARY, {
        enIntl,
        frIntl,
      })).toEqual({
        approvedFirstMonthlyPayment: 200,
        approvedFirstMonthlyPaymentCurrency: '$200.00',
        approvedFirstPayment: 200,
        approvedFirstPaymentCurrency: '$200.00',
        approvedFirstYearlyPayment: 2400,
        approvedFirstYearlyPaymentCurrency: '$2,400.00',
        approvedInitialPayment: '',
        approvedLastMonthlyPayment: 200,
        approvedLastMonthlyPaymentCurrency: '$200.00',
        approvedLastPayment: 200,
        approvedLastPaymentCurrency: '$200.00',
        selectedMonthlyPremiumsCurrency: '$200.00',
        approvedLastYearlyPayment: 2400,
        approvedLastYearlyPaymentCurrency: '$2,400.00',
        approvedNonDiscountedMonthlyPrice: '',
        approvedNonDiscountedPrice: 0,
        approvedNonDiscountedPriceCurrency: '$0.00',
        approvedDiscountedPrice: 200,
        approvedNonDiscountedYearlyPrice: '',
        perMonthMin: '',
        perMonthRecmdMin: '',
        preDecisionFirstPayment: 200,
        preDecisionFirstPaymentCurrency: '$200.00',
        preDecisionLastPayment: 200,
        preDecisionLastPaymentCurrency: '$200.00',
        preDecisionNonDiscountedPriceCurrency: '',
      });
    });
  });
});
