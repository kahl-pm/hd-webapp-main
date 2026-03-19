/**
 * This file contains the routing logic for the legacy journey.
 * Most of this logic was adapted from code in src/NewActions/session.ts
 *
 * If you find yourself maintaining or changing code in here, please reconsider!
 * It would be much better to move the logic for your journey to a DeclarativeJourney!
 */

import { PM_ENABLE_QUEBEC_PRODUCT } from '../../config';
import { isBMOIEnvironment, isCAAEnvironment } from '../../tenant/helpers';
import { PM_PRODUCT_PREFIX, ROUTES, USER_TYPES, UNDERWRITING_METHODS, ProductType, BUYING_METHOD } from '../../utils/const';
import { isHDFullyUWEnabled } from '../../utils/flagHelpers';
import { getRouteWithProductType, getRouteWithUserType, isValidUUID, shouldShowCoverageFitPage, isSocialSignOnFeatureEnabled } from '../../utils/helpers';
import { JourneyPath, JourneyContext } from '../types';

export const firstQuestion = () => ROUTES.GETTING_STARTED;

export const nextQuestion = (pathname:JourneyPath, context: JourneyContext) => {
  return nextQuestionHd(pathname, context);
};

const handleAddressToBirthLocationRouting = (
  context: JourneyContext,
  isGI: boolean,
  isPortable: boolean,
) => {
  if (isGI || isPortable) {
    if (context.hasPreExistingPhoneNumber) {
      return consentPageFlow(context);
    }
    return ROUTES.APPLICATION_CELL_PHONE;
  }
  return ROUTES.APPLICATION_BIRTH_LOCATION;
};

const nextQuestionHd = (pathname:JourneyPath, context: JourneyContext) => {
  // Adapted from nextQuestionHd in src/NewActions/session.ts

  const isSocialSignOnEnabled_ = isSocialSignOnFeatureEnabled();
  const hasPolicy = isValidUUID(context.hdPolicyId);
  const isGI = context.underwritingMethod === UNDERWRITING_METHODS.GUARANTEED_ISSUE;
  const isPortable = context.underwritingMethod === UNDERWRITING_METHODS.PORTABLE_COVERAGE;
  const shouldShowCoverageFitQuestion = shouldShowCoverageFitPage(
    context.underwritingMethod,
    context.hasPartner,
  );

  switch (pathname) {
    case getRouteWithProductType(ROUTES.FAMILY, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.USER_INTENT, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.GROUP_BENEFITS, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.GROUP_BENEFITS, PM_PRODUCT_PREFIX.HD):
      if (!isHDFullyUWEnabled()) {
        if (shouldShowCoverageFitQuestion) {
          return getRouteWithProductType(ROUTES.COVERAGE_FIT_QUESTION, PM_PRODUCT_PREFIX.HD);
        }
        return getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD);
      }
      return getRouteWithProductType(ROUTES.PRESCRIPTION_DRUGS, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.COVERAGE_FIT_QUESTION, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.COVER_PRESCRIPTIONS, PM_PRODUCT_PREFIX.HD):
      if (shouldShowCoverageFitQuestion) {
        return getRouteWithProductType(ROUTES.COVERAGE_FIT_QUESTION, PM_PRODUCT_PREFIX.HD);
      }
      return getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.PRESCRIPTION_DRUGS, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.COVER_PRESCRIPTIONS, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD):
      if (isCAAEnvironment()) {
        return getRouteWithProductType(ROUTES.CAA_MEMBER, PM_PRODUCT_PREFIX.HD);
      }

      return getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.CAA_MEMBER, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD):
      return context.externalAdvisorMode ? ROUTES.OTP_VERIFICATION : ROUTES.VERIFICATION;

    case getRouteWithProductType(ROUTES.FAMILY_COMPOSITION, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.QUOTES_COMPARE, PM_PRODUCT_PREFIX.HD);

    case getRouteWithProductType(ROUTES.HOUSEHOLD_INCOME, PM_PRODUCT_PREFIX.HD):
      return getRouteWithProductType(ROUTES.EXISTING_COVERAGE_HD, PM_PRODUCT_PREFIX.HD);

    case ROUTES.VERIFICATION:
      // if social sign on is enabled, redirect to basic details page
      if (isSocialSignOnEnabled_) {
        return ROUTES.APPLICATION_BASIC_DETAILS;
      }
      return getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY);

    case ROUTES.KEEP_EXISTING_APP:
      return context.externalAdvisorMode ? ROUTES.OTP_VERIFICATION : ROUTES.VERIFICATION;

    case ROUTES.DECISION_DASHBOARD_CALLBACK:
      return ROUTES.DECISION_DASHBOARD_PAGE;
    case ROUTES.SKIP_MAGIC_LINK_CALLBACK:
    case ROUTES.MAGIC_LINK_AUTH_CALLBACK:
    case ROUTES.OTP_VERIFICATION:
    case ROUTES.TWO_FACTOR_VERIFICATION_CODE:
      if (hasPolicy) {
        return ROUTES.DECISION_DASHBOARD_PAGE;
      } else if (isSocialSignOnEnabled_) {
        return ROUTES.APPLICATION_BASIC_DETAILS;
      }

      return getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY);

    case ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF:
      if (context.isJoint || context.hasDependents) {
        return ROUTES.APPLICATION_PRIMARY_TRANSITION;
      }
      return ROUTES.APPLICATION_BEGIN_DISCLOSURE;

    case ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER: {
      return ROUTES.APPLICATION_FINANCES;
    }
    case ROUTES.APPLICATION_FINANCES:
      if (context.isJoint || context.hasDependents) {
        return ROUTES.APPLICATION_PRIMARY_TRANSITION;
      }
      return ROUTES.APPLICATION_BEGIN_DISCLOSURE;

    case ROUTES.APPLICATION_EXISTING_POLICIES:
      if (context.hasExistingPolicies) {
        return ROUTES.APPLICATION_REPLACE_EXISTING_POLICIES;
      }
      return ROUTES.APPLICATION_PENDING_POLICIES;

    case ROUTES.APPLICATION_REPLACE_EXISTING_POLICIES:
      return ROUTES.APPLICATION_PENDING_POLICIES;

    case ROUTES.APPLICATION_PENDING_POLICIES: {
      return ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_PARTNER;
    }
    case ROUTES.APPLICATION_PRIMARY_TRANSITION:
      return ROUTES.APPLICATION_BEGIN_DISCLOSURE;
    case ROUTES.APPLICATION_BASIC_DETAILS:
      return getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY);
    case getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.PRIMARY):
      if (isBMOIEnvironment()) {
        return ROUTES.AIRMILES_COLLECTOR_PAGE;
      }
      return handleAddressToBirthLocationRouting(context, isGI, isPortable);

    case ROUTES.AIRMILES_COLLECTOR_PAGE:
      return handleAddressToBirthLocationRouting(context, isGI, isPortable);

    case ROUTES.APPLICATION_PARTNER_SAME_ADDRESS:
      if (context.isPartnerSameAddress) {
        return ROUTES.APPLICATION_BIRTH_LOCATION;
      }
      return getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.SECONDARY);

    case getRouteWithUserType(ROUTES.APPLICATION_FULL_ADDRESS, USER_TYPES.SECONDARY):
      return ROUTES.APPLICATION_BIRTH_LOCATION;

    case ROUTES.APPLICATION_BIRTH_LOCATION:
      return ROUTES.APPLICATION_EMPLOYMENT_INCOME_ANNUAL_SELF;

    case ROUTES.APPLICATION_PARTNER_INFO:
      if (context.hasPreExistingPhoneNumber) {
        return consentPageFlow(context);
      }
      return ROUTES.APPLICATION_CELL_PHONE;

    case ROUTES.APPLICATION_REFERRER:
      return ROUTES.APPLICATION_INTEREST;

    case ROUTES.APPLICATION_INTEREST:
      return ROUTES.APPLICATION_CONSENT;

    case ROUTES.APPLICATION_CELL_PHONE:
      if (context.isMortgageBroker && context.hasLeadSource) {
        return ROUTES.APPLICATION_CONSENT;
      }
      return ROUTES.APPLICATION_REFERRER;

    case ROUTES.APPLICATION_CONSENT:
      return decisionIsMade(context);

    case getRouteWithUserType(ROUTES.APPROVED_EFFECTIVE_DATE, USER_TYPES.PRIMARY):
      return getRouteWithUserType(ROUTES.APPROVED_PAYMENT_FORM, USER_TYPES.PRIMARY);

    case ROUTES.POLICY_OTP_ENTER:
      if (context.otpAuthorised || context.isJoint) {
        return ROUTES.DECISION_DASHBOARD_PAGE;
      }

      return ROUTES.POLICY_OTP_UNSUCCESSFUL;

    default:
      return undefined;
  }
};

const consentPageFlow = (context:JourneyContext) => {
  if (context.isMortgageBroker && context.hasLeadSource) {
    return ROUTES.APPLICATION_CONSENT;
  }
  return ROUTES.APPLICATION_REFERRER;
};

const decisionIsMade = (context:JourneyContext) => {
  // if there's ongoing requests, have them wait on the consent page
  if (context.isMakingDecisionRequests) {
    return ROUTES.APPLICATION_CONSENT;
  }
  const isGI = context.underwritingMethod === UNDERWRITING_METHODS.GUARANTEED_ISSUE;
  const isPortable = context.underwritingMethod === UNDERWRITING_METHODS.PORTABLE_COVERAGE;
  if (isGI || isPortable) {
    return getRouteWithUserType(ROUTES.COMBINED_CHECKOUT_HD, USER_TYPES.PRIMARY);
  }

  if (context.canSkipDecisionPage) {
    return getApprovedNextStepsRoute(context);
  }

  return ROUTES.DECISION_DASHBOARD_PAGE;
};

const _journeyHDNextSteps = (context:JourneyContext):JourneyPath => {
  const { hdPolicy } = context;
  // go to thank you if paid
  if (hdPolicy.isInitialPaymentComplete) {
    return getRouteWithUserType(ROUTES.APPROVED_THANK_YOU, context.currentUser);
  }

  return getRouteWithUserType(ROUTES.COMBINED_CHECKOUT_HD, USER_TYPES.PRIMARY);
};

export const getApprovedNextStepsRoute = (context:JourneyContext) => {
  return _journeyHDNextSteps(context);
};
