import { isJointStrategy } from '../../util';
import getPaymentDatesObj from './paymentDates';
import getPricingObj, { getAllProductsOverallObj } from './pricing';
import getSavingsObj from './savings';

export default (strategy) => {
  let res = {};
  res.pricing = {};
  res.savings = {};
  res.paymentDates = {};

  res.pricing.overall = {
    hd: {
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
    },
  };
  res.pricing.dependents = {};

  res.pricing.primary = getPricingObj(strategy);
  res.savings.primary = getSavingsObj(strategy);
  res.paymentDates.primary = getPaymentDatesObj(strategy);

  res.pricing.overall = {
    allProducts: getAllProductsOverallObj(strategy),
    hd: {
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
    },
  };

  res.pricing.dependents = {};

  res.pricing.secondary = getPricingObj(isJointStrategy(strategy) ? strategy : null);
  res.savings.secondary = getSavingsObj(isJointStrategy(strategy) ? strategy : null);
  res.paymentDates.secondary = getPaymentDatesObj(isJointStrategy(strategy) ? strategy : null);
  return res;
};
