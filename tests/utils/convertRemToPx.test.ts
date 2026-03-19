import { convertRemToPx } from '../../src/utils/helpers';

describe('convertRemToPx', () => {
  it('converts rem string to px (integer)', () => {
    expect(convertRemToPx('1rem')).toBe(16);
    expect(convertRemToPx('2rem')).toBe(32);
    expect(convertRemToPx('0.5rem')).toBe(8);
    expect(convertRemToPx('0rem')).toBe(0);
    expect(convertRemToPx('1.25rem')).toBe(20);
  });

  it('handles rem string with spaces', () => {
    expect(convertRemToPx(' 1.5rem ')).toBe(24);
  });

  it('handles rem string without "rem" (should still work if "rem" is missing)', () => {
    expect(convertRemToPx('2')).toBe(32);
  });

  it('returns NaN for invalid input', () => {
    expect(convertRemToPx('abc')).toBeNaN();
    expect(convertRemToPx('')).toBeNaN();
    expect(convertRemToPx('rem')).toBeNaN();
  });
});