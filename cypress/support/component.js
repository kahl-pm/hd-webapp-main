// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import React from 'react';
// import '@percy/cypress';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { THEMES, test, TENANTS, getTenant } from '@policyme/global-libjs-utils';
import { ThemeProvider as NewUIThemeProvider } from '@policyme/global-libjs-designsystem';
import { CustomisationProvider } from '../../src/components/Customisation';
import { muiTheme } from '../../src/styles/components/materialTheme';
import { IntlProviderWithMessages } from '../../src/components/HOC/WithInternationalization';
import PageContentWithNav from '../../src/components/PageContentWithNav';
import ScrollToTopWithRouter from '../../src/components/ScrollToTop';
import GlobalCSS from '../../src/GlobalCSS';
import GenericError from '../../src/components/GenericError';
import EmailCheckModal from '../../src/components/EmailCheckModal';
import CanonicalLink from '../../src/components/CanonicalLink';
import PageTitle from '../../src/components/PageTitle';
// import GenericError from '../../src//GenericError';
import ConfirmationModal from '../../src/components/ConfirmationModal';
import Loading from '../../src/components/Loading';
import { USER_TYPES } from '../../src/utils/const';

// Import commands.js using ES2015 syntax:
import './commands';

// Import A11y Commands
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cypress-axe';
import '../component/A11yTests/A11yCommands';

import { ACTIVE_TESTS } from '../../src/ABTests';
import { getTenantCustomisationConfig } from '../../src/tenant/customisation';

// Alternatively you can use CommonJS syntax:
// require('./commands')

const setupGlobalApiInterceptions = () => {
  // Intercept these api call before all tests globally 
  cy.intercept('POST', '**/api/global-analytics/v1/pm_ab_test/**', {
    statusCode: 200,
    body: {},
  }).as('postABTest');
  cy.intercept("POST", "**/api/global-payments/v1/user/*/customer", {
    statusCode: 200,
    body: {
      data: {
        stripe_customer_id: "cus_111111111",
      },
    },
  }).as("createCustomer");
  cy.intercept("POST", "**/api/global-payments/v1/user/*/customer/*/setup-intent", {
    statusCode: 200,
    body: {
      data: {
        setup_intent_client_secret: "seti_aaaaa_secret_bbbb",
      },
    },
  }).as("setupIntent");
  cy.intercept("POST", "**/api/global-main/v1/crm", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("pushToCrm");
  cy.intercept('POST', '**/api/life-main/v3/life_policies/*/beneficiaries', (req) => {}).as('postBeneficiaries');
  cy.intercept("POST", "**/api/life-main/v3/life_policies/**/beneficiaries", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("postBeneficiaries");
  cy.intercept("PATCH", "**/api/life-main/v3/life_policies/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("patchLifePolicies");
  cy.intercept("PATCH", "**/api/life-main/v3/life_apps/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("patchLifeApps");
  cy.intercept("PATCH", "**/api/ci-main/v1/ci_policies/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("patchCiPolicies");
  cy.intercept("PATCH", "**/api/ci-main/v1/ci_apps/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("patchCiApps");
  cy.intercept("GET", "**/api/ci-quotes/v1/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("getCiQuotes");
  cy.intercept("GET", "**/api/life-quotes/v2/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("getLifeQuotes");
  cy.intercept("POST", "https://r.stripe.com/b", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("postStripe");
  cy.intercept("PATCH", "**/api/global-main/v1/household_infos/**", {
    statusCode: 200,
    body: {
      data: {'success': 1}
    },
  }).as("patchHouseholdInfos");
  cy.intercept('POST', '/api/global-main/v1/add_to_family/*', {
    statusCode: 200,
    body: { success: true },
  }).as('postFamily');
  cy.intercept('POST', '/api/ci-main/v1/ci_sessions/**', {
    statusCode: 200,
    body: { success: true },
  }).as('postCiSessions');
};

// ensures that all component tests does not hit real apis and cause sentry issues
before(() => {
  setupGlobalApiInterceptions();
});

Cypress.Commands.add('mount', (component, options = {}) => {
  setupGlobalApiInterceptions();
  // Use the default store if one is not provided
  const {
    theme = THEMES.policyme_original,
    // reduxState = STATES_ENUM.DEFAULT,
    reduxStore,
    routerProps = { initialEntries: ['/'] },
    tenantSlots = {},
    ...mountOptions
  } = options;

  const history = createMemoryHistory();

  const tenant = getTenant();
  const font = tenant?.font?.fontBase64 || TENANTS.PM.font?.fontBase64;

  const wrapped = <Provider store={reduxStore}>
    <ConnectedRouter history={history}>
      <CustomisationProvider
        abTestConfig={ACTIVE_TESTS}
        abTestBand={'control'}
        tenantConfig={getTenantCustomisationConfig()}
      >
        <IntlProviderWithMessages
          application_language={reduxStore.getState().metadata.lang}
          messages={reduxStore.getState().metadata.messages}
        >
          <NewUIThemeProvider
            theme={theme}
            mergeThemes={[muiTheme]}
              // we only want to a11y test against the new rebrand theme
            useRebrandTheme={false}
          >
            <MemoryRouter {...routerProps}>
              <div>
                <div dangerouslySetInnerHTML={{ __html: `<style>${font || ''}</style>` }} />
                {component}
              </div>
            </MemoryRouter>
          </NewUIThemeProvider>
        </IntlProviderWithMessages>
      </CustomisationProvider>
    </ConnectedRouter>
  </Provider>;
  cy.setABTest();
  return mount(wrapped, mountOptions);
});

Cypress.Commands.add('setResolution', (size) => {
  if (Cypress._.isArray(size)) {
    cy.viewport(size[0], size[1]);
  } else {
    cy.viewport(size);
  }
});

Cypress.Commands.add('setTenantConfigByTheme', (theme) => {
  let tenant = TENANTS.PM; // default config to policyme
  if (test.getTenantFromTheme(theme)) {
    tenant = test.getTenantFromTheme(theme);
  }
  // Cypress uses 2 windows. To set window attributes where the component test is rendered in,
  // use cy.window https://docs.cypress.io/api/commands/window#Cypress-uses-2-different-windows
  cy.window().then((win) => {
    win.__policyme = {
      TENANT: {
        id: tenant.id,
        name: tenant.name,
        code: tenant.code,
        suborg: tenant.suborg,
        userLeadSources: {
          shouldRandomize: true,
          sources: [
            'ARTICLE_OR_BLOG',
            'BILLBOARD',
            'CONFERENCE',
            'EMPLOYEE_REWARDS_PLATFORM',
            'INFLUENCER',
            'ONLINE_FORUM',
            'PODCAST_OR_RADIO',
            'SEARCH_ENGINE',
            'SOCIAL_MEDIA',
            'LINKEDIN',
            'TIKTOK',
            'TV_COMMERCIAL',
            'WORD_OF_MOUTH',
            'YOUTUBE',
          ],
        },
        font: tenant.font,
        documentUrls: tenant.documentUrls,
        hdPlans: tenant.hdPlans,
        hdPlanTypes: tenant.hdPlanTypes,
      },
      THEME: tenant.suborg ? tenant.suborg.theme : tenant.theme,
      URLS: {
        homepage: 'https://www.policyme.com',
        accounts: 'https://accounts.policyme.com',
      },
      FLAGS: {
        ...tenant.flags,
      },
      PUBLICKEYS: {
        STRIPE: 'test_stripe_key',
      },
    };
  });
});

Cypress.Commands.add('mountFullAppWithNavBar', (component, options = {}) => {
  setupGlobalApiInterceptions();
  const {
    theme = THEMES.policyme_original,
    reduxStore,
    tenantSlots = {},
    routerProps = { initialEntries: ['/'] },
    ...mountOptions
  } = options;

  const history = createMemoryHistory();

  const tenant = getTenant();
  const font = tenant?.font?.fontBase64 || TENANTS.PM.font?.fontBase64;

  // add google font
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.innerHTML = font || '';
    doc.head.appendChild(style);
  });

  const wrapped = <Provider store={reduxStore}>
    <ConnectedRouter history={history}>
      <MemoryRouter {...routerProps}>
        <IntlProviderWithMessages
          application_language={reduxStore.getState().primary.household.application_language}
          messages={reduxStore.getState().metadata.messages}
        >
          <div id="root">
            <div className="App">
              <NewUIThemeProvider
                theme={theme}
                mergeThemes={[muiTheme]}
                // we only want to a11y test against the new rebrand theme
                useRebrandTheme
              >
                <CustomisationProvider
                  abTestConfig={ACTIVE_TESTS}
                  abTestBand={'control'}
                  tenantConfig={getTenantCustomisationConfig()}
                >
                  <ScrollToTopWithRouter>
                    <PageContentWithNav isRebrandDesignEnabled>
                      <main className="main">
                        {component}
                      </main>
                    </PageContentWithNav>
                    <CanonicalLink />
                    <PageTitle />
                    <GenericError />
                    <ConfirmationModal />
                    <Loading />
                  </ScrollToTopWithRouter>
                  <GlobalCSS />
                </CustomisationProvider>
              </NewUIThemeProvider>
            </div>
          </div>
        </IntlProviderWithMessages>
      </MemoryRouter>
    </ConnectedRouter>
  </Provider>;

  cy.setABTest();
  return mount(wrapped, mountOptions);
});
