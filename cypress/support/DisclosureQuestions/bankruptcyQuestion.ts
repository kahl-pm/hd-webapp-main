import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { Bankruptcy } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: Bankruptcy, inputSecondary: Bankruptcy) => {
  cy.SingleChoiceRadio(QUESTIONS.ARE_YOU_GOING_THROUGH_BANKRUPTCY, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.ARE_YOU_GOING_THROUGH_BANKRUPTCY, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input: Bankruptcy) => {
  if (input) {
    // TODO: Followup questions
    // throw new Error('Bankruptcy followup questions not yet implemented');
    // Question 233 TODO
    // Which of the following describes the status of your bankruptcy?

    // Question 234 TODO
    // What was the date of discharge?

    // Question 235 TODO
    // Please provide the circumstances of your bankruptcy including dates,
    // particulars of legal proceedings and any other relevant details.
  }
};
