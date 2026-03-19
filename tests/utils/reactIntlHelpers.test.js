import { LOCALE } from '@policyme/global-libjs-utils';
import { formatDateByLocale } from '../../src/utils/reactIntlHelpers';

describe('formatDateByLocale', () => {
  test.each([
    // Months are 0-indexed in JS
    [0, 'January'],
    [1, 'February'],
    [2, 'March'],
    [3, 'April'],
    [4, 'May'],
    [5, 'June'],
    [6, 'July'],
    [7, 'August'],
    [8, 'September'],
    [9, 'October'],
    [10, 'November'],
    [11, 'December'],
  ])('Format en-CA date for month %s', (monthNum, monthFormatted) => {
    expect(formatDateByLocale(LOCALE.EN_CA, new Date(2023, monthNum, 15))).toBe(`${monthFormatted} 15th`);
  });
  test('Format special case for fr-CA date, 1st of each month should have er appended', () => {
    expect(formatDateByLocale(LOCALE.FR_CA, new Date(2023, 0, 1))).toBe('1er janvier');
  });
  test.each([
    // Months are 0-indexed in JS
    [0, 'janvier'],
    [1, 'février'],
    [2, 'mars'],
    [3, 'avril'],
    [4, 'mai'],
    [5, 'juin'],
    [6, 'juillet'],
    [7, 'août'],
    [8, 'septembre'],
    [9, 'octobre'],
    [10, 'novembre'],
    [11, 'décembre'],
  ])('Format fr-CA date for month %s', (monthNum, monthFormatted) => {
    expect(formatDateByLocale(LOCALE.FR_CA, new Date(2023, monthNum, 21))).toBe(`21 ${monthFormatted}`);
  });
});
