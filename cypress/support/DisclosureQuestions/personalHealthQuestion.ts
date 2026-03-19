import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import type { PersonalHealth } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: PersonalHealth, inputSecondary: PersonalHealth) => {
  const hasConditionsPrimary = typeof inputPrimary === 'object';
  const conditionsPrimary = hasConditionsPrimary ? inputPrimary.conditions : [inputPrimary];
  cy.MultiChoice(QUESTIONS.MEDICAL_CONDITIONS, conditionsPrimary, USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary, hasConditionsPrimary);
  if (hasValue(inputSecondary)) {
    const hasConditionsSecondary = typeof inputSecondary === 'object';
    const conditionsSecondary = hasConditionsSecondary ? inputSecondary.conditions : [inputSecondary];
    cy.MultiChoice(QUESTIONS.MEDICAL_CONDITIONS, conditionsSecondary, USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary, hasConditionsSecondary);
  }
};

export const followupQuestions = (input, hasConditions) => {
  if (hasConditions) {
    // TODO: Followup questions
    throw new Error('Family Health followup questions not yet implemented');
  }
};
