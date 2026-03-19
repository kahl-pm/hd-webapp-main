import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';
import { createTestStore } from '../../../tests/util';
import { updateUserControlProp } from '../../../src/NewActions/userControl';
import { GROUP_NAMES } from '../../../src/tenant/consts';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import StartApp from '../../../src/pages/StartApp';
import { AFFILIATE_NAMES } from '../../../src/utils/const';

describe('DetailCard Component', () => {
  const tenant_theme = THEMES.policyme_original;

  describe('when isACHCSSAffiliate is true', () => {
    it('should render the group name select field on and Individual Journey', () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV, '/life/life/start-app');
      store.dispatch(updateUserControlProp('affiliateId', 'OY5pCPrEzl'));
      store.dispatch(updateUserControlProp('affiliate', {
        affiliateName: AFFILIATE_NAMES.ACHCCS,
        affiliateCategory: 'policyme_affiliate',
      }));
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <StartApp />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );

      cy.get('[data-cy="groupNameInput"]').should('exist');
      cy.get('[id="groupNameInputprimary"]').should('have.value', '');
      // Check that the group name select field can be interacted with and an option can be selected
      cy.get('[data-cy="groupNameInput"]').click();
      cy.log('clicked');
      // Assuming GROUP_NAMES is an array of group name options, select the first one if it exists
      if (GROUP_NAMES && GROUP_NAMES.length > 0) {
        cy.get(`[data-testid="select-option-${GROUP_NAMES[0]}"]`).click();
        cy.get('[id="groupNameInputprimary"]').should('have.value', GROUP_NAMES[0]);
      }
    });
    it('should render the group name select field on a Joint Journey Once', () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
      store.dispatch(updateUserControlProp('affiliateId', 'OY5pCPrEzl'));
      store.dispatch(updateUserControlProp('affiliate', {
        affiliateName: AFFILIATE_NAMES.ACHCCS,
        affiliateCategory: 'policyme_affiliate',
      }));
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <StartApp />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );

      cy.get('[data-cy="groupNameInput"]').should('exist');
      cy.get('[id="groupNameInputprimary"]').should('have.value', '');
      // Check that the group name select field can be interacted with and an option can be selected
      cy.get('[data-cy="groupNameInput"]').click();
      cy.log('clicked');
      // Assuming GROUP_NAMES is an array of group name options, select the first one if it exists
      if (GROUP_NAMES && GROUP_NAMES.length > 0) {
        cy.get(`[data-testid="select-option-${GROUP_NAMES[0]}"]`).click();
        cy.get('[id="groupNameInputprimary"]').should('have.value', GROUP_NAMES[0]);
      }
      cy.get('[id="groupNameInputsecondary"]').should('not.exist');
    });
    it('input should be required', () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
      store.dispatch(updateUserControlProp('affiliateId', 'OY5pCPrEzl'));
      store.dispatch(updateUserControlProp('affiliate', {
        affiliateName: AFFILIATE_NAMES.ACHCCS,
        affiliateCategory: 'policyme_affiliate',
      }));
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <StartApp />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.get('[id="groupNameInputprimary"]').should('have.attr', 'required');
      cy.get('[data-cy="submit"]').click();
      cy.get('[role="alert"]').should('exist');
      cy.get('[role="alert"]').eq(1).should('have.text', 'Please select an option');
    });
  });

  describe('when isACHCSSAffiliate is false', () => {
    it('should not render the group name select field on an Individual Journey', () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV, '/life/life/start-app');
      store.dispatch(updateUserControlProp('affiliateId', '1234567890'));
      store.dispatch(updateUserControlProp('affiliate', {
        affiliateName: 'dummy name',
        affiliateCategory: 'policyme_affiliate',
      }));
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <StartApp />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );

      cy.get('[data-cy="groupNameInput"]').should('not.exist');
    });
    it('should not render the group name select field on a Joint Journey', () => {
      const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
      store.dispatch(updateUserControlProp('affiliateId', '1234567890'));
      store.dispatch(updateUserControlProp('affiliate', {
        affiliateName: 'dummy name',
        affiliateCategory: 'policyme_affiliate',
      }));
      cy.setTenantConfigByTheme(tenant_theme);
      cy.setResolution('macbook-13');
      cy.mountFullAppWithNavBar(
        <StartApp />,
        {
          reduxStore: store,
          theme: tenant_theme,
        },
      );
      cy.get('[data-cy="groupNameInput"]').should('not.exist');
    });
  });
});
