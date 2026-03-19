import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { AlcoholTreatment } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:AlcoholTreatment, inputSecondary:AlcoholTreatment) => {
  cy.SingleChoiceRadio(QUESTIONS.ALCOHOL_TREATMENT, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.ALCOHOL_TREATMENT, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Alcohol treatment followup questions not yet implemented');
    // TODO Add alcohol treatment followup questions
  }
};
