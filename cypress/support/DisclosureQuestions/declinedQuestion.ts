import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import { booleanOption } from '../../helper';
import type { HaveBeenDeclined } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (primaryInput: HaveBeenDeclined, secondaryInput: HaveBeenDeclined) => {
  // Question 1
  cy.SingleChoiceRadio(
    QUESTIONS.INSURANCE_APPLICATION_HISTORY,
    booleanOption(Boolean(primaryInput)),
    USER_TYPES.PRIMARY,
  );
  followupQuestions(primaryInput);
  if (hasValue(secondaryInput)) {
    cy.SingleChoiceRadio(
      QUESTIONS.INSURANCE_APPLICATION_HISTORY,
      booleanOption(Boolean(secondaryInput)),
      USER_TYPES.SECONDARY,
    );
    followupQuestions(secondaryInput);
  }
};

export const followupQuestions = (input: HaveBeenDeclined) => {
  if (input) {
    // TODO: Add followup questions
    throw new Error('Declined followup questions not yet implemented');

    // Question 2 TODO
    // Which of the following best describes your previous life,
    // health or critical illness insurance application or policy?

    // Question 3 TODO
    // When was your application or policy postponed, declined or modified?

    // Question 4 TODO
    // What was the reason given by the insurance company for their decision?

    // Question 5 TODO
    // When was your application or policy rated?

    // Question 6 TODO
    // What was the reason given by the insurance company for their decision?

    // Question 7 TODO
    // Did you withdraw the application either because you received insurance from another company,
    // were not interested anymore or premiums did not fit your budget?

    // Question 8 TODO
    // Please provide the reason why you withdrew your application:

    // Question 9 TODO
    // When did you withdraw your application?
  }
};
