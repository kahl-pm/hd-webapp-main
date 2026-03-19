import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { DrivingViolation } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:DrivingViolation, inputSecondary:DrivingViolation) => {
  cy.SingleChoiceRadio(QUESTIONS.DRIVING_VIOLATION, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.DRIVING_VIOLATION, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Driving violation followup questions not yet implemented');
    // TODO Add driving violation followup questions
  }
};
