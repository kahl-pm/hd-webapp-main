import React from 'react';
import { FormattedMessage } from 'react-intl';
import { getTenant, LOCALE } from '@policyme/global-libjs-utils';
import { getNameOrAbbreviation, isEmail } from '../utils/helpers';
import {
  GENDERS, PM_PRODUCT_PREFIX, QUEBEC_PROVINCE_VALUE,
  SAMPLE_HD_POLICY, SAMPLE_HD_POLICY_FR,
  SASKATCHEWAN_PROVINCE_VALUE, USER_TYPES,
} from '../utils/const';
import {
  formatDateByLocale, formatDateWithYearShortConfig, momentDateFormatWithYearShortMonth,
} from '../utils/reactIntlHelpers';

const getExistingCoverage = (state, userType) => {
  let total = 0;
  if (state[userType].household.existingCoverage.user.group) {
    total += state[userType].household.existingCoverage.user.group;
  }
  if (state[userType].household.existingCoverage.user.individual) {
    total += state[userType].household.existingCoverage.user.individual;
  }
  return total;
};

const getNetWorth = (state) => {
  const { household } = state;
  const retirementSaving = household.retirementSavings || 0;
  const nonRetirementSavings = household.nonRetirementSavings || 0;
  const creditCards = household.creditCards || 0;
  const studentLoans = household.studentLoans || 0;
  const homeEquityLoans = household.homeEquityLoans || 0;
  const linesOfCredit = household.linesOfCredit || 0;
  const otherDebt = household.otherDebt || 0;
  const mortgage = household.mortgage || 0;

  return retirementSaving + nonRetirementSavings - mortgage - creditCards - studentLoans
    - homeEquityLoans - linesOfCredit - otherDebt;
};

const getSavings = (state) => {
  const { household } = state;
  const retirementSavings = household.retirementSavings || 0;
  const nonRetirementSavings = household.nonRetirementSavings || 0;

  return retirementSavings + nonRetirementSavings;
};

const getDebts = (state) => {
  const { household } = state;
  const creditCards = household.creditCards || 0;
  const studentLoans = household.studentLoans || 0;
  const homeEquityLoans = household.homeEquityLoans || 0;
  const linesOfCredit = household.linesOfCredit || 0;
  const otherDebt = household.otherDebt || 0;

  return creditCards + studentLoans
    + homeEquityLoans + linesOfCredit + otherDebt;
};

const getDebtsWithMtge = (state) => {
  const { household } = state;
  const mortgage = household.mortgage || 0;

  return getDebts(state) + mortgage;
};

const hasValidEmail = (state) => {
  return isEmail(state.household.email.trim());
};

const contactCustomerInformation = (state) => {
  const {
    household: { birthdate, userGender, smoke },
  } = state;

  return `Birthdate: ${birthdate}
  Gender: ${userGender}
  Smoke: ${smoke}`;
};

const getPartnerHeOrSheText = (state) => {
  const { gender } = state.secondary.household;
  if (gender === GENDERS.FEMALE) {
    return 'she';
  }
  return 'he';
};

const getPartnerHisOrHerText = (state) => {
  const { gender } = state.secondary.household;
  if (gender === GENDERS.FEMALE) {
    return 'her';
  }
  return 'his';
};

const getYourPartnerText = (state) => {
  const { firstName } = state.secondary.household;
  const { application_language } = state.primary.household;
  return getNameOrAbbreviation(firstName, <FormattedMessage id="getYourPartnerText.qdvaeH" />, application_language);
};

const getMyselfText = (state) => {
  const { firstName, application_language } = state.primary.household;
  return getNameOrAbbreviation(firstName, <FormattedMessage id="getMyselfText.SvzsU4" />, application_language);
};

const getMyPartnerText = (state) => {
  const { firstName } = state.secondary.household;
  const { application_language } = state.primary.household;
  return getNameOrAbbreviation(firstName, <FormattedMessage id="getMyPartnerText.VEjDQu" />, application_language);
};

// Return shared fields for override
const getSharedOverrideFields = (state) => {
  const { assetsTotOverride, debtsTotOverride } = state.primary.household;
  return {
    assetsTotOverride,
    debtsTotOverride,
  };
};

const getBirthDateText = (state) => {
  let [day, month, year] = state.household.birthdate.split('/');
  return formatDateByLocale(
    state.household.application_language,
    new Date(`${year}/${month}/${day}`),
    formatDateWithYearShortConfig,
    momentDateFormatWithYearShortMonth,
  );
};

const getSmokerText = (state) => {
  if (state.household.smoke) {
    return <FormattedMessage id="getSmokerText.5eeybw" values={{ gender: state.household.userGender }} />;
  }
  return <FormattedMessage id="getNonSmokerText.BaHmzf" values={{ gender: state.household.userGender }} />;
};

const getGenderText = (state) => {
  if (state.household.userGender === GENDERS.FEMALE) {
    return <FormattedMessage id="global.gender.female.4mG8rj" />;
  }
  return <FormattedMessage id="global.gender.male.U0zZd2" />;
};

const getProvince = (userType) => (state) => state[userType].household.province;

const getHealthcardProvince =
  (userType) => (state) => state[userType].household.healthcard_province;

const isQuebecHealthCardProvince = (state) => {
  const primaryProvince = getHealthcardProvince(USER_TYPES.PRIMARY)(state);
  const secondaryProvince = getHealthcardProvince(USER_TYPES.SECONDARY)(state);
  return [primaryProvince, secondaryProvince].includes(QUEBEC_PROVINCE_VALUE);
};

const isQuebecHousehold = (state) => {
  const primaryProvince = getProvince(USER_TYPES.PRIMARY)(state);
  const secondaryProvince = getProvince(USER_TYPES.SECONDARY)(state);
  return [primaryProvince, secondaryProvince].includes(QUEBEC_PROVINCE_VALUE);
};

const isSaskatchewanHousehold = (state) => {
  const primaryProvince = getProvince(USER_TYPES.PRIMARY)(state);
  const secondaryProvince = getProvince(USER_TYPES.SECONDARY)(state);
  return [primaryProvince, secondaryProvince].includes(SASKATCHEWAN_PROVINCE_VALUE);
};

const getLocaleText = (userState) => {
  // Show other language to switch to
  // If current language is FR, show EN and vice versa
  if (userState.household.application_language === LOCALE.FR_CA) {
    return 'EN';
  }
  return 'FR';
};

const getSamplePolicyContract = (product, applicationLanguage, isPermanentInsurance = false) => {
  const tenantCode = getTenant().code;
  if (product === PM_PRODUCT_PREFIX.HD) {
    if (applicationLanguage === LOCALE.FR_CA) {
      return `/documents/sample_policies/hd/${tenantCode.toLowerCase()}-${SAMPLE_HD_POLICY_FR}`;
    }
    return `/documents/sample_policies/hd/${tenantCode.toLowerCase()}-${SAMPLE_HD_POLICY}`;
  }
  return '';
};

export {
  getExistingCoverage,
  hasValidEmail,
  contactCustomerInformation,
  getNetWorth,
  getSavings,
  getDebts,
  getDebtsWithMtge,
  getYourPartnerText,
  getMyPartnerText,
  getMyselfText,
  getPartnerHeOrSheText,
  getPartnerHisOrHerText,
  getSharedOverrideFields,
  getBirthDateText,
  getSmokerText,
  getGenderText,
  getProvince,
  isQuebecHealthCardProvince,
  isQuebecHousehold,
  getLocaleText,
  getSamplePolicyContract,
  getHealthcardProvince,
  isSaskatchewanHousehold,
};
