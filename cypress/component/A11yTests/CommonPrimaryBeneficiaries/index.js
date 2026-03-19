import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import CommonPrimaryBeneficiaries from '../../../../src/pages/application/CommonPrimaryBeneficiaries';

describe('CommonPrimaryBeneficiaries Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`CommonPrimaryBeneficiaries Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/life/application/common-primary-beneficiaries');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CommonPrimaryBeneficiaries />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    expect(store.getState().primary.beneficiary.standard_beneficiary_flag).to.equal('');
    cy.runA11yCheck();
  });

  it(`CommonPrimaryBeneficiaries Interaction Test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/application/common-primary-beneficiaries');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <CommonPrimaryBeneficiaries />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    // handle interactions and check a11y
    // this is porting over the tests laid out in the jest test file
    cy.get('[data-cy="common-primary-beneficiaries-now"]').click().then(() => {
      expect(store.getState().primary.beneficiary.standard_beneficiary_flag).to.equal('');
      expect(store.getState().primary.beneficiary.beneficiaries_estate_flag).to.equal('');
      expect(store.getState().secondary.beneficiary.beneficiaries_estate_flag).to.equal('');
      expect(store.getState().secondary.beneficiary.standard_beneficiary_flag).to.equal('');
    });
    cy.runA11yCheck();
    cy.get('[data-cy="common-primary-beneficiaries-later"]').click().then(() => {
      expect(store.getState().primary.beneficiary.standard_beneficiary_flag).to.equal('');
      expect(store.getState().primary.beneficiary.beneficiaries_estate_flag).to.equal('Y');
      expect(store.getState().secondary.beneficiary.beneficiaries_estate_flag).to.equal('Y');
      expect(store.getState().secondary.beneficiary.standard_beneficiary_flag).to.equal('');
    });
    cy.get('[data-cy="common-primary-beneficiaries-now"]').click().then(() => {
      expect(store.getState().secondary.beneficiary.beneficiaries_estate_flag).to.equal('N');
    });
    cy.runA11yCheck();
  });

  it(`CommonPrimaryBeneficiaries Desktop Page - error message on unselected option`, () => {
    const { store } = createTestStore(STATES_ENUM.DEFAULT, '/application/common-primary-beneficiaries');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <CommonPrimaryBeneficiaries />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="submit-common-primary-beneficiaries"]').should('be.visible');
  });
});
