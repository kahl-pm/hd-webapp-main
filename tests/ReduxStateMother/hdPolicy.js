import _ from 'lodash';
import { STATES_ENUM } from './const';

const states = {
  [STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]: {
    applicationDate: '02/12/2022',
    payment_initial_completed: '',
    payment_recurring_completed: '',
    policy_document_signature_completed: true,
    exclusions_flag: false,
    premium_class: 'Non-Tobacco User',
    annual_premiums_issued: 229.11,
    annual_premiums_applied: 229.11,
    monthly_premiums_issued: 20.62,
    monthly_premiums_applied: 20.62,
    original_monthly_premiums_issued: 20.62,
    original_annual_premiums_issued: 229.11,
    discounts: [],
    coverageAmount: 500000,
    term: 20,
    quote_breakdown: {
      annual: [
        {
          end_date: '02/12/2042',
          end_idx: 20,
          start_date: '02/12/2022',
          start_idx: 0,
          value: 229.11,
        },
      ],
      monthly: [
        {
          end_date: '02/12/2042',
          end_idx: 240,
          start_date: '02/12/2022',
          start_idx: 0,
          value: 20.62,
        },
      ],
    },
    add_ons_completed: true,
    beneficiaries_completed: true,
  },
};

export class HdPolicy {
  constructor(strategy) {
    const stateObj = states[strategy] ? states[strategy] : states[STATES_ENUM.DEFAULT];
    const initialStateDeepCopy = _.cloneDeep(stateObj);
    Object.assign(this, initialStateDeepCopy);
  }

  setHdolicyProp(propName, val) {
    this[propName] = val;
    return this;
  }
}
