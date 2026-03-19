import { hasFlag, PM_PRODUCT_PREFIX, TENANT_FLAGS, THEMES } from '@policyme/global-libjs-utils';
import moment from 'moment';

import { SEGMENT_EVENTS, STATUTORY_HOLIDAYS } from '../../src/utils/const';
import { validateConsentCopy } from './ConsentText';
import { expectedCopyForPrice } from './ConsentText/CheckoutConsent';
import { INSUFFICIENT_FUNDS_ERROR_MESSAGE, STRIPE_FORM_FIELD_SELECTORS, STRIPE_NSF_CARD } from './constants';
import { DecisionCardStates } from './DecisionCardStates';

Cypress.Commands.add('Decision', (dataCy) => {
  cy.task('log', 'Decision');
  cy.get(`[data-cy=${dataCy}]`)
    .click({ force: true });
});

Cypress.Commands.add('NurseVisit', () => {
  cy.task('log', 'NurseVisit');
  cy.ClickFirstInSelectFriday('date');
  cy.ClickFirstInSelect('time');
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('PhysicianDetails', (hasDoctor, doctorName, doctorCity, phoneNumber) => {
  cy.task('log', 'PhysicianDetails');
  if (hasDoctor === 'Y') {
    cy.get('[data-cy=doctorName]')
      .type(doctorName, { force: true });
    cy.get('[data-cy=doctorCity]')
      .type(doctorCity, { force: true });
    cy.get('[data-cy=phoneNumber]')
      .type(phoneNumber, { force: true });
    cy.get('[data-cy=confirmDoctor]')
      .click();
  } else {
    cy.get('[data-cy=noDoctor]')
      .click();
  }
});

Cypress.Commands.add('UnderwriterEsign', () => {
  cy.task('log', 'UnderwriterEsign');
  cy.urlEndsWith('underwriter/esign-aps');
  // This is the last step before going to docusign
  // where we can't progress further
});

Cypress.Commands.add('CommonPrimaryBeneficiaries', (chooseBeneficiaries) => {
  cy.task('log', 'CommonPrimaryBeneficiaries');
  if (chooseBeneficiaries === 'chooseNow') {
    cy.get('[data-cy=common-primary-beneficiaries-now]')
      .click();
  } else if (chooseBeneficiaries === 'chooseLater') {
    cy.get('[data-cy=common-primary-beneficiaries-later]')
      .click({ force: true });
  }
  cy.get('[data-cy=submit-common-primary-beneficiaries]:visible')
    .click();
});

Cypress.Commands.add('CommonSecondaryBeneficiaries', (
  hasSecondaryBeneficiary, hasSecondaryBeneficiaryForPrimaryUser,
  hasSecondaryBeneficiaryForSecondaryUser, hasPartner,
) => {
  cy.task('log', 'CommonSecondaryBeneficiaries');
  if (hasSecondaryBeneficiary) {
    cy.get('[data-cy=commonSecondaryBeneficiaries-true]')
      .click();
    if (hasPartner) {
      if (hasSecondaryBeneficiaryForPrimaryUser) {
        cy.get('[data-cy=common-secondary-beneficiary-primary-user]')
          .click({ force: true });
      }
      if (hasSecondaryBeneficiaryForSecondaryUser) {
        cy.get('[data-cy=common-secondary-beneficiary-secondary-user]')
          .click({ force: true });
      }
    }
  } else {
    cy.get('[data-cy=commonSecondaryBeneficiaries-false]')
      .click({ force: true });
  }
  cy.get('[data-cy=submit-common-secondary-benenficiaries]:visible')
    .click();
});

/* Cypress.Commands.add('ApprovedPrimaryBeneficiaries', (primaryBeneficiaries) => {
  cy.task('log', 'ApprovedPrimaryBeneficiaries');
  primaryBeneficiaries.forEach((beneficiary, index) => {

    if(cy.find(`[data-cy=beneficiaryName-${index}]`).length > 0){
        cy.get('[data-cy=addBeneficiary]')
          .click();
        }
        cy.get(`[data-cy=beneficiaryName-${index}]`)
        .type(beneficiary.name, { force: true });
      cy.ClickInSelect(`beneficiaryRelationship-${index}`, beneficiary.relationship);
      cy.ClearAndType(`beneficiaryPercent-${index}`, beneficiary.percent);
    });
    cy.get('[data-cy=submit]:visible')
    .click();
  }); */

Cypress.Commands.add('PrimaryBeneficiaries', (primaryBeneficiaries, userType = 'primary', hasModal = false) => {
  cy.task('log', `PrimaryBeneficiaries-${userType}`);
  primaryBeneficiaries.forEach((beneficiary, index) => {
    if (cy.get(`[data-cy=beneficiaryName-${userType}-${index}]`).should('exist') && (primaryBeneficiaries.length - 1 !== index)) {
      cy.get(`[data-cy=addBeneficiary-${userType}]`)
        .click();
    }
    cy.get(`[data-cy=beneficiaryName-${userType}-${index}]`)
      .type(beneficiary.name, { force: true });
    cy.DesignSystemClickInSelect(`beneficiaryRelationship-${userType}-${index}`, beneficiary.relationship, { force: true });
    cy.ClearAndType(`beneficiaryPercent-${userType}-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
  });
  cy.ScrollAndClickSubmit(`submit-beneficiary-btn`);
  if (hasModal) {
    cy.contains('.btn-primary', 'Confirm Beneficiaries').click();
  }
});

Cypress.Commands.add('Trustee', (name = '', isBCL = false) => {
  cy.task('log', 'Trustee');
  if (isBCL) {
    if (name === '') {
      cy.get('[name="skip-trustee"]')
        .click();
      cy.get('[name="confirm-skip-trustee"]')
        .click();
    } else {
      cy.ClearAndType('trustee-name', name);
      cy.get('[data-cy="save-trustee"]')
        .filter(':visible')
        .click();
    }
  }
});

Cypress.Commands.add('VerifyBeneficairiesOnDecisionDashboard', (
  userType = 'primary',
  primaryBeneficiariesSelectedPreDecision = null,
  secondaryBeneficiariesSelectedPreDecision = null,
  trusteeName = null,
  isBCL = false,
) => {
  cy.task('log', 'VerifyBeneficairiesOnDecisionDashboard');
  cy.get('[data-cy=see-your-beneficiary]')
    .click();

  if (primaryBeneficiariesSelectedPreDecision) {
    cy.get('[data-cy=beneficiary-modal-edit-primary]')
      .click();
    primaryBeneficiariesSelectedPreDecision.forEach((beneficiary, index) => {
      cy.get(`[data-cy=beneficiaryName-${userType}-${index}]`)
        .should('have.value', beneficiary.name);
      cy.get(`[data-cy=beneficiaryRelationship-${userType}-${index}]`)
        .should('have.value', beneficiary.relationship);
      cy.get(`[data-cy=beneficiaryPercent-${userType}-${index}]`)
        .should('have.value', beneficiary.percent);
      cy.get(`[data-cy=is-minor-${index}-${beneficiary.is_minor}]`)
        .find('input')
        .should('have.value', beneficiary.is_minor.toString());
    });
    cy.get('[data-cy=beneficiary-modal-save-my-selection]')
      .click();
  }

  if (secondaryBeneficiariesSelectedPreDecision) {
    cy.get('[data-cy=beneficiary-modal-edit-secondary]')
      .click();
    secondaryBeneficiariesSelectedPreDecision.forEach((beneficiary, index) => {
      cy.get(`[data-cy=secondaryBeneficiaryName-${userType}-${index}]`)
        .should('have.value', beneficiary.name);
      cy.get(`[data-cy=secondaryBeneficiaryRelationship-${userType}-${index}]`)
        .should('have.value', beneficiary.relationship);
      cy.get(`[data-cy=secondaryBeneficiaryPercent-${userType}-${index}]`)
        .should('have.value', beneficiary.percent);
      cy.get(`[data-cy=is-minor-${index}-${beneficiary.is_minor}]`)
        .find('input')
        .should('have.value', beneficiary.is_minor.toString());
    });
    cy.get('[data-cy=beneficiary-modal-save-my-selection]')
      .click();
  }

  if (trusteeName && isBCL) {
    cy.get('[data-cy=beneficiary-modal-edit-trustee]')
      .click();
    cy.get('[data-cy=trustee-name]')
      .should('have.value', trusteeName);
  }

  cy.get('[data-cy=CloseModalButton]').click();
});

Cypress.Commands.add('VerifyJointBeneficiariesOnDecisionDashboard', (primaryData, secondaryData) => {
  cy.task('log', 'VerifyJointBeneficiariesOnDecisionDashboard');
  cy.VerifyBeneficairiesOnDecisionDashboard(
    'primary',
    primaryData.beneficiaries,
    primaryData.secondaryBeneficiaries.beneficiaries,
    primaryData.trusteeName,
  );
  cy.SecondarySteps();
  cy.VerifyBeneficairiesOnDecisionDashboard(
    'secondary',
    secondaryData.beneficiaries,
    secondaryData.secondaryBeneficiaries.beneficiaries,
    secondaryData.trusteeName,
  );
  cy.PrimarySteps();
});

Cypress.Commands.add('DecisionDashboard', (
  seeMyBeneficiaries = false,
  editBeneficiaries = {}, userType = 'primary', isJoint = false, primaryBeneficiariesSelectedPreDecision = null, secondaryBeneficiariesSelectedPreDecision = null, trusteeName = null,
) => {
  cy.task('log', 'DecisionDashboard');

  if (primaryBeneficiariesSelectedPreDecision || secondaryBeneficiariesSelectedPreDecision) {
    cy.VerifyBeneficairiesOnDecisionDashboard(
      userType,
      primaryBeneficiariesSelectedPreDecision,
      secondaryBeneficiariesSelectedPreDecision,
      trusteeName,
    );
  }

  if (seeMyBeneficiaries) {
    cy.SeeMyBeneficiariesPostDecision(userType, editBeneficiaries);
  }
  cy.get('[data-cy=NextStep]', { timeout: 20000 })
    .scrollIntoView()
    .click({ force: true });
});

Cypress.Commands.add('SeeMyBeneficiariesPostDecision', (userType, editBeneficiaries = {}, isModal = false) => {
  cy.get('[data-cy=see-your-beneficiary]')
    .click();
  if (editBeneficiaries.editPrimaryBeneficiaries) {
    cy.get('[data-cy=beneficiary-modal-edit-primary]')
      .click();
    editBeneficiaries.primaryBeneficiaries.forEach((beneficiary, index) => {
      cy.ClearAndType(`beneficiaryName-${userType}-${index}`, beneficiary.name);
      cy.DesignSystemClickInSelect(`beneficiaryRelationship-${userType}-${index}`, beneficiary.relationship);
      cy.ClearAndType(`beneficiaryPercent-${userType}-${index}`, beneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    });
  }
  if (editBeneficiaries.editPrimaryBeneficiaries
    && editBeneficiaries.editSecondaryBeneficiaries) {
    cy.get('[data-cy=beneficiary-modal-save-my-selection]')
      .click();
  }
  if (editBeneficiaries.editSecondaryBeneficiaries) {
    cy.get('[data-cy=beneficiary-modal-edit-secondary]')
      .click();
    editBeneficiaries.secondaryBeneficiaries.forEach((beneficiary, index) => {
      cy.ClearAndType(`secondaryBeneficiaryName-${userType}-${index}`, beneficiary.name);
      cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-${userType}-${index}`, beneficiary.relationship);
      cy.ClearAndType(`secondaryBeneficiaryPercent-${userType}-${index}`, beneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    });
  }

  cy.get('[data-cy=beneficiary-modal-save-my-selection]')
    .click();
  if (isModal) {
    cy.get('[data-cy=CloseModalButton]')
      .click();
  }
});

Cypress.Commands.add('ApprovedSecondaryBeneficiariesChoice', (wantSecondaryBeneficiaries) => {
  cy.task('log', 'ApprovedSecondaryBeneficiariesChoice');
  if (wantSecondaryBeneficiaries === 'Y') {
    cy.get('[data-cy=secondaryBeneficiaries-Y]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
  } else {
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
  cy.wait('@patchLifePolicies');
});

Cypress.Commands.add('SecondaryBeneficiaries', (secondaryBeneficiaries, userType = 'primary', hasPartner, sameAsPartner, hasModal = false) => {
  cy.task('log', `SecondaryBeneficiaries-${userType}`);

  // In the app currently (as of writing this comment), the secondary beneficiaries has
  // the first row already present for the primary user, but not for the secondary user
  // and so we need to add one less row for for the primary user compared to the secondary user
  const numRowsToAdd = userType === 'primary' ? secondaryBeneficiaries.length - 1 : secondaryBeneficiaries.length;

  for (let i = 0; i < numRowsToAdd; i++) {
    cy.get(`[data-cy=addBeneficiary-${userType}]`)
      .click();
  }
  secondaryBeneficiaries.forEach((beneficiary, index) => {
    cy.get(`[data-cy=secondaryBeneficiaryName-${userType}-${index}]`)
      .type(beneficiary.name, { force: true });
    cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-${userType}-${index}`, beneficiary.relationship);
    cy.ClearAndType(`secondaryBeneficiaryPercent-${userType}-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
  });
  if (hasPartner === 'Y' && sameAsPartner === 'Y') {
    cy.get('[data-cy=secondary-user-beneficiary-same-as-partner]')
      .click({ force: true });
  }
  cy.get('[data-cy=submit]')
    .filter(':visible')
    .scrollIntoView()
    .click();

  if (hasModal) {
    cy.contains('.btn-primary', 'Confirm Beneficiaries').click();
  }
});

Cypress.Commands.add('ApprovedSecondaryBeneficiaries', (wantSecondaryBeneficiaries, secondaryBeneficiaries) => {
  cy.task('log', 'ApprovedSecondaryBeneficiaries');
  if (wantSecondaryBeneficiaries === 'Y') {
    cy.get('[data-cy=secondaryBeneficiaries-Y]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
    secondaryBeneficiaries.forEach((beneficiary, index) => {
      cy.get(`[data-cy=secondaryBeneficiary-${index}]`)
        .type(beneficiary.name, { force: true });
      cy.ClickInSelect(`secondaryBeneficiaryRelationship-${index}`, beneficiary.relationship);
      cy.get(`[data-cy=secondaryBeneficiaryPercent-${index}]`)
        .type(beneficiary.percent, { force: true });
      cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
      if (index !== secondaryBeneficiaries.length - 1) {
        cy.get('[data-cy=addSecondaryBeneficiary]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@patchLifePolicies');
  } else {
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
});

Cypress.Commands.add('ApprovedTrusteeChoice', (wantTrustee) => {
  cy.task('log', 'ApprovedTrsuteeChoice');
  if (wantTrustee === 'Y') {
    cy.get('[data-cy=trustee-Y]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
  } else {
    cy.get('[data-cy=trustee-N]')
      .click();
  }
});

Cypress.Commands.add('ApprovedTrustee', (wantTrustee, trustee) => {
  cy.task('log', 'ApprovedTrustee');
  if (wantTrustee === 'Y') {
    cy.get('[data-cy=trustee-Y]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.get('[data-cy=trusteeFirstName]')
      .type(trustee.firstName, { force: true });
    cy.get('[data-cy=trusteeLastName]')
      .type(trustee.lastName, { force: true });
    cy.ClickInSelect('trusteeRelationship', trustee.relationship);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else {
    cy.get('[data-cy=trustee-N]')
      .click();
  }
});

Cypress.Commands.add('RemoveCI', () => {
  cy.task('log', 'Removing CI');
  cy.get('[data-cy=no-thanks-ci-addon-button]:not([disabled]', { timeout: 60000 })
    .should('exist')
    .scrollIntoView()
    .click({ force: true });
  cy.wait('@crm');
  cy.wait(1000); // wait after removing CI for Cypress
});

Cypress.Commands.add('SubmitCIDecision', () => {
  cy.task('log', 'Submit CI Decision');
  cy.get('[data-cy=CI-next-button-primary]:not([disabled]', { timeout: 60000 });
  cy.get('[data-cy=CI-next-button-primary]').last().scrollIntoView()
    .should('exist')
    .click({ force: true });

  // Handle the CI blocker modal if CI was opted out of
  const ciBlockerModalConfirmSelector = '[data-cy=cross-sell-ci-blocker-modal-confirm]';
  if (Cypress.$(ciBlockerModalConfirmSelector).length !== 0) {
    cy.get(ciBlockerModalConfirmSelector).click({ force: true });
  }

  cy.wait('@patchLifePolicies');
  cy.wait('@crm');
  cy.wait('@utm');
});

Cypress.Commands.add('SubmitDocusign', (policy) => {
  cy.task('log', 'SubmitDocusign');
  if (policy === 'ci') {
    cy.wait(10000);
  }
  cy.get('[data-cy=eSignDocusign]:not([disabled])', { timeout: 200000 });
  cy.get('[data-cy=eSignDocusign]').last().scrollIntoView()
    .should('exist')
    .click();
  cy.wait('@crm');
  cy.wait('@utm');
  cy.wait('@submitDocusign');
  cy.wait('@docusignCallback');
  cy.SetCypressStripeForm(true);

  if (policy === 'life') {
    cy.wait('@patchLifePolicies');
  } else if (policy === 'ci') {
    cy.wait('@patchCiPolicies');
  }
  cy.wait('@rehydrateJourney');
  cy.wait('@quotes');
});

Cypress.Commands.add('PaymentFreq', (freq) => {
  cy.task('log', 'PaymentFreq');
  if (freq === 'Monthly') {
    // on mobile, cypress auto scrolls element to top before clicking
    // causing it to be blocked by progress bar
    cy.get('[data-cy=payment-frequency-monthly]')
      .click({ scrollBehavior: 'center' });
  } else if (freq === 'Annual') {
    cy.get('[data-cy=payment-frequency-annual]')
      .click({ scrollBehavior: 'center' });
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('SetCypressStripeForm', (fromDocusign) => {
  cy.task('log', 'SetCypressStripeForm');
  if (fromDocusign) {
    cy.get('[data-cy=enableDebugging]')
      .click();
  }
  cy.get('[aria-label="Set Cypress Stripe Form"]', { timeout: 50000 })
    .click({ force: true });
});

Cypress.Commands.add('DisableSept2025Promo', () => {
  cy.task('log', 'DisableSept2025Promo');
  cy.get('[aria-label="Disable September 2025 Promo"]', { timeout: 50000 })
    .click({ force: true });
});

// make sure checkbox is mandatory
Cypress.Commands.add('DigitalConsentCheckoutConsent', () => {
  cy.getTenantCode().then((tenantCode) => {
    cy.GetPriceAllProduct('approved-rate-price').then((price) => {
      // Convert the price to the format with exactly 2 decimal places
      // If there are more than 3 digits on the left side, we break it with comma(s)
      // e.g. 200000 => $200,000.00
      const formattedPrice = price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      const expected = expectedCopyForPrice(`$${formattedPrice}`)[tenantCode];
      cy.get(`[data-cy="consent-block"]`)
        .invoke('text')
        .should((text) => validateConsentCopy(text, expected));
    });
  });
  cy.get('[data-cy=submit]')
    .click();
  cy.contains('Please check the box to continue')
    .should('exist')
    .click();
  cy.get('[name="payment-acknowledgement"]').click();
});

Cypress.Commands.add('ClearStripeFields', () => {
  const clearStripeElement = (selector) => {
    return cy
      .StripeElement(selector)
      .focus()
      // “{selectAll}” works cross-platform (Cmd+A on macOS, Ctrl+A on Windows)
      .type('{selectAll}{backspace}');
  };
  clearStripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER);
  clearStripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE);
  clearStripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC);
});

Cypress.Commands.add('hdSinglePageCheckout', (payment, billing) => {
  cy.task('log', 'hdSinglePageCheckout');
  cy.get('[id="calendar_input"]', { timeout: 20000 }).should('be.visible');
  cy.task('log', `${moment().format('MM/DD/YYYY')}`);
  cy.get('[id="calendar_input"]')
    .click({ force: true });

  /**
   * Business Day Date Selection Logic Summary:
   *
   * The effective date picker in CombinedCheckoutPage.tsx has disableWeekends={true} and
   * disableStatutoryHolidays={true} because health and dental insurance policies must start on
   * business days (weekdays that are not statutory holidays) when administrative offices are
   * operational to process policy activations. This is a standard insurance industry business
   * rule that ensures proper policy administration and coverage activation.
   *
   * The DatePicker component uses isDisabledDate() which disables:
   * - Weekends (Saturday = 6, Sunday = 0)
   * - Statutory holidays (as defined in STATUTORY_HOLIDAYS)
   * - Dates more than 90 days in the future
   * Note: Past dates are disabled separately by the disablePast prop on the DatePicker component.
   *
   * This test command handles edge cases where tests run on weekends or statutory holidays:
   * - If current date is a weekend or statutory holiday, it finds and selects the next available business day
   * - Handles month/year transitions when the next business day falls in the next month
   * - If current date is a valid business day, it selects today's date
   */

  // Helper function to check if a date is a statutory holiday
  const isStatutoryHoliday = (date) => {
    return STATUTORY_HOLIDAYS.includes(date.format('YYYY-MM-DD'));
  };

  // Helper function to check if a date is disabled (weekend or statutory holiday)
  const isDisabledDate = (date) => {
    const dayOfWeek = date.day();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return isWeekend || isStatutoryHoliday(date);
  };

  // Helper function to find the next available business day
  const findNextBusinessDay = (startDate, maxDays = 14) => {
    const checkDate = startDate.clone().add(1, 'day');
    let daysChecked = 0;

    while (daysChecked < maxDays) {
      if (!isDisabledDate(checkDate)) {
        return checkDate;
      }
      checkDate.add(1, 'day');
      daysChecked++;
    }
    // Fallback: return the date after maxDays (shouldn't happen in practice)
    return checkDate;
  };

  const currentDate = moment();
  const isCurrentDateDisabled = isDisabledDate(currentDate);

  if (isCurrentDateDisabled) {
    // Find the next available business day
    const nextBusinessDay = findNextBusinessDay(currentDate);
    cy.log(`Current date (${currentDate.format('MM/DD/YYYY')}) is disabled (weekend or holiday), selecting next business day: ${nextBusinessDay.format('MM/DD/YYYY')}`);

    const targetDay = nextBusinessDay.date();
    const targetMonth = nextBusinessDay.month();
    const targetYear = nextBusinessDay.year();
    const currentMonth = currentDate.month();
    const currentYear = currentDate.year();

    // Check if target date is in the next month or year
    const isNextMonth = targetMonth !== currentMonth || targetYear !== currentYear;

    if (isNextMonth) {
      cy.log('Next business day is in the next month, navigating to next month');
      // Navigate to next month - try common date picker navigation patterns
      cy.get('button[aria-label*="next" i], button[aria-label*="Next" i]')
        .should('exist') // Provides clearer error if button not found
        .first()
        .click({ force: true });
      // Wait for calendar to update by waiting for target gridcell to be visible and enabled
      cy.get('[role="gridcell"]')
        .not('[aria-disabled="true"]')
        .contains(targetDay.toString())
        .should('be.visible');
    }

    // Find and click the next business day in the calendar (not disabled)
    cy.log('Finding and clicking next business day in the calendar (not disabled)');
    // Try to select the correct gridcell by aria-label if available, otherwise fallback to contains
    cy.get('[role="gridcell"]')
      .not('[aria-disabled="true"]')
      .filter((index, el) => {
        const ariaLabel = el.getAttribute('aria-label');
        if (!ariaLabel) return false;
        // aria-label format: "Monday, June 3, 2024"
        return ariaLabel.includes(nextBusinessDay.format('MMMM')) &&
          ariaLabel.includes(nextBusinessDay.format('D')) &&
          ariaLabel.includes(nextBusinessDay.format('YYYY'));
      })
      .first()
      .click({ force: true });
    // Verify the correct date was selected
    cy.get('[id="calendar_input"]').should('have.value', nextBusinessDay.format('MM/DD/YYYY'));
  } else {
    cy.get('[aria-current=date]').click({ force: true });
  }
  cy.get('[data-cy=group-benefits-submit]:visible')
    .click({ force: true, timeout: 5000 });
  cy.wait('@stripeLoad', { timeout: 20000 });
  cy.ClickLabelAndType('firstName', payment.firstName);
  cy.ClickLabelAndType('lastName', payment.lastName);
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER)
    .type(payment.card);

  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE)
    .type(`${payment.expiryMonth}/${payment.expiryYear}`);

  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC)
    .type(payment.cvv);

  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY)
    .select(billing.countryCode);
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.POSTAL_CODE).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.POSTAL_CODE)
    .type(billing.postalCode);
  cy.get('[data-cy=submit]:visible')
    .click();
  const payload = {
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
  };
  cy.wait('@utm');
  cy.wait('@stripe', { timeout: 60000 });
  cy.wait('@payment');
  cy.SegmentTrack(SEGMENT_EVENTS.PAYMENT_RECEIVED, payload);
});

Cypress.Commands.add('Payment', (options) => {
  const {
    payment,
    billing,
    hasExclusivePerk = false,
    isJoint = false,
    productType = PM_PRODUCT_PREFIX.LIFE,
    isDigitalConsent = false,
    hasCrossSell = false,
    needsCiConfirmation = true,
    setCypressStripeForm = false,
    isPermLife = false,
    isNSFPayment = false,
    tenantCode = 'pm',
  } = options || {};
  cy.task('log', 'Payment');

  cy.wait('@stripeLoad', { timeout: 20000 });
  if (setCypressStripeForm) {
    cy.SetCypressStripeForm(false);
    cy.wait(5000);
  }

  if (!isDigitalConsent) {
    if (hasExclusivePerk) {
      cy.get('[data-cy=todayPaymentText]')
        .contains(`Total Today:`);
      cy.get('[data-cy=todayPaymentText]')
        .contains(`$0.00`);
      cy.get('[data-cy=firstTwoMonths]')
        .contains('First 2 months:');
      cy.get('[data-cy=firstTwoMonths]')
        .contains('FREE');
      // Payment due date should be 2 months later
      // equating with time in utc instead of local time as it is displayed in utc
      cy.get('[data-cy=totalPaymentDue]')
        .contains(`Total due on ${moment(moment().utc()).add(2, 'M').format('MMM DD')}:`);
    } else if (isJoint && productType === PM_PRODUCT_PREFIX.LIFE) {
      cy.get('[data-cy=todayPaymentText]')
        .contains('eq', `Today's payment:`);
    } else {
      cy.get('[data-cy=totalPaymentDue]')
        .contains(`Total:`);
    }
  } else {
    if (hasExclusivePerk) {
      cy.get('[data-cy=todayPaymentText]')
        .contains(`Total Today:`);
      cy.get('[data-cy=todayPaymentText]')
        .contains(`$0.00`);
      cy.get('[data-cy=firstTwoMonths]')
        .contains('First 2 months:');
      cy.get('[data-cy=firstTwoMonths]')
        .contains('FREE');
      // Payment due date should be 2 months later
      // equating with time in utc instead of local time as it is displayed in utc
      cy.get('[data-cy=totalPaymentDue]')
        .contains(`Total due on ${moment(moment().utc()).add(2, 'M').format('MMM DD')}:`);
    } else {
      cy.get('[data-cy=todayPaymentText]')
        .eq(0)
        .invoke('text')
        .should('eq', `Your Rate`);
    }

    if (productType === PM_PRODUCT_PREFIX.LIFE && !hasCrossSell) {
      // if we come back from accounts policy page
      // it will preserve the state before leaving the page
      // hence we want to make sure we aren't turning off crossSell by toggling it again
      if (tenantCode !== 'pm' && tenantCode !== 'caa') {
        cy.get('[data-cy="skip-ci"]').click();
        cy.get('[data-cy="skip-ci-modal"]').click();
      } else {
        cy.get(`[data-cy="ci-addon-card"] [name="switch"]`).click();
        cy.get('[data-cy="skip-ci-modal"]').click();
      }
    }
  }

  cy.ClickLabelAndType('firstName', payment.firstName);
  cy.ClickLabelAndType('lastName', payment.lastName);
  if (isNSFPayment) {
    cy.log('NSF Payment Initiated');
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER).should('not.be.disabled');
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER)
      .type(STRIPE_NSF_CARD);
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE).should('not.be.disabled');
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE)
      .type(`${payment.expiryMonth}/${payment.expiryYear}`);
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC).should('not.be.disabled');
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC)
      .type(payment.cvv);
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY).should('not.be.disabled');
    cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY)
      .select(billing.countryCode);
    if (isDigitalConsent) {
      cy.DigitalConsentCheckoutConsent();
    }
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@stripe', { timeout: 60000 });
    cy.wait('@payment');
    cy.get('[id="alert-body"]')
      .should('contain.text', INSUFFICIENT_FUNDS_ERROR_MESSAGE);
    cy.get('[name="payment-acknowledgement"]').click();
    cy.ClearStripeFields();
  }
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CARD_NUMBER)
    .type(payment.card);
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.EXPIRY_DATE)
    .type(`${payment.expiryMonth}/${payment.expiryYear}`);
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.CVC)
    .type(payment.cvv);
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY).should('not.be.disabled');
  cy.StripeElement(STRIPE_FORM_FIELD_SELECTORS.COUNTRY)
    .select(billing.countryCode);
  if (isDigitalConsent) {
    cy.DigitalConsentCheckoutConsent();
  }
  cy.get('[data-cy=submit]:visible')
    .click();
  const payload = productType === PM_PRODUCT_PREFIX.HD ? {
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
  } : {
    selected_coverage_amount: 'number',
    selected_term_length: 'number',
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
    issued_coverage_amount: 'number',
    issued_term_length: 'number',
    issued_monthly_premium: 'string',
  };
  cy.wait('@utm');
  if (isDigitalConsent) {
    cy.DigitalConsentGeneration(productType, hasCrossSell, isPermLife);
  }
  cy.wait('@stripe', { timeout: 60000 });
  cy.wait('@payment');

  if (productType === PM_PRODUCT_PREFIX.LIFE || productType === PM_PRODUCT_PREFIX.CI) {
    cy.wait('@createLifeCISubscription').then((interception) => {
      cy.log('@createLifeCISubscription discrepancy_flag response => ', interception.response.body.data);
      // expect(interception.response.body.data.discrepancy_flag).to.be.false;
    });
    if (hasCrossSell) {
      cy.wait('@createLifeCISubscription');
    }
  } else if (productType === PM_PRODUCT_PREFIX.HD) {
    cy.wait('@createHDSubscription').then((interception) => {
      cy.log('@createHDSubscription discrepancy_flag response => ', interception.response.body.data);
      // expect(interception.response.body.data.discrepancy_flag).to.be.false;
    });
  }

  cy.SegmentTrack(SEGMENT_EVENTS.PAYMENT_RECEIVED, payload);
});

Cypress.Commands.add('ConfirmPhone', (phoneNumber) => {
  cy.task('log', 'Confirm cell phone');
  cy.ClearAndType('confirm_cell_phone', phoneNumber);
  cy.get('[data-cy=confirmNumber]')
    .click();
  cy.get('button')
    .contains('OK')
    .click(); // close modal
});

Cypress.Commands.add('ApprovedThankYou', (userType) => {
  cy.task('log', 'ThankYou');
  cy.urlEndsWith(`/life/approved/${userType}/thankyou`, { timeout: 120000 });
});

Cypress.Commands.add('DecisionCardLifeAssertions', (decisionState, isConsented, theme = THEMES.policyme_original) => {
  DecisionCardStates(decisionState, PM_PRODUCT_PREFIX.LIFE, isConsented, theme);
});

Cypress.Commands.add('DecisionCardCiAssertions', (decisionState, isConsented, theme = THEMES.policyme_original) => {
  DecisionCardStates(decisionState, PM_PRODUCT_PREFIX.CI, isConsented, theme);
});

Cypress.Commands.add('ThankYouUnderwriter', () => {
  cy.task('log', 'ThankYou');
  cy.urlEndsWith('/life/underwriter/thankyou');
});

Cypress.Commands.add('FollowUpThankYou', () => {
  cy.task('log', 'FollowUpThankYou');
  cy.urlEndsWith('/life/thankyou-will-followup');
});

Cypress.Commands.add('IdVerification', ({ life, ci }) => {
  cy.task('log', `Background Id Verification`);
  if (life) {
    cy.wait('@idVerification', { timeout: 20000 });
  }
  if (ci) {
    cy.wait('@idVerification', { timeout: 20000 });
  }
});

Cypress.Commands.add('accountsLogin', (email) => {
  cy.task('log', `Accounts Login`);
  cy.ClearAndType('email', email);
  cy.get('[data-cy=login-submit]')
    .click();
  // wait for the login to complete
  cy.wait(3000);
});

Cypress.Commands.add('accountsSignup', (firstName, lastName) => {
  cy.task('log', `Accounts Signup`);
  cy.ClearAndType('firstName', firstName);
  cy.ClearAndType('lastName', lastName);
  cy.get('[data-cy=login-submit]')
    .click();
});

Cypress.Commands.add('twoFApage', () => {
  cy.task('log', `Account Two factor Page`);
  cy.get('[data-cy=login-skip]')
    .click();
});

Cypress.Commands.add('accountStartApp', (productType) => {
  cy.task('log', `Accounts Start App`);
  cy.get('[data-cy=start-a-new-application]')
    .click();
  cy.get(`[data-cy=start-a-new-${productType}-application]`).should('exist');
});

Cypress.Commands.add('accountsCheckout', (productType) => {
  cy.task('log', `Accounts Checkout`);
  cy.get(`[data-cy=inprogress-policy-card-cta-${productType}]`)
    .click();
});

Cypress.Commands.add('digitalConsentAccountsCheckout', (productType, appId) => {
  cy.task('log', `Digital Consent Accounts Checkout`);
  cy.get(`[data-cy=inprogress-policy-card-cta-${productType}]`).should('have.length', 1);
  cy.visit(`${Cypress.env('baseURL')}/life/decision-dashboard/callback?app_id=${appId}&debug=1`);
});

Cypress.Commands.add('DigitalConsentGeneration', (productType, hasCrossSell = false, isPermLife = false) => {
  cy.wait('@auraAuthorization', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
    expect(interception.request.body.authorization_type).to.equal('checkout_consent');
    expect(interception.request.body.authorization_vers).to.equal('2.0.0');
  });
  if (hasCrossSell) {
    cy.wait('@auraAuthorization', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
      expect(interception.request.body.authorization_type).to.equal('checkout_consent');
      expect(interception.request.body.authorization_vers).to.equal('2.0.0');
    });
  }
  cy.wait('@validateDocumentGeneration');
  if (hasCrossSell) {
    cy.wait('@validateDocumentGeneration');
  }

  if (productType === PM_PRODUCT_PREFIX.LIFE && !isPermLife) {
    cy.wait('@generateRenewalsLife', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
      expect(interception.response.body.data.success).to.equal(1);
    });
  }
  if ((hasCrossSell || productType === PM_PRODUCT_PREFIX.CI)
    && hasFlag(TENANT_FLAGS.ENABLE_CI_RENEWALS)) {
    cy.wait('@generateRenewalsCi', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
      expect(interception.response.body.data.success).to.equal(1);
    });
  }

  cy.wait('@uploadDigitalConsent', { requestTimeout: 210000, responseTimeout: 210000 }).then((interception) => {
    expect(interception.request.body.fail_documents).to.equal(false);
  });
  if (hasCrossSell) {
    cy.wait('@uploadDigitalConsent', { requestTimeout: 210000, responseTimeout: 210000 }).then((interception) => {
      expect(interception.request.body.fail_documents).to.equal(false);
    });
  }
  cy.wait('@digitalConsentStatus', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
    expect(interception.request.body.digital_consent_status).to.equal('consented');
  });
  if (hasCrossSell) {
    cy.wait('@digitalConsentStatus', { requestTimeout: 90000, responseTimeout: 90000 }).then((interception) => {
      expect(interception.request.body.digital_consent_status).to.equal('consented');
    });
  }
});

Cypress.Commands.add('EstateToCustomBeneficiaries', (customPrimaryBeneficiaries, customSecondaryBeneficiaries, trusteeName = '', userType = 'primary', cancelChanges = false, isBCL = false) => {
  cy.task('log', 'EstateToCustomBeneficiaries');

  cy.get('[data-cy=see-your-beneficiary]')
    .click();
  cy.get('[data-cy=edit-beneficiary-options]')
    .click();
  cy.get('[data-cy=beneficiary-modal-option-estate]')
    .get('input')
    .should('be.checked');
  cy.get('[data-cy=beneficiary-modal-option-customized]')
    .click();

  customPrimaryBeneficiaries.forEach((beneficiary, index) => {
    cy.ClearAndType(`beneficiaryName-${userType}-${index}`, beneficiary.name);
    cy.DesignSystemClickInSelect(`beneficiaryRelationship-${userType}-${index}`, beneficiary.relationship);
    cy.ClearAndType(`beneficiaryPercent-${userType}-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();

    if (index !== customPrimaryBeneficiaries.length - 1) {
      cy.get(`[data-cy=addBeneficiary-${userType}]`)
        .click();
    }
  });
  if (!cancelChanges) {
    cy.get('[data-cy=beneficiary-modal-save-my-selection]')
      .click();

    cy.get('[data-cy=beneficiary-modal-edit-secondary]')
      .click();
    customSecondaryBeneficiaries.forEach((beneficiary, index) => {
      cy.get(`[data-cy=addBeneficiary-${userType}]`)
        .click();
      cy.ClearAndType(`secondaryBeneficiaryName-${userType}-${index}`, beneficiary.name);
      cy.DesignSystemClickInSelect(`secondaryBeneficiaryRelationship-${userType}-${index}`, beneficiary.relationship);
      cy.ClearAndType(`secondaryBeneficiaryPercent-${userType}-${index}`, beneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    });
    if (!cancelChanges) {
      cy.get('[data-cy=beneficiary-modal-save-my-selection]')
        .click();
    }
    if (trusteeName !== '' && isBCL) {
      cy.get('[data-cy=beneficiary-modal-edit-trustee]')
        .click();
      cy.ClearAndType('trustee-name', trusteeName);
      cy.get('[name=save-trustee]').click();
    }
  } else {
    cy.get('[data-cy=cancel-current-changes]')
      .click();
    cy.get('[data-cy=edit-beneficiary-options]')
      .click();
    cy.get('[data-cy=beneficiary-modal-option-estate]')
      .get('input')
      .should('be.checked');
  }

  cy.get('[data-cy=CloseModalButton]')
    .click();
});

Cypress.Commands.add('ClickDownloadPolicyCoverageButton', () => {
  cy.task('log', 'ClickDownloadPolicyCoverageButton');
  const SELECTOR = '[data-cy=download-policy-coverage]';
  const BUTTON_TIMEOUT = 30000;

  cy.get(SELECTOR, { timeout: BUTTON_TIMEOUT })
    .should('exist')
    .should('have.length.at.least', 1)
    .eq(0)
    .should('be.visible')
    .should('not.be.disabled')
    .scrollIntoView({ duration: 0, easing: 'linear' })
    .click({ timeout: BUTTON_TIMEOUT });
});

Cypress.Commands.add('CheckAuraAuthorizationInterceptions', (
  expectedCount = 2,
  alias = '@auraAuthorization',
  maxRetries = 5,
  retryInterval = 1000,
) => {
  cy.task('log', `CheckAuraAuthorizationInterceptions - expecting ${expectedCount} interceptions`);
  cy.get(`${alias}.all`, { timeout: maxRetries * retryInterval })
    .should('have.length', expectedCount);
});
