import { hasValue, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import { SEGMENT_EVENTS, USER_TYPES } from '../../src/utils/const';
import { validateConsentCopy } from './ConsentText';
import {
  declinedQuestion, workQuestion, bankruptcyQuestion,
  statusInCanadaQuestion, heightQuestion, weightQuestion,
  weightChangeQuestion, travelQuestion, hazardousActivitiesQuestion,
  impairedDrivingQuestion, drivingViolationQuestion, criminalOffenseQuestion,
  tobaccoQuestion, alcoholQuestion, alcoholTreatmentQuestion,
  cannabisQuestion, drugsQuestion, familyHealthQuestion,
  personalHealthQuestion, healthConsultationQuestion,
} from './DisclosureQuestions';
import { ITT_BEHAVIOUR_MESSAGE } from './constants';
import { EXPECTED_CONSENT_VERSIONS as EXPECTED_AUTHORIZATION_CONSENT } from './ConsentText/AuthorizationConsent';
import { AURA_CONSENT_TYPES } from '../../src/utils/consentVersion';
import { Disclosure } from './Types/disclosures';

Cypress.Commands.add('getTenantCode', () => cy.window().then((win) => {
  const tenant = win.__policyme.TENANT.name;
  const tenantCode:TenantCodeType = TENANTS_NAME_CODES_MAPPING[tenant];
  return cy.wrap(tenantCode);
}));

Cypress.Commands.add('SingleChoiceRadio', (question, choice, userType = USER_TYPES.PRIMARY) => { // use for solo tests, userType = primary
  cy.task('log', `Single Choice radio: ${question}: answer: ${choice} userType: ${userType}`);
  cy.get(`[data-cy="single-choice-radio-${question}-${userType}-${choice}"]`)
    .scrollIntoView()
    .click({ force: true });
  cy.get('[data-cy=submit]:visible')
    .should('have.length', 1)
    .scrollIntoView()
    .click({ force: true });
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion'); // load next question
  cy.wait('@utm');
});

Cypress.Commands.add('SingleChoiceRadioJoint', (question, choice, userType) => { // for joint tests, specify userType
  cy.wait('@nextQuestion');
  cy.task('log', `Single Choice radio: ${question}: answer: ${choice} userType: ${userType}`);
  cy.get(`[data-cy="single-choice-radio-${question}-${userType}-${choice}"]`)
    .scrollIntoView()
    .click();
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@utm');
});

Cypress.Commands.add('MultiChoiceJoint', (question, choices, userType) => { // for joint tests, specify userType
  cy.wait('@nextQuestion');
  cy.task('log', `Multi Choice: ${question}: answer: ${JSON.stringify(choices)} userType: ${userType}`);
  choices.forEach((choice) => {
    cy.get(`[data-cy="${question}-${choice}-${userType}"]`)
      .click({ force: true }); // force:true needed due to being covered by a container
  });
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
});

// instead of writing SingleChoiceRadioJoint twice,
// this function answers the question for both primary and secondary
Cypress.Commands.add('DoubleSingleChoiceRadio', (question, priChoice, secChoice) => { // for joint tests, specify userType
  cy.wait('@nextQuestion');
  cy.task('log', `Single Choice radio: ${question}: answer: ${priChoice} userType: ${USER_TYPES.PRIMARY}`);
  cy.get(`[data-cy="single-choice-radio-${question}-${USER_TYPES.PRIMARY}-${priChoice}"]`)
    .should('have.length', 1)
    .scrollIntoView()
    .click();
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion'); // load next question
  cy.wait('@utm');

  cy.task('log', `Single Choice radio: ${question}: answer: ${secChoice} userType: ${USER_TYPES.SECONDARY}`);

  cy.get(`[data-cy="single-choice-radio-${question}-${USER_TYPES.SECONDARY}-${secChoice}"]`)
    .scrollIntoView();
  cy.get(`[data-cy="single-choice-radio-${question}-${USER_TYPES.SECONDARY}-${secChoice}"]`).should('exist').click();
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@utm');
});

Cypress.Commands.add('SingleChoiceSelect', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Single Choice select: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.ClickInSelect(`"single-choice-select-${question}-${USER_TYPES.PRIMARY}"`, text);
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('MultiChoice', (question, choices, userType = USER_TYPES.PRIMARY) => { // use for solo tests, userType = primary
  cy.task('log', `Multi Choice: ${question}: answer: ${JSON.stringify(choices)} userType: ${userType}`);
  choices.forEach((choice) => {
    cy.get(`[data-cy="${question}-${choice}-${userType}"]`)
      .click({ force: true });
  });
  cy.get('[data-cy=submit]')
    .last()
    .scrollIntoView();

  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableDateMonthYear', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Available date month year: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.DesignSystemClickInSelect(`"available-date-${question}-${USER_TYPES.PRIMARY}"`, 'Month And Year Of Event');
  cy.get(`[data-cy="dateQuestion-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableDateAge', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Available date age: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.ClickInSelect(`"available-date-${question}-${USER_TYPES.PRIMARY}"`, 'Your Age At Time Of Event');
  cy.get(`[data-cy="dateQuestion-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);
  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableDateMonths', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Available date months: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.ClickInSelect(`"available-date-${question}-${USER_TYPES.PRIMARY}"`, 'Months From Event');
  cy.get(`[data-cy="dateQuestion-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableDateExactDate', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Available date exact: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.ClickInSelect(`"available-date-${question}-${USER_TYPES.PRIMARY}"`, 'Exact Date of Event');
  cy.get(`[data-cy="dateQuestion-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);
  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableUnit', (question, choice, inputs, userType = USER_TYPES.PRIMARY) => { // use for solo tests, userType = primary
  cy.task('log', `Available Unit: ${question}: answer: ${JSON.stringify(inputs)} userType: ${userType}`);
  cy.DesignSystemClickInSelect(`"available-unit-${question}-${userType}"`, choice);

  inputs.forEach((input, index) => {
    cy.get(`[data-cy="unitized-input-${question}-${index}-${userType}"]`)
      .click()
      .type(String(input));
  });

  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('AvailableUnitJoint', (question, choice, inputs, userType) => { // caused issues with solo tests, variation of AvailableUnit for joint apps
  cy.wait('@nextQuestion');
  cy.task('log', `Available Unit: ${question}: answer: ${JSON.stringify(inputs)} userType: ${userType}`);
  cy.DesignSystemClickInSelect(`"available-unit-${question}-${userType}"`, choice);

  inputs.forEach((input, index) => {
    cy.get(`[data-cy="unitized-input-${question}-${index}-${userType}"]`)
      .click()
      .type(input);
  });

  cy.ScrollAndClickSubmit();
  cy.wait('@submitAnswer');
});

Cypress.Commands.add('NumericInput', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Numeric: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.get(`[data-cy="numeric-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);

  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('NumericInputJoint', (question, text, userType) => { // use for joint tests
  cy.task('log', `Numeric: ${question}: answer: ${text} userType: ${userType}`);
  cy.get(`[data-cy="numeric-input-${question}-${userType}"]`)
    .type(text);

  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('TextQuestionInput', (question, text) => { // use for solo tests, userType = primary
  cy.task('log', `Text: ${question}: answer: ${text} userType: ${USER_TYPES.PRIMARY}`);
  cy.get(`[data-cy="textQuestion-input-${question}-${USER_TYPES.PRIMARY}"]`)
    .type(text);

  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('BloodPressure', (question, inputs) => {
  cy.task('log', `Blood pressure: ${question}: answer: ${JSON.stringify(inputs)} userType: ${USER_TYPES.PRIMARY}`);
  inputs.forEach((input, index) => {
    cy.get(`[data-cy="bloodPressure-systolic-${question}-${index}-${USER_TYPES.PRIMARY}"]`)
      .type(input.systolic);
    cy.get(`[data-cy="bloodPressure-diastolic-${question}-${index}-${USER_TYPES.PRIMARY}"]`)
      .type(input.diastolic);
    if (index !== inputs.length - 1) {
      cy.get('[data-cy=addReading]')
        .click();
    }
  });

  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
});

Cypress.Commands.add('Percent', (inputs) => {
  cy.task('log', `Percent - answer: ${JSON.stringify(inputs)} userType: ${USER_TYPES.PRIMARY}`);
  inputs.forEach((input) => {
    cy.get(`[data-cy="percent-input-${input.text}-${USER_TYPES.PRIMARY}"]`)
      .type(input.value);
  });
  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
});

Cypress.Commands.add('AmountQuestionInput', (question, inputs) => {
  cy.task('log', `Amount: ${question}: answer: ${JSON.stringify(inputs)} userType: ${USER_TYPES.PRIMARY}`);
  inputs.forEach((input) => {
    cy.get(`[data-cy="amountQuestion-input-${question}-${input.text}-${USER_TYPES.PRIMARY}"]`)
      .type(input.value);
  });
  cy.get('[data-cy=submit]:visible')
    .click({ force: true });
});

Cypress.Commands.add('Search', (question, options) => { // solo tests, userType = primary
  cy.task('log', `Search: ${question}: answer: ${JSON.stringify(options)} userType: ${USER_TYPES.PRIMARY}`);
  options.forEach((option) => {
    cy.DesignSystemTypeAndClickInSelect(`"select-field-${question}-${USER_TYPES.PRIMARY}"`, option);
  });
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@submitAnswer');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('Authorize', ({ life, ci, seeMyDecision, isDigitalConsent = false }) => {
  cy.task('log', `Authorize`);

  if (isDigitalConsent) {
    cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.IS_DIGITAL_CONSENT);
  }

  // Validate the consent copy before submitting
  cy.getTenantCode().then((tenantCode) => {
    const consentType = isDigitalConsent
      ? AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY
      : AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY;
    const expectedCopy = EXPECTED_AUTHORIZATION_CONSENT[tenantCode][consentType].primary;
    cy.get(`[data-cy="consent-body"]`)
      .find('ul>li')
      .should(($lis) => validateConsentCopy($lis, expectedCopy));
  });

  cy.get('[data-cy=submit-decision]').last().scrollIntoView()
    .should('not.be.disabled')
    .click();
  cy.SegmentTrack(SEGMENT_EVENTS.APPLICATION_SUBMITTED, {});

  if (life) {
    cy.wait('@lifePolicies', { responseTimeout: 180000 });
  }
  if (ci) {
    cy.wait('@ciPolicies', { responseTimeout: 180000 });
  }

  const auraAuthorizationCount = life && ci ? 2 : 1;
  for (let i = 0; i < auraAuthorizationCount; i++) {
    if (!isDigitalConsent) {
      cy.wait('@auraAuthorization', { requestTimeout: 90000, responseTimeout: 90000 });
    } else {
      cy.wait('@auraAuthorization', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
        expect(interception.request.body.authorization_type).to.equal('mib');
        expect(interception.request.body.authorization_vers).to.equal('11.0.0');
      });
    }
  }

  cy.wait('@auraDecision', { requestTimeout: 180000, responseTimeout: 180000 });
  cy.wait('@utm');
  cy.SegmentTrack(SEGMENT_EVENTS.DECISION_RECEIVED, {
    issued_term_length: 'number',
    issued_coverage_amount: 'number',
    disclosure_only_decision: 'string',
  });

  if (life) {
    cy.wait('@postBeneficiaries', { responseTimeout: 180000 });
  }

  if (seeMyDecision) {
    cy.get('[data-cy=see-my-decision]:not(:disabled)', { timeout: 180000 }).last().scrollIntoView()
      .click();
  }
});

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 1000;
const JOINT_APPLICANT_COUNT = 2; // Joint applications have 2 applicants

/**
 * Waits for submit button to be enabled using retry mechanism.
 * Handles Material-UI disabled state (Mui-disabled class) and standard disabled attributes.
 * Then performs comprehensive validation and clicks the button.
 */
Cypress.Commands.add('waitForSubmitButtonAndClick', () => {
  const SELECTOR = '[data-cy=submit]:visible';
  const TIMEOUT = 5000; // Increased timeout to 5s
  let attempt = 0;

  function wrapper() {
    cy.get(SELECTOR, { timeout: TIMEOUT })
      .then(($button) => {
        if ($button.length !== 1 || !$button.is(':visible') || $button.is(':disabled')) {
          attempt++;
          if (attempt < MAX_RETRIES) {
            cy.wait(RETRY_INTERVAL);
            wrapper();
          }
        } else {
          // Button meets all conditions, proceed with click
          cy.get(SELECTOR, { timeout: TIMEOUT })
            .should('exist')
            .should('be.visible')
            .should('have.length', 1)
            .should('not.be.disabled')
            .scrollIntoView({ duration: 0, easing: 'linear' })
            .click({ force: true, timeout: TIMEOUT });
        }
      });
  }
  wrapper();
});

/**
 * Helper function to wait for an endpoint multiple times with retry logic
 * @param alias - The endpoint alias to wait for
 * @param count - Number of times to wait for the endpoint
 * @param options - Cypress wait options
 */
function waitForEndpointMultiple(
  alias: string,
  count: number,
  options: { requestTimeout?: number; responseTimeout?: number } = {}
): void {
  for (let i = 0; i < count; i++) {
    cy.wait(alias, options);
  }
}

/**
 * Helper function to wait for authorization endpoints with optional digital consent validation
 * @param count - Number of times to wait (typically 2 for joint applications)
 * @param isDigitalConsent - Whether to validate digital consent parameters
 */
function waitForAuthorizations(count: number, isDigitalConsent: boolean): void {
  const baseOptions = isDigitalConsent
    ? { requestTimeout: 180000, responseTimeout: 90000 }
    : { requestTimeout: 90000, responseTimeout: 90000 };

  for (let i = 0; i < count; i++) {
    if (isDigitalConsent) {
      cy.wait('@auraAuthorization', baseOptions).then((interception) => {
        expect(interception.request.body.authorization_type).to.equal('mib');
        expect(interception.request.body.authorization_vers).to.equal('11.0.0');
      });
    } else {
      cy.wait('@auraAuthorization', baseOptions);
    }
  }
}

/**
 * Helper function to process a product type (life or ci) for joint applications
 * @param policyAlias - The policy endpoint alias ('@lifePolicies' or '@ciPolicies')
 * @param isDigitalConsent - Whether digital consent is enabled
 */
function processProductForJoint(policyAlias: string, isDigitalConsent: boolean): void {
  // Wait for policies twice (once for each applicant)
  waitForEndpointMultiple(policyAlias, JOINT_APPLICANT_COUNT, { responseTimeout: 180000 });

  // Wait for authorizations twice (once for each applicant)
  waitForAuthorizations(JOINT_APPLICANT_COUNT, isDigitalConsent);

  // Wait for decisions twice (once for each applicant) with retry logic
  for (let i = 0; i < JOINT_APPLICANT_COUNT; i++) {
    cy.wait('@auraDecision', { requestTimeout: 180000, responseTimeout: 180000 });
  }
}

/**
 * Helper function to track segment events multiple times
 * @param event - The segment event to track
 * @param eventData - The event data to send
 * @param count - Number of times to track the event
 */
function trackSegmentEventMultiple(
  event: string,
  eventData: Record<string, unknown>,
  count: number
): void {
  for (let i = 0; i < count; i++) {
    cy.SegmentTrack(event, eventData);
  }
}

Cypress.Commands.add('AuthorizeJoint', ({ life, ci, isDigitalConsent = false }) => {
  if (isDigitalConsent) {
    cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.IS_DIGITAL_CONSENT);
  }

  // Submit the decision
  cy.get('[data-cy=submit-decision]', { timeout: 90000 })
    .last()
    .scrollIntoView()
    .should('not.be.disabled')
    .click();

  // Track application submitted event twice (once for each applicant)
  trackSegmentEventMultiple(SEGMENT_EVENTS.APPLICATION_SUBMITTED, {}, JOINT_APPLICANT_COUNT);

  // Process life product if enabled
  if (life) {
    processProductForJoint('@lifePolicies', isDigitalConsent);
  }

  // Process CI product if enabled
  if (ci) {
    processProductForJoint('@ciPolicies', isDigitalConsent);
  }

  // Track decision received event twice (once for each applicant)
  trackSegmentEventMultiple(
    SEGMENT_EVENTS.DECISION_RECEIVED,
    {
      issued_term_length: 'number',
      issued_coverage_amount: 'number',
      disclosure_only_decision: 'string',
    },
    JOINT_APPLICANT_COUNT
  );

  // Wait for UTM tracking twice (once for each applicant)
  waitForEndpointMultiple('@utm', JOINT_APPLICANT_COUNT);

  // Wait for CRM sync twice (once for each applicant)
  waitForEndpointMultiple('@crm', JOINT_APPLICANT_COUNT, { responseTimeout: 90000 });

  cy.waitForSubmitButtonAndClick();
});

Cypress.Commands.add('StartDisclosure', () => {
  cy.task('log', 'StartDisclosure');
  cy.wait(2000); // needed for Cypress UI to not skip submit
  cy.get('[data-cy="submit"]:visible').click({ force: true, timeout: 5000 });
  cy.wait('@startDisclosure');
  cy.wait('@nextQuestion');
});

Cypress.Commands.add('BackToDecision', () => {
  cy.task('log', 'backToDecision');
  cy.contains('button', 'Back').click({ timeout: 5000 });
});

Cypress.Commands.add('PrimarySteps', () => {
  cy.task('log', 'primarySteps');
  cy.get('[data-cy=primaryNextSteps]').click({ timeout: 100000 });
});

Cypress.Commands.add('SecondarySteps', () => {
  cy.task('log', 'secondarySteps');
  cy.get('[data-cy="secondaryNextSteps"]').click({ timeout: 100000 });
});

Cypress.Commands.add('Disclosure', (primaryInput: Disclosure, secondaryInput: Disclosure) => {
  cy.wait('@startDisclosure'); // needs time to load aura disclosures
  cy.wait('@nextQuestion');
  cy.wait('@patchHouseholdInfos'); // put request takes 700ms to load

  let updatedSecondaryInput = !hasValue(secondaryInput) ? {
    haveBeenDeclined: undefined,
    work: undefined,
    bankruptcy: undefined,
    statusInCanada: undefined,
    height: undefined,
    weight: undefined,
    weightChange: undefined,
    travelPlans: undefined,
    hazardousActivities: undefined,
    impairedDriving: undefined,
    drivingViolation: undefined,
    criminalOffense: undefined,
    tobaccoUse: undefined,
    alcoholUse: undefined,
    alcoholTreatment: undefined,
    cannabisUse: undefined,
    drugUse: undefined,
    familyHealth: undefined,
    personalHealth: undefined,
    healthConsultation: undefined,
  } : secondaryInput;

  // Question 10
  workQuestion(primaryInput.work, updatedSecondaryInput.work);

  // Question 63
  bankruptcyQuestion(primaryInput.bankruptcy, updatedSecondaryInput.bankruptcy);

  // Question 64
  statusInCanadaQuestion(primaryInput.statusInCanada, updatedSecondaryInput.statusInCanada);

  // Question 99
  heightQuestion(primaryInput.height, updatedSecondaryInput.height);

  // Question 100
  weightQuestion(primaryInput.weight, updatedSecondaryInput.weight);

  // Question 101
  weightChangeQuestion(primaryInput.weightChange, updatedSecondaryInput.weightChange);

  // Question 119
  travelQuestion(primaryInput.travelPlans, updatedSecondaryInput.travelPlans);

  // Question 121
  hazardousActivitiesQuestion(primaryInput.hazardousActivities, updatedSecondaryInput.hazardousActivities);

  // Question 126
  impairedDrivingQuestion(primaryInput.impairedDriving, updatedSecondaryInput.impairedDriving);

  // Question 127
  drivingViolationQuestion(primaryInput.drivingViolation, updatedSecondaryInput.drivingViolation);

  // Question 130
  criminalOffenseQuestion(primaryInput.criminalOffense, updatedSecondaryInput.criminalOffense);

  // Question 131
  tobaccoQuestion(primaryInput.tobaccoUse, updatedSecondaryInput.tobaccoUse);

  // Question 133
  alcoholQuestion(primaryInput.alcoholUse, updatedSecondaryInput.alcoholUse);

  // Question 134
  alcoholTreatmentQuestion(primaryInput.alcoholTreatment, updatedSecondaryInput.alcoholTreatment);

  // Question 135
  cannabisQuestion(primaryInput.cannabisUse, updatedSecondaryInput.cannabisUse);

  // Question 137
  drugsQuestion(primaryInput.drugUse, updatedSecondaryInput.drugUse);

  // Question 140
  familyHealthQuestion(primaryInput.familyHealth, updatedSecondaryInput.familyHealth);

  // Question 142
  personalHealthQuestion(primaryInput.personalHealth, updatedSecondaryInput.personalHealth);

  // Question 231
  healthConsultationQuestion(primaryInput.healthConsultation, updatedSecondaryInput.healthConsultation);

  // Question 1
  declinedQuestion(primaryInput.haveBeenDeclined, updatedSecondaryInput.haveBeenDeclined);
});
