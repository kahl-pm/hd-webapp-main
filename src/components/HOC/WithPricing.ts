/* eslint-disable max-len */
import React from 'react';
import { connect, useSelector } from 'react-redux';
import moment from 'moment';
import { createIntl, createIntlCache } from 'react-intl';
import { LOCALE } from '@policyme/global-libjs-utils';
import { hasValue } from '../../utils/helpers';
import { getProductTotalAmt, getProductSessionTerm, getProductDiscountCodes } from '../../Selectors/helpers/productSession';
import { getLastMonthlyUserTypePremFromBreakdown, getFirstMonthlyUserTypePremFromBreakdown,
  getFirstSignificantPaymentDate, getPolicyDiscountedRateFromBreakdown,
  getFirstSignificantPaymentValue, getPolicyFinalRateFromBreakdown, getNonDiscountedMonthlyUserTypePrem, getUserQuotes, getRecmdQuotes, getUserTypeQuotes } from '../../Selectors/quotes';
import { PLAN_TYPES, USER_TYPES, PM_PRODUCT_PREFIX, HELCIM_MIN_CHARGE, TODAY_PAYMENT_TEXT, UserType } from '../../utils/const';
import { isAppProductAdded, getMainProduct, ProductPrefix } from '../../Selectors/helpers/productApp';
import { isJoint, showPartnerDiscountUI, isPolicymeEmployee } from '../../Selectors/userControl';
import { fixedToTwoDecimalPlaces } from '../../utils/abbreviateNumbers';
import { formatCurrencyConfig, formatCurrencyWithoutDecimalsConfig } from '../../utils/reactIntlHelpers';
import { DISCOUNT_CODES, DISCOUNTS_VALUE } from '../../utils/discounts';
import { getPreDecisionProductEligibleCoverage } from '../../Selectors/eligibility';
import { getHealthDentalDependentsPricingFields, getHealthDentalOverallPricingFields, getHealthDentalOverallSavingsFields, getHealthDentalUserPricingFields, HealthDentalPricingFields, OverallHDPricingFields } from '../../Selectors/hdPricing';
import { State } from '../../store/types/State';

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

// No-op stubs for removed Life/CI pricing functions
export const lowestValidQuote = (_state: State) => '';
export const getSelectedPrice = (_state: State, _userType = USER_TYPES.PRIMARY) => '';
export const getSelectedInsurer = (_state: State, _userType = USER_TYPES.PRIMARY) => '';

type ProductPricingFields = {
  maxCoverageRounded: number;
  maxCoverageRoundedCurrency: string;
  preDecisionMaxEligibleCoverage: number;
  preDecisionMaxEligibleCoverageCurrency: string;
  coverageAmt: number;
  coverageAmtCurrency: string;
  term: number;
  recmd_cov_amt: number;
  recmd_cov_amt_currency: string;
  perMonthRecmdMin: string;
  perMonthMin: string;
  preDecisionFirstPayment: Number | string;
  preDecisionFirstPaymentCurrency: string;
  preDecisionLastPayment: Number | string;
  preDecisionLastPaymentCurrency: string;
  preDecisionNonDiscountedPriceCurrency: string;
  approvedFirstMonthlyPayment: string;
  approvedFirstMonthlyPaymentCurrency: string;
  approvedFirstYearlyPayment: string;
  approvedFirstYearlyPaymentCurrency: string;
  approvedFirstPayment: string;
  approvedFirstPaymentCurrency: string;
  approvedInitialPayment: string;
  approvedLastMonthlyPayment: string;
  approvedLastMonthlyPaymentCurrency: string;
  approvedLastYearlyPayment: string;
  approvedLastYearlyPaymentCurrency: string;
  approvedLastPayment: string;
  approvedLastPaymentCurrency: string;
  selectedMonthlyPremiums: string;
  selectedMonthlyPremiumsCurrency: string;
  selectedYearlyPremiums: string;
  approvedNonDiscountedPrice: string;
  approvedNonDiscountedPriceCurrency: string;
  approvedDiscountedPrice: string;
  approvedNonDiscountedMonthlyPrice: string;
  approvedNonDiscountedYearlyPrice: string;
};

// Return empty/default pricing fields for Life/CI (no longer computed)
const emptyProductPricingFields: ProductPricingFields = {
  maxCoverageRounded: 0,
  maxCoverageRoundedCurrency: '',
  preDecisionMaxEligibleCoverage: 0,
  preDecisionMaxEligibleCoverageCurrency: '',
  coverageAmt: 0,
  coverageAmtCurrency: '',
  term: 0,
  recmd_cov_amt: 0,
  recmd_cov_amt_currency: '',
  perMonthRecmdMin: '',
  perMonthMin: '',
  preDecisionFirstPayment: '',
  preDecisionFirstPaymentCurrency: '',
  preDecisionLastPayment: '',
  preDecisionLastPaymentCurrency: '',
  preDecisionNonDiscountedPriceCurrency: '',
  approvedFirstMonthlyPayment: '',
  approvedFirstMonthlyPaymentCurrency: '',
  approvedFirstYearlyPayment: '',
  approvedFirstYearlyPaymentCurrency: '',
  approvedFirstPayment: '',
  approvedFirstPaymentCurrency: '',
  approvedInitialPayment: '',
  approvedLastMonthlyPayment: '',
  approvedLastMonthlyPaymentCurrency: '',
  approvedLastYearlyPayment: '',
  approvedLastYearlyPaymentCurrency: '',
  approvedLastPayment: '',
  approvedLastPaymentCurrency: '',
  selectedMonthlyPremiums: '',
  selectedMonthlyPremiumsCurrency: '',
  selectedYearlyPremiums: '',
  approvedNonDiscountedPrice: '',
  approvedNonDiscountedPriceCurrency: '',
  approvedDiscountedPrice: '',
  approvedNonDiscountedMonthlyPrice: '',
  approvedNonDiscountedYearlyPrice: '',
};

// Kept as a stub — previously computed Life/CI product pricing
export const getProductPricingFields = (_state: State, _userType: UserType, _product: ProductPrefix): ProductPricingFields => {
  return emptyProductPricingFields;
};

type TotalPricingFields = {
  todayPaymentText: string;
  totalInitialPayment: Number | string;
  totalLastPayment: Number | string;
  totalFirstPaymentMonthlyAmount: Number | string;
  totalFirstPaymentYearlyAmount: Number | string;
  totalFirstPayment: Number | string;
  totalFirstPaymentCurrency: string;
  totalLastPaymentDisplay: string;
};

const emptyTotalPricingFields: TotalPricingFields = {
  todayPaymentText: '',
  totalInitialPayment: '',
  totalLastPayment: '',
  totalFirstPaymentMonthlyAmount: '',
  totalFirstPaymentYearlyAmount: '',
  totalFirstPayment: '',
  totalFirstPaymentCurrency: '',
  totalLastPaymentDisplay: '',
};

type SavingsFields = {
  discountBreakdown: {
    joint: number;
    family: number;
    caaMember: number;
    caaHd: number;
    employee: number;
    septemberTL: number;
  };
  discountSavings: Number | string;
  discountSavingsCurrency: string;
};

const getSavingsFields = (state: State, userType: UserType, product: ProductPrefix): SavingsFields => {
  const intl = state[userType].household.application_language === LOCALE.FR_CA ? frIntl : enIntl;
  const _productPricesHD = getHealthDentalOverallPricingFields(state, { enIntl, frIntl });

  const discountCodes = getProductDiscountCodes(state, userType, product);

  const isCAAFamilyDiscount = discountCodes.includes(DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT);
  const isCaaMemberDiscountHd = discountCodes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT);

  const discountFamily = product === PM_PRODUCT_PREFIX.HD && isCAAFamilyDiscount
    ? (DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT] / 100) * Number(_productPricesHD.approvedNonDiscountedPrice)
    : 0;
  const discountCaaHd = product === PM_PRODUCT_PREFIX.HD && isCaaMemberDiscountHd
    ? (DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_DISCOUNT] / 100) * Number(_productPricesHD.approvedNonDiscountedPrice)
    : 0;

  return {
    discountBreakdown: {
      joint: 0,
      family: discountFamily,
      caaMember: 0,
      caaHd: discountCaaHd,
      employee: 0,
      septemberTL: 0,
    },
    discountSavings: fixedToTwoDecimalPlaces(0),
    discountSavingsCurrency: intl.formatNumber(0, formatCurrencyConfig),
  };
};

type PaymentDatesFields = {
  firstPaymentDate: string;
};

// HD doesn't use Life/CI payment date logic
const getPaymentDatesFields = (_state: State, _userType: UserType): PaymentDatesFields => {
  return { firstPaymentDate: '' };
};

type LifeAndCiOverallPricingFields = {
  totalFirstPaymentCurrency: string;
  totalLastPaymentDisplay: string;
};

// No-op stub for removed Life/CI overall pricing
export const getLifeAndCiOverallPricingFields = (_state: State): LifeAndCiOverallPricingFields => {
  return { totalFirstPaymentCurrency: '', totalLastPaymentDisplay: '' };
};

type WithPricingFields = {
  pricing: {
    [USER_TYPES.PRIMARY]: {
      [PM_PRODUCT_PREFIX.LIFE]: ProductPricingFields;
      [PM_PRODUCT_PREFIX.CI]: ProductPricingFields;
      [PM_PRODUCT_PREFIX.HD]: any;
      allProducts: TotalPricingFields;
    },
    [USER_TYPES.SECONDARY]: {
      [PM_PRODUCT_PREFIX.LIFE]: ProductPricingFields;
      [PM_PRODUCT_PREFIX.CI]: ProductPricingFields;
      [PM_PRODUCT_PREFIX.HD]: any;
      allProducts: TotalPricingFields;
    },
    dependents: Record<string, HealthDentalPricingFields>
    overall: {
      [PM_PRODUCT_PREFIX.HD]: OverallHDPricingFields;
      allProducts: LifeAndCiOverallPricingFields;
    },
  },
  savings: {
    [key in Exclude<UserType, 'dependent'>]: {
      [PM_PRODUCT_PREFIX.LIFE]: SavingsFields;
      [PM_PRODUCT_PREFIX.CI]: SavingsFields;
      [PM_PRODUCT_PREFIX.HD]: SavingsFields;
    }
  },
  paymentDates: {
    [key in Exclude<UserType, 'dependent'>]: {
      firstPaymentDate: string;
    }
  }
};

const emptySavingsFields: SavingsFields = {
  discountBreakdown: { joint: 0, family: 0, caaMember: 0, caaHd: 0, employee: 0, septemberTL: 0 },
  discountSavings: 0,
  discountSavingsCurrency: '',
};

// Exporting this for testing purposes
export const getWithPricingFields = (state: State): WithPricingFields => {
  return {
    pricing: {
      [USER_TYPES.PRIMARY]: {
        [PM_PRODUCT_PREFIX.LIFE]: emptyProductPricingFields,
        [PM_PRODUCT_PREFIX.CI]: emptyProductPricingFields,
        [PM_PRODUCT_PREFIX.HD]:
          getHealthDentalUserPricingFields(state, USER_TYPES.PRIMARY, { lang: state.primary.household.application_language, enIntl, frIntl }),
        allProducts: emptyTotalPricingFields,
      },
      [USER_TYPES.SECONDARY]: {
        [PM_PRODUCT_PREFIX.LIFE]: emptyProductPricingFields,
        [PM_PRODUCT_PREFIX.CI]: emptyProductPricingFields,
        [PM_PRODUCT_PREFIX.HD]:
          getHealthDentalUserPricingFields(state, USER_TYPES.SECONDARY, { lang: state.primary.household.application_language, enIntl, frIntl }),
        allProducts: emptyTotalPricingFields,
      },
      dependents: getHealthDentalDependentsPricingFields(state, { enIntl, frIntl }),
      overall: {
        [PM_PRODUCT_PREFIX.HD]: getHealthDentalOverallPricingFields(state, { enIntl, frIntl }),
        allProducts: getLifeAndCiOverallPricingFields(state),
      },
    },
    savings: {
      [USER_TYPES.PRIMARY]: {
        [PM_PRODUCT_PREFIX.LIFE]: emptySavingsFields,
        [PM_PRODUCT_PREFIX.CI]: emptySavingsFields,
        [PM_PRODUCT_PREFIX.HD]:
          {
            ...getSavingsFields(state, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD),
            ...getHealthDentalOverallSavingsFields(state, { enIntl, frIntl }),
          },
      },
      [USER_TYPES.SECONDARY]: {
        [PM_PRODUCT_PREFIX.LIFE]: emptySavingsFields,
        [PM_PRODUCT_PREFIX.CI]: emptySavingsFields,
        [PM_PRODUCT_PREFIX.HD]:
          {
            ...getSavingsFields(state, USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD),
            ...getHealthDentalOverallSavingsFields(state, { enIntl, frIntl }),
          },
      },
    },
    paymentDates: {
      [USER_TYPES.PRIMARY]: getPaymentDatesFields(state, USER_TYPES.PRIMARY),
      [USER_TYPES.SECONDARY]: getPaymentDatesFields(state, USER_TYPES.SECONDARY),
    },
  };
};

export const usePricing = () => useSelector(getWithPricingFields);

const mapStateToProps = (state, props) => {
  return getWithPricingFields(state);
};

export default (component) => connect(mapStateToProps)(component);
