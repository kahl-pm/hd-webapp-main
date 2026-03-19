import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { FamilyHealth } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: FamilyHealth, inputSecondary: FamilyHealth) => {
  const hasConditionsPrimary = typeof inputPrimary === 'object';
  const conditionsPrimary = hasConditionsPrimary ? inputPrimary.conditions : [inputPrimary];
  cy.MultiChoice(QUESTIONS.FAMILY_MEDICAL_HISTORY, conditionsPrimary, USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary, hasConditionsPrimary);
  if (hasValue(inputSecondary)) {
    const hasConditionsSecondary = typeof inputSecondary === 'object';
    const conditionsSecondary = hasConditionsSecondary ? inputSecondary.conditions : [inputSecondary];
    cy.MultiChoice(QUESTIONS.FAMILY_MEDICAL_HISTORY, conditionsSecondary, USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary, hasConditionsSecondary);
  }
};

export const followupQuestions = (input, hasConditions) => {
  if (hasConditions) {
    // TODO: Followup questions
    throw new Error('Family Health followup questions not yet implemented');
  }
};
