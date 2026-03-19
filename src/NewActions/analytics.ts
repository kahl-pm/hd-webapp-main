import {
  getTenant,
  hasFlag,
  segmentIdentify,
  segmentInit,
  segmentPageEvent,
  segmentReset,
  segmentTrackEvent,
  sentryError,
  isSegmentBlocked,
  TENANT_FLAGS,
} from '@policyme/global-libjs-utils';
import jsCookie from 'js-cookie';
import { getABTestTrackingData } from '../components/Customisation/helpers';
import { facebookTrackCustom } from '../utils/facebookHelpers';
import {
  USER_TYPES,
  ROUTE_REGEX,
  SEGMENT_EVENTS,
  PAGE_NAMES,
  BUYING_METHOD,
  UserType,
  PM_PRODUCT_PREFIX,
  ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING,
  CRM_LIFE_SESSION_FIELDS,
} from '../utils/const';
import { calcAge, getGenericRoute, getOtherUserType } from '../utils/helpers';
import { getCurrentUser, getProductName, isJoint } from '../Selectors/userControl';
import { getAppBuyingMethod, getAppUnderwritingMethod, getHDAppPlanType, getMainProduct, isAppProductAdded, ProductPrefix } from '../Selectors/helpers/productApp';
import { getProductSessionTerm, getProductTotalAmt, productContainsCaaDiscount } from '../Selectors/helpers/productSession';
import { getNonDiscountedMonthlyUserTypePrem, getNonDiscountedYearlyUserTypePrem, getQuotesDiscountCodes, quotesContainsCaaDiscount } from '../Selectors/quotes';
import { getProductAppId } from '../Selectors/session';
import { getCurrentDisclosure } from '../Selectors/disclosure';
import { getABTestBand, getQuotesCopilotCiProductToggleSelected } from '../Selectors/metadata';
import { ACTIVE_TESTS } from '../ABTests';
import { getProductPricingFields } from '../components/HOC/WithPricing';
import { updateMetadata } from './metadata';
import { castStringToNumber, cleanReferrer } from './helpers/analyticsHelpers';
import { utmReferringDomain } from '../utils/utm';


const MOBILE_MAX_WIDTH = 767;
const TABLET_MAX_WIDTH = 1023;

const getDeviceType = (): 'desktop' | 'mobile' | 'tablet' => {
  if (typeof window === 'undefined') {
    return 'desktop';
  }
  const width = window.innerWidth || window.screen?.width || MOBILE_MAX_WIDTH + 1;
  if (width <= MOBILE_MAX_WIDTH) {
    return 'mobile';
  }
  if (width <= TABLET_MAX_WIDTH) {
    return 'tablet';
  }
  return 'desktop';
};

const removeTrackingFields = (properties: Record<string, unknown>) => {
  const sanitizedProperties = { ...properties };
  Object.keys(sanitizedProperties).forEach((key) => {
    if (key.startsWith('utm_') || key === 'first_visited_url') {
      delete sanitizedProperties[key];
    }
  });
  return sanitizedProperties;
};

const sanitizeSegmentEventData = (eventData: Record<string, unknown>) => {
  const sanitizedEventData = removeTrackingFields(eventData);

  return { ...sanitizedEventData, device: getDeviceType() };
};

const getCurrentPageContext = (pathname?: string) => {
  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : undefined);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : undefined;
  const currentTitle = typeof document !== 'undefined' ? document.title : undefined;

  return {
    ...(currentPath ? { path: currentPath } : {}),
    ...(currentUrl ? { url: currentUrl } : {}),
    ...(currentTitle ? { title: currentTitle } : {}),
  };
};

const getRawReferrer = () => {
  const referringDomainCookie = jsCookie.get(utmReferringDomain);
  if (referringDomainCookie && referringDomainCookie !== '') {
    return referringDomainCookie;
  }
  if (typeof document !== 'undefined') {
    return document.referrer || undefined;
  }
  return undefined;
};

const getSelfReportedReferrer = (state: Record<string, any>) => ({
  self_reported_referrer: state?.metadata?.[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE] ?? '',
  self_reported_referrer_detail: state?.metadata?.[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER] ?? '',
});

const getExperimentDetails = (abTestTrackingData: Record<string, string>) => {
  return Object.entries(abTestTrackingData)
    .filter(([_, variant_id]) => variant_id !== '' && variant_id !== undefined && variant_id !== null)
    .map(([experiment_id, variant_id]) => ({ experiment_id, variant_id }));
};

export const sendEventAll = (eventName) => {
  return (dispatch, getState) => {
    segmentTrackEvent(eventName, sanitizeSegmentEventData(getCurrentPageContext()));
    facebookTrackCustom(eventName);
  };
};

export function handleSegmentInit() {
  return async (dispatch, getState) => {
    const success = segmentInit();
    if (!success) {
      sentryError('Segment: Unable to find API Key');
      return;
    }

    // Force Segment's direct runtime path (window.analytics) so we can avoid
    // auto-injecting legacy UTM fields from the shared wrapper payload.
    if (typeof window !== 'undefined' && (window as any).analytics && !(window as any).Webflow) {
      (window as any).Webflow = {};
    }

    try {
      const blocked = await isSegmentBlocked();
      if (blocked) {
        dispatch(updateMetadata('segmentBlocked', true));
      }
    } catch (error) {
      // Catch errors from isSegmentBlocked (e.g., network failures to segment.io)
      // Log with a descriptive message to avoid "undefined" errors in Sentry
      const errorMessage = error?.message || 'Unknown error checking if Segment is blocked';
      sentryError(`Segment: Error checking if blocked - ${errorMessage}`);
      // Don't re-throw - allow the app to continue even if we can't determine if Segment is blocked
    }
  };
}

const getDisclosureName = (pathname, state) => {
  const isDisclosure = pathname.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION);
  return isDisclosure ? getCurrentDisclosure(state).question.text : null;
};

export function sendSegmentPageEvent(pathname: string, extra_properties?: Record<string, unknown>) {
  return async (dispatch, getState) => {
    const state = getState();
    const user = getCurrentUser(state);
    const genericRoute = getGenericRoute(pathname);
    const disclosureName = getDisclosureName(pathname, state);
    const pageName = PAGE_NAMES[genericRoute] ?? disclosureName ?? '';
    const testBand = getABTestBand(state);
    const abTestTrackingData = getABTestTrackingData(ACTIVE_TESTS, testBand);
    const experiment_details = getExperimentDetails(abTestTrackingData);
    const rawReferrer = getRawReferrer();
    const referrer = cleanReferrer(rawReferrer);

    const experimentDetailsPayload = getExperimentDetails(state);

    const properties = {
      product_type: getMainProduct(state, user),
      ...(referrer && { referrer }),
      ...(experiment_details.length > 0 && { experiment_details }),
      ...abTestTrackingData,
      ...getSelfReportedReferrer(state),
      ...getCurrentPageContext(pathname),
      ...experimentDetailsPayload,
      ...extra_properties,
    };
    segmentPageEvent(pathname, pageName, properties);
  };
}

const steps = {
  [SEGMENT_EVENTS.EXPERIMENT_VIEWED]: 0,
  [SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE]: 4,
  [SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE]: 5,
  [SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE]: 6,
  [SEGMENT_EVENTS.QUOTE_RECEIVED]: 8,
  [SEGMENT_EVENTS.LOGIN_INITIATED]: 9,
  [SEGMENT_EVENTS.LOGIN_SUCCESSFUL]: 10,
  [SEGMENT_EVENTS.APPLICATION_STARTED]: 11,
  [SEGMENT_EVENTS.APPLICATION_SUBMITTED]: 12,
  [SEGMENT_EVENTS.DECISION_RECEIVED]: 13,
  [SEGMENT_EVENTS.PAYMENT_RECEIVED]: 14,
  [SEGMENT_EVENTS.PAYMENT_COMPLETED]: 14,
  // same as payment_received because we want the same info in both events
};

export function sendSegmentTrackEvent(eventName: string, userType: UserType = USER_TYPES.PRIMARY,
  paymentProduct: ProductPrefix = PM_PRODUCT_PREFIX.HD,
  extraData: Record<string, any> = {}) {
  return async (dispatch, getState) => {
    const state = getState();
    const rawReferrer = getRawReferrer();
    const referrer = cleanReferrer(rawReferrer);
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
    const partner_age = state[getOtherUserType(userType)].household.birthdate ? calcAge(state[getOtherUserType(userType)].household.birthdate) : '';
    const abTestTrackingData = getABTestTrackingData(ACTIVE_TESTS, testBand);
    const experiment_details = getExperimentDetails(abTestTrackingData);
    const existing_hd_plan_flag = Boolean(state?.primary?.hdSession?.existing_hd_plan_flag);
    const existing_hd_plan_option = existing_hd_plan_flag ?
      state?.primary?.hdSession?.existing_hd_plan_option ?? '' : '';
    const hd_losing_benefit_flag = Boolean(state?.primary?.hdSession?.losing_benefits);
    const login_method = state.metadata.login_method || 'magic_link';
    const num_dependents = state.dependents.dependents.length ?? 0;
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
    const ci_added_at_checkout = false; // Life/CI removed for HD-only flow
    const ci_added_at_quote = false; // Life/CI removed for HD-only flow
    try {
      coverage_fit_response_text = is_joint_flag
        ? ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING[coverage_fit_flag].jointTextId
        : ANALYTICS_COVERAGE_FIT_OPTIONS_TEXT_MAPPING[coverage_fit_flag].singleTextId;
    } catch (error) {
      coverage_fit_response_text = '';
    }
    let eventData: Record<string, unknown> = {
      ...abTestTrackingData,
      ...(experiment_details.length > 0 && { experiment_details }),
      ...extraData,
    };
    const order = steps[eventName];
    if (order >= steps[SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE]) {
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
    if (order >= steps[SEGMENT_EVENTS.QUOTE_RECEIVED]) {
      eventData = {
        ...eventData,
        selected_coverage_amount,
        selected_term_length,
        selected_monthly_premium,
        selected_yearly_premium,
        discounts,
        ...hd_quote_received_properties,
        ...extraData,
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
        ci_added_at_quote
      };
      if (is_joint_flag) {
        eventData = {
          ...eventData,
          partner_gender: state[getOtherUserType(userType)].household.userGender,
          partner_smoke: state[getOtherUserType(userType)].household.smoke,
          partner_age
        };
      }
    }
    if (order >= steps[SEGMENT_EVENTS.EXPERIMENT_VIEWED]) {
      Object.entries(abTestTrackingData).forEach(([experiment_id, variant_id]) => {
        eventData[`${experiment_id}`] = variant_id;
      });
    }
    if (order >= steps[SEGMENT_EVENTS.QUOTE_RECEIVED]) {
      eventData = {
        ...eventData,
        selected_coverage_amount,
        selected_term_length,
        selected_monthly_premium,
        selected_yearly_premium,
        discounts,
        ...hd_quote_received_properties,
        ...extraData,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE] &&
      product_prefix === PM_PRODUCT_PREFIX.HD) {
      eventData = {
        ...eventData,
        replacing_coverage: existing_hd_plan_flag,
        existing_plan_name: existing_hd_plan_option,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE] &&
      product_prefix === PM_PRODUCT_PREFIX.HD) {
      eventData = {
        ...eventData,
        lost_group_benefits_90d: hd_losing_benefit_flag,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE] &&
      product_prefix === PM_PRODUCT_PREFIX.HD) {
      eventData = {
        ...eventData,
        coverage_fit_response: coverage_fit_response_text,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.LOGIN_INITIATED]) {
      eventData = {
        ...eventData,
        login_method,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.LOGIN_SUCCESSFUL]) {
      eventData = {
        ...eventData,
        login_method,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.APPLICATION_STARTED]) {
      eventData = {
        ...eventData,
        app_id,
      };
    }
    if (order >= steps[SEGMENT_EVENTS.DECISION_RECEIVED]) {
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
    if (order >= steps[SEGMENT_EVENTS.PAYMENT_RECEIVED]) {
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
        ci_added_at_checkout,
      };
    }
    eventData = {
      ...eventData,
      ...(referrer && { referrer }),
      ...getSelfReportedReferrer(state),
      ...getCurrentPageContext(),
    };
    // Remove keys with empty string values from eventData before sending
    const filteredEventData = Object.fromEntries(
      Object.entries(eventData).filter(([_, v]) => v !== '' && v !== null && v !== undefined),
    );
    const sanitizedEventData = sanitizeSegmentEventData(filteredEventData);
    segmentTrackEvent(eventName, sanitizedEventData);
  };
}

export function sendSegmentIdentifyEvent(userId?: string, userType = USER_TYPES.PRIMARY) {
  return async (dispatch, getState) => {
    const state = getState();
    const tenant = getTenant().name;
    const tenant_id = getTenant().id;
    const product_type = getMainProduct(state, userType);
    const suborganization = getTenant().suborg?.name;
    const is_joint_flag = isJoint(state);
    const { active_decision, policy_status } = state[userType][`${product_type}Decision`];
    const plan_type = getHDAppPlanType(state) ?? '';
    const { province, city, country, userGender, birthdate, smoke } = state[userType].household;
    const {
      province: partner_province,
      city: partner_city,
      country: partner_country,
      userGender: partner_gender,
      birthdate: partner_birthdate,
      smoke: partner_smoke,
    } = state[getOtherUserType(userType)].household;
    const age = birthdate ? calcAge(birthdate) : 0;
    const partner_age = partner_birthdate ? calcAge(partner_birthdate) : 0;
    const is_caa_member = quotesContainsCaaDiscount(state, userType, product_type) ||
      productContainsCaaDiscount(state, userType);
    const testBand = getABTestBand(state);
    const abTestTrackingData = getABTestTrackingData(ACTIVE_TESTS, testBand);
    const experiment_details = getExperimentDetails(abTestTrackingData);
    const login_method = state.metadata.login_method || 'magic_link';
    const referrer = cleanReferrer(getRawReferrer());
    const num_dependents = state.dependents.dependents.length ?? 0;
    const buying_method = getAppBuyingMethod(state, userType, product_type)
      || BUYING_METHOD.STAND_ALONE;
    const underwriting_method = getAppUnderwritingMethod(state, userType, product_type) ?? '';
    segmentIdentify(userId, {
      tenant,
      tenant_id,
      product_type,
      suborganization,
      is_joint_flag,
      policy_status,
      active_decision,
      plan_type,
      joint_role: userType,
      province,
      city,
      country,
      is_caa_member,
      gender: userGender,
      age,
      smoke,
      login_method,
      buying_method,
      underwriting_method,
      num_dependents,
      ...(referrer && { referrer }),
      ...getSelfReportedReferrer(state),
      ...(experiment_details.length > 0 && { experiment_details }),
      ...(is_joint_flag ? {
        partner_province,
        partner_city,
        partner_country,
        partner_gender,
        partner_age,
        partner_smoke,
      } : {}),
      ...abTestTrackingData,
    });
  };
}

export function sendSegmentResetEvent() {
  return async (dispatch, getState) => {
    segmentReset();
  };
}
