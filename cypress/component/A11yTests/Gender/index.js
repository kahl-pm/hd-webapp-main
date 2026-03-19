import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import Gender from '../../../../src/pages/questions/Gender';
import { createTestStore } from '../../../../tests/util';

describe('Gender Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`Gender Page ${device} Page ${tenant_theme} theme a11y test`, () => {
      const { store } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/gender');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.QUESTIONS_GENDER} component={Gender} />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.QUESTIONS_GENDER],
          },
        },
      );
      cy.runA11yCheck();
    });
  });
});
