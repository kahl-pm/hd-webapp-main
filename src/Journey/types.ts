import type { IntlShape } from 'react-intl';
import type { BuyingMethod, JourneyIngressPoint, ProductType, UnderwritingMethod, UserType } from '../utils/const';
import type { Disclosure, DisclosureSection } from '../Selectors/disclosure';

export type JourneyPath = string;
export type JourneyStep = {
  paths: JourneyPath[],
  canSkip: boolean,
};
export type JourneyContextPredicate = (context:JourneyContext) => boolean;
export type JourneyConditionalPath = { if: JourneyContextPredicate, path: JourneyPath };
export type JourneyStepDefinition = Array<JourneyPath | JourneyConditionalPath>;

export interface JourneyStepWithOptions {
  paths: Array<JourneyPath | JourneyConditionalPath>,
  canSkip?: JourneyContextPredicate;
}
export interface JourneyDefinition {
  name: string;
  steps: Array<JourneyStepDefinition | JourneyStepWithOptions | JourneyConstructor>;
  ingressPoints?: Record<JourneyIngressPoint, JourneyPath>;
}
export type JourneyConstructor = (context:JourneyContext) => Journey;

export type PolicyContext = {
  isInitialPaymentComplete: boolean;
  isSignatureComplete: boolean;
  isAddonsComplete: boolean;
  isBeneficiariesComplete: boolean;
  effectiveDate?: string;
}

/**
 * This is the minimum required state to select the correct Journey.
 * Keep this as small as possible! The bigger it is, the more often
 * we will need to recalculate the Journey. Remove things if/when you can!
 */
export interface JourneyContext {
  currentUser: UserType,
  mainProduct: ProductType;
  preAppMainProduct: ProductType;
  isJoint: boolean;
  hasDependents: boolean;
  hasPartner: boolean;
  hasKids: boolean;
  underwritingMethod: UnderwritingMethod;
  hdSessionId: string;
  hdPolicyId: string;
  hdPolicy: PolicyContext;
  hdBuyingMethod: BuyingMethod;
  hasExistingPolicies: boolean;
  hasPreExistingPhoneNumber: boolean;
  isPartnerSameAddress: boolean;
  isMortgageBroker: boolean;
  hasLeadSource: boolean;
  otpAuthorised: boolean;
  isQuebecApplication: boolean;
  needsAdvice: boolean;
  skipPaymentFrequencyPage: boolean;
  isMakingDecisionRequests: boolean;
  isFromBlog: boolean;
  isAppStarted: boolean;
  isAppSubmitComplete: boolean;
  isPolicymePartner: boolean;
  canSkipDecisionPage: boolean;
  showApplicationResources: boolean;
  isPostDecision: boolean;
  isforceRedoStartApp: boolean;
  isDigitalConsentJourney: boolean;
  isCAAEnvironment: boolean; // TODO: Figure out a better way to tenantise Journeys
  isLoggedInUser: boolean;
  completedNeedsAssessment: boolean;
  needsAssessmentStartedAfterStartApp: boolean;
  externalAdvisorMode: boolean;
  hasHadMaxEligibilityIssue: boolean;
  // CRO-1511: This is one day after the release date of the BCL trustee release in prod
  // Trustee flow is hidden until one day after prod release so we can be
  // consistent with inprogress applications
  isAfterTrusteeReleaseDate: boolean;

  // Disclosure stuff
  disclosureOrder: number[];
  disclosureSections: DisclosureSection[];
  currentDisclosureId: number;
  currentDisclosureSectionId: number;
  primaryDisclosuresAnswered: number[];
  secondaryDisclosuresAnswered: number[];
  currentDisclosure: Disclosure;
}

export interface Journey {
  name: string;
  getFirstPage: () => JourneyPath;
  getIngressPage: (ingressPoint:JourneyIngressPoint) => JourneyPath;
  getNextPage: (pathname:JourneyPath) => JourneyPath;
  getSteps: () => JourneyStep[];
}
