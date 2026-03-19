import moment from 'moment';
import { FormatDateOptions, FormatNumberOptions, createIntl, createIntlCache } from 'react-intl';
import { LOCALE } from '@policyme/global-libjs-utils';
import enMessages from '../../lang/en_CA.json';
import frMessages from '../../lang/fr_CA.json';

// This is optional but highly recommended
// since it prevents memory leak
// https://formatjs.io/docs/react-intl/api/#createintl
const cache = createIntlCache();

const frIntl = createIntl({
  locale: LOCALE.FR_CA,
  messages: {},
}, cache);

export const getEnglishMessageWithId = (id) => {
  return enMessages[id] || '';
};

export const getFrenchCanadianMessageWithId = (id) => {
  return frMessages[id] || '';
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options
export const formatCurrencyWithoutDecimalsConfig:FormatNumberOptions = { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0, currencyDisplay: 'narrowSymbol' };

export const formatCurrencyConfig:FormatNumberOptions = { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol' };

// 987654321 => 988M, 100000 => 100K
export const formatCurrencyWithNotationsConfig:FormatNumberOptions = { style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol', notation: 'compact', compactDisplay: 'short' };

export const formatDateShortConfig:FormatDateOptions = { month: 'long', day: 'numeric' };
export const formatDateWithYearConfig:FormatDateOptions = { month: 'long', day: 'numeric', year: 'numeric' };
export const formatDateWithYearShortConfig:FormatDateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
export const momentDateFormatWithYear = 'MMMM Do, YYYY';
export const momentDateFormatWithYearShortMonth = 'MMM Do, YYYY';
export const momentDateFormatWithoutYear = 'MMMM Do';

export const formatDateByLocale = (
  locale, date = new Date(), dateConfig = formatDateShortConfig,
  momentDateFormat = momentDateFormatWithYear,
) => {
  if (locale === LOCALE.FR_CA) {
    const formattedDate = frIntl.formatDate(date, dateConfig);
    if (date.getDate() === 1) {
      // 1st of each month should have er appended in French (1er janvier)
      return formattedDate.replace('1', '1er');
    }
    return formattedDate;
  }

  // For en-CA, we still use moment because intl does not support adding the ordinal suffix (-th)
  if (dateConfig.year) {
    return moment(date).format(momentDateFormat);
  }
  return moment(date).format(momentDateFormatWithoutYear);
};
