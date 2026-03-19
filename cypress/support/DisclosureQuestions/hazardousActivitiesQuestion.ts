import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { HazardousActivities } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: HazardousActivities, inputSecondary: HazardousActivities) => {
  cy.SingleChoiceRadio(QUESTIONS.HAZARDOUS_ACTIVITIES, booleanOption(Boolean(inputPrimary)), USER_TYPES.PRIMARY);
  followupQuestions(inputPrimary);
  if (hasValue(inputSecondary)) {
    cy.SingleChoiceRadio(QUESTIONS.HAZARDOUS_ACTIVITIES, booleanOption(Boolean(inputSecondary)), USER_TYPES.SECONDARY);
    followupQuestions(inputSecondary);
  }
};

export const followupQuestions = (input) => {
  if (input) {
    throw new Error('Hazardous activities followup questions not yet implemented');
    // Question 122 TODO
    // Please select all that apply:

    // Question 123 TODO
    // Do you participate in private aviation as a passenger only?
    // (i.e. not as a pilot or member of the crew?)

    // Question 124 TODO
    // Please provide additional information about the types of aircraft, location(s),
    // frequency and duration of flights that you took as a private aviation passenger:
  }
};
