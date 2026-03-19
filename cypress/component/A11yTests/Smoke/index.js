import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import Smoke from '../../../../src/pages/questions/Smoke';
import { createTestStore } from '../../../../tests/util';

describe('SmokePage A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`SmokePage ${device} Page ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/smoke');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.QUESTIONS_SMOKE} component={Smoke} />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.QUESTIONS_SMOKE],
          },
        },
      );
      cy.runA11yCheck();
    });
  });
});
