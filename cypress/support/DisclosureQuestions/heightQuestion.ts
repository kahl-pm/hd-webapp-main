import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import type { Height } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary:Height, inputSecondary:Height) => {
  const isMetricPrimary = 'centimeters' in inputPrimary;
  const formatPrimary = isMetricPrimary ? 'centimeters' : 'feet/inches';
  cy.AvailableUnit(QUESTIONS.HEIGHT, formatPrimary,
    isMetricPrimary ? [inputPrimary.centimeters] : [inputPrimary.feet, inputPrimary.inches], USER_TYPES.PRIMARY);
  if (hasValue(inputSecondary)) {
    const isMetricSecondary = 'centimeters' in inputSecondary;
    const formatSecondary = isMetricSecondary ? 'centimeters' : 'feet/inches';
    cy.AvailableUnit(QUESTIONS.HEIGHT, formatSecondary,
      isMetricSecondary ? [inputSecondary.centimeters] : [inputSecondary.feet, inputSecondary.inches], USER_TYPES.SECONDARY);
  }
};
