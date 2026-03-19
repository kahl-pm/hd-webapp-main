import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { AlcoholUse } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:AlcoholUse, inputSecondary:AlcoholUse) => {
  cy.SingleChoiceRadio(QUESTIONS.ALCOHOL_DRINKS_PER_DAY, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.ALCOHOL_DRINKS_PER_DAY, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Alcohol use followup questions not yet implemented');
    // TODO Add alcohol use followup questions
  }
};
