import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import PrimaryTransition from '../../../../src/pages/application/PrimaryTransition';

describe('Primary Transition Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary-transition';

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Primary Transition Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, URL);

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <PrimaryTransition />, { reduxStore: store,
            theme: tenant_theme },
        );

        cy.runA11yCheck();
      });
    });
  });
});
