import { INSURANCE_OWNERSHIP_TYPES, UNDERWRITING_METHODS } from './const';

type ValidationResult = {
  isValid: boolean;
};

const validators: Record<string, (value: string) => ValidationResult> = {
  insurance_ownership_type: (value: string) => {
    return {
      isValid: (
        Object.keys(INSURANCE_OWNERSHIP_TYPES).map(key => INSURANCE_OWNERSHIP_TYPES[key])
      ).includes(value),
    };
  },
  underwriting_method: (value: string) => {
    return {
      isValid: (
        Object.keys(UNDERWRITING_METHODS).map(key => UNDERWRITING_METHODS[key])
      ).includes(value),
    };
  },
};

export default validators;
