import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';

describe('Single Choice Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/1';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/1';

  const AURA_QUESTION = {
    aura_response: {
      _links: {
        section: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/21f6fc2e-b5cf-43b9-a0a6-d8219327a99c/sections/0',
        },
        self: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/21f6fc2e-b5cf-43b9-a0a6-d8219327a99c/questions/1',
        },
        sessionStatus: {
          completed: false,
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/21f6fc2e-b5cf-43b9-a0a6-d8219327a99c/status',
          submitted: false,
        },
      },
      constraints: {
        canBeUnknown: false,
        choices: [
          {
            prompt: null,
            questionType: 'SINGLE_CHOICE',
            richText: '<span>Yes</span>',
            text: 'Yes',
            unknownAnswer: false,
            value: 'true',
          },
          {
            prompt: null,
            questionType: 'SINGLE_CHOICE',
            richText: '<span>No</span>',
            text: 'No',
            unknownAnswer: false,
            value: 'false',
          },
        ],
        componentType: 'RadioResp',
      },
      context: [],
      helpText: 'Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a coverage issued with a reduced benefit amount; a rating could be a substandard coverage.',
      id: 1,
      isAnswered: true,
      richHelpText: '<span>Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a coverage issued with a reduced benefit amount; a rating could be a substandard coverage.</span>',
      richText: '<span>Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)</span>',
      text: 'Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)',
      type: 'SINGLE_CHOICE',
    },
    question_id: 1,
    submitted: false,
    section_id: 0,
  };

  ['macbook-13', 'iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Single Choice Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(1, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
      });

      it(`Single Choice Aura Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        // Make aura_response the question object from your disclosure redux state question
        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(1, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route
            path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION}
            component={DisclosureIntegration}
          />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.SubmitForm();
        cy.get('[data-cy="single-choice-radio-Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)-primary-Yes"]').should('exist');
        cy.contains('Select one of the options').should('exist');
        cy.runA11yCheck();
      });
    });
  });
});
