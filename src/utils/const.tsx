import React, { ReactElement } from 'react'; // Needed for JSX
import moment from 'moment';
import { defineMessages, FormattedMessage } from 'react-intl';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import {
  getUrls,
  HD_PLAN_TYPES_CATEGORIES,
  LOCALE,
  TENANT_USER_LEAD_SOURCES,
  TENANTS_NAME_CODES_MAPPING,
} from '@policyme/global-libjs-utils';
import { Link, Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { AgeRange, LocaleType, ProductSpecificAgeLimit } from './types';

export const ROUTE_SECTIONS = {
  QUESTIONS: '/questions',
  APPLICATION: '/application',
  DOCUSIGN: '/docusign',
  EAPP: '/eapp',
  UNDERWRITER: '/underwriter',
  APPROVED: '/approved',
  DEBUG: '/debug',
};
// NOTE:
// if you add a *new* route here, you need to also update the isBack()
// function in Reducer/metadata.js
export const ROUTES = {
  GETTING_STARTED: '/',
  FAMILY: '/:product/family',
  USER_INTENT: '/:product/intent',
  USER_INTENT2: '/:product/intentv2',
  GROUP_BENEFITS: '/:product/group-benefits',
  EXISTING_COVERAGE_HD: '/:product/existing-hd-coverage',
  COVER_PRESCRIPTIONS: '/:product/cover-prescriptions',
  PRESCRIPTION_DRUGS: '/:product/prescription-drugs',
  QUESTIONS_INTRO: '/questions/intro',
  QUESTIONS_PARTNER: '/questions/partner',
  QUESTIONS_KIDS: '/questions/kids',
  QUESTIONS_KIDS_HOUSING: '/questions/kids-housing',
  QUESTIONS_KIDS_EDUCATION: '/questions/kids-education',
  QUESTIONS_BIRTHDATE: '/questions/birthdate',
  QUESTIONS_GENDER: '/questions/gender',
  QUESTIONS_SMOKE: '/questions/smoke',
  QUESTIONS_HEALTH: '/questions/health',
  QUESTIONS_INCOME: '/questions/income',
  QUESTIONS_RESIDENCE: '/questions/residence',
  QUESTIONS_EXISTING_POLICIES: '/questions/existing-policies',
  QUESTIONS_EXISTING_COVERAGE: '/questions/existing-coverage',
  QUESTIONS_SAVINGS: '/questions/savings',
  QUESTIONS_DEBTS: '/questions/debts',
  QUESTIONS_EXPENSES: '/questions/expenses',
  QUESTIONS_EMAIL: '/questions/email',
  RECOMMENDATION: '/recommendation',
  QUOTES_ADVICE: '/:product/quotes',
  QUOTES_COMPARE: '/:product/life-insurance-quotes',
  QUOTES_COMPARE_CONTINUED: '/:product/life-insurance-quotes-continued',
  MORTGAGE_QUOTES: '/mortgage-quotes',
  CAA_MEMBER: '/:product/caa-member',
  CAA_MEMBER_ADVICE_JOURNEY: '/:product/caa-member-advice',
  FOLLOWUP: '/followup',
  PARTNERFOLLOWUP: '/partner-followup',
  NOT_FOUND: '/not-found',
  JIRA_LOGIN: '/jira-login',
  DECISION_DASHBOARD_PAGE: '/decision-dashboard',
  DECISION_DASHBOARD_CALLBACK: '/decision-dashboard/callback',
  START_APP: '/:product/start-app',
  KEEP_EXISTING_APP: '/keep-existing-application',
  APPLICATION_CITIZENSHIP: '/application/citizenship',
  APPLICATION_BIRTH_LOCATION: '/application/birth-location',
  APPLICATION_BASIC_DETAILS: '/application/basic-details',
  APPLICATION_FULL_ADDRESS: '/application/:userType/full-address',
  AIRMILES_COLLECTOR_PAGE: '/application/airmiles-number',
  APPLICATION_EMPLOYMENT_INCOME_ANNUAL: '/application/employment-income-annual',
  APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF: '/application/employment-income-annual-self',
  APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER: '/application/employment-income-annual-partner',
  APPLICATION_FINANCES: '/application/finances',
  APPLICATION_EXISTING_POLICIES: '/application/existing-policies',
  APPLICATION_REPLACE_EXISTING_POLICIES: '/application/replace-existing-policies',
  APPLICATION_PENDING_POLICIES: '/application/pending-policies',
  APPLICATION_PRIMARY_TRANSITION: '/application/primary-transition',
  APPLICATION_COMMON_PRIMARY_BENEFICIARIES: '/application/common-primary-beneficiaries',
  APPLICATION_COMMON_SECONDARY_BENEFICIARIES: '/application/common-secondary-beneficiaries',
  APPLICATION_PRIMARY_BENEFICIARIES: '/application/:userType/primary-beneficiaries',
  APPLICATION_SECONDARY_BENEFICIARIES: '/application/:userType/secondary-beneficiaries',
  APPLICATION_TRUSTEE: '/application/:userType/trustee',
  APPLICATION_PARTNER_EMAIL: '/application/partner-email',
  APPLICATION_PARTNER_INFO: '/application/partner-info',
  APPLICATION_PARTNER_SAME_ADDRESS: '/application/partner-same-address',
  APPLICATION_CELL_PHONE: '/application/contact',
  APPLICATION_REFERRER: '/application/referrer',
  APPLICATION_INTEREST: '/application/interest',
  APPLICATION_BEGIN_DISCLOSURE: '/application/:userType/begin-disclosure',
  APPLICATION_DISCLOSURE_INTEGRATION: '/application/:userType/disclosure-integration/:id',
  APPLICATION_PARTNER_DISCLOSURE_INTEGRATION: '/application/partner-disclosure-integration/:id',
  APPLICATION_CONSENT: '/application/consent',
  // TODO: replace route prefix of debug when finsihing routing
  AURA_START_ERROR: '/aura-start-error',
  DOCUSIGN_APPLICATION_CALLBACK: '/docusign/application/:userType/callback',
  DOCUSIGN_APPLICATION_GET_LINK: '/docusign/application/get-link',
  DOCUSIGN_APPLICATION_GET_FAILED: '/docusign/application/error',
  POLICY_GET_LINK_SMS: '/policy/get-link/sms/id/:id/short/:url_short',
  POLICY_GET_LINK_EMAIL: '/policy/get-link/email/id/:id/short/:url_short',
  POLICY_GET_LINK_UNSUCCESSFUL: '/policy/get-link/unsuccessful',
  POLICY_GET_LINK_NOT_FOUND: '/policy/get-link/not-found',
  POLICY_OTP_ENTER: '/policy/access-code',
  POLICY_OTP_EXPIRED: '/policy/access-code/expired',
  POLICY_OTP_UNSUCCESSFUL: '/policy/access-code/unsuccessful',
  PAYMENT_IN_PROGRESS: '/approved/:userType/payment-in-progress',
  PAYMENT_RECEIVED: '/approved/:userType/payment-received',
  APPROVED: '/approved',
  APPROVED_COMMON_PRIMARY_BENEFICIARIES: '/approved/:userType/common-primary-beneficiaries',
  APPROVED_COMMON_SECONDARY_BENEFICIARIES: '/approved/:userType/common-secondary-beneficiaries',
  APPROVED_PRIMARY_BENEFICIARIES: '/approved/:userType/primary-beneficiaries',
  APPROVED_SECONDARY_BENEFICIARIES: '/approved/:userType/secondary-beneficiaries',
  APPROVED_REVIEW_ESIGN_POLICY: '/approved/:userType/review-esign-policy',
  APPROVED_CI_CROSS_SELL: '/approved/:userType/ci-add-on',
  APPROVED_PAYMENT_PLANS: '/approved/:userType/payment-plans',
  APPROVED_PAYMENT_FORM: '/approved/:userType/payment-form',
  APPROVED_EFFECTIVE_DATE: '/approved/:userType/effective-date',
  APPROVED_THANK_YOU: '/approved/:userType/thankyou',
  POLICY_DOWNLOAD_GET_LINK_SMS: '/policy-download/get-link/sms/id/:id/short/:url_short',
  POLICY_DOWNLOAD_GET_LINK_UNSUCCESSFUL: '/policy-download/get-link/unsuccessful',
  POLICY_DOWNLOAD_GET_LINK_NOT_FOUND: '/policy-download/get-link/not-found',
  POLICY_DOWNLOAD_OTP_ENTER: '/policy-download/access-code',
  POLICY_DOWNLOAD_OTP_EXPIRED: '/policy-download/access-code/expired',
  POLICY_DOWNLOAD_OTP_UNSUCCESSFUL: '/policy-download/access-code/unsuccessful',
  POLICY_DOWNLOAD_DOWNLOAD_PAGE: '/policy-download/download',
  POLICY_DOWNLOAD_CALLBACK: '/policy-download/:userType/callback',
  POLICY_DOWNLOAD_RETURN_PAGE: '/policy-download/return',
  VERIFICATION: '/verification',
  VERIFICATION_ERROR: '/verification-error/:errorType',
  SKIP_MAGIC_LINK_CALLBACK: '/magic-link/callback',
  MAGIC_LINK_AUTH_CALLBACK: '/magic-link-auth/callback',
  TWO_FACTOR_VERIFICATION_CODE: '/two-factor/verification',
  TWO_FACTOR_MAX_ATTEMPTS: '/two-factor/max-attempts',
  DIGITAL_CONSENT_DASHBOARD_PAGE: '/digital-consent',
  OTP_VERIFICATION: '/otp-verification',
  COMBINED_CHECKOUT_HD: '/combined-checkout-hd',
  COVERAGE_FIT_QUESTION: '/:product/coverage-fit-question',
  FAMILY_COMPOSITION: '/:product/family-composition',
  HOUSEHOLD_INCOME: '/:product/household-income',
};

export const ACCOUNT_ROUTES = {
  POLICIES: '/account/policies',
};

export const ROUTE_REGEX = {
  EAPP_START_SIGN: /\/eapp\/get-link\/(email|sms)\/application\/[^\\].*\/short\/[^\\].*\/start-sign/,
  EAPP_GET_LINK: /\/eapp\/get-link\/(sms|email)\/application\/[^\\].*\/short\/[^\\].*/,
  APPLICATION_DISCLOSURE_INTEGRATION: /\/application\/.*\/disclosure-integration\/.*/,
  POLICY_GET_LINK: /\/policy\/get-link\/(sms|email)\/id\/[^\\].*\/short\/[^\\].*/,
  DOWNLOAD_POLICY_GET_LINK: /\/policy-download\/get-link\/(sms|email)\/id\/[^\\].*\/short\/[^\\].*/,
  APPLICATION_FULL_ADDRESS: /\/application\/.*\/full-address/,
  APPLICATION_PRIMARY_BENEFICIARIES: /\/application\/.*\/primary-beneficiaries/,
  APPLICATION_SECONDARY_BENEFICIARIES: /\/application\/.*\/secondary-beneficiaries/,
  APPLICATION_TRUSTEE: /\/application\/.*\/trustee/,
  ALL_APPROVED_PAGES: /\/approved\/.*\/.*/,
  DOCUSIGN_APPLICATION_CALLBACK: /\/docusign\/application\/.*\/callback.*/,
  POLICY_DOWNLOAD_CALLBACK: /\/policy-download\/.*\/callback.*/,
  QUESTIONS: /\/questions\/.*/,
  APPLICATION_BEGIN_DISCLOSURE: /\/application\/.*\/begin-disclosure/,
};

export const ROUTES_ORDER = {
  [ROUTES.GETTING_STARTED]: 1,
  [ROUTES.QUESTIONS_INTRO]: 2,
  [ROUTES.FAMILY]: 3, // TODO: confirm order
  [ROUTES.USER_INTENT]: 3, // AB test
  [ROUTES.QUESTIONS_PARTNER]: 3,
  [ROUTES.QUESTIONS_KIDS]: 4,
  [ROUTES.QUESTIONS_KIDS_HOUSING]: 5,
  [ROUTES.QUESTIONS_KIDS_EDUCATION]: 6,
  [ROUTES.QUESTIONS_BIRTHDATE]: 7,
  [ROUTES.QUESTIONS_GENDER]: 8,
  [ROUTES.QUESTIONS_SMOKE]: 9,
  [ROUTES.QUESTIONS_HEALTH]: 10,
  [ROUTES.QUESTIONS_INCOME]: 11,
  [ROUTES.QUESTIONS_RESIDENCE]: 12,
  [ROUTES.QUESTIONS_EXISTING_POLICIES]: 13,
  [ROUTES.QUESTIONS_EXISTING_COVERAGE]: 14,
  [ROUTES.QUESTIONS_SAVINGS]: 15,
  [ROUTES.QUESTIONS_DEBTS]: 16,
  [ROUTES.QUESTIONS_EMAIL]: 18,
  [ROUTES.QUOTES_ADVICE]: 20,
  [ROUTES.QUOTES_COMPARE]: 21,
  [ROUTES.CAA_MEMBER]: 22,
  [ROUTES.QUOTES_COMPARE_CONTINUED]: 23,
  [ROUTES.MORTGAGE_QUOTES]: 24,
  [ROUTES.START_APP]: 25,
  [ROUTES.APPLICATION_CITIZENSHIP]: 26,
  [ROUTES.APPLICATION_BIRTH_LOCATION]: 31,
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL]: 34,
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF]: 35,
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER]: 36,
  [ROUTES.APPLICATION_EXISTING_POLICIES]: 43,
  [ROUTES.APPLICATION_REPLACE_EXISTING_POLICIES]: 44,
  [ROUTES.APPLICATION_PENDING_POLICIES]: 45,
  [ROUTES.APPLICATION_BASIC_DETAILS]: 50,
  [ROUTES.APPLICATION_FULL_ADDRESS.replace(':userType', 'primary')]: 64,
  [ROUTES.APPLICATION_PARTNER_SAME_ADDRESS]: 65,
  [ROUTES.APPLICATION_FULL_ADDRESS.replace(':userType', 'secondary')]: 66,
  [ROUTES.APPLICATION_CELL_PHONE]: 67,
  [ROUTES.APPLICATION_PARTNER_EMAIL]: 68,
  [ROUTES.APPLICATION_PARTNER_INFO]: 68,
  [ROUTES.APPLICATION_DISCLOSURE_INTEGRATION]: 69,
  [ROUTES.APPLICATION_REFERRER]: 75,
  [ROUTES.APPLICATION_INTEREST]: 76,
  [ROUTES.APPLICATION_PRIMARY_TRANSITION]: 77,
  [ROUTES.APPLICATION_PARTNER_DISCLOSURE_INTEGRATION]: 78,
  [ROUTES.APPLICATION_CONSENT]: 79,
  [ROUTES.NOT_FOUND]: 1002,
  [ROUTES.DOCUSIGN_APPLICATION_CALLBACK]: 1003,
  [ROUTES.DOCUSIGN_APPLICATION_GET_LINK]: 1004,
  [ROUTES.DOCUSIGN_APPLICATION_GET_FAILED]: 1005,
  [ROUTES.POLICY_GET_LINK_SMS]: 1012,
  [ROUTES.POLICY_GET_LINK_EMAIL]: 1013,
  [ROUTES.POLICY_GET_LINK_UNSUCCESSFUL]: 1014,
  [ROUTES.POLICY_OTP_ENTER]: 1015,
  [ROUTES.POLICY_OTP_EXPIRED]: 1016,
  [ROUTES.POLICY_OTP_UNSUCCESSFUL]: 1017,
  [ROUTES.POLICY_DOWNLOAD_GET_LINK_SMS]: 1018,
  [ROUTES.POLICY_DOWNLOAD_GET_LINK_UNSUCCESSFUL]: 1019,
  [ROUTES.POLICY_DOWNLOAD_OTP_UNSUCCESSFUL]: 1020,
  [ROUTES.POLICY_DOWNLOAD_OTP_ENTER]: 1021,
  [ROUTES.POLICY_DOWNLOAD_OTP_EXPIRED]: 1022,
  // TODO: NP2 - Add the route orders at the end to prevent multiple conflicts when merging the
  // various pieces of work
  // Employemnt Income Annual Self
  // Employment Income Annual Partner
};

// Life/CI beneficiary routes removed for HD-only webapp
export const APPROVED_BENEFICIARY_ROUTES = [];

export const APPROVED_PAYMENT_ROUTES = [
  ROUTES.APPROVED_EFFECTIVE_DATE,
  ROUTES.APPROVED_PAYMENT_PLANS,
  ROUTES.APPROVED_PAYMENT_FORM,
  ROUTES.PAYMENT_RECEIVED,
];

export const PAGE_NAMES = {
  [ROUTES.GETTING_STARTED]: 'Landing',
  [ROUTES.FAMILY]: 'Family Composition Question',
  [ROUTES.USER_INTENT]: 'User Intent',
  [ROUTES.QUESTIONS_INTRO]: 'Intro',
  [ROUTES.QUESTIONS_PARTNER]: 'Partner',
  [ROUTES.QUESTIONS_KIDS]: 'Kids',
  [ROUTES.QUESTIONS_KIDS_HOUSING]: 'Kids Housing',
  [ROUTES.QUESTIONS_KIDS_EDUCATION]: 'Kids Education',
  [ROUTES.QUESTIONS_BIRTHDATE]: 'Date of Birth',
  [ROUTES.QUESTIONS_GENDER]: 'Gender',
  [ROUTES.QUESTIONS_SMOKE]: 'Smoker',
  [ROUTES.QUESTIONS_HEALTH]: 'Health',
  [ROUTES.QUESTIONS_INCOME]: 'Family Income',
  [ROUTES.QUESTIONS_RESIDENCE]: 'Residence',
  [ROUTES.QUESTIONS_EXISTING_POLICIES]: 'Existing Policies',
  [ROUTES.QUESTIONS_EXISTING_COVERAGE]: 'Existing Coverage',
  [ROUTES.QUESTIONS_SAVINGS]: 'Savings',
  [ROUTES.QUESTIONS_DEBTS]: 'Debts',
  [ROUTES.QUESTIONS_EMAIL]: 'Email',
  [ROUTES.QUOTES_ADVICE]: 'Quotes',
  [ROUTES.QUOTES_COMPARE]: 'Quotes Standalone',
  [ROUTES.MORTGAGE_QUOTES]: 'Mortgage Quotes',
  [ROUTES.QUOTES_COMPARE_CONTINUED]: 'Quotes Standalone Redesign',
  [ROUTES.CAA_MEMBER]: 'CAA Member',
  [ROUTES.GROUP_BENEFITS]: 'Group Benefits',
  [ROUTES.COVER_PRESCRIPTIONS]: 'Determine Plans',
  [ROUTES.PRESCRIPTION_DRUGS]: 'Prescription Drugs',
  [ROUTES.START_APP]: 'Start Application',
  [ROUTES.APPLICATION_PRIMARY_TRANSITION]: 'App Joint Same Time Transition',
  [ROUTES.APPLICATION_BIRTH_LOCATION]: 'App Birth Location',
  [ROUTES.APPLICATION_FULL_ADDRESS.replace(':userType', 'primary')]: 'App Full Address',
  [ROUTES.APPLICATION_FULL_ADDRESS.replace(':userType', 'secondary')]: 'Secondary User Address',
  [ROUTES.APPLICATION_PARTNER_SAME_ADDRESS]: 'App Living Together',
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL]: 'App Employment Income Annual',
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF]: 'App Employment Income Annual Self',
  [ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER]: 'App Employment Income Annual Partner',
  [ROUTES.APPLICATION_EXISTING_POLICIES]: 'App Existing Policies',
  [ROUTES.APPLICATION_REPLACE_EXISTING_POLICIES]: 'App Replacing Existing Policies',
  [ROUTES.APPLICATION_PENDING_POLICIES]: 'App Pending Policies',
  [ROUTES.APPLICATION_PRIMARY_TRANSITION]: 'App Primary User Transition',
  [ROUTES.APPLICATION_PARTNER_EMAIL]: 'App Partner Email',
  [ROUTES.APPLICATION_CELL_PHONE]: 'App Contact',
  [ROUTES.APPLICATION_REFERRER]: 'App Referrer',
  [ROUTES.APPLICATION_INTEREST]: 'App Interest',
  [ROUTES.NOT_FOUND]: 'Not Found',
  [ROUTES.DOCUSIGN_APPLICATION_CALLBACK]: 'Docusign Callback',
  [ROUTES.DOCUSIGN_APPLICATION_GET_LINK]: 'Docusign Loading URL',
  [ROUTES.DOCUSIGN_APPLICATION_GET_FAILED]: 'Docusign Error generating URL',
  [ROUTES.APPROVED_REVIEW_ESIGN_POLICY.replace(':userType', 'primary')]: 'Approved eSign Policy',
  [ROUTES.APPROVED_REVIEW_ESIGN_POLICY.replace(':userType', 'secondary')]: 'Secondary - Approved eSign Policy',
  [ROUTES.APPROVED_PAYMENT_PLANS.replace(':userType', 'primary')]: 'Approved Payment Plans',
  [ROUTES.APPROVED_PAYMENT_PLANS.replace(':userType', 'secondary')]: 'Secondary - Approved Payment Plans',
  [ROUTES.APPROVED_THANK_YOU.replace(':userType', 'primary')]: 'Approved Thank You',
  [ROUTES.APPROVED_THANK_YOU.replace(':userType', 'secondary')]: 'Secondary - Approved Thank You',
  [ROUTES.AURA_START_ERROR]: 'Aura Start Error Landing',
  [ROUTES.DECISION_DASHBOARD_PAGE]: 'Decision Dashboard',
  [ROUTES.APPLICATION_CITIZENSHIP]: 'App Citizenship',
  [ROUTES.APPLICATION_PARTNER_INFO]: 'App Partner Info',
  [ROUTES.APPLICATION_CONSENT]: 'App Consent',
  [ROUTES.POLICY_GET_LINK_UNSUCCESSFUL]: 'Policy get link Unsuccessful',
  [ROUTES.POLICY_GET_LINK_NOT_FOUND]: 'Policy get link Not Found',
  [ROUTES.POLICY_OTP_ENTER]: 'Policy Access Code',
  [ROUTES.POLICY_OTP_EXPIRED]: 'Policy Access Code Expired',
  [ROUTES.POLICY_OTP_UNSUCCESSFUL]: 'Policy Access Code Unsuccessful',
  [ROUTES.PAYMENT_RECEIVED.replace(':userType', 'primary')]: 'Payment Received',
  [ROUTES.PAYMENT_RECEIVED.replace(':userType', 'secondary')]: 'Secondary Payment Received',
  [ROUTES.APPROVED_PAYMENT_FORM.replace(':userType', 'primary')]: 'Approved Payment Form',
  [ROUTES.APPROVED_PAYMENT_FORM.replace(':userType', 'secondary')]: 'Secondary Approved Payment Form',
  [ROUTES.APPROVED_EFFECTIVE_DATE.replace(':userType', 'primary')]: 'Approved Effective Date',
  [ROUTES.APPROVED_EFFECTIVE_DATE.replace(':userType', 'secondary')]: 'Secondary Approved Effective Date',
  [ROUTES.POLICY_DOWNLOAD_GET_LINK_UNSUCCESSFUL]: 'Download get link Unsuccessful',
  [ROUTES.POLICY_DOWNLOAD_GET_LINK_NOT_FOUND]: 'Download get link Not Found',
  [ROUTES.POLICY_DOWNLOAD_OTP_ENTER]: 'Policy Download Access Code',
  [ROUTES.POLICY_DOWNLOAD_OTP_EXPIRED]: 'Policy Download Expired',
  [ROUTES.POLICY_DOWNLOAD_OTP_UNSUCCESSFUL]: 'Policy Download Unsuccessful',
  [ROUTES.POLICY_DOWNLOAD_DOWNLOAD_PAGE]: 'Download Page',
  [ROUTES.POLICY_DOWNLOAD_RETURN_PAGE]: 'Download Return Page',
  [ROUTES.DIGITAL_CONSENT_DASHBOARD_PAGE]: 'Digital Consent',
  [ROUTES.HOUSEHOLD_INCOME]: 'Household Income Page',
  [ROUTES.FAMILY_COMPOSITION]: 'Family Composition Page',
};

export const JOURNEY_START_PAGE_NAMES = [
  ROUTES.GETTING_STARTED,
  ROUTES.QUOTES_COMPARE,
];

export const TERM_LENGTHS = [
  0,
  10,
  20,
  65,
];

export const TERM_LENGTHS_REDESIGN = [
  10,
  15,
  20,
  25,
  30,
];

// export const TERM_DESCRIPTIONS = {
//   0: 'Unavailable',
//   10: '10 years',
//   15: '15 years',
//   20: '20 years',
//   25: '25 years',
//   30: '30 years',
//   65: 'to age 65',
// };

export const TERM_DESCRIPTIONS = {
  0: <FormattedMessage id="global.termDescriptions.unavailable.EV1Eqm" />,
  10: <FormattedMessage id="global.termDescriptions.numYears.Cgmbv6" values={{ years: 10 }} />,
  15: <FormattedMessage id="global.termDescriptions.numYears.Cgmbv6" values={{ years: 15 }} />,
  20: <FormattedMessage id="global.termDescriptions.numYears.Cgmbv6" values={{ years: 20 }} />,
  25: <FormattedMessage id="global.termDescriptions.numYears.Cgmbv6" values={{ years: 25 }} />,
  30: <FormattedMessage id="global.termDescriptions.numYears.Cgmbv6" values={{ years: 30 }} />,
  65: <FormattedMessage id="global.termDescriptions.65years.BiWoqr" />,
  100: <FormattedMessage id="global.termDescriptions.permanent.1av0lx" />,
};

export const TERM_LENGTH_LABELS_TO_CUSTOM_STRINGS = {
  10: '10',
  15: '15',
  20: '20',
  25: '25',
  30: '30',
  100: <FormattedMessage id="global.termLabelCustomStrings.x4loa1" />,
};

export const TERM_DESCRIPTIONS_LONG = {
  0: 'Unavailable',
  10: 'for 10 years',
  15: 'for 15 years',
  20: 'for 20 years',
  25: 'for 25 years',
  30: 'for 30 years',
  65: 'to age 65',
};

export const TERM_DESCRIPTIONS_NEXT = {
  0: 'Unavailable',
  10: 'in the next 10 years',
  15: 'in the next 15 years',
  20: 'in the next 20 years',
  25: 'in the next 25 years',
  30: 'in the next 30 years',
  65: 'until you turn 65',
};

export const CATEGORY = {
  residence: 'Mortgage / rent',
  utilities: 'Housing bills & utilities',
  telecom: 'Phone, internet, cable',
  food: 'Groceries, restaurants & alcohol',
  shopping: 'Shopping, fitness & grooming',
  transportation: 'Cars, taxis & public transit',
  childcare: 'Childcare & education',
  discretionary: 'Discretionary, travel, rec. & gifts',
  other: [],
};

export const CATEGORY_ORDER = {
  0: 'residence',
  1: 'utilities',
  2: 'telecom',
  3: 'food',
  4: 'shopping',
  5: 'transportation',
  6: 'childcare',
  7: 'discretionary',
  8: 'other',
};

export const CATEGORY_INFO = {
  utilities: 'Property tax, condo fees, repairs and maintenance, home insurance, gas/electricity/hydro',
  telecom: 'Cell phones, cable/internet, Netflix, other subcription',
  food: 'Groceries, restaurants, coffee shops, alcohol',
  shopping: 'Clothes, shoes, salons & hair care, personal hygiene, gym memberships/classes, drycleaning, health, eyeglasses/contacts, dental',
  transportation: 'Car payments, auto insurance, gas, parking, maintenance/repairs, taxis/ubers, public transit',
  childcare: 'Daycare, nannies, private schools, tutors',
  discretionary: 'Vacations, entertainment, recreational activities, sports, electronics, gifts (birthdays, holidays, weddings)',
  other: 'Any monthly expenses you have that don’t fit into one of the above categories',
};

export const OPTION_TYPES = {
  NONE: 0,
  /* LIFESTYLE: 1, // DEPRECATED
  TRANSITION: 2, // DEPRECATED
  JUSTKIDSBASIC: 3, // DEPRECATED
  JUSTKIDSFULL: 4, // DEPRECATED
  CUSTOM: 5, // DEPRECATED */
  TUNAFISH: 6,
};

export const COVERAGE_TYPES = {
  NONE: 'NONE',
  STANDARD: 'STANDARD',
  EXCEPTION: 'EXCEPTION',
  SINGLE_NO_KIDS: 'SINGLE_NO_KIDS',
  SINGLE_AND_KIDS: 'SINGLE_AND_KIDS',
  MARRIED: 'MARRIED',
  SINGLE_KIDS_RENT: 'SINGLE_KIDS_RENT',
  SINGLE_KIDS_MTGE: 'SINGLE_KIDS_MTGE',
  SINGLE_KIDS_NO_HOUSING: 'SINGLE_KIDS_NO_HOUSING',
};

// Life/CI coverage sliders removed for HD-only webapp — stubs kept for import compatibility
export const COVERAGE_AMOUNTS_SLIDER_OVER_51 = [];
export const COVERAGE_AMOUNTS_SLIDER_UNDER_51 = [];
export const MINIMUM_LIFE_COVERAGE_AMOUNT = 0;
export const COVERAGE_AMOUNTS_SLIDER_SIMPLIFIED = [];
export const PERMANENT_COVERAGE_AMOUNTS_SLIDER = [];
export const CI_COVERAGE_AMOUNTS_SLIDER = [];

export const TOOLTIP_MESSAGES = {
  SMOKE_MESSAGE: `Select “Yes” if you’ve used any nicotine products in the past year.
    Nicotine products include cigarettes, e-cigarettes, cigars, pipes, chewing tobacco,
    nicotine gum or patches, etc.`,
  COVERAGE_AMOUNT_MESSAGE: <FormattedMessage
    id="const.tooltipMessagesCoverageAmount.6mld6E"
  />,
  COVERAGE_AMOUNT_STANDALONE_MESSAGE: `Your coverage is the total amount of money your
    beneficiaries will receive from your insurance company (tax free) if you pass away. The
    higher the coverage amount, the more expensive your policy will be, so it’s important to
    get quality and honest advice on your needs.`,
  COVERAGE_AMOUNT_SHORTER_MESSAGE: `Your coverage is the total amount of money your
    beneficiaries will receive (tax free) if you pass away.`,
  TERM_LENGTH_MESSAGE: <FormattedMessage
    id="const.tooltipMessagesTermLength.aoiw9r"
  />,
  TERM_LENGTH_STANDALONE_MESSAGE: `Your policy length is the fixed period of your term life
    insurance. Your insurance company will pay out your coverage amount if you pass away
    during that time. It is important to make sure that your policy remains active for as
    long as you have a significant life insurance need.`,
  TERM_LENGTH_SHORTER_MESSAGE: `Your policy length is the fixed period of your term life
    insurance. Your coverage amount will be paid out to your loved ones if you pass away during that time.`,
  MONTHLY_RATE_MESSAGE: {
    LINE_1: `Your final rate was determined by analyzing the answers you provided
    about your current health status, your medical history, and your other lifestyle factors.`,
    LINE_2: `The good news is no additional information is required!
    When you lock in your rate, it will never change for the duration of your policy term.`,
  },
  LIKELY_APPROVED_MESSAGE: {
    LINE_1: `Your final rate depends on many different factors, including everything that you’ve submitted until now.
    Although we love getting our customers Instantly Approved,
    sometimes our underwriting engine simply can’t do this with the information we’ve gathered at this point.`,
    LINE_2: `When more information is needed,
    our customers in the same position as you get approved at their quoted rate 80% of the time –
    whether they had to complete additional medical requirements or just needed a human to review their application.`,
    LINE_3: `For about 5% of customers,
    they are approved at a higher rate than initially quoted because their health or
    lifestyle factors made them riskier to insure.
    We unfortunately have to decline 15% of applications as those customers’
    lifestyles or medical histories are more complex.`,
    LINE_4: `This data is based on the thousands of customers who have submitted an application with PolicyMe.`,
  },
};

export const PHONE_NUMBER = '18669997457';
export const PHONE_NUMBER_FORMATTED = '1-866-999-7457';
export const PHONE_NUMBER_FORMATTED_NEW = '+1 (866) 999-7457';

export const INFO_EMAIL = 'info@policyme.com';

// 🚨🚨🚨 Please add the same new ref_versions in pm_lifeconsts/crm_consts.py as well 🚨🚨🚨
export const EMAIL_REF_VERSIONS = {
  RECOMMENDATION_LINK: 0, // retargeting email with quote /life-insurance-quotes, app not filled
  PHONE_CALL_REBOOKING: 1, // when we used to have a phone call (DEPRECATED)
  // NOT_USED : 2,
  // NOT_USED : 3,
  START_APP_INDIVIDUAL: 4,
  ADVISOR_REBOOKINGS: 5,
  TELE_INTERVIEW_REBOOKING: 6,
  PARAMED_VISIT_REBOOKING: 7,
  START_APP_JOINT_PRIMARY: 8,
  START_APP_JOINT_SECONDARY: 9,
  MOBILE_VERIFICATION: 10,
  POLICYME_PRODUCT_SINGLE_APP: 11,
  FAMILY_ONE_QUOTES: 13,
  POLICYME_PRODUCT_START_APP_JOINT_PRIMARY: 14,
  POLICYME_PRODUCT_START_APP_JOINT_SECONDARY: 15,
  START_APP_INDIVIDUAL_V2: 20,
  JOINT_V2_INDIVIDUAL: 21,
  JOINT_V2_PRIMARY_SECONDARY: 22,
  CROSS_SELL_DROP_JOURNEY: 23,
  JOURNEY_3_INDIVIDUAL: 24,
  JOURNEY_3_JOINT: 25,
  START_APP_SHADOW_ACCOUNT_INDIVIDUAL: 27,
  START_APP_SHADOW_ACCOUNT_JOINT: 28,
  START_APP_HD_INDIVIDUAL: 29,
  START_APP_HD_JOINT: 30,
  POLICYME_HD_INDIVIDUAL: 31,
  POLICYME_HD_JOINT: 32,
  CAA_HD_GROUP_INDIVIDUAL: 33,
  CAA_HD_GROUP_JOINT: 34,
  ADD_INSURANCE_OWNERSHIP_TYPE_INDIVIDUAL: 35,
  ADD_INSURANCE_OWNERSHIP_TYPE_JOINT: 36,
};

export const CONTACT_EMAIL_TYPES = {
  CONTACT: 'info',
  ADVICE: 'advice',
};

// should match class FollowupType(enum.Enum): in followup.py in life-webapi-main
export const FOLLOWUP_TYPES = {
  NONE: 0,
  // NEW_APPLICATION: 1, // old app form, no longer used
  // APP_REBOOKING: 2, // replaced with more specific rebooking
  ADVICE: 3,
  TELE_INTERVIEW: 4,
  PARAMED_VISIT: 5,
  ADVICE_REBOOKING: 6,
  TELE_INTERVIEW_REBOOKING: 7,
  PARAMED_VISIT_REBOOKING: 8,
  CPP: 9,
  DOCUSIGN_EMAIL: 10,
  PARTNER_TELE_INTERVIEW: 11,
};

export const FOLLOWUP_PROPERTY_NAMES = {
  [FOLLOWUP_TYPES.ADVICE]: 'advice',
  [FOLLOWUP_TYPES.TELE_INTERVIEW]: 'teleinterview',
  [FOLLOWUP_TYPES.TELE_INTERVIEW_REBOOKING]: 'teleinterview',
  [FOLLOWUP_TYPES.PARAMED_VISIT]: 'paramed',
  [FOLLOWUP_TYPES.PARAMED_VISIT_REBOOKING]: 'paramed',
  [FOLLOWUP_TYPES.CPP]: 'cpp',
  [FOLLOWUP_TYPES.PARTNER_TELE_INTERVIEW]: 'partnerTeleinterview',
};

export const SUBMISSION_TYPES = {
  APPLICATION: 1, // same as deprecated new_application in FOLLOWUP_TYPES
  REBOOKING: 2, // same as deprecated app_rebooking in FOLLOWUP_TYPES
  ADVICE: 3, // same as FOLLOWUP_TYPES for backwards compatibility
};

export const RESIDENCY_STATUSES = {
  CITIZEN: 'citizen',
  PERM_RESIDENT: 'perm_resident',
  ON_VISA: 'on_visa',
  REFUGEE_STATUS: 'refugee_status',
  APPLIED_FOR_PERM_STATUS: 'applied_for_perm_status',
  ON_WORK_VISA: 'on_work_visa',
  ON_STUDENT_VISA: 'on_student_visa',

  // This should never be sent to the back end, it's used for the no
  // radio button when asking are you a citizen and is then overwritten
  // by one of these other statuses later
  NON_CITIZEN: 'non_citizen',
};

export const RESIDENCY_STATUS_TYPES = [
  { label: 'Citizen', value: RESIDENCY_STATUSES.CITIZEN },
  { label: 'Permanent Resident', value: RESIDENCY_STATUSES.PERM_RESIDENT },
  { label: 'On Visa', value: RESIDENCY_STATUSES.ON_VISA },
  { label: 'On Work Visa', value: RESIDENCY_STATUSES.ON_WORK_VISA },
  { label: 'On Student Visa', value: RESIDENCY_STATUSES.ON_STUDENT_VISA },
  { label: 'Refugee Status', value: RESIDENCY_STATUSES.REFUGEE_STATUS },
  { label: 'Applied For Permanent Status', value: RESIDENCY_STATUSES.APPLIED_FOR_PERM_STATUS },
];

export const RESIDENCY_STATUS_NON_CITIZEN_TYPES = [
  { label: 'Permanent Resident', value: RESIDENCY_STATUSES.PERM_RESIDENT },
  { label: 'On Visa', value: RESIDENCY_STATUSES.ON_VISA },
  { label: 'On Work Visa', value: RESIDENCY_STATUSES.ON_WORK_VISA },
  { label: 'On Student Visa', value: RESIDENCY_STATUSES.ON_STUDENT_VISA },
  { label: 'Refugee Status', value: RESIDENCY_STATUSES.REFUGEE_STATUS },
  { label: 'Applied For Permanent Status', value: RESIDENCY_STATUSES.APPLIED_FOR_PERM_STATUS },
];

export const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

export const IDENTIFICATION_TYPE_VALUES = {
  DRIVERS_LICENSE: 'drivers_license',
  PASSPORT: 'passport',
  MILITARY_CARD: 'military_card',
};

export const IDENTIFICATION_TYPES = [
  { value: IDENTIFICATION_TYPE_VALUES.DRIVERS_LICENSE, label: 'Driver\'s License' },
  { value: IDENTIFICATION_TYPE_VALUES.PASSPORT, label: 'Passport' },
  { value: IDENTIFICATION_TYPE_VALUES.MILITARY_CARD, label: 'Military Card' },
];

export const IDENTIFICATION_TYPES_WITH_EXPIRY_DATE = [
  IDENTIFICATION_TYPE_VALUES.DRIVERS_LICENSE,
  IDENTIFICATION_TYPE_VALUES.PASSPORT,
];

export const IDENTIFICATION_TYPES_WITH_PROVINCE = [
  IDENTIFICATION_TYPE_VALUES.DRIVERS_LICENSE,
  IDENTIFICATION_TYPE_VALUES.PASSPORT,
  IDENTIFICATION_TYPE_VALUES.MILITARY_CARD,
];

export const HOUSEHOLD_TYPES = {
  UNKNOWN: 'unknown',
  PARTNER_NO_KIDS: 'partner_no_kids',
  PARTNER_KIDS: 'partner_kids',
  NO_PARTNER_NO_KIDS: 'no_partner_no_kids',
  NO_PARTNER_KIDS: 'no_partner_kids',
};

export const MONTH_TYPES = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

let year_array = [];
const curr_year = moment().year();
for (let i = curr_year; i >= 1900; i--) {
  year_array.push({ label: i.toString(), value: i });
}
export const DOB_YEAR_TYPES = year_array;

export const DOB_DAY_TYPES = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
  { label: '25', value: 25 },
  { label: '26', value: 26 },
  { label: '27', value: 27 },
  { label: '28', value: 28 },
  { label: '29', value: 29 },
  { label: '30', value: 30 },
  { label: '31', value: 31 },
];

export const MONTHS_WITH_THIRTY_DAYS = [4, 6, 9, 11]; // Apr, Jun, Sep, Nov

export const PROVINCES = {
  AB: <FormattedMessage id="provinces.value.1WIZta" />,
  BC: <FormattedMessage id="provinces.value.JpjHtv" />,
  MB: <FormattedMessage id="provinces.value.2MBWtD" />,
  NB: <FormattedMessage id="provinces.value.P6QZk3" />,
  NL: <FormattedMessage id="provinces.value.SoiLgX" />,
  NT: <FormattedMessage id="provinces.value.JkGcra" />,
  NS: <FormattedMessage id="provinces.value.nNHN3Z" />,
  NU: <FormattedMessage id="provinces.value.rin6lX" />,
  ON: <FormattedMessage id="provinces.value.X6UUbS" />,
  PE: <FormattedMessage id="provinces.value.tcbDXt" />,
  QC: <FormattedMessage id="provinces.value.XxVpVn" />,
  SK: <FormattedMessage id="provinces.value.M2sNaH" />,
  YT: <FormattedMessage id="provinces.value.tnYHt7" />,
};

export const PROVINCES_ABBREVIATIONS = {
  AB: 'AB',
  BC: 'BC',
  MB: 'MB',
  NB: 'NB',
  NL: 'NL',
  NT: 'NT',
  NS: 'NS',
  NU: 'NU',
  ON: 'ON',
  PE: 'PE',
  QC: 'QC',
  SK: 'SK',
  YT: 'YT',
};

export const PROVINCE_TYPES = Object.entries(PROVINCES)
  .map(([key, label]) => ({ value: key, label }));

export const HEIGHT_FEET_TYPES = [
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
];

export const HEIGHT_INCHES_TYPES = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
];

export const INSURERS = {
  ML: 'ML',
  CL: 'CL',
  BMO: 'BMO',
  CPP: 'CPP',
  IA: 'IA',
  WW: 'WW',
  AL: 'AL',
  PM: 'PM',
};

export const INSURER_NAMES_SHORT = {
  [INSURERS.ML]: 'Manulife',
  [INSURERS.CL]: 'Canada Life',
  [INSURERS.BMO]: 'BMO',
  [INSURERS.CPP]: 'CPP',
  [INSURERS.IA]: 'IA',
  [INSURERS.WW]: 'Wawanesa',
  [INSURERS.AL]: 'Assumption Life',
  [INSURERS.PM]: 'PolicyMe',
};

export const INSURER_NAMES = {
  AL: <FormattedMessage id="policies.assumptionLife.1mosFN" />,
  BMO: <FormattedMessage id="policies.bmo.I9vNE2" />,
  CAA: <FormattedMessage id="policies.caa.TAQ608" />,
  CL: <FormattedMessage id="policies.canadaLife.GiAw64" />,
  CPP: <FormattedMessage id="policies.cpp.GV7LyY" />,
  CO: <FormattedMessage id="policies.cooperators.sGac2d" />,
  DES: <FormattedMessage id="policies.desjardins.2wHbHJ" />,
  EMP: <FormattedMessage id="policies.empireLife.UQoQ0J" />,
  EQL: <FormattedMessage id="policies.equitableLife.ibM1J8" />,
  FOR: <FormattedMessage id="policies.foresters.mwezl9" />,
  GWL: <FormattedMessage id="policies.greatWestLife.lCED1t" />,
  HUM: <FormattedMessage id="policies.humania.PD5D9j" />,
  IA: <FormattedMessage id="policies.industrialAlliance.KtlpRg" />,
  LC: <FormattedMessage id="policies.laCapitale.9cadYo" />,
  LL: <FormattedMessage id="policies.londonLife.ULcOIP" />,
  ML: <FormattedMessage id="policies.manulife.yqTDHs" />,
  NL: <FormattedMessage id="policies.nationalLife.zeRNrV" />,
  PRI: <FormattedMessage id="policies.primerica.mS2SgQ" />,
  RBC: <FormattedMessage id="policies.rbc.zg8Vw3" />,
  RL: <FormattedMessage id="policies.reliableLife.Zjnpq5" />,
  SCL: <FormattedMessage id="policies.scotiaLife.RvwXs0" />,
  SEC: <FormattedMessage id="policies.securian.C8fp75" />,
  SSQ: <FormattedMessage id="policies.ssq.yo27yZ" />,
  STL: <FormattedMessage id="policies.standardLife.rPbOYK" />,
  SUL: <FormattedMessage id="policies.sunLife.ZBVIq8" />,
  TRA: <FormattedMessage id="policies.transamerica.mrPIaP" />,
  UL: <FormattedMessage id="policies.ulMutualCompany.YCDJzX" />,
  WW: <FormattedMessage id="policies.wawanesa.4nPJCw" />,
  PM: <FormattedMessage id="policies.policyme.VrFD86" />,
  OTH: <FormattedMessage id="policies.otherOrCantRemember.YFx7Ql" />,
};

export const INSURER_COMPARISON = {
  BMO: 'Bank of Montreal',
  CL: 'Canada Life',
  DES: 'Desjardins',
  EMP: 'Empire Life',
  EQL: 'Equitable Life',
  ML: 'Manulife',
  RBC: 'Royal Bank of Canada',
  SUL: 'Sun Life',
  WW: 'Wawanesa',
  PM: 'PolicyMe',
};

export const INSURER_TYPES = Object.entries(INSURER_NAMES)
  .map(([key, label]) => ({ value: key, label }));

export const RELATIONSHIP_NAMES = {
  SPOUSE: 'Spouse',
  PARTNER: 'Partner',
  EX_SPOUSE: 'Ex-spouse',
  EX_PARTNER: 'Ex-partner',
  CHILD: 'Child',
  GRAND_CHILD: 'Grandchild',
  GRAND_PARENT: 'Grandparent',
  FRIEND: 'Friend',
  BROTHER: 'Brother',
  BROTHER_IN_LAW: 'Brother-in-law',
  SISTER: 'Sister',
  SISTER_IN_LAW: 'Sister-in-law',
  AUNT: 'Aunt',
  UNCLE: 'Uncle',
  COUSIN: 'Cousin',
  PARENT: 'Parent',
  PARENT_IN_LAW: 'Parent-in-law',
  NIECE: 'Niece',
  NEPHEW: 'Nephew',
};
export const RELATIONSHIP_VALUES = RELATIONSHIP_NAMES;

export const RELATIONSHIP_TYPES = Object.entries(RELATIONSHIP_NAMES)
  .map(([key, label]) => ({ label, value: RELATIONSHIP_VALUES[key] }));

export const FORMATTED_RELATIONSHIP_NAMES = {
  SPOUSE: <FormattedMessage id="relationshipNames.value.6g53ts" />,
  PARTNER: <FormattedMessage id="relationshipNames.value.4a7v9d" />,
  EX_SPOUSE: <FormattedMessage id="relationshipNames.value.1s2t8n" />,
  EX_PARTNER: <FormattedMessage id="relationshipNames.value.9t4e2s" />,
  CHILD: <FormattedMessage id="relationshipNames.value.8u3n4c" />,
  GRAND_CHILD: <FormattedMessage id="relationshipNames.value.5s7t9d" />,
  GRAND_PARENT: <FormattedMessage id="relationshipNames.value.0a5v1d" />,
  FRIEND: <FormattedMessage id="relationshipNames.value.3f6g8n" />,
  BROTHER: <FormattedMessage id="relationshipNames.value.7c3t8s" />,
  BROTHER_IN_LAW: <FormattedMessage id="relationshipNames.value.2h5j7n" />,
  SISTER: <FormattedMessage id="relationshipNames.value.5c6t8s" />,
  SISTER_IN_LAW: <FormattedMessage id="relationshipNames.value.8h4j2n" />,
  AUNT: <FormattedMessage id="relationshipNames.value.3m9k8l" />,
  UNCLE: <FormattedMessage id="relationshipNames.value.7j2h6f" />,
  COUSIN: <FormattedMessage id="relationshipNames.value.4j6h8l" />,
  PARENT: <FormattedMessage id="relationshipNames.value.6k3l9m" />,
  PARENT_IN_LAW: <FormattedMessage id="relationshipNames.value.9f8k2j" />,
  NIECE: <FormattedMessage id="relationshipNames.value.2n5t7f" />,
  NEPHEW: <FormattedMessage id="relationshipNames.value.5s3t9c" />,

};

export const FORMATTED_RELATIONSHIP_TYPES = Object.entries(FORMATTED_RELATIONSHIP_NAMES)
  .map(([key, label]) => ({ label, value: RELATIONSHIP_VALUES[key] }));

export const TRUSTEE_RELATIONSHIP_NAMES = {
  PARENT: 'Parent',
  AUNT: 'Aunt',
  UNCLE: 'Uncle',
  GODPARENT: 'Godparent',
  GRANDFATHER: 'Grandfather',
  GRANDMOTHER: 'Grandmother',
  FRIEND: 'Friend',
  SISTER: 'Sister',
  BROTHER: 'Brother',
  COUSIN: 'Cousin',
  LEGAL_GUARDIAN: 'Legal Guardian',
  OTHER: 'Other',
};
export const TRUSTEE_RELATIONSHIP_VALUES = TRUSTEE_RELATIONSHIP_NAMES;

export const TRUSTEE_RELATIONSHIP_TYPES = Object.entries(TRUSTEE_RELATIONSHIP_NAMES)
  .map(([key, label]) => ({ label, value: TRUSTEE_RELATIONSHIP_VALUES[key] }));

// Life/CI beneficiary types removed for HD-only webapp

export const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

export const US_STATE_TYPES = Object.entries(US_STATES)
  .map(([key, label]) => ({ value: key, label }));

export const BIRTHPLACE_JURISDICTION_TC = {
  OLI_CAN_AB: <FormattedMessage id="birthplace.jurisdiction.nyolY7" />,
  OLI_CAN_BC: <FormattedMessage id="birthplace.jurisdiction.4fEzPc" />,
  OLI_CAN_MB: <FormattedMessage id="birthplace.jurisdiction.k5syAI" />,
  OLI_CAN_NB: <FormattedMessage id="birthplace.jurisdiction.tiN2zI" />,
  OLI_CAN_NF: <FormattedMessage id="birthplace.jurisdiction.e2vnJQ" />,
  OLI_CAN_NS: <FormattedMessage id="birthplace.jurisdiction.HY7LmF" />,
  OLI_CAN_NT: <FormattedMessage id="birthplace.jurisdiction.suaiLd" />,
  OLI_CAN_NUNAVUT: <FormattedMessage id="birthplace.jurisdiction.KVewMA" />,
  OLI_CAN_ON: <FormattedMessage id="birthplace.jurisdiction.r3Hq95" />,
  OLI_CAN_PE: <FormattedMessage id="birthplace.jurisdiction.xj67p8" />,
  OLI_CAN_PQ: <FormattedMessage id="birthplace.jurisdiction.ygWNmu" />,
  OLI_CAN_SK: <FormattedMessage id="birthplace.jurisdiction.uOoqEq" />,
  OLI_CAN_YT: <FormattedMessage id="birthplace.jurisdiction.v4qTzj" />,
  OLI_UNKNOWN: <FormattedMessage id="birthplace.jurisdiction.bk2bbG" />,
  OLI_USA_AA: <FormattedMessage id="birthplace.jurisdiction.hLSFoe" />,
  OLI_USA_AE: <FormattedMessage id="birthplace.jurisdiction.ASnGdQ" />,
  OLI_USA_AK: <FormattedMessage id="birthplace.jurisdiction.UtL5TP" />,
  OLI_USA_AL: <FormattedMessage id="birthplace.jurisdiction.uWMqT1" />,
  OLI_USA_AP: <FormattedMessage id="birthplace.jurisdiction.qCKRGR" />,
  OLI_USA_AR: <FormattedMessage id="birthplace.jurisdiction.ahLVpf" />,
  OLI_USA_AS: <FormattedMessage id="birthplace.jurisdiction.s4jrkV" />,
  OLI_USA_AZ: <FormattedMessage id="birthplace.jurisdiction.bfqHbz" />,
  OLI_USA_CA: <FormattedMessage id="birthplace.jurisdiction.FMt1S0" />,
  OLI_USA_CO: <FormattedMessage id="birthplace.jurisdiction.l4u47B" />,
  OLI_USA_CT: <FormattedMessage id="birthplace.jurisdiction.wcOnOQ" />,
  OLI_USA_DC: <FormattedMessage id="birthplace.jurisdiction.v1znVu" />,
  OLI_USA_DE: <FormattedMessage id="birthplace.jurisdiction.mloqfQ" />,
  OLI_USA_FL: <FormattedMessage id="birthplace.jurisdiction.pfqQKd" />,
  OLI_USA_FS: <FormattedMessage id="birthplace.jurisdiction.jkzehb" />,
  OLI_USA_GA: <FormattedMessage id="birthplace.jurisdiction.fFmnpw" />,
  OLI_USA_GB: <FormattedMessage id="birthplace.jurisdiction.0IEJt4" />,
  OLI_USA_GU: <FormattedMessage id="birthplace.jurisdiction.9ug7nY" />,
  OLI_USA_HI: <FormattedMessage id="birthplace.jurisdiction.nXYY9g" />,
  OLI_USA_IA: <FormattedMessage id="birthplace.jurisdiction.vH1YWP" />,
  OLI_USA_ID: <FormattedMessage id="birthplace.jurisdiction.LnpIAa" />,
  OLI_USA_IL: <FormattedMessage id="birthplace.jurisdiction.RYFKm0" />,
  OLI_USA_IN: <FormattedMessage id="birthplace.jurisdiction.0OGC1B" />,
  OLI_USA_KS: <FormattedMessage id="birthplace.jurisdiction.OEAv2s" />,
  OLI_USA_KY: <FormattedMessage id="birthplace.jurisdiction.rax2fE" />,
  OLI_USA_LA: <FormattedMessage id="birthplace.jurisdiction.Nv5qql" />,
  OLI_USA_MA: <FormattedMessage id="birthplace.jurisdiction.fHicpX" />,
  OLI_USA_MD: <FormattedMessage id="birthplace.jurisdiction.WhDBGo" />,
  OLI_USA_ME: <FormattedMessage id="birthplace.jurisdiction.277r0x" />,
  OLI_USA_MH: <FormattedMessage id="birthplace.jurisdiction.PQ2q86" />,
  OLI_USA_MI: <FormattedMessage id="birthplace.jurisdiction.ik4GWr" />,
  OLI_USA_MN: <FormattedMessage id="birthplace.jurisdiction.cHrc1u" />,
  OLI_USA_MO: <FormattedMessage id="birthplace.jurisdiction.IRclAi" />,
  OLI_USA_MP: <FormattedMessage id="birthplace.jurisdiction.iNjgM0" />,
  OLI_USA_MS: <FormattedMessage id="birthplace.jurisdiction.AZxNVB" />,
  OLI_USA_MT: <FormattedMessage id="birthplace.jurisdiction.5bTXeD" />,
  OLI_USA_NC: <FormattedMessage id="birthplace.jurisdiction.D1mc32" />,
  OLI_USA_ND: <FormattedMessage id="birthplace.jurisdiction.iqkLln" />,
  OLI_USA_NE: <FormattedMessage id="birthplace.jurisdiction.nSQk7u" />,
  OLI_USA_NH: <FormattedMessage id="birthplace.jurisdiction.bEDx1Y" />,
  OLI_USA_NJ: <FormattedMessage id="birthplace.jurisdiction.w2IpX7" />,
  OLI_USA_NM: <FormattedMessage id="birthplace.jurisdiction.Y9tWe6" />,
  OLI_USA_NV: <FormattedMessage id="birthplace.jurisdiction.Y1jbSa" />,
  OLI_USA_NY: <FormattedMessage id="birthplace.jurisdiction.7oKtDE" />,
  OLI_USA_OH: <FormattedMessage id="birthplace.jurisdiction.Uo4wiI" />,
  OLI_USA_OK: <FormattedMessage id="birthplace.jurisdiction.DiJojB" />,
  OLI_USA_OR: <FormattedMessage id="birthplace.jurisdiction.CyjsxF" />,
  OLI_USA_PA: <FormattedMessage id="birthplace.jurisdiction.fmPLrq" />,
  OLI_USA_PR: <FormattedMessage id="birthplace.jurisdiction.ep7z5F" />,
  OLI_USA_PW: <FormattedMessage id="birthplace.jurisdiction.Qy8Jne" />,
  OLI_USA_RI: <FormattedMessage id="birthplace.jurisdiction.XSS6y8" />,
  OLI_USA_SC: <FormattedMessage id="birthplace.jurisdiction.HuArX8" />,
  OLI_USA_SD: <FormattedMessage id="birthplace.jurisdiction.G0Yj6m" />,
  OLI_USA_TN: <FormattedMessage id="birthplace.jurisdiction.XQP6nK" />,
  OLI_USA_TX: <FormattedMessage id="birthplace.jurisdiction.6YyhqR" />,
  OLI_USA_UT: <FormattedMessage id="birthplace.jurisdiction.d7VNsx" />,
  OLI_USA_VA: <FormattedMessage id="birthplace.jurisdiction.TX9kMH" />,
  OLI_USA_VI: <FormattedMessage id="birthplace.jurisdiction.T29qSH" />,
  OLI_USA_VT: <FormattedMessage id="birthplace.jurisdiction.6kmEzj" />,
  OLI_USA_WA: <FormattedMessage id="birthplace.jurisdiction.OOjeay" />,
  OLI_USA_WI: <FormattedMessage id="birthplace.jurisdiction.lWkXO7" />,
  OLI_USA_WV: <FormattedMessage id="birthplace.jurisdiction.05XqPi" />,
  OLI_USA_WY: <FormattedMessage id="birthplace.jurisdiction.6BHRAk" />,
};

export const BIRTH_JURISDICTION_USA = Object.entries(BIRTHPLACE_JURISDICTION_TC)
  .map((jurisdiction) => (
    { value: jurisdiction[0], label: jurisdiction[1] }
  )).filter((jurisdiction) => jurisdiction.value.includes('OLI_USA'));

export const BIRTH_JURISDICTION_CAN = Object.entries(BIRTHPLACE_JURISDICTION_TC)
  .map((jurisdiction) => (
    { value: jurisdiction[0], label: jurisdiction[1] }
  )).filter((jurisdiction) => jurisdiction.value.includes('OLI_CAN'));

export const COUNTRY_CODES = {
  AF: 'AF',
  AL: 'AL',
  DZ: 'DZ',
  AS: 'AS',
  AD: 'AD',
  AO: 'AO',
  AI: 'AI',
  AQ: 'AQ',
  AG: 'AG',
  AR: 'AR',
  AM: 'AM',
  AW: 'AW',
  AU: 'AU',
  AT: 'AT',
  AZ: 'AZ',
  BS: 'BS',
  BH: 'BH',
  BD: 'BD',
  BB: 'BB',
  BY: 'BY',
  BE: 'BE',
  BZ: 'BZ',
  BJ: 'BJ',
  BM: 'BM',
  BT: 'BT',
  BO: 'BO',
  BQ: 'BQ',
  BA: 'BA',
  BW: 'BW',
  BV: 'BV',
  BR: 'BR',
  IO: 'IO',
  VG: 'VG',
  BN: 'BN',
  BG: 'BG',
  BF: 'BF',
  BI: 'BI',
  KH: 'KH',
  CM: 'CM',
  CA: 'CA',
  CV: 'CV',
  KY: 'KY',
  CF: 'CF',
  TD: 'TD',
  CL: 'CL',
  CN: 'CN',
  CX: 'CX',
  CC: 'CC',
  CO: 'CO',
  KM: 'KM',
  CG: 'CG',
  CK: 'CK',
  CR: 'CR',
  CI: 'CI',
  HR: 'HR',
  CU: 'CU',
  CW: 'CW',
  CY: 'CY',
  CS: 'CS',
  CZ: 'CZ',
  CD: 'CD',
  DK: 'DK',
  DG: 'DG',
  DJ: 'DJ',
  DM: 'DM',
  DO: 'DO',
  EC: 'EC',
  EG: 'EG',
  SV: 'SV',
  GQ: 'GQ',
  ER: 'ER',
  EE: 'EE',
  ET: 'ET',
  FK: 'FK',
  FO: 'FO',
  FJ: 'FJ',
  FI: 'FI',
  FR: 'FR',
  GF: 'GF',
  PF: 'PF',
  TF: 'TF',
  GA: 'GA',
  GM: 'GM',
  GE: 'GE',
  DE: 'DE',
  GH: 'GH',
  GI: 'GI',
  GR: 'GR',
  GL: 'GL',
  GD: 'GD',
  GP: 'GP',
  GU: 'GU',
  GT: 'GT',
  GG: 'GG',
  GN: 'GN',
  GW: 'GW',
  GY: 'GY',
  HT: 'HT',
  HM: 'HM',
  VA: 'VA',
  HN: 'HN',
  HK: 'HK',
  HU: 'HU',
  IS: 'IS',
  IN: 'IN',
  ID: 'ID',
  IR: 'IR',
  IQ: 'IQ',
  IE: 'IE',
  IM: 'IM',
  IL: 'IL',
  IT: 'IT',
  JM: 'JM',
  JP: 'JP',
  JE: 'JE',
  JO: 'JO',
  KZ: 'KZ',
  KE: 'KE',
  KI: 'KI',
  KP: 'KP',
  KR: 'KR',
  KW: 'KW',
  KG: 'KG',
  LA: 'LA',
  LV: 'LV',
  LB: 'LB',
  LS: 'LS',
  LR: 'LR',
  LY: 'LY',
  LI: 'LI',
  LT: 'LT',
  LU: 'LU',
  MO: 'MO',
  MK: 'MK',
  MG: 'MG',
  MW: 'MW',
  MY: 'MY',
  MV: 'MV',
  ML: 'ML',
  MT: 'MT',
  MH: 'MH',
  MQ: 'MQ',
  MR: 'MR',
  MU: 'MU',
  YT: 'YT',
  MX: 'MX',
  FM: 'FM',
  MD: 'MD',
  MC: 'MC',
  MN: 'MN',
  ME: 'ME',
  MS: 'MS',
  MA: 'MA',
  MZ: 'MZ',
  MM: 'MM',
  NA: 'NA',
  NR: 'NR',
  NP: 'NP',
  NL: 'NL',
  NC: 'NC',
  NZ: 'NZ',
  NI: 'NI',
  NE: 'NE',
  NG: 'NG',
  NU: 'NU',
  NF: 'NF',
  MP: 'MP',
  NO: 'NO',
  OM: 'OM',
  PK: 'PK',
  PW: 'PW',
  PS: 'PS',
  PA: 'PA',
  PG: 'PG',
  PY: 'PY',
  PE: 'PE',
  PH: 'PH',
  PN: 'PN',
  PL: 'PL',
  PT: 'PT',
  PR: 'PR',
  QA: 'QA',
  RE: 'RE',
  RO: 'RO',
  RU: 'RU',
  RW: 'RW',
  BL: 'BL',
  SH: 'SH',
  KN: 'KN',
  LC: 'LC',
  MF: 'MF',
  PM: 'PM',
  VC: 'VC',
  WS: 'WS',
  SM: 'SM',
  ST: 'ST',
  SA: 'SA',
  SN: 'SN',
  RS: 'RS',
  SC: 'SC',
  SL: 'SL',
  SG: 'SG',
  SX: 'SX',
  SK: 'SK',
  SI: 'SI',
  SB: 'SB',
  SO: 'SO',
  ZA: 'ZA',
  GS: 'GS',
  SS: 'SS',
  ES: 'ES',
  LK: 'LK',
  SD: 'SD',
  SR: 'SR',
  SJ: 'SJ',
  SZ: 'SZ',
  SE: 'SE',
  CH: 'CH',
  SY: 'SY',
  TW: 'TW',
  TJ: 'TJ',
  TH: 'TH',
  TL: 'TL',
  TG: 'TG',
  TK: 'TK',
  TO: 'TO',
  TT: 'TT',
  TN: 'TN',
  TR: 'TR',
  TM: 'TM',
  TC: 'TC',
  TV: 'TV',
  VI: 'VI',
  UG: 'UG',
  UA: 'UA',
  SU: 'SU',
  AE: 'AE',
  GB: 'GB',
  TZ: 'TZ',
  US: 'US',
  UM: 'UM',
  UY: 'UY',
  UZ: 'UZ',
  VU: 'VU',
  VE: 'VE',
  VN: 'VN',
  WF: 'WF',
  EH: 'EH',
  YE: 'YE',
  YU: 'YU',
  ZR: 'ZR',
  ZM: 'ZM',
  ZW: 'ZW',
  AX: 'AX',
  PM_BK: 'PM_BK',
  PM_IC: 'PM_IC',
  PM_GZ: 'PM_GZ',
  XK: 'XK',
  NT: 'NT',
  PM_ND: 'PM_ND',
  PM_PI: 'PM_PI',
  PM_TI: 'PM_TI',
  OTHER: 'OTHER',
};

export const COUNTRIES = {
  [COUNTRY_CODES.CA]: <FormattedMessage id="countries.value.sWm9Dy" />,
  [COUNTRY_CODES.US]: <FormattedMessage id="countries.value.JnB8Ay" />,
  [COUNTRY_CODES.AF]: <FormattedMessage id="countries.value.ZyH0wb" />,
  [COUNTRY_CODES.AX]: <FormattedMessage id="countries.value.rioDPI" />,
  [COUNTRY_CODES.AL]: <FormattedMessage id="countries.value.r7LPaP" />,
  [COUNTRY_CODES.DZ]: <FormattedMessage id="countries.value.cn8Y4r" />,
  [COUNTRY_CODES.AS]: <FormattedMessage id="countries.value.BUzXST" />,
  [COUNTRY_CODES.AD]: <FormattedMessage id="countries.value.0q96dx" />,
  [COUNTRY_CODES.AO]: <FormattedMessage id="countries.value.uHryC6" />,
  [COUNTRY_CODES.AI]: <FormattedMessage id="countries.value.cwZiLq" />,
  [COUNTRY_CODES.AQ]: <FormattedMessage id="countries.value.doPGX9" />,
  [COUNTRY_CODES.AG]: <FormattedMessage id="countries.value.a09zlL" />,
  [COUNTRY_CODES.AR]: <FormattedMessage id="countries.value.LNScji" />,
  [COUNTRY_CODES.AM]: <FormattedMessage id="countries.value.pEBW3o" />,
  [COUNTRY_CODES.AW]: <FormattedMessage id="countries.value.ddFS9l" />,
  [COUNTRY_CODES.AU]: <FormattedMessage id="countries.value.tqDLbB" />,
  [COUNTRY_CODES.AT]: <FormattedMessage id="countries.value.iUIAiM" />,
  [COUNTRY_CODES.AZ]: <FormattedMessage id="countries.value.pc9Ncu" />,
  [COUNTRY_CODES.BS]: <FormattedMessage id="countries.value.Ihup7A" />,
  [COUNTRY_CODES.BH]: <FormattedMessage id="countries.value.BxR4yi" />,
  [COUNTRY_CODES.PM_BK]: <FormattedMessage id="countries.value.CPJfut" />,
  [COUNTRY_CODES.BD]: <FormattedMessage id="countries.value.wqwskM" />,
  [COUNTRY_CODES.BB]: <FormattedMessage id="countries.value.j8blH6" />,
  [COUNTRY_CODES.BY]: <FormattedMessage id="countries.value.SlJQvN" />,
  [COUNTRY_CODES.BE]: <FormattedMessage id="countries.value.yC6bsQ" />,
  [COUNTRY_CODES.BZ]: <FormattedMessage id="countries.value.5zB54T" />,
  [COUNTRY_CODES.BJ]: <FormattedMessage id="countries.value.nwxiLP" />,
  [COUNTRY_CODES.BM]: <FormattedMessage id="countries.value.7tTJvj" />,
  [COUNTRY_CODES.BT]: <FormattedMessage id="countries.value.ytdUfm" />,
  [COUNTRY_CODES.BO]: <FormattedMessage id="countries.value.SZ4stK" />,
  [COUNTRY_CODES.BQ]: <FormattedMessage id="countries.value.37Kw3n" />,
  [COUNTRY_CODES.BA]: <FormattedMessage id="countries.value.AVbYhv" />,
  [COUNTRY_CODES.BW]: <FormattedMessage id="countries.value.Lvd4wU" />,
  [COUNTRY_CODES.BV]: <FormattedMessage id="countries.value.yp7Lc6" />,
  [COUNTRY_CODES.BR]: <FormattedMessage id="countries.value.Z6iwII" />,
  [COUNTRY_CODES.IO]: <FormattedMessage id="countries.value.uNMesW" />,
  [COUNTRY_CODES.BN]: <FormattedMessage id="countries.value.CZcWoO" />,
  [COUNTRY_CODES.BG]: <FormattedMessage id="countries.value.EHkH1H" />,
  [COUNTRY_CODES.BF]: <FormattedMessage id="countries.value.gvxDIg" />,
  [COUNTRY_CODES.BI]: <FormattedMessage id="countries.value.yaEMGh" />,
  [COUNTRY_CODES.KH]: <FormattedMessage id="countries.value.dIFmkL" />,
  [COUNTRY_CODES.CM]: <FormattedMessage id="countries.value.HEE8C8" />,
  [COUNTRY_CODES.PM_IC]: <FormattedMessage id="countries.value.RcBsnR" />,
  [COUNTRY_CODES.CV]: <FormattedMessage id="countries.value.rSl9Tk" />,
  [COUNTRY_CODES.KY]: <FormattedMessage id="countries.value.kNgTC6" />,
  [COUNTRY_CODES.CF]: <FormattedMessage id="countries.value.NpHd6y" />,
  [COUNTRY_CODES.TD]: <FormattedMessage id="countries.value.ixhow9" />,
  [COUNTRY_CODES.CL]: <FormattedMessage id="countries.value.nbYrbp" />,
  [COUNTRY_CODES.CN]: <FormattedMessage id="countries.value.NY9FNp" />,
  [COUNTRY_CODES.CX]: <FormattedMessage id="countries.value.b6jyMT" />,
  [COUNTRY_CODES.CC]: <FormattedMessage id="countries.value.87aDog" />,
  [COUNTRY_CODES.CO]: <FormattedMessage id="countries.value.KiSJ0F" />,
  [COUNTRY_CODES.KM]: <FormattedMessage id="countries.value.VhxtJr" />,
  [COUNTRY_CODES.CG]: <FormattedMessage id="countries.value.cUCKji" />,
  [COUNTRY_CODES.CD]: <FormattedMessage id="countries.value.P9ixLo" />,
  [COUNTRY_CODES.CK]: <FormattedMessage id="countries.value.SzKIEe" />,
  [COUNTRY_CODES.CR]: <FormattedMessage id="countries.value.EfyKeM" />,
  [COUNTRY_CODES.CI]: <FormattedMessage id="countries.value.gOqJJS" />,
  [COUNTRY_CODES.HR]: <FormattedMessage id="countries.value.MvjERk" />,
  [COUNTRY_CODES.CU]: <FormattedMessage id="countries.value.SDORqR" />,
  [COUNTRY_CODES.CW]: <FormattedMessage id="countries.value.MWkioz" />,
  [COUNTRY_CODES.CY]: <FormattedMessage id="countries.value.kTVNtf" />,
  [COUNTRY_CODES.CS]: <FormattedMessage id="countries.value.4iwrcq" />,
  [COUNTRY_CODES.CZ]: <FormattedMessage id="countries.value.PNYnXU" />,
  [COUNTRY_CODES.DK]: <FormattedMessage id="countries.value.YwFX22" />,
  [COUNTRY_CODES.DG]: <FormattedMessage id="countries.value.LbJSyA" />,
  [COUNTRY_CODES.DJ]: <FormattedMessage id="countries.value.iHWYd2" />,
  [COUNTRY_CODES.DM]: <FormattedMessage id="countries.value.wyRCxR" />,
  [COUNTRY_CODES.DO]: <FormattedMessage id="countries.value.UsSAOZ" />,
  [COUNTRY_CODES.TL]: <FormattedMessage id="countries.value.kPGNiT" />,
  [COUNTRY_CODES.EC]: <FormattedMessage id="countries.value.n0nPcZ" />,
  [COUNTRY_CODES.EG]: <FormattedMessage id="countries.value.c0SQR1" />,
  [COUNTRY_CODES.SV]: <FormattedMessage id="countries.value.X8q06M" />,
  [COUNTRY_CODES.GQ]: <FormattedMessage id="countries.value.TDsRPo" />,
  [COUNTRY_CODES.ER]: <FormattedMessage id="countries.value.2ilTUh" />,
  [COUNTRY_CODES.EE]: <FormattedMessage id="countries.value.atUOcy" />,
  [COUNTRY_CODES.ET]: <FormattedMessage id="countries.value.YBWaq9" />,
  [COUNTRY_CODES.FK]: <FormattedMessage id="countries.value.yEQiXi" />,
  [COUNTRY_CODES.FO]: <FormattedMessage id="countries.value.xYD4eI" />,
  [COUNTRY_CODES.FJ]: <FormattedMessage id="countries.value.ZXQatC" />,
  [COUNTRY_CODES.FI]: <FormattedMessage id="countries.value.sOgKGx" />,
  [COUNTRY_CODES.FR]: <FormattedMessage id="countries.value.Cp7VQx" />,
  [COUNTRY_CODES.GF]: <FormattedMessage id="countries.value.8iN7yF" />,
  [COUNTRY_CODES.PF]: <FormattedMessage id="countries.value.fnRpZo" />,
  [COUNTRY_CODES.TF]: <FormattedMessage id="countries.value.Z38U4f" />,
  [COUNTRY_CODES.GA]: <FormattedMessage id="countries.value.8Wym2e" />,
  [COUNTRY_CODES.GM]: <FormattedMessage id="countries.value.mTJwsH" />,
  [COUNTRY_CODES.PM_GZ]: <FormattedMessage id="countries.value.I1JM75" />,
  [COUNTRY_CODES.GE]: <FormattedMessage id="countries.value.HNweZU" />,
  [COUNTRY_CODES.DE]: <FormattedMessage id="countries.value.UfkhwK" />,
  [COUNTRY_CODES.GH]: <FormattedMessage id="countries.value.YTNBzV" />,
  [COUNTRY_CODES.GI]: <FormattedMessage id="countries.value.z2MJRz" />,
  [COUNTRY_CODES.GR]: <FormattedMessage id="countries.value.zGsymo" />,
  [COUNTRY_CODES.GL]: <FormattedMessage id="countries.value.3QRH37" />,
  [COUNTRY_CODES.GD]: <FormattedMessage id="countries.value.SFQc2Q" />,
  [COUNTRY_CODES.GP]: <FormattedMessage id="countries.value.2vQ1QI" />,
  [COUNTRY_CODES.GU]: <FormattedMessage id="countries.value.89QR9b" />,
  [COUNTRY_CODES.GT]: <FormattedMessage id="countries.value.rni1RE" />,
  [COUNTRY_CODES.GG]: <FormattedMessage id="countries.value.LUCAMH" />,
  [COUNTRY_CODES.GN]: <FormattedMessage id="countries.value.IFtQVW" />,
  [COUNTRY_CODES.GW]: <FormattedMessage id="countries.value.HPH9fY" />,
  [COUNTRY_CODES.GY]: <FormattedMessage id="countries.value.ZxYyyY" />,
  [COUNTRY_CODES.HT]: <FormattedMessage id="countries.value.Xw61AD" />,
  [COUNTRY_CODES.HM]: <FormattedMessage id="countries.value.BtS5cf" />,
  [COUNTRY_CODES.VA]: <FormattedMessage id="countries.value.NF9n3j" />,
  [COUNTRY_CODES.HN]: <FormattedMessage id="countries.value.PMXajq" />,
  [COUNTRY_CODES.HK]: <FormattedMessage id="countries.value.aDIXRF" />,
  [COUNTRY_CODES.HU]: <FormattedMessage id="countries.value.UDZoZt" />,
  [COUNTRY_CODES.IS]: <FormattedMessage id="countries.value.t6Ps1Y" />,
  [COUNTRY_CODES.IN]: <FormattedMessage id="countries.value.nHgeFH" />,
  [COUNTRY_CODES.ID]: <FormattedMessage id="countries.value.zg1W5S" />,
  [COUNTRY_CODES.IR]: <FormattedMessage id="countries.value.bE4s3d" />,
  [COUNTRY_CODES.IQ]: <FormattedMessage id="countries.value.phUeLg" />,
  [COUNTRY_CODES.IE]: <FormattedMessage id="countries.value.3sJmB9" />,
  [COUNTRY_CODES.IM]: <FormattedMessage id="countries.value.zQqg2Y" />,
  [COUNTRY_CODES.IL]: <FormattedMessage id="countries.value.f436l6" />,
  [COUNTRY_CODES.IT]: <FormattedMessage id="countries.value.nfQD62" />,
  [COUNTRY_CODES.JM]: <FormattedMessage id="countries.value.wxzwNA" />,
  [COUNTRY_CODES.JP]: <FormattedMessage id="countries.value.BBGRn5" />,
  [COUNTRY_CODES.JE]: <FormattedMessage id="countries.value.3GFzPk" />,
  [COUNTRY_CODES.JO]: <FormattedMessage id="countries.value.e6Wd7m" />,
  [COUNTRY_CODES.KZ]: <FormattedMessage id="countries.value.cydww9" />,
  [COUNTRY_CODES.KE]: <FormattedMessage id="countries.value.ADnPQ8" />,
  [COUNTRY_CODES.KI]: <FormattedMessage id="countries.value.pF7x8Q" />,
  [COUNTRY_CODES.XK]: <FormattedMessage id="countries.value.K0t4Se" />,
  [COUNTRY_CODES.KW]: <FormattedMessage id="countries.value.uft9BA" />,
  [COUNTRY_CODES.KG]: <FormattedMessage id="countries.value.OA1GEx" />,
  [COUNTRY_CODES.LA]: <FormattedMessage id="countries.value.Kh0tBR" />,
  [COUNTRY_CODES.LV]: <FormattedMessage id="countries.value.m8aZ3x" />,
  [COUNTRY_CODES.LB]: <FormattedMessage id="countries.value.ox3yk8" />,
  [COUNTRY_CODES.LS]: <FormattedMessage id="countries.value.ClzgpO" />,
  [COUNTRY_CODES.LR]: <FormattedMessage id="countries.value.8qwLyC" />,
  [COUNTRY_CODES.LY]: <FormattedMessage id="countries.value.sOPcX5" />,
  [COUNTRY_CODES.LI]: <FormattedMessage id="countries.value.q7rMzU" />,
  [COUNTRY_CODES.LT]: <FormattedMessage id="countries.value.4yB6WP" />,
  [COUNTRY_CODES.LU]: <FormattedMessage id="countries.value.OJmkia" />,
  [COUNTRY_CODES.MO]: <FormattedMessage id="countries.value.lLlVhL" />,
  [COUNTRY_CODES.MK]: <FormattedMessage id="countries.value.xO03N2" />,
  [COUNTRY_CODES.MG]: <FormattedMessage id="countries.value.lO1ECh" />,
  [COUNTRY_CODES.MW]: <FormattedMessage id="countries.value.LHHT7D" />,
  [COUNTRY_CODES.MY]: <FormattedMessage id="countries.value.B6wwNM" />,
  [COUNTRY_CODES.MV]: <FormattedMessage id="countries.value.GOnBXp" />,
  [COUNTRY_CODES.ML]: <FormattedMessage id="countries.value.9dcmzm" />,
  [COUNTRY_CODES.MT]: <FormattedMessage id="countries.value.Exr0dF" />,
  [COUNTRY_CODES.MH]: <FormattedMessage id="countries.value.qtKWca" />,
  [COUNTRY_CODES.MQ]: <FormattedMessage id="countries.value.Uy1kuZ" />,
  [COUNTRY_CODES.MR]: <FormattedMessage id="countries.value.Xs8704" />,
  [COUNTRY_CODES.MU]: <FormattedMessage id="countries.value.KarOaW" />,
  [COUNTRY_CODES.YT]: <FormattedMessage id="countries.value.HSbgoD" />,
  [COUNTRY_CODES.MX]: <FormattedMessage id="countries.value.Fk6nt3" />,
  [COUNTRY_CODES.FM]: <FormattedMessage id="countries.value.913A59" />,
  [COUNTRY_CODES.MD]: <FormattedMessage id="countries.value.GDBSQi" />,
  [COUNTRY_CODES.MC]: <FormattedMessage id="countries.value.2XlHuX" />,
  [COUNTRY_CODES.MN]: <FormattedMessage id="countries.value.dF6dis" />,
  [COUNTRY_CODES.ME]: <FormattedMessage id="countries.value.TquBsJ" />,
  [COUNTRY_CODES.MS]: <FormattedMessage id="countries.value.oiDPDW" />,
  [COUNTRY_CODES.MA]: <FormattedMessage id="countries.value.XU9E7G" />,
  [COUNTRY_CODES.MZ]: <FormattedMessage id="countries.value.AjhnL9" />,
  [COUNTRY_CODES.MM]: <FormattedMessage id="countries.value.2yPPjY" />,
  [COUNTRY_CODES.NA]: <FormattedMessage id="countries.value.Y0NlAe" />,
  [COUNTRY_CODES.NR]: <FormattedMessage id="countries.value.VRPiX5" />,
  [COUNTRY_CODES.NP]: <FormattedMessage id="countries.value.JBi8cq" />,
  [COUNTRY_CODES.NL]: <FormattedMessage id="countries.value.jwQ7ij" />,
  [COUNTRY_CODES.NT]: <FormattedMessage id="countries.value.r6TjLL" />,
  [COUNTRY_CODES.NC]: <FormattedMessage id="countries.value.ry4g2M" />,
  [COUNTRY_CODES.NZ]: <FormattedMessage id="countries.value.Q8vA3I" />,
  [COUNTRY_CODES.NI]: <FormattedMessage id="countries.value.23LsMa" />,
  [COUNTRY_CODES.NE]: <FormattedMessage id="countries.value.o6z6Jm" />,
  [COUNTRY_CODES.NG]: <FormattedMessage id="countries.value.QkSBcS" />,
  [COUNTRY_CODES.NU]: <FormattedMessage id="countries.value.hWhR7B" />,
  [COUNTRY_CODES.NF]: <FormattedMessage id="countries.value.pyNEkf" />,
  [COUNTRY_CODES.KP]: <FormattedMessage id="countries.value.Bflt2c" />,
  [COUNTRY_CODES.PM_ND]: <FormattedMessage id="countries.value.HYFqiU" />,
  [COUNTRY_CODES.MP]: <FormattedMessage id="countries.value.CMFgFC" />,
  [COUNTRY_CODES.NO]: <FormattedMessage id="countries.value.wxK180" />,
  [COUNTRY_CODES.OM]: <FormattedMessage id="countries.value.pRK02J" />,
  [COUNTRY_CODES.OTHER]: <FormattedMessage id="countries.value.f9cHhE" />,
  [COUNTRY_CODES.PK]: <FormattedMessage id="countries.value.uM8Vaj" />,
  [COUNTRY_CODES.PW]: <FormattedMessage id="countries.value.MOIHvu" />,
  [COUNTRY_CODES.PS]: <FormattedMessage id="countries.value.y041VO" />,
  [COUNTRY_CODES.PA]: <FormattedMessage id="countries.value.EBC6ep" />,
  [COUNTRY_CODES.PG]: <FormattedMessage id="countries.value.UNxGeL" />,
  [COUNTRY_CODES.PM_PI]: <FormattedMessage id="countries.value.ycp1DX" />,
  [COUNTRY_CODES.PY]: <FormattedMessage id="countries.value.KZ5Zfa" />,
  [COUNTRY_CODES.PE]: <FormattedMessage id="countries.value.qBH9f7" />,
  [COUNTRY_CODES.PH]: <FormattedMessage id="countries.value.wkUdBT" />,
  [COUNTRY_CODES.PN]: <FormattedMessage id="countries.value.tCz5bZ" />,
  [COUNTRY_CODES.PL]: <FormattedMessage id="countries.value.M6VQvs" />,
  [COUNTRY_CODES.PT]: <FormattedMessage id="countries.value.OPphgN" />,
  [COUNTRY_CODES.PR]: <FormattedMessage id="countries.value.4B8oPY" />,
  [COUNTRY_CODES.QA]: <FormattedMessage id="countries.value.Qp70LC" />,
  [COUNTRY_CODES.RE]: <FormattedMessage id="countries.value.5eL3gK" />,
  [COUNTRY_CODES.RO]: <FormattedMessage id="countries.value.hLo1eK" />,
  [COUNTRY_CODES.RU]: <FormattedMessage id="countries.value.sz1yAD" />,
  [COUNTRY_CODES.RW]: <FormattedMessage id="countries.value.W08qdq" />,
  [COUNTRY_CODES.BL]: <FormattedMessage id="countries.value.fmSSFF" />,
  [COUNTRY_CODES.SH]: <FormattedMessage id="countries.value.WgvLu8" />,
  [COUNTRY_CODES.KN]: <FormattedMessage id="countries.value.TGqvUC" />,
  [COUNTRY_CODES.LC]: <FormattedMessage id="countries.value.99APra" />,
  [COUNTRY_CODES.MF]: <FormattedMessage id="countries.value.ImFCEw" />,
  [COUNTRY_CODES.PM]: <FormattedMessage id="countries.value.2pYGGX" />,
  [COUNTRY_CODES.VC]: <FormattedMessage id="countries.value.tG9awj" />,
  [COUNTRY_CODES.WS]: <FormattedMessage id="countries.value.Wo1qLw" />,
  [COUNTRY_CODES.SM]: <FormattedMessage id="countries.value.LqgGin" />,
  [COUNTRY_CODES.ST]: <FormattedMessage id="countries.value.LKF5bg" />,
  [COUNTRY_CODES.SA]: <FormattedMessage id="countries.value.j9QBnT" />,
  [COUNTRY_CODES.SN]: <FormattedMessage id="countries.value.F8QQDe" />,
  [COUNTRY_CODES.RS]: <FormattedMessage id="countries.value.5YVxX2" />,
  [COUNTRY_CODES.SC]: <FormattedMessage id="countries.value.7qGAw7" />,
  [COUNTRY_CODES.SL]: <FormattedMessage id="countries.value.1IHyeD" />,
  [COUNTRY_CODES.SG]: <FormattedMessage id="countries.value.EfNjIK" />,
  [COUNTRY_CODES.SX]: <FormattedMessage id="countries.value.JegcrQ" />,
  [COUNTRY_CODES.SK]: <FormattedMessage id="countries.value.WrQs0x" />,
  [COUNTRY_CODES.SI]: <FormattedMessage id="countries.value.2eUXbA" />,
  [COUNTRY_CODES.SB]: <FormattedMessage id="countries.value.BC0Ro5" />,
  [COUNTRY_CODES.SO]: <FormattedMessage id="countries.value.NLyrmg" />,
  [COUNTRY_CODES.ZA]: <FormattedMessage id="countries.value.YN1gDp" />,
  [COUNTRY_CODES.GS]: <FormattedMessage id="countries.value.OCIpVv" />,
  [COUNTRY_CODES.KR]: <FormattedMessage id="countries.value.QdIjNn" />,
  [COUNTRY_CODES.SS]: <FormattedMessage id="countries.value.jIDc6k" />,
  [COUNTRY_CODES.ES]: <FormattedMessage id="countries.value.2Z4ySo" />,
  [COUNTRY_CODES.LK]: <FormattedMessage id="countries.value.e4F7lu" />,
  [COUNTRY_CODES.SD]: <FormattedMessage id="countries.value.BKr5jc" />,
  [COUNTRY_CODES.SR]: <FormattedMessage id="countries.value.kIIR59" />,
  [COUNTRY_CODES.SJ]: <FormattedMessage id="countries.value.2b43YV" />,
  [COUNTRY_CODES.SZ]: <FormattedMessage id="countries.value.doGv3h" />,
  [COUNTRY_CODES.SE]: <FormattedMessage id="countries.value.mtgwCt" />,
  [COUNTRY_CODES.CH]: <FormattedMessage id="countries.value.XBbs32" />,
  [COUNTRY_CODES.SY]: <FormattedMessage id="countries.value.AGLlbg" />,
  [COUNTRY_CODES.TW]: <FormattedMessage id="countries.value.wrCQeu" />,
  [COUNTRY_CODES.TJ]: <FormattedMessage id="countries.value.Buxmxj" />,
  [COUNTRY_CODES.TZ]: <FormattedMessage id="countries.value.qI7LGv" />,
  [COUNTRY_CODES.TH]: <FormattedMessage id="countries.value.Dvx3vd" />,
  [COUNTRY_CODES.PM_TI]: <FormattedMessage id="countries.value.ZVsU8j" />,
  [COUNTRY_CODES.TG]: <FormattedMessage id="countries.value.KyNgFN" />,
  [COUNTRY_CODES.TK]: <FormattedMessage id="countries.value.BRxJGY" />,
  [COUNTRY_CODES.TO]: <FormattedMessage id="countries.value.0mmW1S" />,
  [COUNTRY_CODES.TT]: <FormattedMessage id="countries.value.w8Nv2t" />,
  [COUNTRY_CODES.TN]: <FormattedMessage id="countries.value.urVpqs" />,
  [COUNTRY_CODES.TR]: <FormattedMessage id="countries.value.zz2AXO" />,
  [COUNTRY_CODES.TM]: <FormattedMessage id="countries.value.zlUqut" />,
  [COUNTRY_CODES.TC]: <FormattedMessage id="countries.value.vZA8wq" />,
  [COUNTRY_CODES.TV]: <FormattedMessage id="countries.value.1Pdsxw" />,
  [COUNTRY_CODES.UG]: <FormattedMessage id="countries.value.glJAeg" />,
  [COUNTRY_CODES.UA]: <FormattedMessage id="countries.value.QV8aph" />,
  [COUNTRY_CODES.AE]: <FormattedMessage id="countries.value.bqpCYe" />,
  [COUNTRY_CODES.SU]: <FormattedMessage id="countries.value.YBsZcA" />,
  [COUNTRY_CODES.GB]: <FormattedMessage id="countries.value.U4cwYh" />,
  [COUNTRY_CODES.UM]: <FormattedMessage id="countries.value.kNx3Qe" />,
  [COUNTRY_CODES.UY]: <FormattedMessage id="countries.value.38sXTB" />,
  [COUNTRY_CODES.UZ]: <FormattedMessage id="countries.value.sfx107" />,
  [COUNTRY_CODES.VU]: <FormattedMessage id="countries.value.046c2g" />,
  [COUNTRY_CODES.VE]: <FormattedMessage id="countries.value.vDHxxi" />,
  [COUNTRY_CODES.VN]: <FormattedMessage id="countries.value.ii3sFO" />,
  [COUNTRY_CODES.VG]: <FormattedMessage id="countries.value.JuuGAk" />,
  [COUNTRY_CODES.VI]: <FormattedMessage id="countries.value.dNt55u" />,
  [COUNTRY_CODES.WF]: <FormattedMessage id="countries.value.HeFOgM" />,
  [COUNTRY_CODES.EH]: <FormattedMessage id="countries.value.JWnOfM" />,
  [COUNTRY_CODES.YE]: <FormattedMessage id="countries.value.uqyj77" />,
  [COUNTRY_CODES.YU]: <FormattedMessage id="countries.value.HxEkSM" />,
  [COUNTRY_CODES.ZR]: <FormattedMessage id="countries.value.C9UtyV" />,
  [COUNTRY_CODES.ZM]: <FormattedMessage id="countries.value.ehBCIP" />,
  [COUNTRY_CODES.ZW]: <FormattedMessage id="countries.value.OyYj17" />,
};

export const COUNTRY_TYPES = Object.entries(COUNTRIES).map((country) => (
  { value: country[0], label: country[1] }
));

export const NON_ACORD_CODES = [
  COUNTRY_CODES.PM_IC,
  COUNTRY_CODES.PM_GZ,
  COUNTRY_CODES.PM_ND,
  COUNTRY_CODES.PM_PI,
  COUNTRY_CODES.PM_TI,
];

export const ACORD_COUNTRY_TYPES = COUNTRY_TYPES.filter((country) => {
  return !NON_ACORD_CODES.includes(country.value);
});

export const TRAVEL_COUNTRY_TYPES_BMO = COUNTRY_TYPES.filter(country => {
  return country.value !== COUNTRY_CODES.CA &&
    country.value !== COUNTRY_CODES.US &&
    country.value !== COUNTRY_CODES.MX;
});

export const TRAVEL_COUNTRY_TYPES_MANU = COUNTRY_TYPES.filter(country => {
  return country.value !== COUNTRY_CODES.CA && country.value !== COUNTRY_CODES.US;
});

export const BORROW_SOURCES = [
  { value: 'bank', label: 'Bank' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'mortgage_lender', label: 'Mortgage Lender' },
  { value: 'other', label: 'Other' },
];

export const HEALTHCARE_REASONS = [
  { label: 'Physical or check-up', value: 'physical' },
  { label: 'Prescription renewal', value: 'prescription_renewal' },
  { label: 'Vaccination or Immunization', value: 'vaccination_or_immunization' },
  { label: 'Cold or flu', value: 'cold_or_flu' },
  { label: 'Other', value: 'other' },
];

export const HEALTHCARE_RESULTS = [
  { label: 'Normal', value: 'normal' },
  { label: 'Normal with ongoing follow-up', value: 'normal_with_followup' },
  { label: 'Abnormal', value: 'abnormal' },
];

// should match class CrmSyncTypes(enum.Enum): in consts.py in life-libpy-consts
export const CRM_SYNC_TYPES = {
  NONE: 0,
  // CONTACT_PROPERTIES: 1, // deprecated for upserts
  // LIFE_DEAL_PROPERTIES: 2, // deprecated for upserts
  PATCH_CONTACT: 3,
  PATCH_DEAL: 4,
  UPSERT_CONTACT: 5,
  UPSERT_CONTACT_DEAL: 6,
  LIFE_DEAL_PROPERTIES_JOINT: 7,
  REVIEW_WITH_ADVISOR: 100,
  SUBMIT_LIFE_APP: 101,
  SUBMIT_FOLLOWUP: 102,
  // REVIEW_WITH_ADVISOR_TASK: 1000, // not used on front-end
  // SUBMIT_LIFE_APP_TASK: 1001, // not used on front-end
};

export const TIME_REF = {
  NONE: 'none',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

export const YEARS_TYPES = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
  { label: '25', value: 25 },
  { label: '26', value: 26 },
  { label: '27', value: 27 },
  { label: '28', value: 28 },
  { label: '29', value: 29 },
  { label: '30', value: 30 },
  { label: '31', value: 31 },
  { label: '32', value: 32 },
  { label: '33', value: 33 },
  { label: '34', value: 34 },
  { label: '35', value: 35 },
  { label: '36', value: 36 },
  { label: '37', value: 37 },
  { label: '38', value: 38 },
  { label: '39', value: 39 },
  { label: '40', value: 40 },
  { label: '41', value: 41 },
  { label: '42', value: 42 },
  { label: '43', value: 43 },
  { label: '44', value: 44 },
  { label: '45', value: 45 },
  { label: '46', value: 46 },
  { label: '47', value: 47 },
  { label: '48', value: 48 },
  { label: '49', value: 49 },
  { label: '50', value: 50 },
  { label: '51', value: 51 },
  { label: '52', value: 52 },
  { label: '53', value: 53 },
  { label: '54', value: 54 },
  { label: '55', value: 55 },
  { label: '56', value: 56 },
  { label: '57', value: 57 },
  { label: '58', value: 58 },
  { label: '59', value: 59 },
  { label: '60', value: 60 },
  { label: '61', value: 61 },
  { label: '62', value: 62 },
  { label: '63', value: 63 },
  { label: '64', value: 64 },
  { label: '65', value: 65 },
  { label: '66', value: 66 },
  { label: '67', value: 67 },
  { label: '68', value: 68 },
  { label: '69', value: 69 },
  { label: '70', value: 70 },
  { label: '71', value: 71 },
  { label: '72', value: 72 },
  { label: '73', value: 73 },
  { label: '74', value: 74 },
  { label: '75', value: 75 },
  { label: '76', value: 76 },
  { label: '77', value: 77 },
  { label: '78', value: 78 },
  { label: '79', value: 79 },
  { label: '80', value: 80 },
  { label: '81', value: 81 },
  { label: '82', value: 82 },
  { label: '83', value: 83 },
  { label: '84', value: 84 },
  { label: '85', value: 85 },
  { label: '86', value: 86 },
  { label: '87', value: 87 },
  { label: '88', value: 88 },
  { label: '89', value: 89 },
  { label: '90', value: 90 },
  { label: '91', value: 91 },
  { label: '92', value: 92 },
  { label: '93', value: 93 },
  { label: '94', value: 94 },
  { label: '95', value: 95 },
  { label: '96', value: 96 },
  { label: '97', value: 97 },
  { label: '98', value: 98 },
  { label: '99', value: 99 },
  { label: '100', value: 100 },
];

// fields that are just for the application, subset of the CRM_LIFE_SESSION_FIELDS
// enum which is all deal fields
export const APP_FORM_FIELDS = {
  ADDRESS_LINE1: 'address_line1',
  ADDRESS_LINE2: 'address_line2',
  ALCOHOL_NUM_DRINKS: 'alcohol_num_drinks',
  ALCOHOL_DRUG_ABUSE: 'alcohol_drug_abuse',
  ALCOHOL_FLAG: 'alcohol_flag',
  ALCOHOL_FREQUENCY: 'alcohol_frequency',
  ALCOHOL_TYPE_BEER: 'alcohol_type_beer',
  ALCOHOL_TYPE_LIQUOR: 'alcohol_type_liquor',
  ALCOHOL_TYPE_WINE: 'alcohol_type_wine',
  ARRESTED: 'arrested',
  ARRESTED_DETAILS: 'arrested_details',
  BANKRUPTCY: 'bankruptcy',
  BANKRUPTCY_DETAILS: 'bankruptcy_details',
  BENEFICIARIES_SECONDARY_FLAG: 'beneficiaries_secondary_flag',
  BENEFICIARIES: 'beneficiaries',
  BIRTHPLACE: 'birthplace',
  BIRTHPLACE_PROVSTATE: 'birthplace_provstate',
  BORROWED: 'borrowed',
  BORROWED_DETAILS: 'borrowed_details',
  BUSINESS_TYPE: 'business_type',
  CANADIAN_TAXES: 'canadian_taxes',
  CITY: 'city',
  COUNTRY: 'country',
  DRIVERS_LICENSE_FLAG: 'drivers_license_flag',
  DRIVING_CONVICTION_ALCOHOL_ML: 'driving_conviction_alcohol_ML',
  DRIVING_CONVICTION_ALCOHOL_DETAILS_ML: 'driving_conviction_alcohol_details_ML',
  DRIVING_CONVICTION_DANGEROUS_ML: 'driving_conviction_dangerous_ML',
  DRIVING_CONVICTION_DANGEROUS_DETAILS_ML: 'driving_conviction_dangerous_details_ML',
  DRIVING_CONVICTION_VIOLATION_ML: 'driving_conviction_violation_ML',
  DRIVING_CONVICTION_VIOLATION_DETAILS_ML: 'driving_conviction_violation_details_ML',
  DRIVING_CONVICTION_VIOLATION_BMO: 'driving_conviction_violation_BMO',
  DRIVING_CONVICTION_VIOLATION_DETAILS_BMO: 'driving_conviction_violation_details_BMO',
  DRIVING_CONVICTION_DANGEROUS_5_BMO: 'driving_conviction_dangerous_5_BMO',
  DRIVING_CONVICTION_DANGEROUS_5_DETAILS_BMO: 'driving_conviction_dangerous_5_details_BMO',
  DRIVING_CONVICTION_DANGEROUS_10_BMO: 'driving_conviction_dangerous_10_BMO',
  DRIVING_CONVICTION_DANGEROUS_10_DETAILS_BMO: 'driving_conviction_dangerous_10_details_BMO',
  DRIVING_CONVICTION_VIOLATION_WW: 'driving_conviction_violation_WW',
  DRIVING_CONVICTION_VIOLATION_DETAILS_WW: 'driving_conviction_violation_details_WW',
  DRIVING_CONVICTION_DANGEROUS_5_WW: 'driving_conviction_dangerous_5_WW',
  DRIVING_CONVICTION_DANGEROUS_5_DETAILS_WW: 'driving_conviction_dangerous_5_details_WW',
  DRIVING_CONVICTION_DUI_20_WW: 'driving_conviction_dui_WW',
  DRIVING_CONVICTION_DUI_20_DETAILS_WW: 'driving_conviction_dui_details_WW',
  EMPLOYED: 'employed',
  EMPLOYER: 'employer',
  EMPLOYER_CITY: 'employer_city',
  EMPLOYMENT_STATUS: 'employment_status',
  EMPLOYMENT_STATUS_OTHER: 'employment_status_other',
  EVER_DECLINED_RATED: 'ever_declined_rated',
  EVER_DECLINED_RATED_DETAILS: 'ever_declined_rated_details',
  EXISTING_POLICIES_INFORCE_FLAG: 'existing_policies_inforce_flag',
  EXISTING_POLICIES_PENDING_FLAG: 'existing_policies_pending_flag',
  EXISTING_POLICIES_PENDING_KEEPING_FLAG: 'existing_policies_pending_keeping_flag', // For PM product, we only care about pending keeping policies
  EXISTING_POLICIES_REPLACING_FLAG: 'existing_policies_replacing_flag',
  EXISTING_POLICIES: 'existing_policies',
  EXPERIMENT_DRUGS: 'experiment_drugs',
  EXPERIMENT_DRUGS_DETAILS: 'experiment_drugs_details',
  EXTREME: 'extreme',
  EXTREME_FLAG: 'extreme_flag',
  FINANCIAL_DIFFICULTIES: 'financial_difficulties',
  FINANCIAL_DIFFICULTIES_DETAILS: 'financial_difficulties_details',
  HEALTH_PROVIDER_FLAG: 'health_provider_flag',
  HEALTH_PROVIDER_PHONE_NUMBER: 'health_provider_phone_number',
  HEALTHCARE_PROVIDER: 'healthcare_provider',
  HEALTHCARE_PROVIDER_CITY: 'healthcare_provider_city',
  HEALTHCARE_PROVIDER_MONTH: 'healthcare_provider_month',
  HEALTHCARE_PROVIDER_YEAR: 'healthcare_provider_year',
  HEALTHCARE_VISIT_FLAG: 'healthcare_visit_flag',
  HEALTHCARE_VISIT_HAS_MEDS: 'healthcare_visit_has_meds',
  HEALTHCARE_VISIT_MEDS: 'healthcare_visit_meds',
  HEALTHCARE_VISIT_REASON: 'healthcare_visit_reason',
  HEALTHCARE_VISIT_REASON_DETAILS: 'healthcare_visit_reason_details',
  HEALTHCARE_VISIT_RESULT: 'healthcare_visit_result',
  HEALTHCARE_VISIT_RESULT_DETAILS: 'healthcare_visit_result_details',
  HEIGHT_FEET: 'height_feet',
  HEIGHT_INCHES: 'height_inches',
  IDENTIFICATION_EXPIRY_DATE: 'identification_expiry_date',
  IDENTIFICATION_NUMBER: 'identification_number',
  IDENTIFICATION_PLACE_OF_ISSUE: 'identification_place_of_issue',
  IDENTIFICATION_TYPE: 'identification_type',
  IS_PILOT: 'is_pilot',
  IS_PILOT_WW: 'is_pilot_WW',
  LICENSE: 'license',
  LICENSE_SUSPENDED: 'license_suspended',
  LICENSE_SUSPENDED_DETAILS: 'license_suspended_details',
  MAX_ELIGIBILITY_FLAG: 'max_eligibility_flag',
  MORTGAGE_BALANCE_OVERRIDE: 'mortgage_balance_override',
  OCCUPATION: 'occupation',
  OCCUPATION_CHANGE: 'occupation_change',
  OTHER_DEBTS_OVERRIDE: 'other_debts_override',
  OTHER_INCOME_AMOUNT: 'other_income_amount',
  OTHER_INCOME_FLAG: 'other_income_flag',
  OTHER_INCOME_SOURCE: 'other_income_source',
  PERM_RES_DATE: 'perm_res_date',
  POSTAL_CODE: 'postal_code',
  PREVIOUS_COUNTRY_RESIDENCE: 'previous_country_residence',
  PRIMARY_RESIDENCE: 'primary_residence',
  PROVINCE: 'province',
  QUESTIONS: 'questions',
  RESIDENCY_STATUS: 'residency_status',
  RESIDENCY_APPLIED_PERM_RES: 'residency_applied_perm_res',
  RESIDENCY_CANADA_12MONTHS: 'residency_canada_12months',
  RESIDENCY_DOMESTIC_WORKER: 'residency_domestic_worker',
  RESIDENCY_FOREIGN_TRAINED_PHYSICIAN: 'residency_foreign_trained_physician',
  RESIDENCY_SKILLED_WORKER: 'residency_skilled_worker',
  TOBACCO_FLAG: 'tobacco_flag',
  TOBACCO_CHEWING: 'tobacco_chewing',
  TOBACCO_CHEWING_CURRENT: 'tobacco_chewing_current',
  TOBACCO_CHEWING_FREQUENCY: 'tobacco_chewing_frequency',
  TOBACCO_CHEWING_QUIT: 'tobacco_chewing_quit',
  TOBACCO_CIGARETTES: 'tobacco_cigarettes',
  TOBACCO_CIGARETTES_CURRENT: 'tobacco_cigarettes_current',
  TOBACCO_CIGARETTES_FREQUENCY: 'tobacco_cigarettes_frequency',
  TOBACCO_CIGARETTES_QUIT: 'tobacco_cigarettes_quit',
  TOBACCO_CIGARS_CIGARILLOS: 'tobacco_cigars_cigarillos',
  TOBACCO_CIGARS_CIGARILLOS_CURRENT: 'tobacco_cigars_cigarillos_current',
  TOBACCO_CIGARS_CIGARILLOS_FREQUENCY: 'tobacco_cigars_cigarillos_frequency',
  TOBACCO_CIGARS_CIGARILLOS_QUIT: 'tobacco_cigars_cigarillos_quit',
  TOBACCO_E_CIGARETTES: 'tobacco_e_cigarettes',
  TOBACCO_E_CIGARETTES_CURRENT: 'tobacco_e_cigarettes_current',
  TOBACCO_E_CIGARETTES_FREQUENCY: 'tobacco_e_cigarettes_frequency',
  TOBACCO_E_CIGARETTES_QUIT: 'tobacco_e_cigarettes_quit',
  TOBACCO_MARIJUANA: 'tobacco_marijuana',
  TOBACCO_MARIJUANA_CURRENT: 'tobacco_marijuana_current',
  TOBACCO_MARIJUANA_FREQUENCY: 'tobacco_marijuana_frequency',
  TOBACCO_MARIJUANA_QUIT: 'tobacco_marijuana_quit',
  TOBACCO_MARIJUANA_USE: 'tobacco_marijuana_use',
  TOBACCO_PIPES: 'tobacco_pipes',
  TOBACCO_PIPES_CURRENT: 'tobacco_pipes_current',
  TOBACCO_PIPES_FREQUENCY: 'tobacco_pipes_frequency',
  TOBACCO_PIPES_QUIT: 'tobacco_pipes_quit',
  TOBACCO_SUBSTITUTES: 'tobacco_substitutes',
  TOBACCO_SUBSTITUTES_CURRENT: 'tobacco_substitutes_current',
  TOBACCO_SUBSTITUTES_FREQUENCY: 'tobacco_substitutes_frequency',
  TOBACCO_SUBSTITUTES_QUIT: 'tobacco_substitutes_quit',
  TRAVEL_FUTURE_TRIPS_FLAG: 'travel_future_trips_flag',
  TRAVEL_FUTURE_NON_URBAN_FLAG: 'travel_future_non_urban_flag',
  TRAVEL_FUTURE_NON_URBAN_DETAILS: 'travel_future_non_urban_details',
  TRAVEL_FUTURE_WAR_ZONE_FLAG: 'travel_future_war_zone_flag',
  TRAVEL_FUTURE_WAR_ZONE_DETAILS: 'travel_future_war_zone_details',
  TRAVEL_PAST_TRIPS_FLAG: 'travel_past_trips_flag',
  TRAVEL_TRIPS: 'travel_trips',
  TRUSTEE_FIRST_NAME: 'trustee_first_name',
  TRUSTEE_FLAG: 'trustee_flag',
  TRUSTEE_LAST_NAME: 'trustee_last_name',
  TRUSTEE_RELATIONSHIP: 'trustee_relationship',
  WEIGHT_CHANGE: 'weight_change',
  WEIGHT_CHANGE_DETAILS: 'weight_change_details',
  WEIGHT_LBS: 'weight_lbs',
  YEARS_AT_ADDRESS: 'years_at_address',
  YEARS_AT_EMPLOYER: 'years_at_employer',
} as const;

// CRM fields for contacts, should match CONTACT_FIELDS in life-libpy-consts
export const CRM_CONTACT_FIELDS = {
  APPLICATION_IN_PROGRESS: 'app_in_progress',
  APPLICATION_INSURER_PASSWORD: 'app_insurer_password',
  BIRTHDATE: 'birthdate',
  CREATION_TIME: 'creation_time',
  EMAIL: 'email',
  EMAIL_HASH: 'email_hash',
  INSURER_SEL: 'insurer_sel',
  IP_ADDRESS: 'ip_addr',
  LAST_SESSION_DATE: 'last_session_date',
  PHONE: 'phone',
  MODIFIED_TIME: 'modified_time',
  // OWNER = 'owner',
  POLICY_LEN: 'policy_len',
  PRICE_LOWEST: 'price_lowest',
  PRICE_SEL: 'price_sel',
  SPOUSE_INCOME_GT_USER: 'spouse_income_gt_user', // spouse income > user income,
  REBOOKING_LINK: 'rebooking_url',
  RECMD_LINK: 'recmd_url',
  REFERRAL_ID: 'referral_id',
  REFERRAL_MAX_NUM: 'referral_max_num',
  REFERRAL_MIN_NUM_MN_PREMS: 'referral_min_min_mn_prems',
  REFERRAL_MAX_NUM_MN_PREMS: 'referral_max_max_mn_prems',
  REFERRAL_EMAIL_URL: 'referral_email_url',
  REFERRAL_FACEBOOK_URL: 'referral_facebook_url',
  REVIEW_FLAG: 'review_flag',
  TOT_COV: 'tot_cov',
  SAVE_QUOTES_FLAG: 'save_quotes_flag',
  USER_FIRST_NAME: 'user_first_name',
  USER_LAST_NAME: 'user_last_name',
  QUOTES_COMPARISON_SAVINGS: 'quotes_comparison_savings',
  LAST_LOGIN_DATE: 'last_log_in_date',
};

// CRM fields for Deals, should match LIFE_SESSION_FIELDS in life-libpy-consts
export const CRM_LIFE_SESSION_FIELDS = {
  ADDRESS_LINE1: 'address_line1',
  ADDRESS_LINE2: 'address_line2',
  ALCOHOL_NUM_DRINKS: 'alcohol_num_drinks',
  ALCOHOL_DRUG_ABUSE: 'alcohol_drug_abuse',
  ALCOHOL_FLAG: 'alcohol_flag',
  ALCOHOL_FREQUENCY: 'alcohol_frequency',
  ALCOHOL_TYPE_BEER: 'alcohol_type_beer',
  ALCOHOL_TYPE_LIQUOR: 'alcohol_type_liquor',
  ALCOHOL_TYPE_WINE: 'alcohol_type_wine',
  APP_SENT_TO_CLIENT_DATE: 'app_sent_to_client_date',
  APP_SIGNED_BY_CLIENT_DATE: 'app_signed_by_client_date',
  APP_SIGNED_STATUS: 'app_signed_status',
  APPLICATION_SUBMITTED: 'app_submitted',
  APPLICATION_INSURER_PASSWORD: 'app_insurer_password',
  APPLICATION_INSURER_URL: 'app_insurer_url',
  APP_EMAIL_URL: 'app_email_url',
  APP_PASSCODE_METHOD: 'app_passcode_method',
  APP_AUTH_FAIL_REASON: 'app_auth_fail_reason',
  APP_AUTH_TIMESTAMP: 'app_auth_timestamp',
  APS_ORDERED_DATE: 'aps_ordered_date',
  APP_SMS_URL: 'app_sms_url',
  APS_RECEIVED_BY_INSURER_DATE: 'aps_received_by_insurer_date',
  ARRESTED: 'arrested',
  ARRESTED_DETAILS: 'arrested_details',
  BENEFICIARIES_PRI_DOBS: 'beneficiaries_pri_dobs',
  BENEFICIARIES_PRI_NAMES: 'beneficiaries_pri_names',
  BENEFICIARIES_PRI_PERCENTS: 'beneficiaries_pri_percents',
  BENEFICIARIES_PRI_RELATIONSHIPS: 'beneficiaries_pri_relationships',
  BENEFICIARIES_SECONDARY_FLAG: 'beneficiaries_secondary_flag',
  BENEFICIARIES_SEC_DOBS: 'beneficiaries_sec_dobs',
  BENEFICIARIES_SEC_NAMES: 'beneficiaries_sec_names',
  BENEFICIARIES_SEC_PERCENTS: 'beneficiaries_sec_percents',
  BENEFICIARIES_SEC_RELATIONSHIPS: 'beneficiaries_sec_relationships',
  BIRTHPLACE: 'birthplace',
  BIRTHPLACE_PROVSTATE: 'birthplace_provstate',
  BORROWED: 'borrowed',
  BORROWED_DETAILS: 'borrowed_details',
  BUSINESS_ADDRESS: 'business_address',
  BUSINESS_PHONE: 'business_phone',
  BUSINESS_TYPE: 'business_type',
  CANADIAN_TAXES: 'canadian_taxes',
  CHILDREN_AGES: 'children_ages',
  CITY: 'city',
  CLICKED_TO_REQUEST_A_NURSE_VISIT: 'clicked_to_request_a_nurse_visit',
  CORPORATION: 'corporation',
  COUNTRY: 'country',
  CREATION_TIME: 'creation_time',
  BREAKDOWN_DEBTS: 'breakdown_debts',
  BREAKDOWN_EXISTING_COVERAGE: 'breakdown_existing_coverage',
  BREAKDOWN_KIDS_EDUCATION_COSTS: 'breakdown_kids_education_costs',
  BREAKDOWN_KIDS_EXPENSES: 'breakdown_kids_expenses',
  BREAKDOWN_KIDS_HOUSING_COSTS: 'breakdown_kids_housing_costs',
  BREAKDOWN_NON_RETIREMENT_SAVINGS: 'breakdown_non_retirement_savings',
  BREAKDOWN_RTRMT_SAVINGS_AFTER_TAX: 'breakdown_rtrmt_savings_after_tax',
  BREAKDOWN_SPOUSE_EXPENSES: 'breakdown_spouse_expenses',
  BREAKDOWN_SPOUSE_FUTURE_INCOME: 'breakdown_spouse_future_income',
  BREAKDOWN_TOTAL_DEBTS: 'breakdown_total_debts',
  BREAKDOWN_TOTAL_EXPENSES: 'breakdown_total_expenses',
  BREAKDOWN_TOTAL_SAVINGS: 'breakdown_total_savings',
  CREDIT_CARD_DEBT: 'debts_credit_cards',
  DRIVER_LICENSE_EXP_DATE: 'driver_license_expiry_date',
  DRIVER_LICENSE_ISSUE_CITY: 'driver_license_issue_city',
  DRIVER_LICENSE_NUM: 'driver_license_num',
  DRIVERS_LICENSE_FLAG: 'drivers_license_flag',
  DRIVING: 'driving',
  DRIVING_CONVICTION_ALCOHOL_ML: 'driving_conviction_alcohol_ML',
  DRIVING_CONVICTION_ALCOHOL_DETAILS_ML: 'driving_conviction_alcohol_details_ML',
  DRIVING_CONVICTION_DANGEROUS_ML: 'driving_conviction_dangerous_ML',
  DRIVING_CONVICTION_DANGEROUS_DETAILS_ML: 'driving_conviction_dangerous_details_ML',
  DRIVING_CONVICTION_VIOLATION_ML: 'driving_conviction_violation_ML',
  DRIVING_CONVICTION_VIOLATION_DETAILS_ML: 'driving_conviction_violation_details_ML',
  DRIVING_CONVICTION_VIOLATION_BMO: 'driving_conviction_violation_BMO',
  DRIVING_CONVICTION_VIOLATION_DETAILS_BMO: 'driving_conviction_violation_details_BMO',
  DRIVING_CONVICTION_DANGEROUS_5_BMO: 'driving_conviction_dangerous_5_BMO',
  DRIVING_CONVICTION_DANGEROUS_5_DETAILS_BMO: 'driving_conviction_dangerous_5_details_BMO',
  DRIVING_CONVICTION_DANGEROUS_10_BMO: 'driving_conviction_dangerous_10_BMO',
  DRIVING_CONVICTION_DANGEROUS_10_DETAILS_BMO: 'driving_conviction_dangerous_10_details_BMO',
  DRIVING_CONVICTION_VIOLATION_WW: 'driving_conviction_violation_WW',
  DRIVING_CONVICTION_VIOLATION_DETAILS_WW: 'driving_conviction_violation_details_WW',
  DRIVING_CONVICTION_DANGEROUS_5_WW: 'driving_conviction_dangerous_5_WW',
  DRIVING_CONVICTION_DANGEROUS_5_DETAILS_WW: 'driving_conviction_dangerous_5_details_WW',
  DRIVING_CONVICTION_DUI_20_WW: 'driving_conviction_dui_WW',
  DRIVING_CONVICTION_DUI_20_DETAILS_WW: 'driving_conviction_dui_details_WW',
  DUI: 'dui',
  EMAIL: 'email',
  EMPLOYED: 'employed',
  EMPLOYER: 'employer',
  EMPLOYER_CITY: 'employer_city',
  EMPLOYMENT_STATUS: 'employment_status',
  EMPLOYMENT_STATUS_OTHER: 'employment_status_other',
  EVER_DECLINED_RATED: 'ever_declined_rated',
  EVER_DECLINED_RATED_DETAILS: 'ever_declined_rated_details',
  EXISTING_COV_GROUP: 'user_cov_group_amt',
  EXISTING_COV_INDI: 'user_cov_indi_amt',
  EXISTING_POLICIES_INFORCE_FLAG: 'existing_policies_inforce_flag',
  EXISTING_POLICIES_INFORCE_COMPANIES: 'existing_policies_inforce_companies',
  EXISTING_POLICIES_INFORCE_AMOUNTS: 'existing_policies_inforce_amounts',
  EXISTING_POLICIES_INFORCE_YEAR_ISSUED: 'existing_policies_inforce_year_issued',
  EXISTING_POLICIES_INFORCE_IS_REPLACING: 'existing_policies_inforce_is_replacing',
  EXISTING_POLICIES_INFORCE_REPLACING_REASONS: 'existing_policies_replacing_reasons',
  EXISTING_POLICIES_INFORCE_REPLACING_REASONS_OTHER: 'existing_policies_replacing_reasons_other',
  EXISTING_POLICIES_INFORCE_TYPES: 'existing_policies_inforce_types',
  EXISTING_POLICIES_INFORCE_TYPES_OTHER: 'existing_policies_inforce_types_other',
  EXISTING_POLICIES_REPLACING_FLAG: 'existing_policies_replacing_flag',
  EXISTING_POLICIES_PENDING_FLAG: 'existing_policies_pending_flag',
  EXISTING_POLICIES_PENDING_COMPANIES: 'existing_policies_pending_companies',
  EXISTING_POLICIES_PENDING_AMOUNTS: 'existing_policies_pending_amounts',
  EXISTING_POLICIES_PENDING_TYPES: 'existing_policies_pending_types',
  EXISTING_POLICIES_PENDING_TYPES_OTHER: 'existing_policies_pending_types_other',
  EXISTING_POLICIES_PENDING_KEEPING_FLAG: 'existing_policies_pending_keeping_flag',
  EXPERIMENT_DRUGS: 'experiment_drugs',
  EXPERIMENT_DRUGS_DETAILS: 'experiment_drugs_details',
  EXTREME: 'extreme',
  EXTREME_FLAG: 'extreme_flag',
  FOLLOWUP_INFO_NEEDED: 'followup_info_needed',
  FOLLOWUP_INFO_SENT_TO_CLIENT_DATE: 'followup_info_sent_to_client_date',
  FOLLOWUP_INFO_RETURNED_BY_CLIENT_DATE: 'followup_info_returned_by_client_date',
  FOLLOWUP_QUESTIONNAIRE_REQUIRED: 'followup_questionnaire_required',
  HEALTHCARE_PROVIDER: 'healthcare_provider',
  HEALTHCARE_PROVIDER_CITY: 'healthcare_provider_city',
  HEALTHCARE_PROVIDER_LAST_NAME: 'healthcare_provider_lastname',
  HEALTHCARE_PROVIDER_MONTH: 'healthcare_provider_month',
  HEALTHCARE_PROVIDER_YEAR: 'healthcare_provider_year',
  HEALTHCARE_VISIT_FLAG: 'healthcare_visit_flag',
  HEALTHCARE_VISIT_HAS_MEDS: 'healthcare_visit_has_meds',
  HEALTHCARE_VISIT_MEDS: 'healthcare_visit_meds',
  HEALTHCARE_VISIT_REASON: 'healthcare_visit_reason',
  HEALTHCARE_VISIT_REASON_DETAILS: 'healthcare_visit_reason_details',
  HEALTHCARE_VISIT_RESULT: 'healthcare_visit_result',
  HEALTHCARE_VISIT_RESULT_DETAILS: 'healthcare_visit_result_details',
  HEIGHT: 'height',
  HEIGHT_FEET: 'height_feet',
  HEIGHT_INCHES: 'height_inches',
  HOME_EQUITY_DEBT: 'debts_home_equity_loans',
  HOUSEHOLDID: 'hh_info_id',
  HOUSEHOLDID_VERSION: 'hh_info_id_vers',
  IDENTIFICATION_EXPIRY_DATE: 'identification_expiry_date',
  IDENTIFICATION_NUMBER: 'identification_number',
  IDENTIFICATION_PLACE_OF_ISSUE: 'identification_place_of_issue',
  IDENTIFICATION_TYPE: 'identification_type',
  INCLUDE_EDUCATION: 'cover_education',
  INCLUDE_HOUSING: 'cover_housing',
  INSURER_APP_AUTOMATION_ERROR_SEVERITY: 'insurer_app_automation_error_severity',
  INSURER_APP_AUTOMATION_ERROR_DETAILS: 'insurer_app_automation_error_details',
  INTERESTED_IN_CPP_FLAG: 'interested_in_cpp_flag',
  ISSUANCE_UW_DECISION_DATE: 'issuance_uw_decision_date',
  ISSUANCE_DELIVERY_REQS_DEADLINE_DATE: 'issuance_delivery_reqs_deadline_date',
  ISSUANCE_POLICY_DELIVERED_DATE: 'issuance_policy_delivered_date',
  ISSUANCE_DELIVERY_REQS_SENT_DATE: 'issuance_delivery_reqs_sent_date',
  ISSUANCE_DELIVERY_REQS_SIGNED_DATE: 'issuance_delivery_reqs_signed_date',
  ISSUANCE_PAPER_DELIVERY_FLAG: 'issuance_paper_delivery_flag',
  ISSUANCE_POLICY_SETTLED_DATE: 'issuance_policy_settled_date',
  ISSUANCE_POLICY_ISSUED_DATE: 'issuance_policy_issued_date',
  ISSUANCE_POLICY_WITHDRAWAL_DATE: 'issuance_policy_withdrawal_date',
  IS_PILOT: 'is_pilot',
  IS_PILOT_WW: 'is_pilot_WW',
  LICENSE: 'license',
  LINE_OF_CREDIT: 'debts_credit_line',
  LICENSE_SUSPENDED: 'license_suspended',
  LICENSE_SUSPENDED_DETAILS: 'license_suspended_details',
  LAST_ACTIVITY_TIME: 'last_activity_time',
  LEGAL_INTEREST: 'legal_interest',
  OWNER: 'owner',
  LIRD_REQUIRED_FLAG: 'lird_required_flag',
  LIRD_SENT_TO_CLIENT_DATE: 'lird_sent_to_client_date',
  LIRD_SIGNED_BY_CLIENT_DATE: 'lird_signed_by_client_date',
  MANUAL_FLAG: 'manual_flag',
  MAX_ELIGIBILITY_FLAG: 'max_eligibility_flag',
  MEDICAL_LAST_MODIFIED_DATETIME: 'medical_last_modified_datetime',
  MEDICAL_ADDRESS: 'medical_address',
  MEDICAL_LANGUAGE: 'medical_language',
  MEDICAL_INITIAL_REQS: 'medical_initial_reqs',
  MEDICAL_INITIAL_PREBOOK_DATE: 'medical_initial_prebook_date',
  MEDICAL_INITIAL_PREBOOK_DATE_STR: 'medical_initial_prebook_date_str',
  MEDICAL_INITIAL_SCHEDULED_DATE: 'medical_initial_scheduled_date',
  MEDICAL_INITIAL_SCHEDULED_DATE_STR: 'medical_initial_scheduled_date_str',
  MEDICAL_INITIAL_COMPLETED_DATE: 'medical_initial_completed_date',
  MEDICAL_INITIAL_CONFIRMED_DATE: 'medical_initial_confirmed_date',
  MEDICAL_INITIAL_MISSED_COUNT: 'medical_initial_missed_count',
  MEDICAL_ADDTL_REQS: 'medical_addtl_reqs',
  MEDICAL_ADDTL_PREBOOK_DATE: 'medical_addtl_prebook_date',
  MEDICAL_ADDTL_SCHEDULED_DATE: 'medical_addtl_scheduled_date',
  MEDICAL_ADDTL_SCHEDULED_DATE_STR: 'medical_addtl_scheduled_date_str',
  MEDICAL_ADDTL_COMPLETED_DATE: 'medical_addtl_completed_date',
  MEDICAL_ADDTL_CONFIRMED_DATE: 'medical_addtl_confirmed_date',
  MEDICAL_ADDTL_MISSED_COUNT: 'medical_addtl_missed_count',
  MINOR_HEALTH_COND_CL: 'minor_health_condition_CL',
  MINOR_HEALTH_COND_ML: 'minor_health_condition_ML',
  MODIFIED_TIME: 'modified_time',
  MORTGAGE_BALANCE: 'debts_mortgage',
  MORTGAGE_BALANCE_OVERRIDE: 'mortgage_balance_override',
  MVR_ORDERED_FLAG: 'mvr_ordered_flag',
  MVR_ORDERED_DATE: 'mvr_ordered_date',
  MVR_REQUEST_SENT_DATE: 'mvr_request_sent_date',
  MVR_RECEIVED_BY_INSURER_DATE: 'mvr_received_by_insurer_date',
  NET_WORTH: 'net_worth',
  NON_RETIREMENT_ASSETS: 'assets_non_retirement',
  NUM_CHILDREN: 'num_children',
  OCCUPATION: 'occupation',
  OCCUPATION_CHANGE: 'occupation_change',
  OCCUPATION_DUTIES: 'occupation_duties',
  OTHER_DEBT: 'debts_other',
  OTHER_INCOME_AMOUNT: 'other_income_amount',
  OTHER_INCOME_FLAG: 'other_income_flag',
  OTHER_INCOME_SOURCE: 'other_income_source',
  PAYMENT_SOURCE: 'payment_source',
  PHONE: 'phone',
  PRODUCT_ADDED: 'product_added',
  POLICY_HEALTHCLASS: 'policy_healthclass',
  POLICY_NUM: 'policy_num',
  POLICY_PAYMENT_ISSUE: 'policy_payment_issue',
  POLICY_RATING: 'policy_rating',
  POLICY_SIGNED_STATUS: 'policy_signed_status',
  POLICY_STATUS: 'policy_status',
  MONTHLY_PAYMENT_DAY: 'monthly_payment_day',
  ANNUAL_PAYMENT_DAY: 'annual_payment_day',
  ANNUAL_PAYMENT_DAY_CLIENT_FACING: 'annual_payment_day_client_facing',
  POSTAL_CODE: 'postal_code',
  PREVIOUS_COUNTRY_RESIDENCE: 'previous_country_residence',
  PRIMARY_RESIDENCE: 'primary_residence',
  PRODUCT_OFFERED_CROSS_SELL: 'product_offered_cross_sell',
  PROVINCE: 'province',
  QUESTIONS: 'questions',
  REBOOKING_LINK: 'rebooking_url',
  RECMD_EXP_CHILDCARE: 'recmd_exps_childcare',
  RECMD_EXP_DISC: 'recmd_exps_disc',
  RECMD_EXP_FOOD: 'recmd_exps_food',
  RECMD_EXP_OTHER: 'recmd_exps_other',
  RECMD_EXP_RESIDENCE: 'recmd_exps_residence',
  RECMD_EXP_SHOPPING: 'recmd_exps_shopping',
  RECMD_EXP_TELECOM: 'recmd_exps_telecom',
  RECMD_EXP_TOTAL: 'recmd_exps_total',
  RECMD_EXP_TRANS: 'recmd_exps_trans',
  RECMD_EXP_UTILITIES: 'recmd_exps_utilities',
  RECMD_LINK: 'recmd_url',
  RECMD_REASON_WHY: 'recmd_reason_why',
  QUOTE1_COMPANY: 'quote1_company',
  RECMD_QUOTE1_MN_PREM: 'recmd_quote1_mn_prem',
  QUOTE2_COMPANY: 'quote2_company',
  RECMD_QUOTE2_MN_PREM: 'recmd_quote2_mn_prem',
  QUOTE3_COMPANY: 'quote3_company',
  RECMD_QUOTE3_MN_PREM: 'recmd_quote3_mn_prem',
  QUOTE4_COMPANY: 'quote4_company',
  RECMD_QUOTE4_MN_PREM: 'recmd_quote4_mn_prem',
  RECOMMENDED_LOWEST_PRICE: 'recmd_lowest_price',
  RECOMMENDED_POLICY_LEN: 'recmd_term',
  RECOMMENDED_POLICY_LEN_STR: 'recmd_term_str',
  DEDICATED_CS_REPRESENTATIVE: 'dedicated_cs_representative',
  ADVISOR_SUBMISSION_FLAG: 'advisor_submission_flag',
  RESIDENCY_STATUS: 'residency_status',
  RESIDENCY_APPLIED_PERM_RES: 'residency_applied_perm_res',
  RESIDENCY_CANADA_12MONTHS: 'residency_canada_12months',
  RESIDENCY_DOMESTIC_WORKER: 'residency_domestic_worker',
  RESIDENCY_FOREIGN_TRAINED_PHYSICIAN: 'residency_foreign_trained_physician',
  RESIDENCY_SKILLED_WORKER: 'residency_skilled_worker',
  RETIREMENT_ASSETS: 'assets_retirement',
  REVIEW_CLICKED: 'review_clicked',
  REVIEW_TIMESTAMP: 'review_timestamp',
  REVIEW_TIMESTAMP_STR: 'review_timestamp_str',
  REVIEW_FLAG: 'review_flag',
  SEL_EXP_CHILDCARE: 'exps_childcare',
  SEL_EXP_DISC: 'exps_disc',
  SEL_EXP_FOOD: 'exps_food',
  SEL_EXP_OTHER: 'exps_other',
  SEL_EXP_RESIDENCE: 'exps_residence',
  SEL_EXP_SHOPPING: 'exps_shopping',
  SEL_EXP_TELECOM: 'exps_telecom',
  SEL_EXP_TOTAL: 'exps_total',
  SEL_EXP_TRANS: 'exps_trans',
  SEL_EXP_UTIITIES: 'exps_utilities',
  SELECTED_COV_AMT: 'selected_cov_amt',
  SELECTED_INSURER: 'selected_insurer',
  SELECTED_MONTHLY_PREMIUM: 'selected_mn_prems',
  SELECTED_YEARLY_PREMIUM: 'selected_yr_prems',
  SELECTED_POLICY_LEN: 'selected_term',
  SELECTED_POLICY_LEN_STR: 'selected_term_str',
  SELECTED_QUOTE1_MN_PREM: 'sel_quote1_mn_prem',
  SELECTED_QUOTE2_MN_PREM: 'sel_quote2_mn_prem',
  SELECTED_QUOTE3_MN_PREM: 'sel_quote3_mn_prem',
  SELECTED_QUOTE4_MN_PREM: 'sel_quote4_mn_prem',
  SERIOUS_HEALTH_COND: 'serious_health_condition',
  SHIPPING_TRACKING_NUM: 'shipping_tracking_num',
  SPOUSE_AGE: 'spouse_age',
  SPOUSE_INCOME: 'spouse_income',
  SPOUSE_INCOME_OVERRIDE: 'spouse_income_override',
  STATUS: 'status',
  START_APP_URL: 'start_app_url',
  STUDENT_LOAN_DEBT: 'debts_student_loans',
  TOBACCO_FLAG: 'tobacco_flag',
  TOBACCO_CHEWING: 'tobacco_chewing',
  TOBACCO_CHEWING_CURRENT: 'tobacco_chewing_current',
  TOBACCO_CHEWING_FREQUENCY: 'tobacco_chewing_frequency',
  TOBACCO_CHEWING_QUIT: 'tobacco_chewing_quit',
  TOBACCO_CIGARETTES: 'tobacco_cigarettes',
  TOBACCO_CIGARETTES_CURRENT: 'tobacco_cigarettes_current',
  TOBACCO_CIGARETTES_FREQUENCY: 'tobacco_cigarettes_frequency',
  TOBACCO_CIGARETTES_QUIT: 'tobacco_cigarettes_quit',
  TOBACCO_CIGARS_CIGARILLOS: 'tobacco_cigars_cigarillos',
  TOBACCO_CIGARS_CIGARILLOS_CURRENT: 'tobacco_cigars_cigarillos_current',
  TOBACCO_CIGARS_CIGARILLOS_FREQUENCY: 'tobacco_cigars_cigarillos_frequency',
  TOBACCO_CIGARS_CIGARILLOS_QUIT: 'tobacco_cigars_cigarillos_quit',
  TOBACCO_E_CIGARETTES: 'tobacco_e_cigarettes',
  TOBACCO_E_CIGARETTES_CURRENT: 'tobacco_e_cigarettes_current',
  TOBACCO_E_CIGARETTES_FREQUENCY: 'tobacco_e_cigarettes_frequency',
  TOBACCO_E_CIGARETTES_QUIT: 'tobacco_e_cigarettes_quit',
  TOBACCO_MARIJUANA: 'tobacco_marijuana',
  TOBACCO_MARIJUANA_CURRENT: 'tobacco_marijuana_current',
  TOBACCO_MARIJUANA_FREQUENCY: 'tobacco_marijuana_frequency',
  TOBACCO_MARIJUANA_QUIT: 'tobacco_marijuana_quit',
  TOBACCO_MARIJUANA_USE: 'tobacco_marijuana_use',
  TOBACCO_PIPES: 'tobacco_pipes',
  TOBACCO_PIPES_CURRENT: 'tobacco_pipes_current',
  TOBACCO_PIPES_FREQUENCY: 'tobacco_pipes_frequency',
  TOBACCO_PIPES_QUIT: 'tobacco_pipes_quit',
  TOBACCO_SUBSTITUTES: 'tobacco_substitutes',
  TOBACCO_SUBSTITUTES_CURRENT: 'tobacco_substitutes_current',
  TOBACCO_SUBSTITUTES_FREQUENCY: 'tobacco_substitutes_frequency',
  TOBACCO_SUBSTITUTES_QUIT: 'tobacco_substitutes_quit',
  TOTAL_DEBTS: 'debts_total',
  TOTAL_DEBTS_OVERRIDE: 'debts_total_override',
  TOTAL_SAVINGS: 'savings_total',
  TOTAL_SAVINGS_OVERRIDE: 'savings_total_override',
  TRAVEL: 'travel',
  TRAVEL_FUTURE_TRIPS_FLAG: 'travel_future_trips_flag',
  TRAVEL_FUTURE_TRIP_COUNTRIES: 'travel_future_trip_countries',
  TRAVEL_FUTURE_TRIP_LENGTHS: 'travel_future_trip_lengths',
  TRAVEL_FUTURE_TRIP_PURPOSES: 'travel_future_trip_purposes',
  TRAVEL_FUTURE_TRIPS_DATES: 'travel_future_trip_dates',
  TRAVEL_FUTURE_NON_URBAN_FLAG: 'travel_future_non_urban_flag',
  TRAVEL_FUTURE_NON_URBAN_DETAILS: 'travel_future_non_urban_details',
  TRAVEL_FUTURE_WAR_ZONES_FLAG: 'travel_future_war_zones_flag',
  TRAVEL_FUTURE_WAR_ZONES_DETAILS: 'travel_future_war_zones_details',
  TRAVEL_PAST_TRIPS_FLAG: 'travel_past_trips_flag',
  TRAVEL_PAST_TRIP_COUNTRIES: 'travel_past_trip_countries',
  TRAVEL_PAST_TRIP_LENGTHS: 'travel_past_trip_lengths',
  TRAVEL_PAST_TRIP_PURPOSES: 'travel_past_trip_purposes',
  TRAVEL_PAST_TRIP_DATES: 'travel_past_trip_purposes',
  TRUSTEE_FIRST_NAME: 'trustee_first_name',
  TRUSTEE_FLAG: 'trustee_flag',
  TRUSTEE_LAST_NAME: 'trustee_last_name',
  TRUSTEE_RELATIONSHIP: 'trustee_relationship',
  TYPE: 'type',
  UNDERWRITER_NAME: 'underwriter_name',
  UNDERWRITING_DECISION: 'underwriting_decision',
  UNDERWRITING_DECISION_NOTES: 'underwriting_decision_notes',
  UNEARNED_INCOME: 'unearned_income',
  USER_AGE: 'user_age',
  USER_BIRTHDATE: 'user_birthdate',
  USER_FIRST_NAME: 'user_first_name',
  USER_GENDER: 'user_gender',
  USER_HEALTH_COND: 'user_health_issues',
  USER_INCOME: 'user_income',
  USER_INCOME_OVERRIDE: 'user_income_override',
  USER_LAST_NAME: 'user_last_name',
  USER_LEAD_SOURCE: 'user_lead_source',
  USER_LEAD_SOURCE_OTHER: 'user_lead_source_other',
  USER_SMOKER: 'user_use_tobacco',
  UTM_SOURCE: 'utm_source',
  WEIGHT: 'weight',
  WEIGHT_CHANGE: 'weight_change',
  WEIGHT_CHANGE_DETAILS: 'weight_change_details',
  WEIGHT_LBS: 'weight_lbs',
  YEARS_AT_ADDRESS: 'years_at_address',
  YEARS_AT_EMPLOYER: 'years_at_employer',
  ID_URL_TEXT_STATUS: 'id_url_text_status',
  ID_VERIFICATION_COMPLETED_DATE: 'id_verification_completed_date',
  ID_VERIFICATION_INITIALIZED_DATE: 'id_verification_initialized_date',
  ID_VERIFICATION_RESULT: 'id_verification_result',
  ID_VERIFICATION_TRANSACTION_ID: 'id_verification_transaction_id',
  ID_VERIFICATION_TRANSACTION_RECORD: 'id_verification_transaction_record',
  ID_VERIFICATION_URL: 'id_verification_url',
  ID_VERIFICATION_BROWSER_INCOMPATIBLE_FLAG: 'id_verification_browser_incompatible_flag',
  OPTED_TO_EMAIL_ID_LATER: 'opted_to_email_id_later',
  AURA_UW_DECISION: 'aura_uw_decision',
  AURA_UW_DECISION_ERROR_FLAG: 'aura_uw_decision_error_flag',
  AURA_ADDITIONAL_UW_REQUIREMENTS: 'aura_additional_uw_requirements',
  AURA_UNRECOGNIZED_UW_REQUIREMENT_FLAG: 'aura_unrecognized_uw_requirement_flag',
  AURA_POSTPONED_DURATION_MONTHS: 'aura_postponed_duration_months',
  AURA_RISKS_SELECTED_FOR_DISPLAY: 'aura_risks_selected_for_display',
  AURA_SESSION_START_FLAG: 'aura_session_start_flag',
  CUSTOMER_FRIENDLY_AURA_REASONS_DISPLAYED: 'customer_friendly_aura_reasons_displayed',
  APS_FIELD_REQUIRED_FLAG: 'aps_field_required_flag',
  MVR_REQUIRED_FLAG: 'mvr_required_flag',
  NURSE_VISIT_REQUIRED_FLAG: 'nurse_visit_required_flag',
  DOWNLOAD_MY_POLICY_STATUS: 'download_my_policy_status',
  DOWNLOAD_MY_POLICY_URL: 'download_my_policy_url',
  CUSTOMER_ERROR_TICKET_NUMBER: 'customer_error_ticket_number',
  CPP_QUOTED_MONTHLY_PREMIUM: 'cpp_quoted_monthly_premium',
  CPP_QUOTED_TERM_LENGTH: 'cpp_quoted_term_length',
  CPP_QUOTED_COVERAGE_AMOUNT: 'cpp_quoted_coverage_amount',
  INTEREST_IN_NO_MEDICAL_OPTION: 'interest_in_no_medical_option',
  PRIMARY_USER_STARTED_PARTNERS_APPLICATION: 'primary_user_started_partners_application',
  SUBMITTER_OF_SECONDARY_USERS_APPLICATION: 'submitter_of_secondary_users_application',
  QUOTES_COMPARISON_SAVINGS: 'quotes_comparison_savings',
  EXCLUSIONS: 'exclusions',
  MAGIC_LINK_VERIFICATION: 'magic_link_verification',
  CARDHOLDER_NAME_MATCH: 'cardholder_name_match',
};

export const APP_FORM_METADATA = {
  BENEFICIARY_KEYS: 'beneficiary_keys',
};

export const POLICY_STATUSES = {
  IN_FORCE: 'inforce',
  IN_APPLICATION: 'in_application',
  CANCELLED: 'cancelled',
  LAPSED: 'lapsed',
  PENDING: 'pending',
};

// Life/CI beneficiary fields removed for HD-only webapp

export const EXISTING_POLICY_FIELDS = {
  COVERS_PRIMARY: 'covers_primary',
  COVERS_SECONDARY: 'covers_secondary',
  STATUS: 'status',
  COMPANY: 'company',
  AMOUNT: 'amount',
  YEAR_ISSUED: 'year_issued',
  IS_REPLACING: 'is_replacing',
  REPLACING_REASONS: 'replacing_reasons',
  REPLACING_REASONS_OTHER: 'replacing_reasons_other',
  TYPE: 'type',
  TYPE_OTHER: 'type_other',
};

export const TRAVEL_FIELDS = {
  TIME_REF: 'time_ref',
  COUNTRY: 'country',
  LENGTH: 'length',
  PURPOSE: 'purpose',
  DATE: 'date',
};

export const APP_FORM_ANIMATION_DURATION = '400ms';

export const NUMBERS_TYPES = YEARS_TYPES;

export const CUSTOM_QUOTE_ID = 9999;

// Used to trick browsers to disable autocomplete
export const HIDDEN_NBSP = <span style={{ fontSize: '0px' }}>&nbsp;</span>;

export const ANALYTICS_EVENT_TYPES = {
  BACK: 'back',
  NEXT: 'next',
  LOADED: 'loaded',
};

export const YEARS_SINCE_1900 = Array.from(
  // make array of numbers from 0 to current year - 1900
  Array(new Date().getFullYear() - 1899).keys(),
).map(i => i + 1900) // convert to years from 1900 to present year
  .reverse() // order most recent up to for convenience
  .map(i => ({ label: `${i}`, value: i })); // map to object for selects

// Contains the values and translations for ALL user lead sources
export const USER_LEAD_SOURCES_VALUES: {
  [K in typeof TENANT_USER_LEAD_SOURCES[keyof typeof TENANT_USER_LEAD_SOURCES]]: {
    label: ReactElement;
    value: string;
  }
} = {
  ARTICLE_OR_BLOG: {
    label: <FormattedMessage id="global.userLeadSourcesArticleOrBlog.4kgikE" />,
    value: 'Article or Blog',
  },
  BILLBOARD: {
    label: <FormattedMessage id="global.userLeadSourcesBillboard.XCloqr" />,
    value: 'Billboard / Transit / Outdoor Ad',
  },
  CONFERENCE: {
    label: <FormattedMessage id="global.userLeadSourcesConference.eAlBaO" />,
    value: 'Conference',
  },
  EMPLOYEE_REWARDS_PLATFORM: {
    label: <FormattedMessage id="global.userLeadSourcesEmployeeRewardsPlatform.53YuJs" />,
    value: 'Employee Rewards Platform',
  },
  INFLUENCER: {
    label: <FormattedMessage id="global.userLeadSourcesInfluencer.OBf8gj" />,
    value: 'Influencer',
  },
  ONLINE_FORUM: {
    label: <FormattedMessage id="global.userLeadSourcesOnlineForum.hUCxAc" />,
    value: 'Reddit',
  },
  PODCAST_OR_RADIO: {
    label: <FormattedMessage id="global.userLeadSourcesPodcadtOrRadio.QxLVhe" />,
    value: 'Podcast, Radio, Spotify',
  },
  SEARCH_ENGINE: {
    label: <FormattedMessage id="global.userLeadSourcesSearchEngine.3pb1GB" />,
    value: 'Search Engine (Google, Bing, etc.)',
  },
  SOCIAL_MEDIA: {
    label: <FormattedMessage id="global.userLeadSourcesSocialMedia.MfwmbX" />,
    value: 'Facebook / Instagram',
  },
  LINKEDIN: {
    label: <FormattedMessage id="global.userLeadSourcesLinkedIn.A2XuuP" />,
    value: 'Linkedin',
  },
  TIKTOK: {
    label: <FormattedMessage id="global.userLeadSourcesTiktok.69pCrc" />,
    value: 'TikTok',
  },
  TV_COMMERCIAL: {
    label: <FormattedMessage id="global.userLeadSourcesTvCommercial.lqEdXm" />,
    value: 'TV Commercial',
  },
  WORD_OF_MOUTH: {
    label: <FormattedMessage id="global.userLeadSourcesWorkOfMouth.JC5Npf" />,
    value: 'Word of Mouth (Friends, Family, Co-workers, etc.)',
  },
  YOUTUBE: {
    label: <FormattedMessage id="global.userLeadSourcesYoutube.EsPagS" />,
    value: 'Youtube',
  },
  AI_TOOL: {
    label: <FormattedMessage id="global.userLeadSourcesAiTool.62bpVa" />,
    value: 'AI Tool (ChatGPT, Gemini, Perplexity, Copilot, etc.)',
  },
  POLICYME_BLOG_ARTICLE: {
    label: <FormattedMessage id="global.userLeadSourcesPolicymeBlogArticle.77XvXg" />,
    value: 'PolicyMe Blog Article',
  },
  OTHER: {
    label: <FormattedMessage id="global.other.GyWQrt" />,
    value: 'Other',
  },
  DONT_RECALL: {
    label: <FormattedMessage id="global.userLeadSourcesIDontRecall.I3RGJd" />,
    value: `I Don't Recall`,
  },
  IN_BRANCH: {
    label: <FormattedMessage id="global.userLeadSourcesInBranch.AhN1qt" />,
    value: 'In-Branch',
  },
  BROCHURE: {
    label: <FormattedMessage id="global.userLeadSourcesBrochure.X78tUa" />,
    value: 'Brochure',
  },
  CAA_MAGAZINE: {
    label: <FormattedMessage id="global.userLeadSourcesCaaMagazine.hWq1t3" />,
    value: 'CAA Magazine',
  },
  CAA_ADVISOR: {
    label: <FormattedMessage id="global.userLeadSourcesCaaAdvisor.dw6N2t" />,
    value: 'CAA Advisor',
  },
  EMAIL: {
    label: <FormattedMessage id="global.userLeadSourcesEmail.BGa9w8" />,
    value: 'Email',
  },
  GOOGLE_SEARCH: {
    label: <FormattedMessage id="global.userLeadSourcesGoogleSearch.oYsbdH" />,
    value: 'Google Search',
  },
  BING_SEARCH: {
    label: <FormattedMessage id="global.userLeadSourcesBingSearch.G3ofbM" />,
    value: 'Bing Search',
  },
  REFERRAL_FROM_INSURANCE_AGENT: {
    label: <FormattedMessage id="global.userLeadSourcesReferralAgent.UpPV0j" />,
    value: 'Referral from Insurance Agent',
  },
  BANNER_ADVERTISEMENT: {
    label: <FormattedMessage id="global.userLeadSourcesBannerAdvertisement" />,
    value: 'Banner Advertisement',
  },
};

export const APP_FORM_SCHEMA_VERS = '3.0.0';

export const STANDARD_EMAIL_ERROR_TEXT = <FormattedMessage
  id="modalError.standardEmailError.iWmAWU"
/>;

export const SAVE_QUOTES_EMAIL_ERROR_TEXT = <FormattedMessage
  id="modalError.saveQuotesEmailError.so3EQD"
/>;

export const DOCUSIGN_EVENT_CODE = {
  CANCEL: 'cancel', // user presses finish later
  DECLINE: 'decline', // user presses decline to sign, locking the envelope
  EXCEPTION: 'exception', // something happens in docusign's code, including failing to render the disclosures PDF
  FAX_PENDING: 'fax_pending', // probably not used
  ID_CHECK_FAILED: 'id_check_failed', // probably not used
  SESSION_TIMEOUT: 'session_timeout', // user took too long to sign or another signing link was generated
  SIGNING_COMPLETE: 'signing_complete', // signed successfully
  TTL_EXPIRED: 'ttl_expired', // used a single-use link a second time, document not shown to the user, they are immediately returned to the return url
  VIEWING_COMPLETE: 'viewing_complete', // viewed document, no change made
};

export const DOCUSIGN_EVENT_MESSAGE = {
  [DOCUSIGN_EVENT_CODE.CANCEL]: 'User canceled',
  [DOCUSIGN_EVENT_CODE.DECLINE]: 'User declined',
  [DOCUSIGN_EVENT_CODE.EXCEPTION]: 'Processing error from Docusign',
  [DOCUSIGN_EVENT_CODE.FAX_PENDING]: 'fax pending',
  [DOCUSIGN_EVENT_CODE.ID_CHECK_FAILED]: 'ID check failed',
  [DOCUSIGN_EVENT_CODE.SESSION_TIMEOUT]: 'User did not sign in time',
  [DOCUSIGN_EVENT_CODE.SIGNING_COMPLETE]: 'Complete',
  [DOCUSIGN_EVENT_CODE.TTL_EXPIRED]: 'TTL expired (technical issue with token)',
  [DOCUSIGN_EVENT_CODE.VIEWING_COMPLETE]: 'User reviewed completed signature',
};

export const DOCUSIGN_INITIALIZE_ENVELOPE_CODES = {
  OKAY: 0,
  SKIP: 1,
};

export const DOCUSIGN_ENVELOPE_TYPE = {
  NONE: 0,
  LIFE_APPLICATION_FORM: 1,
  LIFE_POLICY_DOCUMENT: 2,
};

export const DOCUSIGN_SOURCE_TYPE = {
  LIFE_WEBAPP_MAIN: 0, // used in original WW docusign
  EMAIL: 1, // used in original WW docusign
  LIFE_POLICY: 2,
};

export const EXPERIENCE_LEVEL = {
  EXPERT: 'expert',
  NOVICE: 'novice',
};

export const DOCUSIGN_URL_STATUS = {
  UNINITIALIZED: 'uninitialized',
  PENDING: 'pending',
  READY: 'ready',
  ERROR: 'error',
};

const TRAVEL_REASON_VALUES = {
  PERSONAL: 'Personal',
  BUSINESS: 'Business',
  VISITING_FAMILY: 'Visiting family',
  VACATION: 'Vacation',
  MOVING: 'Moving',
};

export const TRAVEL_REASON_TYPES = Object.entries(TRAVEL_REASON_VALUES)
  .map(([key, label]) => ({ value: label, label }));

export const POLICY_TYPE_CI_FIRST = {
  CRITICAL_ILLNESS: 'Critical Illness Insurance',
  TERM_LIFE: 'Term Life Insurance',
  WHOLE_LIFE: 'Whole Life Insurance',
  UNIVERSAL_LIFE: 'Universal Life Insurance',
  MORTGAGE_LIFE: 'Mortgage Life Insurance',
  GROUP_LIFE_WORK: 'Group Life Insurance (through work)',
  ACCIDENTAL_DEATH: 'Accidental Death Insurance',
  CREDIT_PROTECTION: 'Credit Protection Insurance',
} as const;

export const POLICY_TYPE = {
  TERM_LIFE: 'Term Life Insurance',
  WHOLE_LIFE: 'Whole Life Insurance',
  UNIVERSAL_LIFE: 'Universal Life Insurance',
  MORTGAGE_LIFE: 'Mortgage Life Insurance',
  GROUP_LIFE_WORK: 'Group Life Insurance (through work)',
  CRITICAL_ILLNESS: 'Critical Illness Insurance',
  ACCIDENTAL_DEATH: 'Accidental Death Insurance',
  CREDIT_PROTECTION: 'Credit Protection Insurance',
} as const;

export const REPLACE_POLICY_REASONS = {
  CHEAPER: 'cheaper',
  LONGER: 'longer term/policy',
  MORE_COVERAGE: 'more coverage',
  EXPIRING: 'expiring',
  SPLIT_JOINT: 'split joint policy',
  NON_CANADIAN: 'non canadian insurance company',
};

export const GENDERS = {
  MALE: 'Male',
  FEMALE: 'Female',
};

export const GENDER_OPTIONS = [
  { value: GENDERS.MALE, text: <FormattedMessage id="global.gender.male.U0zZd2" /> },
  { value: GENDERS.FEMALE, text: <FormattedMessage id="global.gender.female.4mG8rj" /> },
];
export const RESIDENCE_TYPES = {
  OWN: 'own',
  RENT: 'rent',
};

export const MIN_AGE = 18;
export const MAX_AGE = 100;
export const NEW_PROD_MAX_AGE = 75;
export const MAX_AGE_HD = 99;

export const MIN_AGE_DEPENDENT = 0;
export const MAX_AGE_DEPENDENT = 21;

const MAX_DOLLAR_AMT = 99999999;
export const MAX_INCOME_AMT = MAX_DOLLAR_AMT;
export const MAX_SAVINGS_AMT = MAX_DOLLAR_AMT;
export const MAX_DEBTS_AMT = MAX_DOLLAR_AMT;

export const SMOKING_OPTIONS = [
  { value: true, text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: false, text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

export const MULTI_LIFE_HEADING = 'My Partner & I';

export const MULTI_LIFE_BODY = `Adding coverage for your partner will give them their own policy
for the same coverage amount and policy length. It’s the same as buying 2 separate
policies, but some companies offer a discount for applying together.`;

export const NEW_PROD_MULTI_LIFE_BODY = <FormattedMessage
  id="userDetailsHeader.newProdMultiLifeBody.t81dQ1"
/>;

export const CI_JOINT_BODY_TEXT = <FormattedMessage
  id="userDetailsHeader.ciJointBodyText.B8AWaV"
/>;

export const NEW_PROD_MULTI_LIFE_BODY_EMPLOYEE_DISCOUNT = `Apply together and you’ll each save 15%.
You'll each get your own policy for the same coverage amount and policy length.`;

export const PRIMARY_LIFE_BODY = <FormattedMessage
  id="userDetailsHeader.primaryLifeBody.nv3sJX"
/>;

export const APPLICATION_LOCKED_REASON = {
  DOCUSIGN_LOCKED: 'docusign_locked',
  SECONDARY_APP_LOCKED: 'secondary_app_locked',
  APP_SUBMITTED: 'app_submitted',
};

export const APPLICATION_LOCKED_EVENT = {
  [APPLICATION_LOCKED_REASON.DOCUSIGN_LOCKED]: 'WW - DocuSign - Application is Locked',
  [APPLICATION_LOCKED_REASON.SECONDARY_APP_LOCKED]: 'Joint App - Secondary App Locked',
  [APPLICATION_LOCKED_REASON.APP_SUBMITTED]: 'App Submitted - App Locked',
};

export const QUOTE_TYPES = {
  NONE: 0,
  PRIMARY: 1,
  SECONDARY: 2,
  JOINT: 3,
};

export const QUOTE_TYPES_TEXT = {
  [QUOTE_TYPES.NONE]: 'None',
  [QUOTE_TYPES.PRIMARY]: 'Primary',
  [QUOTE_TYPES.SECONDARY]: 'Secondary',
  [QUOTE_TYPES.JOINT]: 'Joint',
};

export const JOINT_ROLES = {
  NONE: 0,
  PRIMARY: 1,
  SECONDARY: 2,
};

export const EMPLOYMENT_STATUS = {
  STUDENT: 'Student',
  LAID_OFF: 'Temporarily Laid Off',
  SEEKING: 'Seeking New Employment',
  STAY_HOME_PARENT: 'Stay Home Parent',
  RETIRED: 'Retired',
  OTHER: 'Other',
};

export const EMPLOYMENT_STATUS_TYPES = Object.entries(EMPLOYMENT_STATUS)
  .map(([key, label]) => ({ value: label, label }));

export const EAPP_MEDIUM = {
  EMAIL: 'email',
  SMS: 'sms',
};

export const INITIAL_VALIDATE_RETRIES = 7;

export const WHAT_IF_CONTENT = {
  COMMON_BENEFICIARIES_CONTENT: (
    <FormattedMessage
      id="whatIf.commonBeneficiariesContent.k2Nv4L"
      values={{
        br: <br />,
      }}
    />
  ),
  HOW_TO_PICK_MY_BENEFICIARIES: (
    <FormattedMessage
      id="howToPickBeneficiaries.whatIfContent.QaB6J8"
      values={{ br: <br /> }}
    />
  ),
  HOW_TO_PICK_MY_BENEFICIARIES_JOINT: (
    <FormattedMessage
      id="howToPickBeneficiariesJoint.whatIfContent.CkP7Z2"
      values={{
        br: <br />,
      }}
    />

  ),
  HOW_TO_PICK_MY_BENEFICIARIES_SECONDARY: (

    <FormattedMessage
      id="whatIfSecondaryBeneficiaries.content.nylsjF"
      values={{ br: <br /> }}
    />
  ),
  WHAT_SHOULD_YOU_KNOW_ABOUT_PRIMARY_BENEFICARIES: (
    <FormattedMessage
      id="whatIf.knowAboutPrimaryBeneficariesBody.weyu71"
      values={{
        br: <br />,
        li: (chunks) => <Typography
          variant="body1"
          component="li"
          message={chunks}
        />,
      }}
    />
  ),
  WHAT_SHOULD_YOU_KNOW_ABOUT_SECONDARY_BENEFICARIES: (
    <FormattedMessage
      id="whatIf.knowAboutSecondaryBeneficaries.O5KC8z"
      values={{
        br: <br />,
        li: (chunks) => <Typography
          variant="body1"
          component="li"
          message={chunks}
        />,
      }}
    />
  ),
};

// these wallet options are set to never since we'll be rendering the
// express checkout elements alongside the payment element. If these were
// set to Auto, we would be rendering apple pay and google pay buttons twice, once in
// the payment element and once in the express checkout elements.
// docs: https://docs.stripe.com/js/elements_object/create_payment_element#payment_element_create-options
// https://docs.stripe.com/js/element/express_checkout_element
export const STRIPE_OPTIONS: StripePaymentElementOptions = {
  wallets: {
    applePay: 'never',
    googlePay: 'never',
  },
} as const;

export type STRIPE_WALLETS = 'googlePay' | 'applePay'

export const START_CAPTURE_MESSAGE = 'Starting Capture';
export const CAPTURE_DEFAULT_TIMEOUT = 60 * 1000;
export const CAPTURE_INSTRUCTIONS = [
  'Place ID on a dark surface.',
  'Make sure all four corners of ID are visible.',
  'Adjust angle to minimize glare.',
  'Make sure image is in focus.',
];

export const DEFAULT_MAX_LENGTH = 16;
export const DEFAULT_CVV_LENGTH = 3;
export const DEFAULT_FORMAT_PATTERN = '4444';
export const YEAR_OPTIONS_LIMIT = 11;
export const NUMBER_OF_SPACES_DEFAULT = 6;
export const NUMBER_OF_SPACES_AMEX = 4;
export const DECIMAL_BASE_10 = 10;
export const PM_HELCIM_DONT_SUBMIT_FLAG = 1;
export const PM_HELCIM_TEST = 1;
export const PM_HELCIM_TEST_CARD_EXPIRY_MONTH = '01';
export const PM_HELCIM_TEST_CARD_EXPIRY_YEAR = '2025';
export const PM_HELCIM_TEST_CARD_NUMBER = '5454545454545454';
export const PM_HELCIM_TEST_CARD_SUCCESS_CVV = '100';
export const PM_HELCIM_TEST_CARD_FAILURE_CVV = '200';

// March 1 2021 HELCIM FIX - HELCIM EXPECTS A CARD HOLDER ADDRESS AND POSTAL CODE
// AND THOSE 2 FIELDS CAN HAVE DUMMY VALUES
// https://support.helcim.com/article/helcim-commerce-new-ui-integrations-helcimjs-request-fields/
export const PM_HELCIM_MAX_ATTEMPTS = 10;
export const HELCIM_MIN_CHARGE = 0.01;

export const CARD_TYPES = [
  {
    type: 'amex',
    startPattern: /^3[47]/,
    maxLength: 15,
    // Helcim test card no. for amex expects cvv of length 3:
    // https://support.helcim.com/article/helcim-commerce-new-ui-integrations-test-credit-card-numbers
    cvvLength: process.env.PM_HELCIM_TEST && process.env.PM_HELCIM_TEST === '1' ? DEFAULT_CVV_LENGTH : 4,
    formatPattern: '465',
  },
  {
    type: 'discover',
    startPattern: /^(6011|65|64[4-9]|622)/,
    maxLength: DEFAULT_MAX_LENGTH,
    cvvLength: DEFAULT_CVV_LENGTH,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    type: 'mastercard',
    startPattern: /^(5[1-5]|677189)|^(222[1-9]|2[3-6]\d{2}|27[0-1]\d|2720)/,
    maxLength: DEFAULT_MAX_LENGTH,
    cvvLength: DEFAULT_CVV_LENGTH,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
  {
    type: 'visa',
    startPattern: /^4/,
    maxLength: DEFAULT_MAX_LENGTH,
    cvvLength: DEFAULT_CVV_LENGTH,
    formatPattern: DEFAULT_FORMAT_PATTERN,
  },
];

export const PAYMENT_RESPONSE_FIELDS = {
  RESPONSE: 'response',
  RESPONSE_MESSAGE: 'responseMessage',
  DATE: 'date',
  TIME: 'time',
  TYPE: 'type',
  CARD_TOKEN: 'cardToken',
  CARD_TYPE: 'cardType',
  TRANSACTION_ID: 'transactionId',
  AVS_RESPONSE: 'avsResponse',
  CVV_RESPONSE: 'cvvResponse',
  APPROVAL_CODE: 'approvalCode',
  ORDER_NUMBER: 'orderNumber',
  CUSTOMER_CODE: 'customerCode',
  XML_HASH: 'xmlHash',
};

export const PLAN_TYPES = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
};

export type UnderwritingMethod = typeof UNDERWRITING_METHODS[keyof typeof UNDERWRITING_METHODS];
export const UNDERWRITING_METHODS = {
  GUARANTEED_ISSUE: 'guaranteed_issue',
  FULLY_UNDERWRITTEN: 'fully_underwritten',
  PORTABLE_COVERAGE: 'portable_coverage',
} as const;

export type InsuranceOwnershipType = typeof INSURANCE_OWNERSHIP_TYPES[
  keyof typeof INSURANCE_OWNERSHIP_TYPES
];
export const INSURANCE_OWNERSHIP_TYPES = {
  INDIVIDUAL: 'individual',
  GROUP: 'group',
} as const;

export const PRESCRIPTION_DRUG_FLAG = {
  NEITHER: 'neither',
  PRIMARY_ONLY: 'primary_only',
  SECONDARY_ONLY: 'secondary_only',
  BOTH: 'both',
} as const;

export const INELIGIBLE_PROVINCES = [];

export const AURA_DISCLOSURE_TYPES = {
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  DATE: 'DATE',
  UNITIZED: 'UNITIZED',
  NUMERIC: 'NUMERIC',
  TEXT: 'TEXT',
  BLOOD_PRESSURE: 'BLOOD_PRESSURE',
  SEARCH: 'SEARCH',
  PERCENT: 'PERCENT',
  AMOUNT: 'AMOUNT',
};

export const AURA_DISCLOSURE_DATE_TYPES = {
  EXACT_DATE: 'EXACT_DATE',
  MONTH_YEAR: 'MONTH_YEAR',
  MONTHS_SINCE_OCCURRENCE: 'MONTHS_SINCE_OCCURRENCE',
  RELATIVE_AGE: 'RELATIVE_AGE',
};

export const PM_DATE_FORMAT = 'DD/MM/YYYY';
export const AURA_EXACT_DATE_FORMAT = 'yyyy-MM-DDTHH:mm:ss.SSS';

export const PM_MONTH_YEAR_FORMAT = 'MM/YYYY';
export const AURA_MONTH_YEAR_FORMAT = 'YYYY-MM';

export const ESTIMATED_MONTHLY_RATE_BODY = <Typography
  variant="body1"
  message={<FormattedMessage
    id="estimatedMonthlyRate.indivBody.bw1uO7"
    values={{
      br: <br />,
    }}
  />}
/>;

export const ESTIMATED_JOINT_MONTHLY_RATE_BODY = <Typography
  variant="body1"
  message={<FormattedMessage
    id="estimatedMonthlyRate.jointBody.BsbD1s"
    values={{
      br: <br />,
    }}
  />}
/>;

export const WHAT_IS_MY_COVERAGE_AMOUNT = <Typography
  variant="body1"
  message={<FormattedMessage
    id="coverageRedesign.whatIsMyCoverageAmount.IuttEQ"
  />}
/>;

export const CI_WHAT_IS_MY_COVERAGE_AMOUNT = <span>
  <FormattedMessage
    id="coverageRedesign.ciWhatIsMyCoverageAmount.bq8dy2"
    values={{
      br: <br />,
      ul: chunks => <ul>{chunks}</ul>,
      li: chunks => <li>{chunks}</li>,
    }}
  />
</span>;

export const WHAT_IS_MY_POLICY_LENGTH = <Typography
  variant="body1"
  message={<FormattedMessage
    id="coverageRedesign.whatIsMyPolicyLength.CeyD21"
  />}
/>;

export const CI_WHAT_IS_MY_POLICY_LENGTH = <Typography
  variant="body1"
  message={<FormattedMessage
    id="coverageRedesign.ciWhatIsMyPolicyLength.uw89Qa"
  />}
/>;

export const ADDING_COVERAGE_FOR_YOUR_PARTNER = <Typography
  variant="body1"
  message={<FormattedMessage
    id="coverageRedesign.joint.addCoverageForYourPartnerTooltipBody.bWeojG"
  />}
/>;

export const MULTIPLE_CHOICE_NONE_ANSWERS_DEFINITION = defineMessages({
  noneOfAbove: {
    id: 'constants.noneOfAbove.poyJkj',
  },
  noneOfTheAbove: {
    id: 'constants.noneOfTheAbove.xKF0vR',
  },
  noneOfThese: {
    id: 'constants.noneOfThese.mn2naj',
  },
  noTreatmentReceived: {
    id: 'constants.noTreatmentReceived.2Gz7FL',
  },
  noTreatment: {
    id: 'constants.noTreatment.aGtPgI',
  },
  noProceduresOrSurgeries: {
    id: 'constants.noProceduresOrSurgeries.9TfAd0',
  },
  noneOrNotApplicable: {
    id: 'constants.noneOrNotApplicable.90nzhV',
  },
});

export const MULTIPLE_CHOICE_DO_NOT_KNOW_ANSWERS_DEFINITION = defineMessages({
  notSure: {
    id: 'constants.notSure.qr987m',
  },
  unknown: {
    id: 'constants.unknown.EGxUpl',
  },
  notSureOrSkinCancer: {
    id: 'constants.notSureOrSkinCancer.58uoCp',
  },
  typeOfHypertension: {
    id: 'constants.typeOfHypertension.PFYfbe',
  },
  notSureFeminineFrench: {
    id: 'constants.notSure.qr987f',
  },
});

export type AuthorizationType = typeof AUTHORIZATION_TYPE[keyof typeof AUTHORIZATION_TYPE];
export const AUTHORIZATION_TYPE = {
  MIB: 'mib', // consent on aura decision page
  GI: 'gi', // hd consent
  FUW_HD: 'fuw_hd', // hd consent
  CHECKOUT_CONSENT: 'checkout_consent', // digital consent on payment checkout page
  EXCLUSION: 'exclusion', // consent to review exclusions on checkout
  BENEFICIARIES: 'beneficiaries', // consent to review beneficiaries on checkout
} as const;

export type PolicyStatusType = typeof POLICIES_STATUS[keyof typeof POLICIES_STATUS];
export const POLICIES_STATUS = {
  PENDING: 'Pending',
  ISSUED: 'Issued',
  IN_FORCE: 'In Force',
  CANCELLED: 'Cancelled',
  IN_FORCE_PAID: 'In Force - Paid Up',
  TERMINATED: 'Terminated',
  CLAIM_TRIGGERED_PRE_CLAIM: 'Claim Triggered - Pre-Claim',
  CLAIM_TRIGGERED_IN_CLAIM: 'Claim Triggered - In Claim',
  CLAIM_TRIGGERED_PAID: 'Claim Triggered - Claim Paid',
  CLAIM_TRIGGERED_DENIED: 'Claim Triggered - Claim Denied',
  PAID_NOT_IN_FORCE: 'Paid - Not In Force Yet',
  CLOSED: 'Closed',
} as const;

export const POLICIES_PREMIUM_CLASS = {
  NON_TOBACCO_USER: 'Non-Tobacco User',
  TOBACCO_USER: 'Tobacco User',
};

export const POLICIES_IS_SMOKER = {
  [POLICIES_PREMIUM_CLASS.TOBACCO_USER]: true,
  [POLICIES_PREMIUM_CLASS.NON_TOBACCO_USER]: false,
};

export const DISCLOSURE_STATUS_CODES = {
  NO_MORE_QUESTIONS: -2,
  NOT_IN_DISCLOSURE_SECTION: -3,
};

export const DECISION_CODE = {
  STANDARD_NON_SMOKER: 'ACC',
  STANDARD_SMOKER: 'ACC_STANDARD_TB',
  REFER_TO_UNDERWRITER: 'RUW',
  POSTPONE_X_MONTHS: 'PPX',
  POSTPONE: 'PP',
  DECLINE: 'DCL',
};

export const APPROVED_STEPS_ORDER = {
  BENEFICIARIES: '0',
  ESIGN_POLICY: '1',
  PAYMENT_DETAILS: '2',
};

export const APPROVED_STEPS_COMPLETED = {
  NO_STEPS_COMPLETED: 1,
  BENEF_STEP_COMPLETED: 2,
  DOCUSIGN_STEP_COMPLETED: 3,
  PAYMENT_STEP_COMPLETED: 4,
  ALL_STEPS_COMPLETED: 5,
};

export const POLICY_SIGNED_STATUS = {
  COMPLETED: 'Completed',
  FAILED: 'Failed',
  DECLINED: 'Declined',
};

export const DOWNLOAD_MY_POLICY_STATUSES = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
};

export type AuraDecisionType = typeof AURA_DECISION_TYPES[keyof typeof AURA_DECISION_TYPES];
export const AURA_DECISION_TYPES = {
  APPROVED: 'Approved',
  DECLINED: 'Declined',
  POSTPONED: 'Postponed',
  REFER_TO_UNDERWRITER: 'Refer To Underwriter',
} as const;

export const SENTRY_ERROR_THROTTLE_LIMIT = 10;
export const SENTRY_MAX_BREADCRUMBS = 20;

export const DOCUSIGN_LINK_TIMEOUT = 1000 * 60 * 4.5;

export const DECISION_PAGE_TYPES = {
  NOT_DECISION_PAGE: -1,
  APPROVED_PAGE: 0,
  UNDERWRITER_PAGE: 1,
  DECLINED_PAGE: 2,
};

export const NUM_QUOTES = {
  PM_NOT_TOP_FIVE: 4,
  PM_TOP_FIVE: 5,
};

export const ACCORDION_NAMES = {
  RECOMMENDATION_POLICY_COVERAGE: 'policyCoverage',
  RECOMMENDATION_POLICY_INFO: 'policyInfo',
  RECOMMENDATION_POLICY_LENGTH: 'policyLength',
  APPROVED_STEPS_POLICY_COMPONENT: 'policyComponent',
  APPROVED_STEPS_POLICY_INSURER: 'policyInsurer',
  APPROVED_STEPS_POLICY_CONTRACT: 'policyContract',
  APPROVED_STEPS_POLICY_VALID: 'policyValid',
  APPROVED_STEPS_MISTAKE: 'mistake',
  APPROVED_STEPS_NO_LONGER_WANT: 'noLongerWantPolicy',
};

export const QUOTES_RETURNED_ACCORDION_NAMES = {
  OLD_DOC: 'oldDoc',
  MEDICAL: 'medical',
  CANCEL: 'cancel',
  CLAIM: 'claim',
};

export const COUPLES_ACCORDION_NAMES = {
  MY_POLICY: 'myPolicy',
  HOW_COVERAGE_WORKS: 'howCoverageWorks',
  POLICY_INSURER: 'policyInsurer',
  MISTAKES: 'mistakes',
  POLICY_VALID: 'policyValid',
  READ_POLICY: 'readPolicy',
  IN_REVIEW: 'inReview',
  NO_INSTANT_APPROVED: 'noInstantApproved',
  OTHER_OPTIONS: 'otherOptions',
};

export const ESIGN_ACCORDION_NAMES = {
  POLICY_DOC: 'policyDoc',
  AFTER_ESIGN: 'afterESign',
  CHANGE_ANSWER: 'changeAnswer',
};

export const ACCESS_CODE_ACCORDION_NAMES = {
  WHY_NEED: 'whyNeed',
  WHERE_FIND: 'whereFind',
};

export const PRIVACY_POLICY_PM = <FormattedMessage
  id="tenant.PM.privacyPolicy"
  values={{
    br: <br />,
    ul: chunks => <StyledUnorderedList>{chunks}</StyledUnorderedList>,
    li: chunks => <Typography variant="body1" message={chunks} component="li" />,
    div1: msg => <Typography variant="h2" component="h3" message={msg} />,
    div2: msg => <Typography variant="h4" message={msg} />,
    b: chunks => <strong>{chunks}</strong>,
    a1: chunks => <Link label={chunks} href="https://www.policyme.com/" />,
    a2: chunks => <Link label={chunks} href="mailto:info@policyme.com" />,
    a3: chunks => <Link label={chunks} href="https://www.aboutads.info/choices/" />,
    a4: chunks => <Link label={chunks} href="https://www.youradchoices.ca/choices/" />,
    a5: chunks => <Link label={chunks} href="mailto:privacy_officer@policyme.com" />,
  }}
/>;

export const PRIVACY_POLICY_CAA = <FormattedMessage
  id="tenant.CAA.privacyPolicy"
  values={{
    br: <br />,
    ul: chunks => <StyledUnorderedList>{chunks}</StyledUnorderedList>,
    li: chunks => <Typography variant="body1" message={chunks} component="li" />,
    div1: msg => <Typography variant="h2" component="h3" message={msg} />,
    div2: msg => <Typography variant="h4" message={msg} />,
    b: chunks => <strong>{chunks}</strong>,
    a1: chunks => <Link label={chunks} href="mailto:service@caa.securiancanada.ca" />,
    a2: chunks => <Link label={chunks} href="mailto:info@policyme.com" />,
    a3: chunks => <Link label={chunks} href="mailto:privacy_officer@policyme.com" />,
  }}
/>;

export const ADVISOR_FULL_NAMES = {
  LAURA_MCKAY: 'LAURA MCKAY',
  ERIK_HEIDEBRECHT: 'ERIK HEIDEBRECHT',
  IVANA_GOVEDARICA: 'IVANA GOVEDARICA',
  SHAWN_FAUSTINO: 'SHAWN FAUSTINO',
  STEPHANIE_ROUX: 'STEPHANIE ROUX',
  NATALIE_PARKINSON_DUPLEY: 'NATALIE PARKINSON DUPLEY',
  PHILIPPE_CHARBONNEAU: 'PHILIPPE CHARBONNEAU',
  YOUNESS_ELHOUSSINIHILAL: 'YOUNESS ELHOUSSINIHILAL',
  CHRISTELLE_AROUKO: 'CHRISTELLE AROUKO',
  CANDACE_MCCONNELL: 'CANDACE MCCONNELL',
  JAMES_MURPHY: 'JAMES MURPHY',
};

export const RISK_CODE = {
  BMI: 'BMI',
  'Age Coverage': 'Age Coverage',
  'MIB Code': 'MIB Code',
  'Applicant Info': 'Applicant Info',
  'Weight Loss': 'Weight Loss',
  dt_RelatedSymptoms: 'dt_RelatedSymptoms',
  dt_DiabetesNonInsulinDependentDiabetesMellitus: 'dt_DiabetesNonInsulinDependentDiabetesMellitus',
  dt_Hypertension: 'dt_Hypertension',
  dt_HemoglobinA1C: 'dt_HemoglobinA1C',
  dt_Marijuana: 'dt_Marijuana',
  dt_Other: 'dt_Other',
  dt_Depression: 'dt_Depression',
  dt_MedicalMarijuana: 'dt_MedicalMarijuana',
  'Family History of Skin Cancer (Acral Lentiginous)': 'Family History of Skin Cancer (Acral Lentiginous)',
  dt_Unemployed: 'dt_Unemployed',
  dt_SuicideAttempt: 'dt_SuicideAttempt',
  dt_Hypercholesterolemia: 'dt_Hypercholesterolemia',
  'Benefit Override': 'Benefit Override',
  dt_SkinCancerAcralLentiginous: 'dt_SkinCancerAcralLentiginous',
  dt_SecondaryHypertension: 'dt_SecondaryHypertension',
  dt_Asthma: 'dt_Asthma',
  dt_GeneralizedAnxietyDisorder: 'dt_GeneralizedAnxietyDisorder',
  dt_MalignantHypertension: 'dt_MalignantHypertension',
  dt_HypertensionPulmonary: 'dt_HypertensionPulmonary',
  dt_GlucoseLevels: 'dt_GlucoseLevels',
  dt_Cocaine: 'dt_Cocaine',
  dt_AlcoholUse: 'dt_AlcoholUse',
  'Weight Gain': 'Weight Gain',
  'Allergy and Asthma': 'Allergy and Asthma',
  dt_NonFastingBloodSugar: 'dt_NonFastingBloodSugar',
  'Family History of Cardiovascular Disease': 'Family History of Cardiovascular Disease',
  dt_BloodPressure: 'dt_BloodPressure',
  'Hypertension and Diabetes': 'Hypertension and Diabetes',
  dt_RhinitisAllergic: 'dt_RhinitisAllergic',
  dt_DiabetesInsulinDependentDiabetesMellitus: 'dt_DiabetesInsulinDependentDiabetesMellitus',
  'Family History of Cancer': 'Family History of Cancer',
  'Family History of Other Family Illness': 'Family History of Other Family Illness',
  dt_otherTest: 'dt_otherTest',
  drv_WeightGain: 'drv_WeightGain',
  dt_PostTraumaticStressDisorder: 'dt_PostTraumaticStressDisorder',
  dt_Electrocardiogram: 'dt_Electrocardiogram',
  dt_otherBankruptcy: 'dt_otherBankruptcy',
  dt_Pregnancy: 'dt_Pregnancy',
  dt_FamilialDiseaseInvestigation: 'dt_FamilialDiseaseInvestigation',
  dt_Dui: 'dt_Dui',
  'Diabetes and Cholesterol': 'Diabetes and Cholesterol',
  dt_OtherCriminalActivity: 'dt_OtherCriminalActivity',
  dt_BipolarDisorder: 'dt_BipolarDisorder',
  dt_AnxietyAttack: 'dt_AnxietyAttack',
  'Substance Use and Unemployed': 'Substance Use and Unemployed',
  'MIB Build Weight Loss': 'MIB Build Weight Loss',
  'Family History of Kidney Disease': 'Family History of Kidney Disease',
  dt_Cholelithiasis: 'dt_Cholelithiasis',
  'MIB Build Discrepancy': 'MIB Build Discrepancy',
  dt_PulmonaryFunctionTests: 'dt_PulmonaryFunctionTests',
  dt_OtherTobacco: 'dt_OtherTobacco',
  dt_OtherAllergy: 'dt_OtherAllergy',
  dt_FamilialHypercholesterolemia: 'dt_FamilialHypercholesterolemia',
  dt_SubstanceUsageInpatient: 'dt_SubstanceUsageInpatient',
  dt_SeasonalAffectiveDisorder: 'dt_SeasonalAffectiveDisorder',
  dt_OtherDrug: 'dt_OtherDrug',
  dt_ExerciseElectrocardiography: 'dt_ExerciseElectrocardiography',
  'Rhinitis Allergic and Asthma': 'Rhinitis Allergic and Asthma',
  dt_SpeedingMinor: 'dt_SpeedingMinor',
  dt_Psoriasis: 'dt_Psoriasis',
  dt_OtherTreatment: 'dt_OtherTreatment',
  dt_HumanImmunodeficiencyVirus: 'dt_HumanImmunodeficiencyVirus',
  dt_Dyspnea: 'dt_Dyspnea',
  dt_CancerBreast: 'dt_CancerBreast',
  dt_Anxiety: 'dt_Anxiety',
  'Bronchitis and Asthma': 'Bronchitis and Asthma',
  dt_UlcerativeColitis: 'dt_UlcerativeColitis',
  dt_SubstanceUsageOther: 'dt_SubstanceUsageOther',
  dt_Neuroleptics: 'dt_Neuroleptics',
  dt_MyocardialInfarction: 'dt_MyocardialInfarction',
  dt_IrritableBowelSyndrome: 'dt_IrritableBowelSyndrome',
  dt_Cystitis: 'dt_Cystitis',
  dt_CrohnsDisease: 'dt_CrohnsDisease',
  dt_ChronicObstructivePulmonaryDisease: 'dt_ChronicObstructivePulmonaryDisease',
  dt_AllergyFood: 'dt_AllergyFood',
  dt_AlcoholAbuse: 'dt_AlcoholAbuse',
  drv_WeightLoss: 'drv_WeightLoss',
  'Family History of Cardiomyopathy': 'Family History of Cardiomyopathy',
  AviationExperience: 'AviationExperience',
  dt_otherMovingViolation: 'dt_otherMovingViolation',
  dt_Surgery: 'dt_Surgery',
  dt_Stimulants: 'dt_Stimulants',
  dt_SleepApnea: 'dt_SleepApnea',
  dt_PrescriptionDrugs: 'dt_PrescriptionDrugs',
  dt_PostPartumDepression: 'dt_PostPartumDepression',
  dt_MajorMovingViolation: 'dt_MajorMovingViolation',
  dt_HumanPapillomaVirus: 'dt_HumanPapillomaVirus',
  dt_HepatitisBCarrier: 'dt_HepatitisBCarrier',
  dt_HelicopterSkiing: 'dt_HelicopterSkiing',
  dt_CancerThyroid: 'dt_CancerThyroid',
  dt_BoneFracture: 'dt_BoneFracture',
  dt_ArthritisOsteo: 'dt_ArthritisOsteo',
  'Substance Use and Alcohol Abuse': 'Substance Use and Alcohol Abuse',
  'Gestational Diabetes and Pregnancy': 'Gestational Diabetes and Pregnancy',
  'Class D Country': 'Class D Country',
  BankruptcyAmtGreater250k: 'Bankruptcy and amount >250k',
};

export const AURA_REASONS = {
  [RISK_CODE.BMI]: {
    customer_friendly_reason: 'Your Height and Weight Details',
    priority: 2,
  },
  [RISK_CODE['Age Coverage']]: {
    customer_friendly_reason: 'You Are Over 50 and / or Applied For 1M+ in Coverage',
    priority: 7,
  },
  [RISK_CODE['MIB Code']]: {
    customer_friendly_reason: 'Your insurance app history was flagged for review',
    priority: 8,
  },
  [RISK_CODE['Applicant Info']]: {
    customer_friendly_reason: 'Your Citizenship Status and / or Previous Life Insurance Application',
    priority: 4,
  },
  [RISK_CODE['Weight Loss']]: {
    customer_friendly_reason: 'Your Recent Weight Loss',
    priority: 5,
  },
  [RISK_CODE.dt_RelatedSymptoms]: {
    customer_friendly_reason: 'Your Symptoms of Hereditary Condition(s)',
    priority: 6,
  },
  [RISK_CODE.dt_DiabetesNonInsulinDependentDiabetesMellitus]: {
    customer_friendly_reason: 'Your Type II Diabetes',
    priority: 6,
  },
  [RISK_CODE.dt_Hypertension]: {
    customer_friendly_reason: 'Your Hypertension Details',
    priority: 6,
  },
  [RISK_CODE.dt_HemoglobinA1C]: {
    customer_friendly_reason: 'Your Hemoglobin A1c Details',
    priority: 6,
  },
  [RISK_CODE.dt_Marijuana]: {
    customer_friendly_reason: 'Your Recreational Cannabis Use',
    priority: 6,
  },
  [RISK_CODE.dt_Other]: {
    customer_friendly_reason: 'We Need A Human To Review Your Typed Response(s)',
    priority: 6,
  },
  [RISK_CODE.dt_Depression]: {
    customer_friendly_reason: 'Your History with Depression',
    priority: 6,
  },
  [RISK_CODE.dt_MedicalMarijuana]: {
    customer_friendly_reason: 'Your Medicinal Cannabis Use',
    priority: 6,
  },
  [RISK_CODE['Family History of Skin Cancer (Acral Lentiginous)']]: {
    customer_friendly_reason: 'Your Family History of Skin Cancer',
    priority: 6,
  },
  [RISK_CODE.dt_Unemployed]: {
    customer_friendly_reason: 'Your Current Employment Status',
    priority: 6,
  },
  [RISK_CODE.dt_SuicideAttempt]: {
    customer_friendly_reason: 'Your Previous Self-Harm Attempt(s)',
    priority: 6,
  },
  [RISK_CODE.dt_Hypercholesterolemia]: {
    customer_friendly_reason: 'Your Cholesterol Details',
    priority: 6,
  },
  [RISK_CODE['Benefit Override']]: {
    customer_friendly_reason: 'Your Medical History',
    priority: 6,
  },
  [RISK_CODE.dt_SkinCancerAcralLentiginous]: {
    customer_friendly_reason: 'Your History of Skin Cancer',
    priority: 6,
  },
  [RISK_CODE.dt_SecondaryHypertension]: {
    customer_friendly_reason: 'Secondary Hypertension',
    priority: 6,
  },
  [RISK_CODE.dt_Asthma]: {
    customer_friendly_reason: 'Your History of Asthma',
    priority: 6,
  },
  [RISK_CODE.dt_GeneralizedAnxietyDisorder]: {
    customer_friendly_reason: 'Your History of Generalized Anxiety Disorder',
    priority: 6,
  },
  [RISK_CODE.dt_MalignantHypertension]: {
    customer_friendly_reason: 'Hypertension',
    priority: 6,
  },
  [RISK_CODE.dt_HypertensionPulmonary]: {
    customer_friendly_reason: 'Hypertension',
    priority: 6,
  },
  [RISK_CODE.dt_GlucoseLevels]: {
    customer_friendly_reason: 'Your Blood Glucose Details',
    priority: 6,
  },
  [RISK_CODE.dt_Cocaine]: {
    customer_friendly_reason: 'Your History of Cocaine Use',
    priority: 6,
  },
  [RISK_CODE.dt_AlcoholUse]: {
    customer_friendly_reason: 'Your Alcohol Use Details',
    priority: 6,
  },
  [RISK_CODE['Weight Gain']]: {
    customer_friendly_reason: 'Your Weight Gain Details',
    priority: 6,
  },
  [RISK_CODE['Allergy and Asthma']]: {
    customer_friendly_reason: 'Your Details About Having Allergies with Asthma',
    priority: 6,
  },
  [RISK_CODE.dt_NonFastingBloodSugar]: {
    customer_friendly_reason: 'Your Non-Fasting Blood Glucose Details',
    priority: 6,
  },
  [RISK_CODE['Family History of Cardiovascular Disease']]: {
    customer_friendly_reason: 'Your Family History of Cardiovascular Disease',
    priority: 6,
  },
  [RISK_CODE.dt_BloodPressure]: {
    customer_friendly_reason: 'Your Blood Pressure Details',
    priority: 6,
  },
  [RISK_CODE['Hypertension and Diabetes']]: {
    customer_friendly_reason: 'You Have Both Hypertension and Diabetes',
    priority: 6,
  },
  [RISK_CODE.dt_RhinitisAllergic]: {
    customer_friendly_reason: 'Your Rhinitis Details',
    priority: 6,
  },
  [RISK_CODE.dt_DiabetesInsulinDependentDiabetesMellitus]: {
    customer_friendly_reason: 'Your Type I Diabetes',
    priority: 6,
  },
  [RISK_CODE['Family History of Cancer']]: {
    customer_friendly_reason: 'Your Family History of Cancer',
    priority: 6,
  },
  [RISK_CODE['Family History of Other Family Illness']]: {
    customer_friendly_reason: 'Your Family\'s Medical History of A Hereditary Condition',
    priority: 6,
  },
  [RISK_CODE.dt_otherTest]: {
    customer_friendly_reason: 'Your Medical Test(s) That Was Not In Our List',
    priority: 6,
  },
  [RISK_CODE.drv_WeightGain]: {
    customer_friendly_reason: 'Your Weight Change Details',
    priority: 6,
  },
  [RISK_CODE.dt_PostTraumaticStressDisorder]: {
    customer_friendly_reason: 'Your History of PTSD',
    priority: 6,
  },
  [RISK_CODE.dt_Electrocardiogram]: {
    customer_friendly_reason: 'Your Electrocardiogram Test Details',
    priority: 6,
  },
  [RISK_CODE.dt_otherBankruptcy]: {
    customer_friendly_reason: 'Your Bankruptcy History',
    priority: 6,
  },
  [RISK_CODE.BankruptcyAmtGreater250k]: {
    customer_friendly_reason: 'Your Bankruptcy History',
    priority: 6,
  },
  [RISK_CODE.dt_Pregnancy]: {
    customer_friendly_reason: 'Your Pregnancy Details',
    priority: 6,
  },
  [RISK_CODE.dt_FamilialDiseaseInvestigation]: {
    customer_friendly_reason: 'Your Investigation/Tests For A Hereditary Condition',
    priority: 6,
  },
  [RISK_CODE.dt_Dui]: {
    customer_friendly_reason: 'Your Previous DUI Details',
    priority: 6,
  },
  [RISK_CODE['Diabetes and Cholesterol']]: {
    customer_friendly_reason: 'Your Details About Having Diabetes With High Cholesterol',
    priority: 6,
  },
  [RISK_CODE.dt_OtherCriminalActivity]: {
    customer_friendly_reason: 'Your Criminal Offense or Charge Details',
    priority: 6,
  },
  [RISK_CODE.dt_BipolarDisorder]: {
    customer_friendly_reason: 'Your History with Bipolar',
    priority: 6,
  },
  [RISK_CODE.dt_AnxietyAttack]: {
    customer_friendly_reason: 'Your Anxiety Attack Details',
    priority: 6,
  },
  [RISK_CODE['Substance Use and Unemployed']]: {
    customer_friendly_reason: 'Your Employment Status With Select Lifestyle Factors',
    priority: 6,
  },
  [RISK_CODE['MIB Build Weight Loss']]: {
    customer_friendly_reason: '',
    priority: 6,
  },
  [RISK_CODE['Family History of Kidney Disease']]: {
    customer_friendly_reason: 'Your Family\'s History of Kidney Disease',
    priority: 6,
  },
  [RISK_CODE.dt_Cholelithiasis]: {
    customer_friendly_reason: 'Your Gallstone History',
    priority: 6,
  },
  [RISK_CODE['MIB Build Discrepancy']]: {
    customer_friendly_reason: '',
    priority: 6,
  },
  [RISK_CODE.dt_PulmonaryFunctionTests]: {
    customer_friendly_reason: 'Your Pulmonary Function Test Details',
    priority: 6,
  },
  [RISK_CODE.dt_OtherTobacco]: {
    customer_friendly_reason: 'Your Use Of Tobacco Products',
    priority: 6,
  },
  [RISK_CODE.dt_OtherAllergy]: {
    customer_friendly_reason: 'Your Allergies',
    priority: 6,
  },
  [RISK_CODE.dt_FamilialHypercholesterolemia]: {
    customer_friendly_reason: 'Your Family\'s History of Hypercholesterolemia',
    priority: 6,
  },
  [RISK_CODE.dt_SubstanceUsageInpatient]: {
    customer_friendly_reason: 'Your Previous Inpatient Treatment Experience',
    priority: 6,
  },
  [RISK_CODE.dt_SeasonalAffectiveDisorder]: {
    customer_friendly_reason: 'Your Experience with Seasonal Affective Disorder',
    priority: 6,
  },
  [RISK_CODE.dt_OtherDrug]: {
    customer_friendly_reason: 'Your Use of a Substance That Was Not In Our List',
    priority: 6,
  },
  [RISK_CODE.dt_ExerciseElectrocardiography]: {
    customer_friendly_reason: 'Your Exercise Electrocardiogram Details',
    priority: 6,
  },
  [RISK_CODE['Rhinitis Allergic and Asthma']]: {
    customer_friendly_reason: 'Your Details About Having Both Rhinitis and Asthma',
    priority: 6,
  },
  [RISK_CODE.dt_SpeedingMinor]: {
    customer_friendly_reason: 'Your Minor Speeding Infractions',
    priority: 6,
  },
  [RISK_CODE.dt_Psoriasis]: {
    customer_friendly_reason: 'Your Psoriasis History',
    priority: 6,
  },
  [RISK_CODE.dt_OtherTreatment]: {
    customer_friendly_reason: 'Your Details About Your Medical Treatment History',
    priority: 6,
  },
  [RISK_CODE.dt_HumanImmunodeficiencyVirus]: {
    customer_friendly_reason: 'Your History with HIV/AIDS',
    priority: 6,
  },
  [RISK_CODE.dt_Dyspnea]: {
    customer_friendly_reason: 'Your Experience of Having Shortness of Breath',
    priority: 6,
  },
  [RISK_CODE.dt_CancerBreast]: {
    customer_friendly_reason: 'Your History of Breast Cancer',
    priority: 6,
  },
  [RISK_CODE.dt_Anxiety]: {
    customer_friendly_reason: 'Your History of Experiencing Anxiety',
    priority: 6,
  },
  [RISK_CODE['Bronchitis and Asthma']]: {
    customer_friendly_reason: 'Your History of Having Bronchitis with Asthma',
    priority: 6,
  },
  [RISK_CODE.dt_UlcerativeColitis]: {
    customer_friendly_reason: 'Your History of Ulcerative Colitis',
    priority: 6,
  },
  [RISK_CODE.dt_SubstanceUsageOther]: {
    customer_friendly_reason: 'Your Use of a Substance That Was Not In Our List',
    priority: 6,
  },
  [RISK_CODE.dt_Neuroleptics]: {
    customer_friendly_reason: 'Your History of Using Prescription Drugs',
    priority: 6,
  },
  [RISK_CODE.dt_MyocardialInfarction]: {
    customer_friendly_reason: 'Your History of Heart Attack(s)',
    priority: 6,
  },
  [RISK_CODE.dt_IrritableBowelSyndrome]: {
    customer_friendly_reason: 'Your History of Irritable Bowel Syndrome',
    priority: 6,
  },
  [RISK_CODE.dt_Cystitis]: {
    customer_friendly_reason: 'Your Experience with Cystitis',
    priority: 6,
  },
  [RISK_CODE.dt_CrohnsDisease]: {
    customer_friendly_reason: 'Your Experience with Crohn\'s Disease',
    priority: 6,
  },
  [RISK_CODE.dt_ChronicObstructivePulmonaryDisease]: {
    customer_friendly_reason: 'Your History of COPD',
    priority: 6,
  },
  [RISK_CODE.dt_AllergyFood]: {
    customer_friendly_reason: 'Your Food Allergy or Allergies',
    priority: 6,
  },
  [RISK_CODE.dt_AlcoholAbuse]: {
    customer_friendly_reason: 'Your Doctor\'s Recommendation To Reduce Alcohol Use',
    priority: 6,
  },
  [RISK_CODE.drv_WeightLoss]: {
    customer_friendly_reason: 'Your Weight Loss History',
    priority: 6,
  },
  [RISK_CODE['Family History of Cardiomyopathy']]: {
    customer_friendly_reason: 'Your Family History of Cardiomyopathy',
    priority: 6,
  },
  [RISK_CODE.AviationExperience]: {
    customer_friendly_reason: 'Your Aviation-Related Experience',
    priority: 6,
  },
  [RISK_CODE.dt_otherMovingViolation]: {
    customer_friendly_reason: 'Your Disclosed Driving Violation Experience',
    priority: 6,
  },
  [RISK_CODE.dt_Surgery]: {
    customer_friendly_reason: 'Your Previous or Upcoming Surgery',
    priority: 6,
  },
  [RISK_CODE.dt_Stimulants]: {
    customer_friendly_reason: 'Your History of Stimulants Use',
    priority: 6,
  },
  [RISK_CODE.dt_SleepApnea]: {
    customer_friendly_reason: 'Your Sleep Apnea',
    priority: 6,
  },
  [RISK_CODE.dt_PrescriptionDrugs]: {
    customer_friendly_reason: 'Your Prescription Drugs Treatment(s)',
    priority: 6,
  },
  [RISK_CODE.dt_PostPartumDepression]: {
    customer_friendly_reason: 'Your Experience with Post-partum Depression',
    priority: 6,
  },
  [RISK_CODE.dt_MajorMovingViolation]: {
    customer_friendly_reason: 'Your History of Major Moving Violation(s)',
    priority: 6,
  },
  [RISK_CODE.dt_HumanPapillomaVirus]: {
    customer_friendly_reason: 'Your Experience with HPV',
    priority: 6,
  },
  [RISK_CODE.dt_HepatitisBCarrier]: {
    customer_friendly_reason: 'Your History of Hepatitis B',
    priority: 6,
  },
  [RISK_CODE.dt_HelicopterSkiing]: {
    customer_friendly_reason: 'Your Helicopter Skiing Experience(s)',
    priority: 6,
  },
  [RISK_CODE.dt_CancerThyroid]: {
    customer_friendly_reason: 'Your History of Thyroid Cancer',
    priority: 6,
  },
  [RISK_CODE.dt_BoneFracture]: {
    customer_friendly_reason: 'Your Previous Bone Fracture(s)',
    priority: 6,
  },
  [RISK_CODE.dt_ArthritisOsteo]: {
    customer_friendly_reason: 'Your History of Osteoarthritis',
    priority: 6,
  },
  [RISK_CODE['Substance Use and Alcohol Abuse']]: {
    customer_friendly_reason: 'Substance or Alcohol Use',
    priority: 6,
  },
  [RISK_CODE['Gestational Diabetes and Pregnancy']]: {
    customer_friendly_reason: 'Your Gestational Diabetes',
    priority: 6,
  },
  [RISK_CODE['Class D Country']]: {
    customer_friendly_reason: 'Your Foreign Travel Plans',
    priority: 6,
  },
};

export const RISKS_BLACKLIST = [
  RISK_CODE.dt_Other, // Too vague - this means that the customer was asked a free-text question
  RISK_CODE['Benefit Override'], // Technical bug in Aura - this is an Aura operation that
  // shows up as a 'reason' when it doesnt mean anything to the customer
  RISK_CODE.dt_SecondaryHypertension, // Technical bug in Aura - whenever someone chooses
  // 'Hypertension', these other hypertension options also trigger
  RISK_CODE.dt_MalignantHypertension, // Technical bug in Aura - whenever someone chooses
  // 'Hypertension', these other hypertension options also trigger
  RISK_CODE.dt_HypertensionPulmonary, // Technical bug in Aura - whenever someone chooses
  // 'Hypertension', these other hypertension options also trigger
  RISK_CODE['Hypertension and Diabetes'], // A customer will already see 'Hypertension' and 'Diabetes'
  // separately as RUW reasons. This triggers when both are present so no need to also show this
  RISK_CODE.drv_WeightGain, // Always fires with 'Weight Gain' - no need to send both
  RISK_CODE['MIB Build Weight Loss'], // Almost always fires with 'MIB Code' Reason - no need to double up for now
  RISK_CODE['MIB Build Discrepancy'], // Almost always fires with 'MIB Code' Reason - no need to double up for now
  RISK_CODE.dt_SubstanceUsageOther, // Always fires with another reason. dt_OtherDrug should cover
  RISK_CODE.drv_WeightLoss, // Always triggers with 'Weight Loss' Reason
  RISK_CODE['Substance Use and Alcohol Abuse'], // The customer will already see 'Alcohol Abuse' and
  // 'Substance Abuse'. No need to double up
  RISK_CODE['Applicant Info'], // Can't differentiate, these are very broad
  RISK_CODE.dt_SuicideAttempt,
];

export const CI_RISKS_BLACKLIST = [
  RISK_CODE['Age Coverage'], // this is blacklisted since we don't have 1M+ for ci
];

export const NO_MEDICAL_OPTION_ORDER = {
  LEARN_MORE_ABOUT_NO_MEDICAL: 0,
  STARTED_NO_MEDICAL_ELIGIBILITY: 1,
  SUBMITTED_ELIGIBILITY_QUESTIONNAIRE: 2,
};

export const NO_MEDICAL_OPTION_STATUS = {
  LEARN_MORE_ABOUT_NO_MEDICAL:
    'Clicked to Learn More about No-Medical',
  STARTED_NO_MEDICAL_ELIGIBILITY:
    'Started No-Medical Eligibility Questionnaire',
  SUBMITTED_ELIGIBILITY_QUESTIONNAIRE:
    'Submitted Eligibility Questionnaire',
};

export const TITLE_CASE_EXCEPTIONS = [
  'a', 'abaft', 'about', 'above', 'afore', 'after', 'along', 'amid', 'among', 'an',
  'apud', 'as', 'aside', 'at', 'atop', 'below', 'but', 'by', 'circa', 'down', 'for',
  'from', 'given', 'in', 'into', 'lest', 'like', 'mid', 'midst', 'minus', 'near',
  'next', 'of', 'off', 'on', 'onto', 'out', 'over', 'pace', 'past', 'per', 'plus',
  'pro', 'qua', 'round', 'sans', 'save', 'since', 'than', 'thru', 'till', 'times',
  'to', 'under', 'until', 'unto', 'up', 'upon', 'via', 'vice', 'with', 'worth',
  'the', 'and', 'nor', 'or', 'yet', 'so',
];

export const SmokeDescriptions = () => {
  return <FormattedMessage
    id="const.smokeDescriptions.VdMwrZ"
    values={{
      u: chunks => <u>{chunks}</u>,
      b: chunks => <strong>{chunks}</strong>,
      ul: chunks => <>
        <Typography
          component="ul"
          align="left"
          variant="body1"
          message={chunks}
        />
        <Spacer size="spaceSmall" />
      </>,
      li: chunks => <Typography
        component="li"
        align="left"
        variant="body1"
        message={chunks}
      />,
      div: msg => <>
        <Spacer size="spaceLarge" />
        <Typography
          component="div"
          variant="h3"
          align="center"
          message={msg}
        />
        <Spacer size="spaceSmall" />
      </>,
    }}
  />;
};

export const KSM_CONVERSION_APP_SUBMIT_URL = 'https://ad.doubleclick.net/ddm/activity/src=11047780;type=appli0;cat=getmy0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1;num=1?';
export const KSM_CONVERSION_APP_START_APP_URL = 'https://ad.doubleclick.net/ddm/activity/src=11047780;type=start0;cat=getmy0;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?';
export const KSM_CONVERSION_APP_QUOTES_URL = 'https://ad.doubleclick.net/ddm/activity/src=11047780;type=start0;cat=getmy00;dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;tfua=;npa=;ord=1?';

export const USER_FAMILY_COMPOSITION = {
  SELF: 'Self',
  SELF_KIDS: 'Self + Kids',
  SELF_PARTNER: 'Self + Partner',
  SELF_PARTNER_KIDS: 'Self + Partner + Kids',
};

export const HELCIM_FAILURE_MESSAGES = {
  DECLINED: 'DECLINED',
  DECLINED_CVV2: 'DECLINED CVV2',
  EXPIRED_CARD: 'EXPIRED CARD',
  INVALID_CARD: 'INVALID CARD',
  MISSING_CURRENCY_HASH: 'Missing/Invalid Currency Hash',
  RETRY_5270: 'PLEASE RETRY5270',
  TEST_MODE_DISABLED: 'Test Mode Disabled in Helcim.js Config',
  AMOUNT_ERROR: 'AMOUNT ERROR - Tran Amount Error',
  APPL_TYPE_ERROR: 'APPL TYPE ERROR - Call support for help with this error',
  INVALID_CAVV: 'INVALID CAVV - Invalid Cardholder Authentication Verification Value',
  INVALID_TERM_ID: 'INVALID TERM ID - Invalid Terminal ID',
  INVLD_TERM_ID_1: 'INVLD TERM ID 1 - Invalid Merchant Number',
  INVLD_TERM_ID_2: 'INVLD TERM ID 2 - Invalid SE Number',
  INVLD_VOID_DATA: 'INVLD VOID DATA - Invalid Data Submitted for Void Transaction',
  MAX_MONTHLY_VOL: 'MAX MONTHLY VOL - This transaction would go over the maximum monthly volume',
  MICR_ERROR: 'MICR ERROR - MICR Read Error',
  MUST_SETTLE_MMDD: 'MUST SETTLE MMDD - Must settle, open batch is over 7 days old',
  RECORD_NOT_FOUND: 'RECORD NOT FOUND - Record not on the network',
  SEQ_ERR_PLS_CALL: 'SEQ ERR PLS CALL - Call support for help with this error',
  TOO_MANY_CHECKS: 'TOO MANY CHECKS - Too many checks (Over Limit)',
  DECLINED_HELP_9999: 'DECLINED-HELP 9999 - System Error',
  DUP_CHECK_NBR: 'DUP CHECK NBR - Duplicate Check Number',
  INVLD_RT_NBR: 'INVLD R/T NBR - Invalid Routing/Transit Number',
  AMT_OVER_SVC_LMT: 'AMT OVER SVC LMT - Amount is more than established service limit',
  DECLINED_NSF: 'DECLINED: NSF',
  REQ_EXCEEDS_BAL: 'REQ. EXCEEDS BAL. - Req. exceeds balance',
  NETWORK_ERROR: 'NETWORK ERROR - General System Error',
  PLEASE_RETRY: 'PLEASE RETRY - Please Retry/Reenter Transaction',
  PICK_UP_CARD: 'PICK UP CARD - Pick up card',
  CANNOT_CONVERT: 'CANNOT CONVERT - Check is ok, but cannot convert. Do Not Honor',
  DECLINED_DO_NOT_HONOR: 'DECLINED - Do Not Honor',
  DECLINED_T4: 'DECLINED T4 - Do Not Honor. Failed negative check, unpaid items',
  SERV_NOT_ALLOWED: 'SERV NOT ALLOWED - Invalid request',
  CALL_AUTH_CENTER: 'CALL AUTH. CENTER - Refer to Issuer',
  SUSPECTED_FRAUD: 'SUSPECTED FRAUD',
  RESTRICTED_CARD: 'RESTRICTED CARD',
  TRAN_NOT_ALLOWED: 'TRAN NOT ALLOWED',
  DEV_DECLINED: 'DECLINE CVV2 - Do not honor due to CVV2 mismatch\\failure',
  DEV_PICK_UP_CARD: 'PICK UP CARD - Pick up card',
  DEV_AMOUNT_ERROR: 'AMOUNT ERROR - Tran Amount Error',
  DEV_AMT_OVER_SVC_LMT: 'AMT OVER SVC LMT - Amount is more than established service limit',
  DEV_APPL_TYPE_ERROR: 'APPL TYPE ERROR - Call support for help with this error',
  DEV_CANNOT_CONVERT: 'CANNOT CONVERT - Check is ok, but cannot convert. Do Not Honor',
  DEV_DECLINED_T4: 'DECLINED T4 - Do Not Honor. Failed negative check, unpaid items',
  DEV_DECLINED_HELP_9999: 'DECLINED-HELP 9999 - System Error',
  DEV_DUP_CHECK_NBR: 'DUP CHECK NBR - Duplicate Check Number',
  DEV_DECLINED_DO_NOT_HONOR: 'DECLINED - Do Not Honor',
  DEV_EXPIRED_CARD: 'EXPIRED CARD - Expired Card',
  DEV_INCORRECT_PIN: 'INCORRECT PIN - Invalid PIN',
  DEV_INVALID_CARD: 'INVALID CARD - Invalid Card',
  DEV_INVALID_CAVV: 'INVALID CAVV - Invalid Cardholder Authentication Verification Value',
  DEV_INVALID_TERM_ID: 'INVALID TERM ID - Invalid Terminal ID',
  DEV_INVLD_RT_NBR: 'INVLD R/T NBR - Invalid Routing/Transit Number',
  DEV_INVLD_TERM_ID_1: 'INVLD TERM ID 1 - Invalid Merchant Number',
  DEV_INVLD_TERM_ID_2: 'INVLD TERM ID 2 - Invalid SE Number',
  DEV_INVLD_VOID_DATA: 'INVLD VOID DATA - Invalid Data Submitted for Void Transaction',
  DEV_MAX_MONTHLY_VOL: 'MAX MONTHLY VOL - This transaction would go over the maximum monthly volume',
  DEV_MICR_ERROR: 'MICR ERROR - MICR Read Error',
  DEV_MUST_SETTLE_MMDD: 'MUST SETTLE MMDD - Must settle, open batch is over 7 days old',
  DEV_NETWORK_ERROR: 'NETWORK ERROR - General System Error',
  DEV_PLEASE_RETRY: 'PLEASE RETRY - Please Retry/Reenter Transaction',
  DEV_RECORD_NOT_FOUND: 'RECORD NOT FOUND - Record not on the network',
  DEV_REQ_EXCEEDS_BAL: 'REQ. EXCEEDS BAL. - Req. exceeds balance',
  DEV_SEQ_ERR_PLS_CALL: 'SEQ ERR PLS CALL - Call support for help with this error',
  DEV_SERV_NOT_ALLOWED: 'SERV NOT ALLOWED - Invalid request',
  DEV_TOO_MANY_CHECKS: 'TOO MANY CHECKS - Too many checks (Over Limit)',
  DEV_CALL_AUTH_CENTER: 'CALL AUTH. CENTER - Refer to Issuer',
};

export const RESTORE_QUOTES_COOKIE_KEYS = {
  FAMILY_COMPOSITION: 'pm_family_composition',
  DOB: 'pm_primary_dob',
  SECONDARY_DOB: 'pm_secondary_dob',
  GENDER: 'pm_primary_gender',
  SECONDARY_GENDER: 'pm_secondary_gender',
  SMOKING_STATUS: 'pm_primary_smoking_status',
  SECONDARY_SMOKING_STATUS: 'pm_secondary_smoking_status',
  COVERAGE_AMOUNT: 'pm_coverage_amount',
  TERM_LENGTH: 'pm_term_length',
  JOINT_TOGGLE_FLAG: 'pm_joint_toggle_flag',
  PROVINCE: 'pm_province',
  SECONDARY_PROVINCE: 'pm_secondary_province',
  HEALTHCARD_PROVINCE: 'pm_primary_healthcard_province',
  SECONDARY_HEALTHCARD_PROVINCE: 'pm_secondary_healthcard_province',
  DEPENDENT_FLAG: 'pm_dependent_flag',
  DEPENDENTS_DETAILS: 'pm_dependents',
};

export type JointUserType = typeof USER_TYPES.PRIMARY | typeof USER_TYPES.SECONDARY;
export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];
export const USER_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DEPENDENT: 'dependent',
} as const;

export const BENEFICARY_OPTION = {
  LATER: 'later',
  NOW: 'now',
} as const;

export type ProductType = typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX];
export const PM_PRODUCT_PREFIX = {
  LIFE: 'life',
  CI: 'ci',
  HD: 'hd',
} as const;

// PM_SILI_PREFIX removed for HD-only webapp

export type ProductTypeFull = typeof PM_PRODUCT_TYPE[keyof typeof PM_PRODUCT_TYPE];
export const PM_PRODUCT_TYPE = {
  TERM_LIFE: 'term_life',
  STANDARD_CI: 'standard_ci',
  HEALTH_AND_DENTAL: 'health_dental',
} as const;

export const SAMPLE_LIFE_POLICY = 'sample-policy-term-life-en.pdf';
export const SAMPLE_LIFE_POLICY_QUEBEC = 'sample-policy-term-life-fr.pdf';

export const SAMPLE_CI_POLICY = 'sample-policy-critical-illness-en.pdf';
export const SAMPLE_CI_POLICY_QUEBEC = 'sample-policy-critical-illness-fr.pdf';

export const SAMPLE_PERM_LIFE_POLICY = 'sample-policy-perm-life-en.pdf';
export const SAMPLE_PERM_LIFE_POLICY_FR = 'sample-policy-perm-life-fr.pdf';

export const SAMPLE_HD_POLICY = 'sample-policy-health-dental-en.pdf';
export const SAMPLE_HD_POLICY_FR = 'sample-policy-health-dental-fr.pdf';

export const CUSTOMER_COMMITMENT_DOC = 'https://policyme.com/documents/policyme-promise-to-protect.pdf';

export const FAMILY_COMPOSITION_VALUES = {
  MYSELF_PARTNER_KIDS: 'Self + Partner + Kids',
  MYSELF_PARTNER: 'Self + Partner',
  MYSELF_KIDS: 'Self + Kids',
  MYSELF: 'Self',
};

export const FAMILY_COMPOSITION_VALUES_INDEX = {
  MYSELF_PARTNER_KIDS: 0,
  MYSELF_PARTNER: 1,
  MYSELF_KIDS: 2,
  MYSELF: 3,
};

export const FAMILY_REDUCER_MAPPING = [
  { hasPartner: true, hasKids: true },
  { hasPartner: true, hasKids: false },
  { hasPartner: false, hasKids: true },
  { hasPartner: false, hasKids: false },
];

export const FAMILY_DATA_VALUE = [
  {
    value: 0,
    text: <FormattedMessage id="familyDataValue.selfPartnerKids.VcNWyC" />,
    enum_value: USER_FAMILY_COMPOSITION.SELF_PARTNER_KIDS,
  },
  {
    value: 1,
    text: <FormattedMessage id="familyDataValue.joint.hly7BS" />,
    enum_value: USER_FAMILY_COMPOSITION.SELF_PARTNER,
  },
  {
    value: 2,
    text: <FormattedMessage id="familyDataValue.selfAndKids.63Ryj6" />,
    enum_value: USER_FAMILY_COMPOSITION.SELF_KIDS,
  },
  {
    value: 3,
    text: <FormattedMessage id="familyDataValue.self.SzuN7N" />,
    enum_value: USER_FAMILY_COMPOSITION.SELF,
  },
];
export type BuyingMethod = typeof BUYING_METHOD[keyof typeof BUYING_METHOD];
export const BUYING_METHOD = {
  STAND_ALONE: 'Stand-alone',
  CROSS_SELL: 'Cross-sell',
  AFTER_SELL: 'After-sell',
  CONVERSION: 'Conversion',
} as const;

export const LINK_TYPES = {
  JOINT: 'joint',
  LADDERED: 'laddered',
  CROSS_SELL: 'cross_sell',
};

export const CHANNEL_TYPES = {
  RETAIL: 'retail',
  GROUP: 'group',
};

export const APPLY_TOGETHER_MODAL_B = <Typography
  variant="body1"
  message={<FormattedMessage
    id="applyTogetherModal.B.gHHX6s"
  />}
/>;

export const INSURANCE_NAME = {
  TERM_LIFE_INSURANCE: 'Term Life Insurance',
  CRITICAL_ILLNESS_INSURANCE: 'Critical Illness Insurance',
};

export const PRODUCT_SKUS = {};

export const DOCUSIGN_CALLBACK_TYPE = {
  REVIEW_ESIGN: 'REVIEW_ESIGN',
  DOWNLOAD_MY_POLICY: 'DOWNLOAD_MY_POLICY',
};

export const CI_DEFAULT_COV_AMT_CROSS_SELL = 10000;

// Should match class ConversionTypes(enum.Enum) in global-restapi-analytics utm.py
export const CONVERSION_TYPES = {
  NONE: 'none',
  QUOTES: 'quotes',
  PHONECALL: 'phonecall',
  APP_STARTED: 'app_started',
  APP_SUBMITTED: 'app_submitted',
  EMAIL_CREATED: 'email_created',
};

export const AFFILIATE_NAMES = {
  WORKPERKS: 'WorkPerks',
  PERKOPOLIS: 'Perkopolis',
  LIFEWORKS: 'LifeWorks',
  TRIBE: 'Tribe',
  NESTO: 'Nesto',
  BENEFITSALLIANCE: 'BenefitsAlliance',
  HUMI: 'Humi',
  RATEHUB: 'Ratehub',
  GOODLIFEFITNESS: 'Goodlife Fitness',
  POLICY_ME_EMPLOYEE: 'PolicyMe Employee',
  RATEHUB_EXCLUSIVE_PERKS: 'Ratehub_Exclusive_Perk',
  COXFINANCIAL: 'CoxFinancial',
  BENEFITSCONNECT: 'BenefitsConnect',
  BRIDGEWELL: 'Bridgewell',
  SUTTON: 'Sutton',
  GBCC: 'GBCC',
  PRIMEBENEFITSGROUP: 'PrimeBenefitsGroup',
  BELAYADVISORS: 'BelayAdvisors',
  MCFADDEN: 'McFadden',
  CONSULTINGHOUSE: 'ConsultingHouse',
  BENEFITHUB: 'Benefithub_Exclusive_Perk',
  NESTO_EXCLUSIVE_PERKS: 'Nesto_Exclusive_Perk',
  ORCHARDBENEFITS: 'OrchardBenefits',
  BESTBENEFITS: 'Best Benefits',
  TELUSHEALTH: 'TELUS Health',
  BOOMGROUP: 'BOOM Group',
  UNISTAR: 'Unistar',
  MIKE_CARLSON: 'Mike Carlson',
  EMBARK: 'embark',
  ASET: 'ASET',
  MERCHANT_GROWTH: 'merchant_growth',
  WAVE: 'wave',
  ACHCCS: 'achccs',
  ADRIC: 'ADR Institute of Canada',
};

// Should match with class AFFILIATE_CATEGORIES(enum.Enum) in libpy-consts
export const AFFILIATE_CATEGORIES = {
  BASIC_AFFILIATE: 'basic_affiliate',
  MORTGAGE_BROKER: 'mortgage_broker',
  BENEFITS_BROKER: 'benefits_broker',
  POLICYME_PARTNER: 'policyme_partner',
  CONVERSION_AFFILIATE: 'conversion_affiliate',
  POLICYME_EMPLOYEE: 'pm_employee_discount',
  GROWTH_AFFILIATE: 'growth_affiliate',
};

export const VERIFICATION_ERROR_TYPE = {
  EXPIRED: 'expired',
  MAX_RETRIES: 'max-retries',
};

export const QUEBEC_PROVINCE_VALUE = 'QC';
export const SASKATCHEWAN_PROVINCE_VALUE = 'SK';
export const DEPENDENT_MIN_AGE = 0;
export const DEPENDENT_MAX_AGE = 20;
export const HD_MAX_AGE = 99;

export const REVOCABILITY_TYPE = {
  REVOCABLE: 'Revocable',
  IRREVOCABLE: 'Irrevocable',
};

export const REVOCABILITY_RADIO_OPTIONS = {
  REVOCABLE: <FormattedMessage id="revocability.revocable.e7E7Oo" />,
  IRREVOCABLE: <FormattedMessage id="revocability.irrevocable.14u7a3" />,
};

export const REVOCABILITY_SELECTOR = {
  INLINE: 'Inline',
  MODAL: 'Modal',
};

export const TODAY_PAYMENT_TEXT = {
  FREE: 'FREE',
};
// make sure update LOCAL_PORT_MAPPING in pm_utils also
// https://policyme.atlassian.net/wiki/spaces/EN/pages/2797436947/Default+Local+Port+Mapping
export const LOCAL_PORT_MAPPING = {
  LIFE_WEBAPP_MAIN: '3000',
  GLOBAL_RESTAPI_MAIN: '5000',
  LIFE_RESTAPI_MAIN: '5001',
  CI_RESTAPI_MAIN: '5002',
  LIFE_RESTAPI_QUOTES: '5003',
  CI_RESTAPI_QUOTES: '5004',
  GLOBAL_RESTAPI_DOCUSIGN: '5005',
  LIFE_RESTAPI_AURA: '5006',
  GLOBAL_RESTAPI_INTERNAL: '5007',
  GLOBAL_RESTAPI_ACCOUNTS: '5008',
  HD_RESTAPI_MAIN: '5010',
};

export const TENANT_SUBORGANIZATIONS = {
  CAA_AMA: 'AMA',
  CAA_ATL: 'ATL',
  CAA_BCAA: 'BCAA',
  CAA_MAN: 'MAN',
  CAA_NEO: 'NEO',
  CAA_NIA: 'NIA',
  CAA_QUE: 'QUE',
  CAA_SCON: 'SCON',
  CAA_SASK: 'SASK',
};

export const STRIPE_ERROR_MAPPING = {
  generic_decline: <FormattedMessage
    id="stripeErrorMapping.genericDecline.yW4IWo"
  />,
  incorrect_number: <FormattedMessage
    id="stripeErrorMapping.incorrectNumber.1dHpvX"
  />,
  incorrect_cvc: <FormattedMessage
    id="stripeErrorMapping.incorrectCvc.pO9ej9"
  />,
  incorrect_zip: <FormattedMessage
    id="stripeErrorMapping.incorrectZip.4oZr9R"
  />,
  incomplete_fields: <FormattedMessage
    id="stripeErrorMapping.incompleteFields.1dHp3X"
  />,
  insufficient_funds: <FormattedMessage
    id="stripeErrorMapping.insufficientFunds.8C1XuX"
  />,
  expired_card: <FormattedMessage
    id="stripeErrorMapping.expiredCard.xjUFgN"
  />,
  lost_card: <FormattedMessage
    id="stripeErrorMapping.lostCard.z1owjR"
  />,
  stolen_card: <FormattedMessage
    id="stripeErrorMapping.stolenCard.5dO1dH"
  />,
  different_payment_method: <FormattedMessage
    id="stripeErrorMapping.differentPaymentMethod.j09adn"
  />,
  default_message: <FormattedMessage
    id="stripeErrorMapping.unableToProcessPayment.1q3q3"
  />,
};

export const STRIPE_SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIALING: 'trialing',
};

export const HD_COMPARE_PLANS_URLS = {
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: {
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-guaranteed-issue-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-emission-garantie-fr.pdf',
    },
    [UNDERWRITING_METHODS.PORTABLE_COVERAGE]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-protect-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-protege-fr.pdf',
    },
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-all-plans-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-tous-les-plans-fr.pdf',
    },
  },
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: {
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE]: {
      [LOCALE.EN_CA]: 'documents/Plan+Comparison+Chart+-+CAA+Health+and+Dental+Guaranteed+Issue+Plans.pdf',
      [LOCALE.FR_CA]: 'documents/Comparaison+des+régimes+-+Régime+d’assurance+maladie+et+soins+dentaires+CAA+à+émission+garantie.pdf',
    },
    [UNDERWRITING_METHODS.PORTABLE_COVERAGE]: {
      [LOCALE.EN_CA]: 'documents/Plan+Comparison+Chart+-+CAA+Next+Health+and+Dental+Plans.pdf',
      [LOCALE.FR_CA]: 'documents/Comparaison+des+re%CC%81gimes+-+Re%CC%81gime+d%E2%80%99assurance+maladie+et+soins+dentaires+CAA+Remplacement.pdf',
    },
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN]: {
      [LOCALE.EN_CA]: 'documents/Plan+Comparison+Chart+-+CAA+Health+and+Dental+Fully+Underwritten+Plans.pdf',
      [LOCALE.FR_CA]: 'documents/Comparaison+des+re%CC%81gimes+-+Re%CC%81gime+d%E2%80%99assurance+sante%CC%81+et+dentaire+CAA+a%CC%80+tarification+comple%CC%80te.pdf',
    },
  },
  [TENANTS_NAME_CODES_MAPPING.BMOI]: {
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-guaranteed-issue-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-emission-garantie-fr.pdf',
    },
    [UNDERWRITING_METHODS.PORTABLE_COVERAGE]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-protect-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-protege-fr.pdf',
    },
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN]: {
      [LOCALE.EN_CA]: 'documents/assets/hd/pm-hd-plan-comparison-chart-all-plans-en.pdf',
      [LOCALE.FR_CA]: 'documents/assets/hd/pm-hd-comparaison-des-regimes-tous-les-plans-fr.pdf',
    },
  },
};

export const HOSTS = {
  POLICYME: ['policyme.com', 'localhost'],
  CAA_NATIONAL: [
    'insurance.caa.com',
    'insurance.policyme.info',
    'life.policyme.info',
    /\blife-health\b/,
    /\bvie-sante\b/,
    /.caask(.ondemand)?(.policyme)?.com/g,
    /.caaneo(.ondemand)?(.policyme)?.com/g,
    /.caaquebec(.ondemand)?(.policyme)?.com/g,
    /.caaniagara(.ondemand)?(.policyme)?.com/g,
    /.ab(.ondemand)?(.policyme)?.com/g,
    /.bcaa(.ondemand)?(.policyme)?.com/g,
    /.caa(.ondemand)?(.policyme)?.com/g,
    /.mb.caaforlife(.ondemand)?(.policyme)?.com/g,
    /.sco.caaforlife(.ondemand)?(.policyme)?.com/g,
  ],
};

export const MAX_FAMILY_MEMBERS_ALLOWED = 11;

export const LAST_DEPENDENT_INDEX = 9; // 10th dependent

export const FAMILY_ROLE = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  DEPENDENT: 'dependent',
};

export const WHAT_MATTERS_MOST_TO_YOU_OPTIONS = {
  COVER_CURRENT_PRESCRIPTION: 'current',
  COVER_FUTURE_MEDICATION: 'future',
  NO_NEED_COVER_MEDICATION_COVERAGE: 'no_coverage',
};

export const EXISTING_HD_PLAN_OPTION = {
  MANULIFE_FOLLOW_ME: 'manulife',
  SURE_HEALTH_LINK: 'surehealth',
  EMPLOYEE_BENEFITS: 'group_benefits_employer',
  COLLEGE_BENEFITS: 'group_benefits_college',
  OTHER: 'other',
  NOT_SURE: 'not_sure',
  SUN_LIFE: 'sun_life',
  CANADA_LIFE: 'canada_life',
  BLUE_CROSS: 'blue_cross',
  DESJARDINS: 'desjardins',
  EMPIRE: 'empire',
  CAA: 'caa',
  POLICYME: 'policyme',
};

export const TRACKING_COOKIES = {
  PM_ACCEPTED_COOKIES: 'pm_accepted_cookies',
};

export const DIGITAL_CONSENT_COOKIES = {
  FORCE_DIGITAL_CONSENT_ENABLED: 'force_digital_consent_enabled',
} as const;

export const TRACKING_COOKIES_STATUS = {
  [TRACKING_COOKIES.PM_ACCEPTED_COOKIES]: {
    ACCEPTED: 'true',
    UNKNOWN: 'unknown',
    REJECTED: 'false',
  },
};

export const TWO_FACTOR_STATUS = {
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
  PENDING: 'Pending',
  SKIPPED: 'Skipped',
};

export const TWO_FACTOR_FLOW = {
  SHOW_OTP_PAGE: 'Show otp page',
  SHOW_PHONE_PAGE: 'Show phone page',
  SHOW_CREATE_ACCOUNT_PAGE: 'Show create account page',
  SHOW_DASHBOARD_PAGE: 'Show dashboard page',
};

export const COOKIE_EXPIRY_DAYS = 365;

// Add the other question, check with product
// TODO: remove after Aura addresses the order/sections/questions for Dependents below 18
export const DEPENDENTS_AGE_BELOW_18_HD_BASE_QUESTIONS = [142, 229];

export const FORMATTED_PERIOD = {
  '/mo': <FormattedMessage id="global.perMonthExpanded.ax14a4" />,
};

export const PERMANENT_INSURANCE_AGE_RESTRICTION = 75;
export const PERMANENT_INSURANCE_V2_MIN_AGE = 60;

export const HD_PAGE_EVENTS = {
  COVERAGE_FIT_QUESTION_PAGE: 'Coverage Fit Question Page',
  HD_EXISTING_COVERAGE_PAGE: 'H&D - Existing Coverage Page',
  HD_GROUP_BENEFITS_PAGE: 'H&D - Group Benefits Page',
};

export const LEGACY_SEGMENT_EVENTS = {
  HD_USER_INTENT_INDICATED: 'H&D - Intent Page',
  EXPERIMENT_VIEWED: 'Experiment Viewed',
  USER_INTENT_INDICATED: 'User Intent Indicated',
  APPLICATION_STARTED: 'Application Started',
  APPLICATION_SUBMITTED: 'Application Submitted',
  DECISION_RECEIVED: 'Decision Received (Aura)',
  SAW_PERMANENT_INSURANCE: 'Saw Permanent Insurance on Quotes Page',
  QUOTE_RECEIVED: 'Quote Received',
  QUOTE_SHOWN: 'Quote Shown',
  INPUTS_RECEIVED: 'Inputs Received',
  PAYMENT_RECEIVED: 'Payment Received',
  RECOMMENDATION_RECEIVED: 'Recommendation Received',
  LOGIN_INITIATED: 'Login Initiated',
  LOGIN_SUCCESSFUL: 'Login Successful',
  COVERAGE_FIT_QUESTION_PAGE: 'Coverage Fit Question Page',
  HD_FAMILY_COMPOSITION_QUESTION_PAGE: 'H&D - Family Composition Page View',
  HD_HOUSEHOLD_INCOME_QUESTION_PAGE: 'H&D - Household Income Question Page View',
  HD_EXISTING_COVERAGE_PAGE: 'H&D - Existing Coverage Page',
  HD_GROUP_BENEFITS_PAGE: 'H&D - Group Benefits Page',
  DEFAULT_RECOMMENDATION_RECEIVED: 'Default Recommendation Received',
  PAYMENT_COMPLETED: 'Payment Completed',
};

export const SEGMENT_EVENTS = {
  EXPERIMENT_VIEWED: 'experiment_viewed',
  USER_INTENT_INDICATED: 'user_intent_indicated',
  APPLICATION_STARTED: 'application_started',
  APPLICATION_SUBMITTED: 'application_submitted',
  DECISION_RECEIVED: 'decision_received_aura',
  QUOTE_RECEIVED: 'quote_received',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_COMPLETED: 'payment_completed',
  LOGIN_INITIATED: 'login_initiated',
  LOGIN_SUCCESSFUL: 'login_successful',
  COVERAGE_FIT_QUESTION_PAGE: 'coverage_fit_question_page',
  HD_FAMILY_COMPOSITION_QUESTION_PAGE: 'hd_family_composition_question_page',
  HD_HOUSEHOLD_INCOME_QUESTION_PAGE: 'hd_household_income_question_page',
  HD_EXISTING_COVERAGE_PAGE: 'hd_existing_coverage_page',
  HD_GROUP_BENEFITS_PAGE: 'hd_group_benefits_page',
  RECOMMENDATION_RECEIVED: 'recommendation_received',
};

export const DISABLE_JOINT_SLOTS = {
  REPLACE_QUOTES_INPUT_HEADER: 'replace-quotes-input-header',
  REPLACE_QUOTES_COMPARE_INPUT_ADD_PARTNER_BTN: 'replace-quotes-compare-input-add-partner-btn',
  REPLACE_COVERAGE_REDESIGN_JOINT_COMPONENT: 'replace-coverage-redesign-joint-component',
  REPLACE_ESTIMATED_MONTHLY_RATE_JOINT_DISCOUNT_LABEL: 'replace-estimated-monthly-rate-joint-discount-label',
};
export const AMF_CLIENT_NUMBER = '608062';
export const AMF_AUTHORITY_RECORDS_URL = 'https://lautorite.qc.ca/en/general-public/registers/register-of-firms-and-individuals-authorized-to-practice';
export const AMF_AUTHORITY_RECORDS_URL_FR = 'https://lautorite.qc.ca/grand-public/registres/registre-des-entreprises-et-des-individus-autorises-a-exercer';

export const DIGITAL_CONSENT_STATUS = {
  INACTIVE: 'inactive',
  PENDING: 'pending',
  CONSENTED: 'consented',
};

export const USER_INTENT_VALUES = {
  MORTGAGE: 'Mortgage',
  FAMILY_WELLBEING: 'Family well-being',
  REPLACEMENT: 'Replacement',
  END_OF_LIFE_EXPENSES: 'End of Life Expenses',
  WHOLE_INSURANCE: 'Whole or Universal Life Insurance',
  HOME_AUTO_HEALTH: 'Home or Auto Health',
  HEALTH_DENTAL_INSURANCE: 'Health and Dental Insurance',
  AUTO_INSURANCE: 'Auto Insurance',
  HOME_INSURANCE: 'Home Insurance',
  BROWSING: 'Browsing',
  SUPPLEMENT: 'Supplement Existing Coverage',
  SELF_EMPLOYED: 'Self-employed or Contractor',
  SMALL_BUSINESS_OWNER: 'Small Business Owner',
  CHANGING_JOBS: 'Changing Jobs',
  RETIRING: 'Retiring',
  UNHAPPY: 'Unhappy with Current Health Coverage',
  EXPLORING_ALTERNATIVES: 'Exploring Alternatives',
  NEW_TO_CANADA: 'Newcomer to Canada',
  OTHER: 'Other',
};

export const USER_INTENT_CHOICES = [
  {
    text: <FormattedMessage id="intent.mortgage.aA1bB2" />,
    value: USER_INTENT_VALUES.MORTGAGE,
  },
  {
    text: <FormattedMessage id="intent.familywellbeing.cC3dD4" />,
    value: USER_INTENT_VALUES.FAMILY_WELLBEING,
  },
  {
    text: <FormattedMessage id="intent.replacement.eE5fF6" />,
    value: USER_INTENT_VALUES.REPLACEMENT,
  },
  {
    text: <FormattedMessage id="intent.eolexpenses.gG7hH8" />,
    value: USER_INTENT_VALUES.END_OF_LIFE_EXPENSES,
  },
  {
    text: <FormattedMessage id="intent.wholeorlifeuniversal.iI9jJ0" />,
    value: USER_INTENT_VALUES.WHOLE_INSURANCE,
  },
  {
    text: <FormattedMessage id="intent.autoInsurance.z43Flu" />,
    value: USER_INTENT_VALUES.AUTO_INSURANCE,
  },
  {
    text: <FormattedMessage id="intent.homeInsurance.vXGzl0" />,
    value: USER_INTENT_VALUES.HOME_INSURANCE,
  },
  {
    text: <FormattedMessage id="intent.healthDentalInsurance.soQjSX" />,
    value: USER_INTENT_VALUES.HEALTH_DENTAL_INSURANCE,
  },
  {
    text: <FormattedMessage id="intent.browsing.mM3nN4" />,
    value: USER_INTENT_VALUES.BROWSING,
  },
];

export const USER_HD_INTENT_CHOICES = [
  {
    text: <FormattedMessage id="intent.selfEmployedNoBenefits.ZnJqWQ" />,
    value: USER_INTENT_VALUES.SELF_EMPLOYED,
  },
  {
    text: <FormattedMessage id="intent.businessOwnerCoverage.SHAGqb" />,
    value: USER_INTENT_VALUES.SMALL_BUSINESS_OWNER,
  },
  {
    text: <FormattedMessage id="intent.topUp.12LKeR" />,
    value: USER_INTENT_VALUES.SUPPLEMENT,
  },
  {
    text: <FormattedMessage id="intent.switchingEmployer.14LKeR" />,
    value: USER_INTENT_VALUES.CHANGING_JOBS,
  },
  {
    text: <FormattedMessage id="intent.privateHealthcareOptions.16LKeR" />,
    value: USER_INTENT_VALUES.EXPLORING_ALTERNATIVES,
  },
  {
    text: <FormattedMessage id="intent.retired.18LKeR" />,
    value: USER_INTENT_VALUES.RETIRING,
  },
  {
    text: <FormattedMessage id="intent.newToCanada.20LKeR" />,
    value: USER_INTENT_VALUES.NEW_TO_CANADA,
  },
  {
    text: <FormattedMessage id="intent.other.22LKeR" />,
    value: USER_INTENT_VALUES.OTHER,
  },
];

export type JourneyIngressPoint =
  typeof JOURNEY_INGRESS_POINTS[keyof typeof JOURNEY_INGRESS_POINTS];
export const JOURNEY_INGRESS_POINTS = {
  DECISION: 'Decision',
} as const;

// This mirrors the enum in global-libpy-documents
// https://github.com/policyme/global-libpy-documents/blob/322b983d8084afcc96fc0a7fc811d235d2de1146/pm_documents/types/qa_document.py#L8
export const QA_DOCUMENT_ORIGIN = {
  POLICY_CONTRACT: 'policy_contract',
  CONSENT_PAGE: 'consent_page',
  WELCOME_PACKAGE: 'welcome_package',
} as const;

// PERM_INSURANCE_DISABLED_SLOTS removed for HD-only webapp

export const SESSION_STORAGE_LOGGING = {
  ELIGIBILITY_LOGS: 'eligibilityLogs',
  IS_REPLACING: 'isReplacing',
  CHANGE_HISTORY: 'changeHistory',
  AMOUNT: 'amount',
  TYPE: 'type',
  CATEGORY: 'category',
  PRIMARY_INCOME: 'primaryIncome',
  SECONDARY_INCOME: 'secondaryIncome',
  HAS_EXISTING_POLICIES: 'hasExistingPolicies',
  SAVINGS_AND_INVESTMENTS: 'savingsAndInvestments',
  VALUE_OF_HOME: 'valueOfYourHome',
  MORTGAGE: 'mortgage',
  DEBTS: 'otherDebts',
  IS_PENDING_POLICIES: 'isPendingPolicies',
  IS_REPLACING_POLICIES: 'isReplacingPolicies',
  IS_REPLACING_PENDING_POLICIES: 'isReplacingPendingPolicy',
};

export const MODAL_FIELDS = {
  USER_GENDER: 'userGender',
  SMOKE: 'smoke',
  BIRTHDATE: 'birthdate',
  PROVINCE: 'province',
};

export const MARKETING_COMMUNICATIONS_CONSENT_SLOTS = {
  COMMUNICATIONS_CHECKBOX_SLOT: 'communications-checkbox-slot',
};

export const HD_PLAN_CATEGORY_TRANSLATIONS = {
  [HD_PLAN_TYPES_CATEGORIES.COVERS_DRUG_AND_DENTAL]: (
    <FormattedMessage id="planCategory.covers_drug_and_dental.4F7e59" />
  ),
  [HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DENTAL]: (
    <FormattedMessage id="planCategory.plans_without_dental.e8wlpz" />
  ),
  [HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DRUG]: (
    <FormattedMessage id="planCategory.plans_without_drug.pwLDje" />
  ),
};

export const HD_MOBILE_PLAN_CATEGORY_TRANSLATIONS = {
  [HD_PLAN_TYPES_CATEGORIES.COVERS_DRUG_AND_DENTAL]: (
    <FormattedMessage id="planCategory.covers_drug_and_dental.shortened.4F7e59" />
  ),
  [HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DENTAL]: (
    <FormattedMessage id="planCategory.plans_without_dental.shortened.e8wlpz" />
  ),
  [HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DRUG]: (
    <FormattedMessage id="planCategory.plans_without_drug.shortened.pwLDje" />
  ),
};

export const COVERAGE_FIT_OPTIONS = {
  PRESCRIPTION_DENTAL_COVERAGE_NEEDED: 'dental_and_prescription',
  PRESCRIPTION_DRUGS_NOT_NEEDED: 'no_prescription',
  DENTAL_COVERAGE_NOT_NEEDED: 'no_dental',
} as const;

export const COVERAGE_FIT_PLAN_CATEGORY_MAPPING = {
  [COVERAGE_FIT_OPTIONS.PRESCRIPTION_DENTAL_COVERAGE_NEEDED]: (
    HD_PLAN_TYPES_CATEGORIES.COVERS_DRUG_AND_DENTAL
  ),
  [COVERAGE_FIT_OPTIONS.PRESCRIPTION_DRUGS_NOT_NEEDED]: (
    HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DRUG
  ),
  [COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED]: (
    HD_PLAN_TYPES_CATEGORIES.PLANS_WITHOUT_DENTAL
  ),
} as const;

export class AgeLimitConfig {
  static defaultAgeLimit: AgeRange = {
    min: MIN_AGE,
    max: NEW_PROD_MAX_AGE,
  }

  static productSpecificAgeLimit: ProductSpecificAgeLimit = {
    [PM_PRODUCT_PREFIX.HD]: {
      min: MIN_AGE,
      max: MAX_AGE_HD,
    },
  }
}

export const USER_PLAN_AGE_ELIBIGILITY = {
  ECONOMIC_PLAN_MAX_AGE: 65,
};

export const STATUTORY_HOLIDAYS = [
  '2025-01-01',
  '2025-02-17',
  '2025-04-18',
  '2025-05-19',
  '2025-07-01',
  '2025-08-04',
  '2025-09-01',
  '2025-10-13',
  '2025-12-25',
  '2025-12-26',
  '2026-01-01',
  '2026-02-16',
  '2026-04-03',
  '2026-05-18',
  '2026-07-01',
  '2026-08-03',
  '2026-09-07',
  '2026-10-12',
  '2026-12-25',
  '2026-12-28',
];

export const INTEGRATION_TEST_ENVS = [
  'dev',
  'test',
  'local',
];

export const SEGMENT_EVENTS_HD_FAQS = {
  cancellationPolicy: 'Cancellation Policy FAQ Expanded',
  addRemoveFamily: 'Add or Remove Family FAQ Expanded',
  upgradePolicy: 'Upgrade Policy FAQ Expanded',
  coverageAmount: 'Coverage Amount FAQ Expanded',
  ReasonableCustomaryLimits: 'Reasonable Customary Limits FAQ Expanded',
  directBilling: 'Direct Billing FAQ Expanded',
  startPlan: 'Start Plan FAQ Expanded',
  paymentDate: 'Payment Date FAQ Expanded',
  // waitingPeriod: 'Waiting Period FAQ Expanded',
};

export const PRIVACY_POLICY_URL = (application_language: LocaleType) => {
  if (application_language === LOCALE.FR_CA) {
    return `${getUrls().homepage}/fr/confidentialite`;
  }
  return `${getUrls().homepage}/privacy`;
};

export const LEGAL_AND_COMPLIANCE_URL = (application_language: LocaleType) => {
  if (application_language === LOCALE.FR_CA) {
    return `${getUrls().homepage}/fr/juridique-et-conformite`;
  }
  return `${getUrls().homepage}/legal`;
};

export const SEPTEMBER_TL_DISCOUNT_BANNER_TERMS_AND_CONDITIONS_URL = (
  application_language: LocaleType,
) => {
  if (application_language === LOCALE.FR_CA) {
    return `${getUrls().homepage}/fr/juridique-et-conformite/conditions-generales-super-offre-septembre-2025`;
  }
  return `${getUrls().homepage}/legal/september-savings-2025-terms-and-conditions`;
};

export const ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING = {
  // this mapping is only for analytics events so no need to translate
  [COVERAGE_FIT_OPTIONS.PRESCRIPTION_DENTAL_COVERAGE_NEEDED]: {
    jointTextId: 'We need prescription drugs and dental coverage',
    singleTextId: 'I need prescription drugs and dental coverage',
  },
  [COVERAGE_FIT_OPTIONS.PRESCRIPTION_DRUGS_NOT_NEEDED]: {
    jointTextId: 'We do not need prescription drugs',
    singleTextId: 'I do not need prescription drugs',
  },
  [COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED]: {
    jointTextId: 'We do not need dental coverage (or we are enrolled/planning to enrol in the Canadian Dental Care Plan)',
    singleTextId: 'I do not need dental coverage (or I am enrolled/planning to enrol in the Canadian Dental Care Plan)',
  },
} as const;

export const COVERAGE_FIT_OPTIONS_TEXT_MAPPING = [
  {
    jointText: <FormattedMessage id="coverageFitsPage.joint.option1.wi9Wq4" />,
    singleText: <FormattedMessage id="coverageFitsPage.individual.option1.wi9Wq4" />,
    value: COVERAGE_FIT_OPTIONS.PRESCRIPTION_DENTAL_COVERAGE_NEEDED,
  },
  {
    jointText: <FormattedMessage id="coverageFitsPage.joint.option2.0iZCs5" />,
    singleText: <FormattedMessage id="coverageFitsPage.individual.option2.0iZCs5" />,
    value: COVERAGE_FIT_OPTIONS.PRESCRIPTION_DRUGS_NOT_NEEDED,
  },
  {
    jointText: <FormattedMessage id="coverageFitsPage.joint.option3.TfCkng" />,
    singleText: <FormattedMessage id="coverageFitsPage.individual.option3.TfCkng" />,
    value: COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED,
  },
];

export const FAMILY_COMPOSITION_OPTIONS = [
  {
    text: <FormattedMessage id="family.selection.FN3GnN" />,
    value: FAMILY_COMPOSITION_VALUES.MYSELF_PARTNER_KIDS,
  },
  {
    text: <FormattedMessage id="family.selection.y2npiN" />,
    value: FAMILY_COMPOSITION_VALUES.MYSELF_PARTNER,
  },
  {
    text: <FormattedMessage id="family.selection.74fmET" />,
    value: FAMILY_COMPOSITION_VALUES.MYSELF_KIDS,
  },
  {
    text: <FormattedMessage id="family.selection.l1roJZ" />,
    value: FAMILY_COMPOSITION_VALUES.MYSELF,
  },
];

export type HouseholdIncomeType =
  typeof HOUSEHOLD_INCOME_VALUES[keyof typeof HOUSEHOLD_INCOME_VALUES];

export const HOUSEHOLD_INCOME_VALUES = {
  UNDER_30K: 'under_30k',
  BETWEEN_30K_AND_49K: '30k-49k',
  BETWEEN_50K_AND_69K: '50k-69k',
  BETWEEN_70K_AND_90K: '70k-90k',
  BETWEEN_91K_AND_119K: '91k-119k',
  ABOVE_120K: '120k_or_more',
} as const;

export const HOUSEHOLD_INCOME_OPTIONS = [
  {
    text: <FormattedMessage id="householdIncome.under30k.1a2b3c" />,
    value: HOUSEHOLD_INCOME_VALUES.UNDER_30K,
  },
  {
    text: <FormattedMessage id="householdIncome.between30kAnd49k.4d5e6f" />,
    value: HOUSEHOLD_INCOME_VALUES.BETWEEN_30K_AND_49K,
  },
  {
    text: <FormattedMessage id="householdIncome.between50kAnd69k.7g8h9i" />,
    value: HOUSEHOLD_INCOME_VALUES.BETWEEN_50K_AND_69K,
  },
  {
    text: <FormattedMessage id="householdIncome.between70kAnd90k.j1k2l3" />,
    value: HOUSEHOLD_INCOME_VALUES.BETWEEN_70K_AND_90K,
  },
  {
    text: <FormattedMessage id="householdIncome.between91kAnd119k.m4n5o6" />,
    value: HOUSEHOLD_INCOME_VALUES.BETWEEN_91K_AND_119K,
  },
  {
    text: <FormattedMessage id="householdIncome.above120k.p7q8r9" />,
    value: HOUSEHOLD_INCOME_VALUES.ABOVE_120K,
  },
];

export type PMPaymentMethod = 'apple_pay' | 'google_pay' | 'credit_card' | 'pre_authorized_debit';

export const AUTH0_RESPONSE_ERROR = {
  EMAIL_NOT_FOUND: 'email_not_found',
  APPLE_RELAY_EMAIL: 'apple_relay_email',
} as const;