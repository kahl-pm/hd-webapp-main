import { useSelector } from 'react-redux';
import { PM_PRODUCT_PREFIX, TENANTS } from '@policyme/global-libjs-utils';
import { AUTHORIZATION_TYPE, AuthorizationType, UserType } from './const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { getTenantCode } from '../tenant/helpers';

export type AuraConsentType = typeof AURA_CONSENT_TYPES[keyof typeof AURA_CONSENT_TYPES];
export const AURA_CONSENT_TYPES = {
  DIGITAL_CONSENT_JOURNEY: 'DIGITAL_CONSENT_JOURNEY',
  DOCUSIGN_JOURNEY: 'DOCUSIGN_JOURNEY',
} as const;

// These consent versions are used to store consent copy across our webapp
// in AURA_AUTHORIZATION db records so that we know the version of consent a user saw on the webapp
// We use these versions to get the correct lokalise key to display the correct consent copy
// as well as keep track of the version of the lokalise key the user saw
// pm_documents use these keys to generate the correct consent documents based on the version
// IMPORTANT:
// keep POLICY_DOCUMENT_TYPES.Q_AND_A.value constant in pm_documents up to date with
// AUTHORIZATION_TYPE.MIB, AUTHORIZATION_TYPE.FUW_HD, AUTHORIZATION_TYPE.GI constants
// https://www.notion.so/policyme/Updating-Consent-Page-Copy-for-HD-5bd6ab8f2af64f669a759bca17aada1f?pvs=4
export const DEFAULT_CONSENT_VERSIONS = {
  [TENANTS.PM.code]: {
    [PM_PRODUCT_PREFIX.HD]: {
      [AUTHORIZATION_TYPE.MIB]: '8.0.0',
      [AUTHORIZATION_TYPE.FUW_HD]: '2.0.2',
      [AUTHORIZATION_TYPE.GI]: '2.0.2',
      [AUTHORIZATION_TYPE.EXCLUSION]: '1.0.0',
    },
  },
  [TENANTS.CAA.code]: {
    [PM_PRODUCT_PREFIX.HD]: {
      [AUTHORIZATION_TYPE.MIB]: '8.0.0',
      [AUTHORIZATION_TYPE.FUW_HD]: '2.0.2',
      [AUTHORIZATION_TYPE.GI]: '2.0.2',
      [AUTHORIZATION_TYPE.EXCLUSION]: '1.0.0',
    },
  },
  [TENANTS.CIBC.code]: {
    // CIBC does not have HD
  },
  [TENANTS.BCL.code]: {
    // BCL does not have HD
  },
  [TENANTS.BMOI.code]: {
    [PM_PRODUCT_PREFIX.HD]: {
      [AUTHORIZATION_TYPE.MIB]: '8.0.0',
      [AUTHORIZATION_TYPE.FUW_HD]: '2.0.2',
      [AUTHORIZATION_TYPE.GI]: '2.0.2',
      [AUTHORIZATION_TYPE.EXCLUSION]: '1.0.0',
    },
  },
} as const;

export const useConsentVersion = (
  userType:UserType,
  authorizationType:AuthorizationType,
  auraConsentType?:AuraConsentType,
):string => {
  const mainProduct = useSelector(state => getMainProduct(state, userType));
  const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][mainProduct];
  if (authorizationType === AUTHORIZATION_TYPE.MIB) {
    return consentVersions[authorizationType][auraConsentType];
  }
  return consentVersions[authorizationType];
};
