import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.DEFAULT]: {
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
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
  [STATES_ENUM.DEFAULT_PAYMENT_COMPLETE]: {
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
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
    stripePaymentComplete: {
      life: true,
      ci: true,
      hd: false,
    }
  },
  [STATES_ENUM.JOURNEY_1_INDIV_APPROVED]: {
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    planType: 'monthly',
    errorMessage: '',
    pmHelcimAttempt: 0,
    useDefaultAddress: false,
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: {
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    planType: 'monthly',
    errorMessage: '',
    pmHelcimAttempt: 0,
    useDefaultAddress: false,
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
  [STATES_ENUM.JOURNEY_1_POLICYME_PARTNER]: {
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    planType: 'monthly',
    errorMessage: '',
    pmHelcimAttempt: 0,
    useDefaultAddress: false,
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
  [STATES_ENUM.JOURNEY_1_JOINT_POLICYME_PARTNER]: {
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    planType: 'monthly',
    errorMessage: '',
    pmHelcimAttempt: 0,
    useDefaultAddress: false,
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
  [STATES_ENUM.JOURNEY_3_INDIV_APPROVED]: {
    cardFirstName: '',
    cardLastName: '',
    cardNumber: '',
    cardExpiryMonth: '',
    cardExpiryYear: '',
    cardCVV: '',
    planType: 'monthly',
    errorMessage: '',
    pmHelcimAttempt: 0,
    useDefaultAddress: false,
    address: {
      address_line1: '',
      address_line2: '',
      city: '',
      province: '',
      country: '',
      postal_code: '',
    },
  },
};

export class Payment {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setPaymentProp(propName, val) {
    this[propName] = val;
    return this;
  }
}
