import React from 'react';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../../tests/util';
import StartApp from '../../../../src/pages/StartApp';
import { JOINT_ROLES } from '../../../../src/utils/const';

describe('StartApp Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const BCL_theme = THEMES.BCL;
  const BCL_DISCLOSURE_MSG = 'By clicking “Continue”, you understand that personal information will be collected in order to assess your eligibility for insurance products. The information you provide will be handled by Blue Cross Life and PolicyMe in accordance with the Privacy Policy';

  it(`StartApp Desktop Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.ClearAndType('firstName', 'Vermyx');
    cy.runA11yCheck();
    cy.ClearAndType('lastName', 'Santos');
    cy.runA11yCheck();
    cy.ClearAndType('email', 'vermyx.santos@hod.com');
    cy.runA11yCheck();

    // check if the faq title is present
    cy.get('[data-cy="start-app-faq-title"]').should('exist');

    // check if the faq items are present
    cy.get('[id="cancellationPolicy"]').should('exist');
    cy.get('[id="addRemoveFamily"]').should('exist');
    cy.get('[id="upgradePolicy"]').should('exist');
    cy.get('[id="coverageAmount"]').should('exist');
    cy.get('[id="ReasonableCustomaryLimits"]').should('exist');

    // check if the alternate headers are present
    cy.get('[data-cy="start-app-alternate-header"]').should('exist');
    cy.get('[data-cy="start-app-alternate-question"]').should('exist');
  });

  it(`Passes a11y test for ${tenant_theme} when no input is entered`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.SubmitForm();
    cy.runA11yCheck();
  });

  it(`StartApp Mobile Page ${tenant_theme} theme a11y test`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/ci/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('iphone-6+');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.runA11yCheck();
    cy.ClearAndType('firstName', 'Vermyx');
    cy.runA11yCheck();
    cy.ClearAndType('lastName', 'Santos');
    cy.runA11yCheck();
    cy.ClearAndType('email', 'vermyx.santos@hod.com');
    cy.runA11yCheck();
  });

  it(`Passes a11y test for BCL single with bcl disclosure`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    cy.setTenantConfigByTheme(BCL_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: BCL_theme,
      },
    );

    cy.get('[data-cy="bcl-disclosure"]').should('contain.text', BCL_DISCLOSURE_MSG).and('be.visible');
  });

  it(`Passes a11y test for BCL joint with bcl disclosure`, () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    cy.setTenantConfigByTheme(BCL_theme);
    cy.setResolution('macbook-13');
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: BCL_theme,
      },
    );

    cy.ClearAndType('firstName', 'Vermyx');
    cy.ClearAndType('lastName', 'Santos');
    cy.ClearAndType('email', 'vermyx.santos@hod.com');

    cy.get('[data-cy="email"]').should('have.value', 'vermyx.santos@hod.com');

    cy.get('[data-cy="bcl-disclosure"]').should('contain.text', BCL_DISCLOSURE_MSG).and('be.visible');
  });

  it('email field dynamically updates when no user input is entered - Life route logged in', () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    // Initially assert email field is empty
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    // Assert email field is not disabled because log in state is still hydrating
    cy.get('[data-cy="email"]').should('not.be.disabled');

    // Mock hydration of email
    cy.get('[data-cy="email"]').should('have.value', '').then(() => {
      // Mock logged in state
      store.dispatch({
        type: '@@primary/session/update',
        property: 'is_logged_in',
        value: true,
      });
      // Dispatch Redux action to update email in state AFTER the empty assertion passes
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'test@example.com'
      });
    });
    // Wait for the component to re-render and assert email field shows the updated value
    cy.get('[data-cy="email"]').should('have.value', 'test@example.com');
    cy.get('[data-cy="email"]').should('be.disabled');
  });

  it('email field doesnt updates when user input is entered', () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    // Initially assert email field is empty
    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="email"]').should('have.value', '');

    cy.ClearAndType('email', 'test@example.com');

    cy.get('[data-cy="email"]').should('have.value', 'test@example.com').then(() => {
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'otheremail@example.com'
      });
      // Wait for the component to re-render and assert email field shows the updated value
      cy.wait(100);
      cy.get('[data-cy="email"]').should('not.have.value', 'otheremail@example.com');
    });
  });

  // Tests for life/ci/start-app route
  it('email field dynamically updates when no user input is entered - CI route logged in', () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/ci/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    // Assert email field is not disabled because log in state is still hydrating
    cy.get('[data-cy="email"]').should('not.be.disabled');

    // Mock hydration of email
    cy.get('[data-cy="email"]').should('have.value', '').then(() => {
      // Mock logged in state
      store.dispatch({
        type: '@@primary/session/update',
        property: 'is_logged_in',
        value: true,
      });
      // Dispatch Redux action to update email in state AFTER the empty assertion passes
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'test@example.com'
      });
    });
    // Wait for the component to re-render and assert email field shows the updated value
    cy.get('[data-cy="email"]').should('have.value', 'test@example.com');
    cy.get('[data-cy="email"]').should('be.disabled');
  });

  it('email field doesnt updates when user input is entered - CI route', () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/ci/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="email"]').should('have.value', '');

    cy.ClearAndType('email', 'test@example.com');

    cy.get('[data-cy="email"]').should('have.value', 'test@example.com').then(() => {
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'otheremail@example.com'
      });
      // Wait for the component to re-render and assert email field shows the updated value
      cy.wait(100);
      cy.get('[data-cy="email"]').should('not.have.value', 'otheremail@example.com');
    });
  });

  // Tests for life/hd/start-app route
  it('email field dynamically updates when no user input is entered - HD route logged in', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );
    // Assert email field is not disabled because log in state is still hydrating
    cy.get('[data-cy="email"]').should('not.be.disabled');

    // Mock hydration of email
    cy.get('[data-cy="email"]').should('have.value', '').then(() => {
      // Mock logged in state
      store.dispatch({
        type: '@@primary/session/update',
        property: 'is_logged_in',
        value: true,
      });
      // Dispatch Redux action to update email in state AFTER the empty assertion passes
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'test@example.com'
      });
    });
    // Wait for the component to re-render and assert email field shows the updated value
    cy.get('[data-cy="email"]').should('have.value', 'test@example.com');
    cy.get('[data-cy="email"]').should('be.disabled');
  });

  it('email field doesnt updates when user input is entered - HD route', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_JOINT_HD_GI, '/life/hd/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="email"]').should('have.value', '');

    cy.ClearAndType('email', 'test@example.com');

    cy.get('[data-cy="email"]').should('have.value', 'test@example.com').then(() => {
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'otheremail@example.com'
      });
      // Wait for the component to re-render and assert email field shows the updated value
      cy.wait(100);
      cy.get('[data-cy="email"]').should('not.have.value', 'otheremail@example.com');
    });
  });

  // Tests for joint term life - life/life/start-app route with joint state
  it('email field dynamically updates when no user input is entered - Joint Term Life logged in', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });
    store.dispatch({
      type: '@@primary/life/session/update',
      property: 'joint_role',
      value: JOINT_ROLES.PRIMARY,
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    // Assert email field is not disabled because log in state is still hydrating
    cy.get('[data-cy="email"]').should('not.be.disabled');

    // Mock hydration of email
    cy.get('[data-cy="email"]').should('have.value', '').then(() => {
      // Mock logged in state
      store.dispatch({
        type: '@@primary/session/update',
        property: 'is_logged_in',
        value: true,
      });
      // Dispatch Redux action to update email in state AFTER the empty assertion passes
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'test@example.com'
      });
    });
    // Wait for the component to re-render and assert email field shows the updated value
    cy.get('[data-cy="email"]').should('have.value', 'test@example.com');
    cy.get('[data-cy="email"]').should('be.disabled');
  });

  it('email field doesnt updates when user input is entered - Joint Term Life', () => {
    const { store, state } = createTestStore(STATES_ENUM.JOURNEY_1_JOINT, '/life/life/start-app');
    cy.intercept('POST', '**/api/global-accounts/v1/users', { statusCode: 400 }).as('mockUsers400');
    store.dispatch({
      type: '@@primary/household/update_email',
      value: '',
    });
    store.dispatch({
      type: '@@primary/life/session/update',
      property: 'joint_role',
      value: JOINT_ROLES.PRIMARY,
    });

    cy.setTenantConfigByTheme(tenant_theme);
    cy.setResolution('macbook-13');

    cy.mountFullAppWithNavBar(
      <StartApp />,
      {
        reduxStore: store,
        theme: tenant_theme,
      },
    );

    cy.get('[data-cy="email"]').should('have.value', '');

    cy.ClearAndType('email', 'test@example.com');

    cy.get('[data-cy="email"]').should('have.value', 'test@example.com').then(() => {
      store.dispatch({
        type: '@@primary/household/update_email',
        value: 'otheremail@example.com'
      });
      // Wait for the component to re-render and assert email field shows the updated value
      cy.wait(100);
      cy.get('[data-cy="email"]').should('not.have.value', 'otheremail@example.com');
    });
  });
});
