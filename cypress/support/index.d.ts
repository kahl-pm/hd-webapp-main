import { EditBeneficiaries } from './Types/input';

type BloodPressureInput = {
  systolic: string;
  diastolic: string;
};

type TextValueInput = {
  text: string;
  value: string;
}

type AuthorizeInput = {
  life?: boolean;
  ci?: boolean;
  seeMyDecision?: boolean;
  testGoBackBlocker?: boolean;
  isDigitalConsent?: boolean;
}

type BooleanString = 'Y' | 'N';

type CustomMountOptions = {
  theme?:string;
  reduxStore:import('redux').Store<any, import('redux').AnyAction>;
  routerProps?:import('react-router').MemoryRouterProps;
  tenantSlots?:any;
} & import('cypress/react18').MountOptions;

type PrimaryQuotesUrlParams = {
  desiredCoverageAmountSliderValue: string;
  desiredTermLength: string;
  birthdate: string;
  gender: string;
  smoker: string;
  province: string;
}

type SecondaryQuotesUrlParams = {
  partnerBirthdate: string;
  partnerGender: string;
  partnerSmoker: string;
}
declare global {
  namespace Cypress {
    interface Chainable {

      /**
       * Registers which test case is running for later use in logging
       * @param testCase test case number
       */
      TestCase(testCase: number): Chainable<Element>

      /**
       * Checks the number of simplified life applications and policies created
       * @param number_of_application_created number of applications created
       * @param number_of_policies_created number of policies created
       */
      CheckSimplifiedLife(number_of_application_created: number, number_of_policies_created: number): Chainable<Element>

      /**
       * Logs a message that signifies a specific behaviour that can affect ITT validation logic
       * @param message the ITT_BEHAVIOUR_MESSAGE to log
       * @param value optional value to log
       */
      LogBehaviour(
        message: import('./constants').ITTBehaviourMessage,
        value?: string
      ): Chainable<Element>

      /**
       * Logs the tenant id so that ITT can read it
       * @param tenantId the tenant id
       */
      LogTenant(tenantId: string): Chainable<Element>

      /**
       * linkRoutes
       */
      linkRoutes(): Chainable<Element>

      /**
       * setABTest
       * @param isCaa
       * @param testBand
       */
      setABTest(isCaa?: boolean, testBand?: string): Chainable<Element>

      /**
       * LogEmail
       * @param email email address
       * @param testCase test case number. If empty, will use what was set by TestCase command.
       * @param userType user type
       */
      LogEmail(email: string, testCase?: number, userType?: string): Chainable<Element>

      /**
       * UserIntent
       * @param userIntent user intent string
       */
      UserIntent(userIntent: string,
        skipNext?: boolean,
        skipSegment?: boolean,
        product_type?: import('../../src/Selectors/helpers/productApp').ProductPrefix,
      ): Chainable<Element>

      /**
       * ExpertQuotes
       * @param dob date of birth
       * @param gender gender string
       * @param isSmoker smoker flag
       * @param province province string
       * @param isCaa is CAA flag
       */
      ExpertQuotes(
        dob: string,
        gender: string,
        isSmoker: boolean,
        province: string,
        isCaa?: boolean,
        caaMemberChoice?: BooleanString,
      ): Chainable<Element>

      /**
       * ExpertQuotesJoint
       * @param dob date of birth
       * @param gender gender string
       * @param isSmoker smoker flag
       * @param province province string
       * @param dobSecondary date of birth
       * @param genderSecondary gender string
       * @param isSmokerSecondary smoker flag
       * @param provinceSecondary province string
       * @param isCaa is CAA flag
       */
      ExpertQuotesJoint(
        dob: string,
        gender: string,
        isSmoker: boolean,
        province: string,
        dobSecondary: string,
        genderSecondary: string,
        isSmokerSecondary: boolean,
        provinceSecondary: string,
        isCaa?: boolean,
      ): Chainable<Element>

      /**
       * DesiredCoverage
       * @param coverageAmountSliderIndex index of the coverage amount slider
       * @param termLength term length string
       */
      DesiredCoverage(coverageAmountSliderIndex: number, termLength: string): Chainable<Element>

      /**
       * DesignSystemDesiredCoverage
       * @param coverageAmountSliderAmount amount for the coverage amount slider
       * @param termLength term length string
       */
      DesignSystemDesiredCoverage(
        coverageAmountSliderIndex: number, termLength: string): Chainable<Element>

      /**
       * StartApp
       * @param firstName first name
       * @param lastName last name
       * @param email email address
       * @param experience experience string
       * @param product product type
       * @param requiresHydrationAtThisStep requires hydration at this step
       * @param isPerm is perm
       * @param fromJourney from journey
       * @param isSocialSignOnEnabled is social sign on enabled
       */
      StartApp(
        firstName: string,
        lastName: string,
        email: string,
        experience: string,
        product: import('../../src/utils/const').ProductType,
        requiresHydrationAtThisStep?: boolean,
        isPerm?: boolean,
        fromJourney?: boolean,
        isSocialSignOnEnabled?: boolean,
      ): Chainable<Element>

      /**
       * JointStartApp
       * @param firstName first name
       * @param lastName last name
       * @param email email address
       * @param firstNameSecondary first name
       * @param lastNameSecondary last name
       * @param product product type
       */
      JointStartApp(
        firstName: string,
        lastName: string,
        email: string,
        firstNameSecondary: string,
        lastNameSecondary: string,
        product: import('../../src/utils/const').ProductType,
        fromJourney?: boolean,
        isSocialSignOnEnabled?: boolean,
      ): Chainable<Element>

      /**
       * BasicDetails
       * @param firstName first name
       * @param lastName last name
       * @param partnerFirstName partner first name
       * @param partnerLastName partner last name
       */
      BasicDetails(
        firstName: string,
        lastName: string,
        partnerFirstName?: string,
        partnerLastName?: string,
      ): Chainable<Element>

      /**
       * FullAddress
       * @param address Full address object
       */
      FullAddress(address: import('./Types/input').Address): Chainable<Element>

      /**
       * FullAddressJoint
       * @param sameAddress same address
       * @param address Full address object
       */
      FullAddressJoint(sameAddress: string, address: import('./Types/input').Address): Chainable<Element>

      /**
       * BirthLocation
       * @param country country string
       * @param provinceState province or state string
       */
      BirthLocation(country: string, provinceState: string): Chainable<Element>

      /**
       * BirthLocation
       * @param country country string
       * @param provinceState province or state string
       * @param countrySecondary country string
       * @param provinceStateSecondary province or state string
       */
      BirthLocationJoint(
        country: string,
        provinceState: string,
        countrySecondary: string,
        provinceStateSecondary: string,
      ): Chainable<Element>

      /**
       * EmploymentIncomeAnnualJoint
       * @param annualIncome annual income string
       * @param partnerAnnualIncome partner annual income
       */
      EmploymentIncomeAnnualJoint(
        annualIncome?: string,
        partnerAnnualIncome?: string,
      ): Chainable<Element>

      /**
       * LogSessionID
       * @param sessionID session ID. If empty, will use what was set by TestCase command.
       * @param userType user type
       */
      LogSessionID(sessionID?: number, userType?: string): Chainable<Element>

      /**
       * LogCISessionID
       * @param sessionID session ID. If empty, will use what was set by TestCase command.
       * @param userType user type
       * @param isCrossSell adds a suffix for itt
       */
      LogCISessionID(sessionID?: number,
      userType?: string,
        isCrossSell?: boolean,
      ): Chainable<Element>

      /**
       * ExistingPoliciesJoint
       * @param hasExistingPolicies has existing policies flag
       */
      ExistingPoliciesJoint(hasExistingPolicies: import('./Types/input').BooleanString): Chainable<Element>

      /**
       * PMPendingPolicies
       * @param hasPendingPolicies has pending policies flag
       * @param willKeepPolicies will keep policies flag
       * @param pendingPolicies list of pending policies
       */
      PMPendingPolicies(
        hasPendingPolicies: import('./Types/input').BooleanString,
        willKeepPolicies: import('./Types/input').BooleanString,
        pendingPolicies: import('./Types/input').PendingPolicy[]
      ): Chainable<Element>

      /**
       * CommonPrimaryBeneficiaries
       * @param chooseBeneficiaries chooseNow or chooseLater
       */
      CommonPrimaryBeneficiaries(chooseBeneficiaries: 'chooseNow' | 'chooseLater'): Chainable<Element>

      /**
       * CommonSecondaryBeneficiaries
       * @param hasSecondaryBeneficiary has secondary beneficiary flag
       * @param hasSecondaryBeneficiaryForPrimaryUser secondary beneficiary for primary user flag
       * @param hasSecondaryBeneficiaryForSecondaryUser secondary beneficiary for secondary userflag
       * @param hasPartner has partner flag
       */
      CommonSecondaryBeneficiaries(
        hasSecondaryBeneficiary?: boolean,
        hasSecondaryBeneficiaryForPrimaryUser?: boolean,
        hasSecondaryBeneficiaryForSecondaryUser?: boolean,
        hasPartner?: boolean,
      ): Chainable<Element>

      /**
       * PartnerEmail
       * @param secondaryEmail email string
       */
      PartnerEmail(secondaryEmail: string): Chainable<Element>

      /**
       * Contact
       * @param phoneNumber phone number string
       */
      Contact(phoneNumber: string): Chainable<Element>

      /**
       * Contact
       * @param phoneNumberPrimary phone number string
       * @param phoneNumberSecondary phone number string
       */
      ContactJoint(phoneNumberPrimary: string, phoneNumberSecondary: string): Chainable<Element>

      /**
       * Referrer
       * @param addReferrer add referrer flag
       * @param referrer referrer data
       * @param productType product type
       */
      Referrer(
        addReferrer: import('./Types/input').BooleanString,
        referrer: import('./Types/input').ReferrerData,
        productType: import('../../src/utils/const').ProductType,
      ): Chainable<Element>

      /**
       * Interest
       * @param hasInterest add interest flag
       * @param interest interest data
       * @param productType product type
       */
      Interest(
        hasInterest: import('./Types/input').BooleanString,
        interest: import('./Types/input').InterestData,
        productType: import('../../src/utils/const').ProductType,
      ): Chainable<Element>

      /**
       * SetCypressStripeForm
       * @param fromDocusign from docusign flag
       */
      SetCypressStripeForm(fromDocusign: boolean): Chainable<Element>

      /**
       * GetPrice
       * @param datacyTag data-cy tag of the element
       */
      GetPrice(datacyTag: string): Chainable<Element>

      /**
       * SegmentTrack
       * @param eventName
       * @param payload
       */
      SegmentTrack(eventName: string, payload: object): Chainable<Element>

      /**
       * Payment
       * Accepts an options object with sensible defaults for omitted keys.
       */
      Payment(options: {
        payment: import('./Types/input').Payment,
        billing: import('./Types/input').Billing,
        hasExclusivePerk?: boolean,
        isJoint?: boolean,
        productType?: import('../../src/utils/const').ProductType,
        isDigitalConsent?: boolean,
        hasCrossSell?: boolean,
        needsCiConfirmation?: boolean,
        setCypressStripeForm?: boolean,
        isPermLife?: boolean,
        isNSFPayment?: boolean,
      }): Chainable<Element>

      /**
       * digitalConsentAccountsCheckout
       * @param productType product type
       * @param app_id application ID
       */
      digitalConsentAccountsCheckout(
        productType: import('../../src/utils/const').ProductTypeFull,
        appId: string,
      ): Chainable<Element>

      /**
       * ApprovedThankYou
       * @param userType user type
       */
      ApprovedThankYou(
        userType: import('../../src/utils/const').UserType,
      ): Chainable<Element>

      /**
       * DecisionCardLifeAssertions
       */
      DecisionCardLifeAssertions(decisionState: import('../support/DecisionCardStates').DecisionCardStatesType, isConsented: boolean): Chainable<Element>

      /**
       * DecisionCardCiAssertions
       */
      DecisionCardCiAssertions(decisionState: import('../support/DecisionCardStates').DecisionCardStatesType, isConsented: boolean): Chainable<Element>

      /**
       * PrimaryBeneficiaries
       * @param beneficiaries list of beneficiaries
       * @param userType 'primary' or 'secondary'
       * @param hasModal confirm beneficiaries modal flag
       */
      PrimaryBeneficiaries(beneficiaries: import('./Types/input').Beneficiary[], userType: import('../../src/utils/const').UserType, hasModal?: boolean): Chainable<Element>

      /**
       * Interacts with a Select element
       * @param datacyTag data-cy tag of the Select
       * @param menuOption option to select
       * @param options options for the cy.get command
       */
      ClickInSelect(
        datacyTag: string,
        menuOption: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
      ): Chainable<Element>

      /**
       * Interacts with a Select element
       * @param datacyTag data-cy tag of the Select
       * @param menuOption option to select
       * @param options options for the cy.get command
       */
      DesignSystemClickInSelect(
        datacyTag: string,
        menuOption: string,
        options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
      ): Chainable<Element>

      /**
       * Interacts with a text input Select option
       * @param datacyTag data-cy tag of the Select
       * @param option option to type
       */
      TypeAndClickInSelect(datacyTag: string, option: string): Chainable<Element>

      /**
       * Interacts with a text input Select option (New Design System)
       * @param datacyTag data-cy tag of the Select
       * @param option option to type
       */
      DesignSystemTypeAndClickInSelect(datacyTag: string, option: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param choice choice text
       * @param userType primary or secondary
       */
      SingleChoiceRadio(
        question: string,
        choice: string,
        userType?: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * use for joint tests, specify userType
       * @param question question text
       * @param choice choice text
       * @param userType primary or secondary
       */
      SingleChoiceRadioJoint(
        question: string,
        choice: string,
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * for joint tests, specify userType
       * @param question question text
       * @param choices choices texts
       * @param userType user type
       */
      MultiChoiceJoint(
        question: string,
        choices: string[],
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * instead of writing SingleChoiceRadioJoint twice,
       * this function answers the question for both primary and secondary
       * @param question question text
       * @param priChoice primary choice text
       * @param secChoice secondary choice text
       */
      DoubleSingleChoiceRadio(question: string,
        priChoice: string,
        secChoice: string,
      ): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      SingleChoiceSelect(question: string, text: string): Chainable<Element>

      /**
       * for joint tests, specify userType
       * @param question question text
       * @param choices choices texts
       * @param userType user type
       */
      MultiChoice(
        question: string,
        choices: string[],
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      AvailableDateMonthYear(question: string, text: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      AvailableDateAge(question: string, text: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      AvailableDateMonths(question: string, text: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      AvailableDateExactDate(question: string, text: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param choice choice input
       * @param inputs input numbers
       * @param userType primary or secondary
       */
      AvailableUnit(
        question: string,
        choice: string,
        inputs: number[],
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * caused issues with solo tests, variation of AvailableUnit for joint apps
       * @param question question text
       * @param choice choice input
       * @param inputs inputs texts
       * @param userType primary or secondary
       */
      AvailableUnitJoint(
        question: string,
        choice: string,
        inputs: string[],
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text input text
       */
      NumericInput(question: string, text: string): Chainable<Element>

      /**
       * use for joint tests
       * @param question question text
       * @param text text input
       * @param userType primary or secondary
       */
      NumericInputJoint(
        question: string,
        text: string,
        userType: import('../../src/utils/const').UserType
      ): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param text text input
       */
      TextQuestionInput(question: string, text: string): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param inputs BloodPressure inputs
       */
      BloodPressure(
        question: string,
        inputs: BloodPressureInput[]
      ): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param inputs TextValue inputs
       */
      Percent(inputs: TextValueInput[]): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param inputs TextValue inputs
       */
      AmountQuestionInput(question: string, inputs: TextValueInput[]): Chainable<Element>

      /**
       * use for solo tests, userType = primary
       * @param question question text
       * @param options option strings
       */
      Search(question: string, options: string[]): Chainable<Element>

      /**
       * Authorize
       * @param input AuthorizeInput flags
       */
      Authorize(input: AuthorizeInput): Chainable<Element>

      /**
       * AuthorizeJoint
       * @param input AuthorizeInput flags
       */
      AuthorizeJoint(input: AuthorizeInput): Chainable<Element>

      /**
       * StartDisclosure
       */
      StartDisclosure(): Chainable<Element>

      /**
       * BackToDecision
       */
      BackToDecision(): Chainable<Element>

      /**
       * PrimarySteps
       */
      PrimarySteps(): Chainable<Element>

      /**
       * SecondarySteps
       */
      SecondarySteps(): Chainable<Element>

      /**
       * Waits for submit button to be enabled using exponential backoff strategy.
       * Progressive waits: 500ms, 1s, 2s, 4s, 8s
       * Then performs comprehensive validation and clicks the button.
       */
      waitForSubmitButtonAndClick(): Chainable<Element>

      /**
       * Automates the entire disclosure flow based on provided input
       * @param primaryInput Disclosure primaryInput
       * @param secondaryInput Disclosure secondaryInput
       */
      Disclosure(primaryInput: Partial<import('./Types/disclosures').Disclosure>, secondaryInput: Partial<import('./Types/disclosures').Disclosure>): Chainable<Element>

      /**
       * Send a request to the Portal API
       * @param body body object
       * @param endpoint endpoint path
       */
      SendPortalRequest(endpoint: string, body: any): Chainable<Cypress.Response<any>>

      /**
       * Syncs Hubspot
       * @param app_id application id
       */
      SyncHubspot(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Calls the Portal api to reset the payment steps
       * @param app_id application ID
       */
      ResetPaymentSteps(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Calls the Portal api to reset the digital consent steps
       * @param app_id application ID
       */
      ResetConsentSteps(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Calls the Portal api to reset the payment steps
       * @param app_id application ID
       */
      resetPaymentSteps(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Calls the Portal api to reset the digital consent steps
       * @param app_id application ID
       */
      resetDigitalConsent(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Calls the Portal api to trigger a nurse visit
       * @param app_id application ID
       */
      triggeSiliTriage(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * Logs expiration times for auth tokens
       * Useful for debugging flaky tests
       */
      LogTokens(): Chainable<void>

      /**
       * Set the tenant based on theme
       * @param theme theme name
       */
      setTenantConfigByTheme(theme: string): Chainable<void>

      /**
       * Sets the viewport resolution
       * @param size Either a string preset or an array of [width, height]
       */
      setResolution(size: [number, number] | string): Chainable<void>

      /**
       * Wrapper for Cypress.mount, injecting all our required providers
       */
      mount(jsx: import('react').ReactNode, options?: CustomMountOptions): Chainable<import('cypress/react18').MountReturn>

      /**
       * Returns the current tenant code
       */
      getTenantCode(): Chainable<import('@policyme/global-libjs-utils').TenantCodeType>

      /**
       * Validates digital consent document generation calls at checkout
       * @param productType product type
       * @param hasCrossSell whether this test has cross sell
       * @param isPermLife whether this test is for permanent life
       */
      DigitalConsentGeneration(
        product: import('../../src/utils/const').ProductType,
        hasCrossSell?: boolean,
        isPermLife?: boolean,
      ): Chainable<void>

      /**
       * Capture screenshots with Percy
       * @param name Name of the screenshot
       * @param widths optional array of widths to snapshot
       */
      percySnapshotWithBreakpoints(name: string, widths?: number[]): Chainable<void>

      /**
       * Calls the Portal api to settle the policy
       * @param app_id application ID
       */
      settlePolicy(app_id: string): Chainable<Cypress.Response<any>>

      /**
       * CAA Member Page
       * @param choice Choice for whether it is a CAA member or not
       * @param checkForFrenchToggle Check for the French toggle
       */
      CaaMember(choice: BooleanString, checkForFrenchToggle?: boolean): Chainable<Element>

      /**
       * Force docusign journey override regardless of digital consent flag
       */
      forceDocusignJourney(): Chainable<void>
      /**
       * Change Tenant Flag. Will set up a cy.intercept() to change the tenant flag. Must be placed
       * before cy.visit() so the HTML response can be intercepted properly.
       * @param urlPath URL path that is being visited
       * @param tenantFlag Tenant flag to change
       * @param flagValue Boolean value to set the flag to
      */
      ChangeTenantFlag(urlPath: string, tenantFlag: string, flagValue: boolean): Chainable<Element>

      /**
       * Get the error message text on the minor toggle element for beneficiaries
       */
      getBeneficiariesMinorToggleInputError(index: number, hasError: boolean): Chainable<Element>

      /**
       * Get quotes url
       */
      StartFromQuotesUrl(
        product: string,
        primaryUser: PrimaryQuotesUrlParams,
        secondaryUser?: SecondaryQuotesUrlParams,
        affiliate_id?: string,
        caa_discount?: string,
        isPermLifeEnabled?: string,
      ): Chainable<Element>

      /**
       * Geo Location Quebec
       */
      geoLocationQuebec(options: {
        continent: string,
        country: string,
        state: string,
        stateName: string,
      }): Chainable<Element>

      /**
       * See beneficiaries and edit post decision
       */
      SeeMyBeneficiariesPostDecision(
        userType: string,
        editBeneficiaries: EditBeneficiaries,
        isModal: boolean,
      ): Chainable<void>

      /**
       * This function is used automatically for ITT tests via cy.wait override
       * @param options Configuration options
       * @param options.alias The endpoint alias to wait for (e.g., '@accounts')
       * @param options.successCodes Array of acceptable HTTP status codes (default: [200])
       * @param options.maxFailures Maximum number of retries before failing (default: 3)
       * @param options.timeout Timeout in milliseconds (default: 30000)
       * @param options.responseTimeout Response timeout in milliseconds (default: 30000)
       * @param options.originalWaitFn The original cy.wait function (required, used internally to avoid circular calls)
       */
      waitForEndpointSuccess(options: {
        alias: string,
        successCodes?: number[],
        maxFailures?: number,
        timeout?: number,
        responseTimeout?: number,
        originalWaitFn: (subject: any, ...args: any[]) => Chainable<any>,
      }): Chainable<Element>

      /**
       * Check auraAuthorization interceptions with retry logic
       * @param expectedCount Expected number of interceptions (default: 2)
       * @param alias The Cypress alias to check (default: '@auraAuthorization')
       * @param maxRetries Maximum number of retry attempts (default: 5)
       * @param retryInterval Wait time between retries in milliseconds (default: 1000)
       */
      CheckAuraAuthorizationInterceptions(
        expectedCount?: number,
        alias?: string,
        maxRetries?: number,
        retryInterval?: number,
      ): Chainable<Element>
    }
  }
}
