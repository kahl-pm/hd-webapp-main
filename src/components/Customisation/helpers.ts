import React from 'react';
import { hasFlag, TENANT_FLAGS, getTenant } from '@policyme/global-libjs-utils';
import type { ABTestConfig, Customiser, JourneyOverride, TenantCustomisationConfig, SlotsPerPaasConfigFlag, ComponentsPerPaasConfigFlag } from './types';

export const getEnabledTests = (
  allTests: ABTestConfig<unknown>[],
  testBand: string,
  currentTenant?: string,
): ABTestConfig<unknown>[] => {
  if (hasFlag(TENANT_FLAGS.DISABLE_ABTESTS)) {
    return [];
  }

  const tenant = currentTenant || getTenant().code;

  return allTests.filter((t) => {
    // Check if test band is included
    if (!t.testBands.includes(testBand)) {
      return false;
    }

    // Check tenant filtering - if tenants property exists, current tenant must be in the list
    // If tenants property doesn't exist, assume it's enabled for all tenants
    // (backwards compatibility)
    if (t.tenants && t.tenants.length > 0) {
      return t.tenants.includes(tenant);
    }

    // No tenants property specified, enable for all tenants
    return true;
  });
};

export const getABTestTrackingData =
  (allTests:ABTestConfig<unknown>[], testBand:string) => Object.fromEntries(
    allTests.map(test => [
      `ab_test_${test.id}`,
      test.testBands.includes(testBand) ? 'b' : 'a',
    ]),
  );

export const findMatchingCustomisedComponent = (
  components:Customiser<unknown>[],
  customisedComponent:React.ComponentType,
):Customiser<unknown> => {
  return components?.find(c => c.__customises === customisedComponent) as Customiser<unknown>;
};

export const getComponentABTestOverride = <P> (
  component: React.ComponentType<P>,
  enabledTests:ABTestConfig<unknown>[],
): React.ComponentType => {
  const customs =
    enabledTests.map<[ABTestConfig<unknown>, Customiser<P>]>(t => [
      t,
      findMatchingCustomisedComponent(t.components, component) as Customiser<P>,
    ]).filter(([, c]) => c);

  if (customs.length === 1) {
    return customs[0][1];
  }

  if (customs.length > 1) {
    // Two tests want to override this component at the same time.
    // This is a configuration error that should have been caught
    // by the validation in ABTests/index.js, but if it made it here, we'll log it
    throw new Error(`Multiple AB tests want to override component ${component.name} [${customs.map(t => t[0].name).join(', ')}]`);
  }

  return null;
};

export const getSlotABTestOverride = (
  slotName:string,
  enabledTests:ABTestConfig<unknown>[],
): React.ComponentType => {
  const slotTests = enabledTests
    .filter(({ slots }) => {
      return slots && slots[slotName];
    });

  if (slotTests.length === 1) {
    return slotTests[0].slots[slotName];
  }

  if (slotTests.length > 1) {
    // Two tests want to override this slot at the same time.
    // This is a configuration error that should have been caught
    // by the validation in ABTests/index.js, but if it made it here, we'll log it
    throw new Error(`Multiple AB tests want to override slot ${slotName} [${slotTests.map(t => t.name).join(', ')}]`);
  }

  return null;
};

export const getRouteABTestOverride = (
  route:string,
  state:any,
  allTests:ABTestConfig<unknown>[],
  testBand:string,
):string => {
  const enabledTests = getEnabledTests(allTests, testBand);
  const routeTests = enabledTests
    .filter(({ routes }) => routes && routes[route]);
  if (routeTests.length === 1) {
    const override = routeTests[0].routes[route];
    return typeof override === 'function' ? override(state) : override;
  }

  if (routeTests.length > 1) {
    // Two tests want to override this route at the same time.
    // This is a configuration error that should have been caught
    // by the validation in ABTests/index.js, but if it made it here, we'll log it
    throw new Error(`Multiple AB tests want to override route from ${route} [${routeTests.map(t => t.name).join(', ')}]`);
  }

  return null;
};

export const getPageOptionsABTestOverride = <P, >(
  route: string,
  allTests: ABTestConfig<P>[],
  abTestBand: string,
): P => {
  const enabledTests = allTests
    .filter(({ pageOptions, testBands }) => {
      return pageOptions && testBands.includes(abTestBand);
    });

  if (enabledTests.length === 1) {
    return enabledTests[0].pageOptions[route];
  }

  if (enabledTests.length > 1) {
    // Two tests want to override pageOptions consts at the same time.
    // Validate that each pageOptions object are overriding different consts
    const map = new Map();
    enabledTests.forEach((test) => {
      Object.keys(test.pageOptions ?? {})
        .flatMap(page => test.testBands.map(band => `${band}::PAGE::${page}`))
        .forEach((k) => {
          if (map.has(k)) {
            throw new Error(`PageOptions const collision for AB tests '${map.get(k)}' and '${test.name}'`);
          }
          map.set(k, test.name);
        });
    });
    // Combine them if their keys are different
    const combinedPageOptions = enabledTests.reduce((acc, test) => {
      return { ...acc, ...test.pageOptions };
    }, {});
    return combinedPageOptions[route];
  }

  return null;
};

// Make sure we never have two tests in the same testspace that want to override the same slot/route/entryPoint
export const validateABTestConfig = (abTests:ABTestConfig<unknown>[]):void => {
  const map = new Map();
  abTests.forEach((test) => {
    Object
      .keys(test.slots ?? {})
      .flatMap(slotName => test.testBands.map(band => `${band}::SLOT::${slotName}`))
      .forEach(k => {
        if (map.has(k)) {
          throw new Error(`Slot collision for AB tests '${map.get(k)}' and '${test.name}'`);
        }
        map.set(k, test.name);
      });
    Object
      .keys(test.routes ?? {})
      .flatMap(route => test.testBands.map(band => `${band}::ROUTE::${route}`))
      .forEach(k => {
        if (map.has(k)) {
          throw new Error(`Route collision for AB tests '${map.get(k)}' and '${test.name}'`);
        }
        map.set(k, test.name);
      });
    Object
      .keys(test.entryPoints ?? {})
      .flatMap(entryPoint => test.testBands.map(band => `${band}::ENTRYPOINT::${entryPoint}`))
      .forEach(k => {
        if (map.has(k)) {
          throw new Error(`Entry point collision for AB tests '${map.get(k)}' and '${test.name}'`);
        }
        map.set(k, test.name);
      });
  });
};

export const getJourneyABTestOverride = (
  allTests:ABTestConfig<unknown>[],
  testBand:string,
):JourneyOverride[] => {
  const enabledTests:ABTestConfig<unknown>[] = getEnabledTests(allTests, testBand);
  return enabledTests.filter((test) => test.journeys).flatMap((test) => test.journeys);
};

export const getSlotTenantOverride = <P>(
  slotName:string,
  tenantConfig:TenantCustomisationConfig,
): React.ComponentType<P> | null => {
  const slotOverride = tenantConfig?.slots?.[slotName] as Customiser<P>;
  return slotOverride ?? null;
};

export const getComponentTenantOverride = <P> (
  component: React.ComponentType<P>,
  tenantConfig:TenantCustomisationConfig,
): React.ComponentType => {
  const customs =
    findMatchingCustomisedComponent(tenantConfig?.components, component) as Customiser<P>;
  return customs ?? null;
};

/**
 *
 * @param paasConfigSlots Given all the tenant slots for all tenant flags,
 * @returns return the enabled paas config slots
 */
export const getEnabledPaasConfigOverrideSlots = (paasConfigSlots: SlotsPerPaasConfigFlag):
  Record<string, React.ComponentType> => Object.entries(paasConfigSlots)
  .filter(([flag]) => hasFlag(flag))
  .reduce((result, [, obj]) => {
    const newKeys = Object.keys(obj);
    // Check if any of the new keys already exist in the result
    if (newKeys.every(key => !(key in result))) {
      return {
        ...result,
        ...obj,
      };
    }
    const duplicatedKeys = newKeys.filter(key => key in result);
    throw new Error(`Duplicate keys found: ${duplicatedKeys}`);
  }, {});

/**
 *
 * @param paasConfigComponents Given all the tenant components for all tenant flags,
 * @returns return the enabled paas config slots
 */
export const getEnabledPaasConfigOverrideComponents =
  (paasConfigComponents: ComponentsPerPaasConfigFlag):
    Customiser<unknown>[] => {
    const listOfComponents = Object.entries(paasConfigComponents)
      .filter(([flag]) => hasFlag(flag))
      .reduce((result, [, obj]) => {
        const newComponents = obj;
        // Check if any of the new components already exist in the result
        if (newComponents.every(c => !findMatchingCustomisedComponent(result, c))) {
          return [
            ...result,
            ...obj,
          ];
        }
        const duplicatedKeys = newComponents.filter(
          c => findMatchingCustomisedComponent(result, c) && c.displayName,
        );
        throw new Error(`Duplicate components found: ${duplicatedKeys}`);
      }, []);
    return listOfComponents;
  };
