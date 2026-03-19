import {
    hasFlag,
    segmentPageEvent,
    segmentTrackEvent,
    TENANT_FLAGS,
  } from '@policyme/global-libjs-utils';
  import jsCookie from 'js-cookie';
  import { getABTestTrackingData } from '../components/Customisation/helpers';
  import { USER_TYPES, ROUTE_REGEX, PAGE_NAMES, BUYING_METHOD, UserType, PM_PRODUCT_PREFIX, ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING, LEGACY_SEGMENT_EVENTS } from '../utils/const';
  import { calcAge, getGenericRoute, getOtherUserType } from '../utils/helpers';
  import { getCurrentUser, getProductName, isJoint } from '../Selectors/userControl';
  import { getAppBuyingMethod, getAppUnderwritingMethod, getHDAppPlanType, getMainProduct, isAppProductAdded, ProductPrefix } from '../Selectors/helpers/productApp';
  import { getProductSessionTerm, getProductTotalAmt } from '../Selectors/helpers/productSession';
  import { getNonDiscountedMonthlyUserTypePrem, getNonDiscountedYearlyUserTypePrem, getQuotesDiscountCodes } from '../Selectors/quotes';
  import { getProductAppId } from '../Selectors/session';
  import { getABTestBand, getQuotesCopilotCiProductToggleSelected } from '../Selectors/metadata';
  import { ACTIVE_TESTS } from '../ABTests';
  import { getProductPricingFields } from '../components/HOC/WithPricing';
  import { castStringToNumber } from './helpers/analyticsHelpers';
import { sendSegmentIdentifyEvent } from './analytics';

  const steps = {
    [LEGACY_SEGMENT_EVENTS.HD_USER_INTENT_INDICATED]: 0,
    [LEGACY_SEGMENT_EVENTS.USER_INTENT_INDICATED]: 0,
    [LEGACY_SEGMENT_EVENTS.INPUTS_RECEIVED]: 2,
    [LEGACY_SEGMENT_EVENTS.SAW_PERMANENT_INSURANCE]: 3,
    [LEGACY_SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE]: 4,
    [LEGACY_SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE]: 5,
    [LEGACY_SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE]: 6,
    [LEGACY_SEGMENT_EVENTS.QUOTE_SHOWN]: 7,
    [LEGACY_SEGMENT_EVENTS.QUOTE_RECEIVED]: 8,
    [LEGACY_SEGMENT_EVENTS.LOGIN_INITIATED]: 9,
    [LEGACY_SEGMENT_EVENTS.LOGIN_SUCCESSFUL]: 10,
    [LEGACY_SEGMENT_EVENTS.APPLICATION_STARTED]: 11,
    [LEGACY_SEGMENT_EVENTS.APPLICATION_SUBMITTED]: 12,
    [LEGACY_SEGMENT_EVENTS.DECISION_RECEIVED]: 13,
    [LEGACY_SEGMENT_EVENTS.PAYMENT_RECEIVED]: 14,
    [LEGACY_SEGMENT_EVENTS.PAYMENT_COMPLETED]: 14,
    // same as payment_received because we want the same info in both events
  };
  
  export function sendSegmentTrackEventLegacy(eventName: string, userType: UserType = USER_TYPES.PRIMARY,
    paymentProduct: ProductPrefix = PM_PRODUCT_PREFIX.HD,
    extraData: Record<string, any> = {}) {
    return async (dispatch, getState) => {
      const state = getState();
      const preferred_language = state[userType].household.application_language;
      const product_prefix = getMainProduct(state, userType);
      const selected_coverage_amount = getProductTotalAmt(state, userType, product_prefix);
      const selected_term_length = getProductSessionTerm(state, userType, product_prefix);
      const selected_monthly_premium =
        castStringToNumber(getNonDiscountedMonthlyUserTypePrem(state, userType, product_prefix));
      const selected_yearly_premium =
        castStringToNumber(getNonDiscountedYearlyUserTypePrem(state, userType, product_prefix));
      const is_joint_flag = isJoint(state);
      const buying_method = getAppBuyingMethod(state, userType, product_prefix)
        || BUYING_METHOD.STAND_ALONE;
      const plan_type = getHDAppPlanType(state) ?? '';
      const product_name = getProductName(state, product_prefix);
      const underwriting_method = getAppUnderwritingMethod(state, userType, product_prefix);
      const app_id = getProductAppId(state, userType, product_prefix);
      const testBand = getABTestBand(state);
      const discounts = getQuotesDiscountCodes(state, userType, product_prefix).join(' | ');
  
      const issued_coverage_amount = state[userType][`${product_prefix}Policy`].coverage_amount;
      const issued_term_length = state[userType][`${product_prefix}Policy`].term;
      const issued_monthly_premium = castStringToNumber(state[userType][`${product_prefix}Policy`].monthly_premiums_issued);
      const issued_yearly_premium = castStringToNumber(state[userType][`${product_prefix}Policy`].annual_premiums_issued);
      const { active_decision, initial_decision } = state[userType][`${product_prefix}Decision`];
      const aura_uw_decision = initial_decision;
      const third_party_uw_decision = '';
      const disclosure_only_decision = '';
      const { province, userGender, birthdate, smoke } = state[userType].household;
      const age = birthdate ? calcAge(birthdate) : '';
      const abTestTrackingData = getABTestTrackingData(ACTIVE_TESTS, testBand);
      const existing_hd_plan_flag = state?.primary?.hdSession?.existing_hd_plan_flag ?? null;
      const existing_hd_plan_option = existing_hd_plan_flag ?
        state?.primary?.hdSession?.existing_hd_plan_option : null;
      const hd_losing_benefit_flag = state?.primary?.hdSession?.losing_benefits ?? null;
      const login_method = state.metadata.login_method;
      const num_dependents = state.dependents.dependents.length ?? 0;
      const ci_added_at_checkout = false; // Life/CI removed for HD-only flow
      const ci_added_at_quote = false; // Life/CI removed for HD-only flow
      const hd_quote_received_properties = product_prefix === PM_PRODUCT_PREFIX.HD ? {
        existing_hd_plan_flag,
        existing_hd_plan_option,
        hd_losing_benefit_flag,
      } : {};
      const recmd_cov_amt = getProductPricingFields(
        state,
        USER_TYPES.PRIMARY,
        product_prefix,
      ).recmd_cov_amt ?? '';
      const recmd_term_length = (recmd_cov_amt && getProductSessionTerm(state, USER_TYPES.PRIMARY, product_prefix)) || '';
      const life_cov_type = '';
      const coverage_fit_flag = state.primary.hdSession.coverage_fit_flag ?? '';
      let coverage_fit_response_text;
      try {
        coverage_fit_response_text = is_joint_flag
          ? ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING[coverage_fit_flag].jointTextId
          : ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING[coverage_fit_flag].singleTextId;
      } catch (error) {
        coverage_fit_response_text = '';
      }
      let eventData: Record<string, string | number | boolean> = {
        ...abTestTrackingData,
        preferred_language,
      };
      const order = steps[eventName];
      if ((order >= steps[LEGACY_SEGMENT_EVENTS.USER_INTENT_INDICATED]) || (order >= steps[LEGACY_SEGMENT_EVENTS.HD_USER_INTENT_INDICATED])) {
        eventData = {
          ...eventData,
          user_intent: state.metadata.userIntent,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.INPUTS_RECEIVED]) {
        const partnerData: Record<string, string | number | boolean> = {};
        if (is_joint_flag) {
          partnerData.partner_gender = state[USER_TYPES.SECONDARY].household.userGender;
          partnerData.partner_smoke = state[USER_TYPES.SECONDARY].household.smoke;
          partnerData.partner_age = state[USER_TYPES.SECONDARY].household.birthdate ? calcAge(state[USER_TYPES.SECONDARY].household.birthdate) : '';
        }
        eventData = {
          ...eventData,
          gender: userGender,
          smoke,
          age,
          recmd_term_length_life: '',
          main_product_type: product_prefix,
          birthdate,
          product_type: product_prefix,
          cov_type: life_cov_type,
          recmd_cov_amt_life: recmd_cov_amt,
          ...partnerData,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.INPUTS_RECEIVED]) {
        eventData = {
          ...eventData,
          province,
          age,
          buying_method,
          is_joint_flag,
          joint_role: userType,
          plan_type,
          product_name,
          underwriting_method,
          smoke,
          gender: userGender,
          num_dependents,
        };
        if (is_joint_flag) {
          eventData = {
            ...eventData,
            partner_age: state[getOtherUserType(userType)].household.birthdate ? calcAge(state[getOtherUserType(userType)].household.birthdate) : '',
            partner_birthdate: state[getOtherUserType(userType)].household.birthdate,
            partner_gender: state[getOtherUserType(userType)].household.userGender,
            partner_smoke: state[getOtherUserType(userType)].household.smoke,
          };
        }
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.QUOTE_RECEIVED]) {
        eventData = {
          ...eventData,
          selected_coverage_amount,
          selected_term_length,
          selected_monthly_premium,
          selected_yearly_premium,
          discounts,
          ...hd_quote_received_properties,
          ...extraData,
          ci_added_at_quote
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE] &&
        product_prefix === PM_PRODUCT_PREFIX.HD) {
        eventData = {
          ...eventData,
          replacing_coverage: existing_hd_plan_flag,
          existing_plan_name: existing_hd_plan_option,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE] &&
        product_prefix === PM_PRODUCT_PREFIX.HD) {
        eventData = {
          ...eventData,
          lost_group_benefits_90d: hd_losing_benefit_flag,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE] &&
        product_prefix === PM_PRODUCT_PREFIX.HD) {
        eventData = {
          ...eventData,
          coverage_fit_response: coverage_fit_response_text,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.QUOTE_SHOWN]) {
        eventData = {
          ...eventData,
          ...extraData,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.LOGIN_INITIATED]) {
        eventData = {
          ...eventData,
          login_method,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.APPLICATION_STARTED]) {
        eventData = {
          ...eventData,
          app_id,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.DECISION_RECEIVED]) {
        eventData = {
          ...eventData,
          issued_coverage_amount,
          issued_term_length,
          issued_monthly_premium,
          issued_yearly_premium,
          active_decision,
          aura_uw_decision,
          third_party_uw_decision,
          disclosure_only_decision,
        };
      }
      if (order >= steps[LEGACY_SEGMENT_EVENTS.PAYMENT_RECEIVED]) {
        eventData = {
          ...eventData,
          product_type: paymentProduct,
          product_name: paymentProduct,
          selected_coverage_amount: selected_coverage_amount,
          selected_term_length: selected_term_length,
          selected_monthly_premium: selected_monthly_premium,
          selected_yearly_premium: selected_yearly_premium,
          issued_coverage_amount: issued_coverage_amount,
          issued_term_length: issued_term_length,
          issued_monthly_premium: issued_monthly_premium,
          issued_yearly_premium: issued_yearly_premium,
          payment_method: state[userType].payment.paymentMethod,
          ci_added_at_checkout
        };
      }
      // Remove keys with empty string values from eventData before sending
      const filteredEventData = Object.fromEntries(
        Object.entries(eventData).filter(([_, v]) => v !== ''),
      );
      segmentTrackEvent(eventName, filteredEventData);
    };
  }
  
  export function sendAnalyticsForQuotesPage() {
    return async (dispatch, getState) => {
      dispatch(sendSegmentIdentifyEvent());
      // Life permanent insurance check removed for HD-only flow
    };
  }