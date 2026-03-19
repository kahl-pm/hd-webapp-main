import validators from '../../src/utils/appPropValidator';
import { INSURANCE_OWNERSHIP_TYPES, UNDERWRITING_METHODS } from '../../src/utils/const';

describe('appPropValidator', () => {
  describe('insurance_ownership_type validator', () => {
    it('should return isValid true for valid insurance ownership types', () => {
      Object.values(INSURANCE_OWNERSHIP_TYPES).forEach(type => {
        const result = validators.insurance_ownership_type(type);
        expect(result.isValid).toBe(true);
      });
    });

    it('should return isValid false for invalid insurance ownership types', () => {
      const result = validators.insurance_ownership_type('invalid_type');
      expect(result.isValid).toBe(false);
    });
  });

  describe('underwriting_method validator', () => {
    it('should return isValid true for valid underwriting methods', () => {
      Object.values(UNDERWRITING_METHODS).forEach(method => {
        const result = validators.underwriting_method(method);
        expect(result.isValid).toBe(true);
      });
    });

    it('should return isValid false for invalid underwriting methods', () => {
      const result = validators.underwriting_method('invalid_method');
      expect(result.isValid).toBe(false);
    });
  });
});