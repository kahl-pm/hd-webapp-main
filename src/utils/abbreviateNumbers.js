import { COVERAGES } from '../constants/session';

export function convertNumbersToAbbreviatedStrings(value) {
  if (value >= COVERAGES.ONE_MILLION) {
    const twoDecimalValue = fixedToTwoDecimalPlaces(value / COVERAGES.ONE_MILLION);
    return `${parseFloat(twoDecimalValue)} M`;
  }
  const twoDecimalValue = fixedToTwoDecimalPlaces(value / 1000);
  return `${twoDecimalValue} k`;
}

export function fixedToTwoDecimalPlaces(value) {
  return value.toFixed(2).replace(/\.00$/, '');
}
