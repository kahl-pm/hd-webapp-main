import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Kids from '../../../../src/pages/questions/Kids';

describe('Kids Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Kids Page ${tenant_theme} theme a11y test for device ${device}`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/kids');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Kids />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.get('[data-cy="hasKids-true"]').click();
  
      cy.runA11yCheck();
    });
  });
});
