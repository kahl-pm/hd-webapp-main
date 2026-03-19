import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import CellPhone from '../../../../src/pages/application/CellPhone';
import { formatPhoneNumber } from '../../../../src/utils/helpers';

describe('CellPhone Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`CellPhone Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/life/application/contact');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CellPhone />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    expect(store.getState().primary.household.phone).to.equal('0000000000');
    expect(store.getState().secondary.household.phone).to.equal('0000000000');
    cy.runA11yCheck();
  });

  it(`CellPhone Interaction Test`, () => {
    const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/application/contact');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <CellPhone />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    // handle interactions and check a11y

    cy.get('[data-cy="phoneNumber"]')
      .clear()
      .type('6471234567')
      .then(() => {
        cy.get('[data-cy="phoneNumber"]').should('have.value', formatPhoneNumber('6471234567'));
        expect(store.getState().primary.household.phone).to.equal('6471234567');
        cy.runA11yCheck();
      });

    cy.get('[data-cy="partnerPhoneNumber"]')
      .clear()
      .type('6471234567')
      .then(() => {
        cy.get('[data-cy="partnerPhoneNumber"]').should('have.value', formatPhoneNumber('6471234567'));
        expect(store.getState().secondary.household.phone).to.equal('6471234567');
        cy.runA11yCheck();
      });
  });

  it(`CellPhone Desktop Page - error message on unselected option`, () => {
    const { store } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/application/contact');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CellPhone />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get('[data-cy="phoneNumber"]')
      .clear()
      .then(() => {
        return cy.get('[data-cy="partnerPhoneNumber"]')
          .clear();
      })
      .then(() => {
        cy.get('[data-cy="submit"]:visible').click().then(() => {
          cy.get('[data-cy="phoneNumber"]').should('have.attr', 'aria-invalid', 'true');
          cy.get('[data-cy="partnerPhoneNumber"]').should('have.attr', 'aria-invalid', 'true');
        });
      });

    cy.runA11yCheck();
  });
});
