import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import PrescriptionDrugs from '../../../../src/pages/PrescriptionDrugs';

describe('PrescriptionDrugs Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`PrescriptionDrugs Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/prescription-drugs');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <PrescriptionDrugs />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`Passes a11y test for ${tenant_theme} when yes button is interacted with`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/prescription-drugs');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <PrescriptionDrugs />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy=prescriptionDrugs-Y]').click();
    cy.runA11yCheck();
  });

  it(`PrescriptionDrugs Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/hd/prescription-drugs');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <PrescriptionDrugs />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });
});
