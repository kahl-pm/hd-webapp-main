import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import KidsHousing from '../../../../src/pages/questions/KidsHousing';
import { checkDomElements } from '../../../helper';

describe('Advice journey kids housing page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Kids housing question Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, 'life/questions/kids-housing');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <KidsHousing />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.runA11yCheck();
      checkDomElements([
        { dataCy: 'kids-housing-question', shouldExist: true },
        { dataCy: 'childHousing-false', shouldExist: true },
        { dataCy: 'childHousing-true', shouldExist: true },
        { dataCy: 'kids-housing-submit', shouldExist: true },
      ]);
      cy.get('[name="kids_housing"]').click();
      cy.get('[id="questionnaire"]').should('exist');
      cy.get('[id="explanation"]').should('exist');
      cy.runA11yCheck();
    });
  });
});
