import { getUrls } from '@policyme/global-libjs-utils';
import contestMetadata from '../config/contestMetadata';
import { PM_PRODUCT_PREFIX } from '../utils/const';
import { genderToShorthand } from '../utils/helpers';
import { TERMS } from '../constants/session';
import { getMainProduct } from './helpers/productApp';

const showQuotesToast = (state) => {
  const { utm_source, utm_campaign } = state.metadata;
  return contestMetadata[utm_source] && contestMetadata[utm_source][utm_campaign];
};

const getQuotesToastData = (state) => {
  const { utm_source, utm_campaign } = state.metadata;
  if (contestMetadata[utm_source] && contestMetadata[utm_source][utm_campaign]) {
    return contestMetadata[utm_source][utm_campaign];
  }
  return {};
};

// Life-specific: always false in HD-only webapp
const isPermanentInsurance = (_state) => {
  return false;
};

// Life-specific secondary link removed for HD-only webapp
const getSecondaryLink = (_state) => {
  return '';
};

const showApprovedResources = (state) => {
  return isApprovedPage(state.metadata.currRoute);
};

const showApplicationResources = (state) => {
  return isApplicationPage(state.metadata.currRoute);
};

const isApprovedPage = (pathname) => {
  return pathname.includes('approved');
};

const isApplicationPage = (pathname) => {
  return pathname.includes('application');
};

const isDisclosureIntegrationPage = (pathname) => {
  const diclsoureIntegrationRegex = /.*\/disclosure-integration\/[0-9]+/;
  const partnerDisclosureIntegrationRegex = /.*\/partner-disclosure-integration\/[0-9]+/;
  return diclsoureIntegrationRegex.test(pathname) ||
    partnerDisclosureIntegrationRegex.test(pathname);
};

const isReviewEsignCompleted = (state, userType) => {
  return state.metadata[`${userType}ReviewEsignCompleted`];
};

const getPreAppMainProduct = (state) => {
  // If this is used inside metadata reducer, the state object is limited to only the metadata state
  // there is no state.metadata => we have to directly access state.preAppMainProduct
  return state.metadata ? state.metadata.preAppMainProduct : state.preAppMainProduct;
};

const getABTestBand = (state) => {
  return state.metadata.abTestBand;
};

const areAnalyticsBlocked = (state) => {
  return state.metadata.segmentBlocked;
};

/**
 * AB_TEST_87 Quotes Copilot: whether the CI product toggle is on.
 * Uses a dedicated Redux flag (not product_added). Defaults to true when unset.
 */
const getQuotesCopilotCiProductToggleSelected = (state) => {
  return state.metadata.quotesCopilotCiProductToggleSelected !== false;
};

export {
  showQuotesToast,
  getQuotesToastData,
  getSecondaryLink,
  showApprovedResources,
  isDisclosureIntegrationPage,
  isApplicationPage,
  isApprovedPage,
  showApplicationResources,
  isReviewEsignCompleted,
  getPreAppMainProduct,
  isPermanentInsurance,
  getABTestBand,
  areAnalyticsBlocked,
  getQuotesCopilotCiProductToggleSelected,
};
