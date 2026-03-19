import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Income from '../../../../src/pages/questions/Income';
import { checkDomElements } from '../../../helper';

describe('Advice journey income page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Income question Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, 'life/questions/income');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Income />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      checkDomElements([
        { dataCy: 'userIncome', shouldExist: true },
        { dataCy: 'income-submit', shouldExist: true },
      ]);
      cy.get('[name="income"]').click();
      cy.get('[id="income-questionnaire"]').should('exist');
      cy.get('[id="income-explanation"]').should('exist');
      cy.runA11yCheck();
    });
  });
});
