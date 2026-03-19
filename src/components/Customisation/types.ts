/**
 * Types for the Customisation Framework
 */

import type { ComponentType, ReactNode } from 'react';
import type { IntlShape } from 'react-intl';
import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { HDPlanRenderFunctions } from '../HDPlanBaseFields';

export interface EntryPointConfig {
  to: string;
  isActive?: (state: any, userType: string) => boolean;
}

export interface PageConfig {
  component: ComponentType;
  isActive?: (state: any, userType: string) => boolean;
}

export type ABTestConfig<P> = {
  id: number,
  name: string,
  testBands: string[],
  slots?: Record<string, ComponentType>,
  components?: Customiser<unknown>[],
  routes?: Record<string, string | ((state:any) => string)>,
  pages?: Record<string, ComponentType | PageConfig>,
  pageOptions?: Record<string, P>,
  journeys?: JourneyOverride[],
  tenants?: string[],
  entryPoints?: Record<string, string | EntryPointConfig>,
};

export type TenantCustomisationConfig = {
  slots?: Record<string, ComponentType>,
  components?: Customiser<unknown>[],
  hdPlanCustomisations?: HDPlanRenderFunctions,
};

export interface CustomisationContextData {
  enabledTests: ABTestConfig<unknown>[];
  tenantConfig: TenantCustomisationConfig;
}

export interface CustomisationProviderProps {
  abTestConfig: ABTestConfig<unknown>[];
  abTestBand: string;
  children: ReactNode;
  tenantConfig: TenantCustomisationConfig;
}

export interface CustomisationSlotProps <T = {}>{
  name: string;
  children?: ReactNode;
  slotProps?: T;
}

export type Customiser<P> = ComponentType<P> & { __customises: ComponentType<P> };

export interface JourneyOverride extends JourneyDefinition {
  isActive: (state: any, userType:string) => boolean;
}

export type TenantFlag = typeof TENANT_FLAGS[keyof typeof TENANT_FLAGS];
export type SlotsPerPaasConfigFlag = Partial<Record<TenantFlag, Record<string, ComponentType>>>;
export type ComponentsPerPaasConfigFlag = Partial<Record<TenantFlag, Array<ComponentType>>>;

// These types are simplified versions of what is in life-webapp-main src/Journey/types.ts
// Should probably consolidate type definitions in a single module somewhere
type JourneyPath = string;
type JourneyStep = Array<JourneyPath>;
type JourneyStepLabel = (intl:IntlShape) => string;
interface JourneyStepWithLabel {
  paths: Array<JourneyPath>,
  label: JourneyStepLabel;
}
interface JourneyDefinition {
  name: string;
  steps: Array<JourneyStep | JourneyStepWithLabel>;
  showProgress?: boolean;
}
