import { encodeEnvVar, SHARED_PUBLIC_KEYS } from '@policyme/global-libjs-utils';

import { PUBLIC_KEYS } from '../src/tenant/consts';

// TODO: Remove PM_ versions once SecretsManager is updated
export const mapTenantToPublicKeys = (tenant) => ({
  [`${encodeEnvVar(PUBLIC_KEYS.AUTH0_CLIENT_ID)}`]: process.env[`TENANT_AUTHO_CLIENT_ID_${tenant.code}`] || process.env[`PM_AUTHO_CLIENT_ID_${tenant.code}`],
  [`${encodeEnvVar(PUBLIC_KEYS.AUTH0_HOST)}`]: process.env[`TENANT_AUTHO_HOST_${tenant.code}`] || process.env[`PM_AUTHO_HOST_${tenant.code}`],
  [`${encodeEnvVar(PUBLIC_KEYS.STRIPE)}`]: process.env[`TENANT_STRIPE_PUBLIC_KEY_${tenant.code}`] || process.env[`PM_STRIPE_PUBLIC_KEY_${tenant.code}`],
  [`${encodeEnvVar(PUBLIC_KEYS.SEGMENT)}`]: process.env[`TENANT_SEGMENT_KEY_${tenant.code}${tenant.suborg?.name ?? ''}`] || process.env[`PM_SEGMENT_KEY_${tenant.code}${tenant.suborg?.name ?? ''}`],
  [`${encodeEnvVar(SHARED_PUBLIC_KEYS.FLAGSMITH_ENVIRONMENT_KEY)}`]:
    process.env[`TENANT_FLAGSMITH_ENVIRONMENT_KEY_${tenant.code}`] || process.env.PM_FLAGSMITH_ENVIRONMENT_KEY,

  // TODO: Remove these PM-specific keys analytics once segment is set up
  [`${encodeEnvVar(PUBLIC_KEYS.FACEBOOK)}`]: process.env[`TENANT_FACEBOOK_PIXEL_${tenant.code}`] || process.env.PM_FACEBOOK_PIXEL,
});
