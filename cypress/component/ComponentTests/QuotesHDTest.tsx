import React from 'react';
import { Route } from 'react-router-dom';
import { PM_PRODUCT_PREFIX, TENANT_FLAGS, THEMES, PM_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import QuotesHD from '../../../src/pages/QuotesHD';
import Quotes from '../../../src/pages/Quotes';
import { updateMetadata } from '../../../src/NewActions/metadata';
import { updateHouseholdPropPrimary } from '../../../src/NewActions/household';

describe('QuotesHD Page fair treatment of customers tests', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`QuotesHD Desktop Page checking that only classic and advanced plan options are shown if one of the beneficiaries are older than 65`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateHouseholdPropPrimary('birthdate', '03/02/1940'));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.CLASSIC}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ADVANCED}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ECONOMIC}]`).should('not.exist');
  });

  it(`QuotesHD Desktop Page checking that all three plan options are shown if one of the beneficiaries are older than 65 but hide economic plan is turned off`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateHouseholdPropPrimary('birthdate', '03/02/1940'));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.window().then((win) => {
      win.__policyme.FLAGS[TENANT_FLAGS.HIDE_ECONOMIC_PLAN] = false;
    });
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.CLASSIC}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ADVANCED}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ECONOMIC}]`).should('exist');
  });

  it(`QuotesHD Desktop Page checking that all three plan options are shown if none of the beneficiaries are older than 65`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.CLASSIC}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ADVANCED}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ECONOMIC}]`).should('exist');
  });

  it(`QuotesHD Desktop Page checking that correct tab is shown when using quotes params dental_care`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateMetadata('planTypeStartApp', PM_HD_PLAN_TYPES.DENTAL_CARE));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.CLASSIC}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ADVANCED}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ECONOMIC}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.DENTAL_CARE}]`).should('exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED}]`).should('not.exist');
  });

  it(`QuotesHD Desktop Page checking that correct tab is shown when using quotes params no_dental_advanced`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateMetadata('planTypeStartApp', PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.CLASSIC}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ADVANCED}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.ECONOMIC}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.DENTAL_CARE}]`).should('not.exist');
    cy.get(`[data-cy=${PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED}]`).should('exist');
  });

  it('QuotesHD Categories Tab uses shortened text on mobile', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateMetadata('planTypeStartApp', PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get('[data-cy="plan-category-covers_drug_and_dental"').contains('Drug & dental');
    cy.get('[data-cy="plan-category-plans_without_dental"').contains('No dental');
    cy.get('[data-cy="plan-category-plans_without_drug"').contains('No drug');
  });

  it('QuotesHD Categories Tab uses long text on desktop', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/life/hd/life-insurance-quotes-continued');
    store.dispatch(updateMetadata('preAppMainProduct', PM_PRODUCT_PREFIX.HD));
    store.dispatch(updateMetadata('planTypeStartApp', PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED));
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get('[data-cy="plan-category-covers_drug_and_dental"').contains('Covers drug & dental coverage');
    cy.get('[data-cy="plan-category-plans_without_dental"').contains('Plans without dental coverage');
    cy.get('[data-cy="plan-category-plans_without_drug"').contains('Plans without drug coverage');
  });
});
