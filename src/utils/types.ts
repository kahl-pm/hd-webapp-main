import { LOCALE } from '@policyme/global-libjs-utils';
import { BUYING_METHOD, PM_PRODUCT_PREFIX } from './const';

export type BUYING_METHOD_TYPE = keyof typeof BUYING_METHOD;

export interface ExclusionItem {
  code: string,
  description: string,
  exclusion_id: number,
  type: string,
}

export interface AgeRange {
  min: number;
  max: number;
}

export type ProductSpecificAgeLimit = {
  [key in typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX]]?: AgeRange;
}

export type Enum<T> = T[keyof T];

export type LocaleType = typeof LOCALE[keyof typeof LOCALE];
