// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// eslint-disable-next-line import/no-extraneous-dependencies
import '@percy/cypress';
import moment from 'moment';
import { BIRTHPLACE_JURISDICTION_TC, COUNTRIES, PM_PRODUCT_PREFIX, PROVINCES, REPLACE_POLICY_REASONS, UNDERWRITING_METHODS, US_STATES, SEGMENT_EVENTS, PM_PRODUCT_TYPE, CRM_SYNC_TYPES, USER_TYPES, COVERAGE_AMOUNTS_SLIDER_OVER_51 } from '../../src/utils/const';
import { addComma, getPMTestCaseEmailLog, getPMTestCaseSessionIDLog, getPMTestCaseCISessionIDLog, removeComma } from '../../src/utils/helpers';
import { getEnglishMessageWithId } from '../../src/utils/reactIntlHelpers';
import { ITT_BEHAVIOUR_MESSAGE } from './constants';
import { getPortalApprovedResetBody, getPortalRequestHeaders, getSiliTriageBody } from '../helper';
import { ACTIVE_TESTS } from '../../src/ABTests';
import { ITT_ENDPOINT_CONFIG } from './ittEndpointConfig';

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 1000;
// excluding events that do not hold predefined eventData
const SEGMENT_EVENTS_EXCLUDED = [SEGMENT_EVENTS.SAW_PERMANENT_INSURANCE];
// events that do not have common event data included (e.g. ab test info, utm)
const SEGMENT_EVENTS_LITE = [SEGMENT_EVENTS.LOGIN_INITIATED, SEGMENT_EVENTS.LOGIN_SUCCESSFUL];
const abTests = ACTIVE_TESTS;



// Sentry seems to throw this resize observer loop error, swallow this for cypress to run properly
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
// eslint-disable-next-line consistent-return
Cypress.on('uncaught:exception', (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});

/**
 * This function is used automatically for ITT tests via cy.wait override
 * @param {Object} options - Configuration options
 * @param {string} options.alias - The endpoint alias to wait for (e.g., '@accounts')
 * @param {number[]} options.successCodes - Array of acceptable HTTP status codes (default: [200])
 * @param {number} options.maxFailures - Maximum number of retries before failing (default: 3)
 * @param {number} options.timeout - Timeout in milliseconds (default: 30000)
 * @param {number} options.responseTimeout - Response timeout in milliseconds (default: 30000)
 * @param {Function} options.originalWaitFn - The original cy.wait function to avoid circular calls
 */
Cypress.Commands.add('waitForEndpointSuccess', ({ 
  alias, 
  successCodes = [200], 
  maxFailures = 3, 
  timeout = 30_000,
  responseTimeout = 30_000,
  originalWaitFn
}) => {
  let failures = 0;
  
  // Use original wait function to avoid circular call
  if (!originalWaitFn) {
    throw new Error('originalWaitFn is required to avoid circular calls with cy.wait override');
  }
  
  // Wrap the original wait function to handle Cypress command signature
  // Cypress command handlers expect (subject, ...args), where subject is undefined for parent commands
  // This wrapper allows us to call it like cy.wait() without explicitly passing undefined
  const waitFn = (...args) => originalWaitFn(undefined, ...args);
  
  // Helper function to handle retry logic
  function handleRetry(errorMessage) {
    failures += 1;
    if (failures >= maxFailures) {
      throw new Error(
        `API ${alias} failed ${maxFailures} times. ` +
        `Expected status codes: ${successCodes.join(', ')}, ` +
        `Last error: ${errorMessage}`
      );
    }
    return wait(); // recurse for next retry
  }
  
  function wait() {
    return waitFn(alias, { timeout, responseTimeout }).then((interception) => {
      // Handle case where interception might be undefined
      if (!interception) {
        return handleRetry('interception was undefined');
      }

      const statusCode = interception.response?.statusCode;
      // Check if status code is in the list of acceptable success codes
      if (statusCode && successCodes.includes(statusCode)) {
        // Ensure the response body is fully loaded (if applicable)
        // 204 No Content doesn't have a body, so skip body check

        if (statusCode !== 204) {
          expect(interception.response.body).to.not.be.undefined;
        }
        // Wait a bit more to ensure any UI updates complete
        // Return the interception so it can be used in .then() callbacks
        return waitFn(1000).then(() => interception);
      }
      
      // If status code is not in success codes, retry 
      return handleRetry(`status code: ${statusCode || 'undefined'}`);
    }).catch((error) => {
      // Handle errors from cy.wait() (timeouts, no matching request, etc.)
      return handleRetry(error.message);
    });
  }
  return wait();
});

Cypress.Commands.add('percySnapshotWithBreakpoints', (name, breakpoints = [375, 1024]) => {
  cy.percySnapshot(name, { widths: breakpoints });
});

Cypress.Commands.add('linkRoutes', () => {
  cy.intercept('GET', `/api/aura/v1/disclosure/session/**/question/25?search=Account Executive`).as('occupation0');
  cy.intercept('GET', /\/api\/(life|ci)-quotes\/v(\d+)\/*/).as('quotes');
  cy.intercept('PATCH', `/api/aura/v1/disclosure/session/**/question/**`).as('submitAnswer');
  cy.intercept('GET', `/api/aura/v1/disclosure/session/**/question/**/next`).as('nextQuestion');
  // http://localhost:3000/life/application/primary/disclosure-integration/10
  cy.intercept('POST', `/api/aura/v1/disclosure/session/**`).as('startDisclosure');
  cy.intercept('POST', `/api/life-main/v3/life_sessions/**/**/coverages`).as('coverage');
  cy.intercept('POST', `/api/life-main/v3/life_sessions/**/**/expenses`).as('expenses');
  cy.intercept('PATCH', `/api/life-main/v3/life_sessions/**`).as('lifeSessions');
  cy.intercept('POST', `/api/life-main/v3/simplified_life/start_app/**`).as('createSimplifiedLifeApp');
  cy.intercept('POST', '/api/life-main/v3/simplified_life/post_decision_records/**').as('createSimplifiedLifePolicy');
  cy.intercept('PATCH', `/api/ci-main/v1/ci_sessions/**`).as('ciSessions');
  cy.intercept('PUT', '**/api/global-accounts/v1/user/**/consent').as('consent');
  // no need to actually call segment
  cy.intercept('POST', 'https://api.segment.io/v1/t', (req) => {
    const body = JSON.parse(req.body);
    const event = body.event;
    if (Object.values(SEGMENT_EVENTS).includes(event) && !SEGMENT_EVENTS_EXCLUDED.includes(event)) {
      req.alias = 'segmentTrack';
    }
    req.reply({
      statusCode: 200,
      body: { success: true },
    });
  });
  cy.intercept('POST', 'https://api.segment.io/v1/p', {
    statusCode: 200,
    body: { success: true },
  }).as('segmentPage');
  cy.intercept('POST', 'https://api.segment.io/v1/i', {
    statusCode: 200,
    body: { success: true },
  }).as('segmentIdentify');
  cy.intercept('GET', `/api/global-main/v1/email/**`, (req) => {
    req.continue((res) => {
      // Make email verification pass for cypress test cases
      // Cypress emails are considered invalid eg: qa_testcase1_<datetime>+<modifier>@policyme.com
      res.body.data = {
        ...res.body.data,
        reason: 'accepted_email',
        result: 'deliverable',
        sendex: 0.892,
      };
    });
  }).as('verifyEmail');
  cy.intercept('PATCH', `/api/global-analytics/v1/utm/**`).as('utm');
  cy.intercept('PATCH', `/api/global-main/v1/household_infos/**`).as('householdInfos');
  cy.intercept('PUT', `/api/global-main/v1/household_infos/**/*`).as('putHouseholdInfos');
  cy.intercept('PATCH', `/api/global-main/v1/household_infos/**/*`).as('patchHouseholdInfos');
  cy.intercept('POST', `/api/life-main/v3/life_apps/session/*`).as('lifeApps');
  cy.intercept('PATCH', `/api/life-main/v3/life_apps`).as('patchLifeApps');
  cy.intercept('POST', `/api/ci-main/v1/ci_apps/session/**`).as('ciApps');
  cy.intercept('PATCH', `/api/life-main/v3/life_apps/**`).as('patchLifeAppsLongUrl');
  cy.intercept('POST', `/api/life-main/v3/life_apps/**`).as('sendLifeApp');
  cy.intercept('PATCH', `/api/ci-main/v1/ci_apps/**`).as('sendCiApp');
  const sessionIdToNumCrmSyncCalls = {}; // Track all session ids for dif products or for joint apps
  const whitelistedCrmSyncCallPages = ['Life - /life/start-app']; // Allow empty crm sync on these pages
  cy.intercept('POST', `/api/global-main/v1/crm`).as('crm');
  cy.intercept('POST', `/api/life-main/v3/life_policies/**`).as('lifePolicies');
  cy.intercept('POST', `/api/ci-main/v1/ci_policies/**`).as('ciPolicies');
  cy.intercept('POST', `/api/global-main/v1/aura_authorization/*`).as('auraAuthorization');
  cy.intercept('POST', `/api/aura/v1/decision/**`).as('auraDecision');
  cy.intercept('PATCH', `/api/life-main/v3/life_policies/**`).as('patchLifePolicies');
  cy.intercept('POST', `/api/global-payments/v1/user/**/customer/**`).as('payment');
  cy.intercept('POST', `/api/global-payments/v1/user/**/customer/**/subscription-and-finalize`).as('createLifeCISubscription');
  cy.intercept('POST', `/api/global-payments/v1/user/**/customer/**/hd-subscription-and-finalize`).as('createHDSubscription');
  cy.intercept('POST', `/api/global-docusign/v1/envelope`).as('generateDocusign');
  cy.intercept('POST', `/api/global-docusign/v1/envelope/*`, (req) => {
    // Cypress removes origin from requests and our backend depends on that to generate the url
    // Intercept req to add origin so that docusign redirect for cypress
    // works to redirect back to the origin domain
    // https://docs.cypress.io/api/commands/intercept#Using-the-routeHandler-function
    let headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    headers.origin = Cypress.env('baseURL');
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('submitDocusign');
  cy.intercept('/life/docusign/application/**/callback*').as('docusignCallback');
  cy.intercept('GET', `/api/global-main/v1/policy/**/journey`).as('rehydrateJourney');
  cy.intercept('POST', 'https://secure.myhelcim.com/js/').as('helcim');
  cy.intercept('GET', 'https://js.stripe.com/v3/.deploy_status_henson.json').as('stripeLoad');
  cy.intercept('POST', '**/api/global-payments/v1/user/*/customer/*/setup-intent').as('setupIntent');
  cy.intercept('POST', '**/api/global-payments/v1/user/*/customer').as('createCustomer');
  cy.intercept('POST', 'https://api.stripe.com/v1/setup_intents/**/confirm').as('stripe');
  cy.intercept('GET', `/api/life-main/v3/followup/timeslots?followup_type=5`, 'fixture:followUpTimes').as('followUpTimes');
  cy.intercept('PATCH', `/api/ci-main/v1/ci_policies/**`).as('patchCiPolicies');
  cy.intercept('GET', `/api/global-main/v1/affiliate/**`).as('affiliate');
  cy.intercept('GET', 'https://eng1.policyme.com/api/global-main/v1/policy/**').as('policy');
  cy.intercept('POST', `/api/global-main/v1/id-verification/**`).as('idVerification');
  cy.intercept('POST', '/api/global-accounts/v1/users').as('accounts');
  cy.intercept('POST', '/api/global-accounts/v1/auth0/email', (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('sendAuth0Email');
  cy.intercept('POST', '/api/global-accounts/v1/email_link/**/validate', (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('validateEmailLink');
  cy.intercept('POST', '**/api/global-accounts/v1/auth0/otp/*', (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('sendOtp');
  cy.intercept('POST', '**/api/global-accounts/v1/auth0/otp/verify/*', (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('verifyOtp');
  cy.intercept('GET', 'https://api.ipregistry.co', (req) => {
    // Force an Ontario response so we don't need cookie consent
    req.reply({
      location: {
        region: {
          code: 'CA-ON',
          name: 'Ontario',
        },
      },
    });
  }).as('ipRegistry');
  cy.intercept('POST', /\/api\/hd-quotes\/v(\d+)\/*/).as('hd-quotes');
  cy.intercept('POST', '/api/global-hbm/v1/plan_member/**').as('postEnrolHbmPlanMember');

  cy.intercept('POST', '/api/global-main/v1/policy/digital_consent_status/**', (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('digitalConsentStatus');
  cy.intercept('POST', /\/api\/(global-documents|lci-documents)\/v1\/upload-digital-consent\//, (req) => {
    const headers = {
      ...(req.headers || {}),
      'X-integration-test': Cypress.env('CLIENT_INTEGRATION_TEST_KEY'),
    };
    // eslint-disable-next-line no-param-reassign
    req.headers = headers;
  }).as('uploadDigitalConsent');
  cy.intercept('POST', /\/api\/(global-documents|lci-documents)\/v1\/digital-consent\/validate-document-generation\//).as('validateDocumentGeneration');
  cy.intercept('POST', '/api/life-main/v3/life_policies/**/beneficiaries').as('postBeneficiaries');
  cy.intercept('POST', '/api/life-main/v3/life_policies/**/generate-renewals').as('generateRenewalsLife');
  cy.intercept('POST', '/api/ci-main/v1/ci_policies/**/generate-renewals').as('generateRenewalsCi');
});

Cypress.Commands.add('geoLocationQuebec', (options) => {
  cy.intercept('GET', 'https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location', (req) => {
    req.reply({
      continent: options.continent,
      country: options.country,
      state: options.state,
      stateName: options.stateName,
    });
  }).as('geoLocationQuebec');
});

Cypress.Commands.add('acceptCookie', () => {
  cy.get('button[id="onetrust-accept-btn-handler"]').click();
});

Cypress.Commands.add('waitUntilHasOne', (datacyTag) => {
  let attempt = 0;
  function wrapper(datacyTagInner) {
    cy.get(`[data-cy=${datacyTagInner}]`, { timeout: 20000 })
      .then(($button) => {
        if ($button.length !== 1) {
          attempt++;
          if (attempt < MAX_RETRIES) {
            cy.wait(RETRY_INTERVAL);
            wrapper(datacyTagInner);
          }
        }
      });
  }
  wrapper(datacyTag);
});

Cypress.Commands.add('setABTest', (isCaa = false, testBand = null) => {
  const band = testBand ?? Cypress.env('abTestBand') ?? 'control';
  cy.task('log', `setABTest band: ${band}`);
  const domain = isCaa ? Cypress.env('baseURL').replace('https://', '') : Cypress.env('domain');
  cy.setCookie('ab_test_band', band, { domain });
});

Cypress.Commands.add('ifABTestEnabled', (test_config, isCaa, callback) => {
  cy.getCookie('ab_test_band').then(band => {
    if (test_config.testBands.includes(band)) {
      callback();
    }
  });

  const domain = isCaa ? Cypress.env('baseURLCAA').replace('https://', '') : Cypress.env('domain');
  // Adding here because of the new AB testing framework. 'a' is control group (i.e. no AB test)
  cy.setCookie('ab_test_99', 'a', { domain });
});

Cypress.Commands.add('stubWindowOpen', () => {
  // Get window object
  cy.window().then((win) => {
    // Replace window.open(url, target)-function with our own arrow function
    cy.stub(win, 'open').callsFake(url => {
      // change window location to be same as the popup url
      // eslint-disable-next-line no-param-reassign
      win.location.href = url;
    }).as('popup'); // alias it with popup, so we can wait refer it with @popup
  });
});

Cypress.Commands.add('urlEndsWith', (expected, option) => {
  cy.url(option).should(url => {
    expect(url.endsWith(expected)).to.equal(true);
  });
});

Cypress.Commands.add('moveSlider', (nativeInputValueSetter, datacyTag, value) => {
  cy.get(`[data-cy=${datacyTag}]`).then(slider => {
    nativeInputValueSetter.call(slider[0], value);
    slider[0].dispatchEvent(new Event('change', { value, bubbles: true }));
  });
});

Cypress.Commands.add('SubmitForm', (formName = null) => {
  if (formName) {
    cy.get(`[data-cy="${formName} form"]`).within(form => {
      cy.get('[data-cy=submit]')
        .last()
        .click();
    });
  } else {
    cy.get('[data-cy=submit]')
      .last()
      .click();
  }
});

Cypress.Commands.add('DesignSystemSubmitForm', (formName = null) => {
  if (formName) {
    cy.get(`[data-cy="${formName}"]`).within(form => {
      cy.get('[data-cy=submit]:visible')
        .click();
    });
  } else {
    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('ClickLabelAndType', (datacyTag, text, options) => {
  cy.task('log', `ClickLabelAndType [data-cy=${datacyTag}]`);
  cy.waitUntilHasOne(`${datacyTag}`);
  cy.get(`[data-cy=${datacyTag}]`, options)
    .click({ scrollBehavior: 'center', force: true }) // Prevent element from being hidden behind progress bar
    .type(text);
});

Cypress.Commands.add('ClearAndType', (datacyTag, text, options) => {
  cy.task('log', `ClearAndType [data-cy=${datacyTag}]`);
  cy.get(`[data-cy=${datacyTag}]`, options)
    .click({ scrollBehavior: 'center', force: true });
  cy.get(`[data-cy=${datacyTag}]`)
    .type(`{selectall}{backspace}${text}`, { scrollBehavior: 'center', force: true }); // Prevent element from being hidden behind progress bar
});

Cypress.Commands.add('TypeInSelect', (datacyTag, text) => {
  cy.get(`[data-cy=${datacyTag}]`)
    .children('.select-option') // in future if react-select is updated, might need to change these so it goes down from the data-cy parent to the input
    .children('.react-select__control')
    .children('.react-select__value-container')
    .children()
    .eq(1) // this is used to get to a div which contains the input.
    // .eq(1) is used as in dev.policyme.com this div has no unique
    // properties so it can't be targeted that way
    .children('.react-select__input')
    .children('input')
    .type(`${text}{enter}`);
});

Cypress.Commands.add('ClickInSelect', (datacyTag, menuOption, options) => {
  cy.task('log', `ClickInSelect [data-cy=${datacyTag}]`);
  cy.get(`[data-cy=${datacyTag}]`).scrollIntoView();
  cy.get(`[data-cy=${datacyTag}]:visible`, options)
    .children('[class*=-container]') // in future if react-select is updated, might need to change the path to select desired element
    .children('.react-select__control')
    .children('.react-select__indicators')
    .children('.react-select__indicator')
    .click({ force: true }); // clicks on this element, causing drop down list to appear

  cy.get('.react-select__menu')
    .contains(`${menuOption}`) // find child of that contains the desired option
    .click({ force: true });
});

Cypress.Commands.add('DesignSystemClickInSelect', (datacyTag, menuOption, options) => {
  cy.task('log', `ClickInSelect [data-cy=${datacyTag}]`);
  cy.get(`[data-cy=${datacyTag}]`).click({ force: true });
  cy.get('.MuiAutocomplete-popper') // The container of the dropdown options
    .within(() => {
      // Find and click the desired item in the dropdown
      cy.contains('li', menuOption).click({ force: true }); // Replace 'Desired Item' with the actual item text
    });
});

Cypress.Commands.add('ClickFirstInSelect', (datacyTag, option) => {
  cy.get(`[data-cy=${datacyTag}]`)
    .children('[class*=-container]') // in future if react-select is updated, might need to change the path to select desired element
    .children('.react-select__control')
    .click({ force: true }); // clicks on this element, causing drop down list to appear

  cy.get(`[data-cy=${datacyTag}]`)
    .children('[class*=-container]')
    .children('.react-select__menu')
    .find('.react-select__option')
    .first()
    .click({ force: true });
});

Cypress.Commands.add('ClickFirstInSelectFriday', (datacyTag, option) => {
  cy.get(`[data-cy=${datacyTag}]`)
    .children('[class*=-container]')
    .children('.react-select__control')
    .click({ force: true }); // clicks on this element, causing drop down list to appear

  cy.get(`[data-cy=${datacyTag}]`)
    .children('[class*=-container]')
    .children('.react-select__menu')
    .find('.react-select__option')
    .contains('Friday')
    .first()
    .click();
});

Cypress.Commands.add('ChooseFromSelect', (datacyTag, option) => {
  cy.IsSmUp().then((isSmallScreen) => {
    if (isSmallScreen) {
      cy.ClickInSelect(datacyTag, option);
    } else {
      cy.TypeInSelect(datacyTag, option);
    }
  });
});

Cypress.Commands.add('TypeAndClickInSelect', (datacyTag, option) => {
  cy.get(`[data-cy=${datacyTag}]`)
    .children('.select-option') // in future if react-select is updated, might need to change these so it goes down from the data-cy parent to the input
    .children('.react-select__control')
    .children('.react-select__value-container')
    .children('[class*=css]')
    .children('.react-select__input')
    .children('input')
    .type(`${option}`, { force: true });
  cy.get(`[data-cy=${datacyTag}]`)
    .children('[class*=-container]')
    .children('.react-select__menu')
    .contains(`${option}`, { timeout: 20000 }) // find child of that contains the desired option
    .click({ force: true });
});

Cypress.Commands.add('DesignSystemTypeAndClickInSelect', (datacyTag, option) => {
  cy.task('log', `DesignSystemTypeAndClickInSelect [data-cy=${datacyTag}]`);
  cy.get(`[data-cy=${datacyTag}]`).click({ force: true });
  cy.get(`[data-cy=${datacyTag}]`).type(option);
  cy.wait(200);
  cy.get('.MuiAutocomplete-popper') // The container of the dropdown options
    .within(() => {
      // Find and click the desired item in the dropdown
      cy.contains('li', option).click({ force: true }); // Replace 'Desired Item' with the actual item text
    });
});

Cypress.Commands.add('Citizenship', (isCanadianCitizen) => {
  cy.task('log', 'Citizenship');
  // cy.wait(1000); // to account for extra loading time
  if (isCanadianCitizen === 'Y') {
    cy.get('[data-cy=citizenship-citizen]', { timeout: 15000 })
      .click();
  } else if (isCanadianCitizen === 'N') {
    cy.get('[data-cy=citizenship-non_citizen]', { timeout: 15000 })
      .click();
  }
});

Cypress.Commands.add('Residency', (residency, prevCountryResidence, dateOfEntry) => {
  cy.task('log', 'Residency');
  if (residency === 'Permanent Resident') {
    cy.ClickInSelect('residencyStatus', residency);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else {
    cy.ClickInSelect('residencyStatus', residency);
    cy.ClickInSelect('previousCountryResidence', prevCountryResidence);
    cy.get('[data-cy=permResDate_label]')
      .click()
      .type(dateOfEntry, { delay: 100 });
    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('ResidencyBMO', (residency, dateOfEntry) => {
  cy.task('log', 'ResidencyBMO');
  cy.TypeInSelect('residencyStatus', residency);
  cy.get('[data-cy=permResDate_label]')
    .click()
    .type(dateOfEntry, { delay: 100 });
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('BirthLocation', (Country, provinceState) => {
  cy.task('log', 'BirthLocation');
  cy.DesignSystemClickInSelect('Country', getEnglishMessageWithId(COUNTRIES[Country].props.id));
  if (Country === 'US') {
    cy.DesignSystemClickInSelect('State', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[provinceState].props.id));
  } else if (Country === 'CA') {
    cy.DesignSystemClickInSelect('Province', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[provinceState].props.id));
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('BirthLocationJoint', (priCountry, priState, secCountry, secState) => {
  cy.task('log', 'BirthLocationJoint');
  const priCountryTranslated = getEnglishMessageWithId(COUNTRIES[priCountry].props.id);
  cy.DesignSystemClickInSelect('Country', priCountryTranslated);
  if (priCountry === 'US') {
    cy.DesignSystemClickInSelect('State', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[priState].props.id));
  } else if (priCountry === 'CA') { // More else ifs may be used to accomodate other countries as needed.
    cy.DesignSystemClickInSelect('Province', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[priState].props.id));
  }

  const secCountryTranslated = getEnglishMessageWithId(COUNTRIES[secCountry].props.id);
  cy.DesignSystemClickInSelect('partnerCountry', secCountryTranslated);
  cy.get('[data-cy="partnerCountry"]').scrollIntoView();
  if (secCountry === 'US') {
    cy.DesignSystemClickInSelect('secState', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[secState].props.id));
    cy.get('[data-cy="secState"]').scrollIntoView();
  } else if (secCountry === 'CA') {
    cy.DesignSystemClickInSelect('secProvince', getEnglishMessageWithId(BIRTHPLACE_JURISDICTION_TC[secState].props.id));
    cy.get('[data-cy="secProvince"]').scrollIntoView();
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('BirthLocationML', (Country, state) => { // Country is the key for the desired Country in the COUNTRIES const, same with state
  cy.task('log', 'BirthLocationML');
  cy.ClickInSelect('Country', Country);
  if (Country === 'US') {
    cy.ClickInSelect('State', US_STATES[state]);
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('FullAddress', (addressObject, isExternal = false) => {
  cy.task('log', 'FullAddress');
  if (!isExternal) {
    cy.wait('@consent')
  }
  cy.ClickLabelAndType('Address', `${addressObject.address}{enter}`, { timeout: 20000 });
  if (addressObject.apartment) {
    cy.ClickLabelAndType('Apartment', `${addressObject.apartment}{enter}`);
  }
  cy.ClickLabelAndType('City', addressObject.city);
  cy.DesignSystemClickInSelect('addressProvince', getEnglishMessageWithId(PROVINCES[addressObject.province].props.id));
  cy.DesignSystemClickInSelect('addressCountry', getEnglishMessageWithId(COUNTRIES[addressObject.country].props.id));
  cy.ClickLabelAndType('postalCode', addressObject.postalCode);
  cy.get('[data-cy=address-submit]:visible')
    .click();
});

Cypress.Commands.add('FullAddressJoint', (sameAddress, addressObject) => {
  cy.task('log', 'FullAddressJoint');
  if (sameAddress === 'Y') {
    cy.get(`[data-cy=partner_same_address-${sameAddress}]`).click(); // same address, continue on app
    cy.get('[data-cy="submitPartnerSameAddress"]:visible').click();
  } else {
    cy.get(`[data-cy=partner_same_address-${sameAddress}]`).click(); // different address
    cy.get('[data-cy=submitPartnerSameAddress]:visible').click();
    cy.FullAddress(addressObject);
  }
});

Cypress.Commands.add('YearsAtAddress', (years) => {
  cy.task('log', 'YearsAtAddress');
  cy.ClickInSelect('yearsAtAddress', years);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('EmploymentIncome', (isEmployed, annualIncome) => {
  cy.task('log', 'EmploymentIncome');
  if (isEmployed === 'Y') {
    cy.get('[data-cy=employed-Y]')
      .click();
    cy.ClearAndType('income', annualIncome);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (isEmployed === 'N') {
    cy.get('[data-cy=employed-N]')
      .click();
  }
});

Cypress.Commands.add('EmploymentIncomeBMO', (isEmployed, employmentInfo) => {
  cy.task('log', 'EmploymentIncomeBMO');
  if (isEmployed === 'Y') {
    cy.get('[data-cy=employed-Y]')
      .click();
    cy.ClickLabelAndType('occupation', employmentInfo.occupation);
    cy.ClickLabelAndType('employerName', employmentInfo.employer);
    cy.ClickInSelect('employmentYears', employmentInfo.years);
    cy.ClickLabelAndType('employmentIndustry', employmentInfo.industry);
    cy.ClearAndType('income', employmentInfo.annualIncome);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (isEmployed === 'N') {
    cy.get('[data-cy=employed-N]')
      .click();

    cy.ClickLabelAndType('employmentStatus', employmentInfo.status);
    if (employmentInfo.status === 'Other') {
      cy.ClickLabelAndType('employmentStatusOther', employmentInfo.other);
    }
  }
});

Cypress.Commands.add('OtherIncome', (hasOtherIncome, otherIncomeAmount, otherIncomeSource) => {
  cy.task('log', 'OtherIncome');
  if (hasOtherIncome === 'Y') {
    cy.get('[data-cy=otherIncome-Y]')
      .click();
    cy.ClickLabelAndType('otherIncomeAmount', otherIncomeAmount);
    cy.ClickLabelAndType('otherIncomeSource', otherIncomeSource);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasOtherIncome === 'N') {
    cy.get('[data-cy=otherIncome-N]')
      .click();
  }
});

Cypress.Commands.add('Finances', (financesObject, residenceOwnership) => {
  cy.task('log', 'Finances');
  cy.ClearAndType('savingsAndInvestments', financesObject.savings);
  if (residenceOwnership === 'own' || residenceOwnership === 'expertPath') { // expertPath should be entered if they don't go through the advice journey and go straight to quotes
    cy.ClearAndType('homeValue', financesObject.homeValue);
    cy.ClearAndType('mortgage', financesObject.mortgage);
  }
  cy.ClearAndType('debts', financesObject.debts);
  cy.get('[data-cy=netWorth]')
    .invoke('text')
    .should('equal', `${financesObject.total}`);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('License', (requireLicense) => {
  cy.task('log', 'License');
  if (requireLicense === 'Y') {
    cy.get('[data-cy=workLicense-Y]')
      .click();
  } else if (requireLicense === 'N') {
    cy.get('[data-cy=workLicense-N]')
      .click();
  }
});

Cypress.Commands.add('LicenseRevoked', (wasLicenseRevoked, details) => {
  cy.task('log', 'LicenseRevoked');
  if (wasLicenseRevoked === 'Y') {
    cy.get('[data-cy=licenseRevoked-Y]')
      .click();
    cy.ClickLabelAndType('licenseRevokedReason', details);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (wasLicenseRevoked === 'N') {
    cy.get('[data-cy=licenseRevoked-N]')
      .click();
  }
});

Cypress.Commands.add('FinancialDifficulties', (hasFinancialDifficulties, details) => {
  cy.task('log', 'FinancialDifficulties');
  if (hasFinancialDifficulties === 'Y') {
    cy.get('[data-cy=financialDifficulties-Y]')
      .click();
    cy.ClickLabelAndType('financialDifficultyDetails', details);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasFinancialDifficulties === 'N') {
    cy.get('[data-cy=financialDifficulties-N]')
      .click();
  }
});

Cypress.Commands.add('Borrow', (willBorrow, borrowSource) => {
  cy.task('log', 'Borrow');
  if (willBorrow === 'Y') {
    cy.get('[data-cy=borrowForPolicy-Y]')
      .click();
    cy.ClickInSelect('borrowMoneySource', borrowSource);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willBorrow === 'N') {
    cy.get('[data-cy=borrowForPolicy-N]')
      .click();
  }
});

Cypress.Commands.add('FinanceEligibility', (acceptMaxCoverage) => {
  cy.task('log', 'FinanceEligibility');
  cy.wait('@quotes');
  cy.wait(1000); // needs more time for new monthly rate to be generated
  if (acceptMaxCoverage === 'Y') {
    cy.get('[data-cy=eligibility-confirm]')
      .click();
  } else if (acceptMaxCoverage === 'N') {
    cy.get('[data-cy=eligibility-cancel]')
      .click();
  }
  cy.wait('@lifeSessions');
  cy.wait('@patchLifeAppsLongUrl');
  cy.wait('@crm');
  cy.wait('@utm');
});

Cypress.Commands.add('adviceIntro', (hasPartner, partnerAge) => {
  cy.task('log', 'adviceIntro');
  cy.get('[data-cy=introNext]').click();
});

Cypress.Commands.add('advicePartner', (hasPartner, partnerAge) => {
  cy.task('log', 'advicePartner');
  if (hasPartner === 'Y') {
    cy.get('[data-cy=hasPartner-true]')
      .click();

    cy.ClickLabelAndType('partnerAge', partnerAge);
  } else if (hasPartner === 'N') {
    cy.get('[data-cy=hasPartner-false]')
      .click();
  }
  cy.get('[data-cy=partner-submit]:visible').click();
  cy.wait('@utm');
});

Cypress.Commands.add('adviceKids', (hasKids, childrenAges) => { // childrenAges is an array
  cy.task('log', 'adviceKids');
  if (hasKids === 'Y') {
    cy.get('[data-cy=hasKids-true]')
      .click()
      .then(() => {
        childrenAges.forEach((age, index) => {
          cy.get(`[data-cy=child-${index}]`)
            .type(age)
            .then(() => {
              if (index !== childrenAges.length - 1) {
                cy.get('[data-cy=addKid]')
                  .click();
              }
            });
        });
      });
  } else if (hasKids === 'N') {
    cy.get('[data-cy=hasKids-false]')
      .click();
  }
  cy.get('[data-cy=kids-submit]:visible').click();
});

Cypress.Commands.add('adviceKidsEducation', (payKidsEducation) => {
  cy.task('log', 'adviceKidsEducation');
  if (payKidsEducation === 'Y') {
    cy.get('[data-cy=cover_education-true]')
      .click();
    cy.get('[data-cy=kids-education-submit]:visible').click();
  } else if (payKidsEducation === 'N') {
    cy.get('[data-cy=cover_education-false]')
      .click();
    cy.get('[data-cy=kids-education-submit]:visible').click();
  }
});

Cypress.Commands.add('adviceKidsHousing', (willProvideHousing) => {
  cy.task('log', 'adviceKidsHousing');
  if (willProvideHousing === 'Y') {
    cy.get('[data-cy=childHousing-false]')
      .click();
  } else if (willProvideHousing === 'N') {
    cy.get('[data-cy=childHousing-true]')
      .click();
  }
  cy.get('[data-cy=kids-housing-submit]:visible').click();
});

Cypress.Commands.add('Birthdate', (birthdate, prefix) => {
  let [day, month, year] = birthdate.split(' ');
  cy.get(`[data-cy=${prefix}-month]`).scrollIntoView();
  cy.ClickInSelect(`${prefix}-month`, month);
  cy.ClickInSelect(`${prefix}-day`, day);
  cy.ClickInSelect(`${prefix}-year`, year);
});

Cypress.Commands.add('DesignSystemBirthdate', (birthdate, prefix) => {
  let [day, month, year] = birthdate.split(' ');
  cy.get(`[data-cy=${prefix}-month]`).scrollIntoView();
  cy.DesignSystemClickInSelect(`${prefix}-month`, month);
  cy.DesignSystemClickInSelect(`${prefix}-day`, day);
  cy.DesignSystemClickInSelect(`${prefix}-year`, year);
});

Cypress.Commands.add('adviceBirthdate', (birthdate) => {
  cy.task('log', 'adviceBirthdate');
  cy.DesignSystemBirthdate(birthdate, 'birthdate');
  cy.get('[data-cy=birthdate-submit]:visible')
    .click();
});

Cypress.Commands.add('quotesCopilotQuoteIntro', (birthdate, gender, province, smoke) => {
  cy.DesignSystemBirthdate(birthdate, 'primary_DOB');
  cy.get(`[data-cy="primary_userGender-${gender}"]`).click();
  cy.DesignSystemClickInSelect('primary_addressProvince', getEnglishMessageWithId(province.props.id));
  cy.get(`[data-cy="primary_Smoker-${smoke}"]`).click();
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotIntent', (intentDataCySuffix = 'mortgage-and-debts') => {
  cy.get(`[data-cy="quotes-copilot-intent-${intentDataCySuffix}"]`).click();
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotTransition', () => {
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotPartner', (hasPartner) => {
  const value = hasPartner === 'Y' ? 'true' : 'false';
  cy.get(`[data-cy="hasPartner-${value}"]`).click();
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotKids', (hasKids) => {
  const value = hasKids === 'Y' ? 'true' : 'false';
  cy.get(`[data-cy="hasKids-${value}"]`).click();
  cy.get('[data-cy="kids-submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotIncome', (income) => {
  cy.get('[data-cy="userIncome"]').type(income);
  cy.get('[data-cy="income-submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotResidence', (residence) => {
  cy.get(`[data-cy="residenceType-${residence.ownership}"]`).click();
  cy.get('[data-cy="mortgage"]').type(residence.mortgageBalance);
  cy.get('[data-cy="exps_residence"]').type(residence.monthly);
  cy.get('[data-cy="residence-submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotSavings', (savings, useSavingsForCI = true) => {
  const hasSavingsValue = savings.hasSavings === 'Y' ? 'true' : 'false';
  cy.get(`[data-cy="hasSavings-${hasSavingsValue}"]`).click();
  cy.get('[data-cy="retirementSavings"]').type(savings.retirementSavings);
  cy.get('[data-cy="nonRetirementSavings"]').type(savings.nonRetirementSavings);
  cy.get(`[data-cy="useSavingsForCI-${useSavingsForCI}"]`).click();
  cy.get('[data-cy="savings-submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotToRecommendation', () => {
  cy.get('[data-cy="submit"]:visible').click();
  cy.get('[data-cy="submit"]:visible').click();
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('quotesCopilotAfterRecommendation', (options) => {
  const { sliderIndex, termLength, firstName, lastName, email } = options;
  cy.GetPrice('total-monthly-price').as('priceFromQuotesPage');
  cy.get('[data-cy="life-coverage-edit"]').click();
  cy.DesiredCoverage(sliderIndex, termLength);
  cy.get('[data-cy="update-coverage-life"]')
    .scrollIntoView({ block: 'center', behavior: 'instant' })
    .click();
  cy.wait(1000);
  cy.get('[type="submit"]:visible').click();
  cy.wait(1000);
  cy.ClearAndType('firstName', firstName);
  cy.ClearAndType('lastName', lastName);
  cy.ClearAndType('email', email);
  cy.ScrollAndClickSubmit();
  cy.wait('@verifyEmail');
  cy.wait('@utm');
  cy.wait('@accounts');
  cy.wait('@patchHouseholdInfos');
  cy.wait('@lifeSessions');
  cy.wait('@lifeApps', { timeout: 30000 });
  cy.wait('@ciSessions');
  cy.wait('@ciApps', { timeout: 30000 });
});

Cypress.Commands.add('adviceGender', (gender) => { // gender is Male or Female
  cy.task('log', 'adviceGender');
  cy.get(`[data-cy=userGender-${gender}]`)
    .click();
  cy.get('[data-cy=gender-submit]:visible').click();
});

Cypress.Commands.add('adviceSmoker', (doesSmoke) => {
  cy.task('log', 'adviceSmoker');
  if (doesSmoke === 'Y') {
    cy.get('[data-cy=smoke-true]')
      .click();
  } else if (doesSmoke === 'N') {
    cy.get('[data-cy=smoke-false]')
      .click();
  }
  cy.get('[data-cy=smoker-submit]:visible').click();
});

Cypress.Commands.add('adviceHealth', (hasHealthCondition) => {
  cy.task('log', 'adviceHealth');
  if (hasHealthCondition === 'Y') {
    cy.get('[data-cy=health-true]')
      .click();
  } else if (hasHealthCondition === 'N') {
    cy.get('[data-cy=health-false]')
      .click();
  }
  cy.get('[data-cy=health-submit]:visible').click();
});

Cypress.Commands.add('clickSubmit', () => {
  cy.task('log', 'clickSubmit');
  cy.get('[data-cy="submit"]')
    .last()
    .scrollIntoView();
  cy.get('[data-cy="submit"]:visible')
    .click();
});

Cypress.Commands.add('selectInputFieldAndType', (id, text) => {
  cy.get(`input[id=${id}]`)
    .type(text, { force: true });
});

Cypress.Commands.add('hdSelectLitePlan', () => {
  cy.get('[data-cy="essential"]').click();
});

Cypress.Commands.add('checkHDConsent', (seeMyDecision = false) => {
  cy.get('[data-cy="submit-decision"]')
    .scrollIntoView()
    .click();
  cy.SegmentTrack(SEGMENT_EVENTS.APPLICATION_SUBMITTED, {});
  cy.wait('@auraDecision', { requestTimeout: 180000, responseTimeout: 180000 });
  cy.SegmentTrack(SEGMENT_EVENTS.DECISION_RECEIVED, {
    selected_monthly_premium: 'string',
    selected_coverage_amount: 'number',
  });
  if (seeMyDecision) {
    cy.get('[data-cy="see-my-decision"]:visible')
      .click();
  }
});

Cypress.Commands.add('adviceIncome', (myIncome, partnerIncome) => { // if case doesn't have a partner, partnerIncome shouldn't be entered
  cy.task('log', 'adviceIncome');
  cy.get('[data-cy=userIncome]')
    .type(myIncome);
  if (partnerIncome) {
    cy.get('[data-cy=partnerIncome]') // page where they entered they have a partner
      .type(partnerIncome);
  }
  cy.get('[data-cy=income-submit]:visible')
    .click();
});

Cypress.Commands.add('partnerIncome', (partnerIncome) => {
  cy.task('log', 'partnerIncome');
  cy.ClickLabelAndType('partnerAnnualIncome', partnerIncome);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('adviceResidence', (rentOrOwn, monthly, curBalance) => { // rentOrOwn should be 'rent' or 'own'
  cy.task('log', 'adviceResidence');
  if (rentOrOwn === 'rent') {
    cy.get('[data-cy=residenceType-rent]')
      .click();
  } else if (rentOrOwn === 'own') {
    cy.get('[data-cy=residenceType-own]')
      .click();

    cy.get('[data-cy=mortgage]')
      .type(curBalance);
  }
  cy.get('[data-cy=exps_residence]')
    .type(monthly);

  cy.get('[data-cy=residence-submit]:visible')
    .click();
});

Cypress.Commands.add('adviceExistingCoverage', (hasExistingCoverage, employerCoverage, myCoverage) => {
  cy.task('log', 'adviceExistingCoverage');
  if (hasExistingCoverage === 'Y') {
    cy.get('[data-cy=hasExistingCoverage-true]')
      .click();

    cy.get('[data-cy="existingCoverage.user.group"]')
      .type(employerCoverage);

    cy.get('[data-cy="existingCoverage.user.individual"]')
      .type(myCoverage);
  } else if (hasExistingCoverage === 'N') {
    cy.get('[data-cy=hasExistingCoverage-false]')
      .click();
  }
  cy.get('[data-cy=existing-coverage-submit]:visible').click();
});

Cypress.Commands.add('quebecExistingCoverage', (hasExistingCoverage, employerCoverage, myCoverage) => {
  cy.task('log', 'quebecExistingCoverage');
  if (hasExistingCoverage === 'Y') {
    cy.get('[data-cy=existingPolicies-Y]')
      .click();

    cy.get('[data-cy="existingCoverage.user.group"]')
      .type(employerCoverage);

    cy.get('[data-cy="existingCoverage.user.individual"]')
      .type(myCoverage);
  } else if (hasExistingCoverage === 'N') {
    cy.get('[data-cy=existingPolicies-N]')
      .click();
  }
  cy.get('[data-cy=existing-policies-submit]:visible').click();
});

Cypress.Commands.add('adviceSavings', (hasSavings, retirementSavings, nonRetirementSavings) => {
  cy.task('log', 'adviceSavings');
  if (hasSavings === 'Y') {
    cy.get('[data-cy=hasSavings-true]')
      .click();

    cy.get('[data-cy=retirementSavings]')
      .type(retirementSavings);

    cy.get('[data-cy=nonRetirementSavings]')
      .type(nonRetirementSavings);
  } else if (hasSavings === 'N') {
    cy.get('[data-cy=hasSavings-false]')
      .click();
  }
  cy.get('[data-cy=savings-submit]:visible').click();
});

Cypress.Commands.add('Recommendation', (expectedCoverage, expectedYears) => {
  cy.task('log', 'Recommendation');
  cy.wait('@quotes');
  cy.get('[data-cy=recommended-coverage]:visible')
    .invoke('text')
    .then(removeComma)
    .should('eq', expectedCoverage);
  cy.get('[data-cy=recommended-term]')
    .invoke('text')
    .should('equal', expectedYears);
  cy.get('[data-cy=seePricesButton]').click();
});

Cypress.Commands.add('RecommendationJoint', (expectedCoverage, expectedYears) => {
  cy.task('log', 'RecommendationJoint');
  cy.wait('@coverage');
  cy.wait('@quotes');
  cy.wait('@crm');
  cy.wait('@lifeSessions');
  cy.get('[data-cy=recommended-coverage]:visible', { timeout: 50000 })
    .should(($el) => {
      const actualValue = removeComma($el.text());
      expect(actualValue).to.eq(expectedCoverage);
    });
  cy.get('[data-cy=recommended-term]')
    .invoke('text')
    .should('equal', expectedYears);
  cy.get('[data-cy=seePricesButton]')
    .first()
    .click();
  cy.wait('@quotes');
  cy.wait('@utm');
  cy.wait('@lifeSessions');
  cy.SegmentTrack(SEGMENT_EVENTS.RECOMMENDATION_RECEIVED, {
    recmd_cov_amt: 'number',
    cov_type: 'string',
    product_type: 'string',
  });
});

Cypress.Commands.add('RecommendationIndividualQuebec', (expectedCoverage, expectedYears) => {
  cy.task('log', 'RecommendationIndividualQuebec');
  cy.wait('@coverage');
  cy.wait('@quotes');
  cy.wait('@lifeSessions');
  cy.get('[data-cy=recommended-coverage]:visible', { timeout: 50000 })
    .should(($el) => {
      const actualValue = removeComma($el.text());
      expect(actualValue).to.eq(expectedCoverage);
    });
  cy.get('[data-cy=recommended-term]')
    .invoke('text')
    .should('equal', expectedYears);
  cy.get('[data-cy=seePricesButton]')
    .first()
    .click();
  cy.wait('@quotes');
  cy.wait('@utm');
  cy.wait('@lifeSessions');
  cy.SegmentTrack(SEGMENT_EVENTS.RECOMMENDATION_RECEIVED, {
    recmd_cov_amt: 'number',
    cov_type: 'string',
    product_type: 'string',
  });
});

Cypress.Commands.add('Quotes', (quotes, insurer, desiredPolicyLengthYears, desiredCoverageAmountSliderIndex) => { // quotes is an array of objects
  cy.task('log', 'Quotes');
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  cy.moveSlider(nativeInputValueSetter, 'amountSlider', desiredCoverageAmountSliderIndex);
  cy.get(`[data-cy=availableTerms-${desiredPolicyLengthYears}]`).click();
  quotes.forEach((quote) => { // check that quotes shown match those that
    // are given in network response
    cy.get(`[data-cy=policyCompanyLogo-${quote.company}]`)
      .should('have.attr', 'alt')
      .should('eq', quote.company);

    if (quote.available === true) {
      cy.get(`[data-cy=policyCost-${quote.company}]`)
        .invoke('text')
        .then(str => {
          const number = parseFloat(str.substring(1, str.search('per')));
          return number;
        })
        .should('be.within', 0, 5000);
    } else { // Company not offering life insurance or quote for this person, coverage and length
      cy.get(`[data-cy=policyNotOffered-${quote.company}]`)
        .should('exist');
    }
  });
  // cy.wait(2000); // prevents bug where it will click on another insurer
  cy.get(`[data-cy=${insurer}]`, { timeout: 5000 })
    .click();
});

Cypress.Commands.add('ReplaceExistingPolicies', (willReplaceExistingPolicies, toBeReplacedPolicies) => { // toBeReplacedPolicies is an array of objects
  cy.task('log', 'ReplaceExistingPolicies');
  if (willReplaceExistingPolicies === 'Y') {
    cy.get('[data-cy=replacePolicies-Y]')
      .click();
    const replaceReasons = {
      cheaper: REPLACE_POLICY_REASONS.CHEAPER,
      duration: REPLACE_POLICY_REASONS.LONGER,
      coverage: REPLACE_POLICY_REASONS.MORE_COVERAGE,
      expiring: REPLACE_POLICY_REASONS.EXPIRING,
      split: REPLACE_POLICY_REASONS.SPLIT_JOINT,
      nonCanadian: REPLACE_POLICY_REASONS.NON_CANADIAN,
    };
    toBeReplacedPolicies.forEach((policy) => {
      cy.get(`[data-cy=policy-${policy.insurer}-${policy.coverageAmount}]`)
        .click({ force: true });
      policy.replaceReasons.forEach((reason) => {
        cy.get(`[data-cy=policy-${policy.insurer}-${policy.coverageAmount}-reason-${replaceReasons[reason]}]`)
          .click({ force: true });
      });
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willReplaceExistingPolicies === 'N') {
    cy.get('[data-cy=replacePolicies-N]')
      .click();
  }
});

Cypress.Commands.add('SecondaryBeneficiariesDeleteExisting', (wantSecondaryBeneficiaries, secondaryBeneficiaries) => {
  // In testcase 8 and 9, multiple secondary beneficiaries are already loaded with
  // blank fields, so this command
  // is used to click on the delete button for each of those before adding
  // the number of secondary beneficiairies desired.
  cy.task('log', 'SecondaryBeneficiariesDeleteExisting');
  if (wantSecondaryBeneficiaries === 'Y') {
    cy.get('[data-cy=secondaryBeneficiaries-Y]')
      .click();
    cy.get('[data-cy*="secondaryBeneficiaryDelete-"]').each((val, index) => {
      if (index !== 0) {
        cy.get(`[data-cy=secondaryBeneficiaryDelete-${index}]`)
          .click();
      }
    });
    secondaryBeneficiaries.forEach((secondaryBeneficiary, index) => {
      cy.get(`[data-cy=secondaryBeneficiary-${index}]`)
        .type(secondaryBeneficiary.name);
      cy.ChooseFromSelect(`secondaryBeneficiaryRelationship-${index}`, secondaryBeneficiary.relationship);
      cy.ClearAndType(`secondaryBeneficiaryPercent-${index}`, secondaryBeneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${secondaryBeneficiary.is_minor}"]`).click();
      if (index !== secondaryBeneficiaries.length - 1) {
        cy.get('[data-cy=addSecondaryBeneficiary]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (wantSecondaryBeneficiaries === 'N') {
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
});

Cypress.Commands.add('Contact', (phoneNumber) => {
  cy.task('log', 'Contact');
  cy.ClickLabelAndType('phoneNumber', phoneNumber, { timeout: 10000 });
  cy.screenshot('contact');
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('PartnerContact', (partnerFirstName, partnerLastName, partnerEmail) => {
  cy.task('log', 'PartnerContact');
  cy.ClickLabelAndType('partnerFirstName', partnerFirstName, { timeout: 10000 });
  cy.ClickLabelAndType('partnerLastName', partnerLastName, { timeout: 10000 });
  cy.ClickLabelAndType('partnerEmail', partnerEmail, { timeout: 10000 });
  cy.screenshot('partner contact');
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('PartnerEmail', (partnerEmail) => {
  cy.task('log', 'partnerEmail');
  cy.ClickLabelAndType('partnerEmail', partnerEmail, { timeout: 10000 });
  cy.screenshot('partner email');
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('Referrer', (addReferrer, referrer, productType) => { // referrer is an object
  cy.task('log', 'Referrer');
  if (addReferrer === 'Y') {
    cy.DesignSystemClickInSelect('referrerSource', referrer.source, { timeout: 10000 }); // prevent flaky test where referrerSource cannot be found
    if (
      referrer.source === 'Other'
      || referrer.source === 'Podcast'
      || referrer.source === 'Influencer'
    ) {
      cy.ClickLabelAndType('referrerOther', referrer.other);
    }
    cy.screenshot('add referrer');
    cy.get('[data-cy=submit]:visible')
      .click();
  } else {
    // allow previous verify call to finish
    // cy.wait(500);
    cy.screenshot('skip referrer');
    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('Interest', (addInterest, interest, productType) => { // interest is an object
  cy.task('log', 'Interest');
  if (addInterest === 'Y') {
    cy.get(`[data-cy=user-interest-${interest.source}]`).click({ force: true });
    cy.screenshot('add interest');
    cy.ScrollAndClickSubmit();
  } else {
    // allow previous verify call to finish
    // cy.wait(500);
    cy.screenshot('skip interest');
    cy.ScrollAndClickSubmit();
  }

  if (productType === PM_PRODUCT_PREFIX.LIFE) {
    cy.wait('@sendLifeApp');
  } else if (productType === PM_PRODUCT_PREFIX.CI) {
    cy.wait('@sendCiApp');
  }

  cy.wait('@householdInfos');
});

Cypress.Commands.add('Questions', (comment) => {
  cy.task('log', 'Questions');
  // cy.wait(250);
  if (comment) {
    cy.get('[data-cy=questionsOrComments]')
      .type(comment);
  } else {
    cy.wait(250);
  }
  cy.screenshot('questions');
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('EmploymentIncomeWW', (isEmployed, employmentInfo) => {
  cy.task('log', 'EmploymentIncomeWW');
  if (isEmployed === 'Y') {
    cy.get('[data-cy=employed-Y]')
      .click();
    cy.get('[data-cy=occupation]')
      .type(employmentInfo.occupation);
    cy.get('[data-cy=employerName]')
      .type(employmentInfo.employer);
    cy.ClearAndType('income', employmentInfo.annualIncome);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (isEmployed === 'N') {
    cy.get('[data-cy=employed-N]')
      .click();

    cy.get('[data-cy=employmentStatus]')
      .type(employmentInfo.status);
    if (employmentInfo.status === 'Other') {
      cy.get('[data-cy=employmentStatusOther]')
        .type(employmentInfo.other);
    }
  }
});

Cypress.Commands.add('BankruptcyWW', (hasDeclaredBankruptcy, bankruptcyDetails) => {
  cy.task('log', 'BankruptcyWW');
  if (hasDeclaredBankruptcy === 'Y') {
    cy.get('[data-cy=bankruptcy-Y]')
      .click();
    cy.get('[data-cy=bankruptcyDetails]')
      .type(bankruptcyDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasDeclaredBankruptcy === 'N') {
    cy.get('[data-cy=bankruptcy-N]')
      .click();
  }
});

Cypress.Commands.add('SubstanceUse', (hasAbusedSubstances) => {
  cy.task('log', 'SubstanceUse');
  if (hasAbusedSubstances === 'Y') {
    cy.get('[data-cy=substanceUse-Y]')
      .click();
  } else if (hasAbusedSubstances === 'N') {
    cy.get('[data-cy=substanceUse-N]')
      .click();
  }
});

Cypress.Commands.add('adviceDebts', (hasDebts, debtObject) => {
  cy.task('log', 'adviceDebts');
  if (hasDebts === 'Y') {
    cy.get('[data-cy=hasDebts-true]')
      .click();

    cy.get('[data-cy=creditCards]')
      .type(debtObject.creditCardDebt);

    cy.get('[data-cy=studentLoans]')
      .type(debtObject.studentLoans);

    cy.get('[data-cy=homeEquityLoans]')
      .type(debtObject.homeEquityLoans);

    cy.get('[data-cy=linesOfCredit]')
      .type(debtObject.linesOfCredit);

    cy.get('[data-cy=otherDebt]')
      .type(debtObject.otherDebt);
  } else if (hasDebts === 'N') {
    cy.get('[data-cy=hasDebts-false]')
      .click();
  }
  cy.get('[data-cy=debts-submit]:visible').click();
});

Cypress.Commands.add('adviceExpenses', (expensesObject) => {
  cy.task('log', 'adviceExpenses');
  cy.get('[data-cy=rentMorgage]:visible')
    .should('be.disabled')
    .and('have.value', `${addComma(expensesObject.rentMortgage)}`);
  cy.wait('@expenses'); // If we enter expenses too early, we run into unpredictable behaviour
  cy.wait('@lifeSessions');
  cy.wait(1000);
  cy.ClearAndType('utilitiesExpenses', expensesObject.utilities);
  cy.ClearAndType('telecomExpenses', expensesObject.telecom);
  cy.ClearAndType('foodExpenses', expensesObject.food);
  cy.ClearAndType('shoppingExpenses', expensesObject.shopping);
  cy.ClearAndType('transportationExpenses', expensesObject.transportation);
  cy.ClearAndType('childcareExpenses', expensesObject.childcare);
  cy.ClearAndType('discretionaryExpenses', expensesObject.discretionary);
  cy.ClearAndType('otherExpenses', expensesObject.other);

  cy.get('[data-cy=totalExpenses]')
    .invoke('text')
    .should('equal', `${addComma(expensesObject.rentMortgage + expensesObject.utilities + expensesObject.telecom + expensesObject.food + expensesObject.shopping + expensesObject.transportation + expensesObject.childcare + expensesObject.discretionary + expensesObject.other)}`);

  cy.get('[data-cy=expenses-submit]')
    .scrollIntoView({ multiple: true });
  cy.get('[data-cy=expenses-submit]:visible')
    .click();
});

Cypress.Commands.add('adviceEmail', (firstName, email) => {
  cy.task('log', 'adviceEmail');
  cy.ClickLabelAndType('firstName', firstName);
  cy.ClickLabelAndType('email', email);

  cy.get('[data-cy=recommendation-submit]:visible')
    .click();
  cy.wait('@householdInfos');
});

Cypress.Commands.add('exclusivePerkDiscountQuotes', () => {
  cy.get('[data-cy=exclusivePerk2MonthsFreeText]:visible')
    .should('have.length', 1)
    .should('have.text', 'First 2 months free');
});

Cypress.Commands.add('exclusivePerkDiscountRateBreakdown', () => {
  cy.get('[data-cy=exclusivePerkDiscountText]')
    .should('have.length', 1)
    .should('have.text', 'First 2 months:');
  cy.get('[data-cy=exclusivePerkDiscountValue]')
    .should('have.length', 1)
    .should('have.text', 'FREE');
});

Cypress.Commands.add('DesiredCoverage', (desiredCoverageAmountSliderIndex, desiredPolicyLengthYears) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

  const policyLengthIndex = [10, 15, 20, 25, 30, 100]; // 100 is for permlife
  cy.get('[data-cy=rangeSlider]').invoke('attr', 'value').then(value => {
    if (parseInt(desiredPolicyLengthYears, 10) !== policyLengthIndex[value]) {
      cy.moveSlider(nativeInputValueSetter, 'rangeSlider',
        policyLengthIndex.findIndex((term) => term === parseInt(desiredPolicyLengthYears, 10)));
      cy.wait('@quotes');
    }
  });

  cy.get('[data-cy=amountSlider]').invoke('attr', 'value').then(value => {
    if (desiredCoverageAmountSliderIndex !== parseInt(value, 10)) {
      cy.moveSlider(nativeInputValueSetter, 'amountSlider', desiredCoverageAmountSliderIndex);
      cy.wait('@quotes');
    }
  });
});

Cypress.Commands.add('DesignSystemDesiredCoverage', (desiredCoverageAmountSliderIndex, desiredPolicyLengthYears, isSenior = false) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

  const policyLengthIndex = [10, 15, 20, 25, 30, 100]; // 100 is for permlife
  cy.get('[data-cy=rangeSlider]').invoke('attr', 'value').then(value => {
    if (parseInt(desiredPolicyLengthYears, 10) !== policyLengthIndex[value]) {
      cy.moveSlider(nativeInputValueSetter, 'rangeSlider',
        policyLengthIndex.findIndex((term) => term === parseInt(desiredPolicyLengthYears, 10)));
      cy.wait('@quotes');
    }
    if (desiredPolicyLengthYears === '100') {
      cy.get('[data-cy=CloseModalButton]:visible').click();
    }
  });

  let index100k = COVERAGE_AMOUNTS_SLIDER_OVER_51.indexOf(100000);
  let index50k = COVERAGE_AMOUNTS_SLIDER_OVER_51.indexOf(50000);
  let seniorOffset = index100k - index50k;

  cy.get('[data-cy=amountSlider]').invoke('attr', 'value').then(value => {
    if (desiredCoverageAmountSliderIndex !== parseInt(value, 10)) {
      cy.moveSlider(nativeInputValueSetter, 'amountSlider', isSenior ? desiredCoverageAmountSliderIndex + seniorOffset : desiredCoverageAmountSliderIndex);
      cy.wait('@quotes');
    }
  });
});

Cypress.Commands.add('JointPolicySelection', (jointPolicy) => {
  cy.get('[data-cy=joint-partner-toggle')
    .click({ force: true });
  cy.Birthdate(jointPolicy.partnerBirthdate, 'jointDate');
  cy.get(`[data-cy=jointGender-${jointPolicy.partnerGender}]`)
    .click();
  cy.get(`[data-cy=jointSmoker-${jointPolicy.partnerSmoke}]`)
    .click();
  cy.get('[data-cy=joint-confirm]')
    .click();
});

Cypress.Commands.add('QuotesJoint', (
  quotes, insurer, desiredPolicyLengthYears, desiredCoverageAmount, jointObject,
) => { // quotes is an array of objects
  cy.task('log', 'QuotesJoint');
  cy.get('[data-cy=joint-true]')
    .click();
  cy.get('[data-cy=jointDate]')
    .type(jointObject.birthdate, { delay: 100 });
  cy.get(`[data-cy=jointGender-${jointObject.gender}]`)
    .click();
  cy.get(`[data-cy=jointSmoker-${jointObject.smoker}]`)
    .click();
  cy.get('[data-cy=joint-confirm]')
    .click();

  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  cy.moveSlider(nativeInputValueSetter, 'amountSlider', desiredCoverageAmount);
  cy.wait('@quotes');
  cy.get(`[data-cy=availableTerms-${desiredPolicyLengthYears}]`).click();
  quotes.forEach((quote) => { // check that quotes shown match those
    // that are given in network response
    cy.get(`[data-cy=policyCompanyLogo-${quote.company}]`)
      .should('have.attr', 'alt')
      .should('eq', quote.company);

    if (quote.available === true) {
      cy.get(`[data-cy=policyCost-${quote.company}]`)
        .invoke('text')
        .then(str => {
          const number = parseFloat(str.substring(1, str.search('per')));
          return number;
        })
        .should('be.within', 0, 7000);
    } else { // Company not offering life insurance or quote for this person, coverage and length
      cy.get(`[data-cy=policyNotOffered-${quote.company}]`)
        .should('exist');
    }
  });
  // cy.wait(1000); // prevents bug where it will click on another insurer due
  // to it targeting the correct button, but then the page moves so it clicks on another
  cy.get(`[data-cy=${insurer}]:visible`, { timeout: 5000 })
    .click();
});

Cypress.Commands.add('GetPrice', (dataTag) => {
  cy.get(`[data-cy=${dataTag}]`, { timeout: 180000 }).first()
    .invoke('text')
    .then(str => {
      return parseFloat(str.replace('$', '').replace('/mo', ''));
    });
});

Cypress.Commands.add('GetPriceAllProduct', (dataTag) => {
  let total = 0;
  cy.get(`[data-cy=${dataTag}]`, { timeout: 10000 }).each(($el) => {
    const text = $el.text();
    const price = parseFloat(text.replace('$', '').replace('/mo', ''));
    total += price;
  }).then(() => {
    return total;
  });
});

Cypress.Commands.add('ScrollAndClickSubmit', (dataTag = '') => {
  cy.get(`[data-cy=${dataTag || 'submit'}]`).last().scrollIntoView().click();
});

Cypress.Commands.add('StartApp', (
  firstName,
  lastName,
  email,
  experience = 'novice',
  productType = PM_PRODUCT_PREFIX.LIFE,
  requiresHydrationAtThisStep = true,
  isPerm = false,
  fromJourney = false,
  isSocialSignOnEnabled = false,
  isSenior = false,
) => {
  cy.task('log', 'StartApp');
  // Disable this before we grab the price for comparison
  cy.wait(4000); // time to generate estimated rate
  cy.GetPrice('estimated-rate-price').as('priceFromQuotesPage');
  if (isPerm) {
    cy.get('[aria-labelledby="termSelectPopup"]').should('be.visible');
    cy.get('[data-cy=CloseModalButton]').click();
  }
  cy.ScrollAndClickSubmit();
  if (isSenior) {
    cy.get('[data-cy="keep-current-coverage"]').click();
  }
  // This can be re-enabled on the start app page for start app links
  cy.SegmentTrack(SEGMENT_EVENTS.QUOTE_RECEIVED, {
    selected_coverage_amount: 'number',
    selected_term_length: 'number',
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
    discounts: 'string',
  });

  // if social sign on is enabled, we don't need to type in first name and last name
  if (!isSocialSignOnEnabled) {
    cy.ClearAndType('firstName', firstName);
    cy.ClearAndType('lastName', lastName);
  }

  cy.ClearAndType('email', email);
  cy.ScrollAndClickSubmit();
  cy.wait('@verifyEmail');
  cy.wait('@utm');
  if (!fromJourney) {
    cy.wait('@accounts');
  }
  cy.wait('@patchHouseholdInfos');
  if (productType === PM_PRODUCT_PREFIX.LIFE) {
    cy.wait('@lifeSessions');
    cy.wait('@lifeApps', { timeout: 30000 });
  } else if (productType === PM_PRODUCT_PREFIX.CI) {
    cy.wait('@ciSessions');
    cy.wait('@ciApps', { timeout: 30000 });
  }
  if (requiresHydrationAtThisStep) {
    /**
     * The journey will not always be rehydrated at the start app,
     * so making the change for backwards compatibility. For test case 3,
     * the ccg test case -- we have a different method of auth that
     * hydrates the journey after that auth is completed.
     */
    cy.wait('@rehydrateJourney', { timeout: 30000 });
  }
  cy.SegmentTrack(SEGMENT_EVENTS.LOGIN_INITIATED, {});
});

Cypress.Commands.add('StartMortgageApp', (firstName, lastName, email, experience = 'novice') => {
  cy.wait(2000); // time to generate estimated rate
  cy.GetPrice('estimated-rate-price').as('priceFromQuotesPage');
  cy.get('[data-cy="start-app-btn"]').click();
  cy.wait('@lifeSessions');
  cy.wait('@lifeApps');
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('JointStartApp', (
  firstName,
  lastName,
  email,
  partnerFirstName,
  partnerLastName,
  productType,
  fromJourney = false,
  isSocialSignOnEnabled = false,
  isSenior = false,
) => {
  cy.task('log', 'JointStartApp');
  // Disable this before we grab the price for comparison
  cy.DisableSept2025Promo();
  cy.wait(4000); // time to generate estimated rate
  cy.GetPrice('estimated-rate-price').as('priceFromQuotesPage');
  cy.get('[data-cy=submit]').first().click({ force: true });
  if (isSenior) {
    cy.get('[data-cy="keep-current-coverage"]').click();
  }
  // This can be re-enabled on the start app page for start app links
  cy.DisableSept2025Promo();
  cy.SegmentTrack(SEGMENT_EVENTS.QUOTE_RECEIVED, {
    selected_coverage_amount: 'number',
    selected_term_length: 'number',
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
    discounts: 'string',
    partner_birthdate: 'string',
  });
  cy.SegmentTrack(SEGMENT_EVENTS.QUOTE_RECEIVED, {
    selected_coverage_amount: 'number',
    selected_term_length: 'number',
    selected_monthly_premium: 'string',
    selected_yearly_premium: 'string',
    discounts: 'string',
    partner_birthdate: 'string',
  });

  if (!isSocialSignOnEnabled) {
    cy.ClearAndType('firstName', firstName);
    cy.ClickLabelAndType('lastName', lastName);
  }
  cy.ClearAndType('email', email);

  if (!isSocialSignOnEnabled) {
    cy.ClickLabelAndType('partnerFirstName', partnerFirstName);
    cy.ClickLabelAndType('partnerLastName', partnerLastName);
  }
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@verifyEmail');
  cy.wait('@utm');
  if (!fromJourney) {
    cy.wait('@accounts');
  }
  cy.wait('@patchHouseholdInfos');
  if (productType === PM_PRODUCT_PREFIX.LIFE) {
    cy.wait('@lifeSessions');
    cy.wait('@lifeApps', { timeout: 30000 });
  } else if (productType === PM_PRODUCT_PREFIX.CI) {
    cy.wait('@ciSessions');
    cy.wait('@ciApps', { timeout: 30000 });
  }
  cy.SegmentTrack(SEGMENT_EVENTS.LOGIN_INITIATED, {});
});

Cypress.Commands.add('BasicDetails', (
  firstName,
  lastName,
  partnerFirstName = undefined,
  partnerLastName = undefined,
) => {
  cy.task('log', 'BasicDetails');
  cy.ClearAndType('firstName', firstName);
  cy.ClickLabelAndType('lastName', lastName);

  if (partnerFirstName && partnerLastName) {
    cy.ClickLabelAndType('partnerFirstName', partnerFirstName);
    cy.ClickLabelAndType('partnerLastName', partnerLastName);
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('FollowUp', (insurer, day, time) => {
  cy.task('log', 'FollowUp');
  cy.get('[data-cy=followUpBody]')
    .invoke('text')
    .should('contain', insurer);
  cy.wait('@followUpTimes', { requestTimeout: 20000 });
  cy.ClickInSelect('date', day);
  cy.ClickInSelect('time', time);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('ThankYou', () => {
  cy.task('log', 'ThankYou');
  cy.urlEndsWith('life/thankyou');
});

Cypress.Commands.add('ThankYouWW', () => {
  cy.task('log', 'ThankYouWW');
  cy.wait('@docusign');
  cy.get('[data-cy=esignApplicationButton]')
    .click();

  cy.get('@popup').should('be.called');
});

Cypress.Commands.add('TaxResidentBMO', (isResident) => {
  cy.task('log', 'TaxResidentBMO');
  if (isResident === 'Y') {
    cy.get('[data-cy=isResidentTax-Y]')
      .click();
  } else if (isResident === 'N') {
    cy.get('[data-cy=isResidentTax-N]')
      .click();
  }
});

Cypress.Commands.add('BankruptcyBMO', (hasDeclaredBankruptcy, bankruptcyDetails) => {
  cy.task('log', 'BankruptcyBMO');
  if (hasDeclaredBankruptcy === 'Y') {
    cy.get('[data-cy=bankruptcy-Y]')
      .click();
    cy.get('[data-cy=bankruptcyDetails]')
      .type(bankruptcyDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasDeclaredBankruptcy === 'N') {
    cy.get('[data-cy=bankruptcy-N]')
      .click();
  }
});

Cypress.Commands.add('IdentificationBMO', (identificationType, idNumber, provinceOfIssue, expiryDate) => {
  cy.task('log', 'IdentificationBMO');
  if (identificationType === `Driver's License` || identificationType === 'Passport') {
    cy.ClickInSelect('identificationType', identificationType);
    cy.get('[data-cy=identificationNumber]')
      .type(idNumber);
    cy.get('[data-cy=expiryDate]')
      .type(expiryDate, { delay: 100 });
    cy.ClickInSelect('provinceOfIssue', provinceOfIssue);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (identificationType === 'Health Card' || identificationType === 'Military Card') {
    cy.ClickInSelect('identificationType', identificationType);
    cy.get('[data-cy=identificationNumber]')
      .type(idNumber);
    cy.ClickInSelect('provinceOfIssue', provinceOfIssue);
    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('ExtremeSports', (doesExtremeSports, extremeSportList) => {
  // 1: Motor Vehicle Racing, 2: Power boat racing, 3: Scuba or skin diving,
  // 4: Skydiving, 5: Hang gliding, 6: Ultra light flying
  // 7: Ballooning, 8: Rock Climbing, 9: Mountaineering, 10: Heli-skiing,
  // 11: Back Country Skiing, 12: Other Similar Sports, 13: Parachute jumping

  cy.task('log', 'ExtremeSports');
  if (doesExtremeSports === 'Y') {
    cy.get('[data-cy=extremeSports-Y]')
      .click();
    extremeSportList.forEach((id) => {
      cy.get(`[data-cy=extreme${id}]`)
        .click({ force: true });
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (doesExtremeSports === 'N') {
    cy.get('[data-cy=extremeSports-N]')
      .click();
  }
});

Cypress.Commands.add('Pilot', (isPilot) => {
  cy.task('log', 'Pilot');
  if (isPilot === 'Y') {
    cy.get('[data-cy=isPilot-Y]')
      .click();
  } else if (isPilot === 'N') {
    cy.get('[data-cy=isPilot-N]')
      .click();
  }
});

Cypress.Commands.add('PastTravel', (hasTravelledPast, pastTravels) => { // pastTravels is an array of objects
  cy.task('log', 'PastTravel');
  if (hasTravelledPast === 'Y') {
    cy.get('[data-cy=travelPast-Y]')
      .click();
    pastTravels.forEach((trip, index) => {
      cy.ClickInSelect(`tripCountry-${index}`, trip.country);
      cy.get(`[data-cy=tripLength-${index}]`)
        .type(trip.length);
      cy.ClickInSelect(`tripPurpose-${index}`, trip.purpose);
      if (index !== pastTravels.length - 1) {
        cy.get('[data-cy=addPastTravel]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasTravelledPast === 'N') {
    cy.get('[data-cy=travelPast-N]')
      .click();
  }
});

Cypress.Commands.add('PastTravelBMO', (hasTravelledPast, pastTravels) => { // pastTravels is an array of objects
  cy.task('log', 'PastTravelBMO');
  if (hasTravelledPast === 'Y') {
    cy.get('[data-cy=travelPast-Y]')
      .click();
    pastTravels.forEach((trip, index) => {
      cy.ClickInSelect(`tripCountry-${index}`, trip.country);
      cy.get(`[data-cy=tripLength-${index}]`)
        .type(trip.length);
      cy.ClickInSelect(`tripPurpose-${index}`, trip.purpose);
      cy.ClickInSelect(`tripDate-${index}`, trip.date);
      if (index !== pastTravels.length - 1) {
        cy.get('[data-cy=addPastTravel]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasTravelledPast === 'N') {
    cy.get('[data-cy=travelPast-N]')
      .click();
  }
});

Cypress.Commands.add('FutureTravel', (willTravelFuture, futureTravels) => { // futureTravels is an array of objects
  cy.task('log', 'FutureTravel');
  if (willTravelFuture === 'Y') {
    cy.get('[data-cy=travelFuture-Y]')
      .click();
    futureTravels.forEach((trip, index) => {
      cy.ClickInSelect(`futureTripCountry-${index}`, trip.country);
      cy.get(`[data-cy=futureTripLength-${index}]`)
        .type(trip.length);
      cy.ClickInSelect(`futureTripPurpose-${index}`, trip.purpose);
      if (index !== futureTravels.length - 1) {
        cy.get('[data-cy=addFutureTrip]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willTravelFuture === 'N') {
    cy.get('[data-cy=travelFuture-N]')
      .click();
  }
});

Cypress.Commands.add('FutureTravelBMO', (willTravelFuture, futureTravels) => { // futureTravels is an array of objects
  cy.task('log', 'FutureTravelBMO');
  if (willTravelFuture === 'Y') {
    cy.get('[data-cy=travelFuture-Y]')
      .click();
    futureTravels.forEach((trip, index) => {
      cy.ClickInSelect(`futureTripCountry-${index}`, trip.country);
      cy.get(`[data-cy=futureTripLength-${index}]`)
        .type(trip.length);
      cy.ClickInSelect(`futureTripPurpose-${index}`, trip.purpose);
      cy.ClickInSelect(`futureTripMonth-${index}`, trip.date);
      if (index !== futureTravels.length - 1) {
        cy.get('[data-cy=addFutureTrip]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willTravelFuture === 'N') {
    cy.get('[data-cy=travelFuture-N]')
      .click();
  }
});

Cypress.Commands.add('TravelFutureNonUrban', (willVisitNonUrban, nonUrbanVisitDetails) => {
  cy.task('log', 'TravelFutureNonUrban');
  if (willVisitNonUrban === 'Y') {
    cy.get('[data-cy=travelFutureNonUrban-Y]')
      .click();
    cy.get('[data-cy=travelFutureNonUrbanDetails]')
      .type(nonUrbanVisitDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willVisitNonUrban === 'N') {
    cy.get('[data-cy=travelFutureNonUrban-N]')
      .click();
  }
});

Cypress.Commands.add('TravelFutureWarzone', (willVisitWarzone, warzoneVisitDetails) => {
  cy.task('log', 'TravelFutureWarzone');
  if (willVisitWarzone === 'Y') {
    cy.get('[data-cy=travelFutureWarZone-Y]')
      .click();
    cy.get('[data-cy=travelFutureWarZoneDetails]')
      .type(warzoneVisitDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willVisitWarzone === 'N') {
    cy.get('[data-cy=travelFutureWarZone-N]')
      .click();
  }
});

Cypress.Commands.add('MotorViolations', (hasMotorViolations, motorViolationsDetails) => {
  cy.task('log', 'MotorViolations');
  if (hasMotorViolations === 'Y') {
    cy.get('[data-cy=motorVehicleViolation-Y]')
      .click();
    cy.get('[data-cy=motorVehicleViolationReason]')
      .type(motorViolationsDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasMotorViolations === 'N') {
    cy.get('[data-cy=motorVehicleViolation-N]')
      .click();
  }
});

Cypress.Commands.add('CarConvictions5Years', (hasCarConvictionsPast5, carConvictionDetails) => {
  cy.task('log', 'CarConvictions5Years');
  if (hasCarConvictionsPast5 === 'Y') {
    cy.get('[data-cy=carConvictionsInPast5Years-Y]')
      .click();
    cy.get('[data-cy=carConvictionPast5YearsDetails]')
      .type(carConvictionDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasCarConvictionsPast5 === 'N') {
    cy.get('[data-cy=carConvictionsInPast5Years-N]')
      .click();
  }
});

Cypress.Commands.add('CarConvictions10Years', (hasCarConvictionsPast10, carConvictionDetails) => {
  cy.task('log', 'CarConvictions10Years');
  if (hasCarConvictionsPast10 === 'Y') {
    cy.get('[data-cy=carConvictionsInPast10Years-Y]')
      .click();
    cy.get('[data-cy=carConvictionPast10YearsDetails]')
      .type(carConvictionDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasCarConvictionsPast10 === 'N') {
    cy.get('[data-cy=carConvictionsInPast10Years-N]')
      .click();
  }
});

Cypress.Commands.add('Arrested', (hasBeenArrested, arrestDetails) => {
  cy.task('log', 'Arrested');
  if (hasBeenArrested === 'Y') {
    cy.get('[data-cy=arrested-Y]')
      .click();
    cy.get('[data-cy=arrestedReason]')
      .type(arrestDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasBeenArrested === 'N') {
    cy.get('[data-cy=arrested-N]')
      .click();
  }
});

Cypress.Commands.add('SubstanceUseBMO', (usedSubstances, substanceUseInfo) => { // substanceUseInfo is an array of objects
  cy.task('log', 'SubstanceUseBMO');
  if (usedSubstances === 'Y') {
    cy.get('[data-cy=substanceUse-Y]')
      .click();
    substanceUseInfo.forEach((substance) => {
      cy.get(`[data-cy=${substance.name}]`)
        .click({ force: true });
      cy.get(`[data-cy=${substance.name}-${substance.currentlyUse}]`)
        .click({ force: true });
      cy.get(`[data-cy=${substance.name}-freq]`)
        .type(substance.usage);
      if (substance.currentlyUse === 'N') {
        cy.get(`[data-cy=${substance.name}-quit]`)
          .type(`${substance.quitDate}`, { delay: 100, force: true });
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (usedSubstances === 'N') {
    cy.get('[data-cy=substanceUse-N]')
      .click();
  }
});

Cypress.Commands.add('HealthcareProfessional', (hasSeenHealthCareProfessional, healthcareVisitDetails) => { // healthcareVisitDetails is an object
  cy.task('log', 'HealthcareProfessional');
  if (hasSeenHealthCareProfessional === 'Y') {
    cy.get('[data-cy=healthcareProfessional-Y]')
      .click();
    cy.ClickInSelect('visitMonth', healthcareVisitDetails.month);
    cy.ClickInSelect('visitYear', healthcareVisitDetails.year);
    cy.get('[data-cy=visitDoctorCity]')
      .type(healthcareVisitDetails.city);
    cy.ClickInSelect('visitReason', healthcareVisitDetails.reason);
    if (healthcareVisitDetails.reason === 'Other') {
      cy.get('[data-cy=visitOtherReason]')
        .type(healthcareVisitDetails.otherReason);
    }
    cy.ClickInSelect('visitResult', healthcareVisitDetails.result);
    if (healthcareVisitDetails.result === 'Abnormal') {
      cy.get('[data-cy=visitAbnormalResultReason]')
        .type(healthcareVisitDetails.abnormalReason);
    }
    cy.get('[data-cy=visitDoctorName]:visible')
      .type(healthcareVisitDetails.name);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasSeenHealthCareProfessional === 'N') {
    cy.get('[data-cy=healthcareProfessional-N]')
      .click();
  }
});

Cypress.Commands.add('HealthcareMedication', (beenPrescribed, medicationDetails) => {
  cy.task('log', 'HealthcareMedication');
  if (beenPrescribed === 'Y') {
    cy.get('[data-cy=prescribed-Y]')
      .click();
    cy.get('[data-cy=prescribedDetails]')
      .type(medicationDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (beenPrescribed === 'N') {
    cy.get('[data-cy=prescried-N]')
      .click();
  }
});

Cypress.Commands.add('DeclinedPolicies', (hasBeenDeclined, declinedDetails) => {
  cy.task('log', 'DeclinedPolicies');
  if (hasBeenDeclined === 'Y') {
    cy.get('[data-cy=rejectedPolicy-Y]')
      .click();
    cy.get('[data-cy=rejectedPolicyReason]')
      .type(declinedDetails);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasBeenDeclined === 'N') {
    cy.get('[data-cy=rejectedPolicy-N]')
      .click();
  }
});

Cypress.Commands.add('ChildBeneficiariesDOB', (childBeneficiariesDOBs) => { // childBeneficiariesDOBS should be an array and indices the same way it will be displayed
  cy.task('log', 'ChildBeneficiariesDOB');
  childBeneficiariesDOBs.forEach((childDOB, index) => {
    cy.get(`[data-cy=childDOB-${index}]`)
      .type(childDOB, { delay: 100 });
  });
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@utm');
  cy.wait('@householdInfos');
  cy.wait('@lifeSessions');
  cy.wait('@patchLifeAppsLongUrl');
});

Cypress.Commands.add('ExpertQuotes', (dob, gender, isSmoker, province, isCaa = false, caaMemberChoice = 'N') => {
  cy.QuotesInputPrimary(dob, gender, isSmoker, province, 'primary');
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.SegmentTrack(SEGMENT_EVENTS.INPUTS_RECEIVED, {
    gender: 'string',
    is_joint_flag: 'boolean',
    joint_role: 'string',
    smoke: 'boolean',
  });
  if (isCaa) {
    cy.CaaMember(caaMemberChoice);
  }
  cy.wait('@utm');
  cy.wait('@quotes');
});

Cypress.Commands.add('ExpertQuotesJoint', (priDob, priGender, priIsSmoker, priProvince, secDob, secGender, secIsSmoker, secProvince, isCaa = false) => {
  cy.task('log', 'ExpertQuotesJoint');
  cy.QuotesInputPrimary(priDob, priGender, priIsSmoker, priProvince, 'primary');
  cy.get('[data-cy=quotesCompareInputsAddPartnerBtn]')
    .click();
  cy.QuotesInputPrimary(secDob, secGender, secIsSmoker, secProvince, 'secondary');
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.SegmentTrack(SEGMENT_EVENTS.INPUTS_RECEIVED, {
    gender: 'string',
    is_joint_flag: 'boolean',
    joint_role: 'string',
    smoke: 'boolean',
    partner_birthdate: 'string',
    partner_gender: 'string',
    partner_smoke: 'boolean',
  });
  cy.SegmentTrack(SEGMENT_EVENTS.INPUTS_RECEIVED, {
    gender: 'string',
    is_joint_flag: 'boolean',
    joint_role: 'string',
    smoke: 'boolean',
    partner_birthdate: 'string',
    partner_gender: 'string',
    partner_smoke: 'boolean',
  });
  if (isCaa) {
    cy.CaaMember();
  }
  cy.wait('@utm');
  cy.wait('@quotes');
});

Cypress.Commands.add('toggleOnJoint', (dob, gender, isSmoker) => {
  cy.wait('@quotes');

  cy.get('[data-cy=toggleSwitchToOn]').click({ force: true, multiple: true }); // force is added due to it having a css property of display: none
  cy.Birthdate(dob, 'jointDate');
  cy.get(`[data-cy=jointGender-${gender}]`) // joint(secondary) gender
    .click();

  cy.get(`[data-cy=jointSmoker-${isSmoker}]`) // joint(secondary) isSmoker: true or false
    .click();

  cy.get('[data-cy="joint-confirm"]').click();
  cy.wait('@quotes');
});

Cypress.Commands.add('JointThankYou', () => {
  cy.task('log', 'JointThankYou');
  cy.get('[data-cy=partnerStartApp]')
    .should('have.attr', 'href')
    .then((href) => {
      cy.visit(`${Cypress.env('baseURL')}/life/${href}&debug=1&ab_test_disable=1`);
    });
  // cy.wait(2000); // screen shows Not Found for a second after going to new page
});

Cypress.Commands.add('ResidencyAppliedPermRes', (hasApplied) => {
  cy.task('log', 'ResidencyAppliedPermRes');
  if (hasApplied === 'Y') {
    cy.get('[data-cy=appliedPermRes-Y]')
      .click();
  } else if (hasApplied === 'N') {
    cy.get('[data-cy=appliedPermRes-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencyDomesticWorker', (areDomesticWorker) => {
  cy.task('log', 'ResidencyDomesticWorker');
  if (areDomesticWorker === 'Y') {
    cy.get('[data-cy=residencyDomesticWorker-Y]')
      .click();
  } else if (areDomesticWorker === 'N') {
    cy.get('[data-cy=residencyDomesticWorker-N]')
      .click();
  }
});

Cypress.Commands.add('referrerOtherIntrests', (areDomesticWorker) => {
  cy.task('log', 'referrerOtherIntrests');
  cy.get('[data-cy=user-interest-none]')
    .click({ force: true });
  cy.get('[data-cy=submit]:visible').first() // not sure why there are two submit buttons
    .click();
});

Cypress.Commands.add('ResidencyInCanada12Months', (hasResided12Months, permResDate, prevCountryResidence) => {
  cy.task('log', 'ResidencyInCanada12Months');
  if (hasResided12Months === 'Y') {
    cy.get('[data-cy=residencyCanada12Months-Y]')
      .click();

    cy.ClickInSelect('previousCountryResidence', prevCountryResidence);
    cy.get('[data-cy=permResDate]')
      .type(permResDate, { delay: 100 });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasResided12Months === 'N') {
    cy.get('[data-cy=residencyCanada12Months-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencyPhysician', (arePhysician) => {
  cy.task('log', 'ResidencyPhysician');
  if (arePhysician === 'Y') {
    cy.get('[data-cy=residencyPhysician-Y]')
      .click();
  } else if (arePhysician === 'N') {
    cy.get('[data-cy=residencyPhysician-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencySkilledWorker', (areSkilledWorker) => {
  cy.task('log', 'ResidencySkilledWorker');
  if (areSkilledWorker === 'Y') {
    cy.get('[data-cy=residencySkilledWorker-Y]')
      .click();
  } else if (areSkilledWorker === 'N') {
    cy.get('[data-cy=residencySkilledWorker-N]')
      .click();
  }
});

Cypress.Commands.add('ExistingPolicies', (hasExistingPolicies, existingPolicies) => { // // For smaller screens where select lists change so its click only rather than type
  cy.task('log', 'ExistingPolicies');
  if (hasExistingPolicies === 'Y') {
    cy.get('[data-cy=existingPolicies-Y]')
      .click();
    existingPolicies.forEach((policy, index) => {
      cy.DesignSystemClickInSelect(`existingInsurer-${index}`, policy.insurer);
      cy.get(`[data-cy=policyCoverageAmount-${index}]`)
        .type(policy.coverageAmount);
      cy.DesignSystemClickInSelect(`existingInsurerYear-${index}`, policy.year);
      cy.DesignSystemClickInSelect(`existingPolicyType-${index}`, policy.type);
      if (policy.type === 'Other') {
        cy.ClickLabelAndType(`otherExistingPolicyType-${index}`, policy.otherPolicyType);
      }
      if (index !== existingPolicies.length - 1) {
        cy.get('[data-cy=addExistingPolicy]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasExistingPolicies === 'N') {
    cy.get('[data-cy=existingPolicies-N]')
      .click();
  }
});

Cypress.Commands.add('PMPendingPolicies', (hasPendingPolicies, willKeepPolicies, pendingPolicies) => {
  cy.task('log', 'PendingPolicies');
  cy.DisableSept2025Promo();
  if (hasPendingPolicies === 'Y') {
    cy.get('[data-cy=pendingPolicies-Y]')
      .click();
    if (willKeepPolicies === 'Y') {
      cy.get('[data-cy=keepPendingPolicies-Y')
        .click();
      cy.get('[data-cy=keepPendingPolicies-Y').scrollIntoView();
      pendingPolicies.forEach((policy, index) => {
        cy.DesignSystemClickInSelect(`pendingPolicy-${index}-company`, policy.insurer);
        cy.ClickLabelAndType(`pendingPolicy-${index}-coverageAmount`, policy.coverageAmount);
        cy.DesignSystemClickInSelect(`pendingPolicyType-${index}`, policy.type);

        if (policy.type === 'Other') {
          cy.ClickLabelAndType(`pending_policy_${index}_types_others`, policy.other);
        }
        if (index !== pendingPolicies.length - 1) {
          cy.get('[data-cy=addPendingPolicy]')
            .click();
        }
      });
      cy.get('[data-cy=pending-policies-submit]:visible')
        .click();
    } else if (willKeepPolicies === 'N') {
      cy.get('[data-cy=keepPendingPolicies-N')
        .click();
      cy.get('[data-cy=pending-policies-submit]:visible')
        .click();
    }
  } else if (hasPendingPolicies === 'N') {
    cy.get('[data-cy=pendingPolicies-N]')
      .click();
    cy.get('[data-cy=pending-policies-submit]:visible')
      .click();
  }
});

Cypress.Commands.add('PendingPolicies', (hasPendingPolicies, pendingPolicies) => { // For smaller screens where select lists change so its click only rather than type
  cy.task('log', 'PendingPolicies');
  cy.DisableSept2025Promo();
  if (hasPendingPolicies === 'Y') {
    cy.get('[data-cy=pendingPolicies-Y]')
      .click();
    pendingPolicies.forEach((policy, index) => {
      cy.ClickInSelect(`pendingPolicy-${index}-company`, policy.insurer);
      cy.ClickLabelAndType(`pendingPolicy-${index}-coverageAmount`, policy.coverageAmount);
      cy.ClickInSelect(`pendingPolicyType-${index}`, policy.type);
      if (policy.type === 'Other') {
        cy.ClickLabelAndType(`pending_policy_${index}_types_others`, policy.other);
      }
      if (index !== pendingPolicies.length - 1) {
        cy.get('[data-cy=addPendingPolicy]')
          .click();
      }
    });
    cy.get('[data-cy=pending-policies-submit]:visible')
      .click();
  } else if (hasPendingPolicies === 'N') {
    cy.get('[data-cy=pendingPolicies-N]')
      .click();
    cy.get('[data-cy=pending-policies-submit]:visible')
      .click();
  }
});

Cypress.Commands.add('Beneficiaries', (beneficiaries) => {
  cy.task('log', 'Beneficiaries');
  beneficiaries.forEach((beneficiary, index) => {
    cy.get(`[data-cy=beneficiaryName-${index}]`)
      .type(beneficiary.name);
    cy.ChooseFromSelect(`beneficiaryRelationship-${index}`, beneficiary.relationship);
    cy.ClearAndType(`beneficiaryPercent-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    if (index !== beneficiaries.length - 1) {
      cy.get('[data-cy=addBeneficiary]')
        .click();
    }
  });
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('IsSmUp', () => {
  cy.document().then((doc) => {
    if (doc.documentElement.getBoundingClientRect().width < 576) {
      return cy.wrap(true);
    }
    return cy.wrap(false);
  });
});

Cypress.Commands.add('LogSessionID', (caseNumber, userType = USER_TYPES.PRIMARY) => {
  cy.get(`.life-${userType}-session-ID`).within(div => {
    cy.get('.session-ID').invoke('text').then((sessionId) => { // logs lifePrimarySessionID in terminal
      cy.get('@caseNumber').then((storedCaseNumber) => {
        cy.task('log', getPMTestCaseSessionIDLog(caseNumber ?? storedCaseNumber, sessionId, userType));
      });
    });
  });
});

Cypress.Commands.add('LogHDSessionID', (caseNumber, userType = USER_TYPES.PRIMARY) => {
  cy.get('.hd-primary-session-ID').within(div => {
    cy.get('.session-ID').invoke('text').then((sessionId) => { // logs hdPrimarySessionID in terminal
      cy.get('@caseNumber').then((storedCaseNumber) => {
        cy.task('log', getPMTestCaseSessionIDLog(caseNumber ?? storedCaseNumber, sessionId, userType));
      });
    });
  });
});

Cypress.Commands.add('LogCISessionID', (caseNumber, userType = USER_TYPES.PRIMARY, hasCrossSell = false) => {
  cy.get(`.ci-${userType}-session-ID`).within(div => {
    cy.get('.session-ID').invoke('text').then((sessionId) => { // logs ciPrimarySessionID in terminal
      cy.get('@caseNumber').then((storedCaseNumber) => {
        console.log('userType', userType);
        cy.task('log', getPMTestCaseSessionIDLog(caseNumber ?? storedCaseNumber, sessionId, userType, hasCrossSell));
      });
    });
  });
});

Cypress.Commands.add('LogCISessionIDForSync', (caseNumber, userType = USER_TYPES.PRIMARY, hasCrossSell = false) => {
  cy.get(`.ci-${userType}-session-ID`).within(div => {
    cy.get('.session-ID').invoke('text').then((sessionId) => { // logs ciPrimarySessionID in terminal
      cy.get('@caseNumber').then((storedCaseNumber) => {
        console.log('userType', userType);
        cy.task('log', getPMTestCaseCISessionIDLog(caseNumber ?? storedCaseNumber, sessionId, userType, hasCrossSell));
      });
    });
  });
});

Cypress.Commands.add('LogHDPrimarySessionID', (caseNumber, userType = USER_TYPES.PRIMARY) => {
  cy.get('.hd-primary-session-ID').within(div => {
    cy.get('.session-ID').invoke('text').then((sessionId) => { // logs primary hd session id in terminal
      cy.get('@caseNumber').then((storedCaseNumber) => {
        cy.task('log', getPMTestCaseSessionIDLog(caseNumber ?? storedCaseNumber, sessionId, userType));
      });
    });
  });
});

Cypress.Commands.add('LogEmail', (email, caseNumber, userType = USER_TYPES.PRIMARY) => {
  cy.get('@caseNumber').then((storedCaseNumber) => {
    cy.task('log', getPMTestCaseEmailLog(caseNumber ?? storedCaseNumber, email, userType));
  });
});

Cypress.Commands.add('RecommendationNoCoverage', () => {
  cy.task('log', 'RecommendationNoCoverage');
  cy.wait('@coverage');
  cy.wait('@lifeSessions');
  // The see prices button appears quickly, then dissapears, then reappears.
  // This is used to wait for it to reappear or else there is a cypress error
  // due to it being detached from the DOM
  cy.get('[data-cy=seePricesButton]')
    .click();
  cy.SegmentTrack(SEGMENT_EVENTS.RECOMMENDATION_RECEIVED, {
    recmd_cov_amt: 'number',
    cov_type: 'string',
    product_type: 'string',
  });
});

Cypress.Commands.add('SyncHubspot', (app_id) => {
  cy.task('log', 'SyncHubspot');
  const baseUrl = Cypress.env('portalDomain');
  cy.request({
    method: 'POST',
    url: `${baseUrl}/api/v1/hubspot/sync-contact-deal`,
    headers: getPortalRequestHeaders(),
    timeout: 180000,
    body: JSON.stringify({
      id_type: 'app_id',
      id: app_id,
    }),
  }).then((response) => {
    cy.task('log', `SyncHubspot response: ${JSON.stringify(response.body)}`);
  });
});

Cypress.Commands.add('triggerSiliTriage', (app_id, fail = false, failedReason = '') => {
  cy.task('log', 'Triage Simplified Life');
  cy.request({
    method: 'POST',
    url: `${Cypress.env('portalDomain')}/api/v1/policyme/update-uw-req?enable_simplified_life=true`,
    body: getSiliTriageBody(app_id, PM_PRODUCT_TYPE.TERM_LIFE),
    headers: getPortalRequestHeaders(),
  }).then((response) => {
    if (fail) {
      expect(response.body.data.enabled).to.eq(false);
      expect(response.body.data.reason).to.include(failedReason);
      expect(response.status).to.eq(200);
      return;
    }
    cy.task('log', 'Simplified Life triaged completed');
    expect(response.body.data.enabled).to.eq(true);
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('resetPaymentSteps', (app_id) => {
  cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.RESET_PAYMENT_STEPS);
  cy.request({
    method: 'POST',
    url: `${Cypress.env('portalDomain')}/api/v1/policyme/approval-steps-reset`,
    body: getPortalApprovedResetBody(app_id, PM_PRODUCT_TYPE.TERM_LIFE, 'payment'),
    headers: getPortalRequestHeaders(),
    timeout: 180000,
  }).then((response) => {
    cy.task('log', 'Payment steps reset');
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('resetDigitalConsent', (app_id) => {
  cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.RESET_CONSENT_STEPS);
  cy.request({
    method: 'POST',
    url: `${Cypress.env('portalDomain')}/api/v1/policyme/approval-steps-reset`,
    body: getPortalApprovedResetBody(app_id, PM_PRODUCT_TYPE.TERM_LIFE, 'digital'),
    headers: getPortalRequestHeaders(),
    timeout: 180000,
  }).then((response) => {
    cy.task('log', 'Digital consent steps reset');
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('QuotesBookCall', () => {
  cy.task('log', 'QuotesBookCall');
  cy.wait('@quotes');
  cy.get('[data-cy=scheduleCall]:visible')
    .click();
});

Cypress.Commands.add('CitizenshipJoint', (isCanadianCitizen, isPartnerCitizen) => {
  cy.task('log', 'Citizenship Joint');
  if (isCanadianCitizen === 'Y') {
    cy.get('[data-cy=citizenship-citizen]', { timeout: 15000 })
      .click();
  } else if (isCanadianCitizen === 'N') {
    cy.get('[data-cy=citizenship-non_citizen]', { timeout: 15000 })
      .click();
  }

  if (isPartnerCitizen === 'Y') {
    cy.get('[data-cy=partnerCitizenship-citizen]', { timeout: 15000 })
      .click();
  } else if (isPartnerCitizen === 'N') {
    cy.get('[data-cy=partnerCitizenship-non_citizen]', { timeout: 15000 })
      .click();
  }
});

Cypress.Commands.add('ResidencyJoint', (residency, prevCountryResidence, dateOfEntry, partnerResidency, partnerPrevCountryResidence, partnerDateOfEntry) => {
  cy.task('log', 'Residency Joint');
  if (residency !== '') {
    if (residency === 'Permanent Resident') {
      cy.ClickInSelect('residencyStatus', residency);
    } else {
      cy.ClickInSelect('residencyStatus', residency);
      cy.ClickInSelect('previousCountryResidence', prevCountryResidence);
      cy.get('[data-cy=permResDate]')
        .type(dateOfEntry, { delay: 100 });
    }
  }

  if (partnerResidency !== '') {
    if (partnerResidency === 'Permanent Resident') {
      cy.ClickInSelect('residencyStatusPartner', partnerResidency);
    } else {
      cy.ClickInSelect('residencyStatusPartner', partnerResidency);
      cy.ClickInSelect('previousCountryResidencePartner', partnerPrevCountryResidence);
      cy.get('[data-cy=permResDatePartner]')
        .type(partnerDateOfEntry, { delay: 100 });
    }
  }

  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('ResidencyAppliedPermResJoint', (hasApplied, hasAppliedPartner) => {
  cy.task('log', 'Residency applied for permanent residency Joint');
  if (hasApplied !== '' && hasAppliedPartner !== '') {
    if (hasApplied === 'Y' || hasAppliedPartner === 'Y') {
      cy.get('[data-cy=appliedPermRes-Y]')
        .click();
      if (hasApplied === 'Y') {
        cy.get('[data-cy=appliedPermResMyself]')
          .click({ force: true });
      }

      if (hasAppliedPartner === 'Y') {
        cy.get('[data-cy=appliedPermResPartner]')
          .click({ force: true });
      }
      cy.get('[data-cy=submit]:visible')
        .click();
    } else if (hasApplied === 'N' && hasAppliedPartner === 'N') {
      cy.get('[data-cy=appliedPermRes-N]')
        .click();
    }
  } else if (hasApplied === 'Y' || hasAppliedPartner === 'Y') {
    cy.get('[data-cy=appliedPermRes-Y]')
      .click();
  } else {
    cy.get('[data-cy=appliedPermRes-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencyDomesticWorkerJoint', (areDomesticWorker, areDomesticWorkerPartner) => {
  cy.task('log', 'residency domestic worker Joint');
  if (areDomesticWorker !== '' && areDomesticWorkerPartner !== '') {
    if (areDomesticWorker === 'Y' || areDomesticWorkerPartner === 'Y') {
      cy.get('[data-cy=residencyDomesticWorker-Y]')
        .click();
      if (areDomesticWorker === 'Y') {
        cy.get('[data-cy=residencyDomesticWorkerMyself]')
          .click({ force: true });
      }

      if (areDomesticWorkerPartner === 'Y') {
        cy.get('[data-cy=residencyDomesticWorkerPartner]')
          .click({ force: true });
      }
      cy.get('[data-cy=submit]:visible')
        .click();
    } else if (areDomesticWorker === 'N' && areDomesticWorkerPartner === 'N') {
      cy.get('[data-cy=residencyDomesticWorker-N]')
        .click();
    }
  } else if (areDomesticWorker === 'Y' || areDomesticWorkerPartner === 'Y') {
    cy.get('[data-cy=residencyDomesticWorker-Y]')
      .click();
  } else {
    cy.get('[data-cy=residencyDomesticWorker-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencyPhysicianJoint', (arePhysician, arePhysicianPartner) => {
  cy.task('log', 'Residency physician Joint');
  if (arePhysician !== '' && arePhysicianPartner !== '') {
    if (arePhysician === 'Y' || arePhysicianPartner === 'Y') {
      cy.get('[data-cy=residencyPhysician-Y]')
        .click();
      if (arePhysician === 'Y') {
        cy.get('[data-cy=ResidencyPhysicianMyself]')
          .click({ force: true });
      }

      if (arePhysicianPartner === 'Y') {
        cy.get('[data-cy=ResidencyPhysicianPartner]')
          .click({ force: true });
      }
      cy.get('[data-cy=submit]:visible')
        .click();
    } else if (arePhysician === 'N' && arePhysicianPartner === 'N') {
      cy.get('[data-cy=residencyPhysician-N]')
        .click();
    }
  } else if (arePhysician === 'Y' || arePhysicianPartner === 'Y') {
    cy.get('[data-cy=residencyPhysician-Y]')
      .click();
  } else {
    cy.get('[data-cy=residencyPhysician-N]')
      .click();
  }
});

Cypress.Commands.add('ResidencySkilledWorkerJoint', (areSkilledWorker, areSkilledWorkerPartner) => {
  cy.task('log', 'residency skilled worker Joint');
  if (areSkilledWorker !== '' && areSkilledWorkerPartner !== '') {
    if (areSkilledWorker === 'Y' || areSkilledWorkerPartner === 'Y') {
      cy.get('[data-cy=residencySkilledWorker-Y]')
        .click();
      if (areSkilledWorker === 'Y') {
        cy.get('[data-cy=ResidencySkilledWorkerMyself]')
          .click({ force: true });
      }

      if (areSkilledWorkerPartner === 'Y') {
        cy.get('[data-cy=ResidencySkilledWorkerPartner]')
          .click({ force: true });
      }
      cy.get('[data-cy=submit]:visible')
        .click();
    } else if (areSkilledWorker === 'N' && areSkilledWorkerPartner === 'N') {
      cy.get('[data-cy=residencySkilledWorker-N]')
        .click();
    }
  } else if (areSkilledWorker === 'Y' || areSkilledWorkerPartner === 'Y') {
    cy.get('[data-cy=residencySkilledWorker-Y]')
      .click();
  } else {
    cy.get('[data-cy=residencySkilledWorker-N]')
      .click();
  }
});

Cypress.Commands.add('BirthLocationMLJoint', (Country, CountryPartner) => { // Country is the key for the desired Country in the COUNTRIES const, same with state
  cy.task('log', 'birth location ML Joint');
  cy.ClickInSelect('Country', Country);
  cy.ClickInSelect('partnerCountry', CountryPartner);

  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('EmploymentIncomeJoint', (isEmployed, isEmployedPartner) => {
  cy.task('log', 'employment income Joint');
  if (isEmployed === 'Y') {
    cy.get('[data-cy=employed-Y]')
      .click();
  } else if (isEmployed === 'N') {
    cy.get('[data-cy=employed-N]')
      .click();
  }
  if (isEmployedPartner === 'Y') {
    cy.get('[data-cy=partnerEmployed-Y]')
      .click();
  } else if (isEmployedPartner === 'N') {
    cy.get('[data-cy=partnerEmployed-N]')
      .click();
  }
});

Cypress.Commands.add('EmploymentIncomeAnnualJoint', (annualIncome, partnerAnnualIncome) => {
  cy.task('log', 'Employment Income Annual Joint');
  if (annualIncome) {
    cy.ClearAndType('annualIncome', annualIncome);
  }
  if (partnerAnnualIncome) {
    cy.ClearAndType('partnerAnnualIncome', partnerAnnualIncome);
  }

  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('EmploymentStatusJoint', (employmentStatus, partnerEmploymentStatus) => { // employmentStatus and partnerEmpoymentStatus are objects
  cy.task('log', 'Employment Status Joint');
  if (employmentStatus) {
    cy.ClickInSelect('employmentStatus', employmentStatus.status);
    if (employmentStatus.status === 'Other') {
      cy.get('[data-cy=employmentStatusOther]')
        .type(employmentStatus.other);
    }
  }
  if (partnerEmploymentStatus) {
    cy.ClickInSelect('partnerEmploymentStatus', partnerEmploymentStatus.status);
    if (partnerEmploymentStatus.status === 'Other') {
      cy.get('[data-cy=partnerEmploymentStatusOther]')
        .type(partnerEmploymentStatus.other);
    }
  }

  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('FinancesJoint', (financesObject, residenceOwnership) => {
  cy.task('log', 'Finances Joint');
  cy.ClearAndType('savingsAndInvestments', financesObject.savings);
  if (residenceOwnership === 'own' || residenceOwnership === 'expertPath') { // expertPath should be entered if they don't go through the advice journey and go straight to quotes
    cy.ClearAndType('homeValue', financesObject.homeValue);
    cy.ClearAndType('mortgage', financesObject.mortgage);
  }
  cy.ClearAndType('debts', financesObject.debts);
  cy.get('[data-cy=netWorth]')
    .invoke('text')
    .should('equal', `${financesObject.total}`);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('SecondaryIncome', (secondaryIncome) => {
  cy.task('log', 'Secondary Income');
  cy.ClickLabelAndType('partnerAnnualIncome', secondaryIncome);
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('LicenseJoint', (requireLicense, requireLicensePartner) => {
  cy.task('log', 'License Joint');
  if (requireLicense === 'N' && requireLicensePartner === 'N') {
    cy.get('[data-cy=workLicense-N]')
      .click();
  } else {
    cy.get('[data-cy=workLicense-Y]')
      .click();

    cy.get('[data-cy=workLicenseMyself]')
      .click({ force: true });

    cy.get('[data-cy=workLicensePartner]')
      .click({ force: true });

    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('LicenseRevokedJoint', (wasLicenseRevoked, wasLicenseRevokedPartner, details) => {
  cy.task('log', 'License Revoked Joint');
  if (wasLicenseRevoked === 'Y' || wasLicenseRevokedPartner === 'Y') {
    cy.get('[data-cy=licenseRevoked-Y]')
      .click();
    if (wasLicenseRevoked === 'Y') {
      cy.get('[data-cy=workLicenseRevokedMyself]')
        .click();
    }

    if (wasLicenseRevokedPartner === 'Y') {
      cy.get('[data-cy=workLicenseRevokedPartner]')
        .click();
    }
    cy.get('[data-cy=licenseRevokedReason]')
      .type(details);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (wasLicenseRevoked === 'N' && wasLicenseRevokedPartner === 'N') {
    cy.get('[data-cy=licenseRevoked-N]')
      .click();
  }
});

Cypress.Commands.add('FinancialDifficultiesJoint', (hasFinancialDifficulties, hasFinancialDifficultiesPartner, details) => {
  cy.task('log', 'Financial Difficulties Joint');
  if (hasFinancialDifficulties === 'Y' || hasFinancialDifficultiesPartner === 'Y') {
    cy.get('[data-cy=financialDifficulties-Y]')
      .click();
    if (hasFinancialDifficulties === 'Y') {
      cy.get('[data-cy=financialDifficultiesMyself]')
        .click();
    }

    if (hasFinancialDifficultiesPartner === 'Y') {
      cy.get('[data-cy=financialDifficultiesPartner]')
        .click();
    }
    cy.get('[data-cy=financialDifficultyDetails]')
      .type(details);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (hasFinancialDifficulties === 'N' && hasFinancialDifficultiesPartner === 'N') {
    cy.get('[data-cy=financialDifficulties-N]')
      .click();
  }
});

Cypress.Commands.add('BorrowJoint', (willBorrow, borrowSource) => {
  cy.task('log', 'Borrow Joint');
  if (willBorrow === 'Y') {
    cy.get('[data-cy=borrowForPolicy-Y]')
      .click();
    cy.ClickInSelect('borrowMoneySource', borrowSource);
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willBorrow === 'N') {
    cy.get('[data-cy=borrowForPolicy-N]')
      .click();
  }
});

Cypress.Commands.add('ExistingPoliciesJoint', (hasExistingPolicies, existingPolicies) => { // // For smaller screens where select lists change so its click only rather than type
  cy.task('log', 'Existing Policies Joint');
  if (hasExistingPolicies === 'Y') {
    cy.get('[data-cy=existingPolicies-Y]')
      .click();
    existingPolicies.forEach((policy, index) => {
      cy.DesignSystemClickInSelect(`existingInsurer-${index}`, policy.insurer);
      if (policy.myself) {
        cy.get(`[data-cy=policy-${index}-Myself]`)
          .click({ force: true });
      }
      if (policy.partner) {
        cy.get(`[data-cy=policy-${index}-Partner]`)
          .click({ force: true });
      }
      cy.ClickLabelAndType(`policyCoverageAmount-${index}`, policy.coverageAmount);
      cy.DesignSystemClickInSelect(`existingInsurerYear-${index}`, policy.year);
      cy.DesignSystemClickInSelect(`existingPolicyType-${index}`, policy.type);
      if (policy.type === 'Other') {
        cy.ClickLabelAndType(`otherExistingPolicyType-${index}`, policy.otherPolicyType);
      }
      if (index !== existingPolicies.length - 1) {
        cy.get('[data-cy=addExistingPolicy]')
          .click();
      }
    });
    cy.get('[data-cy=existing-policies-submit]:visible')
      .click();
  } else if (hasExistingPolicies === 'N') {
    cy.get('[data-cy=existingPolicies-N]')
      .click();
    cy.get('[data-cy=existing-policies-submit]:visible')
      .click();
  }
});

Cypress.Commands.add('ReplacingPoliciesJoint', (willReplacePolicies, replacePolicies) => {
  cy.task('log', 'Replacing Policies Joint');
  if (willReplacePolicies === 'Y') {
    cy.waitUntilHasOne('replacePolicies-Y');
    cy.get('[data-cy=replacePolicies-Y]')
      .click();
    const replaceReasons = {
      cheaper: REPLACE_POLICY_REASONS.CHEAPER,
      duration: REPLACE_POLICY_REASONS.LONGER,
      coverage: REPLACE_POLICY_REASONS.MORE_COVERAGE,
      expiring: REPLACE_POLICY_REASONS.EXPIRING,
      split: REPLACE_POLICY_REASONS.SPLIT_JOINT,
      nonCanadian: REPLACE_POLICY_REASONS.NON_CANADIAN,
    };
    replacePolicies.forEach((policy) => {
      cy.get(`[data-cy="policy-${policy.insurer}-${policy.coverageAmount}"]`)
        .click({ force: true });
      policy.replaceReasons.forEach((reason) => {
        cy.get(`[data-cy="policy-${policy.insurer}-${policy.coverageAmount}-reason-${replaceReasons[reason]}"]`)
          .click({ force: true });
      });
    });
    cy.waitUntilHasOne('submit');
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (willReplacePolicies === 'N') {
    cy.get('[data-cy=replacePolicies-N]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
  }
});

Cypress.Commands.add('PendingPoliciesJoint', (hasPendingPolicies, willKeepPolicies, pendingPolicies) => { // For smaller screens where select lists change so its click only rather than type
  cy.task('log', 'Pending Policies Joint');
  cy.DisableSept2025Promo();
  if (hasPendingPolicies === 'Y') {
    cy.get('[data-cy=pendingPolicies-Y]')
      .click();
    if (willKeepPolicies === 'Y') {
      cy.get('[data-cy=keepPendingPolicies-Y')
        .click();
      cy.get('[data-cy=keepPendingPolicies-Y').scrollIntoView();
      pendingPolicies.forEach((policy, index) => {
        cy.get('[data-cy=addPendingPolicy]').scrollIntoView();
        cy.DesignSystemClickInSelect(`pendingPolicy-${index}-company`, policy.insurer);
        if (policy.myself) {
          cy.get(`[data-cy=pendingPolicy-${index}-Myself]`)
            .click({ force: true });
        }
        if (policy.partner) {
          cy.get(`[data-cy=pendingPolicy-${index}-Partner]`)
            .click({ force: true });
        }
        cy.ClickLabelAndType(`pendingPolicy-${index}-coverageAmount`, policy.coverageAmount);
        cy.DesignSystemClickInSelect(`pendingPolicyType-${index}`, policy.type);
        if (policy.type === 'Other') {
          cy.ClickLabelAndType(`pending_policy_${index}_types_others`, policy.other);
        }
        if (index !== pendingPolicies.length - 1) {
          cy.get('[data-cy=addPendingPolicy]')
            .click();
        }
      });
      cy.get('[data-cy=pending-policies-submit]:visible')
        .click();
    } else {
      cy.get('[data-cy=keepPendingPolicies-N')
        .click();
      cy.get('[data-cy=pending-policies-submit]:visible')
        .click();
    }
  } else if (hasPendingPolicies === 'N') {
    cy.get('[data-cy=pendingPolicies-N]')
      .click();
    cy.get('[data-cy=pending-policies-submit]:visible')
      .click();
  }
});

Cypress.Commands.add('CoupleBeneficiaries', (wantEachOther) => {
  cy.task('log', 'Couple Beneficiaries Joint');
  if (wantEachOther === 'Y') {
    cy.get('[data-cy=wantCoupleBeneficiary-Y]')
      .click();
  }

  if (wantEachOther === 'N') {
    cy.get('[data-cy=wantCoupleBeneficiary-N]')
      .click();
  }
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('BeneficiariesJoint', (beneficiaries) => {
  cy.task('log', 'Beneficiaries Joint');
  beneficiaries.forEach((beneficiary, index) => {
    cy.ClickLabelAndType(`beneficiaryName-${index}`, beneficiary.name);
    cy.ChooseFromSelect(`beneficiaryRelationship-${index}`, beneficiary.relationship);
    cy.ClearAndType(`beneficiaryPercent-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    if (index !== beneficiaries.length - 1) {
      cy.get('[data-cy=addBeneficiary]')
        .click();
    }
  });
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('BeneficiariesPartnerJoint', (beneficiaries) => {
  cy.task('log', 'Beneficiaries Partner Joint');
  beneficiaries.forEach((beneficiary, index) => {
    cy.ClickLabelAndType(`partner_beneficiaryName-${index}`, beneficiary.name);
    cy.ChooseFromSelect(`partner_beneficiaryRelationship-${index}`, beneficiary.relationship);
    cy.ClearAndType(`partner_beneficiaryPercent-${index}`, beneficiary.percent);
    cy.get(`[data-cy="is-minor-${index}-${beneficiary.is_minor}"]`).click();
    if (index !== beneficiaries.length - 1) {
      cy.get('[data-cy=partner_addBeneficiary]')
        .click();
    }
  });
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('SecondaryBeneficiariesChoice', (wantSecond) => {
  cy.task('log', 'Secondary Beneficiaries Choice Joint');
  if (wantSecond === 'Y') {
    cy.get('[data-cy=secondaryBeneficiaries-Y]')
      .click();
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@householdInfos');
    cy.wait('@lifeSessions');
  }

  if (wantSecond === 'N') {
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
});

Cypress.Commands.add('SecondaryBeneficiariesJoint', (sameAsPartner, wantSecondaryBeneficiaries, secondaryBeneficiaries) => {
  cy.task('log', 'Secondary Beneficiaries Joint');
  if (sameAsPartner === 'Y') {
    cy.get(`[data-cy=partner_secondary_beneficiaries_same_people]`)
      .click({ force: true });
  }
  if (wantSecondaryBeneficiaries === 'Y') {
    secondaryBeneficiaries.forEach((secondaryBeneficiary, index) => {
      cy.ClickLabelAndType(`secondaryBeneficiary-${index}`, secondaryBeneficiary.name);
      cy.ChooseFromSelect(`secondaryBeneficiaryRelationship-${index}`, secondaryBeneficiary.relationship);
      cy.ClearAndType(`secondaryBeneficiaryPercent-${index}`, secondaryBeneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${secondaryBeneficiary.is_minor}"]`).click();
      if (index !== secondaryBeneficiaries.length - 1) {
        cy.get('[data-cy=addSecondaryBeneficiary]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
    cy.wait('@utm');
    cy.wait('@householdInfos');
    cy.wait('@lifeSessions');
    cy.wait('@patchLifeAppsLongUrl');
  } else if (wantSecondaryBeneficiaries === 'N') {
    // at time of writing this, there isnt the option for only one person
    // to have a secondary beneficiary
    // When that gets implemented, this is where the commands should go
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
});

Cypress.Commands.add('SecondaryBeneficiariesPartnerJoint', (wantSecondaryBeneficiaries, secondaryBeneficiaries) => {
  cy.task('log', 'Secondary Beneficiaries Partner Joint');
  if (wantSecondaryBeneficiaries === 'Y') {
    secondaryBeneficiaries.forEach((secondaryBeneficiary, index) => {
      cy.ClickLabelAndType(`partner_secondaryBeneficiary-${index}`, secondaryBeneficiary.name);
      cy.ChooseFromSelect(`partner_secondaryBeneficiaryRelationship-${index}`, secondaryBeneficiary.relationship);
      cy.ClearAndType(`partner_secondaryBeneficiaryPercent-${index}`, secondaryBeneficiary.percent);
      cy.get(`[data-cy="is-minor-${index}-${secondaryBeneficiary.is_minor}"]`).click();
      if (index !== secondaryBeneficiaries.length - 1) {
        cy.get('[data-cy=partner_addSecondaryBeneficiary]')
          .click();
      }
    });
    cy.get('[data-cy=submit]:visible')
      .click();
  } else if (wantSecondaryBeneficiaries === 'N') {
    // at time of writing this, there isnt the option for only one person
    // to have a secondary beneficiary
    // When that gets implemented, this is where the commands should go
    cy.get('[data-cy=secondaryBeneficiaries-N]')
      .click();
  }
});

Cypress.Commands.add('PartnerSameAddress', (isPartnerSameAddress) => {
  cy.task('log', 'Partner Same Address Joint');
  if (isPartnerSameAddress === 'Y') {
    cy.get('[data-cy=partner_same_address-Y]')
      .click();
  }

  if (isPartnerSameAddress === 'N') {
    cy.get('[data-cy=partner_same_address-N]')
      .click();
  }
  cy.get('[data-cy=submit]:visible').click();
});

Cypress.Commands.add('ContactJoint', (phoneNumber, partnerPhoneNumber) => {
  cy.task('log', 'Contact Joint');
  cy.ClickLabelAndType('phoneNumber', phoneNumber);
  cy.ClickLabelAndType('partnerPhoneNumber', partnerPhoneNumber);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('FollowUpJoint', (insurer, day, time, wantSameTime) => {
  cy.task('log', 'FollowUp Joint');
  if (wantSameTime === 'Y') {
    cy.get('[data-cy=wantSameTime]')
      .click({ force: true });
  }
  cy.get('[data-cy=followUpBody]')
    .invoke('text')
    .should('contain', insurer);
  cy.wait('@followUpTimes', { requestTimeout: 20000 });
  cy.ClickInSelect('date', day);
  cy.ClickInSelect('time', time);
  cy.get('[data-cy=submit]:visible')
    .click();
});

Cypress.Commands.add('SegmentTrack', (eventName, payload) => {
  /**
   * @important
   * We're skipping segment tracking for BMOI because we're not
   * using segment for BMOI yet, please read the notes in TestCase51.
   * This needs to be removed before we can use segment tracking for BMOI.
  */
  if (cy.window().then((win) => win.__policyme.TENANT.code === 'BMOI')) {
    return;
  }
  cy.wait('@segmentTrack', { timeout: 60000 }).then((interception) => {
    const body = JSON.parse(interception.request.body);
    const event = body.event;
    const properties = body.properties;
    const expectedKeys = Object.keys(payload);
    if (!SEGMENT_EVENTS_LITE.includes(event)) {
      expect(properties).to.have.property('utm_source');
      expect(properties).to.have.property('utm_extras');
      expect(properties).to.have.property('tenant');
      if (abTests.length) {
        cy.task('log', 'includesABTests check');
        const includesABTests = Object.keys(properties).some(item => item.includes('ab_test_'));
        expect(includesABTests).to.be.true;
      }
    }
    expect(event).to.equal(eventName);
    for (let key of expectedKeys) {
      expect(properties).to.have.property(key);
      expect(properties[key]).to.be.a(payload[key]);
    }
  });
});

Cypress.Commands.add('UserIntent', (userIntent, skipNext = false, skipSegment = false, productType = PM_PRODUCT_PREFIX.LIFE) => {
  cy.task('log', `UserIntent: ${userIntent}`);

  if (userIntent) {
    if (productType === PM_PRODUCT_PREFIX.HD) {
      // HD uses radio buttons for user intent and does not support data-cy
      cy.get(`[value="${userIntent}"]`).click({ force: true });
    } else {
      cy.get(`[data-cy="user-intent-${userIntent}"]`).click({ force: true });
    }
  }

  // If skipNext is true, we don't want to click the next button. commonly used by a11y tests
  if (!skipNext) {
    cy.get('[data-cy=submit]').last().click();
    cy.get('[data-cy=submit]')
      .last()
      .scrollIntoView()
      .click();

    if (!skipSegment) {
      if (productType !== PM_PRODUCT_PREFIX.HD) {
        cy.SegmentTrack(SEGMENT_EVENTS.USER_INTENT_INDICATED,
          { user_intent: 'string' });
      } else {
        cy.SegmentTrack(SEGMENT_EVENTS.HD_USER_INTENT_INDICATED,
          { user_intent: 'string' });
      }
    }
  }
});

Cypress.Commands.add('FamilyComposition', (familyComposition) => {
  cy.task('log', 'FamilyComposition');
  cy.get(`[data-cy="family-composition-${familyComposition}"]`)
    .click({ force: true });
  cy.get('[data-cy=submit]:visible')
    .scrollIntoView()
    .click();
});

Cypress.Commands.add('Networth', (savingsAndInvestments, homeValue, mortgage, debts) => {
  cy.task('log', 'Networth');

  cy.ClearAndType('savingsAndInvestments', savingsAndInvestments);
  cy.ClearAndType('homeValue', homeValue);
  cy.ClearAndType('mortgage', mortgage);
  cy.ClearAndType('debts', debts);
  cy.get('[data-cy="submit"]').scrollIntoView().click();
});

// Cypress.Commands.add('waitForDecisionSuccess', (alias, maxFailures = 3, timeout = 30_000) => {
//   let failures = 0;
//   function wait() {
//     // Use responseTimeout to ensure the response is fully complete
//     cy.wait(alias, { timeout, responseTimeout: timeout }).then((interception) => {
//       if (interception.response.statusCode === 200) {
//         // Ensure the response body is fully loaded before proceeding
//         expect(interception.response.body).to.not.be.undefined;
//         // Wait a bit more to ensure any UI updates complete
//         cy.wait(1000);
//         return;
//       }
//       failures += 1;
//       if (failures >= maxFailures) {
//         throw new Error(`API ${alias} failed ${maxFailures} times`);
//       }
//       wait(); // recurse for next retry
//     });
//   }
//   wait();
// });

Cypress.Commands.add('EditCoverage', (newCoverageAmountSliderIndex, newPolicyLengthYears, product = 'life') => {
  cy.task('log', 'EditCoverage');
  cy.get(`[data-cy="Decision Card ${product}"]`).within(() => {
    cy.get('[data-cy="edit-coverage"]').click();
  });
  cy.DesiredCoverage(newCoverageAmountSliderIndex, newPolicyLengthYears);
  cy.get('[data-cy="update-coverage"]').click();
  cy.wait(5000);
});

Cypress.Commands.add('dropAndReauthenticate', (phoneNumber) => {
  cy.task('log', 'dropAndReauthenticate');
  cy.get('.debug').get('.life-primary-policy-ID').invoke('text').then((policyId) => {
    cy.visit(`${Cypress.env('baseURL')}/life/policy/get-link/sms/id/${policyId}/short/abcdef?email_ref_v23=1`);
  });
  cy.ClearAndType('phoneVerification', phoneNumber);
  cy.get('[data-cy="submit"]:visible').click();
});

Cypress.Commands.add('HDStartAppJointWithDeps', (firstName, lastName, email, partnerFirstName, partnerLastName, productType) => {
  cy.task('log', 'JointStartApp');
  cy.wait(2000); // time to generate estimated rate
  cy.GetPrice('estimated-rate-price').as('priceFromQuotesPage');
  cy.get('[data-cy=submit]:visible').click();
  cy.ClearAndType('firstName', firstName);
  cy.ClickLabelAndType('lastName', lastName);
  cy.ClearAndType('email', email);
  cy.ClickLabelAndType('partnerFirstName', partnerFirstName);
  cy.ClickLabelAndType('partnerLastName', partnerLastName);
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@verifyEmail');
  cy.wait('@utm');
  cy.wait('@accounts');
  cy.wait('@patchHouseholdInfos');
  if (productType === PM_PRODUCT_PREFIX.LIFE) {
    cy.wait('@lifeSessions');
    cy.wait('@lifeApps', { timeout: 30000 });
  } else if (productType === PM_PRODUCT_PREFIX.CI) {
    cy.wait('@ciSessions');
    cy.wait('@ciApps', { timeout: 30000 });
  }
  cy.wait('@rehydrateJourney', { timeout: 30000 });
  cy.SegmentTrack(SEGMENT_EVENTS.LOGIN_INITIATED, {});
});

Cypress.Commands.add('QuotesInputPrimary', (dob, gender, isSmoker, province, user) => {
  cy.DesignSystemClickInSelect(`${user}_addressProvince`, getEnglishMessageWithId(province.props.id));
  cy.task('log', 'QuotesInputPrimary');
  cy.DesignSystemBirthdate(dob, `${user}_expertDOB`);
  cy.get(`[data-cy=${user}_userGender-${gender}]`) // gender: Male or Female
    .click();
  cy.get(`[data-cy=${user}_expertSmoker-${isSmoker}]`) // isSmoker: true or false
    .click();
});

Cypress.Commands.add('QuotesInputSecondary', (dob, gender, isSmoker, province) => {
  cy.task('log', 'QuotesInputSecondary');
  cy.get(`[data-cy=add-secondary-button]`).click();
  cy.DesignSystemClickInSelect('secondary_addressProvince', getEnglishMessageWithId(province.props.id));
  cy.DesignSystemBirthdate(dob, 'secondary_expertDOB');
  cy.get(`[data-cy=secondary_userGender-${gender}]`) // gender: Male or Female
    .click();
  cy.get(`[data-cy=secondary_expertSmoker-${isSmoker}]`) // isSmoker: true or false
    .click();
});

Cypress.Commands.add('QuotesInputDependant', (dob, gender, isSmoker, province, depKey) => {
  // For every dependent added, increment the count of depKey when using this selector
  cy.task('log', 'QuotesInputDependant');
  cy.get(`[data-cy=add-dependent-button]`).click();
  let dependentDataCyTag = '';
  cy.get(`[data-cy$="-card_userGender-${gender}"]`).eq(depKey) // get all dependents inputs and filter by current dependent index
    .invoke('attr', 'data-cy')
    .then(($datacyValue) => {
      cy.task('log', `data cy value: ${$datacyValue}`);
      dependentDataCyTag = $datacyValue; // get dataCy value of dependent input
    })
    .then(() => {
      let dobDataCyTag = dependentDataCyTag.replace(`userGender-${gender}`, 'expertDOB'); // get dataCy value of dependent dob input
      cy.DesignSystemBirthdate(dob, dobDataCyTag);
      cy.get(`[data-cy=${dependentDataCyTag}]`) // gender: Male or Female
        .click();
    });
});

Cypress.Commands.add('CheckInputBoxQuotesInput', () => {
  cy.task('log', 'CheckInputBoxQuotesInput');
  cy.get('input[name=requiredCheck], input[name=residents_confirmation]')
    .first()
    .click({ force: true });
});

Cypress.Commands.add('checkProvidedDocumentConfirmation', () => {
  cy.task('log', 'checkProvidedDocumentConfirmation');
  cy.get('input[name=providedDocumentConfirmation]')
    .first()
    .click({ force: true });
});

Cypress.Commands.add('StripeElement', (selector) => {
  if (Cypress.config('chromeWebSecurity')) {
    throw new Error('To get Stripe elements, chromeWebSecurity must be disabled');
  }
  return cy
    .get('[data-cy="paymentForm form"] iframe')
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
    .find(selector);
});

Cypress.Commands.add('CaaMember', (choice, checkForFrenchToggle = false) => {
  cy.task('log', 'CaaMember');
  if (checkForFrenchToggle) {
    cy.get('[data-testid="language-toggle"]').should('be.visible');
  }
  cy.get(`[data-cy=caaMember-${choice}]`)
    .click();
  cy.SubmitForm();
});

Cypress.Commands.add('ExistingHdCov', (choice = 'N', checkForFrenchToggle = false) => {
  cy.waitUntilHasOne(`existing_hd_cov-${choice}`);
  cy.task('log', 'CaaMember');
  cy.get(`[data-cy=existing_hd_cov-${choice}]`)
    .click();
  if (checkForFrenchToggle) {
    cy.get('[data-testid="language-toggle"]').should('be.visible');
  }
  cy.get('[data-cy=group-benefits-submit]:visible')
    .click();
});

Cypress.Commands.add('GroupBenefits', (option = 'N', checkForFrenchToggle = false) => {
  cy.waitUntilHasOne(`groupBenefits-${option}`);
  cy.task('log', 'GroupBenefits');
  cy.get(`[data-cy=groupBenefits-${option}]`)
    .click();
  if (checkForFrenchToggle) {
    cy.get('[data-testid="language-toggle"]').should('be.visible');
  }
  cy.get('[data-cy=group-benefits-submit]:visible')
    .click();
});

Cypress.Commands.add('CoverageFitFlag', (option) => {
  cy.waitUntilHasOne(`cov_fit_options-${option}`);
  cy.task('log', 'CoverageFitFlag');
  cy.get(`[data-cy=cov_fit_options-${option}]`)
    .click();
  cy.get('[data-cy=coverage-fit-submit]:visible')
    .click();
  cy.wait('@hd-quotes');
});

Cypress.Commands.add('EffectiveDateWidget', (timestamp) => {
  cy.task('log', 'EffectiveDateWidget');
  cy.get('[data-form-id="calendar_input"]')
    .click({ force: true });
  cy.get(`[aria-current="date"]`)
    .click();
  cy.get('[data-cy=group-benefits-submit]:visible')
    .click();
});

Cypress.Commands.add('LifeInsuranceCalculatorProvince', (province) => {
  cy.task('log', 'LifeInsuranceCalculatorProvince');
  cy.ClickInSelect(`addressProvince`, getEnglishMessageWithId(province.props.id));
});

Cypress.Commands.add('LifeInsuranceCalculatorPartner', (hasPartner) => {
  cy.task('log', 'LifeInsuranceCalculatorPartner');
  if (hasPartner === 'Y') {
    cy.get('[data-cy=hasPartner-Y]')
      .click();
  } else if (hasPartner === 'N') {
    cy.get('[data-cy=hasPartner-N]')
      .click();
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorBirthdate', (primaryBirthdate, hasPartner, partnerBirthdate) => {
  cy.task('log', 'LifeInsuranceCalculatorBirthdate');
  cy.Birthdate(primaryBirthdate, 'primaryDob');
  if (hasPartner) {
    cy.Birthdate(partnerBirthdate, 'partnerDob');
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorKids', (hasKids, childrenAges) => { // childrenAges is an array
  cy.task('log', 'LifeInsuranceCalculatorKids');
  if (hasKids === 'Y') {
    cy.get('[data-cy=hasKids-Y]')
      .click()
      .then(() => {
        for (let i = 0; i < childrenAges.length - 1; i++) {
          cy.get('[data-cy=addKid]')
            .click();
        }
        cy.get(`[data-cy^='child-']`).each(($el, index, $list) => {
          cy.wrap($el).type(childrenAges[index]);
        });
      });
  } else if (hasKids === 'N') {
    cy.get('[data-cy=hasKids-N]')
      .click();
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorKidsEducation', (payKidsEducation) => {
  cy.task('log', 'LifeInsuranceCalculatorKidsEducation');
  if (payKidsEducation === 'Y') {
    cy.get('[data-cy=cover_education-Y]')
      .click();
  } else if (payKidsEducation === 'N') {
    cy.get('[data-cy=cover_education-N]')
      .click();
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorSmoker', (doesSmoke) => {
  cy.task('log', 'LifeInsuranceCalculatorSmoker');
  if (doesSmoke === 'Y') {
    cy.get('[data-cy=smoke-Y]')
      .click();
  } else if (doesSmoke === 'N') {
    cy.get('[data-cy=smoke-N]')
      .click();
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorIncome', (myIncome, partnerIncome) => { // if case doesn't have a partner, partnerIncome shouldn't be entered
  cy.task('log', 'LifeInsuranceCalculatorIncome');
  cy.get('[data-cy=userIncome]')
    .type(myIncome, { force: true });
  if (partnerIncome) {
    cy.get('[data-cy=partnerIncome]')
      .type(partnerIncome, { force: true });
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorResidence', (rentOrOwn, monthly, curBalance) => { // rentOrOwn should be 'rent' or 'own'
  cy.task('log', 'LifeInsuranceCalculatorResidence');
  if (rentOrOwn === 'rent') {
    cy.get('[data-cy=residenceType-Rent]')
      .click();
  } else if (rentOrOwn === 'own') {
    cy.get('[data-cy=residenceType-Own]')
      .click();

    cy.get('[data-cy=mortgage]')
      .type(curBalance, { force: true });
  }
  cy.get('[data-cy=exps_residence]')
    .type(monthly, { force: true });
});

Cypress.Commands.add('LifeInsuranceCalculatorSavings', (hasSavings, retirementSavings, nonRetirementSavings) => {
  cy.task('log', 'LifeInsuranceCalculatorSavings');
  if (hasSavings === 'Y') {
    cy.get('[data-cy=retirementSavings]')
      .type(retirementSavings, { force: true });

    cy.get('[data-cy=nonRetirementSavings]')
      .type(nonRetirementSavings, { force: true });
  } else if (hasSavings === 'N') {
    cy.get('[data-cy=retirementSavings]')
      .type(0, { force: true });
    cy.get('[data-cy=nonRetirementSavings]')
      .type(0, { force: true });
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorTotalExistingCoverage', (hasExistingCoverage, totalCoverage) => {
  cy.task('log', 'LifeInsuranceCalculatorTotalExistingCoverage');
  if (hasExistingCoverage === 'Y') {
    cy.get('[data-cy="totalExistingCoverage"]')
      .type(totalCoverage, { force: true });
  } else if (hasExistingCoverage === 'N') {
    cy.get('[data-cy="totalExistingCoverage"]')
      .type(0, { force: true });
  }
});

Cypress.Commands.add('LifeInsuranceCalculatorExpenses', (expensesObject) => {
  cy.task('log', 'LifeInsuranceCalculatorExpenses');
  cy.ClearAndType('utilitiesExpenses', expensesObject.utilities);
  cy.ClearAndType('telecomExpenses', expensesObject.telecom);
  cy.ClearAndType('foodExpenses', expensesObject.food);
  cy.ClearAndType('shoppingExpenses', expensesObject.shopping);
  cy.ClearAndType('transportationExpenses', expensesObject.transportation);
  cy.ClearAndType('childcareExpenses', expensesObject.childcare);
  cy.ClearAndType('discretionaryExpenses', expensesObject.discretionary);
  cy.ClearAndType('otherExpenses', expensesObject.other);

  cy.get('[data-cy=totalExpenses')
    .invoke('text')
    .should('equal', `$${expensesObject.utilities + expensesObject.telecom + expensesObject.food + expensesObject.shopping + expensesObject.transportation + expensesObject.childcare + expensesObject.discretionary + expensesObject.other}`);
});

Cypress.Commands.add('hdPrescriptionDrugs', (choice = 'N') => {
  cy.task('log', 'hdPrescriptionDrugs');
  cy.waitUntilHasOne(`prescriptionDrugs-${choice}`);
  cy.get(`[data-cy=prescriptionDrugs-${choice}]`)
    .click();
  cy.get('[data-cy=prescription-drugs-submit]:visible')
    .click();
});

Cypress.Commands.add('hdCoverPrescription', (underwritingMethod) => {
  cy.task('log', 'hdDeterminePlans');
  if (underwritingMethod === UNDERWRITING_METHODS.GUARANTEED_ISSUE) {
    cy.get('[data-cy=want_prescription_coverage-N]')
      .click();
  } else if (underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN) {
    cy.get('[data-cy=want_prescription_coverage-Y]')
      .click();
  }
  cy.get('[data-cy=cover-prescription-submit]:visible')
    .click();
});

Cypress.Commands.add('hdSelectPlan', (plan, checkForFrenchToggle = false) => {
  if (checkForFrenchToggle) {
    cy.get('[data-testid="language-toggle"]').should('be.visible');
  }
  cy.get(`[data-cy=${plan}]`).click();
  cy.SegmentTrack(SEGMENT_EVENTS.QUOTE_RECEIVED, {
    selected_coverage_amount: 'number',
    selected_monthly_premium: 'string',
    product_type: 'string',
    product_name: 'string',
    buying_method: 'string',
    discounts: 'string',
  });
});

Cypress.Commands.add('hdSelectDentalSecurePlan', () => {
  cy.get('[data-cy=falseNextSteps]').click();
  cy.get('[data-cy=dental_secure]').click();
});

Cypress.Commands.add('hdSelectStandardPlan', () => {
  cy.get('[data-cy=standard]').click();
});

Cypress.Commands.add('TestCase', (caseNumber) => {
  cy.wrap(caseNumber).as('caseNumber');
});

Cypress.Commands.add('LogBehaviour', (key, value) => {
  cy.get('@caseNumber').then((caseNumber) => {
    if (!caseNumber) {
      throw new Error('TestCase not set. Make sure your test is calling the TestCase command');
    }
    const logKey = `${key}_TestCase${caseNumber}`;
    const logValue = value ? `: ${value}` : '';
    cy.task('log', `${logKey}${logValue}`);
  });
});

Cypress.Commands.add('LogTenant', (tenantId) => {
  cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.TENANT_ID, tenantId);
});

Cypress.Commands.add('CheckSimplifiedLife', (number_of_application_created, number_of_policies_created ) => {
  const isSimplifiedLifeEnabled = Cypress.env('PM_ENABLE_SIMPLIFIED_LIFE');
  if (isSimplifiedLifeEnabled === '1') {
    cy.get('@createSimplifiedLifeApp.all').then((interceptions) => {
      expect(interceptions).to.have.length(number_of_application_created);
    });
    cy.get('@createSimplifiedLifePolicy.all').then((interceptions) => {
      expect(interceptions).to.have.length(number_of_policies_created);
    });
    if (number_of_policies_created > 0) {
      cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.IS_SIMPLIFIED_LIFE);
    }
  } else {
    cy.get('@createSimplifiedLifeApp.all').then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
    cy.get('@createSimplifiedLifePolicy.all').then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
  }
});

Cypress.Commands.add('settlePolicy', (app_id) => {
  cy.LogBehaviour(ITT_BEHAVIOUR_MESSAGE.SETTLED_POLICY);
  cy.request({
    method: 'POST',
    url: `${Cypress.env('portalDomain')}/api/v1/policyme/policy-settled`,
    body: {
      app_id,
      settlement_date: '19/07/2024',
      is_override_settlement_checks_enabled: true,
    },
    headers: getPortalRequestHeaders(),
    timeout: 180000,
  }).then((response) => {
    cy.task('log', 'Policy settled');
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('OTPVerification', () => {
  cy.wait('@sendOtp');
  cy.task('log', 'OTPVerification');
  cy.ClearAndType('verificationCode', '253647');
  cy.get('[data-cy=submit]:visible')
    .click();
  cy.wait('@verifyOtp');
  cy.SegmentTrack(SEGMENT_EVENTS.APPLICATION_STARTED, {});
  cy.wait('@rehydrateJourney', { timeout: 30000 });
  cy.SegmentTrack(SEGMENT_EVENTS.LOGIN_SUCCESSFUL, {});
});

Cypress.Commands.add('forceDocusignJourney', () => {
  // For existing docusign tests, force docusign journey override even for digital consent tenants
  cy.get('[aria-label="Enable Docusign Journey override"]').click({ force: true });
});

Cypress.Commands.add('setStripeDebugMode', () => {
  cy.get('[aria-label="Set Stripe Debug Mode"]').click({ force: true });
});

Cypress.Commands.add('ClearInputByBackspaces', (dataCy) => {
  cy.get(dataCy).invoke('val').then((val) => {
    cy.get(dataCy).type('{backspace}'.repeat(val.length), { delay: 30 });
  });
});

// Must be placed before cy.visit() so the HTML response can be intercepted properly.
Cypress.Commands.add('ChangeTenantFlag', (urlPath, tenantFlag, value) => {
  cy.intercept('GET', urlPath, (req) => {
    req.reply((res) => {
      let modifiedBody = res.body.replace(
        new RegExp(`"${tenantFlag}":(true|false)`, 'g'),
        `"${tenantFlag}":${value}`,
      );
      res.send(modifiedBody);
    });
  });
});

Cypress.Commands.add('getBeneficiariesMinorToggleInputError', (index, hasError) => {
  if (!hasError) {
    cy.get(`[data-cy="is-minor-${index}-false"]`).parent().should('have.class', 'MuiFormGroup-root')
      .parent()
      .find('.MuiFormHelperText-root')
      .should('not.have.text');
  } else {
    cy.get(`[data-cy="is-minor-${index}-false"]`).parent().should('have.class', 'MuiFormGroup-root')
      .parent()
      .find('.MuiFormHelperText-root')
      .should('have.text', 'Select one of the options');
  }
});

Cypress.Commands.add('StartFromQuotesUrl', (
  product, primaryUser, secondaryUser, affiliate_id = null, caa_discount = 'False', isPermLifeEnabled = 'False',
) => {
  cy.task('log', 'StartFromQuotesUrl');
  let {
    desiredCoverageAmountSliderValue,
    desiredTermLength,
    birthdate,
    gender,
    smoker,
    province,
  } = primaryUser;
  let birthdateUrl = moment(birthdate, 'D MMMM YYYY').format('DDMMYYYY');
  gender = gender === 'Male' ? 'M' : 'F';
  smoker = smoker === 'Y' ? 'True' : 'False';

  let hasPartner, partnerGender, partnerBirthdate, partnerSmoker;
  if (secondaryUser) {
    hasPartner = 'True';
    ({ partnerGender, partnerBirthdate, partnerSmoker } = secondaryUser);
    partnerGender = partnerGender === 'Male' ? 'M' : 'F';
    partnerSmoker = partnerSmoker === 'Y' ? 'True' : 'False';
    partnerBirthdate = moment(partnerBirthdate, 'D MMMM YYYY').format('DDMMYYYY');
  } else {
    hasPartner = 'False';
    partnerGender = 'None';
    partnerBirthdate = 'None';
    partnerSmoker = 'None';
  }
  cy.visit(`${Cypress.env('baseURL')}/life/${product}/life-insurance-quotes-continued?email_ref_v0=1&cov_amt=${desiredCoverageAmountSliderValue}&term=${desiredTermLength}&birthdate=${birthdateUrl}&gender=${gender}&smoker=${smoker}&province=${province}&application_language=en-CA&buying_method=None&isPermLifeEnabled=${isPermLifeEnabled}&caa_discount=${caa_discount}&partner=${hasPartner}&partner_birthdate=${partnerBirthdate}&partner_gender=${partnerGender}&partner_province=${province}&partner_smoker=${partnerSmoker}&insurance_ownership_type=individual&debug=1&cypress=1${affiliate_id ? `&affiliate_id=${affiliate_id}` : ''}`);
});

Cypress.Commands.add('AirmilesNumber', (hasAirmiles, number) => {
  if (hasAirmiles) {
    cy.get('[data-cy="airmilesNumber-Y"]').click();
    if (number) {
      cy.get('input[name="airmilesNumber"]').type(number);
    }
  } else {
    cy.get('[data-cy="airmilesNumber-N"]').click();
  }
  cy.get('[data-cy="submit"]').click();
});

/**
 * Override cy.wait to automatically use waitForEndpointSuccess for ITT tests
 * This provides automatic endpoint response processing with multiple success code support
 * Only applies to ITT test files (InternalToolTesting directory)
 */
Cypress.Commands.overwrite('wait', (originalFn, subject, ...args) => {
  
  // Detect if this is an ITT test file
  const testFilePath = Cypress.spec?.relative || '';
  const isITT = testFilePath.includes('InternalToolTesting');
  
  // For cy.wait(), Cypress passes subject (undefined for parent commands) then the actual arguments
  // So if subject is undefined, the first real argument is args[0], otherwise subject is the first arg
  const aliasOrTimeout = subject !== undefined ? subject : args[0];
  const options = subject !== undefined ? args[0] : args[1];
  
  
  // If waiting for an alias in ITT test, use enhanced wait function
  if (isITT && typeof aliasOrTimeout === 'string' && aliasOrTimeout.startsWith('@')) {

    const alias = aliasOrTimeout;
    const config = ITT_ENDPOINT_CONFIG[alias] || ITT_ENDPOINT_CONFIG['@default'];
    // Use the enhanced wait function with configuration
    return cy.waitForEndpointSuccess({
      alias,
      successCodes: config.successCodes,
      maxFailures: config.maxFailures,
      timeout: options?.timeout || config.timeout,
      responseTimeout: options?.responseTimeout || config.responseTimeout,
      originalWaitFn: originalFn,
    });
  }
  
  // Otherwise use original wait function (for non-ITT tests or non-alias waits)
  return originalFn(subject, ...args);
});
