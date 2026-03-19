/* eslint-disable max-len */
import React from 'react';
import { quotes_with_ratings_expected_data } from '../../../tests/mocks/fetch/life/j1handlers';
import { ci_quotes_with_ratings_expected_data } from '../../../tests/mocks/fetch/ci/j1Handlers';
import { createTestStore } from '../../../tests/util';
import EditCoverageModal from '../../../src/ABTests/AB_TEST_87/components/EditCoverageModal';
import { addComma, getEditCoverageModalTicks, getCITicks, getMaxEligibleCoverageTier, getCiMaxEligibleCoverageTier } from '../../../src/utils/helpers';
import { PM_PRODUCT_PREFIX } from '../../../src/utils/const';
import { TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS } from './config';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { stepTo } from '../../helper';

const lifeExpected = {
  [STATES_ENUM.JOURNEY_1_INDIV_APPROVED]: {
    initialCoverage: '$500,000',
    initialTerm: '20 years',
    initialPrimaryRate: '$20.62',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: {
    initialCoverage: '$550,000',
    initialTerm: '20 years',
    initialPrimaryRate: '$24.03',
    initialSecondaryRate: '$24.03',
  },
};

const ciExpected = {
  [STATES_ENUM.JOURNEY_1_INDIV_APPROVED]: {
    initialCoverage: '$25,000',
    initialTerm: '20 years',
    initialPrimaryRate: '$14.12',
  },
  [STATES_ENUM.JOURNEY_1_JOINT_APPROVED]: {
    initialCoverage: '$10,000',
    initialTerm: '20 years',
    initialPrimaryRate: '$11.38',
    initialSecondaryRate: '$11.38',
  },
};

describe('AB_TEST_87 EditCoverageModal - Life Insurance', () => {
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    describe(`Theme: ${theme}`, () => {
      it('renders individual life coverage modal with correct initial values', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.LIFE}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', lifeExpected[strategy].initialCoverage);
        cy.get('[data-cy="edit-modal-term"]').should('have.text', lifeExpected[strategy].initialTerm);
        cy.get('[data-cy="rate-price-primary"]').should('exist');
      });

      it('renders joint life coverage modal with primary and secondary rates', () => {
        const strategy = STATES_ENUM.JOURNEY_1_JOINT_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.LIFE}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', lifeExpected[strategy].initialCoverage);
        cy.get('[data-cy="edit-modal-term"]').should('have.text', lifeExpected[strategy].initialTerm);
        cy.get('[data-cy="rate-price-primary"]').should('exist');
        cy.get('[data-cy="rate-price-secondary"]').should('exist');
        cy.get('[data-cy="subtotal-price"]').should('exist');
        cy.get('[data-cy="couples-savings"]').should('exist');
        cy.get('[data-cy="combined-total-price"]').should('exist');
      });

      it('updates life coverage when slider changes', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store, state } = createTestStore(strategy);

        // Intercept the /quotes endpoint (not /quotes-with-ratings) since withDebits=false
        cy.intercept('GET', '**/api/life-quotes/**/quotes?**', {
          statusCode: 200,
          body: quotes_with_ratings_expected_data(strategy),
        }).as('getLifeQuotes');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.LIFE}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', lifeExpected[strategy].initialCoverage);

        const ticks = getEditCoverageModalTicks(
          getMaxEligibleCoverageTier(state.primary.lifeDecision.active_maximum_eligible_coverage),
        );

        cy.get('[data-cy="amountSlider"]')
          .then($el => stepTo($el, ticks.length - 1))
          .trigger('change', { force: true });

        cy.wait('@getLifeQuotes');

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', addComma(ticks[ticks.length - 1]));
      });

      it('updates life term when term slider changes', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        // Intercept the /quotes endpoint (not /quotes-with-ratings) since withDebits=false
        cy.intercept('GET', '**/api/life-quotes/**/quotes?**', {
          statusCode: 200,
          body: quotes_with_ratings_expected_data(strategy),
        }).as('getLifeQuotes');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.LIFE}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-term"]').should('have.text', lifeExpected[strategy].initialTerm);

        cy.get('[data-cy="rangeSlider"]')
          .then($el => stepTo($el, 0))
          .trigger('change', { force: true });

        cy.wait('@getLifeQuotes');

        cy.get('[data-cy="edit-modal-term"]').should('have.text', '10 years');
      });

      it('calls onSubmit with updated values when update button is clicked', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        const onSubmitSpy = cy.spy().as('onSubmitSpy');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.LIFE}
            isOpen
            onClose={() => {}}
            onSubmit={onSubmitSpy}
          />,
          { reduxStore: store, theme },
        );

        cy.get(`[data-cy="update-coverage-${PM_PRODUCT_PREFIX.LIFE}"]`).click();
        cy.get('@onSubmitSpy').should('have.been.called');
      });
    });
  });
});

describe('AB_TEST_87 EditCoverageModal - Critical Illness Insurance', () => {
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    describe(`Theme: ${theme}`, () => {
      it('renders individual CI coverage modal with correct initial values', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.CI}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', ciExpected[strategy].initialCoverage);
        cy.get('[data-cy="edit-modal-term"]').should('have.text', ciExpected[strategy].initialTerm);
        cy.get('[data-cy="rate-price-primary"]').should('exist');
      });

      it('renders joint CI coverage modal with primary and secondary rates', () => {
        const strategy = STATES_ENUM.JOURNEY_1_JOINT_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.CI}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', ciExpected[strategy].initialCoverage);
        cy.get('[data-cy="edit-modal-term"]').should('have.text', ciExpected[strategy].initialTerm);
        cy.get('[data-cy="rate-price-primary"]').should('exist');
        cy.get('[data-cy="rate-price-secondary"]').should('exist');
        cy.get('[data-cy="combined-total-price"]').should('exist');
      });

      it('updates CI coverage when slider changes', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store, state } = createTestStore(strategy);

        // Intercept the /quotes endpoint (not /quotes-with-ratings) since withDebits=false
        cy.intercept('GET', '**/api/ci-quotes/**/quotes?**', {
          statusCode: 200,
          body: ci_quotes_with_ratings_expected_data(strategy),
        }).as('getCiQuotes');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.CI}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', ciExpected[strategy].initialCoverage);

        const ticks = getCITicks(
          getCiMaxEligibleCoverageTier(state.primary.ciSession.max_eligible_coverage),
        );

        cy.get('[data-cy="amountSlider"]')
          .then($el => stepTo($el, ticks.length - 1))
          .trigger('change', { force: true });

        cy.wait('@getCiQuotes');

        cy.get('[data-cy="edit-modal-coverage"]').should('have.text', addComma(ticks[ticks.length - 1]));
      });

      it('updates CI term when term slider changes', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        // Intercept the /quotes endpoint (not /quotes-with-ratings) since withDebits=false
        cy.intercept('GET', '**/api/ci-quotes/**/quotes?**', {
          statusCode: 200,
          body: ci_quotes_with_ratings_expected_data(strategy),
        }).as('getCiQuotes');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.CI}
            isOpen
            onClose={() => {}}
            onSubmit={() => {}}
          />,
          { reduxStore: store, theme },
        );

        cy.get('[data-cy="edit-modal-term"]').should('have.text', ciExpected[strategy].initialTerm);

        cy.get('[data-cy="rangeSlider"]')
          .then($el => stepTo($el, 0))
          .trigger('change', { force: true });

        cy.wait('@getCiQuotes');

        cy.get('[data-cy="edit-modal-term"]').should('have.text', '10 years');
      });

      it('calls onSubmit with updated values when update button is clicked', () => {
        const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
        cy.setTenantConfigByTheme(theme);
        const { store } = createTestStore(strategy);

        const onSubmitSpy = cy.spy().as('onSubmitSpy');

        cy.mount(
          <EditCoverageModal
            productType={PM_PRODUCT_PREFIX.CI}
            isOpen
            onClose={() => {}}
            onSubmit={onSubmitSpy}
          />,
          { reduxStore: store, theme },
        );

        cy.get(`[data-cy="update-coverage-${PM_PRODUCT_PREFIX.CI}"]`).click();
        cy.get('@onSubmitSpy').should('have.been.called');
      });
    });
  });
});

describe('AB_TEST_87 EditCoverageModal - Joint Life with Discounts', () => {
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    it(`${theme} - displays couples savings discount for joint life insurance`, () => {
      const strategy = STATES_ENUM.JOURNEY_1_JOINT_APPROVED;
      cy.setTenantConfigByTheme(theme);
      const { store } = createTestStore(strategy);

      cy.mount(
        <EditCoverageModal
          productType={PM_PRODUCT_PREFIX.LIFE}
          isOpen
          onClose={() => {}}
          onSubmit={() => {}}
        />,
        { reduxStore: store, theme },
      );

      // Verify joint-specific pricing elements are displayed
      cy.get('[data-cy="rate-price-primary"]').should('exist');
      cy.get('[data-cy="rate-price-secondary"]').should('exist');
      cy.get('[data-cy="subtotal-price"]').should('exist');
      cy.get('[data-cy="couples-savings"]').should('exist');
      cy.get('[data-cy="combined-total-price"]').should('exist');
    });

    it(`${theme} - does NOT display couples savings for joint CI insurance`, () => {
      const strategy = STATES_ENUM.JOURNEY_1_JOINT_APPROVED;
      cy.setTenantConfigByTheme(theme);
      const { store } = createTestStore(strategy);

      cy.mount(
        <EditCoverageModal
          productType={PM_PRODUCT_PREFIX.CI}
          isOpen
          onClose={() => {}}
          onSubmit={() => {}}
        />,
        { reduxStore: store, theme },
      );

      // CI joint should show rates but NOT couples savings
      cy.get('[data-cy="rate-price-primary"]').should('exist');
      cy.get('[data-cy="rate-price-secondary"]').should('exist');
      cy.get('[data-cy="subtotal-price"]').should('not.exist');
      cy.get('[data-cy="couples-savings"]').should('not.exist');
      cy.get('[data-cy="combined-total-price"]').should('exist');
    });
  });
});

describe('AB_TEST_87 EditCoverageModal - Modal behavior', () => {
  const theme = TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS[0];

  it('calls onClose when modal close button is clicked', () => {
    const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
    cy.setTenantConfigByTheme(theme);
    const { store } = createTestStore(strategy);

    const onCloseSpy = cy.spy().as('onCloseSpy');

    cy.mount(
      <EditCoverageModal
        productType={PM_PRODUCT_PREFIX.LIFE}
        isOpen
        onClose={onCloseSpy}
        onSubmit={() => {}}
      />,
      { reduxStore: store, theme },
    );

    cy.get('[data-cy="CloseModalButton"]').click();
    cy.get('@onCloseSpy').should('have.been.called');
  });

  it('does not render when isOpen is false', () => {
    const strategy = STATES_ENUM.JOURNEY_1_INDIV_APPROVED;
    cy.setTenantConfigByTheme(theme);
    const { store } = createTestStore(strategy);

    cy.mount(
      <EditCoverageModal
        productType={PM_PRODUCT_PREFIX.LIFE}
        isOpen={false}
        onClose={() => {}}
        onSubmit={() => {}}
      />,
      { reduxStore: store, theme },
    );

    cy.get('[data-cy="edit-modal-coverage"]').should('not.exist');
  });
});
