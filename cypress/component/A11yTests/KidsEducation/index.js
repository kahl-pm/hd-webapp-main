import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES } from '../../../../src/utils/const';
import KidsEducation from '../../../../src/pages/questions/KidsEducation';
import { createTestStore } from '../../../../tests/util';

describe('KidsEducation Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    it(`KidsEducation Page ${device} ${tenant_theme} theme a11y test`, () => {
      const { store, state } = createTestStore(STATES_ENUM.DEFAULT, '/life/questions/kids-education');
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution(device);
      cy.mountFullAppWithNavBar(
        <Route path={ROUTES.QUESTIONS_KIDS_EDUCATION} component={KidsEducation} />, {
          reduxStore: store,
          theme: tenant_theme,
          routerProps: {
            initialEntries: [ROUTES.QUESTIONS_KIDS_EDUCATION],
          },
        },
      );
      cy.runA11yCheck();
    });
  });
});
