import { LOCALE } from '@policyme/global-libjs-utils';

export type LOCALE_TYPE = (typeof LOCALE)[keyof typeof LOCALE];

export interface ExpectedConsentCopy {
  primary: ExpectedConsentCopyValues,
  joint: ExpectedConsentCopyValues,
}

export interface ExpectedConsentCopyValues {
  version: string;
  text: Record<LOCALE_TYPE, string[]>;
}

export interface ExpectedConsentCTAValues {
  version: string;
  text: Record<LOCALE_TYPE, string>;
}
export interface ExpectedConsentCTA {
  primary: ExpectedConsentCTAValues,
  joint: ExpectedConsentCTAValues,
}
