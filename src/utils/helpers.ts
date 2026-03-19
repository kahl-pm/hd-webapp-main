import jsCookie from 'js-cookie';
import transform from 'lodash/transform';
import debounce from 'lodash/debounce';
import moment from 'moment';
import UAParser from 'ua-parser-js';
import { push } from 'connected-react-router';
import { matchPath } from 'react-router';
import { DebouncedFunc, orderBy } from 'lodash';
import { LOCALE, sentryError, getUrls, hasFlag, TENANT_FLAGS, getTenant, PM_HD_PLAN_TYPES, BMOI_HD_PLAN_TYPES, TENANTS_NAME_CODES_MAPPING, CAA_HD_PLAN_TYPES, HD_PLANS_DATA } from '@policyme/global-libjs-utils';

import {
  PAGE_NAMES, COUNTRY_CODES, FOLLOWUP_TYPES,
  IDENTIFICATION_TYPES_WITH_EXPIRY_DATE, IDENTIFICATION_TYPES_WITH_PROVINCE,
  GENDERS, TITLE_CASE_EXCEPTIONS,
  MIN_AGE_DEPENDENT, MAX_AGE_DEPENDENT,
  USER_TYPES,
  HELCIM_FAILURE_MESSAGES, PM_PRODUCT_PREFIX,
  PLAN_TYPES,
  TERM_LENGTHS_REDESIGN,
  PM_PRODUCT_TYPE,
  RELATIONSHIP_NAMES,
  FORMATTED_RELATIONSHIP_NAMES,
  USER_FAMILY_COMPOSITION,
  TWO_FACTOR_STATUS, TWO_FACTOR_FLOW,
  COOKIE_EXPIRY_DAYS,
  STRIPE_ERROR_MAPPING,
  AMF_AUTHORITY_RECORDS_URL,
  AMF_AUTHORITY_RECORDS_URL_FR,
  UserType,
  DIGITAL_CONSENT_COOKIES,
  ProductType,
  ProductTypeFull,
  USER_LEAD_SOURCES_VALUES,
  STATUTORY_HOLIDAYS,
  INTEGRATION_TEST_ENVS,
  COVERAGE_FIT_PLAN_CATEGORY_MAPPING,
  COVERAGE_FIT_OPTIONS_TEXT_MAPPING,
} from './const';
import { TERMS, COVERAGES } from '../constants/session';
import { updateIsLoading, openErrorModal } from '../NewActions/helpersMetadata';
import { formatDateByLocale, getEnglishMessageWithId, getFrenchCanadianMessageWithId, formatDateWithYearConfig, formatCurrencyWithoutDecimalsConfig } from './reactIntlHelpers';
// getProductSessionTerm import removed — was only used for Life/CI pricing
import { PM_ENVIRONMENT, PM_DEMO_ENV, PM_SKIP_MAGIC_LINK, CLIENT_SKIP_MAGIC_LINK_KEY, CLIENT_INTEGRATION_TEST_KEY } from '../config';
import { MetadataPerson, State } from '../store/types/State';

interface Update {
  path: string[];
  value: any;
  append?: boolean;
}

export interface UserPriceViewedData {
  /**
   * The start index of the period.
   */
  start_idx: number;
  /**
   * The end index of the period. Not inclusive.
   */
  end_idx: number;
  /**
   * The value of the period.
   */
  value: number;
}

export interface Updates {
  [key: string]: Update[];
}

// see: https://stackoverflow.com/questions/9238640/how-long-can-a-tld-possibly-be
export const EMAIL_REGEX = '^([A-Za-z0-9_\\-\\.])+(\\+([A-Za-z0-9_\\-\\.])+)?@(([A-Za-z0-9_\\-])+\\.)+([A-Za-z]{2,24})$'; // eslint-disable-line no-useless-escape
export const PHONE_REGEX = '^[1]?((([0-9]{3}))|([0-9]{3}))[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}$'; // eslint-disable-line no-useless-escape
export const UUID_V4_REGEX = '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
const HD_SAMPLE_POLICY_LINKS_PAGE_URLS = {
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: '/fr/juridique-et-conformite/exemples-de-polices',
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: '/fr/juridique-et-conformite/exemple-de-police',
  // link to ticket: https://policyme.atlassian.net/browse/PART-2242
};

// from: https://stackoverflow.com/questions/4603289/how-to-detect-that-javascript-and-or-cookies-are-disabled
export function areCookiesEnabled() {
  try {
    document.cookie = 'cookietest=1';
    let cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
    document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';
    return cookiesEnabled;
  } catch (e) {
    return false;
  }
}

export function userConsentToTracking() {
  /**
   * If the ANALYTICS_REVAMP_ENABLED flag is enabled, we need to check the OptanonConsent cookie
   * to see if the user has consented to tracking. This is used to maintain backwards compatibility
   * with the old consent solution. This if statement should be removed
   * once the old consent solution is removed.
   */
  if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
    const consent = getCookie('OptanonConsent');
    if (!consent) {
      return false;
    }
    const groups = consent.match(/groups=(.*?)($|&)/);
    if (!groups) {
      return false;
    }
    if (groups && groups[1]) {
      return !groups[1].includes(':0');
    }
    return false;
  }
  return areCookiesEnabled() && getCookie('pm_accepted_cookies') === 'true';
}

/*
 * This function takes a name and appropriately formats it.
 * Each segment of a name is allowed a maximum of two capital characters,
 * specifically, the first and one other letter
 * all extra spaces are also stripped.
 * Examples:
 * 'john McDONald' -> 'John Mcdonald'
 * '  john    mcdonald    ' -> 'John Mcdonald'
 */
export function toNameFormat(_name) {
  if (typeof _name === 'undefined') {
    return '';
  }
  return _name.trim()
    .split(' ')
    .filter(token => token.trim().length > 0)
    .map(token => formatToken(token))
    .join(' ');
}

/*
 * Helper function for toNameFormat, does the work of restricting
 * capical letters to 2, specifically, the first and one other
 */
function formatToken(token) {
  let firstChar = token.slice(0, 1).toUpperCase();
  // Only 1 extra capital letter per name
  let rest = token.slice(1);

  // Check if the token has more than 2 capital letters
  let upperCaseCount = 0;
  for (let i = 0; i < rest.length; i++) {
    if (rest.charAt(i).match(/[A-Z]/)) {
      upperCaseCount += 1;
    }
  }

  // If so, downcase the rest of the name (lost your uppercase privileges)
  if (upperCaseCount > 1) {
    return firstChar + rest.toLowerCase();
  }
  // this name is valid name case
  return firstChar + rest;
}

/**
 * Parses an english or french price formatted string into a number,
 * handling different number formats.
 *
 * @param str - The price formatted string to parse, which may contain
 * currency symbols, spaces, dots and commas
 * @returns The parsed price as a number
 *
 * @example
 * parsePrice("$1,234.56") // returns 1234.56
 * parsePrice("$26.08") // returns 26.08
 * parsePrice("1,234.56") // returns 1234.56
 * parsePrice("-1,234.56") // returns -1234.56
 * parsePrice("-$2.61") // returns -2.61
 *
 * French style:
 * parsePrice("1,234,56") // returns 1234.56
 * parsePrice("-$1,234,56") // returns -1234.56
 * parsePrice("8 550,67 $") // returns 8550.67
 *
 * Zero:
 * parsePrice("0.00") // returns 0
 * parsePrice("$0.00") // returns 0
 * parsePrice("-0") // returns 0
 */
export function parsePriceFormattedString(str: string): number {
  // 1. Initial cleaning: remove spaces and non-essential characters.
  //    Keep only digits, '.', ',', and '-'.
  let cleanedStr = str.replace(/\s/g, '').replace(/[^0-9.,-]/g, '');

  // Handle edge cases for parseFloat
  if (cleanedStr === '' || cleanedStr === '-' || cleanedStr === '.' || cleanedStr === ',') {
    return parseFloat(cleanedStr); // Will likely be NaN, which is appropriate
  }

  const hasDot = cleanedStr.includes('.');
  const hasComma = cleanedStr.includes(',');

  let finalStrToParse;

  if (hasDot && hasComma) {
    // Both dot and comma are present. Use the last occurrence to infer the decimal separator.
    const lastDotIndex = cleanedStr.lastIndexOf('.');
    const lastCommaIndex = cleanedStr.lastIndexOf(',');

    if (lastDotIndex > lastCommaIndex) {
      // Dot is last, assume it's decimal (e.g., "1,234.56"). Remove all commas.
      finalStrToParse = cleanedStr.replace(/,/g, '');
    } else {
      // Comma is last, assume it's decimal (e.g., "1.234,56"). Remove dots, convert comma to dot.
      finalStrToParse = cleanedStr.replace(/\./g, '').replace(',', '.');
    }
  } else if (hasDot) {
    // Only dot is present (e.g., "123.45"). Assume it's decimal.
    finalStrToParse = cleanedStr;
  } else if (hasComma) { // Only commas are present, no dots
    const parts = cleanedStr.split(',');
    // Heuristic: if the segment after the last comma has 3 digits,
    // and there was at least one comma, assume English-style thousands separators.
    // e.g., "1,234", "123,456", "1,234,567"
    if (parts.length > 1 && parts[parts.length - 1].length === 3) {
      finalStrToParse = cleanedStr.replace(/,/g, '');
    } else {
      // Otherwise, assume comma is a decimal separator (potentially French style).
      // This handles "123,45" -> 123.45
      // And for inputs like "1,234,56" (intended as 1234.56), it becomes 1234.56
      const lastCommaIdx = cleanedStr.lastIndexOf(',');
      const beforeLastComma = cleanedStr.substring(0, lastCommaIdx).replace(/,/g, '');
      const afterLastComma = cleanedStr.substring(lastCommaIdx + 1);
      finalStrToParse = `${beforeLastComma}.${afterLastComma}`;
    }
  } else {
    // Neither dot nor comma is present (e.g., "123").
    finalStrToParse = cleanedStr;
  }

  return parseFloat(finalStrToParse);
}

export function titleCaseInput(input) {
  if (typeof input === 'undefined') {
    return '';
  }
  let str = input.split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}

export function fromNullToStr(o) {
  let fromNullHelper = (res, val, key) => {
    res[key] = (val === null ? '' :
      val instanceof Object ? transform(val, fromNullHelper) : val);
  };
  return transform(o, fromNullHelper);
}

export function fromStrToNull(o) {
  let fromStrHelper = (res, val, key) => {
    res[key] = (val === '' ? null :
      val instanceof Object ? transform(val, fromStrHelper) : val);
  };
  return transform(o, fromStrHelper);
}

export const isEmpty = (val) => !hasValue(val);

export function isEmptyObj(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function isEmptyArray(arr) {
  return arr.constructor === Array && arr.length === 0;
}

export function removeComma(str) {
  if (str) {
    let result = (parseInt(str.toString().replace('$', '').split(',').join(''), 10));
    return Number.isNaN(result) ? '' : result;
  }
  return '';
}

export function addComma(_str, sign = '+') {
  let ret = '';
  let str = (typeof _str === 'number' && _str === 0) ? '0' : _str;
  if (str) {
    ret = (`$${removeComma(str).toLocaleString(LOCALE.EN_CA)}`);
    if (sign === '-') {
      // add brackets around value
      return `(${ret})`;
    }
  }
  return ret;
}

// this function allows users to type currency as normal even when their browser language is french
// we need this function because french currency is parsed differently
// ex: 1234567 --> 1,234,567
// the currency is now parsed as if the browser language was english when it is french
export function parseFrenchCurrency(_str) {
  if (typeof _str === 'undefined') {
    return '';
  }
  let str = _str.toString();
  const len = str.length;
  let diff = len - 3;
  const numCommas = Math.ceil(len / 3) - 1;
  if (numCommas === 1) {
    return (`$${str.slice(0, diff)},${str.slice(diff)}`);
  } else if (numCommas === 2) {
    return (`$${str.slice(0, diff - 3)},${str.slice(diff - 3, diff)},${str.slice(diff)}`);
  }
  return str.length === 0 ? str : `$${str}`;
}

export function formatNegativeCurrency(_str) {
  let ret = '';
  let negativePrefix = '';
  let str = (typeof _str === 'number' && _str === 0) ? '0' : _str.toString();
  if (str === '-$') return '-$0';
  if (str.charAt(0) === '-') {
    negativePrefix = '-';
    str = str.slice(1);
  }
  if (str) {
    str = (`${negativePrefix}$${removeComma(str).toLocaleString(LOCALE.EN_CA)}`);
  }
  return str;
}

export function parseNegativeCurrency(str, prevStr) {
  if (str) {
    if (typeof prevStr === 'number' && str === '$') return '';
    if (typeof prevStr === 'number' && str === '-$') return '';
    if (str === '-' && prevStr === '-$') return '';
    if (str === '-' && prevStr === '') return '-$';

    const replaced = str.toString()
      .replace('$', '')
      .split(',')
      .join('');
    let result = replaced === '' ? 0 : (parseInt(replaced, 10));
    return Number.isNaN(result) ? '' : result;
  }
  return '';
}

export function createUserPriceViewedDataPayload(
  state: State,
  userType: UserType,
  product: typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX],
): UserPriceViewedData[] {
  let payload: UserPriceViewedData[] = [];
  const userViewedPriceInfo: MetadataPerson['userViewedPriceInfo'] = state.metadata[userType].userViewedPriceInfo;

  // HD-only: the term length is 12 months and no Life/CI discounts are applied
  payload.push({
    start_idx: 0,
    end_idx: 12,
    // value is the total monthly non discounted price minus the
    // caa discount and family discount if applicable
    value: Number((userViewedPriceInfo.totalMonthlyNonDiscountedPrice[product]
    - (Math.abs(userViewedPriceInfo?.caaDiscountSavingsApplied || 0)
    + Math.abs(userViewedPriceInfo?.familyDiscountSavingsApplied || 0))).toFixed(2)),
  });

  return payload;
}

export function toCurrencyWithDecimal(_num) {
  let num = (typeof _num === 'number' && _num === 0) ? 0 : _num;
  num = parseFloat(num);
  if (hasValue(num)) {
    return `$${num.toFixed(2).toLocaleString(LOCALE.EN_CA)}`;
  }
  return '';
}

export function phoneMask(str) {
  if (typeof str === 'undefined') {
    return '';
  }
  let numbers = str.split('').filter(c => !Number.isNaN(parseInt(c, 10)));
  let take = numbers[0] === '1' ? 11 : 10; // we don't actually parse, just filter out ones that won't
  return numbers.slice(0, take).join('');
}

export function formatPhoneNumber(num) {
  // pull leading 1 off, then calculate each section
  if (typeof num === 'undefined') {
    return '';
  }
  const wholeString = String(num);
  let section1;
  let section2;
  let section3;
  let result = '';
  if (wholeString === '1') {
    return '1';
  } else if (wholeString[0] === '1') {
    result = '1 ';
    section1 = wholeString.substring(1);
  } else {
    section1 = wholeString;
  }

  // area code section
  if (section1.length > 3) {
    result += `(${section1.substring(0, 3)}) `;
    section2 = section1.substring(3);
  } else if (section1.length > 0) {
    result += `(${section1}`;
    return result;
  } else if (section1.length === 0) {
    return result;
  }

  // middle section
  if (section2.length > 3) {
    result += `${section2.substring(0, 3)}-`;
    section3 = section2.substring(3);
  } else {
    result += section2;
    return result;
  }

  return result + section3;
}

export function phoneMaskWithStars(str: string): string {
  return str && str.length > 0 ? '*'.repeat(6) + str.slice(-4) : '';
}

export function capitalizeFirstLetter(str) {
  if (!str) { return ''; }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function padZeros(number, length) {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
}

// source: https://stackoverflow.com/questions/22697936/binary-search-in-javascript
export function binarySearch(array, element, compare_fn) {
  let m = 0;
  let n = array.length - 1;
  while (m <= n) {
    let k = Math.floor((n + m) / 2);
    let cmp = compare_fn(element, array[k]);
    if (cmp > 0) {
      m = k + 1;
    } else if (cmp < 0) {
      n = k - 1;
    } else {
      return k;
    }
  }
  return -m - 1;
}

export function isValidPhone(phone) {
  let reg = new RegExp(PHONE_REGEX, 'g');
  return reg.test(phone);
}

export function isEmail(email) {
  // see https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
  // and https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
  let reg = new RegExp(EMAIL_REGEX, 'g');
  return reg.test(email);
}

export function getUserQuoteIdentifier(userSession, userHousehold) {
  return userSession?.household_id || `${userHousehold?.birthdate?.replace(/\//g, '')}-${userHousehold?.userGender?.toLowerCase()}-${userHousehold?.smoke}`;
}

export function getBirthdateParts(birthdate) {
  return birthdate?.split('/')?.map(num => parseInt(num, 10)) ?? [];
}

export function calcAge(birthdate, applicationDate = null) {
  const [birthday, birthmon, birthyr] = birthdate
    .split('/')
    .map(num => parseInt(num, 10));

  const app_date = applicationDate ? moment(applicationDate, 'DD/MM/YYYY').utc() : moment().utc();
  const notReachedBirthMonth = (app_date.month() + 1) < birthmon;
  const reachedBirthMonthNotBirthday = ((app_date.month() + 1) === birthmon)
    && (app_date.date() < birthday);
  const notReachedBirthday = (notReachedBirthMonth || reachedBirthMonthNotBirthday);

  return app_date.year() - birthyr - (notReachedBirthday ? 1 : 0);
}

export const birthdateStringToReadable = (birthdate, locale = LOCALE.EN_CA as string) => {
  let [day, month, year] = birthdate.split('/');
  return formatDateByLocale(
    locale,
    new Date(`${year}/${month}/${day}`),
    formatDateWithYearConfig,
  );
};

export function calcAgeNearest(birthdate, applicationDate = null) {
  const [birthday, birthmon, birthyr] = birthdate
    .split('/')
    .map(num => parseInt(num, 10));
  const app_date = applicationDate ? moment(applicationDate, 'DD/MM/YYYY') : moment();
  const NUM_MONTHS = 12;
  let age = calcAge(birthdate, app_date);

  let mon_diff = (app_date.month() + 1) - birthmon;
  if (mon_diff < 0) {
    mon_diff += NUM_MONTHS;
  }
  if (mon_diff === 0) { // same month as birth month
    if (app_date.date() < birthday) { // if you are a few days to your next birthday, add 1
      age += 1;
    }
  } else if (mon_diff >= 6) { // potentially rounding up
    if (mon_diff === 6) { // if 6 months apart might not round up
      if (app_date.date() > birthday) { // after your half-birthday, so round up to next year
        age += 1;
      }
    } else { // between 7 and 11 months into the year, always add 1
      age += 1;
    }
  }

  return age;
}

export function calcBirthdate(age) {
  // format: DD/MM/YYYY
  // assuming that today is the birthdate
  const today = new Date();
  const todayDay = today.getDate();
  const todayMon = today.getMonth() + 1;
  const todayYr = today.getFullYear();

  const birthDay = padZeros(todayDay, 2);
  const birthMon = padZeros(todayMon, 2);
  const birthYr = todayYr - age;

  const birthdate = `${birthDay}/${birthMon}/${birthYr}`;

  return birthdate;
}

export function calcBirthdateJson(age) {
  // format: DD/MM/YYYY
  // assuming that today is the birthdate
  const today = new Date();
  const birthDate = new Date(today.getFullYear() - age, today.getMonth(), today.getDate());

  return birthDate.toJSON();
}

export function combineDateAndTime(date, time) {
  let newDate = moment(date, 'dddd, MMMM Do, YYYY');
  let newTime = moment(time, 'hh:mm A');
  newDate.hour(newTime.hour());
  newDate.minute(newTime.minute());
  let combined = newDate.toISOString();
  return combined;
}

// from: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
export function formatDate(date) {
  if (date === '' || typeof date === 'undefined') {
    return '';
  }

  let d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  let year = `${d.getFullYear()}`;

  if (month === 'NaN' || day === 'NaN' || year === 'NaN') {
    return '';
  }

  if (month.length < 2) {
    month = `0${month}`;
  }
  if (day.length < 2) {
    day = `0${day}`;
  }

  return [year, month, day].join('');
}

// replaces the product start with the /:product/ string to help
// match the ROUTES const
export const getGenericRoute = (pathname) => {
  return pathname
    .replace(/^(\/life\/)|(\/ci\/)|(\/hd\/)/g, '/:product/');
};

export function getPageViewName(pathname, product) {
  let path = getGenericRoute(pathname);
  if (typeof PAGE_NAMES[path] === 'undefined') {
    return `${product} - route ${path} Page View`;
  }
  return `${product} - ${PAGE_NAMES[path]} Page View`;
}

export function getNextEventName(pathname, product) {
  let path = getGenericRoute(pathname);
  if (typeof PAGE_NAMES[path] === 'undefined') {
    return `${product} - Next route ${path}`;
  }
  return `${product} - Next ${PAGE_NAMES[path]}`;
}

export function getBackEventName(pathname, product) {
  let path = getGenericRoute(pathname);
  if (typeof PAGE_NAMES[path] === 'undefined') {
    return `${product} - Back route ${path}`;
  }
  return `${product} - Back ${PAGE_NAMES[path]}`;
}

export function getBackEventNameNoPrefix(pathname) {
  let path = getGenericRoute(pathname);
  if (typeof PAGE_NAMES[path] === 'undefined') {
    return path;
  }
  return PAGE_NAMES[path];
}

export function getLoadedEventName(pathname, product) {
  let path = getGenericRoute(pathname);
  if (typeof PAGE_NAMES[path] === 'undefined') {
    return `${product} - route ${path} Loaded`;
  }
  return `${product} - ${PAGE_NAMES[path]} Loaded`;
}

export function getTimeSlotsFallback(followupType) {
  if (followupType === FOLLOWUP_TYPES.ADVICE) {
    return getAdvisorTimeSlotsFallback();
  } else if (
    followupType === FOLLOWUP_TYPES.TELE_INTERVIEW
    || followupType === FOLLOWUP_TYPES.TELE_INTERVIEW_REBOOKING
  ) {
    return getTeleinterviewTimeSlotsFallback();
  } else if (
    followupType === FOLLOWUP_TYPES.PARAMED_VISIT
    || followupType === FOLLOWUP_TYPES.TELE_INTERVIEW_REBOOKING
  ) {
    return getParamedTimeSlotsFallback();
  }
  // we may not be showing the correct timeslots,
  // use tele because it's 2+ days away and not early/late
  sentryError('Followup times error');
  return getTeleinterviewTimeSlotsFallback();
}

function getTeleinterviewTimeSlotsFallback() {
  let timeSlots = [];

  const now = moment();
  const totalDays = 7;
  const apptsPerDay = 32; // 16 hours * 2, 7AM - 11PM
  let firstBusinessDay = moment(now);

  // If we are after 4PM go to next business day
  if (now.hour() > 15) { // hours indexed from 0 to 23
    firstBusinessDay = moment(now).add(1, 'day');
  }

  // If currect business day M-Th then add 2 days, else go to Tu
  if (firstBusinessDay.weekday() >= 1 && firstBusinessDay.weekday() <= 4) { // Su = 0, Sa = 6
    firstBusinessDay = moment(firstBusinessDay).add(2, 'days');
  } else {
    // add difference between next tuesday, "9th" day of week
    firstBusinessDay = moment(firstBusinessDay).add((9 - firstBusinessDay.weekday()), 'days');
  }
  firstBusinessDay = moment(firstBusinessDay).hours(7).minutes(0).seconds(0);

  // for totalDays, add 7AM-10:30AM start
  let nextBusinessDay = moment(firstBusinessDay);
  for (let i = 0; i < totalDays; i++) {
    for (let j = 0; j < apptsPerDay; j++) {
      timeSlots.push({
        start: moment(nextBusinessDay).add(30 * j, 'minutes'),
        end: moment(nextBusinessDay).add(30 * (j + 1), 'minutes'),
        available: true, // only add valid appts
      });
    }
    nextBusinessDay = moment(nextBusinessDay).add(1, 'days');
  }
  return timeSlots;
}

export function getParamedTimeSlotsFallback() {
  let timeSlots = [];

  const now = moment();
  const totalDays = 7;
  const apptsPerWeekday = 28; // 14 hours * 2, 8AM - 10PM
  const apptsPerSaturday = 12; // 6 hours * 2, 9AM - 4PM
  let firstBusinessDay = moment(now);

  // If we are after 4PM go to next business day
  if (now.hour() > 15) { // hours indexed from 0 to 23
    firstBusinessDay = moment(now).add(1, 'day');
  }

  // If currect business day M-Th then add 2 days, else go to Tu
  if (firstBusinessDay.weekday() >= 1 && firstBusinessDay.weekday() <= 4) { // Su = 0, Sa = 6
    firstBusinessDay = moment(firstBusinessDay).add(2, 'days');
  } else {
    // add difference between next tuesday, "9th" day of week
    firstBusinessDay = moment(firstBusinessDay).add((9 - firstBusinessDay.weekday()), 'days');
  }
  firstBusinessDay = moment(firstBusinessDay).hours(8).minutes(0).seconds(0);

  // for totalDays, add 7AM-10:30AM start
  let nextBusinessDay = moment(firstBusinessDay);
  for (let i = 0; i < totalDays; i++) {
    if (nextBusinessDay.weekday() === 0) { // Sunday
      nextBusinessDay = moment(nextBusinessDay).add(1, 'days');
      continue; // eslint-disable-line  no-continue
    }

    let apptsToday;
    if (nextBusinessDay.weekday() === 6) {
      apptsToday = apptsPerSaturday;
      nextBusinessDay.hours(10);
    } else {
      apptsToday = apptsPerWeekday;
      nextBusinessDay.hours(8);
    }
    for (let j = 0; j < apptsToday; j++) {
      timeSlots.push({
        start: moment(nextBusinessDay).add(30 * j, 'minutes'),
        end: moment(nextBusinessDay).add(30 * (j + 1), 'minutes'),
        available: true, // only add valid appts
      });
    }
    nextBusinessDay = moment(nextBusinessDay).add(1, 'days');
  }
  return timeSlots;
}

export function getAdvisorTimeSlotsFallback() {
  let timeSlots = [];

  const now = moment();
  const totalDays = 21;

  // NOTE: moments are mutable, need to clone a moment object
  // before calling any manipulation methods on it
  // calling moment() with a moment will perform the clone
  let nextTime = moment(now).startOf('hour').add(3, 'hours');

  for (let dayCount = 0; dayCount <= totalDays; dayCount++) {
    let startDay = moment(now).add(dayCount, 'days').startOf('day');
    let endDay = moment(startDay).add(23, 'hours').add(30, 'minutes');

    // working hours 8AM-8PM
    let firstAvailTime = moment(startDay).add(8, 'hours');
    let lastAvailTime = moment(startDay).add(20, 'hours');

    while (nextTime.isSameOrBefore(endDay)) {
      let available = false;
      if (nextTime.isSameOrAfter(firstAvailTime) && nextTime.isSameOrBefore(lastAvailTime)) {
        available = true;
      }

      timeSlots.push({
        start: moment(nextTime),
        end: moment(nextTime).add(30, 'minutes'),
        available,
      });

      // increment nextTime
      nextTime.add(30, 'minutes');
    }
  }

  return timeSlots;
}

export function validateDDMMYYYY(dateStr) {
  return moment(dateStr, 'DD/MM/YYYY', true).isValid();
}

export function validateDependentAge(dateStr, applicationDate = null) {
  const age = calcAgeNearest(dateStr, applicationDate);
  return age >= MIN_AGE_DEPENDENT && age <= MAX_AGE_DEPENDENT;
}

export function validateGender(gender) {
  if (gender === GENDERS.MALE || gender === GENDERS.FEMALE) {
    return true;
  } else if (gender.toUpperCase() === 'M' || gender.toUpperCase() === 'F') {
    return true;
  }
  return false;
}
export function validateSmoke(smoke) {
  return smoke === true || smoke === false;
}

export function shorthandToGender(val) {
  if (!hasValue(val)) {
    return '';
  } else if (val.toUpperCase() === 'M') {
    return GENDERS.MALE;
  } else if (val.toUpperCase() === 'F') {
    return GENDERS.FEMALE;
  }
  return '';
}

export function genderToShorthand(val) {
  if (val === GENDERS.MALE) {
    return 'M';
  } else if (val === GENDERS.FEMALE) {
    return 'F';
  }
  return '';
}

export function validateTerm(term) {
  const _term = parseInt(term, 10);
  if (Object.values(TERMS).indexOf(_term) !== -1) {
    return true;
  }
  return false;
}

export function isValidUUID(uuid) {
  let reg = new RegExp(UUID_V4_REGEX, 'g');
  return reg.test(uuid);
}

export function delay(millis = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), millis));
}

export async function delayRequest(fn, millis = 1000) {
  await delay(millis);
  return fn();
}

// NOTE: no need for this function right now, might be necesssary in a case where
//       don't want to notify Sentry or whether some request is truly best effort/optional,
//       however, no such case currently exists
//
// export function failSilently(fn) {
//   let wrapperFn = (...args) => retryFn(3, ...args);
//   let retryFn = (_retries, ...args) => {
//     return fn(...args)
//       .catch(error => {
//         if (_retries > 0) {
//           return delayRequest(() => retryFn(_retries - 1, ...args));
//         }
//         return Promise.resolve({ success: false });
//       });
//   };
//   return wrapperFn;
// }

// Retries passed in function 'fn' a certain number of times, and
// if it fails every time returns the rejected promise
export function withRetryNoPrompt(fn) {
  let wrapperFn = (...args) => retryFn(3, ...args);
  let retryFn = (_retries, ...args) => {
    return fn(...args)
      .catch(error => {
        if (_retries > 0) {
          return delayRequest(() => retryFn(_retries - 1, ...args));
        }
        return Promise.reject(error);
      });
  };
  return wrapperFn;
}

// similar to withErrorModalOnFail except it does not prompt the user
// for a retry, instead just redirects the user to specified error page.
export function withRedirectOnFail(
  fn, dispatch, route, failureFunction = null, failureFunctionParams = [],
) {
  let wrapperFn = (...args) => retryFn(...args);
  let retryFn = (...args) => {
    return fn(...args)
      .catch(error => {
        sentryError(error, {
          extras: { source: 'withRetry' },
          tags: { source: 'withRetry' },
        });
        if (failureFunction) dispatch(failureFunction(...failureFunctionParams));

        const isUnauthorized = error?.statusCode === 401;
        if (isUnauthorized) {
          // Show modal for 401 errors
          return dispatch(openErrorModal(() => retryFn(...args), error));
        }

        // Raven.captureException(error, {});
        dispatch(push(route));
        return Promise.reject(error);
      });
  };
  return wrapperFn;
}

// accepts a function, calls it, and if it returns a rejected promise, it will
// open an error modal to ask the user if they want to retry or go back
// this also dispatches a sentry error
export const withErrorModalOnFail =
  <F extends (...args: any[]) => any>(fn:F, dispatch:any) => {
    const wrapper = async (...args:Parameters<F>) => {
      try {
        return await fn(...args);
      } catch (error) {
        sentryError(error, {
          extras: { source: 'withRetry' },
          tags: { source: 'withRetry' },
        });
        return dispatch(openErrorModal(() => wrapper(...args), error));
      }
    };
    return wrapper;
  };

// Similar to withRetry except it accepts an array of arrays,
// each of which starts with a function that returns a promise
// followed by the (0 or more) arguments passed to that function

// If all promises are resolved then this returns an array of the
// resolved promises
// If any fail they are retried using withRetryNoPrompt, resolved promises are not
// retried, their value is saved to be returned later
// If any fail repeatedly the user is prompted with a retry modal, where they can
// select to retry any failing requests or go back to the previous page
// to test this, use global-tools-development

// example inputs
// [
//   [function1, f1arg1 ...],
//   [function2, f2arg1, f2arg2 ...],
//   [function3, f3arg1, f3arg2, f3arg3 ...],
//   ...
// ], dispatch
export function withRetryArray(fnWithArgsArray, dispatch) {
  return Promise.allSettled(
    // need new functions that will be retried then fail silently with rejected promises on error
    // withRetryNoPrompt takes a function to retry and returns
    // a function to be called to start the request/retries
    fnWithArgsArray.map(([fn, ...args]) => withRetryNoPrompt(fn)(...args)),
  ).then((proms) => {
    if (proms.every(p => p.status === 'fulfilled')) {
      return proms;
    }
    const err = proms.find(p => p.status === 'rejected')?.reason;
    const retryableFns = proms.map((p, index) => (p.status === 'fulfilled'
      ? [() => Promise.resolve(p.value)]
      : fnWithArgsArray[index]));
    return dispatch(
      openErrorModal(() => withRetryArray(retryableFns, dispatch), err),
    );
  }).catch((e) => {
    return Promise.reject(e);
  });
}

export function withLoadingArray(fnWithArgsArray, dispatch) {
  dispatch(updateIsLoading(true));
  return Promise.allSettled(
    fnWithArgsArray.map((fn) => fn()),
  ).then((proms) => {
    if (proms.every(p => p.status === 'fulfilled')) {
      dispatch(updateIsLoading(false));
      return proms;
    }
    dispatch(updateIsLoading(false));
    return Promise.reject(proms);
  }).catch((errorProms) => {
    dispatch(updateIsLoading(false));
    return Promise.reject(errorProms);
  });
}

// helper function that enables the loading overlay until a promise is resolved,
// then removes the overlay
export function withLoading(fn, dispatch) {
  return (...args) => {
    dispatch(updateIsLoading(true));
    // can't use finally here because Edge doesn't support it without polyfill magic
    return fn(...args).then((res) => {
      dispatch(updateIsLoading(false));
      return res;
    })
      .catch((res) => {
        dispatch(updateIsLoading(false));
        return Promise.reject(res);
      });
  };
}

// shorthand function that combines the loading overlay with the retry helper function
export function blockingRequest(fn, dispatch) {
  return withLoading(withErrorModalOnFail(fn, dispatch), dispatch);
}

export const getErrorMessages = (props) => {
  const errorMessages: any = {};

  errorMessages.required = props.email ? 'Enter an email' : '';

  Object.keys(props)
    .filter(key => key.endsWith('Message'))
    .forEach(key => {
      let validatorName = key.substring(0, key.indexOf('Message'));
      errorMessages[validatorName] = props[key];
    });
  return errorMessages;
};

export const formatDecimal = (val,
  { decimal: maxDecimal = 1, locale = LOCALE.EN_CA as string }) => {
  let decimalMask = locale === LOCALE.FR_CA ? ',' : '.';
  const stringValue = `${val}`;
  let formattedDecimalForm;
  let [_whole, decimal] = stringValue.split('.');
  if (decimal && !Number.isNaN(decimal) && decimal.length < maxDecimal) {
    formattedDecimalForm = val.toFixed(maxDecimal);
  }
  formattedDecimalForm = stringValue.replace('.', decimalMask);
  return formattedDecimalForm;
};

export const parseDecimal = (
  _value, { whole: maxWhole, decimal: maxDecimal = 1, locale = LOCALE.EN_CA as string },
) => {
  let decimalMask = locale === LOCALE.FR_CA ? ',' : '.';
  // const value = _value;
  const stringValue = `${_value}`;
  const standardDecimalForm = stringValue.replace(decimalMask, '.');
  const rawValue = parseFloat(standardDecimalForm);
  if (Number.isNaN(rawValue)) {
    return '';
  }
  let [whole, decimal] = stringValue.toString().split(decimalMask);
  if (`${whole}`.length > maxWhole) {
    return `${whole}`.substring(0, maxWhole);
  }
  if (stringValue.indexOf(decimalMask) !== -1) {
    if (decimal) {
      if (Number.isNaN(parseInt(decimal, 10))) {
        return `${whole}${decimalMask}`;
      }
      if (decimal.length > maxDecimal) {
        let formattedValue = rawValue.toFixed(maxDecimal);
        return formattedValue;
      }
      return rawValue.toFixed(decimal.length);
    }
    return `${whole}${decimalMask}`;
  }
  return rawValue;
};

export const getMonthOptions = (selectedYear) => {
  let options = [];
  let startMonth = 1;

  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();

  if (selectedYear === currYear) {
    startMonth = currMonth + 1;
  }
  for (let i = startMonth; i <= 12; i++) {
    options.push({
      label: i.toString().length === 1 ? `0${i}` : i.toString(),
      value: i.toString().length === 1 ? `0${i}` : i.toString(),
    });
  }

  return options;
};

export const getYearsOptions = (numYears, forward = false, selectedMonth = null) => {
  let options = [];

  const currYear = new Date().getFullYear();
  const currMonth = new Date().getMonth();
  let startYear = 0;

  if (selectedMonth && forward && selectedMonth <= (currMonth + 1)) {
    startYear += 1;
  }
  for (let i = startYear; i <= numYears; i++) {
    options.push({
      label: forward ? currYear + i : currYear - i,
      value: forward ? currYear + i : currYear - i,
    });
  }

  return options;
};

export const parsePostalCode = (postalCode, previousPostalCode, country) => {
  let postalCodeLength = postalCode.length;
  let prevPostalCodeLen = previousPostalCode.length;
  let input = postalCode.split(' ').join('');

  if (country === COUNTRY_CODES.CA) {
    if (postalCodeLength < 7) {
      if (postalCodeLength > 3) {
        postalCode = `${postalCode.slice(0, 3)} ${postalCode.slice(3).replace(/\s/g, '')}`; // eslint-disable-line no-param-reassign
      }
    } else if (postalCodeLength >= 7) {
      if (prevPostalCodeLen === 7) {
        postalCode = `${previousPostalCode.slice(0, 3)} ${previousPostalCode.slice(3, 6)}`; // eslint-disable-line no-param-reassign
      } else {
        postalCode = `${input.slice(0, 3)} ${input.slice(3, 6)}`; // eslint-disable-line no-param-reassign
      }
    }
  }
  return postalCode.toUpperCase();
};

export const hasValue = (val) => {
  return val !== '' && val !== undefined && val !== null;
};

export const hasSomeValue = (arr) => arr.some(e => hasValue(e));

export const spreadStateFields = (state, fields) => {
  const filteredState = {};

  fields.forEach(field => {
    filteredState[field] = state[field];
  });
  return filteredState;
};

export const hasExpiryDate = (id_type) => {
  return IDENTIFICATION_TYPES_WITH_EXPIRY_DATE.includes(id_type);
};

export const hasProvinceOfIssue = (id_type) => {
  return IDENTIFICATION_TYPES_WITH_PROVINCE.includes(id_type);
};

export const getBrowserLanguage = () => {
  if (process.env.BROWSER) {
    // userLanguage is a non-spec property that old IE used
    // Typescript doesn't like it, so we have to cast it
    const nav: Navigator & { userLanguage?: string } = navigator;
    return ((nav.languages && nav.languages[0])
      || nav.language || nav.userLanguage);
  }
  return 'en-EN';
};

export const stripTrailingSlash = (slug) => {
  let ret = slug;
  if (slug !== '/') {
    ret = slug.replace(/\/+$/, '');
  }
  return ret;
};

export function isValidDay(day) {
  if (day === '0_' || day === '__') {
    return true;
  }
  let newday = day.replace(/_/g, '0');
  return newday > 0 && newday <= 31;
}

export function isValidMonth(month) {
  if (month === '0_' || month === '__') {
    return true;
  }
  let newmonth = month.replace(/_/g, '0');
  return newmonth > 0 && newmonth <= 12;
}

export function isValidYear(year) {
  return ['__', '1_', '19', '2_', '20'].includes(year.slice(0, 2));
}

export function isLeapYear(year) {
  return new Date(year, 1, 29).getDate() === 29;
}

export function isNumeric(myString) {
  return /\d/.test(myString);
}

export function formatMonth(month) {
  if (month === '__' || month === '0_' || month === '1_') {
    return month;
  } else if (/\d{1}_{1}/.test(month)) {
    return `0${month[0]}`;
  }
  return month;
}

// Note: takes in a Formatted message as the abbreviation paramater
export const getNameOrAbbreviation = (name = '', abbreviation, application_language) => {
  if (name.length >= 14 || name.length === 0) {
    if (application_language === LOCALE.FR_CA) {
      return (getFrenchCanadianMessageWithId(abbreviation.props.id));
    }
    return (getEnglishMessageWithId(abbreviation.props.id));
  }
  return name;
};

export const removeSpecialChars = (string) => {
  // remove any non-alpha, underscore, space, dash characters
  return string.replace(/[^a-zA-Z_ -]/g, '');
};

export const deepCopyObject = (_object) => {
  return JSON.parse(JSON.stringify(_object));
};

// Life/CI coverage tier functions removed for HD-only webapp — stubs kept for import compatibility
export const getMaxEligibleCoverageTier = (
  _eligibleCoverage,
  _findNextHighest = false,
  _isPerm = false,
) => 0;

export const getCiMaxEligibleCoverageTier = (_eligibleCoverage) => 0;

const supportedPairs = {
  iOS: ['Mobile Safari', 'Chrome', 'Firefox'],
  Android: ['Samsung Browser', 'Chrome', 'Firefox'],
};

export function isValidMobileBrowser(userAgent) {
  const parser = new UAParser();
  let browser = parser.setUA(userAgent).getBrowser();
  let os = parser.setUA(userAgent).getOS();

  return supportedPairs[os.name] && supportedPairs[os.name].includes(browser.name);
}

export function isPolicyMeEmail(email) {
  const pmEmailRegex = /.*(@)(policyme.com)/i;
  return pmEmailRegex.test(email);
}

export function isNumOrEmpty(creditCardNumber) {
  const regex = /\d+$/;
  return regex.test(creditCardNumber.replace(/\s/g, '')) || creditCardNumber.length === 0;
}

export function generateSupportTicketNumber() {
  let date = new Date();
  return `${date.getMonth() + 20}${date.getDate() + 20}${date.getSeconds() + 20}${date.getMilliseconds()}`;
}

export function simpleHash(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char; // eslint-disable-line no-bitwise
    hash &= hash; // eslint-disable-line no-bitwise
  }
  return hash;
}

// Life/CI term/coverage functions removed for HD-only webapp — stubs kept for import compatibility
export const getAvailableTerms = (
  _ageNearest: number,
  _ageNearestSecondary: number,
  _hasPartnerApplication: boolean,
  _shouldUserSeePerm: boolean = false,
) => [];

export const getCPPEligibleTerm = (_ageNearest, _selectedTerm) => 0;

export const getCPPEligibleCoverage = (_ageNearest, _selectedCoverage) => 0;

// propType: PropTypes validator function (eg. PropTypes.string)
export const propRequiredIf = (propTypeValidator, requiredConditionFunc) => {
  return (props, propName, componentName, ...rest) => {
    if (requiredConditionFunc(props, propName, componentName)) {
      if (!Object.hasOwnProperty.call(props, propName)) {
        return new Error(`${propName} prop is missing in ${componentName}.`);
      }
      return propTypeValidator(props, propName, componentName, ...rest);
    }
    return propTypeValidator(props, propName, componentName, ...rest);
  };
};

export function randomizeArray(arr) {
  let randArray = arr;
  for (let i = randArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [randArray[i], randArray[randomIndex]] = [randArray[randomIndex], randArray[i]];
  }
  return randArray;
}

export function wordToTitleCase(str) {
  if (TITLE_CASE_EXCEPTIONS.indexOf(str) === -1) {
    // not an exception word, change first character to upper case
    return `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
  }
  return str;
}

export function toTitleCase(str) {
  return str.split(' ')
    .map(wordToTitleCase)
    .join(' ');
}

export function isWhiteListedHelcimError(errorMessage) {
  return errorMessage === HELCIM_FAILURE_MESSAGES.DECLINED ||
    errorMessage === HELCIM_FAILURE_MESSAGES.DECLINED_CVV2 ||
    errorMessage === HELCIM_FAILURE_MESSAGES.EXPIRED_CARD ||
    errorMessage === HELCIM_FAILURE_MESSAGES.INVALID_CARD;
}

// Life/CI default term/coverage functions removed for HD-only webapp — stubs kept for import compatibility
export const calcDefaultTermAndCoverage = (_age, _smoke) => [0, 0];

export const CILowerTermPriceAdjust = (_price, _ageNearest, _smoke) => false;

export const _getDefaultTermCI = (_ageNearest, _smoke) => 0;

export const _getDefaultCICoverage = (_ageNearest, _smoke) => 0;

export const getCICoverageDefaults = (_isJoint, _primary, _secondary) => 0;

export const getCITermDefaults = (_isJoint, _primary, _secondary) => 0;

export const getCIAvailableTerms = (_ageNearest) => {
  return [];
};

// CI default term from life term removed for HD-only webapp
export const getCIDefaultTermFromLifeTerm = (_life_term, _age_nearest) => 0;

export function parseBool(val) {
  return val !== undefined && (val.toLowerCase() === 't' || val.toLowerCase() === 'true' || val === '1');
}

export const setABTestBandCookie = (band:string) => {
  jsCookie.set('ab_test_band', band, { expires: COOKIE_EXPIRY_DAYS, secure: true, sameSite: 'strict' });
};

export const getABTestBandCookie = (cookies:Record<string, string> | null = null):string => {
  if (cookies) {
    return cookies.ab_test_band;
  }
  return jsCookie.get('ab_test_band');
};

export const isDigitalConsentForceEnabled = () => {
  return Boolean(jsCookie.get(DIGITAL_CONSENT_COOKIES.FORCE_DIGITAL_CONSENT_ENABLED));
};

// HD-only webapp: always use HD product
export const allProducts = (fn) => (...params) => async (dispatch, getState) => {
  const products = [PM_PRODUCT_PREFIX.HD];

  const promiseList = [];

  products.forEach((product) => {
    promiseList.push(
      dispatch(fn(product, ...params)),
    );
  });

  return Promise.all(promiseList);
};

// HD-only webapp: always use HD product
export const allProductsSynchronous = (fn) => (...params) => async (dispatch, getState) => {
  const promiseList = [];

  const res = await dispatch(fn(PM_PRODUCT_PREFIX.HD, ...params));
  promiseList.push(res);

  return promiseList;
};

export const allUsers = (fn) => (...params) => async (dispatch, getState) => {
  const { currentUser, hasPartnerApplication } = getState().userControl;
  const doPrimary = currentUser === USER_TYPES.PRIMARY || hasPartnerApplication;
  const doSecondary = currentUser === USER_TYPES.SECONDARY || hasPartnerApplication;
  const deps = getState().dependents.dependent_keys;
  let primaryRes, secondaryRes;
  let dependentRes = [];
  if (doPrimary) {
    primaryRes = await dispatch(fn(USER_TYPES.PRIMARY, null, ...params));
  }
  if (doSecondary) {
    secondaryRes = await dispatch(fn(USER_TYPES.SECONDARY, null, ...params));
  }
  if (deps) {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (let key of deps) {
      // eslint-disable-next-line no-await-in-loop
      dependentRes.push(await dispatch(fn(USER_TYPES.DEPENDENT, key, ...params)));
    }
  }
  return [primaryRes, secondaryRes, ...dependentRes];
};

export const allUsersParallel = (fn) => (...params) => async (dispatch, getState) => {
  const { currentUser, hasPartnerApplication } = getState().userControl;
  const doPrimary = currentUser === USER_TYPES.PRIMARY || hasPartnerApplication;
  const doSecondary = currentUser === USER_TYPES.SECONDARY || hasPartnerApplication;
  const doDependents = getState().dependents.dependent_keys;
  let primaryRes, secondaryRes;
  let dependentsRes = [];
  if (doPrimary) {
    primaryRes = () => dispatch(fn(USER_TYPES.PRIMARY, ...params));
  } else {
    primaryRes = () => Promise.resolve();
  }
  if (doSecondary) {
    secondaryRes = () => dispatch(fn(USER_TYPES.SECONDARY, ...params));
  } else {
    secondaryRes = () => Promise.resolve();
  }
  if (doDependents) {
    // eslint-disable-next-line guard-for-in, no-restricted-syntax
    for (let key of doDependents) {
      dependentsRes.push(() => dispatch(fn(USER_TYPES.DEPENDENT, key, ...params)));
    }
  }

  const allParallelUsers = [
    primaryRes(),
    secondaryRes(),
    ...dependentsRes.map((res) => res()),
  ];
  return Promise.allSettled(allParallelUsers);
};

export const getOtherUserType = (userType) => {
  return userType === USER_TYPES.PRIMARY ? USER_TYPES.SECONDARY : USER_TYPES.PRIMARY;
};

export function getRouteWithUserType(route, userType) {
  return route.replace(':userType', userType);
}

export const getRouteWithProductType = (route, product) => {
  return route.replace(':product', product);
};

export const getRouteWithErrorType = (route, errorType) => {
  return route.replace(':errorType', errorType);
};

export function getRouteListWithUserType(routes, userType) {
  const newRoutes = [];
  routes.forEach(route => {
    newRoutes.push(getRouteWithUserType(route, userType));
  });
  return newRoutes;
}

export function addPossessiveApostrophe(name, locale) {
  if (name.length === 0) {
    return '';
  }
  if (locale === LOCALE.FR_CA) {
    const startsWithVowelSound = ['a', 'e', 'i', 'o', 'u', 'y', 'h'].includes(name[0].toLowerCase());
    return startsWithVowelSound ? `d'${name}` : `de ${name}`;
  }
  if (name.toLowerCase().slice(-1) === 's') {
    return `${name}'`;
  }
  return `${name}'s`;
}

// Life/CI coverage ticks removed for HD-only webapp — stubs kept for import compatibility
export const getEditCoverageModalTicks = (
  _maxCoverage: number,
  _primaryAge: number,
  _secondaryAge: number,
  _hasPartner: boolean,
  _isPermanentInsuranceSelected: boolean = false,
): number[] => [];

export const getCITicks = (_maxCoverage) => {
  return [];
};

// Life coverage ticks removed for HD-only webapp
export const getTicks = (
  _selectedRecmdAmt,
  _isSimplifiedIssue,
  _isPermanentInsuranceSelected,
  _primaryAge,
  _secondaryAge,
  _hasPartner,
) => [];

export const isLocalDevTest = INTEGRATION_TEST_ENVS.includes(PM_ENVIRONMENT);

export const isDebugEnv = PM_DEMO_ENV !== 'demo' && PM_ENVIRONMENT !== 'prod' && PM_ENVIRONMENT !== 'production';

export const isLocalOrProdEnv = PM_ENVIRONMENT === 'local' || PM_ENVIRONMENT === 'prod';

// Life "most customers buy" functions removed for HD-only webapp
export function getMostCustomersBuyCoverage(_ageNearest, _intl) {
  return '';
}

export function getMostCustomersBuyTerm(_ageNearest) {
  return 0;
}

export const getUserFromURL = (url) => {
  const primaryRX = /\/approved\/primary/g;
  const secondaryRX = /\/approved\/secondary/g;
  if (url.match(primaryRX)) { return USER_TYPES.PRIMARY; }
  if (url.match(secondaryRX)) { return USER_TYPES.SECONDARY; }
  return null;
};

export const paymentTypeToPriceKey = (type) => {
  if (type === PLAN_TYPES.MONTHLY) {
    return 'Monthly';
  }
  if (type === PLAN_TYPES.ANNUAL) {
    return 'Annual';
  }
  return '';
};

/**
 * Helper method to convert snake_case to camelCase
 * @param {*} str string to be converted
 * @returns return string with camelCase
 * @example hello_world -> helloWorld, Hello_World -> helloWorld, one_two_three -> oneTwoThree
 */
const _snakeToCamelCase = (str) => {
  return str.toLowerCase().replace(/([_][a-z])/g, group => group
    .toUpperCase()
    .replace('_', ''));
};

const _camelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Helper method to check the type of the data object before deciding how to iterate
 * it to convert to it's keys to camelCase (only for traversing arrays & objects and
 * converting finding their keys to convert to camel)
 * @param {*} data item to be converted
 * @returns converted data
 */
const _snakeToCamelCaseKeysInObjects = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => _snakeToCamelCaseKeysInObjects(item));
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce(
      (prevObj, [k, v]) => ({
        ...prevObj,
        [_snakeToCamelCase(k)]: _snakeToCamelCaseKeysInObjects(v),
      }), {},
    );
  }
  return data;
};

const _camelToSnakeCaseKeysInObjects = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => _camelToSnakeCaseKeysInObjects(item));
  } else if (typeof data === 'object' && data !== null) {
    return Object.entries(data).reduce(
      (prevObj, [k, v]) => ({
        ...prevObj,
        [_camelToSnakeCase(k)]: _camelToSnakeCaseKeysInObjects(v),
      }), {},
    );
  }
  return data;
};

/**
 * Helper method to convert object keys / nested objects in arrays / strings to camelCase
 * @param {*} data string/object/array in snake_case
 * @returns converted data
 */
export const snakeToCamelCase = (data) => {
  if (typeof data === 'string') {
    return _snakeToCamelCase(data);
  } else if (typeof data === 'object' && data !== null) {
    return _snakeToCamelCaseKeysInObjects(data);
  }
  return data;
};

/**
 * Helper method to convert object keys / nested objects in arrays / strings to snake_case
 * @param {*} data string/object/array in camelCase
 * @returns converted data
 */
export const camelToSnakeCase = (data) => {
  if (typeof data === 'string') {
    return _camelToSnakeCase(data);
  } else if (typeof data === 'object' && data !== null) {
    return _camelToSnakeCaseKeysInObjects(data);
  }
  return data;
};

export const findClosestPolicyTerm = (mortgageTerm, availableTerms = getTermLengths()) => {
  const termAmounts = orderBy(availableTerms, undefined, 'asc');
  const defaultTerm = termAmounts.find(term => term >= mortgageTerm) || termAmounts.at(-1);
  return defaultTerm;
};

export const productPrefixToProductType = (prefix:ProductType):ProductTypeFull|'' => {
  if (prefix === PM_PRODUCT_PREFIX.HD) {
    return PM_PRODUCT_TYPE.HEALTH_AND_DENTAL;
  }
  return '';
};

export const getRevocabilityLabel = (intl, is_revocable) => {
  if (is_revocable === true) {
    return intl.formatMessage({ id: 'revocability.revocable.e7E7Oo' });
  } else if (is_revocable === false) {
    return intl.formatMessage({ id: 'revocability.irrevocable.14u7a3' });
  }
  console.error('is_revocable should never be anything else other than true or false');
  return '';
};

export const productTypeToProductPrefix = (type: ProductTypeFull): ProductType | '' => {
  if (type === PM_PRODUCT_TYPE.HEALTH_AND_DENTAL) {
    return PM_PRODUCT_PREFIX.HD;
  }
  return '';
};

export const getPlanTypeDisplay = (intl, planType) => {
  if (planType === PLAN_TYPES.ANNUAL) {
    return intl.formatMessage({ id: `global.annual.fM1zEv` });
  }
  return intl.formatMessage({ id: `global.monthly.bwlUMN` });
};

/**
 * Recursilvy convert truthy values to 'Y' / 'N' strings
 * @param {Object} object
 * @returns Object
 */
export const truthyValuesToYesNoStrings = (object) => {
  let truthyToStringHelper = (res, val, key) => {
    res[key] = (val instanceof Object ? transform(val, truthyToStringHelper) : (val ? 'Y' : 'N'));
  };
  return transform(object, truthyToStringHelper);
};

/**
 * Resolve promises and list the ones that failed/passed
 * @param {Array} promises
 * @returns {Object} { resolved: [], rejected: [] }
 */
export const listResolvedAndRejectedPromises = async (promises) => {
  const resolved = [];
  const rejected = [];
  await Promise.allSettled(promises).then((results) => {
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value && !result.value.error) {
        resolved.push(result);
      } else {
        rejected.push(result);
      }
    });
  });
  return { resolved, rejected };
};

/**
 * getTranslatedRelationship('Spouse', 'fr-CA') -> 'Conjoint(e)'
 * @param {str} relationship
 * @returns str
 */
export const getTranslatedRelationship = (relationship) => {
  const entry = Object.entries(RELATIONSHIP_NAMES)
    .find(([k, v]) => v === relationship);
  const msg = entry ? FORMATTED_RELATIONSHIP_NAMES[entry[0]] : null;
  return msg;
};

export const processHbmResponse = (responseStatus) => {
  if (Number(responseStatus) === 200) {
    return 'success';
  }
  return 'failure';
};

export const hasMultipleFamilyMembers = (state) => {
  if (state.dependents.dependent_keys.length > 0) {
    return true;
  }
  if ([USER_FAMILY_COMPOSITION.SELF_PARTNER,
    USER_FAMILY_COMPOSITION.SELF_PARTNER_KIDS].includes(
    state.primary.household.user_family_composition,
  )) {
    return true;
  }
  return false;
};

export const getCookieDomain = () => {
  let baseurl = 'localhost';
  if (typeof window !== 'undefined') {
    baseurl = window.location.host;
  }
  if (baseurl.indexOf('localhost') > -1) {
    return 'localhost';
  }
  if (baseurl.indexOf('www') > -1) {
    // input: www.policyme.com
    // output: policyme.com
    let domainParts = baseurl.split('.');
    domainParts.shift();
    let modifiedDomain = domainParts.join('.');
    return modifiedDomain;
  }
  // input: infr-1663.life-health.caa.ondemand.policyme.com
  // output: infr-1663.life-health.caa.ondemand.policyme.com
  // input: infr-1663.ondemand.policyme.com
  // output: infr-1663.ondemand.policyme.com
  // input: test.policyme.com
  // output: test.policyme.com
  return baseurl;
};

function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }

  return null;
}

export const getNextPageTwoFaFlow = (status) => {
  const statusToFlowMap = {
    [TWO_FACTOR_STATUS.ENABLED]: TWO_FACTOR_FLOW.SHOW_OTP_PAGE,
    [TWO_FACTOR_STATUS.DISABLED]: TWO_FACTOR_FLOW.SHOW_DASHBOARD_PAGE,
    [TWO_FACTOR_STATUS.PENDING]: TWO_FACTOR_FLOW.SHOW_PHONE_PAGE,
    [TWO_FACTOR_STATUS.SKIPPED]: TWO_FACTOR_FLOW.SHOW_DASHBOARD_PAGE,
  };
  return status === null
    ? TWO_FACTOR_FLOW.SHOW_CREATE_ACCOUNT_PAGE
    : statusToFlowMap[status];
};

/**
 * Debounces a function, with debounce groupings based on a key
 * derived from the function args
 * @param {function} func Function to debounce
 * @param {(any) => string} keyMapper Maps function args to a key
 * @param {number} timeout Millis to use as the debounce timeout
 * @returns {function} Debounced function
 */
export const debounceByKey = <F extends (...args: any) => any>(
  func: F,
  keyMapper: (...args: Parameters<F>) => string,
  timeout: number,
): (...args: Parameters<F>) => ReturnType<F> => {
  const funcs = new Map<string, DebouncedFunc<any>>();
  return (...args) => {
    const key = keyMapper(...args);
    if (!funcs.has(key)) {
      funcs.set(key, debounce(func, timeout));
    }
    return funcs.get(key)(...args);
  };
};

/**
   * aura disclosure functions get the user type from the url
   * if the user_type is a dependent then that will be the key
   * instead of the user type
  */
export const transformUserKey = (userKey:UserType):[UserType, UserType] => {
  if (([USER_TYPES.PRIMARY, USER_TYPES.SECONDARY] as UserType[]).includes(userKey)) {
    return [userKey, null];
  }
  return [USER_TYPES.DEPENDENT, userKey];
};

export const openFile = (documentBlob, documentName) => {
  const url = window.URL.createObjectURL(documentBlob);
  const newWindow = window.open(url, documentName);
  if (newWindow) {
    newWindow.onclose = () => {
      window.URL.revokeObjectURL(url);
    };
  }

  if (!newWindow) {
    // Fallback for mobile browsers
    // that block window.open from rendering a blob in a new tab
    // render the blob in the same tab (download)
    const link = document.createElement('a');
    link.href = url;
    link.download = documentName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export const getPrivacyPolicyPageUrl = (lang) => {
  if (getTenant().code === TENANTS_NAME_CODES_MAPPING.BLUE_CROSS) {
    return getBCLPrivacyPolicyPath(lang);
  }
  return lang === LOCALE.FR_CA ? `${getUrls().homepage}/fr/confidentialite`
    : `${getUrls().homepage}/privacy`;
};

export const getCoverageTermsAndConditionsPageUrl = () => {
  const tenantNameCode = getTenant().code;
  return `${getUrls().homepage}${HD_SAMPLE_POLICY_LINKS_PAGE_URLS[tenantNameCode]}`;
};

export const getStripeBackendErrorMessage = (error) => {
  if (STRIPE_ERROR_MAPPING[error.err_code]) {
    return STRIPE_ERROR_MAPPING[error.err_code];
  }
  switch (error.err_code) {
    case 'card_declined':
      return STRIPE_ERROR_MAPPING.generic_decline;
    // can add more cases here if they are different than our common cases
    default:
      return STRIPE_ERROR_MAPPING.default_message;
  }
};

export const getTermLengths = (isPermanentInsuranceEnabled: boolean = false): Array<number> => {
  if (isPermanentInsuranceEnabled) {
    return [...TERM_LENGTHS_REDESIGN, TERMS.HUNDRED];
  }
  return TERM_LENGTHS_REDESIGN;
};

// Permanent insurance is Life-only; always disabled in HD webapp
export const isPermanentInsuranceEnabled = (_isPermLifeEnabled: boolean) => {
  return false;
};

// Permanent insurance is Life-only; always ineligible in HD webapp
export const isAgeEligibleForPermanentInsurance = (_primaryAge: number,
  _secondaryAge?: number, _isJoint?: boolean): boolean => {
  return false;
};

// Permanent insurance is Life-only; always disabled in HD webapp
export const shouldEnablePermForPermMilestonV2AgeRequirement = (_primaryAge: number,
  _secondaryAge?: number, _isJoint?: boolean): boolean => {
  return false;
};

/**
 * @param route the ROUTE to match
 * @param pathname the current pathname
 * @returns react router match url
 * https://v5.reactrouter.com/web/api/matchPath
 */
export const getMatchingRoute = (route: string, pathname: string) => {
  return matchPath(pathname, { path: route, exact: true })?.url;
};

/**
 * @param route the ROUTE to match
 * @param pathname the current pathname
 * @param param the param in the path to match
 * @returns the value of the param in the path
 * https://v5.reactrouter.com/web/api/matchPath
 */
export const getMatchingRouteParam = (route: string, pathname: string, param: string) => {
  return matchPath(pathname, { path: route, exact: true })?.params[param];
};

// remove once all tenants are using digital consent
export const getLegacyPaymentCardAppearanceRules = (theme) => {
  const rules = {
    '.Tab': {
      ...{ border: theme.input.border },
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
    },
    '.Input--empty': {
      ...{ border: theme.input.border },
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
    },
    '.Input:focus': {
      ...{ border: theme.input.border },
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
    },
    '.Input': {
      ...{ border: theme.input.border },
      ...(theme.input.leftBorderInputNonEmpty &&
        { borderLeft: theme.input.leftBorderInputNonEmpty }),
    },
    '.Label': {
      color: theme.input.labelColor,
    },
  };
  return {
    variables: {
      colorPrimary: theme.input.labelColor,
      colorTextSecondary: theme?.palette?.bodyText,
      fontFamily: theme.font,
      borderRadius: theme.input.borderRadius,
      fontSizeBase: theme.input.floatingLabelFontSize,
    },
    rules,
  };
};

export const getPaymentCardAppearanceRules = (theme) => {
  const rules = {
    '.Tab': {
      ...{ border: theme.input.border },
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
    },
    '.Input--empty': {
      ...{ border: theme.input.borderInactive },
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
    },
    '.Input:focus': {
      ...(theme.input.leftBorderInputEmpty && { borderLeft: theme.input.leftBorderInputEmpty }),
      ...{ boxShadow: `0 0 0 ${theme.input.borderActive?.replace('solid', '')}` },
      ...{ border: 'solid 1px transparent' },
    },
    '.Input': {
      ...{ padding: '16.5px 14.5px' },
      ...{ border: theme.input.borderInactive },
      ...{ borderRadius: theme.input.borderRadius || 0 },
      ...{ boxShadow: '0 0 0 1px transparent' },
      ...(theme.input.leftBorderInputNonEmpty &&
        { borderLeft: theme.input.leftBorderInputNonEmpty }),
    },
    '.Label': {
      color: theme.input.labelColor,
    },
    '.ExpressCheckout': {
      borderRadius: theme.buttonCTA.borderRadiusCurved,
    },
  };
  return {
    variables: {
      colorPrimary: theme.input.labelColor,
      colorTextSecondary: theme?.customTypography?.bodyTextColor,
      fontFamily: theme.font,
      borderRadius: theme.input.borderRadius,
      fontSizeBase: theme.input.floatingLabelFontSize,
      fontSize3Xs: '0.875rem',
    },
    rules,
  };
};

export const getComplaintsPath = (lang) => {
  return lang === LOCALE.FR_CA ? '/fr/juridique-et-conformite/plaintes' : '/legal/complaints';
};

export const convertRemToPx = (remString: string): number => {
  const remValue = parseFloat(remString.replace('rem', ''));
  return Math.round(remValue * 16);
};

export const getBCLComplaintsPath = (lang) => {
  /**
   * Because of SO many different combinations of possible URLs, we're just going
   * to simplify this and point it to prod urls based on the locale.
   * Supporting different environments is difficult in the time crunch given that
   * they all have differing domains.
   */

  return lang === LOCALE.FR_CA ?
    'https://www.croixbleue.ca/vie/fr/assuremoi/plaintes' :
    'https://www.bluecross.ca/life/policyme/complaints';
};

export const getBCLPrivacyPolicyPath = (lang) => {
  /**
   * Because of SO many different combinations of possible URLs, we're just going
   * to simplify this and point it to prod urls based on the locale.
   * Supporting different environments is difficult in the time crunch given that
   * they all have differing domains.
   */

  return lang === LOCALE.FR_CA ?
    'https://www.croixbleue.ca/vie/fr/juridique-et-conformite/confidentialite' :
    'https://www.bluecross.ca/life/legal/privacy';
};

export const getAMFAuthorityRecordsURL = (lang) => {
  return lang === LOCALE.FR_CA ? AMF_AUTHORITY_RECORDS_URL_FR : AMF_AUTHORITY_RECORDS_URL;
};

export const getPMTestCaseSessionIDLog = (
  caseNumber,
  sessionId,
  userType = USER_TYPES.PRIMARY,
  isCrossSell,
) => {
  return `pm_TestCase_${userType}${String(caseNumber ?? '').padStart(2, '0')}${(isCrossSell ? '_cross_sell' : '')}: ${sessionId}`;
};

export const getPMTestCaseCISessionIDLog = (
  caseNumber,
  sessionId,
  userType = USER_TYPES.PRIMARY,
  isCrossSell,
) => {
  return `pm_CITestCase_${userType}${String(caseNumber ?? '').padStart(2, '0')}${(isCrossSell ? '_cross_sell' : '')}: ${sessionId}`;
};

export const getPMTestCaseEmailLog = (caseNumber, email, userType) => {
  return `pmEmail_TestCase_${userType}${String(caseNumber ?? '').padStart(2, '0')}: ${email}`;
};

// for now we are just going to map the CAA products to the PM ones
// in the future we need to break the 1-1 mapping
export const caaProductNameToPM = (productName) => {
  const productMap = {
    [CAA_HD_PLAN_TYPES.DENTAL_SECURE]: PM_HD_PLAN_TYPES.DENTAL_CARE,
    [CAA_HD_PLAN_TYPES.ESSENTIAL]: PM_HD_PLAN_TYPES.ECONOMIC,
    [CAA_HD_PLAN_TYPES.STANDARD]: PM_HD_PLAN_TYPES.CLASSIC,
    [CAA_HD_PLAN_TYPES.ENHANCED]: PM_HD_PLAN_TYPES.ADVANCED,
  };
  return productMap[productName];
};

export const pmProductNameToCaa = (productName) => {
  const productMap = {
    [PM_HD_PLAN_TYPES.DENTAL_CARE]: CAA_HD_PLAN_TYPES.DENTAL_SECURE,
    [PM_HD_PLAN_TYPES.ECONOMIC]: CAA_HD_PLAN_TYPES.ESSENTIAL,
    [PM_HD_PLAN_TYPES.CLASSIC]: CAA_HD_PLAN_TYPES.STANDARD,
    [PM_HD_PLAN_TYPES.ADVANCED]: CAA_HD_PLAN_TYPES.ENHANCED,
  };
  return productMap[productName];
};

export const getHDPlanTypeListForTenant = () => {
  if (getTenant().code === TENANTS_NAME_CODES_MAPPING.POLICYME) {
    return PM_HD_PLAN_TYPES;
  } else if (getTenant().code === TENANTS_NAME_CODES_MAPPING.BMOI) {
    return BMOI_HD_PLAN_TYPES;
  }

  return CAA_HD_PLAN_TYPES;
};

export const getFileNameFromContentDisposition = (contentDisposition) => {
  let filename = '';
  if (contentDisposition) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  return filename;
};

export const getUserLeadSources = () => {
  const tenantizedUserLeadSources = getTenant().userLeadSources.sources;
  const keys = Object.keys(USER_LEAD_SOURCES_VALUES) as (keyof typeof USER_LEAD_SOURCES_VALUES)[];
  let sources = keys
    .filter(key => tenantizedUserLeadSources.includes(key))
    .map(key => USER_LEAD_SOURCES_VALUES[key]);

  // Filter out other and don't recall to add at the end
  sources = sources.filter((source) => {
    return (source.value !== USER_LEAD_SOURCES_VALUES.OTHER.value
      && source.value !== USER_LEAD_SOURCES_VALUES.DONT_RECALL.value);
  });

  if (getTenant().userLeadSources.shouldRandomize) {
    sources = randomizeArray(sources);
  }

  return [
    ...sources,
    USER_LEAD_SOURCES_VALUES.OTHER,
    USER_LEAD_SOURCES_VALUES.DONT_RECALL,
  ];
};

/**
 * Updates a deeply nested field in a session storage item.
 * @param {string} key - The key of the session storage item.
 * @param {string[]} path - An array representing the path to the field.
 * @param {*} value - The new value to set at the specified path.
 * @param {boolean} [append=false] - Whether to append the value (if true)
 * or replace it (default is false).
 */
export const updateSessionStorage = (key, path, value, append = false) => {
  // Retrieve the existing object from sessionStorage
  let item = sessionStorage.getItem(key);
  let obj = item ? JSON.parse(item) : {};

  // Use a reference to traverse the object
  let ref = obj;

  // Traverse the path, creating nested objects as needed
  for (let i = 0; i < path.length - 1; i++) {
    if (!ref[path[i]]) {
      ref[path[i]] = {}; // Create an empty object if it doesn't exist
    }
    ref = ref[path[i]]; // Move deeper into the object
  }

  // Handle appending or replacing data
  let lastKey = path[path.length - 1];
  if (append) {
    if (Array.isArray(ref[lastKey])) {
      // Append to array
      ref[lastKey].push(value);
    } else if (typeof ref[lastKey] === 'object' && ref[lastKey] !== null) {
      // Merge with object
      ref[lastKey] = { ...ref[lastKey], ...value };
    } else {
      // Initialize as array or object and append
      ref[lastKey] = Array.isArray(value) ? value.slice() : [value];
    }
  } else {
    // Default to replace
    ref[lastKey] = value;
  }

  // Convert the updated object back to a JSON string
  sessionStorage.setItem(key, JSON.stringify(obj));
};

/**
 * Updates multiple fields in session storage using the existing updateSessionStorage function.
 * @param {Object} updates - An object where each key is a session storage key
 * and its value is an array of updates.
 * Each update is an object containing `path` (array of strings) and `value` (new value).
 */
export const updateMultipleSessionStorageKeys = (updates: Updates) => {
  // Use Object.entries to iterate over the keys and values of the updates object
  Object.entries(updates).forEach(([storageKey, updateList]) => {
    // Apply each update using the existing updateNestedSessionStorage function
    updateList.forEach(({ path, value, append }) => {
      // Call the existing function to handle the update
      updateSessionStorage(storageKey, path, value, append);
    });
  });
};

// HD-only: payment form is always shown (Life/CI logic removed)
export const getShowPaymentForm = (
  _isDigitalConsent: boolean,
  _mainProduct: ProductType,
  _ci_approved: boolean,
  _isCiOptedEmpty: boolean,
): boolean => {
  return true;
};

export const formatCurrencyConfig = { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol' };

// 987654321 => 988M, 100000 => 100K
export const formatCurrencyWithNotationsConfig = { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol', notation: 'compact', compactDisplay: 'short' };

/**
 * Get the localized time in the X minutes from now in the format HH:MM
 * @param date : Date
 * @param minutes : number
 * @returns LocaleTimeString
 * @example getTimeXMinutesAfter(new Date(), 5) -> 12:05 PM [current time being 12pm]
 */
export const getTimeXMinutesAfter = (date: Date, minutes: number): string => {
  date.setMinutes(date.getMinutes() + minutes);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Redirect to dog homepage
 */
export const goToDogHomePage = () => {
  window.location.replace(`${getUrls().homepage}/dog`);
};

export const getCategoriesFromPlans = (plans) => {
  const categories = new Set();
  plans.forEach((plan) => {
    categories.add(plan.category);
  });
  return Array.from(categories);
};

export const isStatutoryHoliday = (date: moment.Moment) => {
  return STATUTORY_HOLIDAYS.includes(date.format('YYYY-MM-DD'));
};

export const isDisabledDate = (date: moment.Moment, options: {
  disableWeekends?: boolean,
  disableStatutoryHolidays?: boolean,
  maxDaysInFuture?: number,
}) => {
  const maxDate = options.maxDaysInFuture != null ? moment().add(options.maxDaysInFuture, 'days') : false;
  return (
    (options.disableWeekends && (date.day() === 0 || date.day() === 6))
    || (options.disableStatutoryHolidays && isStatutoryHoliday(date))
    || (maxDate && date.isAfter(maxDate))
    || false
  );
};

/*
  * This function will return the category of a given plan
  * @param planType: string
  * @param underwritingMethod: string
  * @param tenantCode: string
  * @returns string
  */
export const getPlanCategory = (
  planType: string, underwritingMethod: string, tenantCode: string,
) => {
  if (!Object.keys(HD_PLANS_DATA[tenantCode][underwritingMethod]).includes(planType)) {
    return '';
  }
  return HD_PLANS_DATA[tenantCode][underwritingMethod][planType].category;
};

export const makeUpdateCoverageOptions = (product) => {
  return (value) => {
    return {
      type: `@@all/${product}/session/update_options`,
      value,
    };
  };
};

/** Updates coverage options for a single user only (primary or secondary). Use when applying that user's API response. */
export const makeUpdateCoverageOptionsForUser = (product) => {
  return (userType, value) => {
    return {
      type: `@@${userType}/${product}/session/update_options`,
      value,
    };
  };
};

export const makeBulkUpdateCoverage = (product) => {
  return (value) => {
    return {
      type: `@@all/${product}/session/bulk_update`,
      value,
    };
  };
};

/** Updates coverage for a single user only (primary or secondary). Use when applying that user's API response. */
export const makeUpdateCoverageForUser = (product) => {
  return (userType, value) => {
    return {
      type: `@@${userType}/${product}/session/bulk_update`,
      value,
    };
  };
};

export const makeUpdateProductSessionProp = (userType, product) => {
  return (property, value) => {
    return {
      type: `@@${userType}/${product}/session/update`,
      property,
      value,
    };
  };
};

export const makeUpdateAllUsersSessionProp = (product) => {
  return (property, value) => {
    return {
      type: `@@all/${product}/session/update`,
      property,
      value,
    };
  };
};

export const makeUpdateTerm = (product) => {
  return (_value) => {
    const value = _value === '' ? TERMS.TEN : _value;
    return {
      type: `@@all/${product}/session/update_term`,
      value,
    };
  };
};

/** Updates selected term for a single user only (primary or secondary). Use when applying that user's API response. */
export const makeUpdateTermForUser = (product) => {
  return (userType, _value) => {
    const value = _value === '' ? TERMS.TEN : _value;
    return {
      type: `@@${userType}/${product}/session/update_term`,
      value,
    };
  };
};

export const makeUpdateCustomCoverage = (product) => {
  return (value) => {
    return {
      type: `@@all/${product}/session/update_custom_coverage`,
      value,
    };
  };
};

export const makeResetAllQuoteSelection = (product) => {
  return () => {
    return {
      type: `@@all/${product}/session/reset_quote_selection`,
    };
  };
};

export const makeUpdateCustomSelectedQuote = (product) => {
  return () => {
    return {
      type: `@@all/${product}/session/update_custom_selected_quote`,
    };
  };
};

// This function will add the headers to skip magic link provided all criteria are met
export const injectMagicLinkIntegrationTestHeaders = (headers: {
  'Content-Type': string;
  'Accept': string;
  'X-hd-webapp-main-version': string;
  [key: string]: string;
}): {
  'Content-Type': string;
  'Accept': string;
  'X-hd-webapp-main-version': string;
  [key: string]: string;
} => {
  try {
    const lambdaTestKey = localStorage.getItem('X-integration-test');
    const newHeaders = { ...headers };

    if (PM_SKIP_MAGIC_LINK === '1' && hasValue(CLIENT_SKIP_MAGIC_LINK_KEY)) {
      newHeaders['X-skip-magic-link'] = CLIENT_SKIP_MAGIC_LINK_KEY;
    } else if (
      lambdaTestKey &&
      // We must check that the environment is not PROD
      // Important: Never remove this condition
      isLocalDevTest &&
      PM_ENVIRONMENT !== 'prod' &&
      hasValue(CLIENT_INTEGRATION_TEST_KEY) &&
      CLIENT_INTEGRATION_TEST_KEY === lambdaTestKey
    ) {
      newHeaders['X-integration-test'] = lambdaTestKey;
    }
    return newHeaders;
  } catch (error) {
    return headers;
  }
};

/**
 * Returns the CRA eligibility link based on the application language
 * @param {string} applicationLanguage - The language of the application (e.g., 'fr-CA' or 'en-CA')
 */
export const getCraEligibilityLink = (applicationLanguage: string): string => {
  if (applicationLanguage === LOCALE.FR_CA) {
    return 'https://www.canada.ca/fr/services/prestations/dentaire/regime-soins-dentaires/admissibilite.html';
  }
  return 'https://www.canada.ca/en/services/benefits/dental/dental-care-plan/qualify.html';
};

/**
 * This function will return true if the social sign on feature is enabled
 * It will check Cypress environment variable and the tenant flag
 */
export const isSocialSignOnFeatureEnabled = () => {
  if (typeof Cypress !== 'undefined') {
    const cypressValue = Cypress.env('PM_ENABLE_SOCIAL_SIGN_ON');
    return (
      (cypressValue === '1' ||
        cypressValue === 'true' ||
        cypressValue === 'True' ||
        cypressValue === 'TRUE' ||
        cypressValue === true) &&
      hasFlag(TENANT_FLAGS.ENABLE_SOCIAL_SIGN_ON)
    );
  }

  return hasFlag(TENANT_FLAGS.ENABLE_SOCIAL_SIGN_ON);
};

export const getCoverageFitOptionsFromState = (state: State) => {
  const underwritingMethod = state.primary.hdApp.underwriting_method;
  const hasPartnerApplication = state.userControl.hasPartnerApplication;
  return getCoverageFitOptions(
    underwritingMethod,
    hasPartnerApplication,
  );
};

export const getCoverageFitOptions = (
  underwritingMethod: string,
  hasPartnerApplication: boolean,
) => {
  const tenantCode = getTenant().code;
  const plansData = HD_PLANS_DATA[tenantCode][underwritingMethod];
  const plansList = Object.keys(plansData).map((planType) => plansData[planType]);
  const availableCategories = getCategoriesFromPlans(plansList);

  return COVERAGE_FIT_OPTIONS_TEXT_MAPPING.filter(
    option => availableCategories.includes(COVERAGE_FIT_PLAN_CATEGORY_MAPPING[option.value]),
  ).map(option => ({
    text: hasPartnerApplication ? option.jointText : option.singleText,
    value: option.value,
  }));
};

export const shouldShowCoverageFitPage = (
  underwritingMethod: string,
  hasPartnerApplication: boolean,
) => {
  const options = getCoverageFitOptions(underwritingMethod, hasPartnerApplication);
  return options.length > 1;
};

export const isCSPolicyMeEmailModifier = (email: string): boolean => {
  const csEmailSubstring = 'cs-email';
  return email.includes(csEmailSubstring) && isPolicyMeEmail(email);
};

// Life-specific email modifiers removed for HD-only webapp
export const isGILifePolicyMeEmailModifier = (_modifier: string, _email: string): boolean => false;
export const isSelectProdEmailModifier = (_email: string): boolean => false;
