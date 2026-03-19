import {
  isPolicymePartner as isPolicymePartnerSelector,
  showPartnerDiscountUI as showPartnerDiscountUISelector,
  isPolicymeEmployee as isPolicymeEmployeeSelector,
} from '../userControl';
import { getWithPricingFields } from '../../components/HOC/WithPricing';

import { getMainProduct, isHDOptedIn } from './productApp';
import { getAllProductDiscountCodes, getProductDiscountCodes } from './productSession';
import { PLAN_TYPES, PM_PRODUCT_PREFIX, USER_TYPES } from '../../utils/const';
import { DISCOUNT_CODES } from '../../utils/discounts';

interface UserPaymentSummary {
  hdOptedIn: boolean;
  showPartnerDiscountUI: boolean;
  isPolicymePartner: boolean;
  caaMemberDiscountApplied: boolean;
  jointDiscountApplied: boolean;
  septemberTLDiscountApplied: boolean;
  familyDiscountApplied: boolean;
  hdDiscountCodes: string[];
  application_language: string;
  firstName: string;
  planType: string;
  hdCoverageCurrency: string;
  hdTerm: string;
  hdOverallPlanAmountCurrency: string;
  totalPrice: number;
  totalLastPayment: number;
  firstPaymentDate: string;
  savings: Record<typeof PLAN_TYPES[keyof typeof PLAN_TYPES], Record<string, string>>;
}

export const getUserPaymentSummary:
  (state:any, userType:typeof USER_TYPES[keyof typeof USER_TYPES]) => UserPaymentSummary =
(state, userType) => {
  const allProductsDiscountCodes = getAllProductDiscountCodes(state, userType);
  const showPartnerDiscountUI = showPartnerDiscountUISelector(
    state,
    userType,
    getMainProduct(state, userType),
  );
  const isPolicymePartner = isPolicymePartnerSelector(state);
  const caaMemberDiscountApplied =
    allProductsDiscountCodes.includes(DISCOUNT_CODES.CAA_DISCOUNT) ||
      allProductsDiscountCodes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT);
  const jointDiscountApplied =
    getAllProductDiscountCodes(state, userType).includes(DISCOUNT_CODES.JOINT_DISCOUNT_V2);
  const septemberTLDiscountApplied =
    getAllProductDiscountCodes(state, userType).includes(DISCOUNT_CODES.PM_SEPT2025_PROMO);
  const familyDiscountApplied =
    getAllProductDiscountCodes(state, userType).includes(DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT);

  const hdOptedIn = isHDOptedIn(state, userType);
  const hdDiscountCodes = getProductDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD);

  const application_language = state[userType].household.application_language;
  const firstName = state[userType].household.firstName;
  const isPolicymeEmployee = isPolicymeEmployeeSelector(state);

  const { pricing, savings, paymentDates } = getWithPricingFields(state);
  const userPricing = pricing[userType];

  const planType = state[userType].payment.planType || PLAN_TYPES.MONTHLY;
  const hdOverallPlanAmountCurrency = (isPolicymeEmployee || caaMemberDiscountApplied
    || familyDiscountApplied) ?
    pricing.overall.hd.approvedNonDiscountedPriceCurrency :
    pricing.overall.hd.totalFirstPaymentCurrency;

  const hdOverallPlanAmountCurrent = pricing.overall.hd.totalFirstPaymentMonthlyAmount;
  const hdOverallPlanAmount = Number((isPolicymeEmployee || caaMemberDiscountApplied
    || familyDiscountApplied) ?
    pricing.overall.hd.approvedNonDiscountedPrice :
    pricing.overall.hd.totalFirstPayment);

  const totalPrice = hdOptedIn ? hdOverallPlanAmountCurrent :
    userPricing.allProducts.totalFirstPayment;

  const totalLastPayment = pricing[userType].allProducts.totalLastPayment;
  const firstPaymentDate = paymentDates[userType].firstPaymentDate;

  const hdCoverageCurrency = userPricing.hd.coverageAmtCurrency;

  const hdTerm = userPricing.hd.term;
  return {
    hdOptedIn,
    showPartnerDiscountUI,
    isPolicymePartner,
    caaMemberDiscountApplied,
    jointDiscountApplied,
    septemberTLDiscountApplied,
    familyDiscountApplied,
    hdDiscountCodes,
    application_language,
    firstName,
    planType,
    hdCoverageCurrency,
    hdTerm,
    hdOverallPlanAmountCurrency,
    hdOverallPlanAmount,
    totalPrice,
    totalLastPayment,
    firstPaymentDate,
    savings: savings[userType],
  };
};
