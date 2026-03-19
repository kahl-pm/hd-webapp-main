import { getPublicKey, encodeEnvVar, is_flag_enabled } from '@policyme/global-libjs-utils';
import { PUBLIC_KEYS } from './tenant/consts';
import { getFromEnvironment } from './utils/environmentHelpers';

export const PM_ONDEMAND_ENV = process.env.PM_ONDEMAND_ENV;

export function getSubdomain(env) {
  let subdomain = env;
  if (env === 'prod') {
    subdomain = 'www';
  } else if (env === 'test' && PM_ONDEMAND_ENV) {
    subdomain = `${PM_ONDEMAND_ENV.toLowerCase()}.ondemand`;
  }

  return subdomain;
}

export const RELEASE_VERSION = process.env.RELEASE_VERSION;

function isRelativeApiUrlOrUndefined(path: string): boolean {
  return /^\/api\//.test(path) || !path;
}

let hd_main_endpoint = getFromEnvironment('PM_HD_MAIN_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(hd_main_endpoint)) {
  hd_main_endpoint = 'https://test.policyme.com/api/hd-main/v1';
}
// export const HD_MAIN_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.HD_RESTAPI_MAIN}/api/hd-main/v1`;
export const HD_MAIN_ENDPOINT = hd_main_endpoint;

let hd_main_base_endpoint = getFromEnvironment('PM_HD_MAIN_BASE_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(hd_main_base_endpoint)) {
  hd_main_base_endpoint = 'https://test.policyme.com/api/hd-main';
}
export const HD_MAIN_BASE_ENDPOINT = hd_main_base_endpoint;

let hd_quotes_endpoint = getFromEnvironment('PM_HD_QUOTES_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(hd_quotes_endpoint)) {
  hd_quotes_endpoint = 'https://test.policyme.com/api/hd-quotes/v1';
}
// export const HD_QUOTES_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.HD_RESTAPI_QUOTES}/api/hd-quotes/v1`;
export const HD_QUOTES_ENDPOINT = hd_quotes_endpoint;

let global_main_endpoint = getFromEnvironment('PM_GLOBAL_MAIN_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(global_main_endpoint)) {
  global_main_endpoint = 'https://test.policyme.com/api/global-main/v1';
}
// export const GLOBAL_MAIN_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.GLOBAL_RESTAPI_MAIN}/api/global-main/v1`;
export const GLOBAL_MAIN_ENDPOINT = global_main_endpoint;

let global_main_base_endpoint = getFromEnvironment('PM_GLOBAL_MAIN_BASE_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(global_main_base_endpoint)) {
  global_main_base_endpoint = 'https://test.policyme.com/api/global-main';
}
export const GLOBAL_MAIN_BASE_ENDPOINT = global_main_base_endpoint;

let aura_endpoint = getFromEnvironment('PM_AURA_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(aura_endpoint)) {
  aura_endpoint = 'https://test.policyme.com/api/aura/v1';
}
// export const AURA_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.LIFE_RESTAPI_AURA}/api/aura/v1`;
export const AURA_ENDPOINT = aura_endpoint;

let docusign_endpoint = getFromEnvironment('PM_DOCUSIGN_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(docusign_endpoint)) {
  docusign_endpoint = 'https://test.policyme.com/api/global-docusign/v1';
}
// export const DOCUSIGN_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.GLOBAL_RESTAPI_DOCUSIGN}/api/global-docusign/v1`;
export const DOCUSIGN_ENDPOINT = docusign_endpoint;

let analytics_endpoint = getFromEnvironment('PM_ANALYTICS_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(analytics_endpoint)) {
  analytics_endpoint = 'https://test.policyme.com/api/global-analytics/v1';
}
export const ANALYTICS_ENDPOINT = analytics_endpoint;

let accounts_endpoint = getFromEnvironment('PM_ACCOUNTS_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(accounts_endpoint)) {
  accounts_endpoint = 'https://test.policyme.com/api/global-accounts/v1';
}
// export const ACCOUNTS_ENDPOINT = `http://127.0.0.1:${LOCAL_PORT_MAPPING.GLOBAL_RESTAPI_ACCOUNTS}/api/global-accounts/v1`;
export const ACCOUNTS_ENDPOINT = accounts_endpoint;

let accounts_base_endpoint = getFromEnvironment('PM_ACCOUNTS_BASE_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(accounts_base_endpoint)) {
  accounts_base_endpoint = 'https://test.policyme.com/api/global-accounts';
}
export const ACCOUNTS_BASE_ENDPOINT = accounts_base_endpoint;

let payments_endpoint = getFromEnvironment('PM_PAYMENTS_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(payments_endpoint)) {
  payments_endpoint = 'https://test.policyme.com/api/global-payments/v1';
}
export const PAYMENTS_ENDPOINT = payments_endpoint;

let documents_endpoint = getFromEnvironment('PM_DOCUMENTS_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(documents_endpoint)) {
  documents_endpoint = 'https://test.policyme.com/api/global-documents/v1';
}
export const DOCUMENTS_ENDPOINT = documents_endpoint;

let hd_documents_endpoint = getFromEnvironment('PM_HD_DOCUMENTS_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(hd_documents_endpoint)) {
  hd_documents_endpoint = 'https://test.policyme.com/api/hd-documents/v1';
}
export const HD_DOCUMENTS_ENDPOINT = hd_documents_endpoint;

let hbm_endpoint = getFromEnvironment('PM_HBM_ENDPOINT');
if (process.env.NODE_ENV !== 'production' && isRelativeApiUrlOrUndefined(hbm_endpoint)) {
  hbm_endpoint = 'https://test.policyme.com/api/global-hbm/v1';
}
export const HBM_ENDPOINT = hbm_endpoint;

let pm_env = getFromEnvironment('PM_ENVIRONMENT');
if (!pm_env) {
  pm_env = 'dev';
}
export const PM_ENVIRONMENT = pm_env;

export const SUBDOMAIN = getSubdomain(PM_ENVIRONMENT);

export const GLOBAL_ROUTE = process.env.GLOBAL_ROUTE;

export const HOMEPAGE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000' : `https://${SUBDOMAIN}.policyme.com`;

let webapp_account_url = getFromEnvironment('PM_WEBAPP_ACCOUNT_URL');
if (!webapp_account_url) {
  webapp_account_url = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001' : `https://accounts.test.policyme.com`;
}

export const WEBAPP_ACCOUNT_URL = webapp_account_url;

export const APP_URL = `${HOMEPAGE_URL}${GLOBAL_ROUTE}`;

export const FACEBOOK_PIXEL = getPublicKey(encodeEnvVar(PUBLIC_KEYS.FACEBOOK))
  || process.env.PM_FACEBOOK_PIXEL;

export const SENTRY_DSK = getFromEnvironment('SENTRY_DSK');

export const APP_ENV = getFromEnvironment('PM_ENVIRONMENT');

let send_email_flag;
if (APP_ENV === 'dev') {
  send_email_flag = false;
} else if (APP_ENV === 'staging') {
  send_email_flag = false;
} else if (APP_ENV === 'prod') {
  send_email_flag = true;
} else {
  console.log('ERROR: NO ENV LOCATED', APP_ENV);
}

export const SEND_EMAIL_FLAG = send_email_flag;

// https://docs.sentry.io/platforms/python/configuration/sampling/
// send sample of errors to Sentry, set the sample_rate to a
// number between 0 (0% of errors sent) and 1 (100% of errors sent).
// This is a static rate, which will apply equally to all errors.
export const SENTRY_SAMPLE_RATE = 1;

// https://docs.sentry.io/platforms/python/configuration/sampling/
// can be used to sample different transactions at different rates
// and can be used to filter out some transactions entirely
let sentry_trace_sample_rate;
if (process.env.SENTRY_TRACE_SAMPLE_RATE) {
  sentry_trace_sample_rate = process.env.SENTRY_TRACE_SAMPLE_RATE;
} else {
  sentry_trace_sample_rate = 0;
}

let pm_demo_env = getFromEnvironment('PM_DEMO_ENV');
export const PM_DEMO_ENV = pm_demo_env;

export const SENTRY_TRACE_SAMPLE_RATE = sentry_trace_sample_rate;

export const PM_ENABLE_SENTRY_SESSION_REPLAY = is_flag_enabled(process.env.PM_ENABLE_SENTRY_SESSION_REPLAY);

export const DOCUSIGN_NO_MEDICAL_POWERFORM_URL = process.env.PM_DOCUSIGN_NO_MEDICAL_POWERFORM_URL;

export const PM_ENABLE_DEFAULT_MONTHLY_PAYMENT = process.env.PM_ENABLE_DEFAULT_MONTHLY_PAYMENT;

export const PM_ENABLE_PM_HD = process.env.PM_ENABLE_PM_HD;

export const PM_ENABLE_HD = process.env.PM_ENABLE_HD;

export const PM_ENABLE_FULLY_UW_HD = process.env.PM_ENABLE_FULLY_UW_HD;

export const PM_ENABLE_ACCOUNT_DASHBOARD = process.env.PM_ENABLE_ACCOUNT_DASHBOARD;

// need both PM_SKIP_MAGIC_LINK and CLIENT_SKIP_MAGIC_LINK_KEY to skip magic link locally
// '1' to skip magic link locally
export const PM_SKIP_MAGIC_LINK = process.env.PM_SKIP_MAGIC_LINK;
// (uuid) to skip magic link locally - check secrets manager
export const CLIENT_SKIP_MAGIC_LINK_KEY = process.env[`${encodeEnvVar('CLIENT_SKIP_MAGIC_LINK_KEY')}`];

export const CLIENT_INTEGRATION_TEST_KEY = process.env[`${encodeEnvVar('CLIENT_INTEGRATION_TEST_KEY')}`];

export const PM_ENABLE_THEMES = process.env.PM_ENABLE_THEMES;

export const PM_ENABLE_QUEBEC_PRODUCT = process.env.PM_ENABLE_QUEBEC_PRODUCT;

export const COPY_STATE_ENDPOINT = '/v1/copy_state/jira';

export const JIRA_RESOURCES_ENDPOINT = 'https://api.atlassian.com/oauth/token/accessible-resources';

export const PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS = process.env.PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS;

// Please do not use process.env for reading environment variables.
// Use getFromEnvironment function instead.
// The config above should probably be updated

export const PM_ENABLE_DECLARATIVE_JOURNEYS = getFromEnvironment('PM_ENABLE_DECLARATIVE_JOURNEYS');

export const PM_DEBUG_JOURNEYS = getFromEnvironment('PM_DEBUG_JOURNEYS');

export const PM_ENABLE_GROUP_HD_CAA = getFromEnvironment('PM_ENABLE_GROUP_HD_CAA');

export const PM_ENABLE_DOCUMENTS_MICROSERVICE = getFromEnvironment('PM_ENABLE_DOCUMENTS_MICROSERVICE');
// This is a temporary flag to enable the September 2025 promo to be added to apps
export const PM_ENABLE_SEPT2025_PROMO = getFromEnvironment('PM_ENABLE_SEPT2025_PROMO');
// This is a temporary flag to enable the countdown timer UI for the September 2025 promo
export const PM_ENABLE_SEPT2025_COUNTDOWN_TIMER = getFromEnvironment('PM_ENABLE_SEPT2025_COUNTDOWN_TIMER');

// CRO-1511: This is one day after the release date of the BCL trustee release in prod
// We need this to determine if the BCL user had an inprogress policy before we released this
// trustee feature
export const BCL_TRUSTEE_RELEASE_DATE = '27/03/2025';

let devops_endpoint;
if (process.env.PM_DEVOPS_ENDPOINT) {
  devops_endpoint = getFromEnvironment('PM_DEVOPS_ENDPOINT');
} else if (typeof window !== 'undefined') {
  devops_endpoint = window.location.origin;
} else {
  devops_endpoint = 'https://test.policyme.com';
}
export const PM_DEVOPS_ENDPOINT = devops_endpoint;

// Environment variable to enable tracking of undefined country/province changes
export const PM_TRACK_UNSET_ADDRESS = getFromEnvironment('PM_TRACK_UNSET_ADDRESS');
