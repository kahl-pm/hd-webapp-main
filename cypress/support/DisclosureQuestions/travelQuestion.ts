import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { TravelPlans } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: TravelPlans, inputSecondary: TravelPlans) => {
  cy.SingleChoiceRadio(QUESTIONS.TRAVEL_PLANS, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.TRAVEL_PLANS, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Travel plans followup questions not yet implemented');
    // Question 120 TODO
    // Which countries will you travel to?

    // TODO: other travel questions
  }
};
