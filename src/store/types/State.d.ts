import { LOCALE } from '@policyme/global-libjs-utils';
import { Moment } from 'moment';
import { BuyingMethod, InsuranceOwnershipType, JointUserType, ProductType, UnderwritingMethod } from '../../utils/const';
import { GROUP_NAMES } from '../../tenant/consts';
import { SSO_CONNECTION_VALUE } from '../../constants/socialSignOn';

export interface State {
    primary: Primary
    secondary: Secondary
    dependents: Dependents
    partnerDisclosure: PartnerDisclosure
    metadata: Metadata
    jointMetadata: JointMetadata
    debug: {}
    userControl: UserControl
    router: Router
  }

export interface Primary {
    household: Household
    session: Session
    disclosure: Disclosure
    payment: Payment
    quotes: Quotes
    hdSession: HdSession
    hdDecision: HdDecision
    hdApp: HdApp
    hdPolicy: HdPolicy
    hasPreExistingPhoneNumber: boolean
  }

export interface ProductAppCommonStates {
  product_added: boolean
  buying_method: BuyingMethod | '' // default state
  underwriting_method: UnderwritingMethod
  external_advisor_id: string
  insurance_ownership_type: InsuranceOwnershipType
}

export interface PartnerDisclosure {
    disclosures: Disclosures
    order: any[]
    sections: any[]
    submitted: boolean
  }

export interface Household {
    email: string
    isValidEmail: boolean
    firstName: string
    lastName: string
    hasPartner: boolean
    partnerAge: string
    partnerGender: string
    userIncome: string
    userIncomeOverride: string
    userGender: string
    hasSavings: string
    partnerIncome: string
    partnerIncomeOverride: string
    hasDebts: boolean
    residenceType: string
    birthdate: string
    smoke: boolean
    health: string
    phone: string
    hasKids: string
    kids: any[]
    nonRetirementSavings: string
    retirementSavings: string
    useSavingsForCI: boolean
    assetsTotOverride: string
    creditCards: string
    linesOfCredit: string
    homeEquityLoans: string
    mortgage: number
    otherDebt: string
    studentLoans: string
    debtsTotOverride: string
    hasExistingCoverage: string
    address_line1: string
    address_line2: string
    city: string
    country: string
    postal_code: string
    province: string
    healthcard_province: string
    existingCoverage: ExistingCoverage
    user_family_composition: string
    application_language: typeof LOCALE[keyof typeof LOCALE];
  }

export interface ExistingCoverage {
    spouse: Spouse
    user: User
  }

export interface Spouse {
    group: string
    individual: string
  }

export interface User {
    group: string
    individual: string
  }

export interface Session {
    household_id: string
    household_id_vers: number
    hd_session_id: string
    hd_application_id: string
    hd_policy_id: string
    hd_family_id: string
    aura_session_id: string
    promo_code: string
    auth_num_attempts_remaining: string
    auth_num_otp_attempts_remaining: string
    auth_otp_authorized: string
    auth_medium: string
    auth_validate_email_phone: string
    auth_verify_access_code: string
    helcim_customer_code: string
    twilio_token: string
    user_id: number
    account_id: string
  }

export interface Disclosure {
    disclosures: Disclosures
    order: any[]
    sections: any[]
    submitted: boolean
  }

export interface Disclosures {}

export interface Payment {
    cardFirstName: string
    cardLastName: string
    cardNumber: string
    cardExpiryMonth: string
    cardExpiryYear: string
    cardCVV: string
    planType: string
    errorMessage: string
    pmHelcimAttempt: number
    useDefaultAddress: boolean
    address: Address
    stripeCustomerID: string
    setupIntentClientSecret: string
    stripeSubscriptionID: StripeSubscriptionId
    stripePaymentMethodID: string
    stripePaymentComplete: StripePaymentComplete
  }

export interface Address {
    address_line1: string
    address_line2: string
    city: string
    province: string
    country: string
    postal_code: string
  }

export interface StripeSubscriptionId {
  }

export interface StripePaymentComplete {
    hd: boolean
  }

export interface Quotes {
    hd: Hd
  }

export interface QuoteBreakdown {
    annual: QuoteDate[]
    monthly: QuoteDate[]
  }

export interface QuoteDate {
    end_date: string
    end_idx: number
    start_date: string
    start_idx: number
    value: number
  }

export interface UserQuotes {}

export interface RecmdQuotes {}

export interface MaxCovQuotes {}

export interface NoMedicalQuotes {}

export interface Hd {
    userQuotes: UserQuotes
    recmdQuotes: RecmdQuotes
    maxCovQuotes: MaxCovQuotes
    noMedicalQuotes: NoMedicalQuotes
    discountCodes: string[]
  }

export interface Individual {
    mn_prems: number
    plan_type: string
    is_discounted: boolean
    selected: boolean
  }

export interface HdSession {
    selected_quote: string
    selected_term: string
    term: string
    override_amt: string
    selected_quote_type: number
    joint_role: number
    max_eligible_coverage: string
    plan_type: string
    determine_plan: any
    prescription_drug_flag: any
    losing_benefits: any
    existing_hd_plan_flag: boolean
    existing_hd_plan_option: string
    coverage_fit_flag: string
    recmd_cov_amt?: string
    cov_type?: string
  }

export interface HdDecision {
    active_decision: string
    initial_decision: string
    policy_status: string
    aps_field_required_flag: string
    mvr_required_flag: string
    nurse_visit_required_flag: string
    aura_uw_decision_error_flag: string
    risks: any[]
    smoking_discrepancy_flag: boolean
    uw_total_debits: number
    uw_flat_extra_debits: number
    active_maximum_eligible_coverage: any
    exclusions: any
    overall_decision: string
  }

export interface HdApp extends ProductAppCommonStates {
  birthplace: string
  birthplace_provstate: string
}

export interface HdPolicy {
    applicationDate: string
    payment_initial_completed: boolean
    payment_recurring_completed: boolean
    policy_document_signature_completed: boolean
    exclusions_flag: boolean
    coverage_amount: any
    annual_premiums_applied: string
    discounts: Discount[]
    coverageAmount: any
    term: any
    quote_breakdown: QuoteBreakdown
    add_ons_completed: boolean
    digital_consent_status: string
    hbm_status: any
    effective_date: EffectiveDate
  }

export interface Discount {
    discountCode: string
    hasFreeMonths: boolean
  }

export interface EffectiveDate {
    date: Moment
    formattedDate: string
  }

export interface Secondary {
    household: Household
    session: Session
    disclosure: Disclosure
    payment: Payment
    quotes: Quotes
    hdSession: HdSession
    hdDecision: HdDecision
    hdApp: HdApp
    hdPolicy: HdPolicy
    hasPreExistingPhoneNumber: boolean
  }

export interface Dependents {
    dependent_keys: string[]
    dependents: {}
  }
export interface Decision {
    active_decision: string
    initial_decision: string
    policy_status: string
    aps_field_required_flag: string
    mvr_required_flag: string
    nurse_visit_required_flag: string
    aura_uw_decision_error_flag: string
    risks: any
    smoking_discrepancy_flag: boolean
    uw_total_debits: number
    active_maximum_eligible_coverage: string
    exclusions: any
  }

export interface MetadataPerson {
  hasPreExistingPhoneNumber: boolean
  disclosuresAnswered: Array<keyof Disclosure>
  applications_links_created: boolean,
  accRatedCallbackRequested: boolean,
  /**
   * This is the price info that the user sees on the payment summary page.
   * This info is used to alert in sentry when there is a price discrepancy between
   * what the user sees and what the quote engine in the BE calculates.
   */
  userViewedPriceInfo: {
    isExclusivePerkDiscountApplied: boolean,
    isJointDiscountApplied: boolean,
    jointDiscountSavingsApplied: number,
    septemberTLDiscountSavingsApplied: number,
    isSeptemberTLDiscountApplied: boolean,
    totalMonthlyNonDiscountedPrice: {
      hd: number,
    },
    isCaaDiscountApplied: boolean,
    caaDiscountSavingsApplied: number,
    isFamilyDiscountApplied: boolean,
    familyDiscountSavingsApplied: number,
  }
}

export interface Airmiles {
  optionSelected: 'Y' | 'N';
  number: string;
}

export interface Metadata {
    isforceRedoStartApp: boolean;
    initialized: boolean
    paymentSliderDown: boolean
    redirectedTo: string
    isLoading: boolean
    hasError: boolean
    error: any
    hasCustomError: boolean
    currRoute: string
    backPressed: boolean
    forwardPressed: boolean
    isQuoting: boolean
    fromQuoteCompare: boolean
    fromStartApp: boolean
    fromDocusign: boolean
    fromDropJourney: boolean
    fromAccounts: boolean
    dateTime: string
    question: string
    isContactModalOpen: boolean
    name: string
    isConfirmationOpen: boolean
    debugFlag: boolean
    suggestedEmail: any
    emailIsDeliverable: boolean
    hasLocalHistory: boolean
    sentEappsMessage: boolean
    isChatbotInitialized: boolean
    user_lead_source: string
    user_lead_source_other: string
    fbInitFlag: boolean
    fbEventQueue: any[]
    abTestBand: string
    segmentBlocked: boolean
    docusignUrlStatus: string
    utm_global_id: string
    utm_tracking_id: string
    docusignSource: number
    experienceLevel: string
    isJoint: string
    isPartnerFormComplete: boolean
    verifiedEmails: any[]
    hasCheckedSecondaryApp: boolean
    eappValidateValue: string
    eappValidateMedium: string
    eappValidateShortCode: string
    app_insurer_url: string
    numValidateAttemptsRemaining: number
    hasSubmittedSecondaryApp: boolean
    hasSubmittedABTestData: boolean
    isSearchLoading: boolean
    consentMIBPull: boolean
    consentPrivacyPolicy: boolean
    decisionLoadingStep: number
    isMakingDecisionRequests: boolean
    isAppSubmitComplete: boolean
    decisionHasBeenMade: boolean
    isComingFromConsentPage: boolean
    selectedApprovedSteps: boolean
    hasEligibilityIssue: boolean
    ineligibleUser: any
    abRequestInFlight: boolean
    konami: boolean
    is_download_policy_journey: boolean
    advisor_id: number | ''
    advisor_full_name: string
    secondary_submitted: boolean
    syncNurseVisitClickRate: string
    noMedicalClickRateStatus: string
    documentReferrer: string
    initialWindowLocationHref: string
    locationHistory: string[]
    fromPrimaryUser: boolean
    blockPrimaryPages: boolean
    smq_quote_num: string
    smq_mn_prems: string
    smq_secondary_mn_prems: string
    association_complete: boolean
    isFirstRendering: boolean
    isCurrentlyHydratingData: boolean
    completedStartApp: boolean
    hasInProgressPolicy: boolean
    finishedHydrating: boolean
    primary: MetadataPerson
    secondary: MetadataPerson
    fromBlog: boolean
    productDocusign: string
    docusignCallbackType: string
    primaryReviewEsignCompleted: boolean
    secondaryReviewEsignCompleted: boolean
    dealLinkProductType: string
    currentUser: string
    isShadowAccountStartApp: boolean
    allowNoAppIdStartapp: boolean
    closePolicyFlag: boolean
    authorizedCitizenship: boolean
    existingPolicies: {
      hasExistingPolicies: string | boolean
      hasReplacingPolicies: boolean
      hasPendingPolicies: string | boolean
      existingPoliciesPendingKeepingFlag: any
    }
    planTypeStartApp: string
    navbarFirstName: string
    navbarLastName: string
    defaultPlanSlide: string
    isCypressStripeForm: boolean
    isRebrandDesignEnabled: boolean
    forceDocusignJourney: boolean
    utm_source: string
    utm_extras: UtmExtras
    prevRoute: string
    preAppMainProduct: ProductType | ''
    hasPreExistingPhoneNumber: boolean
    isBeforeUnloadEnabled: boolean
    productInterest: string
    userIntent: string
    confirmationHeader?: string;
    confirmationBodyText?: string;
    externalAdvisorMode: boolean
    purchaseMode: boolean
    emailRefVers: unknown
    sendAnalyticsCb: unknown
    isBookingAdvisorReview: unknown | boolean;
    docusignUrl: string
    docusignEvent: unknown
    savings: unknown
    postAppMainProduct: ProductType | ''
    needsAssessmentStartedAfterStartApp: boolean
    marketingCommunicationsConsent: boolean
    airmiles?: Airmiles
    isStripeDebugMode: boolean
    login_method: SSO_CONNECTION_VALUE
    auth0Resp: string
}

export interface UtmExtras {}

export interface JointMetadata {
    showFinancialDifficulties: string
    showResidencyAppliedPermRes: string
    showResidencyDomesticWorker: string
    showResidencyPhysician: string
    showResidencySkilledWorker: string
    showLicense: string
    showLicenseSuspended: string
    user_partner_same_address_flag: string
    user_partner_same_interview: boolean
    has_done_blood_urine_height_weight: string
  }

export interface UserControl {
    affiliateId: string
    currentUser: string
    hasPartnerApplication: boolean
    availableProducts: string[]
    dashboardUser: JointUserType
    affiliate: Affiliate
    isHealthAndDental: boolean
    theme: string
    hd_quotes: HdQuotes
  }

export interface Affiliate {
  affiliateName: string
  group_name: typeof GROUP_NAMES[number] | null
}

export interface HdQuotes {
    dental_secure: HDPlanQuote
    enhanced: HDPlanQuote
    essential: HDPlanQuote
    standard: HDPlanQuote
  }

export interface HDPlanQuote {
    is_discounted: boolean
    mn_prems: number
    original_mn_prems: number
    has_add_on: boolean
    selected: boolean
  }

export interface Router {
    location: RouterLocation
    action: string
  }

export interface RouterLocation {
    pathname: string
    search: string
    hash: string
    key: string
    query: Query
  }

export interface Query {}
