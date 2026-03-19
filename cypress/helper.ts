import * as moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { BUYING_METHOD } from '../src/utils/const';

export const emailCreator = (testCaseNumber, insurer = 'PM', journey = '') => {
  return `qa+testcase${testCaseNumber}-${moment().format('YYYYMMDDHHmm')}-${insurer}-${journey}@policyme.com`;
};

export const idVerificationEmailCreator = (testCaseNumber, idVerModifier) => {
  return `qa-testcase${testCaseNumber}-${moment().format('YYYYMMDDHHmm')}+equifax-${idVerModifier}@policyme.com`;
};

// Should match FAMILY_DATA_VALUE in consts
export type FamilyComposition = typeof FAMILY_COMPOSITION[keyof typeof FAMILY_COMPOSITION];
export const FAMILY_COMPOSITION = {
  SELF_PARTNER_KIDS: 0,
  SELF_PARTNER: 1,
  SELF_KIDS: 2,
  SELF: 3,
} as const;

export const convertNormalEmailToTimestampedEmail = (email) => {
  const timestamp = new Date().getTime();
  return email.split('@').join(`+${timestamp}@`);
};

export const getPortalRequestHeaders = () => ({
  'Content-Type': 'application/json; charset=utf-8',
  'X-sa-email': Cypress.env('serviceAccountEmail'),
  'X-Tenant-Id': Cypress.env('tenantId'),
  Authorization: `Bearer ${Cypress.env('portalAccessToken')}`,
  Permission: Cypress.env('permissionsToken'),
});

export const getPortalApprovedResetBody = (app_id, product_type, reset_type) => ({
  app_id,
  buying_method: BUYING_METHOD.STAND_ALONE,
  product_type,
  reset_steps: reset_type,
});


export const getSiliTriageBody = (app_id, product_type) => ({
  app_id,
  current_initial_row: [],
  current_table: [],
  product_type,
  buying_method: BUYING_METHOD.STAND_ALONE,
  aura_recent_labs_and_vitals: "In the last 12 months, has the customer had a blood test, a urine test and their height and weight measured by a healthcare provider? Unsure",
  new_table: [
    {
      id: 0,
      underwriting_requirement: "Nurse Visit",
      underwriting_details: "Blood",
      nurse_details_dropdown: ["Blood"]
    }
  ],
});

export const booleanOption = (value:boolean) => (value ? 'Yes' : 'No');

export const getTokenExpiration = (encodedToken:string):{ issued: Date, expiration: Date } => {
  const { iat, exp } = jwtDecode(encodedToken);
  return {
    issued: new Date(iat * 1000),
    expiration: new Date(exp * 1000),
  };
};

export const checkDomElements = (elements) => {
  elements.forEach(({ dataCy, shouldExist }) => {
    cy.get(`[data-cy="${dataCy}"]`).should(shouldExist ? 'exist' : 'not.exist');
  });
};

export const checkNestedDomElements = (elements, dataCyParent) => {
  elements.forEach(({ dataCy, shouldExist }) => {
    cy.get(`[data-cy="${dataCyParent}"]`).find(`[data-cy="${dataCy}"]`).should(shouldExist ? 'exist' : 'not.exist');
  });
};

export const checkToolTips = (toolTips) => {
  toolTips.forEach(({ dataCy, snapshotDesc, label }) => {
    cy.get(`[data-cy="${dataCy}"]`).find(label ? `[aria-label="${label}"]` : 'div.tooltip' ).click();
    cy.get('[data-cy="CloseModalButton"]').eq(0).click();
  });
};

export const checkModals = (modals) => {
  modals.forEach(({ dataCy, snapshotDesc }) => {
    cy.get(`[data-cy="${dataCy}"]`).eq(0).click();
    cy.get('[data-cy="CloseModalButton"], .closeIcon').eq(0).click();
  });
};

export const stepTo = ($el, target) => {
  const step = $el[0].getAttribute('step') || 1;
  const current = $el[0].value;
  const diff = target - current;
  const steps = Math.abs(diff * step);
  if (diff > 0) {
    $el[0].stepUp(steps);
  } else {
    $el[0].stepDown(steps);
  }
}