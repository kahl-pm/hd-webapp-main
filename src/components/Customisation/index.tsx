import React, { ComponentType, createContext, useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { segmentIdentify, segmentTrackEvent, hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { getComponentABTestOverride, getComponentTenantOverride, getEnabledTests, getSlotABTestOverride, getSlotTenantOverride, validateABTestConfig } from './helpers';
import { ABTestConfig, CustomisationContextData, CustomisationProviderProps, CustomisationSlotProps, Customiser, PageConfig } from './types';
import { getABTestBand } from '../../Selectors/metadata';
import { getCurrentUser } from '../../Selectors/userControl';

const isPageConfig = (value: ComponentType | PageConfig): value is PageConfig => {
  return value !== null && typeof value === 'object' && 'component' in value;
};
import { SEGMENT_EVENTS } from '../../utils/const';

const CustomisationContext = createContext<CustomisationContextData>({
  enabledTests: [],
  tenantConfig: {},
});

export const CustomisationProvider = ({
  children,
  abTestConfig,
  abTestBand,
  tenantConfig,
}: CustomisationProviderProps) => {
  useEffect(() => {
    validateABTestConfig(abTestConfig);
  }, [abTestConfig]);

  useEffect(() => {
    // validate tenant config
  }, [tenantConfig]);

  const enabledTests = useMemo(
    () => getEnabledTests(abTestConfig, abTestBand),
    [abTestConfig, abTestBand],
  );

  useEffect(() => {
    let experimentDetails = [];
    abTestConfig.forEach((test) => {
      const enabled = test.testBands.includes(abTestBand);
      if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
        experimentDetails.push({
          experiment_id: `ab_test_${test.id}`,
          variant_id: enabled ? 'b' : 'a',
        });
      } else {
        segmentTrackEvent('Experiment Viewed', {
          experiment_id: `ab_test_${test.id}`,
          experiment_name: test.name,
          variation_id: enabled ? 'b' : 'a',
          variation_name: enabled ? 'enabled' : 'disabled',
        });
      }
    });
    if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
      const abTestData: Record<string, string> = {};
      experimentDetails.forEach((test) => {
        abTestData[test.experiment_id] = test.variant_id;
      });
      segmentIdentify(undefined, abTestData);
      segmentTrackEvent(SEGMENT_EVENTS.EXPERIMENT_VIEWED, { experiment_details: experimentDetails });
    }
  }, [abTestConfig, abTestBand]);

  return (
    useMemo(() => {
      return (
        <CustomisationContext.Provider value={{ enabledTests, tenantConfig }}>
          {children}
        </CustomisationContext.Provider>
      );
      }, [enabledTests, tenantConfig, children])
  );
};

export const CustomisationSlot = ({ name, children }: CustomisationSlotProps) => {
  const { enabledTests } = useContext(CustomisationContext);
  const ABTestSlotOverride = getSlotABTestOverride(name, enabledTests);

  if (ABTestSlotOverride) {
    return <ABTestSlotOverride />;
  }

  // No tests for this slot, so return the default content
  return <>{children}</>;
};

export const TenantCustomisationSlot = ({ name, children, slotProps }: CustomisationSlotProps) => {
  const { tenantConfig } = useContext(CustomisationContext);
  // Get current tenant customisation slots
  // Make sure tenant does not have duplicate customisation slots
  const SlotOverride = getSlotTenantOverride(name, tenantConfig);

  if (SlotOverride) {
    return <SlotOverride {...slotProps} />;
  }

  // No tests for this slot, so return the default content
  return <>
    {children}
  </>;
};

interface CustomPageOptions {
  includeSections?: string[];
  excludeSections?: string[];
}
export const useCustomPages =
  ({ includeSections, excludeSections }:CustomPageOptions = {}):Array<[string, ComponentType]> => {
    const { enabledTests } = useContext(CustomisationContext);
    const state = useSelector((s: any) => s);
    const userType = useSelector(getCurrentUser);

    const pageMap = useMemo(() => {
      return enabledTests
        .map((test) => test.pages)
        .filter(Boolean)
        .reduce((acc, cur) => {
          Object.entries(cur as Record<string, ComponentType | PageConfig>).forEach(([path, value]) => {
            if (Object.prototype.hasOwnProperty.call(acc, path)) {
              throw new Error(`ABTest page collision: multiple enabled tests define page '${path}'`);
            }
            acc[path] = value;
          });
          return acc;
        }, {} as Record<string, ComponentType | PageConfig>);
    }, [enabledTests]);

    // Filter and map pages - not memoized on state to match useActiveEntryPointOverrides pattern
    return Object.entries(pageMap)
      .filter(([path, value]) => {
        // Check section filters
        if (includeSections && !includeSections.find(section => path.startsWith(section))) {
          return false;
        }
        if (excludeSections && excludeSections.find(section => path.startsWith(section))) {
          return false;
        }
        // Check isActive condition if it's a PageConfig
        if (isPageConfig(value) && typeof value.isActive === 'function') {
          return value.isActive(state, userType);
        }
        return true;
      })
      .map(([path, value]): [string, ComponentType] => {
        const component = isPageConfig(value) ? value.component : value;
        return [path, component];
      });
  };

interface RouteDefinition {
  route: string;
  Component: ComponentType;
}

/**
 * Merges custom pages from AB tests with default routes, ensuring AB test
 * overrides take precedence and default routes are filtered out when overridden.
 */
export const useMergedRoutes = (
  defaultRoutes: RouteDefinition[],
  customPageOptions: CustomPageOptions = {},
): RouteDefinition[] => {
  const customPages = useCustomPages(customPageOptions);
  return useMemo(() => {
    const customPagePaths = new Set(customPages.map(([path]) => path));
    return [
      ...customPages.map(([path, component]) => ({ route: path, Component: component })),
      ...defaultRoutes.filter(r => !customPagePaths.has(r.route)),
    ];
  }, [customPages, defaultRoutes]);
};

export const Customisable = <P, > (Component: React.ComponentType<P>): React.ComponentType<P> => {
  return (props: P) => {
    // same as libjs-layout; if I move this up, the app crashes because of invalid hook call lol
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { enabledTests, tenantConfig } = useContext(CustomisationContext);
    const Override = getComponentABTestOverride(Component, enabledTests);
    const TenantOverride = getComponentTenantOverride(Component, tenantConfig);
    if (TenantOverride && Override) {
      // Two tests want to override this component at the same time.
      // This is a configuration error that should have been caught
      // by the validation in ABTests/index.js, but if it made it here, we'll log it
      throw new Error(`Tenant Customisation and ABTest wants to override same component`);
    }
    if (Override) {
      return <Override {...props} />;
    }
    if (TenantOverride) {
      return <TenantOverride {...props} />;
    }
    // ts: any -- complicated fix, known issues with @emotion/react versions
    // https://github.com/emotion-js/emotion/issues/3245
    return <Component {...props as any} />;
  };
};

export const CustomiseOverrideComponent = <P, > (
  BaseComponent: React.ComponentType<P>,
  Override: React.ComponentType<P>,
):Customiser<P> => {
  // ts: any -- complicated fix, known issues with @emotion/react versions
  // https://github.com/emotion-js/emotion/issues/3245
  const customiser = (props: P) => <Override {...props as any} />;
  customiser.__customises = BaseComponent;
  return customiser;
};

export interface EntryPointOverride {
  from: string;
  to: string;
  isActive?: (state: any, userType: string) => boolean;
}

/**
 * Returns all entry point overrides for the current user based on their AB test band.
 * Use this when you need to handle multiple entry point redirects.
 */
export const useAllEntryPointOverrides = (
  allTests: ABTestConfig<unknown>[],
): EntryPointOverride[] => {
  const abTestBand = useSelector(getABTestBand);
  return useMemo(() => {
    const enabledTests = getEnabledTests(allTests, abTestBand);
    const overrides: EntryPointOverride[] = [];
    enabledTests.forEach((test) => {
      if (test.entryPoints) {
        Object.entries(test.entryPoints).forEach(([from, value]) => {
          if (typeof value === 'string') {
            overrides.push({ from, to: value });
          } else {
            overrides.push({ from, to: value.to, isActive: value.isActive });
          }
        });
      }
    });
    return overrides;
  }, [allTests, abTestBand]);
};

/**
 * Filters entry point overrides based on their isActive condition.
 * Returns only the entry points that should be active for the current state.
 */
export const useActiveEntryPointOverrides = (
  overrides: EntryPointOverride[],
): EntryPointOverride[] => {
  const state = useSelector((s: any) => s);
  const userType = useSelector(getCurrentUser);

  return overrides.filter(({ isActive }) => {
    if (!isActive) return true;
    return isActive(state, userType);
  });
};
