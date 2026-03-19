import { isValidAirMilesNumber } from '../../src/utils/airmilesNumberValidator';

describe('isValidAirMilesNumber', () => {
  it('should return false for empty input', () => {
    expect(isValidAirMilesNumber('')).toBe(false);
  });

  it('should return false for invalid length', () => {
    expect(isValidAirMilesNumber('8123')).toBe(false);
    expect(isValidAirMilesNumber('800608608861')).toBe(false);
  });

  it('should return false for non-numeric characters', () => {
    expect(isValidAirMilesNumber('8abcdefghij')).toBe(false);
    expect(isValidAirMilesNumber('8006086088a')).toBe(false);
  });

  it('should return false for numbers not starting with 8', () => {
    expect(isValidAirMilesNumber('12345678901')).toBe(false);
    expect(isValidAirMilesNumber('90060860886')).toBe(false);
  });

  it('should return false for invalid check digit', () => {
    expect(isValidAirMilesNumber('80061948872')).toBe(false);
  });

  it('should return true for valid numbers where remainder ≥ 2', () => {
    expect(isValidAirMilesNumber('80060860886')).toBe(true);
  });

  it('should return true for valid numbers where remainder < 2', () => {
    expect(isValidAirMilesNumber('80061948870')).toBe(true);
  });

  it('should return false for whitespace-only input', () => {
    expect(isValidAirMilesNumber('   ')).toBe(false);
    expect(isValidAirMilesNumber('\t\n')).toBe(false);
  });

  it('should return false for numbers with spaces or special characters', () => {
    expect(isValidAirMilesNumber('800608 60886')).toBe(false);
    expect(isValidAirMilesNumber('800608-60886')).toBe(false);
  });

  it('should return true for valid numbers with leading/trailing spaces', () => {
    expect(isValidAirMilesNumber('  80060860886  ')).toBe(true);
  });
}); 