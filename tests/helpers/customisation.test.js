import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import {
  CustomisationProvider,
  CustomisationSlot,
  CustomiseOverrideComponent,
  Customisable,
  useCustomPages,
  TenantCustomisationSlot,
} from '../../src/components/Customisation';
import {
  getRouteABTestOverride,
  validateABTestConfig,
  getABTestTrackingData,
  getPageOptionsABTestOverride,
  getJourneyABTestOverride,
  getEnabledPaasConfigOverrideSlots,
  getEnabledPaasConfigOverrideComponents,
} from '../../src/components/Customisation/helpers';
import { createNewStore } from '../../src/store';

// This is required to make spyOn work with external modules
// https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property
jest.mock('@policyme/global-libjs-utils', () => ({
  __esModule: true,
  ...jest.requireActual('@policyme/global-libjs-utils'),
}));

const utils = require('@policyme/global-libjs-utils');

// Create a mock store for tests that use useCustomPages
const mockStore = createNewStore({});

const TestSlotA = () => (
  <div id="test-content">
    TESTA
  </div>
);

const TestSlotB = () => (
  <div id="test-content">
    TESTB
  </div>
);

const TestComponent = ({ message }) => (
  <div>
    <div id="test-content">BASE</div>
    {message}
  </div>
);

const AnotherTestComponent = ({ message }) => (
  <div>
    <div id="test-content-2">HELLO</div>
    {message}
  </div>
);

const TestPageActive = () => (
  <div id="test-content">PAGE_ACTIVE</div>
);

const TestPageInactive = () => (
  <div id="test-content">PAGE_INACTIVE</div>
);

const JourneyA = {
  type: 'JOURNEY_A',
  steps: ['route_1', 'route_2'],
  isActive: (state, userType) => state === 'A' && userType === 'A',
};

const JourneyB = {
  type: 'JOURNEY_B',
  steps: ['route_3', 'route_4'],
  isActive: (state, userType) => state === 'B' && userType === 'B',
};

const JourneyC = {
  type: 'JOURNEY_C',
  steps: ['route_5', 'route_6'],
  isActive: (state, userType) => true,
};

const OverrideComponentA = CustomiseOverrideComponent(TestComponent, ({ message }) => (
  <div>
    <div id="test-content">TESTA</div>
    {message}
  </div>
));

const OverrideAnotherTestComponent = CustomiseOverrideComponent(AnotherTestComponent, ({ message }) => (
  <div>
    <div id="test-content-2">WORLD</div>
    {message}
  </div>
));

const TestConfigA = {
  id: 1,
  name: 'Test A',
  testBands: ['test_0'],
  slots: {
    'test-slot': TestSlotA,
  },
  components: [
    OverrideComponentA,
  ],
  routes: {
    'from-route': 'test-route-a',
  },
  pages: {
    '/test-route': TestSlotA,
  },
  pageOptions: {
    '/test-route-a': {
      isThankYouPage: true,
      isDisclosurePage: true,
    },
  },
  journeys: [
    JourneyA,
  ],
};

const TestConfigB = {
  id: 2,
  name: 'Test B',
  testBands: ['test_1'],
  slots: {
    'test-slot': TestSlotB,
  },
  routes: {
    'other-route': (s) => s,
  },
  pages: {
    '/test-route': TestSlotB,
  },
  journeys: [
    JourneyB,
  ],
};

const TestConfigC = {
  id: 3,
  name: 'Test C',
  testBands: ['test_0'],
  slots: {
    'test-slot': TestSlotB,
  },
  pageOptions: {
    '/test-route-c': {
      isThankYouPage: true,
      showAffiliateLogo: true,
    },
  },
  journeys: [
    JourneyC,
  ],
};

const TestConfigD = {
  id: 4,
  name: 'Test D',
  testBands: ['test_0'],
  routes: {
    'from-route': 'test-route-a',
  },
  pageOptions: {
    '/test-route-c': {
      isThankYouPage: true,
      isDecisionPage: true,
    },
  },
};

// Test config for page-level isActive functionality
const TestConfigPageIsActive = {
  id: 5,
  name: 'Test Page IsActive',
  testBands: ['test_3'],
  pages: {
    '/page-always-active': TestPageActive,
    '/page-with-isactive': {
      component: TestPageActive,
      isActive: (state, userType) => state?.metadata?.userIntent === 'test_intent',
    },
    '/page-inactive': {
      component: TestPageInactive,
      isActive: () => false,
    },
  },
};

describe('Customisation framework tests', () => {
  test.each([
    ['test_0', 'TESTA'],
    ['test_1', 'TESTB'],
    ['test_2', 'DEFAULT'],
    ['control', 'DEFAULT'],
  ])('Renders correct slot for testcase %s', (band, expectedContent) => {
    render(
      <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band}>
        <CustomisationSlot name="test-slot">
          <div id="test-content">DEFAULT</div>
        </CustomisationSlot>
      </CustomisationProvider>,
    );
    screen.getByText(expectedContent);
  });

  test.each([
    ['test_0', { slots: {
      'test-slot': TestSlotA,
    } }, 'TESTA'],
    ['test_1', { slots: {
      'test-slot': TestSlotB,
    } }, 'TESTB'],
    ['test_2', { slots: {
      'some-other-slot': TestSlotA,
    } }, 'DEFAULT'],
    ['control', {}, 'DEFAULT'],
  ])('Renders correct slot for tenant %s', (band, tenantConfig, expectedContent) => {
    // Tests that tenantConfig slots and abtest slots are independent since they use their own customisation slots
    render(
      <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band} tenantConfig={tenantConfig}>
        <TenantCustomisationSlot name="test-slot">
          <div id="test-content">DEFAULT</div>
        </TenantCustomisationSlot>
      </CustomisationProvider>,
    );
    screen.getByText(expectedContent);
  });

  test.each([
    [[TestConfigA, TestConfigB], true],
    [[TestConfigB, TestConfigC], true],
    [[TestConfigA, TestConfigC], false],
    [[TestConfigA, TestConfigD], false],
  ])('Fails validation if two tests collide', (config, isValid) => {
    if (isValid) {
      validateABTestConfig(config);
    } else {
      expect(() => validateABTestConfig(config)).toThrow();
    }
  });

  test.each([
    ['test_0', 'from-route', 'test-route-a'],
    ['test_0', 'other-route', null],
    ['test_1', 'from-route', null],
    ['test_1', 'other-route', 'test-route-b'],
    ['test_2', 'from-route', null],
  ])('Provides the correct route override for testcase %s and route %s', (band, route, expected) => {
    const override = getRouteABTestOverride(route, expected, [TestConfigA, TestConfigB], band);
    expect(override).toBe(expected);
  });

  test.each([
    ['control', []],
    ['test_0', [JourneyA, JourneyC]],
    ['test_1', [JourneyB]],
    ['test_2', []],
  ])('Provides the correct journey overrides for testband %s', (band, expected) => {
    const allTests = [TestConfigA, TestConfigB, TestConfigC];
    const journeys = getJourneyABTestOverride(allTests, band);
    expect(journeys).toStrictEqual(expected);
  });

  test.each([
    ['control', '/test-route', undefined, undefined, 'DEFAULT'],
    ['test_0', '/test-route', undefined, undefined, 'TESTA'],
    ['test_0', '/other-route', undefined, undefined, 'DEFAULT'],
    ['test_1', '/test-route', undefined, undefined, 'TESTB'],
    ['test_1', '/other-route', undefined, undefined, 'DEFAULT'],
    ['test_2', '/test-route', undefined, undefined, 'DEFAULT'],
    ['test_0', '/test-route', undefined, ['/test'], 'DEFAULT'],
    ['test_0', '/test-route', undefined, ['/other'], 'TESTA'],
    ['test_0', '/test-route', ['/test'], undefined, 'TESTA'],
    ['test_0', '/test-route', ['/other'], undefined, 'DEFAULT'],
  ])('Provides the correct pages for testband %s and path %s', (band, path, include, exclude, expected) => {
    const TestRouter = () => {
      const pages = useCustomPages({ includeSections: include, excludeSections: exclude });
      const [, PageComponent] = pages.find(([p]) => path === p) ?? [];
      return PageComponent ? (
        <PageComponent />
      ) : (
        <div id="test-content">DEFAULT</div>
      );
    };
    render(
      <Provider store={mockStore}>
        <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band}>
          <TestRouter />
        </CustomisationProvider>
      </Provider>,
    );
    screen.getByText(expected);
  });

  test.each([
    // Page without isActive (ComponentType) - should always be included
    [{ metadata: {} }, '/page-always-active', 'PAGE_ACTIVE'],
    // Page with isActive returning true - should be included
    [{ metadata: { userIntent: 'test_intent' } }, '/page-with-isactive', 'PAGE_ACTIVE'],
    // Page with isActive returning false - should not be included (show DEFAULT)
    [{ metadata: { userIntent: 'other_intent' } }, '/page-with-isactive', 'DEFAULT'],
    [{ metadata: {} }, '/page-with-isactive', 'DEFAULT'],
    // Page with isActive always returning false - should not be included
    [{ metadata: { userIntent: 'test_intent' } }, '/page-inactive', 'DEFAULT'],
  ])('Filters pages based on isActive condition with state %j and path %s', (preloadedState, path, expected) => {
    const testStore = createNewStore(preloadedState);
    const TestRouter = () => {
      const pages = useCustomPages({});
      const [, PageComponent] = pages.find(([p]) => path === p) ?? [];
      return PageComponent ? (
        <PageComponent />
      ) : (
        <div id="test-content">DEFAULT</div>
      );
    };
    render(
      <Provider store={testStore}>
        <CustomisationProvider abTestConfig={[TestConfigPageIsActive]} abTestBand="test_3">
          <TestRouter />
        </CustomisationProvider>
      </Provider>,
    );
    screen.getByText(expected);
  });

  test.each([
    ['control', 'BASE'],
    ['test_0', 'TESTA'],
    ['test_1', 'BASE'],
  ])('Renders correct component for testcase %s', (band, expectedContent) => {
    const CustomisableComponent = Customisable(TestComponent);
    render(
      <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band}>
        <CustomisableComponent message="test" />
      </CustomisationProvider>,
    );
    screen.getByText(expectedContent);
  });

  test.each([
    ['control', { components: [OverrideAnotherTestComponent] }, 'BASE', 'WORLD'],
    // ['test_0', {}, 'TESTA', 'HELLO'],
    // ['test_1', { components: [OverrideComponentA] }, 'TESTA', 'HELLO'],
  ])('Renders correct component for testcase and tenant combination %s', (band, tenantConfig, expectedContent1, expectedContent2) => {
    const CustomisableComponent = Customisable(TestComponent);
    const AnotherCustomisableComponent = Customisable(AnotherTestComponent);
    try {
      render(
        <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band} tenantConfig={tenantConfig}>
          <CustomisableComponent message="test" />
          <AnotherCustomisableComponent message="another-test" />
        </CustomisationProvider>,
      );
      screen.getByText(expectedContent1);
      screen.getByText(expectedContent2);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Tenant Customisable components are not yet supported - use TenantCustomisationSlot instead');
    }
  });

  test.each([
    ['test_0', { components: [OverrideComponentA] }],
  ])('Throw error when ab test and tenant tries to override same component %s', (band, tenantConfig) => {
    const CustomisableComponent = Customisable(TestComponent);
    const AnotherCustomisableComponent = Customisable(AnotherTestComponent);
    try {
      render(
        <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band} tenantConfig={tenantConfig}>
          <CustomisableComponent message="test" />
          <AnotherCustomisableComponent message="test" />
        </CustomisationProvider>,
      );
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('Tenant Customisation and ABTest wants to override same component');
    }
  });

  test.each([
    [[TestConfigA, TestConfigB], 'control', { ab_test_1: 'a', ab_test_2: 'a' }],
    [[TestConfigA, TestConfigB], 'test_0', { ab_test_1: 'b', ab_test_2: 'a' }],
    [[TestConfigA, TestConfigB], 'test_1', { ab_test_1: 'a', ab_test_2: 'b' }],
    [[TestConfigA, TestConfigB], 'test_2', { ab_test_1: 'a', ab_test_2: 'a' }],
  ])('Resolves test band into test tracking data', (tests, band, expected) => {
    const trackingData = getABTestTrackingData(tests, band);
    expect(trackingData).toEqual(expected);
  });

  test.each([
    ['control', false, false],
    ['test_0', true, false],
    ['test_1', false, true],
    ['test_2', false, false],
  ])('Tracks AB Tests to Segment', (band, aEnabled, bEnabled) => {
    const segmentSpy = jest.spyOn(utils, 'segmentTrackEvent');
    render(
      <CustomisationProvider abTestConfig={[TestConfigA, TestConfigB]} abTestBand={band} />,
    );

    expect(segmentSpy).toBeCalledWith('Experiment Viewed', {
      experiment_id: `ab_test_${TestConfigA.id}`,
      experiment_name: TestConfigA.name,
      variation_id: aEnabled ? 'b' : 'a',
      variation_name: aEnabled ? 'enabled' : 'disabled',
    });

    expect(segmentSpy).toBeCalledWith('Experiment Viewed', {
      experiment_id: `ab_test_${TestConfigB.id}`,
      experiment_name: TestConfigB.name,
      variation_id: bEnabled ? 'b' : 'a',
      variation_name: bEnabled ? 'enabled' : 'disabled',
    });
  });
});

test.each([
  [[TestConfigA, TestConfigC], true, {
    '/test-route-c': {
      isThankYouPage: true,
      showAffiliateLogo: true,
    },
    '/test-route-a': {
      isThankYouPage: true,
      isDisclosurePage: true,
    },
  }],
  [[TestConfigC, TestConfigD], false, null],
])('Provides the correct combination of pageOptions const or throw if collision', (config, isValid, expected) => {
  if (isValid) {
    const optionsA = getPageOptionsABTestOverride('/test-route-a', config, 'test_0');
    expect(optionsA).toEqual(expected['/test-route-a']);
    const optionsC = getPageOptionsABTestOverride('/test-route-c', config, 'test_0');
    expect(optionsC).toEqual(expected['/test-route-c']);
    const unspecifiedRoute = getPageOptionsABTestOverride('/unknown', config, 'test_0');
    expect(unspecifiedRoute).toBeUndefined;
  } else {
    expect(() => getPageOptionsABTestOverride('/test-route-c', config, 'test_0')).toThrow();
  }
});

test('Correctly overrides tenant slots when one flag is enabled', () => {
  jest.spyOn(utils, 'hasFlag').mockReturnValue(true);

  const tenantSlots = {
    SomeFlag: {
      'test-slota': TestSlotA,
    },
    SomeFlag2: {
      'test-slotb': TestSlotB,
    },
  };
  const enabledSlots = getEnabledPaasConfigOverrideSlots(tenantSlots);
  render(
    <CustomisationProvider
      abTestConfig={[]}
      abTestBand=""
      tenantConfig={{
        slots: enabledSlots,
      }}
    >
      <TenantCustomisationSlot name="test-slota">
        <div id="test-content">DEFAULT</div>
      </TenantCustomisationSlot>
    </CustomisationProvider>,
  );
  screen.getByText('TESTA');
});

test('Does not override slots if flag is false', () => {
  jest.spyOn(utils, 'hasFlag').mockReturnValue(false);

  const tenantSlots = {
    SomeFlag: {
      'test-slota': TestSlotA,
    },
    SomeFlag2: {
      'test-slotb': TestSlotB,
    },
  };
  const enabledSlots = getEnabledPaasConfigOverrideSlots(tenantSlots);
  render(
    <CustomisationProvider
      abTestConfig={[]}
      abTestBand=""
      tenantConfig={{
        slots: enabledSlots,
      }}
    >
      <TenantCustomisationSlot name="test-slota">
        <div id="test-content">DEFAULT</div>
      </TenantCustomisationSlot>
    </CustomisationProvider>,
  );
  screen.getByText('DEFAULT');
});

test('Detects collision and throws error', () => {
  const jestfn = jest.spyOn(utils, 'hasFlag').mockReturnValue(true);

  const tenantSlots = {
    SomeFlag: {
      'test-slot': TestSlotA,
    },
    SomeFlag2: {
      'test-slot': TestSlotB,
    },
  };
  expect(() => getEnabledPaasConfigOverrideSlots(tenantSlots)).toThrow();
});

test('Correctly overrides tenant components when one flag is enabled', () => {
  jest.spyOn(utils, 'hasFlag').mockReturnValue(true);

  const tenantComponents = {
    SomeFlag: [OverrideComponentA],
    SomeFlag2: [OverrideAnotherTestComponent],
  };
  const enabledComponents = getEnabledPaasConfigOverrideComponents(tenantComponents);
  const CustomisableComponent = Customisable(TestComponent);
  const AnotherCustomisableComponent = Customisable(AnotherTestComponent);
  render(
    <CustomisationProvider
      abTestConfig={[]}
      abTestBand=""
      tenantConfig={{
        components: enabledComponents,
      }}
    >
      <CustomisableComponent message="test" />
      <AnotherCustomisableComponent message="test" />
    </CustomisationProvider>,
  );
  screen.getByText('TESTA');
  screen.getByText('WORLD');
});

test('Does not override components if flag is false', () => {
  jest.spyOn(utils, 'hasFlag').mockReturnValue(false);

  const tenantComponents = {
    SomeFlag: [OverrideComponentA],
    SomeFlag2: [OverrideAnotherTestComponent],
  };
  const enabledComponents = getEnabledPaasConfigOverrideComponents(tenantComponents);
  const CustomisableComponent = Customisable(TestComponent);
  const AnotherCustomisableComponent = Customisable(AnotherTestComponent);
  render(
    <CustomisationProvider
      abTestConfig={[]}
      abTestBand=""
      tenantConfig={{
        components: enabledComponents,
      }}
    >
      <CustomisableComponent message="test" />
      <AnotherCustomisableComponent message="test" />
    </CustomisationProvider>,
  );
  screen.getByText('BASE');
  screen.getByText('HELLO');
});
