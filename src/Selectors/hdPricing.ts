import { LOCALE } from '@policyme/global-libjs-utils';
import { fixedToTwoDecimalPlaces } from '../utils/abbreviateNumbers';
import { PM_PRODUCT_PREFIX, USER_TYPES, UserType } from '../utils/const';
import { DISCOUNT_CODES } from '../utils/discounts';
import { formatCurrencyConfig } from '../utils/reactIntlHelpers';
import { getDependent } from './dependents';
import { getDependentSelectedQuote, getOverallSelectedQuote, getUserSelectedQuote } from './hdSession';
import { getProductDiscountCodes } from './helpers/productSession';
import { State } from '../store/types/State';

export type HealthDentalPricingFields = {
  approvedFirstPayment: number;
  approvedFirstPaymentCurrency: string;
  perMonthRecmdMin: string;
  perMonthMin: string;
  preDecisionFirstPayment: number;
  preDecisionFirstPaymentCurrency: string;
  preDecisionLastPayment: number;
  preDecisionLastPaymentCurrency: string;
  preDecisionNonDiscountedPriceCurrency: string;
  approvedFirstMonthlyPayment: number;
  approvedFirstMonthlyPaymentCurrency: string;
  approvedFirstYearlyPayment: number;
  approvedFirstYearlyPaymentCurrency: string;
  approvedInitialPayment: string;
  approvedLastMonthlyPayment: number;
  approvedLastMonthlyPaymentCurrency: string;
  approvedLastYearlyPayment: number;
  approvedLastYearlyPaymentCurrency: string;
  approvedLastPayment: number;
  approvedLastPaymentCurrency: string;
  selectedMonthlyPremiumsCurrency: string;
  approvedNonDiscountedPrice: number;
  approvedNonDiscountedPriceCurrency: string;
  approvedDiscountedPrice: number;
  approvedNonDiscountedMonthlyPrice: string;
  approvedNonDiscountedYearlyPrice: string;
};

function getHealthDentalPricingFields(userQuote, {
  lang,
  enIntl,
  frIntl,
}: {
  lang: string;
  enIntl: any;
  frIntl: any;
}): HealthDentalPricingFields {
  const intl = lang === LOCALE.FR_CA ? frIntl : enIntl;
  const { mn_prems, original_mn_prems } = userQuote;

  const monthlyTotal = mn_prems ?? 0;

  const annualTotal = monthlyTotal * 12;

  const originalMonthlyTotal = original_mn_prems ?? 0;
  return {
    approvedFirstPayment: monthlyTotal,
    approvedFirstPaymentCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    perMonthRecmdMin: '',
    perMonthMin: '',
    preDecisionFirstPayment: monthlyTotal,
    preDecisionFirstPaymentCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    preDecisionLastPayment: monthlyTotal,
    preDecisionLastPaymentCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    preDecisionNonDiscountedPriceCurrency: '',
    approvedFirstMonthlyPayment: monthlyTotal,
    approvedFirstMonthlyPaymentCurrency:
      intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    approvedFirstYearlyPayment: annualTotal,
    approvedFirstYearlyPaymentCurrency:
      intl.formatNumber(annualTotal, formatCurrencyConfig),
    approvedInitialPayment: '',
    approvedLastMonthlyPayment: monthlyTotal,
    approvedLastMonthlyPaymentCurrency:
      intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    approvedLastYearlyPayment: annualTotal,
    approvedLastYearlyPaymentCurrency:
      intl.formatNumber(annualTotal, formatCurrencyConfig),
    approvedLastPayment: monthlyTotal,
    approvedLastPaymentCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    selectedMonthlyPremiumsCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    approvedNonDiscountedPrice: originalMonthlyTotal,
    approvedNonDiscountedPriceCurrency:
      intl.formatNumber(originalMonthlyTotal, formatCurrencyConfig),
    approvedDiscountedPrice: monthlyTotal,
    // Currently unused, but may use in the future to show non-discounted premiums
    approvedNonDiscountedMonthlyPrice: '',
    approvedNonDiscountedYearlyPrice: '',
  };
}

function getHealthDentalDependentPricingFields(state: State,
  dependentKey: string,
  { lang, enIntl, frIntl }: { lang: string; enIntl: any; frIntl: any }): HealthDentalPricingFields {
  const dependent = getDependent(state, dependentKey);

  return getHealthDentalPricingFields(
    getDependentSelectedQuote(dependentKey, state),
    { lang, enIntl, frIntl },
  );
}

export function getHealthDentalUserPricingFields(state: State,
  userType: UserType,
  { lang, enIntl, frIntl }: { lang: string; enIntl: any; frIntl: any }): HealthDentalPricingFields {
  return getHealthDentalPricingFields(
    getUserSelectedQuote(state, userType),
    { lang, enIntl, frIntl },
  );
}

export function getHealthDentalDependentsPricingFields(state: State,
  { enIntl, frIntl }: { enIntl: any; frIntl: any }): Record<string, HealthDentalPricingFields> {
  const { dependent_keys } = state.dependents;

  return dependent_keys.reduce((acc, dependentKey) => {
    acc[dependentKey] = {
      [PM_PRODUCT_PREFIX.HD]:
        getHealthDentalDependentPricingFields(state, dependentKey,
          { lang: state.primary.household.application_language, enIntl, frIntl }),
    };
    return acc;
  }, {});
}

export interface OverallHDPricingFields {
  todayPaymentText: string;
  totalInitialPayment: number;
  totalLastPayment: number;
  totalFirstPaymentMonthlyAmount: number;
  totalFirstPaymentYearlyAmount: number;
  totalFirstPayment: number;
  totalFirstPaymentCurrency: string;
  totalLastPaymentDisplay: string;
  approvedNonDiscountedPrice: number;
  approvedNonDiscountedPriceCurrency: string;
  approvedDiscountedPrice: number;
}

export function getHealthDentalOverallPricingFields(state: State,
  { enIntl, frIntl }: { enIntl: any; frIntl: any }): OverallHDPricingFields {
  const lang = state.primary.household?.application_language;
  const intl = lang === LOCALE.FR_CA ? frIntl : enIntl;
  const quotes = getOverallSelectedQuote(state);
  const { mn_prems, original_mn_prems } = quotes;

  let monthlyTotal = mn_prems ?? 0;

  const annualTotal = monthlyTotal * 12;

  const originalMonthlyTotal = original_mn_prems ?? 0;

  return {
    todayPaymentText: '',
    totalInitialPayment: monthlyTotal,
    totalLastPayment: monthlyTotal,
    totalFirstPaymentMonthlyAmount: monthlyTotal,
    totalFirstPaymentYearlyAmount: annualTotal,
    totalFirstPayment: monthlyTotal,
    totalFirstPaymentCurrency: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    totalLastPaymentDisplay: intl.formatNumber(monthlyTotal, formatCurrencyConfig),
    approvedNonDiscountedPrice: originalMonthlyTotal,
    approvedNonDiscountedPriceCurrency:
      intl.formatNumber(originalMonthlyTotal, formatCurrencyConfig),
    approvedDiscountedPrice: monthlyTotal,
  };
}

export interface OverallSavingsFields {
  discountSavings: number;
  discountSavingsCurrency: string;
}

export function getHealthDentalOverallSavingsFields(state: State,
  { enIntl, frIntl }: { enIntl: any; frIntl: any }): OverallSavingsFields {
  const intl = state.primary.household.application_language === LOCALE.FR_CA ? frIntl : enIntl;
  const _productPrices = getHealthDentalOverallPricingFields(state, { enIntl, frIntl });
  const discountCodes = getProductDiscountCodes(state, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD);

  const isPolicyMeEmployeeDiscount = discountCodes.includes(DISCOUNT_CODES.PM_EMPLOYEE_DISCOUNT);
  const isCAAMemberDiscount = discountCodes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT);
  const isCAAFamilyDiscount = discountCodes.includes(DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT);

  const discountSavings = isPolicyMeEmployeeDiscount || isCAAMemberDiscount || isCAAFamilyDiscount
    ? _productPrices.approvedNonDiscountedPrice - _productPrices.approvedDiscountedPrice
    : _productPrices.totalLastPayment - _productPrices.totalFirstPayment;

  return {
    discountSavings: fixedToTwoDecimalPlaces(discountSavings),
    discountSavingsCurrency: intl.formatNumber(discountSavings, formatCurrencyConfig),
  };
}
