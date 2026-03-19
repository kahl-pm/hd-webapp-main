import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import type { StatusInCanada } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: StatusInCanada, inputSecondary: StatusInCanada) => {
  const hasFollowupPrimary = typeof inputPrimary === 'object';
  const statusPrimary = hasFollowupPrimary ? inputPrimary.status : inputPrimary;
  cy.SingleChoiceRadio(QUESTIONS.STATUS_IN_CANADA, statusPrimary, USER_TYPES.PRIMARY);
  followupQuestions(hasFollowupPrimary);
  if (hasValue(inputSecondary)) {
    const hasFollowupSecondary = typeof inputSecondary === 'object';
    const statusSecondary = hasFollowupSecondary ? inputSecondary.status : inputSecondary;
    cy.SingleChoiceRadio(QUESTIONS.STATUS_IN_CANADA, statusSecondary, USER_TYPES.SECONDARY);
    followupQuestions(hasFollowupSecondary);
  }
};

export const followupQuestions = (hasFollowup) => {
  if (hasFollowup) {
    throw new Error('Status in Canada followup questions not yet implemented');
    // Question 65 TODO
    // When did you enter Canada?

    // Question 66 TODO
    // Are you living and working full-time in Canada?

    // Question 67 TODO
    // Do you have a valid work permit?

    // Question 68 TODO
    // What type of work permit do you have?

    // Question 69 TODO
    // When is your permit set to expire?

    // Question 70 TODO
    // Have you applied for a work permit extension?

    // Question 71 TODO
    // Please provide available details including the number of
    // work permit extensions you have received:

    // Question 72 TODO
    // Please provide available details including the reason
    // why you have not applied for an extension:

    // Question 73 TODO
    // Please provide available detail regarding your status in Canada:

    // Question 74 TODO
    // What exact date does your work permit expire?

    // Question 75 TODO
    // What are your plans after your work permit expires?

    // Question 76 TODO
    // When did you enter Canada?

    // Question 77 TODO
    // Are you living and working full-time in Canada?

    // Question 78 TODO
    // Do you have a valid work permit?

    // Question 79 TODO
    // What type of work permit do you have?

    // Question 80 TODO
    // Have you applied for a work permit extension?

    // Question 81 TODO
    // Please provide available details including the number of
    // work permit extensions you have received:

    // Question 82 TODO
    // Please provide available details including the
    // reason why you have not applied for an extension:

    // Question 83 TODO
    // Please provide additional details on why you are not living
    // and studying full-time in Canada while on a work permit:

    // Question 84 TODO
    // What exact date does your student visa expire?

    // Question 85 TODO
    // What are your plans after your visa expires?

    // Question 86 TODO
    // When did you enter Canada?

    // Question 87 TODO
    // Are you living and studying full-time in Canada?

    // Question 88 TODO
    // Please provide additional details on why you are not living
    // and studying full-time in Canada while on a student visa.

    // Question 89 TODO
    // Do you plan to remain in Canada once your studies are complete?

    // Question 90 TODO
    // When did you enter Canada?

    // Question 91 TODO
    // Are you living and working full-time in Canada?

    // Question 92 TODO
    // Do you have a valid work permit?

    // Question 93 TODO
    // What type of work permit do you have?

    // Question 94 TODO
    // When is your permit set to expire?

    // Question 95 TODO
    // Have you applied for a work permit extension?

    // Question 96 TODO
    // Please provide available details including the number of
    // work permit extensions you have received:

    // Question 97 TODO
    // Please provide available details including the reason
    // why you have not applied for an extension:

    // Question 98 TODO
    // Please provide available detail regarding your status in Canada:
  }
};
