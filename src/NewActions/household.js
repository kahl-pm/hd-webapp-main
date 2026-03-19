import React from 'react';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';
import shortid from 'shortid';
import jsCookie from 'js-cookie';
import { sentryError, segmentTrackEvent, LOCALE, hasFlag, TENANT_FLAGS, accountIdWrapper } from '@policyme/global-libjs-utils';

import { getPmUserTypeQuote } from '../Selectors/quotes';
import { getUserSlice, isJoint } from '../Selectors/userControl';
import { doCrmSyncUpsertContact } from './crm';
import { verifyEmail } from './emailVerification';
import { showConfirmationModal, updateMetadata } from './metadata';
import { nextQuestion, updateSessionPropPrimary, upsertHouseholdId } from './session';

import { isPartnerSameAddress } from '../Selectors/jointMetadata';
import {
  patchHouseholdInfos,
  postValidateContact, putHouseholdInfos,
} from './fetch';
import {
  postProductSession,
} from './helpers/productFetch';

import { getProductTotalAmt } from '../Selectors/helpers/productSession';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { GLOBAL_MAIN_ENDPOINT, PM_TRACK_UNSET_ADDRESS } from '../config';
import { APP_FORM_FIELDS, EMAIL_REF_VERSIONS, GENDERS, INSURANCE_OWNERSHIP_TYPES, PM_PRODUCT_PREFIX,
  PROVINCES_ABBREVIATIONS,
  STANDARD_EMAIL_ERROR_TEXT, USER_TYPES } from '../utils/const';
import { allUsers, blockingRequest, genderToShorthand, getCookieDomain, getOtherUserType,
  hasValue, makeUpdateAllUsersSessionProp, makeUpdateTerm, toNameFormat, validateDDMMYYYY, withErrorModalOnFail } from '../utils/helpers';
import { handlePostAccountRecord } from './handle';
import { updateDependentHousehold } from './dependents';
import { fetch } from '../utils/fetch';
import { getLocaleText } from '../Selectors/household';
import { makeUpdateProductAppProp } from './helpers/productApp';

export const makeUpdateHouseholdProp = (user) => (property, value) => {
  return (dispatch, getState) => {
    // Track if country/province goes from defined to undefined when enabled
    if (PM_TRACK_UNSET_ADDRESS === '1') {
      const state = getState();
      const currentCountry = state[user]?.household?.country;
      const currentProvince = state[user]?.household?.province;

      if ((property === 'country' && !value && currentCountry) ||
          (property === 'province' && !value && currentProvince)) {
        sentryError('Country or province field became undefined', {
          extras: {
            user,
            property,
            previousValue: property === 'country' ? currentCountry : currentProvince,
            newValue: value,
            currRoute: state.metadata.currRoute || 'unknown',
          },
        });
      }
    }

    dispatch({
      type: `@@${user}/household/update_household_prop`,
      property,
      value,
    });

    // Life/CI insurance_ownership_type logic removed for HD-only flow
  };
};
export const updateHouseholdPropPrimary = makeUpdateHouseholdProp('primary');
export const updateHouseholdPropSecondary = makeUpdateHouseholdProp('secondary');
export const updateHouseholdPropAll = makeUpdateHouseholdProp('all');

export const makeUpdateEmail = (user) => (value) => {
  return {
    type: `@@${user}/household/update_email`,
    value,
  };
};
export const updateEmailPrimary = makeUpdateEmail('primary');
export const updateEmailSecondary = makeUpdateEmail('secondary');

export const updateHasKids = (value) => {
  return {
    type: `@@all/household/update_has_kids`,
    value,
  };
};

export const removeKid = (id) => {
  return {
    type: `@@all/household/remove_kid`,
    id,
  };
};

export function addKid() {
  return {
    type: `@@all/household/add_kid`,
    reactId: shortid.generate(),
  };
}

export function updateKid(id, age) {
  return {
    type: `@@all/household/update_kid`,
    id,
    age,
  };
}

export function updateHasSavings(value) {
  return {
    type: `@@all/household/update_has_savings`,
    value,
  };
}

export function updateHasDebts(value) {
  return {
    type: `@@all/household/update_has_debts`,
    value,
  };
}

export function updateResidenceType(value) {
  return {
    type: `@@all/household/update_residence_type`,
    value,
  };
}

const makeUpdateExisting = (user) => (property, value) => {
  return {
    type: `@@${user}/household/update_existing`,
    property,
    value,
  };
};
export const updateExistingPrimary = makeUpdateExisting('primary');
export const updateExistingSecondary = makeUpdateExisting('secondary');

const makeUpdateAddress = (user) => (payload, excludeProvince) => {
  return {
    type: `@@${user}/household/update_address`,
    payload,
    excludeProvince,
  };
};
export const updateAddressPrimary = makeUpdateAddress('primary');
export const updateAddressSecondary = makeUpdateAddress('secondary');

function getHouseholdContactPayload(state, userType = USER_TYPES.PRIMARY) {
  let payload = {};

  let firstName, lastName, email, phone, birthdate, gender, health, smoke,
    address_line1, address_line2, city, country, postal_code, province,
    user_family_composition;

  ({
    firstName, lastName, email, phone,
    birthdate, userGender: gender, health, smoke,
    address_line1, address_line2, city,
    country, postal_code, province,
    user_family_composition,
  } = state[userType].household);

  if (userType === USER_TYPES.SECONDARY && isPartnerSameAddress(state)) {
    // if sameAddress is true, we use primary's address info instead
    ({
      address_line1, address_line2, city,
      country, postal_code, province,
    } = state[USER_TYPES.PRIMARY].household);
  }

  // FORM-946: when a user begins to input their partners data, birthyear for example
  // and then backs out to an individual application there is a bug whereby we still
  // send their birthdate as 01/__/____ which causes an error. This portion of code
  // fixes that issue
  if (!validateDDMMYYYY(birthdate)) {
    birthdate = null;
  }

  payload = {
    first_name: toNameFormat(firstName),
    last_name: toNameFormat(lastName),
    email,
    phone,
    birthdate,
    gender,
    health_issues: health,
    retirement_age: null,
    use_tobacco: smoke,
    address_line1,
    address_line2,
    city,
    country,
    postal_code,
    province,
    user_family_composition,
  };

  return payload;
}

export function patchHouseholdByVal(userType, payload, key) {
  return async (dispatch, getState) => {
    let state = getState();
    let household_id;
    let household_id_vers;
    if (userType === USER_TYPES.DEPENDENT) {
      household_id = state.dependents.dependents[key].session.household_id;
      household_id_vers = state.dependents.dependents[key].session.household_id_vers;
    } else {
      household_id = state[userType].session.household_id;
      household_id_vers = state[userType].session.household_id_vers;
    }
    return patchHouseholdInfos(household_id, household_id_vers, payload);
  };
}

export function patchHouseholdContact(userType) {
  return async (dispatch, getState) => {
    let state = getState();

    const { household_id, household_id_vers } = state[userType].session;

    let payload = {
      user: getHouseholdContactPayload(state, userType),
      spouse: getHouseholdContactPayload(state, userType === USER_TYPES.PRIMARY ?
        USER_TYPES.SECONDARY : USER_TYPES.PRIMARY),
    };

    /*
    ST-2363 phone number empty override fix
    This check would insure that the existing phone number won't be
    overwritten on the db if it is blank (empty string)
    Should only patch if it contains a valid number
    */
    if (!hasValue(payload.user.phone)) {
      delete payload.user.phone; // removes key from the object
    }

    return withErrorModalOnFail(
      patchHouseholdInfos,
      dispatch,
    )(household_id, household_id_vers, payload);
  };
}

export const patchPhone = allUsers((userType = USER_TYPES.PRIMARY) => {
  return async (dispatch, getState) => {
    const state = getState();
    const {
      session: { household_id, household_id_vers },
      household: { phone },
    } = state[userType];

    if (phone === '') {
      return Promise.resolve();
    }

    const payload = {
      user: {
        phone,
      },
    };

    return patchHouseholdInfos(household_id, household_id_vers, payload);
  };
});

// this sends the entire household payload up
// use patchHouseholdByVal to avoid overwritting fields
export function putHouseholdInfoNeedsAssessmentFields(userType, key) {
  return async (dispatch, getState) => {
    const state = getState();
    let household_id;
    let payload;
    household_id = state[userType].session.household_id;
    payload = getHouseholdInfosPayload(state, userType, key);
    return withErrorModalOnFail(putHouseholdInfos, dispatch)(household_id, 0, payload);
  };
}

export const deleteNameFields = (obj) => {
  const newObj = { ...obj };
  if (newObj) {
    delete newObj.last_name;
    delete newObj.first_name;
  }
  return newObj;
};

export const skipFieldsWhenAccountExists = (state, userType, payload) => {
  return accountIdWrapper(skipFieldsWhenAccountExistsUserId, skipFieldsWhenAccountExistsAccountId, state, userType, payload);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link skipFieldsWhenAccountExistsAccountId} instead
 */
const skipFieldsWhenAccountExistsUserId = (state, userType, payload) => {
  const isPrimarySecondaryUserType = [USER_TYPES.PRIMARY, USER_TYPES.SECONDARY].includes(userType);
  const doesAccountExist = isPrimarySecondaryUserType && Boolean(state[userType].session.user_id);
  const newPayload = { ...payload };

  if (doesAccountExist && newPayload.family?.user) {
    newPayload.family.user = deleteNameFields(newPayload.family.user);
  }

  if (doesAccountExist && newPayload.user) {
    newPayload.user = deleteNameFields(newPayload.user);
  }
  return newPayload;
};

const skipFieldsWhenAccountExistsAccountId = (state, userType, payload) => {
  const isPrimarySecondaryUserType = [USER_TYPES.PRIMARY, USER_TYPES.SECONDARY].includes(userType);
  const doesAccountExist = isPrimarySecondaryUserType && Boolean(state[userType].session.account_id);
  const newPayload = { ...payload };

  if (doesAccountExist && newPayload.family?.user) {
    newPayload.family.user = deleteNameFields(newPayload.family.user);
  }

  if (doesAccountExist && newPayload.user) {
    newPayload.user = deleteNameFields(newPayload.user);
  }
  return newPayload;
};

export function patchHouseholdInfoNeedsAssessmentFields(userType, key) {
  return async (dispatch, getState) => {
    let payload;
    const state = getState();
    let household_id;
    let household_id_vers;
    household_id = state[userType].session.household_id;
    household_id_vers = state[userType].session.household_id_vers;
    if (!hasValue(household_id)) {
      return Promise.resolve();
    }
    payload = getHouseholdInfosPayload(state, userType, key);
    payload = skipFieldsWhenAccountExists(state, userType, payload);
    // eslint-disable-next-line max-len
    return withErrorModalOnFail(patchHouseholdInfos, dispatch)(household_id, household_id_vers, payload);
  };
}

export function patchUserEmail(userType) {
  return (dispatch, getState) => {
    let state = getState();

    if (state.metadata.backPressed) {
      return Promise.resolve();
    }

    return blockingRequest(patchEmail, dispatch)(state, userType);
  };
}

export function patchEmail(state, userType) {
  if (state[userType].household.email === '') {
    return Promise.resolve();
  }
  let first_name = toNameFormat(state[userType].household.firstName);
  let payload = {
    user: {
      email: state[userType].household.email,
      first_name,
    },
  };
  payload = skipFieldsWhenAccountExists(state, userType, payload);
  return patchHouseholdInfos(
    state[userType].session.household_id,
    state[userType].session.household_id_vers,
    payload,
  );
}

// No-op: Life-specific total debts calculation removed for HD-only flow
export function updateTotalDebts() {
  return (dispatch, getState) => {
    // No-op for HD-only flow
  };
}

export const patchExistingCoverage = (state, userType) => {
  // no coverage case and no existing
  if (state[userType].household.existingCoverage.user.group === ''
    && state[userType].household.existingCoverage.user.individual === '') {
    return Promise.resolve();
  }

  let payload = {
    existing: {
      user: {
        group: state[userType].household.existingCoverage.user.group,
        individual: state[userType].household.existingCoverage.user.individual,
      },
    },
  };

  return fetch(`${GLOBAL_MAIN_ENDPOINT}/household_infos/${state[userType].session.household_id}/${state[userType].session.household_id_vers}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(new Error(res.statusText));
      }
      return res;
    })
    .then(res => res.json());
};

function getHouseholdInfosPayload(state, userType) {
  let user = getUserPayload(state, userType);
  let spouse = getSpousePayload(state, userType);
  return {
    family: {
      children: state[userType].household.hasKids ? state[userType].household.kids.map(({ age }) => ({ birthdate: moment().add(-parseInt(age, 10), 'years').startOf('day').toISOString() })) : null,
      spouse,
      user,
    },
    finances: {
      shared: {
        assets: getSavingsPayload(state, userType),
        savings_tot_override: state[userType].household.assetsTotOverride,
        debts: getDebtsPayload(state, userType),
        debts_tot_override: state[userType].household.debtsTotOverride,
        expenses: {
          residence: state.expenses.exps_residence,
        },
      },
      spouse: {
        income: state[userType].household.hasPartner ? state[userType].household.partnerIncome : '',
        income_override: state[userType].household.partnerIncomeOverride,
      },
      user: {
        income: state[userType].household.userIncome,
        income_override: state[userType].household.userIncomeOverride,
      },
      overrides: {
        savings_tot_override: state[userType].household.assetsTotOverride,
        debts_tot_override: state[userType].household.debtsTotOverride,
        income_override: state[userType].household.userIncomeOverride,
        partner_income_override: state[userType].household.partnerIncomeOverride,
      },
    },
    can_self_insure_ci: state[userType].household.useSavingsForCI,
    coverage: {
      existing: getExistingCovPayload(state, userType),
    },
  };
}

function getUserPayload(state, userType, key) {
  let payload = {};

  const userSlice = getUserSlice(state, userType, key);

  let {
    firstName, lastName, email, phone, birthdate, userGender, health, smoke,
    address_line1, address_line2, city, country, postal_code, province,
    user_family_composition, healthcard_province,
  } = userSlice.household;

  payload = {
    first_name: toNameFormat(firstName),
    last_name: toNameFormat(lastName),
    email,
    phone,
    birthdate,
    gender: userGender,
    health_issues: health,
    retirement_age: null,
    use_tobacco: smoke,
    address_line1,
    address_line2,
    city,
    country,
    postal_code,
    province,
    healthcard_province,
    user_family_composition,
  };

  return payload;
}

function getSpousePayload(state, userType) {
  let payload = {};

  // check to see if the user has a spouse
  if (state[userType].household.hasPartner ||
    // TODO: NP2-2314 can we remove this start app condition?
    (hasValue(state.metadata.emailRefVers) &&
      state.metadata.emailRefVers === EMAIL_REF_VERSIONS.START_APP_JOINT_PRIMARY)) {
    let firstName, lastName, birthdate, userGender, smoke;
    ({
      firstName, lastName, birthdate, userGender, smoke,
    } = state[getOtherUserType(userType)].household);

    if (!hasValue(userGender)) {
      userGender = GENDERS.FEMALE; // always female for recommendation engine, no longer ask this
    }

    let age_date = null;
    if (state[userType].household.partnerAge) {
      age_date = moment().add(-state[userType].household.partnerAge, 'years').startOf('day').format('DD/MM/YYYY');
    }

    payload = {
      first_name: toNameFormat(firstName),
      last_name: toNameFormat(lastName),
      birthdate,
      age_date,
      gender: userGender,
      retirement_age: null,
      use_tobacco: smoke,
    };
  }

  return payload;
}

function getSavingsPayload(state, userType) {
  const isQuickQuote = state.metadata.fromQuoteCompare;

  return {
    non_retirement: state[userType].household.hasSavings ? state[userType].household.nonRetirementSavings : '',
    retirement: state[userType].household.hasSavings ? state[userType].household.retirementSavings :
      isQuickQuote ? state[userType].household.retirementSavings : '',
  };
}

function getDebtsPayload(state, userType) {
  const isQuickQuote = state.metadata.fromQuoteCompare;

  return {
    credit_cards: state[userType].household.hasDebts ? state[userType].household.creditCards : '',
    credit_line: state[userType].household.hasDebts ? state[userType].household.linesOfCredit : '',
    home_equity_loans: state[userType].household.hasDebts ? state[userType].household.homeEquityLoans : '',
    mortgage: state[userType].household.mortgage >= 0 ? state[userType].household.mortgage : '',
    other: state[userType].household.hasDebts && (state[userType].household.otherDebt > 0) ? [{ amount: state[userType].household.otherDebt, type: 'debt1' }] :
      isQuickQuote && (state[userType].household.otherDebt > 0) ? [{ amount: state[userType].household.otherDebt, type: 'totalDebts' }] : '',
    student_loans: state[userType].household.hasDebts ? state[userType].household.studentLoans : '',
  };
}

function getExistingCovPayload(state, userType) {
  return {
    user: {
      group: state[userType].household.hasExistingCoverage ? state[userType].household.existingCoverage.user.group : '',
      individual: state[userType].household.hasExistingCoverage ? state[userType].household.existingCoverage.user.individual : '',
    },
  };
}

export function verifyEmailAndNextQuestion(userType) {
  return async (dispatch, getState) => {
    try {
      await dispatch(verifyEmail(userType));
    } catch (error) {
      return Promise.reject(error);
    }
    await allUsers(handlePostAccountRecord)(true)(dispatch, getState);
    return dispatch(nextQuestion());
  };
}

function showEmailWarningModal(error_text, email) {
  return async (dispatch) => {
    dispatch(showConfirmationModal(
      <FormattedMessage id="emailVerification.invalidEmail.56q3o6" />,
      <FormattedMessage
        id="emailVerification.chooseAnotherEmail.jVIRaR"
        values={{ email, error_text }}
      />,
    ));
    return Promise.resolve({ success: false });
  };
}

export function changeSuggestedEmailAndNextAction(
  emailWasAccepted,
  nextAction,
  error_text,
  userType,
  showConfirmation = true,
) {
  return async (dispatch, getState) => {
    const { suggestedEmail } = getState().metadata;
    const shouldTrackEmailEvent = userType === USER_TYPES.PRIMARY;
    if (emailWasAccepted) {
      if (shouldTrackEmailEvent) {
        if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
          segmentTrackEvent('email_validation_attempt', { validation_outcome: 'accepted_suggested_email' });
        } else {
          segmentTrackEvent('Email - Accepted Suggested Email');
        }
      }
      dispatch(makeUpdateEmail(userType)(suggestedEmail));
      if (nextAction !== null) {
        dispatch(nextAction(showConfirmation));
      }
    } else {
      if (shouldTrackEmailEvent) {
        if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
          segmentTrackEvent('email_validation_attempt', { validation_outcome: 'rejected_suggested_email' });
        } else {
          segmentTrackEvent('Email - Rejected Suggested Email');
        }
      }
      if (getState().metadata.emailIsDeliverable) {
        if (nextAction !== null) {
          dispatch(nextAction(showConfirmation));
        }
      } else {
        dispatch(showEmailWarningModal(error_text, getState()[userType].household.email));
      }
    }

    dispatch(updateMetadata('suggestedEmail', null));
  };
}

export function changeSuggestedEmailAndNext(emailWasAccepted, userType) {
  return async (dispatch) => {
    dispatch(changeSuggestedEmailAndNextAction(
      emailWasAccepted,
      null,
      STANDARD_EMAIL_ERROR_TEXT,
      userType,
    ));
  };
}

export function validateContactMedium(userType, value) {
  return async (dispatch, getState) => {
    const state = getState();
    const mainProduct = getMainProduct(state, userType);
    const application_id = state[userType].session[`${mainProduct}_application_id`];
    const { eappValidateMedium, eappValidateShortCode } = state.metadata;
    const payload = {
      medium: eappValidateMedium,
      url_short: eappValidateShortCode,
      value,
    };
    const ret = await postValidateContact(
      application_id, payload,
    ).catch(err => {
      sentryError('Error validating contact medium', { extras: { applicationId: application_id } });
      return { invalid: true };
    });
    dispatch(updateMetadata('app_insurer_url', ret.app_insurer_url));
    dispatch(updateMetadata('numValidateAttemptsRemaining', ret.num_attempts_remaining));
    return ret;
  };
}

export const updateUserHousehold = (property, value, userType, key = null) => {
  return (dispatch, getState) => {
    if (userType === USER_TYPES.DEPENDENT) {
      return dispatch(updateDependentHousehold(key, property, value));
    }
    return dispatch(makeUpdateHouseholdProp(userType)(property, value));
  };
};

export const toggleLanguage = () => {
  return (dispatch, getState) => {
    const state = getState();
    const application_language = state.primary.household.application_language;
    const switchedToLanguage = application_language === LOCALE.FR_CA
      ? LOCALE.EN_CA : LOCALE.FR_CA;
    const languageText = getLocaleText(state.primary);
    jsCookie.set('lang', switchedToLanguage, { domain: getCookieDomain(), secure: true, sameSite: 'strict' });
    dispatch(updateHouseholdPropAll('application_language', languageText === 'FR' ? LOCALE.FR_CA : LOCALE.EN_CA));
    state.dependents.dependent_keys.forEach((depKey) => {
      dispatch(updateDependentHousehold(depKey, 'application_language', languageText === 'FR' ? LOCALE.FR_CA : LOCALE.EN_CA));
    });
    segmentTrackEvent(`Application language switched to ${switchedToLanguage}`);
  };
};
