import jsCookie from 'js-cookie';
import {
  RESTORE_QUOTES_COOKIE_KEYS, USER_FAMILY_COMPOSITION, USER_TYPES, TRACKING_COOKIES,
  COOKIE_EXPIRY_DAYS,
} from '../utils/const';
import { getCookieDomain } from '../utils/helpers';
import { hasDependents } from '../Selectors/userControl';
import { extractDependentInfo } from './dependents';

const cookieConfig = { expires: COOKIE_EXPIRY_DAYS, domain: getCookieDomain(), secure: true, sameSite: 'strict' };

// No-op: Life-specific cookie saving removed for HD-only flow
export function saveRecommendedQuotesCookies() {
  return (dispatch, getState) => {
    // No-op for HD-only flow
  };
}

// No-op: Life-specific cookie saving removed for HD-only flow
export function saveCoverageAndTermCookies() {
  return (dispatch, getState) => {
    // No-op for HD-only flow
  };
}

export function saveHouseholdCookies() {
  return (dispatch, getState) => {
    const state = getState();
    try {
      if (state.primary.household.healthcard_province !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.HEALTHCARD_PROVINCE,
          state.primary.household.healthcard_province,
          cookieConfig,
        );
      }
      if (state.secondary.household.healthcard_province !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_HEALTHCARD_PROVINCE,
          state.secondary.household.healthcard_province,
          cookieConfig,
        );
      }
      if (state.primary.household.province !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.PROVINCE,
          state.primary.household.province,
          cookieConfig,
        );
      }
      if (state.secondary.household.province !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_PROVINCE,
          state.secondary.household.province,
          cookieConfig,
        );
      }
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.DOB,
        state.primary.household.birthdate,
        cookieConfig,
      );
      if (state.secondary.household.birthdate !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_DOB,
          state.secondary.household.birthdate,
          cookieConfig,
        );
      }
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.GENDER,
        state.primary.household.userGender,
        cookieConfig,
      );
      if (state.secondary.household.userGender !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_GENDER,
          state.secondary.household.userGender,
          cookieConfig,
        );
      }
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.SMOKING_STATUS,
        state.primary.household.smoke,
        cookieConfig,
      );
      if (state.secondary.household.smoke !== '') {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_SMOKING_STATUS,
          state.secondary.household.smoke,
          cookieConfig,
        );
      }
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.DEPENDENT_FLAG,
        hasDependents(state),
        cookieConfig,
      );
      if (hasDependents(state)) {
        jsCookie.set(
          RESTORE_QUOTES_COOKIE_KEYS.DEPENDENTS_DETAILS,
          extractDependentInfo(state),
          cookieConfig,
        );
      }
    } catch (e) {
      // we expect this to fail if cookies are disabled, this is OK
    }
  };
}

export function saveUserFamilyCompositionCookies(family_composition) {
  return (dispatch, getState) => {
    try {
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.FAMILY_COMPOSITION,
        family_composition,
        cookieConfig,
      );
      let joint_toggle_flag =
        family_composition === USER_FAMILY_COMPOSITION.SELF_PARTNER ||
        family_composition === USER_FAMILY_COMPOSITION.SELF_PARTNER_KIDS;
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.JOINT_TOGGLE_FLAG,
        joint_toggle_flag,
        cookieConfig,
      );
    } catch (e) {
      // we expect this to fail if cookies are disabled, this is OK
    }
  };
}

export function saveJointQuoteToggleCookie(val) {
  return (dispatch, getState) => {
    try {
      jsCookie.set(
        RESTORE_QUOTES_COOKIE_KEYS.JOINT_TOGGLE_FLAG,
        val,
        cookieConfig,
      );
    } catch (e) {
      // we expect this to fail if cookies are disabled, this is OK
    }
  };
}

export const saveTrackingCookie = (value) => {
  return () => {
    try {
      jsCookie.set(
        TRACKING_COOKIES.PM_ACCEPTED_COOKIES,
        value,
        cookieConfig,
      );
    } catch (e) {
      // we expect this to fail if cookies are disabled, this is OK
    }
  };
};
