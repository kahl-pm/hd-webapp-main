
/**
 * THIS COPY IS LEGALLY BINDING AND EXTREMELY IMPORTANT
 * IF TESTS USING THIS COPY ARE BREAKING, SOMETHING IS PROBABLY VERY WRONG
 * DO NOT CHANGE THIS COPY WITHOUT CONSULTING LEGAL
*/
import { THEMES, TENANTS } from '@policyme/global-libjs-utils';


/**
 * NOTE:
 * This config is designed to be used by *ONLY* digital consent test cases.
 * It is designed to always fail all digital consent tests whenever a new tenant is added.
 * This is to ensure that we don't forget to setup digital consent and its tests for the new tenant.
 * 
 * If you are adding a new tenant, please add it to the tenantTestingConfig object
 * and add test for tenant according to the digital consent requirements.
 */
export const TENANT_THEMES_FOR_DIGITAL_CONSENT_TESTS = (() => {
  const tenantTestingConfig = {
    [TENANTS.CIBC.code]: { isEnabled: true, tenantThemesToTest: [THEMES.CIBC] },
    [TENANTS.BCL.code]: { isEnabled: true, tenantThemesToTest: [THEMES.BCL] },
    [TENANTS.BMOI.code]: { isEnabled: false, tenantThemesToTest: [] },
    [TENANTS.PM.code]: { isEnabled: true, tenantThemesToTest: [THEMES.policyme_original] },
    [TENANTS.CAA.code]: { isEnabled: true,
      tenantThemesToTest: [THEMES.AMA, THEMES.MAN, THEMES.QUE] },
  };

  // If the tenant is not in tenantTestingConfig, we should raise an error.
  // Every new tenant should be explicitly added to the tenantTestingConfig object to
  // ensure we don't forget to add tests for the new tenant if needed.
  Object.values(TENANTS.default).forEach((tenant_config) => {
    if (!tenantTestingConfig[tenant_config.code]) {
      throw new Error(`Tenant ${tenant_config.code} is not in tenantTestingConfig. Please add it to the tenantTestingConfig object and add test for tenant ${tenant_config.code} according to the digital consent requirements if required.`);
    }
  });

  const enabled_tenants_themes_to_test = Object.entries(tenantTestingConfig)
    .filter(([_, config]) => config.isEnabled)
    .flatMap(([_, { tenantThemesToTest }]) => tenantThemesToTest);

  return enabled_tenants_themes_to_test;
})();
