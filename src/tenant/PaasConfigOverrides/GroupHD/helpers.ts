import { hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { PM_ENABLE_GROUP_HD_CAA, PM_ENVIRONMENT } from '../../../config';

/**
 * DO NOT USE THIS FUNCTION DIRECTLY FOR COMPONENTS / UI CUSTOMISATIONS
 * Please follow customisation framework in PaasConfigOverrides/index.ts
 *
 * This is only used for temporary feature flag checks to release group in an off-state in prod.
 * Remove PM_ENABLE_GROUP_HD_CAA feature flag once group is live.
 *
 * @returns
 */
export const isGroupHDEnabled = () => {
  if (PM_ENVIRONMENT === 'prod' || PM_ENVIRONMENT === 'production') {
    return hasFlag(TENANT_FLAGS.ENABLE_GROUP_HD) && PM_ENABLE_GROUP_HD_CAA === '1';
  }
  return hasFlag(TENANT_FLAGS.ENABLE_GROUP_HD);
};
