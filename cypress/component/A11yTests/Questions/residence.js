import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Residence from '../../../../src/pages/questions/Residence';
import { checkDomElements } from '../../../helper';

describe('Advice journey residence page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Residence question Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, 'life/questions/residence');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Residence />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      cy.get('[data-cy="residenceType-rent"]').click();
      cy.runA11yCheck();
      cy.get('[data-cy="residenceType-own"]').click();
      cy.runA11yCheck();
      cy.get('[name="home_ownership"]').click();
      cy.get('[id="home-ownership-questionnaire"]').should('exist');
      cy.get('[id="home-ownership-explanation"]').should('exist');
      cy.runA11yCheck();
    });
  });
});
