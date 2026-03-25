// NOTE: changing the order of these imports like using "Organize imports" command
// causes files that import lifeSessions.js to throw an error, im not sure why,
// ive spend too long trying to figure it out
import queryString from 'query-string';

import jsCookie from 'js-cookie';
import {
  getTenant,
  THEMES,
  LOCALE,
  sentryError,
  sentryWarning,
  sentryInfo,
  calcAge,
  getBrowserLocale,
  accountIdWrapper,
} from '@policyme/global-libjs-utils';
import { Store } from 'redux';
import {
  ROUTES, EMAIL_REF_VERSIONS, DOCUSIGN_SOURCE_TYPE, QUOTE_TYPES,
  ROUTE_REGEX, INSURERS, RESTORE_QUOTES_COOKIE_KEYS,
  USER_TYPES, PM_PRODUCT_PREFIX, DOCUSIGN_CALLBACK_TYPE,
  COOKIE_EXPIRY_DAYS,
  ProductType,
  ProductTypeFull,
} from '../utils/const';
import { PM_ENABLE_THEMES } from '../config';

import {
  validateDDMMYYYY,
  validateDependentAge,
  validateGender,
  validateTerm,
  isEmail,
  isValidUUID,
  shorthandToGender,
  hasValue,
  stripTrailingSlash,
  removeComma,
  parseBool,
  getRouteWithUserType,
  isDebugEnv,
  getRouteWithProductType,
  getCookieDomain,
  productTypeToProductPrefix,
  productPrefixToProductType,
  makeUpdateCustomCoverage,
  makeUpdateTerm,
} from '../utils/helpers';

import {
  updateSessionHouseholdPropPrimary,
  updateSessionPropPrimary,
  makeUpdateSessionProp,
  updateUserSessionCovAndTermDefaultsAndFetchQuotes,
  updateAppId,
  checkLoginStatus,
} from '../NewActions/session';
import { updateMetadata, updateUtm } from '../NewActions/metadata';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary, updateHouseholdPropAll, updateEmailPrimary } from '../NewActions/household';
import { preDecisionRequoteActual, addQuotesDiscount } from '../NewActions/quotes';
import {
  setUtmFields,
  getUtmIds,
  utmFirstVisitedUrl,
  utmReferringDomain,
} from '../utils/utm';
import { DISCOUNT_CODES } from '../utils/discounts';
import { canRequote } from '../Selectors/quotes';
import { updateHasPartnerApplication, updateUserControlProp } from '../NewActions/userControl';
import { updateAllUserSessionPropAllProducts, updateAllUserSessionProp } from '../NewActions/helpers/productSession';
import { makeUpdateProductAppProp, setAppBuyingMethodAndProductAdded } from '../NewActions/helpers/productApp';
import { handleAffiliateInfo, handleDiscountsForCAAAllUsers, handleMortgageAppParams, handleDiscountsForCAA } from '../NewActions/handle';
import { getAffiliateName, isMortgageBroker, isJoint, hasDependents } from '../Selectors/userControl';
import { getDependentKeys } from '../Selectors/dependents';
import { makeUpdateHDAppProperty } from '../NewActions/hdApp';
import { addDependent, updateDependentHousehold, updateDepStateFromCookie } from '../NewActions/dependents';
import { getHealthcardProvince } from '../Selectors/household';
import { isCAAEnvironment } from '../tenant/helpers';
import { getRoutePageOptions } from '../config/pageOptionsConfig';
import { getABTestBand } from '../Selectors/metadata';
import { getMainProduct, getProductFromCurrRoute } from '../Selectors/helpers/productApp';
import { State } from './types/State';
import { handleValidatePurchaseJourneyParams, handleValidatePurchaseJourneyParameters } from '../NewActions/auth0';
import { updateIsLoading } from '../NewActions/helpersMetadata';
import { AgeValidator } from '../utils/ageValidator';
import appPropValidator from '../utils/appPropValidator';

//
// NOTE: this function is a bit misleading in that
// it probably doesn't belong under store since
// the vars are being stored in localStorage
//
function handleUtmParams(params, dispatch, debugFlag, state) {
  if (process.env.BROWSER) {
    const trackingCookieConfig = {
      expires: COOKIE_EXPIRY_DAYS,
      domain: getCookieDomain(),
      secure: true,
      sameSite: 'strict' as const,
    };
    if (!jsCookie.get(utmFirstVisitedUrl) && state?.router?.location?.pathname) {
      jsCookie.set(utmFirstVisitedUrl, state.router.location.pathname, trackingCookieConfig);
    }
    if (jsCookie.get(utmReferringDomain) === undefined) {
      const initialReferrer = typeof document !== 'undefined' ? document.referrer || '' : '';
      jsCookie.set(utmReferringDomain, initialReferrer, trackingCookieConfig);
    }
  }

  let utmSource = 'direct'; // DEFAULT
  let utmMedium;
  let utmCampaign;
  let utmTerm;
  let utmContent;
  let utmExtras;
  let utmGlobalId;
  let utmTrackingId;

  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let valNum = parseInt(val, 10);
    if (debugFlag && key.match(/ab_test_\d+/)) {
      jsCookie.set(key, val, { secure: true, sameSite: 'strict' });
    }
    // Avoid arrays in utm params, take the first
    if (Array.isArray(val)) {
      [val] = val;
    }
    switch (key) {
      case 'utm_source':
        utmSource = val;
        break;
      case 'utm_medium':
        utmMedium = val;
        break;
      case 'utm_campaign':
        utmCampaign = val;
        break;
      case 'utm_term':
      case 'grsf':
        utmTerm = val;
        break;
      case 'utm_content':
        utmContent = val;
        break;
      case 'transaction_id':
        utmExtras = {
          ...utmExtras,
          transaction_id: val,
        };
        break;
      case 'affiliate_id':
        utmExtras = {
          ...utmExtras,
          affiliate_id: val,
        };
        break;
      case 'sid':
        utmExtras = {
          ...utmExtras,
          sid: Number.isNaN(valNum) ? -1 : valNum,
        };
        break;
      case 'utm_global_id':
        utmGlobalId = val;
        break;
      case 'utm_tracking_id':
        utmTrackingId = val;
        break;
      case 'fbclid':
        utmExtras = {
          ...utmExtras,
          fbclid: val,
        };
        break;
      case 'gclid':
        utmExtras = {
          ...utmExtras,
          gclid: val,
        };
        break;
      case 'clickid':
        utmExtras = {
          ...utmExtras,
          clickid: val,
        };
        break;
      case 'irclickid':
        utmExtras = {
          ...utmExtras,
          irclickid: val,
        };
        break;
      default:
        break;
    }
  });

  if (Object.keys(params).indexOf('grsf') !== -1) {
    utmSource = 'growsurf'; // to handle growsurf referrals http://policyme.com/?grsf=xxx on backend
  }

  utmExtras = {
    ...utmExtras,
  };

  try {
    // update UTM fields
    let fieldChanged;
    if (process.env.BROWSER) {
      fieldChanged = setUtmFields(
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
        utmExtras,
        dispatch,
        state,
      );
    }
    dispatch(updateUtm({
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      utm_extras: utmExtras,
      utm_global_id: utmGlobalId,
      utm_tracking_id: fieldChanged === true ? undefined : utmTrackingId,
    }));
  } catch (err) {
    if (process.env.browser) {
      sentryWarning(err);
    }
  }
}

function handleAvailableProducts() {
  // HD-only webapp: only HD is available
  const availableProducts = [PM_PRODUCT_PREFIX.HD];
  return (dispatch, getState) => {
    dispatch(updateUserControlProp('availableProducts', availableProducts));
  };
}

function handleAvailableProductsHD() {
  const availableProducts = [PM_PRODUCT_PREFIX.HD];
  return (dispatch, getState) => {
    dispatch(updateUserControlProp('availableProducts', availableProducts));
  };
}

function handleDebugParams(params, dispatch, state) {
  // adding additional protection
  if (isDebugEnv) {
    let debugFlag = false;
    let disableABTestFlag = false;
    let enableHDFlag = null;
    let isPolicyMe = false;
    Object.entries(params).forEach(([key, value]) => {
      switch (key) {
        case 'debug':
          debugFlag = (value === '1');
          break;
        case 'ab_test_disable':
          disableABTestFlag = (value === '1');
          break;
        case 'enableHD':
          enableHDFlag = (value === '1');
          break;
        default:
          break;
      }
    });

    // HD-only webapp: available products always HD
    let availableProducts: Array<ProductType> = [PM_PRODUCT_PREFIX.HD];

    try {
      if (debugFlag) {
        dispatch(updateMetadata('debugFlag', debugFlag));
      }
      if (disableABTestFlag && debugFlag) {
        dispatch(updateMetadata('disableABTestFlag', disableABTestFlag));
      }
      if (debugFlag) {
        dispatch(updateUserControlProp('availableProducts', availableProducts));
      }
    } catch (err) {
      if (process.env.browser) {
        sentryWarning(err);
      }
    }
  }
}

function handleQuotesReturnedParams(store, params) {
  // Life app properties removed for HD-only webapp
  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    switch (key) {
      case 'hh_info_id':
        store.dispatch(updateSessionHouseholdPropPrimary({
          hh_info_id: val,
          hh_info_id_vers: 0,
        }));
        break;
      case 'quote_num':
        store.dispatch(updateMetadata('smq_quote_num', val));
        break;
      default:
        break;
    }
  });
}

// Helper function to handle query params for H&D dependents.
// Returns the updated idxToDependentKeys object, the new value, and the new date string.
function handleDependentsQueryParams(store, idxToDependentKeys, key, val, dateStr) {
  // Copy variables to avoid mutation
  let newIdxToDependentKeys = { ...idxToDependentKeys };
  let newVal = val;
  let newDateStr = dateStr;

  if (matchDependentQueryParams(key)) {
    const underscoreIndex = key.indexOf('_');
    if (underscoreIndex !== -1) {
      const idx = key.substring(1, underscoreIndex);
      const property = key.substring(underscoreIndex + 1);
      let dependent_key;
      if (idx in idxToDependentKeys) {
        dependent_key = idxToDependentKeys[idx];
      } else {
        store.dispatch(addDependent());
        let dependent_keys = getDependentKeys(store.getState());
        dependent_key = dependent_keys[dependent_keys.length - 1];
        newIdxToDependentKeys[idx] = dependent_key;
      }
      switch (property) {
        case 'birthdate':
          newVal = val.replace(/\//g, '');
          newDateStr = `${newVal.substring(0, 2)}/${newVal.substring(2, 4)}/${newVal.substring(4, 8)}`;
          if (validateDDMMYYYY(newDateStr) && validateDependentAge(newDateStr)) {
            store.dispatch(updateDependentHousehold(dependent_key, property, newDateStr));
          }
          break;
        case 'gender':
          if (validateGender(val)) {
            store.dispatch(updateDependentHousehold(dependent_key, 'userGender', shorthandToGender(newVal)));
          }
          break;
        default:
          break;
      }
    }
  }
  return [newIdxToDependentKeys, newVal, newDateStr];
}

function handleDependentProvince(store, idxToDependentKeys) {
  // if we have dependents, use primary user's province as its own province
  if (Object.keys(idxToDependentKeys).length > 0) {
    const primaryProvince = getHealthcardProvince(USER_TYPES.PRIMARY)(store.getState());
    Object.values(idxToDependentKeys).forEach(dependentKey => {
      if (primaryProvince) {
        store.dispatch(updateDependentHousehold(dependentKey, 'healthcard_province', primaryProvince));
      }
    });
  }
}

function handleFamilyDiscount(store, product) {
  // Add the family discount for H&D apps with a partner or dependents
  const addFamilyDiscount = isJoint(store.getState()) || hasDependents(store.getState());

  let discountCode;

  if (isCAAEnvironment()) {
    discountCode = DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT;
  }

  if (!discountCode) {
    return;
  }

  if (product === PM_PRODUCT_PREFIX.HD && addFamilyDiscount) {
    store.dispatch(addQuotesDiscount(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)(
      discountCode,
    ));

    if (isJoint(store.getState())) {
      store.dispatch(addQuotesDiscount(USER_TYPES.SECONDARY, PM_PRODUCT_PREFIX.HD)(
        discountCode,
      ));
    }

    if (hasDependents(store.getState())) {
      store.dispatch(addQuotesDiscount(USER_TYPES.DEPENDENT, PM_PRODUCT_PREFIX.HD)(
        discountCode,
      ));
    }
  }
}

export function handleQuotesParams(store, params, product) {
  let email;
  let covAmt;
  let recmdAmt;
  let term;
  let isSmoker;
  let isRecmdLink = false;
  let state;
  let hasCaaDiscount;
  let hasPartner = parseBool(params?.partner);

  let primaryAge;
  let secondaryAge;

  let idxToDependentKeys = {};
  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let dateStr;

    [idxToDependentKeys, val, dateStr] = handleDependentsQueryParams(
      store,
      idxToDependentKeys,
      key,
      val,
      dateStr,
    );

    const ageValidator = new AgeValidator(product);

    switch (key) {
      case 'email_ref_v0': // link back to recommendation
        isRecmdLink = true;
        break;
      case 'birthdate':
        val = decodeURIComponent(val).replace(/\//g, '');
        dateStr = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
        if (validateDDMMYYYY(dateStr) && ageValidator.validateAge(dateStr)) {
          store.dispatch(updateHouseholdPropPrimary(key, dateStr));
          primaryAge = calcAge(dateStr);
        }
        break;
      case 'partner_birthdate':
        if (!hasPartner) {
          break;
        }
        val = decodeURIComponent(val).replace(/\//g, '');
        dateStr = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
        if (validateDDMMYYYY(dateStr) && ageValidator.validateAge(dateStr)) {
          store.dispatch(updateHouseholdPropSecondary('birthdate', dateStr));
          secondaryAge = calcAge(dateStr);
        }
        break;
      case 'external_advisor_id':
        store.dispatch(updateHouseholdPropPrimary('external_advisor_id', val));
        break;
      case 'gender':
        if (validateGender(val)) {
          store.dispatch(updateHouseholdPropPrimary('userGender', shorthandToGender(val)));
        }
        break;
      case 'partner_gender':
        if (hasPartner && validateGender(val)) {
          store.dispatch(updateHouseholdPropSecondary('userGender', shorthandToGender(val)));
        }
        break;
      case 'smoker':
        // set to true if val === 't', otherwise assume false
        isSmoker = parseBool(val);
        store.dispatch(updateHouseholdPropPrimary('smoke', isSmoker));
        break;
      case 'partner_smoker':
        if (!hasPartner) {
          break;
        }
        // set to true if val === 't', otherwise assume false
        isSmoker = parseBool(val);
        store.dispatch(updateHouseholdPropSecondary('smoke', isSmoker));
        break;
      case 'cov_amt': {
        // HD-only: coverage amount handling simplified (no Life/CI min/max logic)
        recmdAmt = removeComma(val);
        covAmt = recmdAmt;
        store.dispatch(makeUpdateCustomCoverage(product)(covAmt));
        break;
      }
      case 'term':
        if (validateTerm(val)) {
          term = parseInt(val, 10);
          store.dispatch(makeUpdateTerm(product)(term));
        }
        break;
      case 'buying_method':
        store.dispatch(setAppBuyingMethodAndProductAdded(product, val));
        break;
      case 'household_id':
      case 'household_id_vers':
        store.dispatch(updateSessionPropPrimary(key, val));
        break;
      case 'province':
        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(updateHouseholdPropPrimary('healthcard_province', val));
        } else {
          store.dispatch(updateHouseholdPropPrimary('province', val));
        }
        break;
      case 'partner_province':
        if (!hasPartner) {
          break;
        }

        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(updateHouseholdPropSecondary('healthcard_province', val));
        } else {
          store.dispatch(updateHouseholdPropSecondary('province', val));
        }
        break;
      case 'partner':
        hasPartner = parseBool(val);
        store.dispatch(updateHasPartnerApplication(hasPartner));
        break;
      case 'advisor_id':
        store.dispatch(updateHouseholdPropPrimary('advisor_id', val));
        break;
      case 'plan_type':
        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(updateMetadata('planTypeStartApp', val));
        }
        break;
      case 'underwriting_method':
        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(makeUpdateHDAppProperty(USER_TYPES.PRIMARY)(key, val));
          store.dispatch(makeUpdateHDAppProperty(USER_TYPES.SECONDARY)(key, val));
          store.dispatch(makeUpdateHDAppProperty(USER_TYPES.DEPENDENT)(key, val));
        }
        break;
      case 'insurance_ownership_type':
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.PRIMARY)(key, val));
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.SECONDARY)(key, val));
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.DEPENDENT)(key, val));
        break;
      case 'quote_source':
        store.dispatch(updateHouseholdPropPrimary('quote_source', val));
        break;
      default:
        break;
    }
  });

  handleDependentProvince(store, idxToDependentKeys);

  Object.keys(params).forEach((key, index) => {
    let val = params[key];

    // INFO: We need to wait for the family state to be processed by the
    // logic above before handling the caa discount
    switch (key) {
      case 'caa_discount':
        hasCaaDiscount = parseBool(val);
        // Handle the secondary user discounts synchronously
        if (hasPartner) {
          store.dispatch(handleDiscountsForCAA(USER_TYPES.SECONDARY, null, hasCaaDiscount));
        }
        store.dispatch(handleDiscountsForCAAAllUsers(hasCaaDiscount));
        break;
      default:
        break;
    }
  });

  handleFamilyDiscount(store, product);

  // NOTE: requires email_ref_v0 to be in the query params, used this
  // in case we want to invalidate these links at some point in the future
  if (isRecmdLink) {
    state = store.getState();

    // validate that these fields have been parsed correctly
    if (hasValue(state.primary.household.birthdate) &&
      hasValue(state.primary.household.userGender) &&
      hasValue(state.primary.household.smoke) &&
      // HD-only: no coverage amount check needed
      product === PM_PRODUCT_PREFIX.HD) {
      // as None. Causes problems like rewriting info from url params with cookie data.
      // Will be solved with st-1427
      store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.RECOMMENDATION_LINK));
    } else {
      sentryError(
        'could not properly parse query params', {
          extras: { params },
          tags: { rootCause: 'quotes_url' },
        },
      );
      console.log('ERROR: could not properly parse query params');
    }
  }

  // HD-only: Life session term selection removed

  return true;
}

function hasApplicationFields(state, includeEmail = true) {
  let emailCheck = true;
  if (includeEmail) {
    emailCheck = hasValue(state.primary.household.email);
  }

  // HD-only: simplified to check basic household fields only
  return emailCheck &&
    hasValue(state.primary.household.birthdate) &&
    hasValue(state.primary.household.userGender) &&
    hasValue(state.primary.household.smoke);
}

function hasNewProductApplicationFields(state, includeEmail = true) {
  let emailCheck = true;
  if (includeEmail) {
    emailCheck = hasValue(state.primary.household.email);
  }
  // HD-only: simplified to check basic household fields only
  return emailCheck &&
    hasValue(state.primary.household.birthdate) &&
    hasValue(state.primary.household.userGender) &&
    hasValue(state.primary.household.smoke);
}

function hasPartnerFields(state) {
  return hasValue(state.secondary.household.birthdate) &&
    hasValue(state.secondary.household.userGender) &&
    hasValue(state.secondary.household.smoke);
}

function matchDependentQueryParams(key) {
  return /^d\d+/.test(key);
}

function startAppUrlGeneratedFromExistingApp(params) {
  return accountIdWrapper(startAppUrlGeneratedFromExistingAppUserId, startAppUrlGeneratedFromExistingAppAccountId, params);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link startAppUrlGeneratedFromExistingAppAccountId} instead
 */
function startAppUrlGeneratedFromExistingAppUserId(params) {
  return !!params.email && !!params.application_id &&
    !!params.session_id && !!params.household_id && !!params.user_id;
}

function startAppUrlGeneratedFromExistingAppAccountId(params) {
  return !!params.email && !!params.application_id &&
    !!params.session_id && !!params.household_id && !!params.account_id;
}

export function handleStartAppParams(store, params, product) {
  let email;
  let covAmt;
  let recmdAmt;
  let overrideAmt;
  let term;
  let isSmoker;
  let isStartAppIndividual = false;
  let isStartAppJointPri = false;
  let isStartAppJointSec = false;
  let shouldGetQuotes = false;
  let isShadowAccountStartApp = false;
  let isHDStartApp = false; // make usage of this if needed
  let isPolicyMe = false;
  let company;
  let isNewProductStartAppIndividual = false;
  let isNewProductStartAppJointPri = false;
  let isNewProductStartAppJointSec = false;
  let plan_type = false;
  let hasCaaDiscount = false;
  let allowNoAppIdStartapp = false;

  if (params.company === INSURERS.PM) {
    isPolicyMe = true;
  }

  const ageValidator = new AgeValidator(product);

  // API returns 'None' for empty values, so we need to clean them up so the redux state is not polluted with these values
  params = Object.entries(params).reduce((paramsObject, [key, val]) => {
    if (val && String(val).trim().toLowerCase() !== 'none') {
      paramsObject[key] = val;
    }
    return paramsObject;
  }, {});

  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let dateStr;
    switch (key) {
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_INDIVIDUAL_V2}`: // link back to start-app
        isStartAppIndividual = true;
        isNewProductStartAppIndividual = true;
        shouldGetQuotes = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_INDIVIDUAL}`:
        if (!isPolicyMe) {
          sentryError(
            'user used the startapp from the broker model', {
              extras: { params },
              tags: { rootCause: 'start_app_url' },
            },
          );
          console.log('ERROR: user used the startapp from the broker model');
        }
        isStartAppIndividual = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_JOINT_PRIMARY}`:
        isStartAppJointPri = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_JOINT_SECONDARY}`:
        isStartAppJointSec = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.POLICYME_PRODUCT_SINGLE_APP}`:
      case `email_ref_v${EMAIL_REF_VERSIONS.JOINT_V2_INDIVIDUAL}`:
      case `email_ref_v${EMAIL_REF_VERSIONS.JOURNEY_3_INDIVIDUAL}`:
        shouldGetQuotes = true;
        isNewProductStartAppIndividual = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.POLICYME_PRODUCT_START_APP_JOINT_PRIMARY}`:
      case `email_ref_v${EMAIL_REF_VERSIONS.JOINT_V2_PRIMARY_SECONDARY}`:
      case `email_ref_v${EMAIL_REF_VERSIONS.JOURNEY_3_JOINT}`:
        shouldGetQuotes = true;
        isNewProductStartAppJointPri = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.POLICYME_PRODUCT_START_APP_JOINT_SECONDARY}`:
        shouldGetQuotes = true;
        isNewProductStartAppJointSec = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_SHADOW_ACCOUNT_JOINT}`:
        isNewProductStartAppJointPri = true;
        shouldGetQuotes = true;
        isStartAppJointPri = true;
        isShadowAccountStartApp = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_SHADOW_ACCOUNT_INDIVIDUAL}`:
        shouldGetQuotes = true;
        isShadowAccountStartApp = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.ADD_INSURANCE_OWNERSHIP_TYPE_JOINT}`:
        isNewProductStartAppJointPri = true;
        shouldGetQuotes = true;
        isStartAppJointPri = true;
        // allow no app_id or email to fill in account info
        if (startAppUrlGeneratedFromExistingApp(params)) {
          isShadowAccountStartApp = true;
        } else {
          allowNoAppIdStartapp = true;
        }
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.ADD_INSURANCE_OWNERSHIP_TYPE_INDIVIDUAL}`:
        shouldGetQuotes = true;
        // allow no app_id or email to fill in account info
        if (startAppUrlGeneratedFromExistingApp(params)) {
          isShadowAccountStartApp = true;
        } else {
          allowNoAppIdStartapp = true;
        }
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_HD_INDIVIDUAL}`:
        // add action after definition
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.START_APP_HD_JOINT}`:
        // add action after definition
        isStartAppJointPri = true;
        break;
      default:
        break;
    }
  });

  // need to set this ahead of time so that the custom quote knows which type to save
  if (isStartAppJointPri || isNewProductStartAppJointPri) {
    store.dispatch(updateAllUserSessionPropAllProducts('selected_quote_type', QUOTE_TYPES.JOINT));
    // support joint app flow
    store.dispatch(updateHasPartnerApplication(true));
  } else if (isStartAppJointSec || isNewProductStartAppJointSec) {
    store.dispatch(updateAllUserSessionPropAllProducts('selected_quote_type', QUOTE_TYPES.PRIMARY));
  }

  if (isShadowAccountStartApp) {
    store.dispatch(updateMetadata('isShadowAccountStartApp', true));
  }

  if (allowNoAppIdStartapp) {
    store.dispatch(updateMetadata('allowNoAppIdStartapp', true));
  }

  let idxToDependentKeys = {};
  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let dateStr;
    let availableProducts;
    let ageNearestPrimary;

    [idxToDependentKeys, val, dateStr] = handleDependentsQueryParams(
      store,
      idxToDependentKeys,
      key,
      val,
      dateStr,
    );

    switch (key) {
      case 'birthdate':
        val = val.replace(/\//g, '');
        dateStr = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
        if (validateDDMMYYYY(dateStr) && ageValidator.validateAge(dateStr)) {
          store.dispatch(updateHouseholdPropPrimary(key, dateStr));
        }
        break;
      case 'gender':
        if (validateGender(val)) {
          store.dispatch(updateHouseholdPropPrimary('userGender', shorthandToGender(val)));
        }
        break;
      case 'smoker':
        // set to true if val === 't', otherwise assume false
        isSmoker = parseBool(val);
        store.dispatch(updateHouseholdPropPrimary('smoke', isSmoker));
        break;
      case 'first_name':
        store.dispatch(updateHouseholdPropPrimary('firstName', val));
        break;
      case 'last_name':
        store.dispatch(updateHouseholdPropPrimary('lastName', val));
        break;
      case 'email':
        store.dispatch(updateHouseholdPropPrimary('email', decodeURIComponent(val).replace(/ /g, '+')));
        break;
      case 'p_birthdate':
        dateStr = `${val.substring(0, 2)}/${val.substring(2, 4)}/${val.substring(4, 8)}`;
        if (validateDDMMYYYY(dateStr) && ageValidator.validateAge(dateStr)) {
          store.dispatch(updateHouseholdPropSecondary('birthdate', dateStr));
        }
        break;
      case 'p_gender':
        if (validateGender(val)) {
          store.dispatch(updateHouseholdPropSecondary('userGender', shorthandToGender(val)));
        }
        break;
      case 'p_smoker':
        // set to true if val === 't', otherwise assume false
        isSmoker = parseBool(val);
        store.dispatch(updateHouseholdPropSecondary('smoke', isSmoker));
        break;
      case 'p_first_name':
        store.dispatch(updateHouseholdPropSecondary('firstName', val));
        break;
      case 'p_last_name':
        store.dispatch(updateHouseholdPropSecondary('lastName', val));
        break;
      case 'p_email':
        store.dispatch(updateHouseholdPropSecondary('email', decodeURIComponent(val)));
        break;
      case 'p_province':
        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(updateHouseholdPropSecondary('healthcard_province', val));
        } else {
          store.dispatch(updateHouseholdPropSecondary('province', val));
        }
        break;
      case 'amt':
        overrideAmt = parseInt(val, 10);
        store.dispatch(makeUpdateCustomCoverage(product)(overrideAmt));
        break;
      case 'term':
        if (validateTerm(val)) {
          term = parseInt(val, 10);
          store.dispatch(updateAllUserSessionPropAllProducts('selected_term', term));
        }
        break;
      case 'company':
        // HD-only: Life company selection removed
        company = val;
        break;
      case 'quote_source':
        store.dispatch(updateHouseholdPropPrimary('quote_source', val));
        break;
      case 'user_id':
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(key, val));
        break;
      case 'account_id':
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(key, val));
        break;
      case 'household_id':
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(key, val));
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)('household_id_vers', 0));
        break;
      case 'app_id':
      case 'application_id':
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(`${product}_application_id`, val));
        break;
      case 'session_id':
        store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(`${product}_session_id`, val));
        break;
      case 'plan_type':
        store.dispatch(updateMetadata('planTypeStartApp', val));
        break;
      case 'underwriting_method':
        if (product === PM_PRODUCT_PREFIX.HD) {
          if (appPropValidator[key](val).isValid) {
            store.dispatch(makeUpdateHDAppProperty(USER_TYPES.PRIMARY)(key, val));
            store.dispatch(makeUpdateHDAppProperty(USER_TYPES.SECONDARY)(key, val));
            store.dispatch(makeUpdateHDAppProperty(USER_TYPES.DEPENDENT)(key, val));
          }
        }
        break;
      case 'insurance_ownership_type':
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.PRIMARY)(key, val));
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.SECONDARY)(key, val));
        store.dispatch(makeUpdateProductAppProp(product, USER_TYPES.DEPENDENT)(key, val));
        break;
      case 'province':
        if (product === PM_PRODUCT_PREFIX.HD) {
          store.dispatch(updateHouseholdPropPrimary('healthcard_province', val));
        } else {
          store.dispatch(updateHouseholdPropPrimary('province', val));
        }
        break;
      case 'advisor_id':
        store.dispatch(updateHouseholdPropPrimary('advisor_id', val));
        break;
      default:
        break;
    }
  });

  handleDependentProvince(store, idxToDependentKeys);

  // if we have dependents, use primary user's province as its own province
  if (Object.keys(idxToDependentKeys).length > 0) {
    const primaryProvince = getHealthcardProvince(USER_TYPES.PRIMARY)(store.getState());
    Object.values(idxToDependentKeys).forEach(dependentKey => {
      if (primaryProvince) {
        store.dispatch(updateDependentHousehold(dependentKey, 'healthcard_province', primaryProvince));
      }
    });
  }

  Object.keys(params).forEach((key, index) => {
    let val = params[key];

    // INFO: We need to wait for the family state to be processed by the
    // logic above before handling the caa discount
    switch (key) {
      case 'caa_discount':
        hasCaaDiscount = parseBool(val);
        // Handle the secondary user discounts synchronously
        if (isStartAppJointPri) {
          store.dispatch(handleDiscountsForCAA(USER_TYPES.SECONDARY, null, hasCaaDiscount));
        }
        store.dispatch(handleDiscountsForCAAAllUsers(hasCaaDiscount));
        break;
      default:
        break;
    }
  });

  handleFamilyDiscount(store, product);

  // NOTE: requires email_ref_v4 to be in the query params, used this
  // in case we want to invalidate these links at some point in the future
  if (isStartAppIndividual || isNewProductStartAppIndividual ||
    isStartAppJointSec || isNewProductStartAppJointSec) {
    let state = store.getState();

    // ideally this would be removed, since it is a misnomer (we start form start app)
    store.dispatch(updateMetadata('fromQuoteCompare', true));
    // validate that these fields have been parsed correctly
    if (hasApplicationFields(state, false)) {
      // Ignoring this from ts check because this is legacy code not used anywhere
      // Needs to be verified by product team if we can remove this
      // @ts-ignore
      store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.START_APP_LINK));
    } else if (isNewProductStartAppIndividual && hasNewProductApplicationFields(state, false)) {
      store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.POLICYME_PRODUCT_SINGLE_APP));
    } else {
      sentryError(
        'could not properly parse query params', {
          extras: { params },
          tags: { rootCause: 'start_app_url' },
        },
      );
      console.log('ERROR: could not properly parse query params');
    }
  }

  if (isStartAppJointPri || isNewProductStartAppJointPri) {
    let state = store.getState();
    if (hasApplicationFields(state) && hasPartnerFields(state)) {
      store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.START_APP_JOINT_PRIMARY));
    } else if (isNewProductStartAppJointPri &&
      hasNewProductApplicationFields(state, false) &&
      hasPartnerFields(state)
    ) {
      store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.JOINT_V2_PRIMARY_SECONDARY));
    } else {
      sentryError(
        'could not properly parse query params', {
          extras: { params },
          tags: { rootCause: 'start_app_url' },
        },
      );
      console.log('ERROR: could not properly parse query params');
    }
  }

  if (canRequote(store.getState(), USER_TYPES.PRIMARY)) {
    const products = store.getState().userControl.availableProducts;
    products.forEach(async (p) => {
      store.dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, p));
    });
  } else {
    sentryWarning(
      'Expected to be able to get quotes after parsing start app params, but could not',
    );
  }

  return true;
}

function handleDocusignCallbackParams(store, params) {
  let source;
  const app_id = jsCookie.get('app_id');

  if (app_id) {
    store.dispatch(updateAppId(app_id, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
  }

  // defaults to primary quote if it wasn't specified
  const quoteType = parseInt(params.selected_quote_type || QUOTE_TYPES.PRIMARY, 10);
  Object.keys(params).forEach((key, index) => {
    switch (key) {
      case `event`:
        store.dispatch(updateMetadata('docusignEvent', params[key]));
        break;
      case `source`:
        source = parseInt(params[key], 10);
        store.dispatch(updateMetadata(
          'docusignSource',
          Number.isNaN(source) ? DOCUSIGN_SOURCE_TYPE.LIFE_WEBAPP_MAIN : source,
        ));
        break;
      case 'product_type':
        store.dispatch(updateMetadata('productDocusign', params[key]));
        break;

      default:
        break;
    }
  });
}

function handleDocusignGetLinkParams(store, params) {
  let source;
  Object.keys(params).forEach((key, index) => {
    switch (key) {
      case `source`:
        source = parseInt(params[key], 10);
        store.dispatch(updateMetadata(
          'docusignSource',
          Number.isNaN(source) ? DOCUSIGN_SOURCE_TYPE.LIFE_WEBAPP_MAIN : source,
        ));
        break;

      default:
        break;
    }
  });
}

function handleSkipMagicLinkCallbackParams(store, params) {
  let code = params.token;
  // only one of policy id and app_id should present
  let app_id = params.app_id || jsCookie.get('app_id');
  let close_policy = params.close_policy;

  if (close_policy) {
    store.dispatch(updateMetadata('closePolicyFlag', true));
  }
  if ((code) && app_id) {
    store.dispatch(updateSessionPropPrimary('twilio_token', code));
    store.dispatch(updateAppId(app_id, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
  }
}

async function handleMagicLinkCallbackParams(store, params) {
  let isLoggedIn = await store.dispatch(checkLoginStatus());
  // only one of policy id and app_id should present
  let app_id = params.app_id || jsCookie.get('app_id');
  let close_policy = params.close_policy;

  if (close_policy) {
    store.dispatch(updateMetadata('closePolicyFlag', true));
  }
  if ((isLoggedIn) && app_id) {
    store.dispatch(updateAppId(app_id, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
  }
}

function handleDecisionDashboardCallbackParams(store, params) {
  let app_id = params.app_id || '';
  store.dispatch(updateMetadata('fromAccounts', true));
  store.dispatch(updateAppId(app_id, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
}

function handlePhoneParams(store, params) {
  let email;
  let hdSessionId;
  let isEmailRefAdvisorRebooking = false;
  let isEmailRefTeleRebooking = false;
  let isEmailRefParaRebooking = false;

  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let dateStr;
    switch (key) {
      // DEPRECATED
      // case 'email_ref_v1': // link back to phone call rescheduling
      //   isEmailRefV1 = true;
      //   break;
      case `email_ref_v${EMAIL_REF_VERSIONS.ADVISOR_REBOOKINGS}`:
        isEmailRefAdvisorRebooking = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.TELE_INTERVIEW_REBOOKING}`:
        isEmailRefTeleRebooking = true;
        break;
      case `email_ref_v${EMAIL_REF_VERSIONS.PARAMED_VISIT_REBOOKING}`:
        isEmailRefParaRebooking = true;
        break;
      case 'email':
        if (isEmail(val)) {
          email = val;
        }
        break;
      case 'session_id':
        if (isValidUUID(val)) {
          hdSessionId = val;
        }
        break;
      default:
        break;
    }
  });

  // if this is from the email campaign, then set the email field
  // NOTE: requires email_ref_v1 to be in the query params, used this
  // in case we want to invalidate these links at some point in the future
  if (isEmailRefAdvisorRebooking && email !== '') {
    store.dispatch(updateHouseholdPropPrimary('email', email));
    store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.ADVISOR_REBOOKINGS));
    store.dispatch(updateSessionPropPrimary('hd_session_id', hdSessionId));
  }
  if (isEmailRefTeleRebooking && email !== '') {
    store.dispatch(updateHouseholdPropPrimary('email', email));
    store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.TELE_INTERVIEW_REBOOKING));
    store.dispatch(updateSessionPropPrimary('hd_session_id', hdSessionId));
  }
  if (isEmailRefParaRebooking && email !== '') {
    store.dispatch(updateHouseholdPropPrimary('email', email));
    store.dispatch(updateMetadata('emailRefVers', EMAIL_REF_VERSIONS.PARAMED_VISIT_REBOOKING));
    store.dispatch(updateSessionPropPrimary('hd_session_id', hdSessionId));
  }

  return true;
}

export function handleEappGetLinkParams(store, path) {
  const tokens = path.split('/');
  if (tokens[1] !== 'eapp' || tokens[2] !== 'get-link' || tokens[4] !== 'application' || tokens[6] !== 'short') {
    sentryError(
      'could not properly parse eapp get link query params', {
        extras: { path },
        tags: { rootCause: 'eapp link query params' },
      },
    );
    console.log('ERROR: could not properly parse eapp get link query params');
  }
  const medium = tokens[3];
  const applicationId = tokens[5];
  const eappValidateShortCode = tokens[7];
  store.dispatch(updateMetadata('eappValidateMedium', medium));
  store.dispatch(updateMetadata('eappValidateShortCode', eappValidateShortCode));
  store.dispatch(updateAppId(applicationId, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
  return true;
}

function handleSentryCheck(params, dispatch) {
  try {
    if (params.sentry) {
      sentryInfo('Test Info Event', {
        extras: { rootCause: 'debug' },
        tags: { rootCause: 'debug' },
      });
    }
  } catch (err) {
    if (process.env.browser) {
      sentryWarning(err);
    }
  }
}

export function handlePolicyGetLinkParams(store, path) {
  const tokens = path.split('/');
  if (tokens[1] !== 'policy' || tokens[2] !== 'get-link' || tokens[4] !== 'id' || tokens[6] !== 'short') {
    sentryError(
      'could not properly parse policy get link query params',
      { extras: { path } },
    );
    console.log('ERROR: could not properly parse policy get link query params');
  }
  const medium = tokens[3];
  const policyId = tokens[5];
  store.dispatch(updateSessionPropPrimary('auth_medium', medium));
  store.dispatch(updateSessionPropPrimary('hd_policy_id', policyId));
  return true;
}

function handleDownloadPolicyGetLinkParams(store, path) {
  const tokens = path.split('/');
  if (tokens[1] !== 'policy-download' || tokens[2] !== 'get-link' || tokens[4] !== 'id' || tokens[6] !== 'short') {
    sentryError(
      'could not properly parse policy get link query params', {
        extras: { path },
        tags: { rootCause: 'policy link query params' },
      },
    );
  }
  const medium = tokens[3];
  const policyId = tokens[5];
  const eappValidateShortCode = tokens[7];
  store.dispatch(updateSessionPropPrimary('auth_medium', medium));
  store.dispatch(updateSessionPropPrimary('hd_policy_id', policyId));
  store.dispatch(updateMetadata('is_download_policy_journey', true));
  store.dispatch(updateMetadata('eappValidateShortCode', eappValidateShortCode));
  return true;
}

function handlePolicyDownloadPageParams(store, params) {
  Object.keys(params).forEach((key, index) => {
    switch (key) {
      case `short_url`:
        store.dispatch(updateMetadata('eappValidateShortCode', params[key]));
        break;
      case `policy_id`:
      case `hd_policy_id`:
        store.dispatch(updateSessionPropPrimary('hd_policy_id', params[key]));
        break;
      case 'app_id':
        store.dispatch(updateAppId(params[key], USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
        break;
      default:
        break;
    }
  });
}

function handleApprovedSteps(store, params) {
  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let blockPrimaryPages;
    switch (key) {
      case 'blockPrimaryPages':
        blockPrimaryPages = parseBool(val);
        store.dispatch(updateMetadata('blockPrimaryPages', blockPrimaryPages));
        break;
      default:
        break;
    }
  });
}

function handleUnderwriterSteps(store, params) {
  Object.keys(params).forEach((key, index) => {
    let val = params[key];
    let blockPrimaryPages;
    switch (key) {
      case 'blockPrimaryPages':
        blockPrimaryPages = parseBool(val);
        store.dispatch(updateMetadata('blockPrimaryPages', blockPrimaryPages));
        break;
      default:
        break;
    }
  });
}

export function handleAffiliateParams(params) {
  return async (dispatch, getState) => {
    if (process.env.BROWSER) {
      // Set theme
      let _theme: string = THEMES.policyme_original; // generic type because 'CAA -> caa'
      const tenantName = getTenant().name;
      const tenantSuborganization = getTenant().suborg?.name;
      if (isCAAEnvironment()) {
        _theme = THEMES.CAA;
      }
      if (tenantSuborganization) {
        _theme = THEMES[tenantSuborganization];
        // the theme should be set successfully at this point,
        // if it is not, then we have an invalid suborganization/the theme isn't updated
        if (!_theme) {
          sentryError(
            'Invalid suborganization',
            { extras: { tenantSuborganization } },
          );
        }
      }
      if (params && params.affiliate_id) {
        await dispatch(handleAffiliateInfo(params.affiliate_id));
        if (isMortgageBroker(getState())) {
          dispatch(handleMortgageAppParams(params));
        }
        // Decide theme based on affiliate
        const affiliateName = getAffiliateName(getState());
        // Remove PM_ENABLE_THEMES mock in handleAffiliateParams jest test when it is unused
        if (PM_ENABLE_THEMES === '1' && THEMES[affiliateName]) {
          _theme = THEMES[affiliateName];
        }
      }
      dispatch(updateUserControlProp('theme', _theme));
    }
  };
}

export function loadLocaleData(locale): Promise<any> {
  switch (locale) {
    case LOCALE.FR_CA:
      return import('../../compiled-lang/fr_CA.json').then(m => m.default || m);
    default:
      return import('../../compiled-lang/en_CA.json').then(m => m.default || m);
  }
}

export function handleLoadLocaleData(params) {
  return async (dispatch, getState) => {
    let locale = getBrowserLocale();
    if (process.env.BROWSER) {
      if (params && hasValue(params.application_language)) {
        locale = params.application_language;
      }
    }
    dispatch(updateHouseholdPropAll('application_language', locale));
  };
}
/**
 * Handles the parsing of the query params for the external advisor mode
 */
/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link handleExternalAdvisorParameters} instead
 */
const handleExternalAdvisorParams = async (store: Store,
  params: Record<string, string>, productType: ProductType) => {
  const externalAdvisorId = params?.external_advisor_id;
  const userId = params?.user_id;
  const fromAdvisor = params?.from_advisor;
  const email = params?.email;
  const isPurchase = params?.is_purchase;
  const appId = params?.app_id;

  if (isPurchase && externalAdvisorId && userId && email && appId) {
    store.dispatch(updateIsLoading(true));
    const ret = await handleValidatePurchaseJourneyParams({
      external_advisor_id: externalAdvisorId,
      user_id: userId,
      email,
      app_id: appId,
      product_type: productPrefixToProductType(productType),
    }) as any;
    if (!ret) {
      sentryError('Attempt to modify purchase mode params from the URL', { extras: params });
      throw new Error('Attempt to modify purchase mode params from the URL');
    }
  }
  store.dispatch(updateIsLoading(false));

  if (externalAdvisorId) {
    store.dispatch(makeUpdateProductAppProp(productType, USER_TYPES.PRIMARY)('external_advisor_id', externalAdvisorId));
  }
  if (fromAdvisor) {
    store.dispatch(updateMetadata('externalAdvisorMode', parseBool(fromAdvisor)));
  }
  if (isPurchase) {
    store.dispatch(updateMetadata('purchaseMode', parseBool(isPurchase)));
  }
  if (appId) {
    store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(`${productType}_application_id`, appId));
  }
  if (userId) {
    store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)('user_id', userId));
  }
  if (email) {
    store.dispatch(updateEmailPrimary(email));
  }
};

/**
 * Handles the parsing of the query params for the external advisor mode
 */
const handleExternalAdvisorParameters = async (store: Store,
  params: Record<string, string>, productType: ProductType) => {
  const externalAdvisorId = params?.external_advisor_id;
  const accountId = params?.account_id;
  const fromAdvisor = params?.from_advisor;
  const email = params?.email;
  const isPurchase = params?.is_purchase;
  const appId = params?.app_id;

  if (isPurchase && externalAdvisorId && accountId && email && appId) {
    store.dispatch(updateIsLoading(true));
    const ret = await handleValidatePurchaseJourneyParameters({
      external_advisor_id: externalAdvisorId,
      account_id: accountId,
      email,
      app_id: appId,
      product_type: productPrefixToProductType(productType),
    }) as any;
    if (!ret) {
      sentryError('Attempt to modify purchase mode params from the URL', { extras: params });
      throw new Error('Attempt to modify purchase mode params from the URL');
    }
  }
  store.dispatch(updateIsLoading(false));

  if (externalAdvisorId) {
    store.dispatch(makeUpdateProductAppProp(productType, USER_TYPES.PRIMARY)('external_advisor_id', externalAdvisorId));
  }
  if (fromAdvisor) {
    store.dispatch(updateMetadata('externalAdvisorMode', parseBool(fromAdvisor)));
  }
  if (isPurchase) {
    store.dispatch(updateMetadata('purchaseMode', parseBool(isPurchase)));
  }
  if (appId) {
    store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)(`${productType}_application_id`, appId));
  }
  if (accountId) {
    store.dispatch(makeUpdateSessionProp(USER_TYPES.PRIMARY)('account_id', accountId));
  }
  if (email) {
    store.dispatch(updateEmailPrimary(email));
  }
};

/**
 * Parses routes and query params to update the store
 * Applies to all routes
 * @param store : redux store
 * @param params : search params in the path of the page
 * @returns void
 */
const handleGlobalParseParams = (store: Store,
  params: Record<string, string>): void => {
  /**
   * This main product is not derived from application logic, but rather the
   * current route. This is becausee the external advisor can be toggled from any page
   * and we need to know which product's state to update. This is only available
   * through parsing the route; the application logic to get product from the state
   * is not available at this point in the lifecycle of the app.
   * If we don't have information through routes (eg drop journeys), we use the params
   * to get the product type. Note that this product type is full, not the prefix, and so
   * it has to be converted to the prefix.
   */
  const state: State = store.getState();
  const productTypeFromParams = productTypeToProductPrefix(params?.product_type as ProductTypeFull);
  const productType = getProductFromCurrRoute(state) || productTypeFromParams;

  if (!productType) {
    return;
  }

  if (productTypeFromParams) {
    store.dispatch(updateMetadata('postAppMainProduct', productTypeFromParams));
  }

  accountIdWrapper(handleExternalAdvisorParams, handleExternalAdvisorParameters, store, params, productType);
};

export function parseQueryParams(store, serverParams = {}, cookies = {}) {
  let state = store.getState();
  let { pathname, search } = state.router.location;
  let params = process.env.BROWSER ? queryString.parse(search) : serverParams;

  const utmIds = getUtmIds(store.dispatch);
  params.utm_global_id = utmIds.utm_global_id;
  params.utm_tracking_id = utmIds.utm_tracking_id;

  const abTestBand = getABTestBand(state);
  const pageOptions = getRoutePageOptions(abTestBand, pathname);

  if (params && params.fromBlog) {
    store.dispatch(updateMetadata('fromBlog', true));
  }

  store.dispatch(handleAffiliateParams(params));
  store.dispatch(handleAvailableProducts());

  handleDebugParams(params, store.dispatch, state);
  let debugFlag = store.getState().metadata.debugFlag;
  handleUtmParams(params, store.dispatch, debugFlag, state);
  handleSentryCheck(params, store.dispatch);

  pathname = stripTrailingSlash(pathname);
  if (pathname.toLowerCase().match(ROUTE_REGEX.POLICY_GET_LINK)) {
    store.dispatch(updateMetadata('fromDropJourney', true));
    handlePolicyGetLinkParams(store, pathname);
  }

  if (pathname.toLowerCase().match(ROUTE_REGEX.DOWNLOAD_POLICY_GET_LINK)) {
    handleDownloadPolicyGetLinkParams(store, pathname);
  }
  // load translation files
  store.dispatch(handleLoadLocaleData(params));
  handleGlobalParseParams(store, params);
  // !!!! NEW PARSE LOGIC GOES HERE !!!!
  // Define pageOptions in pageOptionsConfig.js
  if (pageOptions?.isEappStartSignPage) {
    store.dispatch(updateMetadata('decisionHasBeenMade', true));
    store.dispatch(updateMetadata('fromDocusign', true));
    store.dispatch(updateAppId(jsCookie.get('app_id'), USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD));
  }

  // This is the auth0 response if a user fails authentication at the start app page
  if (params.res) {
    store.dispatch(updateMetadata('auth0Resp', params.res));
  }

  // !!!! OLD PARSE LOGIC !!!!
  // Ideally, move stuff out of here and into the pageOptions-based logic above.
  switch (pathname) {
    case ROUTES.QUOTES_COMPARE:
    case ROUTES.FAMILY:
      // parse cookies if we didn't restore relevant data from query params
      if (canRequote(store.getState(), USER_TYPES.PRIMARY) === false) {
        handleCookieParams(store, cookies);
      }
      break;
    case getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD):
      store.dispatch(updateUserControlProp('isHealthAndDental', true));
      store.dispatch(handleAvailableProductsHD());
      // parse url params
      handleQuotesParams(store, params, PM_PRODUCT_PREFIX.HD);

      // parse cookies if we didn't restore relevant data from query params
      if (canRequote(store.getState(), USER_TYPES.PRIMARY) === false) {
        console.log('handleQuotesParams HD restoring from cookies', cookies);
        handleCookieParams(store, cookies);
      }
      store.dispatch(updateMetadata('fromQuoteCompare', true));
      store.dispatch(updateUserSessionCovAndTermDefaultsAndFetchQuotes(PM_PRODUCT_PREFIX.HD));
      break;
    case getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD):
      store.dispatch(updateMetadata('fromStartApp', true));
      store.dispatch(updateUserControlProp('isHealthAndDental', true));
      store.dispatch(handleAvailableProductsHD());
      handleStartAppParams(store, params, PM_PRODUCT_PREFIX.HD);
      break;

    case getRouteWithUserType(ROUTES.DOCUSIGN_APPLICATION_CALLBACK, USER_TYPES.PRIMARY):
    case getRouteWithUserType(ROUTES.DOCUSIGN_APPLICATION_CALLBACK, USER_TYPES.SECONDARY):
      handleDocusignCallbackParams(store, params);
      store.dispatch(updateMetadata('docusignCallbackType', DOCUSIGN_CALLBACK_TYPE.REVIEW_ESIGN));
      break;

    case getRouteWithUserType(ROUTES.POLICY_DOWNLOAD_CALLBACK, USER_TYPES.PRIMARY):
    case getRouteWithUserType(ROUTES.POLICY_DOWNLOAD_CALLBACK, USER_TYPES.SECONDARY):
      handleDocusignCallbackParams(store, params);
      store.dispatch(updateMetadata('docusignCallbackType', DOCUSIGN_CALLBACK_TYPE.DOWNLOAD_MY_POLICY));
      store.dispatch(updateMetadata('is_download_policy_journey', true));
      break;

    case ROUTES.DOCUSIGN_APPLICATION_GET_LINK:
      handleDocusignGetLinkParams(store, params);
      break;

    case ROUTES.SKIP_MAGIC_LINK_CALLBACK:
      handleSkipMagicLinkCallbackParams(store, params);
      break;

    case ROUTES.MAGIC_LINK_AUTH_CALLBACK:
      handleMagicLinkCallbackParams(store, params);
      break;

    case ROUTES.DECISION_DASHBOARD_CALLBACK:
      handleDecisionDashboardCallbackParams(store, params);
      break;

    case ROUTES.POLICY_DOWNLOAD_DOWNLOAD_PAGE:
      store.dispatch(updateMetadata('decisionHasBeenMade', true));
      store.dispatch(updateMetadata('fromDocusign', true));
      store.dispatch(updateMetadata('is_download_policy_journey', true));
      handlePolicyDownloadPageParams(store, params);
      break;

    default:
      break;
  }
}

export function handleCookieParams(store, cookies = {}) {
  let familyComposition;
  let dob;
  let secondaryDob;
  let gender;
  let secondaryGender;
  let smokingStatus;
  let secondarySmokingStatus;
  let coverageAmount;
  let termLength;
  let jointToggleFlag;
  let province;
  let secondaryProvince;
  let healthcardProvince;
  let secondaryHealthcardProvince;
  let dependentFlag;
  let dependentDetails;

  if (!process.env.BROWSER) {
    familyComposition = cookies[RESTORE_QUOTES_COOKIE_KEYS.FAMILY_COMPOSITION];
    dob = cookies[RESTORE_QUOTES_COOKIE_KEYS.DOB];
    secondaryDob = cookies[RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_DOB];
    gender = cookies[RESTORE_QUOTES_COOKIE_KEYS.GENDER];
    secondaryGender = cookies[RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_GENDER];
    smokingStatus = cookies[RESTORE_QUOTES_COOKIE_KEYS.SMOKING_STATUS];
    secondarySmokingStatus = cookies[RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_SMOKING_STATUS];
    coverageAmount = cookies[RESTORE_QUOTES_COOKIE_KEYS.COVERAGE_AMOUNT];
    termLength = cookies[RESTORE_QUOTES_COOKIE_KEYS.TERM_LENGTH];
    jointToggleFlag = cookies[RESTORE_QUOTES_COOKIE_KEYS.JOINT_TOGGLE_FLAG];
    province = cookies[RESTORE_QUOTES_COOKIE_KEYS.PROVINCE];
    secondaryProvince = cookies[RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_PROVINCE];
    healthcardProvince = cookies[RESTORE_QUOTES_COOKIE_KEYS.HEALTHCARD_PROVINCE];
    secondaryHealthcardProvince = cookies[RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_HEALTHCARD_PROVINCE];
    dependentFlag = cookies[RESTORE_QUOTES_COOKIE_KEYS.DEPENDENT_FLAG];
    dependentDetails = cookies[RESTORE_QUOTES_COOKIE_KEYS.DEPENDENTS_DETAILS];
  } else {
    familyComposition = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.FAMILY_COMPOSITION);
    dob = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.DOB);
    secondaryDob = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_DOB);
    gender = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.GENDER);
    secondaryGender = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_GENDER);
    smokingStatus = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.SMOKING_STATUS);
    secondarySmokingStatus = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_SMOKING_STATUS);
    coverageAmount = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.COVERAGE_AMOUNT);
    termLength = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.TERM_LENGTH);
    jointToggleFlag = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.JOINT_TOGGLE_FLAG);
    province = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.PROVINCE);
    secondaryProvince = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_PROVINCE);
    healthcardProvince = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.HEALTHCARD_PROVINCE);
    secondaryHealthcardProvince = jsCookie.get(
      RESTORE_QUOTES_COOKIE_KEYS.SECONDARY_HEALTHCARD_PROVINCE,
    );
    dependentFlag = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.DEPENDENT_FLAG);
    dependentDetails = jsCookie.get(RESTORE_QUOTES_COOKIE_KEYS.DEPENDENTS_DETAILS);
  }

  jointToggleFlag = jointToggleFlag === 'true';
  dependentFlag = dependentFlag === 'true';

  if (familyComposition !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('user_family_composition', familyComposition));
  }
  if (dob !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('birthdate', dob));
  }
  if (secondaryDob !== undefined) {
    store.dispatch(updateHouseholdPropSecondary('birthdate', secondaryDob));
  }
  if (gender !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('userGender', gender));
  }
  if (secondaryGender !== undefined) {
    store.dispatch(updateHouseholdPropSecondary('userGender', secondaryGender));
  }
  if (smokingStatus !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('smoke', smokingStatus === 'true'));
  }
  if (secondarySmokingStatus !== undefined) {
    store.dispatch(updateHouseholdPropSecondary('smoke', secondarySmokingStatus === 'true'));
  }
  // Life session cookie hydration removed for HD-only webapp
  if (jointToggleFlag !== undefined) {
    store.dispatch(updateHasPartnerApplication(jointToggleFlag));
    if (jointToggleFlag) {
      store.dispatch(updateAllUserSessionPropAllProducts('selected_quote_type', QUOTE_TYPES.JOINT));
      store.dispatch(updateMetadata('isPartnerFormComplete', true));
    }
  }
  if (province !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('province', province));
  }
  if (secondaryProvince !== undefined) {
    store.dispatch(updateHouseholdPropSecondary('province', secondaryProvince));
  }
  if (healthcardProvince !== undefined) {
    store.dispatch(updateHouseholdPropPrimary('healthcard_province', healthcardProvince));
  }
  if (secondaryHealthcardProvince !== undefined) {
    store.dispatch(updateHouseholdPropSecondary('healthcard_province', secondaryHealthcardProvince));
  }
  if (dependentDetails !== undefined) {
    if (dependentFlag) {
      updateDepStateFromCookie(store, dependentDetails);
    }
  }
}
