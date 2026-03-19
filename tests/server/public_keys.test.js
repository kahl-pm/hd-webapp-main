import { encodeEnvVar, server } from '@policyme/global-libjs-utils';
import { mapTenantToPublicKeys } from '../../server/public_keys';
import { PUBLIC_KEYS } from '../../src/tenant/consts';

describe('mapTenantToPublicKeys', () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      TENANT_STRIPE_PUBLIC_KEY_PM: 'STRIPE_PM',
      TENANT_STRIPE_PUBLIC_KEY_CAA: 'STRIPE_CAA',
      TENANT_STRIPE_PUBLIC_KEY_CIBC: 'STRIPE_CIBC',
      TENANT_SEGMENT_KEY_PM: 'SEGMENT_PM',
      TENANT_SEGMENT_KEY_CAA: 'SEGMENT_CAA',
      TENANT_SEGMENT_KEY_CAAAMA: 'SEGMENT_AMA',
      TENANT_SEGMENT_KEY_CAASCON: 'SEGMENT_SCON',
      TENANT_SEGMENT_KEY_CAASASK: 'SEGMENT_SASK',
      TENANT_SEGMENT_KEY_CAAQUE: 'SEGMENT_QUE',
      TENANT_SEGMENT_KEY_CIBC: 'SEGMENT_CIBC',
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it.each([
    ['localhost', 'STRIPE_PM', 'SEGMENT_PM'],
    ['policyme.com', 'STRIPE_PM', 'SEGMENT_PM'],
    ['life-health.caa.com', 'STRIPE_CAA', 'SEGMENT_CAA'],
    ['life-health.ama.ab.ca', 'STRIPE_CAA', 'SEGMENT_AMA'],
    ['life-health.sco.caaforlife.com', 'STRIPE_CAA', 'SEGMENT_SCON'],
    ['life-health.caask.ca', 'STRIPE_CAA', 'SEGMENT_SASK'],
    ['life-health.caaquebec.com', 'STRIPE_CAA', 'SEGMENT_QUE'],
    ['vie-sante.caaquebec.com', 'STRIPE_CAA', 'SEGMENT_QUE'],
    ['life-health.cibcinsurance.com', 'STRIPE_CIBC', 'SEGMENT_CIBC'],
  ])('should fetch correct keys for hostname %p', (hostname, stripe, segment) => {
    const tenant = server.getTenantInfo(hostname);
    const keys = mapTenantToPublicKeys(tenant);
    expect(keys[`${encodeEnvVar(PUBLIC_KEYS.STRIPE)}`]).toBe(stripe);
    expect(keys[`${encodeEnvVar(PUBLIC_KEYS.SEGMENT)}`]).toBe(segment);
  });
});
