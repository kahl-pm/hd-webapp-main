import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import AuraStartError from '../../../../src/pages/AuraStartError';

describe('Aura Start Error Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/life/aura-start-error';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Aura Start Error Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <AuraStartError />, { reduxStore: store,
            theme: tenant_theme },
        );

        cy.runA11yCheck();
      });
    });
  });
});
