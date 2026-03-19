/**
 * Client-side version of server/public_keys.js
 *
 * Uses getFromEnvironment() to read from runtime env vars
 * (window.ENVIRONMENT_VARIABLES) instead of process.env[...],
 * since sensitive keys are not available at build time.
 */
import { encodeEnvVar, SHARED_PUBLIC_KEYS } from '@policyme/global-libjs-utils';
import { PUBLIC_KEYS } from './consts';
import { getFromEnvironment } from '../utils/environmentHelpers';

export const mapTenantToPublicKeys = (tenant) => ({
  [`${encodeEnvVar(PUBLIC_KEYS.AUTH0_CLIENT_ID)}`]:
    getFromEnvironment(`TENANT_AUTHO_CLIENT_ID_${tenant.code}`) ||
    getFromEnvironment(`PM_AUTHO_CLIENT_ID_${tenant.code}`),
  [`${encodeEnvVar(PUBLIC_KEYS.AUTH0_HOST)}`]:
    getFromEnvironment(`TENANT_AUTHO_HOST_${tenant.code}`) ||
    getFromEnvironment(`PM_AUTHO_HOST_${tenant.code}`),
  [`${encodeEnvVar(PUBLIC_KEYS.STRIPE)}`]:
    getFromEnvironment(`TENANT_STRIPE_PUBLIC_KEY_${tenant.code}`) ||
    getFromEnvironment(`PM_STRIPE_PUBLIC_KEY_${tenant.code}`),
  [`${encodeEnvVar(PUBLIC_KEYS.SEGMENT)}`]:
    getFromEnvironment(`TENANT_SEGMENT_KEY_${tenant.code}${tenant.suborg?.name ?? ''}`) ||
    getFromEnvironment(`PM_SEGMENT_KEY_${tenant.code}${tenant.suborg?.name ?? ''}`),
  [`${encodeEnvVar(SHARED_PUBLIC_KEYS.FLAGSMITH_ENVIRONMENT_KEY)}`]:
    getFromEnvironment(`TENANT_FLAGSMITH_ENVIRONMENT_KEY_${tenant.code}`) ||
    getFromEnvironment('PM_FLAGSMITH_ENVIRONMENT_KEY'),
  [`${encodeEnvVar(PUBLIC_KEYS.FACEBOOK)}`]:
    getFromEnvironment(`TENANT_FACEBOOK_PIXEL_${tenant.code}`) ||
    getFromEnvironment('PM_FACEBOOK_PIXEL'),
});
