import { flagsmithIsFlagEnabled, sentryError, sentryWarning } from '@policyme/global-libjs-utils';
import * as Sentry from '@sentry/browser';
import {
  getAuthUserInfo,
} from './fetch';
import { updateQuotesCustom, preDecisionRequoteActual, addQuotesDiscount, removeQuotesDiscount } from './quotes';
import { makeUpdateMetadataSessionProp, updateMetadata, makeUpdateMetadataAppProp, makeUpdateMetadata, initABTestBand } from './metadata';
import { makeUpdateDecisionProp, storeRisks } from './helpers/productDecision';
import {
  QUOTE_TYPES,
  INSURERS,
  USER_TYPES,
  CRM_LIFE_SESSION_FIELDS,
  PM_PRODUCT_PREFIX,
  PLAN_TYPES,
  AURA_DECISION_TYPES,
  ROUTES,
} from '../utils/const';
import {
  isEmptyObj,
  fromNullToStr,
  hasValue,
  productTypeToProductPrefix,
  setABTestBandCookie,
  getGenericRoute,
  makeUpdateProductSessionProp,
} from '../utils/helpers';
import { makeUpdateHouseholdProp } from './household';
import {
  updateSessionPropPrimary, makeUpdateSessionProp, updateSessionPropSecondary,
  updateAppId, updateUserId,
  checkLoginStatus,
} from './session';
import { updateUserControlProp, updateHasPartnerApplication } from './userControl';
import { initialState as sessionState } from '../Reducer/session';
import { initialState as hdPolicyState } from '../Reducer/hdPolicy';
import { initialState as hdDecisionState } from '../Reducer/hdDecision';
import { makeUpdateProductPolicyProp } from './helpers/productPolicy';
import { canRequote } from '../Selectors/quotes';
import { makeUpdatePaymentDetails } from './payment';
import { hasFreeMonthsDiscount } from '../Selectors/helpers/productSession';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { PM_ENABLE_DEFAULT_MONTHLY_PAYMENT, PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS } from '../config';
import { makeUpdateProductAppProp } from './helpers/productApp';
import { setUserHealthDentalIndividualSessionQuotes } from './hdSession';
import { hydrateDependentPolicyInfo } from './hydrateDependent';
import { handleAffiliateInfo, handleDiscountsForCAA, handleSaveUserConsent, handleSaveUserAccountConsent } from './handle';
import { DISCOUNT_CODES } from '../utils/discounts';
import { clearDependents } from './dependents';
import { isCAAEnvironment } from '../tenant/helpers';
import { isInExternalAdvisorMode } from '../Selectors/productApp';
import { FLAGSMITH_FLAGS } from '../utils/flagsmith';

const sessionStateKeys = Object.keys(sessionState);

const hdDecisionStateKeys = Object.keys(hdDecisionState);
const hdPolicyStateKeys = Object.keys(hdPolicyState);

export const hydrateUserPolicyInfo = (
  data, userType : typeof USER_TYPES[keyof typeof USER_TYPES] = USER_TYPES.PRIMARY,
) => {
  return async (dispatch, getState) => {
    // don't bother filling if the user is missing email & payment info
    // (this is to defend against setting null and erroring out later in our flow)
    const { health_dental } = fromNullToStr(data);
    const hasHDPremiums = health_dental.annual_premium || health_dental.monthly_premium;

    if (data.hh_info_id || hasHDPremiums) {
      // update user information
      dispatch(makeUpdateSessionProp(userType)('household_id', data.hh_info_id));
      dispatch(makeUpdateSessionProp(userType)('household_id_vers', 0));
      dispatch(makeUpdateHouseholdProp(userType)('email', data.email));
      dispatch(makeUpdateHouseholdProp(userType)('firstName', data.user_first_name));
      dispatch(makeUpdateHouseholdProp(userType)('lastName', data.user_last_name));
      dispatch(makeUpdateHouseholdProp(userType)('phone', data.phone));
      dispatch(makeUpdateHouseholdProp(userType)('userGender', data.user_gender));
      dispatch(makeUpdateHouseholdProp(userType)('smoke', data.user_smoker));
      dispatch(makeUpdateHouseholdProp(userType)('birthdate', data.user_birthdate));
      dispatch(makeUpdateHouseholdProp(userType)('province', data.province));
      dispatch(makeUpdateHouseholdProp(userType)('healthcard_province', data.healthcard_province));
      dispatch(makeUpdateHouseholdProp(userType)('application_language', data.application_language));
      dispatch(makeUpdateHouseholdProp(userType)('user_family_composition', data.user_family_composition));
      dispatch(makeUpdateHouseholdProp(userType)('userIncome', data.user_income));
      dispatch(makeUpdateHouseholdProp(userType)('userIncomeOverride', data.user_income_override));
      dispatch(makeUpdateSessionProp(userType)('account_id', data.account_id));
      dispatch(makeUpdateSessionProp(userType)('user_id', data.user_id));

      if (hasValue(data.phone)) {
        dispatch(makeUpdateMetadata(userType)('hasPreExistingPhoneNumber', true));
      }

      if (data.affiliate_id) {
        dispatch(updateUserControlProp('affiliateId', data.affiliate_id));
        dispatch(updateUserControlProp('affiliate', {
          affiliateName: data.affiliate_name,
          affiliateCategory: data.affiliate_category,
        }));
        dispatch(handleAffiliateInfo(data.affiliate_id));
      }

      // handle CAA related discounts
      if (health_dental.discount_codes &&
        health_dental.discount_codes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT)
      ) {
        dispatch(handleDiscountsForCAA(userType, null, true));
      }

      // handle HD family discount
      if (PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS === '1' && isCAAEnvironment()) {
        if (health_dental.discount_codes &&
          health_dental.discount_codes.includes(DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT)) {
          dispatch(addQuotesDiscount(userType, PM_PRODUCT_PREFIX.HD)(
            DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
          ));
        } else {
          dispatch(removeQuotesDiscount(userType, PM_PRODUCT_PREFIX.HD)(
            DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT,
          ));
        }
      }

      if (hasHDPremiums) {
        dispatch(hydrateUserProductInfo(userType, PM_PRODUCT_PREFIX.HD, health_dental));
        dispatch(makeUpdateProductPolicyProp(userType, PM_PRODUCT_PREFIX.HD)('discounts', health_dental.discounts));
        if (health_dental.plan_type) {
          // Rehydrate plan_type for after payment drop journey
          dispatch(makeUpdatePaymentDetails(userType)('planType', health_dental.plan_type));
        }
      } else {
        // hydrate without post decision related info
        dispatch(hydrateUserAppInfo(userType, PM_PRODUCT_PREFIX.HD, health_dental));
      }
    } else {
      console.log(`skipping hydration for ${userType} because premiums for all products are missing`);
    }
  };
};

export const hydrateUserProductInfo = (userType, productPrefix, productData) => {
  let productDecisionStateKeys;
  return async (dispatch, getState) => {
    if (productPrefix === PM_PRODUCT_PREFIX.HD) {
      productDecisionStateKeys = hdDecisionStateKeys;
    }

    let productPolicyStateKeys;
    if (productPrefix === PM_PRODUCT_PREFIX.HD) {
      productPolicyStateKeys = hdPolicyStateKeys;
    }

    if (productData.annual_premium || productData.monthly_premium) {
      Object.keys(productData).forEach(key => {
        if (key === 'risks') {
          dispatch(storeRisks(productData[key], userType, productPrefix));
        } else if (sessionStateKeys.includes(key)) {
          // hydrate session related states (including completed status of approved steps)
          dispatch(makeUpdateSessionProp(userType)(key, productData[key]));
        } else if (sessionStateKeys.includes(`${productPrefix}_${key}`)) {
          // hydrate session fields that has product prefix e.g. ci_policy_id
          dispatch(makeUpdateSessionProp(userType)(`${productPrefix}_${key}`, productData[key]));
          // TODO (FORM-1013): Remove temporary hack to get prefixed product events
          if (key === 'application_id') {
            dispatch(makeUpdateMetadataSessionProp(userType)(
              `${productPrefix}_${key}`, productData[key],
            ));
          }
        } else if (productDecisionStateKeys.includes(key)) {
          // hydrate decision related states (active_decision, risks, policy_status)
          dispatch(makeUpdateDecisionProp(userType, productPrefix)(key, productData[key]));
        } else if (productPolicyStateKeys.includes(key)) {
          dispatch(makeUpdateProductPolicyProp(userType, productPrefix)(key, productData[key]));
        }
      });
    }

    // update prices & insurer
    let quoteType = QUOTE_TYPES.PRIMARY;
    if (userType === USER_TYPES.SECONDARY) {
      quoteType = QUOTE_TYPES.SECONDARY;
    }

    // update buying_method and product_added
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('product_added', productData.product_added));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('buying_method', productData.buying_method));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('underwriting_method', productData.underwriting_method));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('insurance_ownership_type', productData.insurance_ownership_type));

    // TODO (FORM-1013): Remove temporary hack to get prefixed product events
    // update buying_method and product_added for metadata mixpanel events
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('product_added', productData.product_added));
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('buying_method', productData.buying_method));
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('underwriting_method', productData.underwriting_method));

    // quote related
    dispatch(updateQuotesCustom(userType, productPrefix)('mn_prems', productData.monthly_premium, quoteType));
    dispatch(updateQuotesCustom(userType, productPrefix)('yr_prems', productData.annual_premium, quoteType));
    dispatch(updateQuotesCustom(userType, productPrefix)('company', INSURERS.PM, quoteType));

    // term length & coverage amount
    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('selected_term', productData.term_length));
    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('override_amt', productData.coverage_amount));
    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('recmd_cov_amt', productData.recommended_coverage_amount));

    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('selected_quote_type', quoteType));

    // update policy state
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('applicationDate', productData.application_date));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('premium_class', productData.premium_class));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('annual_premiums_issued', productData.annual_premiums_issued));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('annual_premiums_applied', productData.annual_premiums_applied));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('monthly_premiums_issued', productData.monthly_premiums_issued));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('monthly_premiums_applied', productData.monthly_premiums_applied));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('quote_breakdown', productData.quote_breakdown));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('add_ons_completed', productData.add_ons_completed));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('digital_consent_status', productData.digital_consent_status));

    // update coverage and term to lifePolicy
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('coverageAmount', productData.coverage_amount));
    dispatch(makeUpdateProductPolicyProp(userType, productPrefix)('term', productData.term_length));

    // update decision state
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('tobacco_rating_flag', productData.tobacco_rating_flag));
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('smoking_discrepancy_flag', productData.smoking_discrepancy_flag));
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('uw_total_debits', productData.uw_total_debits));
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('uw_flat_extra_debits', productData.uw_flat_extra_debits));
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('active_maximum_eligible_coverage', productData.active_maximum_eligible_coverage));
    dispatch(makeUpdateDecisionProp(userType, productPrefix)('exclusions', productData.exclusions));

    // update error flag
    dispatch(makeUpdateDecisionProp(userType,
      productPrefix)(CRM_LIFE_SESSION_FIELDS.AURA_UW_DECISION_ERROR_FLAG,
      productData.error_flag ? 'Y' : 'N'));

    if (productPrefix === PM_PRODUCT_PREFIX.HD) {
      dispatch(
        setUserHealthDentalIndividualSessionQuotes(userType, null, productData.quote_breakdown),
      );

      dispatch(makeUpdateProductSessionProp(userType, PM_PRODUCT_PREFIX.HD)('plan_type', productData.plan_type));
      dispatch(updateMetadata('planTypeStartApp', productData.plan_type));
    }
  };
};

export const hydrateUserAppInfo = (userType, productPrefix, productDataRaw) => {
  return async (dispatch, getState) => {
    const productData = fromNullToStr(productDataRaw);
    Object.keys(productData).forEach(key => {
      if (sessionStateKeys.includes(key)) {
        // hydrate session related states (including completed status of approved steps)
        dispatch(makeUpdateSessionProp(userType)(key, productData[key]));
      } else if (sessionStateKeys.includes(`${productPrefix}_${key}`)) {
        // hydrate session fields that has product prefix e.g. ci_policy_id
        dispatch(makeUpdateSessionProp(userType)(`${productPrefix}_${key}`, productData[key]));
        // TODO (FORM-1013): Remove temporary hack to get prefixed product events
        if (key === 'application_id') {
          dispatch(makeUpdateMetadataSessionProp(userType)(
            `${productPrefix}_${key}`, productData[key],
          ));
        }
      } else if (key === 'recommended_coverage_amount') {
        dispatch(makeUpdateProductSessionProp(userType, productPrefix)('recmd_cov_amt', productData[key]));
      }
    });

    // update prices & insurer
    let quoteType = QUOTE_TYPES.PRIMARY;
    if (userType === USER_TYPES.SECONDARY) {
      quoteType = QUOTE_TYPES.SECONDARY;
    }

    // update buying_method and product_added
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('product_added', productData.product_added));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('buying_method', productData.buying_method));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('underwriting_method', productData.underwriting_method));
    dispatch(makeUpdateProductAppProp(
      productPrefix, userType,
    )('insurance_ownership_type', productData.insurance_ownership_type));

    // TODO (FORM-1013): Remove temporary hack to get prefixed product events
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('product_added', productData.product_added));
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('buying_method', productData.buying_method));
    dispatch(makeUpdateMetadataAppProp(productPrefix, userType)('underwriting_method', productData.underwriting_method));

    // term length & coverage amount
    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('selected_term', productData.term_length));
    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('override_amt', productData.coverage_amount));

    dispatch(makeUpdateProductSessionProp(userType, productPrefix)('selected_quote_type', quoteType));

    if (productPrefix === PM_PRODUCT_PREFIX.HD) {
      // update selected quote for health and dental
      dispatch(
        setUserHealthDentalIndividualSessionQuotes(userType, null, productData.quote_breakdown),
      );

      dispatch(makeUpdateProductSessionProp(userType, PM_PRODUCT_PREFIX.HD)('plan_type', productData.plan_type));
      dispatch(updateMetadata('planTypeStartApp', productData.plan_type));
    }
  };
};

export const authGetUserInfo = () => {
  return async (dispatch, getState) => {
    // since we don't know which policy_id it is from the drop journey
    // we always put it in primary's life_policy_id temporarily and then hydrate the state
    const {
      hd_application_id: hd_app_id,
    } = getState().primary.session;
    const app_id = hd_app_id;
    const { isCurrentlyHydratingData, finishedHydrating, currRoute } = getState().metadata;
    const onQuotesPage = getGenericRoute(currRoute).includes(ROUTES.QUOTES_COMPARE_CONTINUED);

    if (onQuotesPage) {
      // do not hydrate if we are leaving start app page via back button
      return false;
    }

    if (isCurrentlyHydratingData || finishedHydrating) {
      // don't hydrate if we already hydrated before
      return false;
    }

    // flag to check if we are currently hydrating data
    dispatch(updateMetadata('isCurrentlyHydratingData', true));

    try {
      const ret = await getAuthUserInfo(app_id);
      const {
        primary, secondary, dependents,
      } = fromNullToStr(ret);

      const { ab_test_band } = ret;

      // Set Sentry tags when user returns after authentication
      try {
        if (process.env.BROWSER) {
          const state = getState();
          const mainProduct = getMainProduct(state, USER_TYPES.PRIMARY);
          const session_id = state.primary.session[`${mainProduct}_session_id`];
          
          if (session_id) {
            Sentry.setTag('session_id', session_id);
            Sentry.setTag('product', mainProduct);
          }    
          if (app_id) {
            Sentry.setTag('app_id', app_id);
          }
        }
      } catch (error) {
        sentryError(error);
      }

      if (app_id) {
        dispatch(hydrateUserPolicyInfo(primary, USER_TYPES.PRIMARY));
        if (!isEmptyObj(secondary)) {
          dispatch(hydrateUserPolicyInfo(secondary, USER_TYPES.SECONDARY));
        }
        if (dependents?.length) {
          dispatch(clearDependents()); // clear dependents in redux state (if there's any)
          dependents.forEach(dependent => {
            dispatch(hydrateDependentPolicyInfo(dependent));
          });
        }
        if (primary?.health_dental?.active_decision) {
          // need to calculate the overall decision for the family
          let decision: string = AURA_DECISION_TYPES.APPROVED;
          let familyMembers = [primary, ...dependents];
          if (!isEmptyObj(secondary)) {
            // secondary can be null, so only include it if there is data
            familyMembers.push(secondary);
          }
          familyMembers.forEach(member => {
            if (member?.health_dental?.active_decision !== AURA_DECISION_TYPES.APPROVED) {
              decision = AURA_DECISION_TYPES.REFER_TO_UNDERWRITER;
            }
          });
          dispatch(makeUpdateDecisionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('overall_decision', decision));
        }
      }

      if (!isEmptyObj(secondary)) {
        const state = getState();
        // check if secondary has a policy
        const { hd_application_id } =
          state[USER_TYPES.SECONDARY].session;
        if (hd_application_id) {
          // support joint decision flow
          dispatch(updateHasPartnerApplication(true));
        }
      }

      // update metadata (can use either primary or secondary since they are the same)
      dispatch(updateMetadata('advisor_id', primary.advisor_id || ''));
      dispatch(updateMetadata('advisor_full_name', primary.advisor_full_name || ''));
      dispatch(updateReviewEsignCompleted(USER_TYPES.PRIMARY));
      if (!isEmptyObj(secondary)) {
        dispatch(updateReviewEsignCompleted(USER_TYPES.SECONDARY));
      }

      if (ab_test_band) {
        setABTestBandCookie(ab_test_band);
        dispatch(initABTestBand(ab_test_band));
      }

      if (PM_ENABLE_DEFAULT_MONTHLY_PAYMENT === '1') {
        dispatch(makeUpdatePaymentDetails(USER_TYPES.PRIMARY)('planType', PLAN_TYPES.MONTHLY));
        if (!isEmptyObj(secondary)) {
          dispatch(makeUpdatePaymentDetails(USER_TYPES.SECONDARY)('planType', PLAN_TYPES.MONTHLY));
        }
      }

      let mainProduct;
      if (ret.controlling_user) {
        // HACK FIX
        // dealLinkProductType is set to the mainProduct of the user who the drop link belongs to,
        // this is so we dont show CI journey for a user who has settled and
        // and uses the settled link to come back
        const controlling_user = ret.controlling_user;
        const linkProductType = productTypeToProductPrefix(ret.deal_link_product_type);

        if (!hasValue(getState().metadata.dealLinkProductType)) {
          // this should only apply when we are hydrating fresh state,
          // if its already defined we dont want to change it
          dispatch(updateMetadata('dealLinkProductType', linkProductType));
        }

        mainProduct = getMainProduct(getState(), controlling_user);
      }

      if (mainProduct === PM_PRODUCT_PREFIX.HD) {
        await dispatch(updateUserControlProp('availableProducts', [PM_PRODUCT_PREFIX.HD]));
      }

      if (canRequote(getState(), USER_TYPES.PRIMARY) || mainProduct === PM_PRODUCT_PREFIX.HD) {
        const products = getState().userControl.availableProducts;
        await Promise.all(products.map(async (p) => {
          return dispatch(preDecisionRequoteActual(USER_TYPES.PRIMARY, p));
        }));
      } else {
        sentryWarning(
          'Expected to be able to get quotes after parsing rehydrating from magic link, but could not',
        );
      }

      // now that we finished hydrating, we turn the flag off
      await dispatch(checkLoginStatus());
      if (!isInExternalAdvisorMode(getState())) {
        const currentUser = getState().userControl.currentUser;
        if (flagsmithIsFlagEnabled(FLAGSMITH_FLAGS.PM_ENABLE_ACCOUNT_ID_VERSION)) {
          const account_id = getState()[currentUser].session.account_id;
          dispatch(handleSaveUserAccountConsent(account_id));
        } else {
          const user_id = getState()[currentUser].session.user_id;
          dispatch(handleSaveUserConsent(user_id));
        }
      }
      dispatch(updateMetadata('isCurrentlyHydratingData', false));
      dispatch(updateMetadata('finishedHydrating', true));

      // Hydrate navbar
      dispatch(setupNavBar(ret.controlling_user));

      return ret;
    } catch (error) {
      console.error(error);
      sentryError(error, { extras: { app_id, rootCause: 'Error getting completed status' } });
      return { invalid: true };
    }
  };
};

export const setupNavBar = (userType = USER_TYPES.PRIMARY) => {
  return async (dispatch, getState) => {
    const state = getState();
    dispatch(updateMetadata('navbarFirstName', state[userType]?.household.firstName));
    dispatch(updateMetadata('navbarLastName', state[userType]?.household.lastName));
  };
};

export const updateReviewEsignCompleted = (userType) => {
  return async (dispatch, getState) => {
    // No-op for HD-only flow (Life/CI signature checks removed)
  };
};
