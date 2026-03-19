import { LOCALE } from '@policyme/global-libjs-utils';

const locales = Object.values(LOCALE);

const messages = {};

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: LOCALE.EN_CA,
  locales,
  messages,
  formats,
};
