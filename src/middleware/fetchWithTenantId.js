import { getTenant } from '@policyme/global-libjs-utils';
import jsCookie from 'js-cookie';
import { PM_ONDEMAND_ENV } from '../config';

// Fetch request middleware
const fetchWithTenantIdMiddleware = (url, options) => {
  const tenant = getTenant();
  const existingOptions = options ?? {};
  const existingHeaders = existingOptions.headers ?? {};
  const ondemandHost = PM_ONDEMAND_ENV ?? undefined;

  const tenantHeaders = {
    'X-tenant-id': tenant.id,
  };

  const otherHeaders = {
    'X-PolicyMe-ondemand': ondemandHost,
  };
  if (tenant.suborg) {
    tenantHeaders['X-tenant-suborg-id'] = tenant.suborg.id;
  }

  const trace_id = jsCookie.get('x-policyme-trace-id');
  if (trace_id !== undefined) {
    tenantHeaders['X-policyme-trace-id'] = trace_id;
  }
  return [
    url,
    {
      ...existingOptions,
      headers: {
        ...existingHeaders,
        ...tenantHeaders,
        ...otherHeaders,
      },
    },
  ];
};
export default fetchWithTenantIdMiddleware;
