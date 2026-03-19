import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import { COVERAGE_FIT_OPTIONS, COVERAGE_FIT_PLAN_CATEGORY_MAPPING } from '../../../../src/utils/const';
import { handleCoverageFitResponse } from '../../../../src/NewActions/handle';
import { updateHouseholdPropPrimary } from '../../../../src/NewActions/household';
import QuotesHD from '../../../../src/pages/QuotesHD';
import Quotes from '../../../../src/pages/Quotes';

const EXPECTED_SUICIDE_CLAUSE = {
  group: 'Suicide, regardless of the state of mind and whether a mental health disorder is present or not at the time of death, within the first two years of the Effective Date or the Effective Date of the Reinstatement of this certificate. In this case, we will refund the total premium paid since the Effective Date or the most recent Effective Date of Reinstatement but will not pay any Death Benefit.',
  default: 'Suicide in the first two years of your policy term is the only cause of death not included. In this case, payments will be limited to premiums paid.',
};

const EXPECTED_DOWNLOAD_SAMPLE = {
  group: 'Read a sample certificate for details',
  default: 'Read a sample for details',
};

describe('QuotesHD Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`QuotesHD Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`QuotesHD Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <QuotesHD />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  ['macbook-13', 'iphone-6+'].forEach(device => {
    describe(`${device} Page ${tenant_theme} Coverage Fit Response Tab Routing test`, () => {
      Object.keys(COVERAGE_FIT_OPTIONS).forEach(key => {
        const option = COVERAGE_FIT_OPTIONS[key];
        const expectedCategory = COVERAGE_FIT_PLAN_CATEGORY_MAPPING[option];

        it(`Coverage Fit Response Tab Routing test for ${option} selected`, () => {
          const { store } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/life-insurance-quotes-continued');
          store.dispatch(handleCoverageFitResponse(option));
          cy.setTenantConfigByTheme(tenant_theme);
          cy.setResolution(device);

          cy.mountFullAppWithNavBar(
            <QuotesHD />,
            {
              reduxStore: store,
              theme: tenant_theme,
            },
          );

          cy.get(`[data-cy="plan-category-${expectedCategory}"]`).should('have.attr', 'aria-selected', 'true');
          cy.runA11yCheck();
        });
      });
    });
  });
});

describe('QuotesLife Page A11y Test (Individual)', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`QuotesLifeCI Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/life/life/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get('#whatWeDontCover').click();
    cy.contains(EXPECTED_SUICIDE_CLAUSE.default);
    cy.get('#whatYouGet').click();
    cy.contains(EXPECTED_DOWNLOAD_SAMPLE.default);
    cy.runA11yCheck();
  });

  it(`QuotesLife Mobile Page ${tenant_theme} theme a11y test (Group)`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_CAA_MEMBERSHIP, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    cy.get('#whatWeDontCover').click();
    cy.contains(EXPECTED_SUICIDE_CLAUSE.group);
    cy.get('#whatYouGet').click();
    cy.contains(EXPECTED_DOWNLOAD_SAMPLE.group);
    cy.runA11yCheck();
  });

  it(`QuotesLife Page ${tenant_theme} toggle joint coverage a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="addCoverageForPartnerBtn"]').find('[name="switch"]').click();
    cy.get(`[data-cy="userDetailsHeader"]`).should('exist');

    cy.runA11yCheck();
  });

  it(`QuotesLife Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV, '/life/life/life-insurance-quotes-continued');
    const d = new Date();
    const year_when_52 = d.getFullYear() - 52;
    store.dispatch({
      type: '@@primary/household/update_household_prop',
      property: 'birthdate',
      value: `01/01/${year_when_52}`,
    });
    store.dispatch({
      type: '@@primary/household/update_household_prop',
      property: 'user_family_composition',
      value: 'Self',
    });
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    // TODO: enable this when AB test 81 is disabled
    // cy.contains('Selecting $750,000 or less may qualify you for instant approval');
    cy.runA11yCheck();
  });

  it(`QuotesLife Page Mobile ${tenant_theme} toggle joint coverage a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV_APPROVED, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="addCoverageForPartnerBtn"]').find('[name="switch"]').click();
    cy.get(`[data-cy="userDetailsHeader"]`).should('exist');

    cy.runA11yCheck();
  });

  it(`QuotesLife Page ${tenant_theme} toggle details a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_INDIV, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="details-edit-icon"]').click();

    cy.runA11yCheck();
  });
});

describe('QuotesCI Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;

  it(`QuotesCI Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });

  it(`QuotesCI Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT_APPROVED, '/life/ci/life-insurance-quotes-continued');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');
    cy.mountFullAppWithNavBar(
      <Quotes />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
  });
});
