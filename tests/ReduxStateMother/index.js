/* eslint-disable max-len */
import { Household } from './household';
import { Session } from './session';
import { Quotes } from './quotes';
import { Router } from './router';
import { Metadata } from './metadata';
import { JointMetadata } from './jointMetadata';
import { HdDecision } from './hdDecision';
import { HdPolicy } from './hdPolicy';
import { HdApp } from './hdApp';
import { HdSession } from './hdSession';
import { PartnerDisclosure } from './partnerDisclosure';
import { UserControl } from './userControl';
import { Dependents } from './dependents';

import { STATES_ENUM } from './const';
import { Payment } from './payment';
import { isJointStrategy } from '../util';

export default class ReduxStateMother {
  // Strategies
  // Look at util.js for possibilities
  constructor(strategy = STATES_ENUM.DEFAULT) {
    this.primary = {};
    this.secondary = {};

    this.primary.household = new Household(strategy);
    this.primary.session = new Session(strategy);
    this.primary.hdDecision = new HdDecision(strategy);
    this.primary.hdPolicy = new HdPolicy(strategy);
    this.primary.hdApp = new HdApp(strategy);
    this.primary.hdSession = new HdSession(strategy);
    this.primary.quotes = new Quotes(strategy);
    this.primary.payment = new Payment(strategy);

    this.secondary.household = new Household(isJointStrategy(strategy) ? strategy : null);
    this.secondary.session = new Session(isJointStrategy(strategy) ? strategy : null);
    this.secondary.hdDecision = new HdDecision(isJointStrategy(strategy) ? strategy : null);
    this.secondary.hdPolicy = new HdPolicy(isJointStrategy(strategy) ? strategy : null);
    this.secondary.hdApp = new HdApp(isJointStrategy(strategy) ? strategy : null);
    this.secondary.hdSession = new HdSession(isJointStrategy(strategy) ? strategy : null);
    this.secondary.quotes = new Quotes(isJointStrategy(strategy) ? strategy : null);
    this.secondary.payment = new Payment(isJointStrategy(strategy) ? strategy : null);

    this.partnerDisclosure = new PartnerDisclosure(strategy);
    this.metadata = new Metadata(strategy);
    this.jointMetadata = new JointMetadata(strategy);
    this.debug = {};
    this.router = new Router(strategy);
    this.userControl = new UserControl(strategy);
    this.dependents = new Dependents(strategy);

    return this;
  }

  toJson() {
    let primary = {};
    let secondary = {};
    Object.entries(this.primary).forEach(([key, value]) => {
      primary[key] = { ...value };
    });
    Object.entries(this.secondary).forEach(([key, value]) => {
      secondary[key] = { ...value };
    });
    return {
      primary: { ...primary },
      secondary: { ...secondary },
      partnerDisclosure: { ...this.partnerDisclosure },
      metadata: { ...this.metadata },
      jointMetadata: { ...this.jointMetadata },
      debug: { ...this.debug },
      userControl: { ...this.userControl },
      router: { ...this.router },
    };
  }
}
