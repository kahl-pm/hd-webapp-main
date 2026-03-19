import React from 'react';
import { AURA_DECISION_TYPES } from '../../utils/const';
import { DecisionCardState } from './const';

const getDecisionCardState = (
  activeDecision:typeof AURA_DECISION_TYPES[keyof typeof AURA_DECISION_TYPES],
  policyStatusInForce:boolean,
  auraUWDecisionErrorFlag:string,
):DecisionCardState => {
  if (activeDecision === AURA_DECISION_TYPES.APPROVED) {
    return policyStatusInForce ? 'IN_FORCE' : AURA_DECISION_TYPES.APPROVED;
  }
  if (auraUWDecisionErrorFlag === 'Y') {
    return AURA_DECISION_TYPES.REFER_TO_UNDERWRITER;
  }
  if (activeDecision === AURA_DECISION_TYPES.POSTPONED) {
    return AURA_DECISION_TYPES.DECLINED;
  }
  return activeDecision;
};

export {
  getDecisionCardState,
};
