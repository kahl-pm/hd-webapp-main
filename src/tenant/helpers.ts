import { getTenant, hasFlag, TENANT_FLAGS, sentryError, TENANTS_NAME_CODES_MAPPING } from '@policyme/global-libjs-utils';
import tenantMessages from './tenantKeys';
import { PM_ENABLE_HD, PM_ENVIRONMENT } from '../config';

export const getTenantBasedFormattedText = (intl, textSelector) => {
  const tenantName = getTenant().name;
  const tenantCode = getTenant().code;
  try {
    return intl.formatMessage(tenantMessages[`${tenantCode}_${textSelector}`]);
  } catch (e) {
    sentryError('Error getting formatted message for tenant', { extras: {
      tenantName,
      tenantCode,
      textSelector,
      e,
    } });
    return '';
  }
};

export const isCAAEnvironment = () => {
  return getTenant().code === TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL;
};

export const isPMEnvironment = () => {
  return getTenant().code === TENANTS_NAME_CODES_MAPPING.POLICYME;
};

export const isCIBCEnvironment = () => {
  return getTenant().code === TENANTS_NAME_CODES_MAPPING.CIBC;
};

export const isBCLEnvironment = () => {
  return getTenant().code === TENANTS_NAME_CODES_MAPPING.BLUE_CROSS;
};

// TODO: Remove this once we have a better way to tenantise Journeys
// INFO: This function is being used in the legacy journey. Please do
// avoid using it.
export const isBMOIEnvironment = () => {
  return getTenant().code === TENANTS_NAME_CODES_MAPPING.BMOI;
};

export const getTenantCode = () => {
  return getTenant().code;
};

export const isHDEnabled = () => {
  return true;
};
