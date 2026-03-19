import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { PM_PRODUCT_PREFIX, PRESCRIPTION_DRUG_FLAG, ROUTES, USER_TYPES } from '../../../../src/utils/const';
import CoverPrescriptions from '../../../../src/pages/CoverPrescriptions';
import { createTestStore } from '../../../../tests/util';
import { makeUpdateProductSessionProp } from '../../../../src/utils/helpers';

describe('Cover Prescriptions Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/hd/cover-prescriptions';
  const ROUTERENTRY = '/hd/cover-prescriptions';

  beforeEach(() => {
    cy.intercept('POST', '/api/hd-quotes/v1/quotes', {
      statusCode: 200,
      body: { success: true },
    }).as('hdQuotes');
  });

  describe('Mobile View', () => {
    it(`Cover Prescriptions Mobile Page ${tenant_theme} theme a11y test with no subtitle`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      store.dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.NEITHER))

      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Mobile Page ${tenant_theme} theme a11y test with subtitle`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      store.dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.BOTH))

      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Mobile Page ${tenant_theme} theme a11y test with YES selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy="want_prescription_coverage-Y"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy=cover-prescription-submit]:visible')
        .click();
      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Mobile Page ${tenant_theme} theme a11y test with NO selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy="want_prescription_coverage-N"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy=cover-prescription-submit]:visible')
        .click();
      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Mobile Page ${tenant_theme} theme a11y test with nothing selected error`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('iphone-6+');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy=cover-prescription-submit]:visible')
        .click();
      cy.runA11yCheck();
    });
  });

  describe('Desktop View', () => {
    it(`Cover Prescriptions Desktop Page ${tenant_theme} theme a11y test with no subtitle`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      store.dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.NEITHER))

      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Desktop Page ${tenant_theme} theme a11y test with subtitle`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      store.dispatch(makeUpdateProductSessionProp(USER_TYPES.PRIMARY, PM_PRODUCT_PREFIX.HD)('prescription_drug_flag', PRESCRIPTION_DRUG_FLAG.BOTH))

      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Desktop Page ${tenant_theme} theme a11y test with YES selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy="want_prescription_coverage-Y"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy=cover-prescription-submit]')
        .click();
      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Desktop Page ${tenant_theme} theme a11y test with NO selected`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy="want_prescription_coverage-N"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy=cover-prescription-submit]')
        .click();
      cy.runA11yCheck();
    });

    it(`Cover Prescriptions Desktop Page ${tenant_theme} theme a11y test with nothing selected error`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.COVER_PRESCRIPTIONS} component={CoverPrescriptions} />, {
        reduxStore: store,
        theme: tenant_theme,
        routerProps: {
          initialEntries: [ROUTERENTRY],
        }
      });

      cy.get('[data-cy=cover-prescription-submit]')
        .click();
      cy.runA11yCheck();
    });
  });
});