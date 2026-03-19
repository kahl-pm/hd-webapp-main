import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { CannabisUse } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: CannabisUse, inputSecondary: CannabisUse) => {
  cy.SingleChoiceRadio(QUESTIONS.CANNABIS_USE, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.CANNABIS_USE, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Cannabis use followup questions not yet implemented');
    // TODO Add cannabis use followup questions
  }
};
