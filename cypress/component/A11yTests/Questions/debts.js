import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Residence from '../../../../src/pages/questions/Residence';
import { checkDomElements } from '../../../helper';
import Debts from '../../../../src/pages/questions/Debts';

describe('Advice journey debts page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Residence question Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, 'life/questions/debts');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Debts />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      cy.get('[data-cy="hasDebts-true"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy="hasDebts-false"]').click();
      cy.runA11yCheck();
      cy.get('[name="ask_about_debt"]').click();
      cy.get('[id="ask-about-debt-label"]').should('exist');
      cy.get('[id="ask-about-debt-explanation"]').should('exist');
      cy.runA11yCheck();
    });
  });
});
