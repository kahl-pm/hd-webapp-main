/**
 * Module to test the render.js file
 */

import { server, getTenant } from '@policyme/global-libjs-utils';
import { getDataDomainId } from '../../server/render';
import * as config from '../../src/config';

const oldconfig = require('../../src/config');

const oldConfigCopy = { ...oldconfig };

describe('getDataDomainId', () => {
  it.each([
    {
      hostname: 'vie-sante.atlantic.caa.ca',
      dataDomainId: '0196a283-565b-71d9-b170-ddc35aef320d-test',
    },
    {
      hostname: 'life-health.atlantic.caa.ca',
      dataDomainId: '0196a282-cd7c-7e2a-a36c-c58530658a37-test',
    },
    {
      hostname: 'policyme.com',
      dataDomainId: '019635c5-78fe-7f0e-9188-ef2bffb46976-test',
    },
    {
      hostname: 'life-health.caaquebec.com',
      dataDomainId: '0196a284-0ef0-7f8f-924f-a326b8de0023-test',
    },
    {
      hostname: 'vie-sante.caaquebec.com',
      dataDomainId: '0196a284-f42a-714d-a943-235892790f21-test',
    },
    {
      hostname: 'bluecross.ca/hd',
      dataDomainId: '0196a40c-15b4-7060-9305-3746dde894ee-test',
    },
    {
      hostname: 'croixbleue.ca/hd',
      dataDomainId: '0196a416-b915-7b20-9d34-7210b78fadda-test',
    },
    {
      hostname: 'comptes.croixbleue.ca/login',
      dataDomainId: '0196a416-b915-7b20-9d34-7210b78fadda-test',
    },
    {
      hostname: 'accounts.bluecross.ca/login',
      dataDomainId: '0196a40c-15b4-7060-9305-3746dde894ee-test',
    },
    {
      hostname: 'comptes.vie-sante.caaquebec.com/login',
      dataDomainId: '0196a284-f42a-714d-a943-235892790f21-test',
    },
    {
      hostname: 'accounts.life-health.caaquebec.com/login',
      dataDomainId: '0196a284-0ef0-7f8f-924f-a326b8de0023-test',
    },
  ])('should return the correct data domain id for %s', ({ hostname, dataDomainId }) => {
    const tenantInfo = server.getTenantInfo(hostname);
    const id = getDataDomainId(tenantInfo, { hostname });
    expect(id).toBe(dataDomainId);
  });
});

// Check data domain id for prod environment
describe('getDataDomainId', () => {
  beforeEach(() => {
    config.PM_ENVIRONMENT = 'prod';
  });
  afterEach(() => {
    config.PM_ENVIRONMENT = oldConfigCopy.PM_ENVIRONMENT;
  });
  it.each([
    {
      hostname: 'vie-sante.atlantic.caa.ca',
      dataDomainId: '0196a283-565b-71d9-b170-ddc35aef320d',
    },
    {
      hostname: 'life-health.atlantic.caa.ca',
      dataDomainId: '0196a282-cd7c-7e2a-a36c-c58530658a37',
    },
    {
      hostname: 'policyme.com',
      dataDomainId: '019635c5-78fe-7f0e-9188-ef2bffb46976',
    },
    {
      hostname: 'life-health.caaquebec.com',
      dataDomainId: '0196a284-0ef0-7f8f-924f-a326b8de0023',
    },
    {
      hostname: 'vie-sante.caaquebec.com',
      dataDomainId: '0196a284-f42a-714d-a943-235892790f21',
    },
    {
      hostname: 'bluecross.ca/hd',
      dataDomainId: '0196a40c-15b4-7060-9305-3746dde894ee',
    },
    {
      hostname: 'croixbleue.ca/hd',
      dataDomainId: '0196a416-b915-7b20-9d34-7210b78fadda',
    },
    {
      hostname: 'comptes.croixbleue.ca/login',
      dataDomainId: '0196a416-b915-7b20-9d34-7210b78fadda',
    },
    {
      hostname: 'accounts.bluecross.ca/login',
      dataDomainId: '0196a40c-15b4-7060-9305-3746dde894ee',
    },
    {
      hostname: 'comptes.vie-sante.caaquebec.com/login',
      dataDomainId: '0196a284-f42a-714d-a943-235892790f21',
    },
    {
      hostname: 'accounts.life-health.caaquebec.com/login',
      dataDomainId: '0196a284-0ef0-7f8f-924f-a326b8de0023',
    },
  ])('should return the correct data domain id for %s', ({ hostname, dataDomainId }) => {
    const tenantInfo = server.getTenantInfo(hostname);
    const id = getDataDomainId(tenantInfo, { hostname });
    expect(id).toBe(dataDomainId);
  });
});
