import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { ImpairedDriving } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:ImpairedDriving, inputSecondary:ImpairedDriving) => {
  cy.SingleChoiceRadio(QUESTIONS.IMPAIRED_DRIVING, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.IMPAIRED_DRIVING, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Impaired driving followup questions not yet implemented');
    // TODO: Add impaired driving followup questions
  }
};
