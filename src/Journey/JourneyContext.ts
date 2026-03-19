import moment from 'moment';
import { skipPhoneNumberPage } from '../NewActions/session';
import { getCurrentDisclosureID, getCurrentDisclosureSectionID, getCurrentDisclosure, DisclosureSection } from '../Selectors/disclosure';
import { getMainProduct, getAppUnderwritingMethod, getAppBuyingMethod } from '../Selectors/helpers/productApp';
import { hasFreeMonthsDiscount } from '../Selectors/helpers/productSession';
import { isQuebecHousehold } from '../Selectors/household';
import { isInExternalAdvisorMode } from '../Selectors/productApp';
import { isPartnerSameAddress } from '../Selectors/jointMetadata';
import { getPreAppMainProduct, showApplicationResources } from '../Selectors/metadata';
import { getUserSlice, isJoint, hasDependents, isMortgageBroker, isPolicymePartner, getDashboardUser, isDigitalConsentJourney, isLoggedInUser } from '../Selectors/userControl';
import { BCL_TRUSTEE_RELEASE_DATE, PM_ENABLE_DEFAULT_MONTHLY_PAYMENT } from '../config';
import { USER_TYPES, EXPERIENCE_LEVEL, ProductType, PM_PRODUCT_PREFIX } from '../utils/const';
import { transformUserKey } from '../utils/helpers';
import { JourneyContext, PolicyContext } from './types';
import { canSkipDecisionPage, completedJointNeedsAssesment, completedNeedsAssesment, doesAppIdExist } from '../Selectors/session';
import { isCAAEnvironment } from '../tenant/helpers';

/**
 * This function is necessary because disclosure.sections in redux does not
 * maintain an up-to-date list of question_ids. Here, we dynamically calculate
 * the sections based on the contents of disclosure.order and disclosure.disclosures,
 * which are kept up-to-date.
 */
const calculateDisclosureSections = (userSlice:any):DisclosureSection[] => {
  const { order, disclosures } = userSlice.disclosure;
  const sections:DisclosureSection[] = Array(4).fill(null);
  order.forEach((questionId:number) => {
    const sectionId = disclosures[questionId].section_id;
    if (!sections[sectionId]) {
      sections[sectionId] = { id: sectionId, question_ids: [] };
    }
    sections[sectionId].question_ids.push(questionId);
  });
  return sections;
};

export const getContextHash = (context:JourneyContext):string => {
  return JSON.stringify(context);
};

const getPolicyContext = (userSlice, productType:ProductType):PolicyContext => {
  const policySlice = userSlice[`${productType}Policy`];
  return {
    isInitialPaymentComplete: policySlice.payment_initial_completed,
    isSignatureComplete: policySlice.policy_document_signature_completed,
    isAddonsComplete: policySlice.add_ons_completed,
    isBeneficiariesComplete: policySlice.beneficiaries_completed,
    effectiveDate: policySlice.effective_date,
  };
};

export const getContextDiff = (
  prevContext:JourneyContext,
  nextContext:JourneyContext,
):Partial<JourneyContext> => {
  if (!prevContext) {
    return nextContext;
  }
  const diff:Partial<JourneyContext> = {};
  Object.keys(nextContext).forEach((key:string) => {
    if (prevContext[key] !== nextContext[key]) {
      diff[key] = nextContext[key];
    }
  });
  return diff;
};

export const getJourneyContext = (state:any):JourneyContext => {
  // Using dashboardUser rather than currentUser, because they're the same in all
  // cases where we want to use currentUser, and when they're different, we want
  // to use dashboardUser.
  const currentUser = getDashboardUser(state);
  const mainProduct = getMainProduct(state, currentUser);
  const [userType, key] = transformUserKey(currentUser);
  const userSlice = getUserSlice(state, userType, key);
  const { order } = userSlice.disclosure;
  const { hasPartner, hasKids } = state.primary.household;
  const hasFreeMonthHd = hasFreeMonthsDiscount(state, USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD);
  const skipPaymentFrequencyPage = hasFreeMonthHd || PM_ENABLE_DEFAULT_MONTHLY_PAYMENT === '1';
  const completedNeedsAssessment =
    (!isJoint(state) && completedNeedsAssesment(state, USER_TYPES.PRIMARY, mainProduct)) ||
    completedJointNeedsAssesment(state, mainProduct);
  const needsAssessmentStartedAfterStartApp = state.metadata.needsAssessmentStartedAfterStartApp;
  const hasHadMaxEligibilityIssue = false;
  // CRO-1511: This is one day after the release date of the BCL trustee release in prod
  // Trustee flow is hidden until one day after prod release so we can be
  // consistent with inprogress applications
  const isAfterTrusteeReleaseDate = moment().utc().isSameOrAfter(moment(BCL_TRUSTEE_RELEASE_DATE, 'DD/MM/YYYY').utc());

  return {
    currentUser,
    mainProduct,
    hasPartner,
    hasKids,
    preAppMainProduct: getPreAppMainProduct(state),
    isJoint: isJoint(state),
    hasDependents: hasDependents(state),
    underwritingMethod: getAppUnderwritingMethod(state, currentUser, mainProduct),
    hdSessionId: state.primary.session.hd_session_id,
    hdPolicyId: state.primary.session.hd_policy_id,
    hdPolicy: getPolicyContext(userSlice, PM_PRODUCT_PREFIX.HD),
    hdBuyingMethod: getAppBuyingMethod(state, currentUser, PM_PRODUCT_PREFIX.HD),
    hasExistingPolicies: state.metadata.existingPolicies?.hasExistingPolicies,
    hasPreExistingPhoneNumber: skipPhoneNumberPage(state),
    isPartnerSameAddress: isPartnerSameAddress(state),
    isMortgageBroker: isMortgageBroker(state),
    hasLeadSource: state.metadata.user_lead_source !== '',
    otpAuthorised: state.primary.session.auth_otp_authorized,
    isQuebecApplication: isQuebecHousehold(state),
    needsAdvice: state.metadata.experienceLevel === EXPERIENCE_LEVEL.NOVICE,
    skipPaymentFrequencyPage,
    isMakingDecisionRequests: state.metadata.isMakingDecisionRequests,
    isFromBlog: state.metadata.fromBlog,
    isAppStarted: doesAppIdExist(state, currentUser),
    isAppSubmitComplete: state.metadata.isAppSubmitComplete,
    isPolicymePartner: isPolicymePartner(state),
    canSkipDecisionPage: canSkipDecisionPage(state),
    showApplicationResources: showApplicationResources(state),
    isPostDecision: state.metadata.isPostDecision || state.metadata.fromDocusign,
    isforceRedoStartApp: state.metadata.isforceRedoStartApp,
    isCAAEnvironment: isCAAEnvironment(),
    isDigitalConsentJourney: isDigitalConsentJourney(state),
    isLoggedInUser: isLoggedInUser(state),
    completedNeedsAssessment,
    needsAssessmentStartedAfterStartApp,
    externalAdvisorMode: isInExternalAdvisorMode(state),
    hasHadMaxEligibilityIssue,
    isAfterTrusteeReleaseDate,

    // Disclosure stuff
    disclosureOrder: order,
    disclosureSections: calculateDisclosureSections(userSlice),
    currentDisclosureId: getCurrentDisclosureID(state),
    currentDisclosureSectionId: getCurrentDisclosureSectionID(state),
    primaryDisclosuresAnswered: state.metadata.primary.disclosuresAnswered,
    secondaryDisclosuresAnswered: state.metadata.secondary.disclosuresAnswered,
    currentDisclosure: getCurrentDisclosure(state),
  };
};
