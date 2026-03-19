import { PaymentMethod as StripePaymentMethod } from '@stripe/stripe-js';
import { PMPaymentMethod, ProductType } from '../utils/const';

export const makeUpdatePaymentDetails = (user: string) => (
  property: string,
  value: string | StripePaymentMethod,
) => {
  return {
    type: `@@${user}/payment/update_card_prop`,
    property,
    value,
  };
};

export const updatePaymentCardAddress = (user: string) => (property: string, value: string) => {
  return {
    type: `@@${user}/payment/update_card_address`,
    property,
    value,
  };
};

export const clearPaymentAddress = (user: string) => ({
  type: `@@${user}/payment/clear_payment_address`,
});

export const updateStripeSubscriptionID = (user: string) => (
  product: ProductType, value: string,
) => {
  return {
    type: `@@${user}/payment/update_stripe_subscription_id`,
    product,
    value,
  };
};

export const updateStripePaymentComplete = (user: string) => (
  product: ProductType, value: boolean,
) => {
  return {
    type: `@@${user}/payment/update_stripe_payment_complete`,
    product,
    value,
  };
};

export const updatePaymentMethod = (user: string) => (value: PMPaymentMethod) => {
  return {
    type: `@@${user}/payment/update_payment_method`,
    value,
  };
};
