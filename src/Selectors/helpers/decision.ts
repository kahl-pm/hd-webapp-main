import { hasValue } from '@policyme/global-libjs-utils';
import { AURA_DECISION_TYPES } from '../../utils/const';

const makeIsFlagRequired = (userType, product, fieldFlag) => (state) => {
  return state[userType][`${product}Decision`][fieldFlag] === 'Y';
};

const makeHasDecision = (userType, product) => (state) => {
  return hasValue(state[userType][`${product}Decision`].active_decision);
};

const makeIsApprovedDecision = (userType, product) => (state) => {
  const { active_decision } = state[userType][`${product}Decision`];
  return (active_decision === AURA_DECISION_TYPES.APPROVED);
};

const makeIsUnderWriterDecision = (userType, product) => (state) => {
  const { active_decision } = state[userType][`${product}Decision`];
  return (active_decision === AURA_DECISION_TYPES.REFER_TO_UNDERWRITER);
};

const makeIsPostponedDecision = (userType, product) => (state) => {
  // check if it is Postpone or postone x number of months
  const { active_decision } = state[userType][`${product}Decision`];
  return (active_decision === AURA_DECISION_TYPES.POSTPONED);
};

const makeIsDeclinedDecision = (userType, product) => (state) => {
  const { active_decision } = state[userType][`${product}Decision`];
  return (active_decision === AURA_DECISION_TYPES.DECLINED);
};

const makeGetAuraDecisionAnalyticsText = (userType, product) => (state) => {
  let auraDecision = null;
  if (makeIsApprovedDecision(userType, product)(state)) {
    auraDecision = 'Approved';
  } else if (makeIsUnderWriterDecision(userType, product)(state)) {
    auraDecision = 'Underwriter';
  } else if (makeIsPostponedDecision(userType, product)(state)) {
    auraDecision = 'Postponed';
  } else if (makeIsDeclinedDecision(userType, product)(state)) {
    auraDecision = 'Declined';
  }
  return auraDecision;
};

export {
  makeIsFlagRequired,
  makeHasDecision,
  makeIsApprovedDecision,
  makeIsUnderWriterDecision,
  makeIsPostponedDecision,
  makeIsDeclinedDecision,
  makeGetAuraDecisionAnalyticsText,
};
