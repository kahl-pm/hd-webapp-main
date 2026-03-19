import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import ExistingCoverage from '../../../../src/pages/questions/ExistingCoverage';

describe('Existing coverage page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Existing Coverage Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, 'life/questions/existing-coverage');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <ExistingCoverage />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      cy.get('[data-cy="hasExistingCoverage-true"]').click();
      cy.runA11yCheck();
      cy.get('[name="existing-coverage"]').click();
      cy.get('[id="existing-coverage-questionnaire"]').should('exist');
      cy.get('[id="existing-coverage-explanation"]').should('exist');
      cy.runA11yCheck();
    });
  });
});
