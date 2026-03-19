import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import AirmilesNumber from '../../../src/pages/health-and-dental/AirmilesNumber';

describe('AirmilesNumber Component Tests', () => {
  const tenant_theme = THEMES.BMOI;

  beforeEach(() => {
    const { store } = createTestStore(STATES_ENUM.JOURNEY_HD_QUOTES, '/health-and-dental/airmiles');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mount(
      <AirmilesNumber />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
  });

  it('should handle form submission with valid AIR MILES number', () => {
    cy.get('[data-cy="airmilesNumber-Y"]').click();
    cy.get('input[name="airmilesNumber"]').type('80060860886');
    cy.get('[data-cy="submit"]').click();
    cy.contains('Enter a valid AIR MILES collector number').should('not.exist');
  });

  it('should handle form submission without AIR MILES number', () => {
    cy.get('[data-cy="airmilesNumber-N"]').click();
    cy.get('[data-cy="submit"]').click();
    cy.contains('Enter a valid AIR MILES collector number').should('not.exist');
  });

  it('should show error message when submitting without selecting an option', () => {
    cy.get('[data-cy="submit"]').click();
    cy.contains('Select one of the options').should('be.visible');
  });
});