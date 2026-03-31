/**
 * Tenant initialization module.
 *
 * IMPORTANT: This module MUST be imported before any module that calls getTenant()
 * (e.g., the Redux store). It sets window.__policyme so that getTenant() from
 * @policyme/global-libjs-utils returns the correct tenant context.
 *
 * With the Vite migration, there is no SSR to inject __policyme via a <script> tag,
 * so we do it here as a module side-effect that runs before the store is created.
 */
import { server } from '@policyme/global-libjs-utils';
import { mapTenantToPublicKeys } from './tenant/publicKeys';

const hostname = window.location.hostname;
const tenantInfo = server.getTenantInfo(hostname);
if (tenantInfo) {
  server.applyTenantInjection(window, hostname, tenantInfo, mapTenantToPublicKeys);
} else {
  console.error(`Unable to find tenant for hostname: ${hostname}`);
}
