import { Session } from './session';
import { Quotes } from './quotes';
import { UserControl } from './userControl';

import { PRICING_STATES_ENUM } from '../../util';
import { Payment } from './payment';

const _isJointStrategy = (strategy) => {
  const jointStrategies = Object.entries(PRICING_STATES_ENUM).filter(([k, v]) => k.includes('JOINT')).map(([k, v]) => v);
  return jointStrategies.includes(strategy);
};
export default class PricingReduxStateMother {
  // Strategies
  // Look at util.js for possibilities
  constructor(strategy = PRICING_STATES_ENUM.JOURNEY_1_INDIV) {
    this.primary = {};
    this.secondary = {};

    this.primary.session = new Session(strategy);
    this.primary.quotes = new Quotes(strategy);
    this.primary.payment = new Payment(strategy);

    this.secondary.session = new Session(_isJointStrategy(strategy) ? strategy : null);
    this.secondary.quotes = new Quotes(_isJointStrategy(strategy) ? strategy : null);
    this.secondary.payment = new Payment(_isJointStrategy(strategy) ? strategy : null);

    this.userControl = new UserControl(strategy);

    return this;
  }
}
