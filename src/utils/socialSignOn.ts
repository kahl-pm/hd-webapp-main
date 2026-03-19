import { getPublicKey, getTenant, getAuth0RedirectHost } from '@policyme/global-libjs-utils';
import { PUBLIC_KEYS } from '../tenant/consts';
import { encodeEnvVar } from './environmentHelpers';

export const getSocialSignOnUrl = (connection: string, appId: string): string => {
  const tenant = getTenant();
  if (!tenant?.id) {
    return null;
  }

  const auth0Host = getPublicKey(encodeEnvVar(PUBLIC_KEYS.AUTH0_HOST));
  const auth0ClientId = getPublicKey(encodeEnvVar(PUBLIC_KEYS.AUTH0_CLIENT_ID));
  const auth0RedirectHost = getAuth0RedirectHost();
  return `${auth0Host}/authorize?response_type=code&client_id=${auth0ClientId}&redirect_uri=${auth0RedirectHost}/api/global-accounts/v1/${tenant.id}/auth/callback%3Fapp_id%3D${appId}&connection=${connection}&scope=openid%20profile%20email&state=hd-webapp-main|${btoa(window.location.origin)}`;
};
