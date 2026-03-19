import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { CriminalOffense } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: CriminalOffense, inputSecondary: CriminalOffense) => {
  cy.SingleChoiceRadio(QUESTIONS.CRIMINAL_OFFENCE, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.CRIMINAL_OFFENCE, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Criminal offense followup questions not yet implemented');
    // TODO Add criminal offense followup questions
  }
};
