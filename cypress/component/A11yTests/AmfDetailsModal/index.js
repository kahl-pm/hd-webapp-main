import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../../tests/util';
import AmfDetailsModal from '../../../../src/components/AmfDetailsModal';
import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';

describe('AmfDetailsModal A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`AmfDetailsModal Desktop ${tenant_theme} theme a11y test`, () => {
    const { store } = createTestStore(STATES_ENUM.DEFAULT);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mount(
      <AmfDetailsModal open={true} handleClose={() => {}} />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`AmfDetailsModal Mobile ${tenant_theme} theme a11y test`, () => {
    const { store } = createTestStore(STATES_ENUM.DEFAULT);
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6');

    cy.mount(
      <AmfDetailsModal open={true} handleClose={() => {}} />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });
});
