import { PMPaymentMethod, PM_PRODUCT_PREFIX } from '../utils/const';

export interface StripePaymentAddress {
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  country: string;
  postal_code: string;
}

export interface StripeSubscriptionIDs {
}

export interface StripePaymentComplete {
  [PM_PRODUCT_PREFIX.HD]: boolean;
}

export interface StripePayment {
  cardFirstName: string;
  cardLastName: string;
  cardNumber: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCVV: string;
  planType: string;
  errorMessage: string;
  pmHelcimAttempt: number;
  useDefaultAddress: boolean;
  address: StripePaymentAddress;
  stripeCustomerID: string;
  setupIntentClientSecret: string;
  stripeSubscriptionID: StripeSubscriptionIDs;
  stripePaymentMethodID: string;
  stripePaymentComplete: StripePaymentComplete;
  paymentMethod: PMPaymentMethod;
}

const address_initialState: StripePaymentAddress = {
  address_line1: '',
  address_line2: '',
  city: '',
  province: '',
  country: '',
  postal_code: '',
};
const stripeSubscriptionIDs_initialState = {
};
const stripePaymentComplete_initialState = {
  [PM_PRODUCT_PREFIX.HD]: false,
};

const initialState = {
  cardFirstName: '',
  cardLastName: '',
  cardNumber: '',
  cardExpiryMonth: '',
  cardExpiryYear: '',
  cardCVV: '',
  planType: '',
  errorMessage: '',
  pmHelcimAttempt: 0,
  useDefaultAddress: false,
  address: address_initialState,
  stripeCustomerID: '',
  setupIntentClientSecret: '',
  stripeSubscriptionID: stripeSubscriptionIDs_initialState,
  stripePaymentMethodID: '',
  stripePaymentComplete: stripePaymentComplete_initialState,
  paymentMethod: 'credit_card',
};

const makePaymentGeneralReducer = (slice) => {
  return (state = initialState, action) => {
    switch (action.type) {
      case `@@${slice}/update_card_prop`:
        return {
          ...state,
          [action.property]: action.value,
        };
      case `@@${slice}/update_stripe_subscription_id`:
        return {
          ...state,
          stripeSubscriptionID: {
            ...state.stripeSubscriptionID,
            [action.product]: action.value,
          },
        };
      case `@@${slice}/update_card_address`:
        return {
          ...state,
          address: {
            ...state.address,
            [action.property]: action.value,
          },
        };
      case `@@${slice}/clear_payment_address`:
        return {
          ...state,
          address: address_initialState,
        };
      case `@@${slice}/update_stripe_payment_complete`:
        return {
          ...state,
          stripePaymentComplete: {
            ...state.stripePaymentComplete,
            [action.product]: action.value,
          },
        };
      case `@@${slice}/debug`:
        return {
          ...state,
          ...action.value,
        };
      case `@@${slice}/update_payment_method`:
        return {
          ...state,
          paymentMethod: action.value,
        };
      default:
        return state;
    }
  };
};

const SLICE_NAME = 'payment';

export default (user) => (state = initialState, action) => (
  makePaymentGeneralReducer(`${user}/${SLICE_NAME}`)(state, action));
