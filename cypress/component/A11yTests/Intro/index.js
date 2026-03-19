import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import Intro from '../../../../src/pages/questions/Intro';
import { createTestStore } from '../../../../tests/util';

describe('Intro Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Intro Page ${device} ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/intro');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.QUESTIONS_INTRO} component={Intro} />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.QUESTIONS_INTRO],
          },
        },
      );
      cy.runA11yCheck();
    });
  });
});
