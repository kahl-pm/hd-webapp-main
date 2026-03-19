import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { HealthConsultation } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: HealthConsultation, inputSecondary: HealthConsultation) => {
  cy.SingleChoiceRadio(QUESTIONS.HEALTHCARE_CONSULTATION, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.HEALTHCARE_CONSULTATION, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    // TODO: Followup questions
    throw new Error('Health Consultation followup questions not yet implemented');
  }
};
