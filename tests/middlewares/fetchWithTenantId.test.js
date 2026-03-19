import { getTenant } from '@policyme/global-libjs-utils';
import tenantIdRequestMiddleware from '../../src/middleware/fetchWithTenantId';
import { fetch, addRequestMiddleware, __INNER_FETCHER } from '../../src/utils/fetch';

jest.mock('@policyme/global-libjs-utils');

describe('initFetchInterceptorWithTenantId', () => {
  let originalFetch;
  beforeEach(() => {
    originalFetch = __INNER_FETCHER.fetch;
    __INNER_FETCHER.fetch = jest.fn();
  });

  afterEach(() => {
    __INNER_FETCHER.fetch = originalFetch;
  });

  it('should add X-tenant-id header to the config', async () => {
    const tenantId = 'example-tenant-id';
    const tenantSuborgId = 'example-tenant-suborg-id';
    const url = `https://example.com/api/endpoint`;

    const fetchSpy = jest
      .spyOn(__INNER_FETCHER, 'fetch')
      .mockImplementation(() => Promise.resolve({ ok: true }));

    getTenant.mockReturnValue({ id: tenantId, suborg: { id: tenantSuborgId } });

    addRequestMiddleware(tenantIdRequestMiddleware);
    await fetch(url, { headers: {} });

    expect(fetchSpy).toHaveBeenCalled();

    const [[fetchUrl, fetchConfig]] = fetchSpy.mock.calls;
    expect(fetchUrl).toBe(url);
    expect(fetchConfig).toEqual({
      headers: { 'X-tenant-id': tenantId, 'X-tenant-suborg-id': tenantSuborgId },
    });

    fetchSpy.mockRestore();
  });

  it('should add X-tenant-id header to the config when there are no headers', async () => {
    const tenantId = 'example-tenant-id';
    const tenantSuborgId = 'example-tenant-suborg-id';
    const url = `https://example.com/api/endpoint`;

    const fetchSpy = jest
      .spyOn(__INNER_FETCHER, 'fetch')
      .mockImplementation(() => Promise.resolve({ ok: true }));

    getTenant.mockReturnValue({ id: tenantId, suborg: { id: tenantSuborgId } });

    addRequestMiddleware(tenantIdRequestMiddleware);
    await fetch(url);

    expect(fetchSpy).toHaveBeenCalled();

    const [[fetchUrl, fetchConfig]] = fetchSpy.mock.calls;
    expect(fetchUrl).toBe(url);
    expect(fetchConfig).toEqual({
      headers: { 'X-tenant-id': tenantId, 'X-tenant-suborg-id': tenantSuborgId },
    });

    fetchSpy.mockRestore();
  });

  it('should not add X-tenant-suborg-id header to the config when there are no tenant suborg', async () => {
    const tenantId = 'example-tenant-id';
    const url = `https://example.com/api/endpoint`;

    const fetchSpy = jest
      .spyOn(__INNER_FETCHER, 'fetch')
      .mockImplementation(() => Promise.resolve({ ok: true }));

    getTenant.mockReturnValue({ id: tenantId });

    addRequestMiddleware(tenantIdRequestMiddleware);
    await fetch(url);

    expect(fetchSpy).toHaveBeenCalled();

    const [[fetchUrl, fetchConfig]] = fetchSpy.mock.calls;
    expect(fetchUrl).toBe(url);
    expect(fetchConfig).toEqual({
      headers: { 'X-tenant-id': tenantId },
    });

    fetchSpy.mockRestore();
  });
});
