import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import EffectiveDate from '../../../../src/pages/approved/EffectiveDate';

describe('EffectiveDate Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`EffectiveDate Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI, 'life/approved/primary/effective-date');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <EffectiveDate />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.runA11yCheck();
  });

  it(`EffectiveDate Interaction Test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI, 'life/approved/primary/effective-date');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <EffectiveDate />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    // open calendar and check a11y
    cy.get('[name="calendar_input"]').click();
    cy.runA11yCheck();
  });
});
