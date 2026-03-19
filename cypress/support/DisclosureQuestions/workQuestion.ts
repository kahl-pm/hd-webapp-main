import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { WorkStatus } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: WorkStatus, inputSecondary: WorkStatus) => {
  cy.SingleChoiceRadio(QUESTIONS.ARE_YOU_CURRENTLY_WORKING, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary, USER_TYPES.PRIMARY);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.ARE_YOU_CURRENTLY_WORKING, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary, USER_TYPES.SECONDARY);
  }
};

export const followupQuestions = (input: WorkStatus, userType) => {
  // Question 11
  if (input) {
    const isRiskyWork = typeof input === 'object';
    const workType = isRiskyWork ? input.workType : input;
    cy.SingleChoiceRadio(QUESTIONS.DOES_YOUR_WORK_INVOLVE, workType, userType);

    if (workType !== 'None of the above') {
      // TODO: Add followup questions
      throw new Error('Work followup questions not yet implemented');
      // Questions 12 - 62 TODO
      // Occupation-specific questions
    }
  }
};
