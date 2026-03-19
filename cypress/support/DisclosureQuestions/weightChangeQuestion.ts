import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { WeightChange } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:WeightChange, inputSecondary:WeightChange) => {
  cy.SingleChoiceRadio(QUESTIONS.WEIGHT_CHANGED, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.WEIGHT_CHANGED, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Weight change followup questions not yet implemented');
    // Question 102 TODO
    // How has your weight changed?

    // Question 103 TODO
    // Approximately how much weight have you lost?

    // Question 104 TODO
    // What was the primary reason for your weight loss?

    // Question 233 TODO
    // Are you currently pregnant?

    // Question 234 TODO
    // What is your due date?

    // Question 236 TODO
    // Have you ever had any medical complications as a result of your pregnancy(ies)?
    // NOTE: Please do not include a caesarian or c-section as a complication.

    // Question 237 TODO
    // What was the medical condition / complication?

    // ...

    // Question 112 TODO
    // Approximately how much weight have you gained in the last 2 months?

    // ...
  }
};