import { getTenant, TENANTS_NAME_CODES_MAPPING, TenantCodeType } from '@policyme/global-libjs-utils';
import {
  findMatchingCustomisedComponent,
  getEnabledPaasConfigOverrideComponents,
  getEnabledPaasConfigOverrideSlots,
} from '../components/Customisation/helpers';
import { TenantCustomisationConfig } from '../components/Customisation/types';
import PMCustomisation from './TenantCustomOverrides/PM';
import CAACustomisation from './TenantCustomOverrides/CAA';
import CIBCCustomisation from './TenantCustomOverrides/CIBC';
import BCLCustomisation from './TenantCustomOverrides/BCL';
import BMOICustomisation from './TenantCustomOverrides/BMOI';
import { PAAS_CONFIG_OVERRIDE_COMPONENTS, PAAS_CONFIG_OVERRIDE_SLOTS } from './PaasConfigOverrides';
import { HDPlanRenderFunctions } from '../components/HDPlanBaseFields';

const injectPaasConfigOverrideSlots =
(customisationConfig: TenantCustomisationConfig): TenantCustomisationConfig => {
  // This function combines the paas override slots with the tenant custom override slots
  const enabledFlagSlots = getEnabledPaasConfigOverrideSlots(PAAS_CONFIG_OVERRIDE_SLOTS);
  // Validate that there is no slot name duplication!
  const combinedSlots = Object.entries(enabledFlagSlots)
    .reduce((result, [slotName, slotComponent]) => {
      // Check if any of the new keys already exist in the result
      const obj = { [slotName]: slotComponent };
      if (!(slotName in result)) {
        return { ...result, ...obj };
      }
      throw new Error(`Duplicate tenant customisation slot key found: ${slotName}`);
    }, customisationConfig.slots ?? {});

  const enabledFlagComponents =
    getEnabledPaasConfigOverrideComponents(PAAS_CONFIG_OVERRIDE_COMPONENTS);
  // Validate that there is no component override duplication!
  const combinedComponents = enabledFlagComponents
    .reduce((result, c) => {
      // Check if any of the new components already exist in the result
      if (!findMatchingCustomisedComponent(result, c)) {
        return [...result, c];
      }
      throw new Error(`Duplicate tenant customisation component found: ${c.displayName}`);
    }, customisationConfig.components ?? []);
  return {
    ...customisationConfig,
    slots: combinedSlots,
    components: combinedComponents,
  };
};
const TENANT_CUSTOMISATION_CONFIG:Record<TenantCodeType, TenantCustomisationConfig> = {
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: PMCustomisation,
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: CAACustomisation,
  [TENANTS_NAME_CODES_MAPPING.CIBC]: CIBCCustomisation,
  [TENANTS_NAME_CODES_MAPPING.BLUE_CROSS]: BCLCustomisation,
  [TENANTS_NAME_CODES_MAPPING.BMOI]: BMOICustomisation,
};

export const getTenantCustomisationConfig:()=>TenantCustomisationConfig = () => {
  const tenantCode = getTenant().code;
  return injectPaasConfigOverrideSlots(TENANT_CUSTOMISATION_CONFIG[tenantCode]);
};

export const HD_PLAN_TENANT_CUSTOMISATION_SLOTS:
  Record<TenantCodeType, HDPlanRenderFunctions> = {
    [TENANTS_NAME_CODES_MAPPING.BMOI]: BMOICustomisation.hdPlanCustomisations,
    [TENANTS_NAME_CODES_MAPPING.CIBC]: CIBCCustomisation.hdPlanCustomisations,
    [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: CAACustomisation.hdPlanCustomisations,
    [TENANTS_NAME_CODES_MAPPING.BLUE_CROSS]: BCLCustomisation.hdPlanCustomisations,
    [TENANTS_NAME_CODES_MAPPING.POLICYME]: PMCustomisation.hdPlanCustomisations,
  };
