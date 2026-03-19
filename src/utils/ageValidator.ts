import { AgeLimitConfig } from './const';
import { calcAgeNearest } from './helpers';
import { AgeRange } from './types';

export class AgeValidator {
  ageRange: AgeRange;

  constructor(product?: string) {
    if (product) {
      this.ageRange = AgeLimitConfig.productSpecificAgeLimit[product] ||
        AgeLimitConfig.defaultAgeLimit;
    } else {
      this.ageRange = AgeLimitConfig.defaultAgeLimit;
    }
  }

  validateAge(dateStr: string, applicationDate = null): boolean {
    let age;
    const upperLimit = this.ageRange.max;
    const lowerLimit = this.ageRange.min;

    age = calcAgeNearest(dateStr, applicationDate);
    return age >= lowerLimit && age <= upperLimit;
  }
}
