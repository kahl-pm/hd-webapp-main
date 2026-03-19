import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import Email from '../../../../src/pages/questions/Email';

describe('Email Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Email Page ${tenant_theme} theme a11y test for device ${device}`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/email');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Email />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );

      cy.runA11yCheck();
    });
  });
});
