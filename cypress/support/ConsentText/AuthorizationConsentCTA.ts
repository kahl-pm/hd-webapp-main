import { LOCALE, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import { AURA_CONSENT_TYPES, AuraConsentType } from '../../../src/utils/consentVersion';
import { ExpectedConsentCTA } from './types';

/**
 * THIS COPY IS LEGALLY BINDING AND EXTREMELY IMPORTANT
 * IF TESTS USING THIS COPY ARE BREAKING, SOMETHING IS PROBABLY VERY WRONG
 * DO NOT CHANGE THIS COPY WITHOUT CONSULTING LEGAL
 */
export const EXPECTED_CONSENT_CTA_VERSIONS:
Record<TenantCodeType, Record<AuraConsentType, ExpectedConsentCTA>> = {
  [TENANTS_NAME_CODES_MAPPING.CIBC]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {},
      },
      joint: {
        version: 'v8.0.0',
        text: {},
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v9.0.0',
        text: {
          [LOCALE.EN_CA]: 'Consent and Continue',
          [LOCALE.FR_CA]: 'Consentir et continuer',
        },
      },
      joint: {
        version: 'v9.0.0',
        text: {
          [LOCALE.EN_CA]: 'Consent and Continue',
          [LOCALE.FR_CA]: 'Consentir et continuer',
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
    },
  },
  [TENANTS_NAME_CODES_MAPPING.BLUE_CROSS]: {
    [AURA_CONSENT_TYPES.DOCUSIGN_JOURNEY]: {
      primary: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
      joint: {
        version: 'v8.0.0',
        text: {
          [LOCALE.EN_CA]: 'Accept and Continue',
          [LOCALE.FR_CA]: 'Accepter et continuer',
        },
      },
    },
    [AURA_CONSENT_TYPES.DIGITAL_CONSENT_JOURNEY]: {
      primary: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
      joint: {
        version: 'v11.0.0',
        text: {
          [LOCALE.EN_CA]: 'Agree and Continue',
          [LOCALE.FR_CA]: 'Accepter et Continuer',
        },
      },
    },
  },
};
