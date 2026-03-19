import { hasValue } from '@policyme/global-libjs-utils';
import { USER_TYPES } from '../../../src/utils/const';
import type { Weight } from '../Types/disclosures';
import { QUESTIONS } from '../questions';

export default (inputPrimary: Weight, inputSeondary: Weight) => {
  const isMetricPrimary = 'kilograms' in inputPrimary;
  const formatPrimary = isMetricPrimary ? 'kilograms' : 'pounds';
  cy.AvailableUnit(QUESTIONS.WEIGHT, formatPrimary, [isMetricPrimary ? inputPrimary.kilograms : inputPrimary.pounds], USER_TYPES.PRIMARY);
  if (hasValue(inputSeondary)) {
    const isMetricSecondary = 'kilograms' in inputSeondary;
    const formatSecondary = isMetricSecondary ? 'kilograms' : 'pounds';
    cy.AvailableUnit(QUESTIONS.WEIGHT, formatSecondary, [isMetricSecondary ? inputSeondary.kilograms : inputSeondary.pounds], USER_TYPES.SECONDARY);
  }
};
