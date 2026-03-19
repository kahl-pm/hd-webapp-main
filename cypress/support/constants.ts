/* Cypress log messages that signify specific behaviours that can affect
 * our validation logic. These must match the BEHAVIOUR_MESSAGE enum
 * in global-libpy-tests::pm_tests/utils/itt_helpers.py
 */
export type ITTBehaviourMessage = typeof ITT_BEHAVIOUR_MESSAGE[keyof typeof ITT_BEHAVIOUR_MESSAGE];
export const ITT_BEHAVIOUR_MESSAGE = {
  TENANT_ID: 'tenantId',
  IS_DIGITAL_CONSENT: 'isDigitalConsent',
  RESET_PAYMENT_STEPS: 'resetPaymentSteps',
  RESET_CONSENT_STEPS: 'resetConsentSteps',
  SETTLED_POLICY: 'settledPolicy',
  IS_PERM_LIFE: 'isPermLife',
  IS_SIMPLIFIED_LIFE: 'isSimplifiedLife',
} as const;
export const STRIPE_NSF_CARD = '4000000000009995';
export const INSUFFICIENT_FUNDS_ERROR_MESSAGE =
  'The card has insufficient funds to complete the purchase. Please try again with another card.';


// Selector ladder (most stable → least): data-field+name, explicit ids, id suffix match, autocomplete
export const STRIPE_FORM_FIELD_SELECTORS = {
  CARD_NUMBER: [
    '[data-field="number"] input[name="number"]',
    '#payment-numberInput',
    '#Field-numberInput',
    'input[id$="numberInput"]',
    'input[autocomplete="cc-number"]',
  ].join(', '),

  EXPIRY_DATE: [
    '[data-field="expiry"] input[name="expiry"]',
    '#payment-expiryInput',
    '#Field-expiryInput',
    'input[id$="expiryInput"]',
    'input[autocomplete="cc-exp"]',
  ].join(', '),

  CVC: [
    '[data-field="cvc"] input[name="cvc"]',
    '#payment-cvcInput',
    '#Field-cvcInput',
    'input[id$="cvcInput"]',
    'input[autocomplete="cc-csc"]',
  ].join(', '),

  COUNTRY: [
    '[data-field="country"] select[name="country"]',
    '#payment-countryInput',
    '#Field-countryInput',
    'select[id$="countryInput"]',
    'select[autocomplete="billing country"]',
  ].join(', '),

  POSTAL_CODE: [
    '[data-field="postalCode"] input[name="postalCode"]',
    '#payment-postalCodeInput',
    '#Field-postalCodeInput',
    'input[id$="postalCodeInput"]',
    'input[autocomplete="billing postal-code"]',
  ].join(', '),
};