/**
 * Validates an AIR MILES collector number using the provided algorithm.
 * The number must:
 * - Be exactly 11 digits
 * - Start with 8
 * - Contain only numeric values
 * - Pass the check digit validation
 *
 * Check digit (D11) validation:
 * 1. Calculate: (D1*6) + (D2*5) + (D3*4) + (D4*3) + (D5*8) +
 *    (D6*7) + (D7*6) + (D8*5) + (D9*4) + (D10*3)
 * 2. Divide by 11
 * 3. If remainder < 2, check digit should be 0
 * 4. If remainder ≥ 2, check digit should be (11 - remainder)
 * 5. Check digit must match D11
 *
 * @param number - The AIR MILES collector number to validate
 * @returns boolean - Whether the number is valid
 */
export const isValidAirMilesNumber = (number: string): boolean => {
  // Check if input is exactly 11 digits and starts with 8
  if (!number || !/^8\d{10}$/.test(number.trim())) {
    return false;
  }

  // Convert string to array of numbers for calculation
  const digits = number.trim().split('').map(Number);

  // Multipliers for each position (D1-D10)
  const multipliers = [6, 5, 4, 3, 8, 7, 6, 5, 4, 3];

  // Calculate sum of first 10 digits multiplied by their respective multipliers
  const sum = digits
    .slice(0, 10)
    .reduce((acc, digit, index) => acc + digit * multipliers[index], 0);

  // Calculate remainder when divided by 11
  const remainder = sum % 11;

  // Calculate expected check digit based on remainder
  const expectedCheckDigit = remainder < 2 ? 0 : 11 - remainder;

  // Compare expected check digit with actual last digit (D11)
  return expectedCheckDigit === digits[10];
};
