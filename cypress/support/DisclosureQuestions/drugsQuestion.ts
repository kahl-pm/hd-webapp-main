import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { DrugUse } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: DrugUse, inputSecondary: DrugUse) => {
  cy.SingleChoiceRadio(QUESTIONS.OTHER_NARCOTICS, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.OTHER_NARCOTICS, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Drug use followup questions not yet implemented');
    // TODO Add drug use followup questions
  }
};
