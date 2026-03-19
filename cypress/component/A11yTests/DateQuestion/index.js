import React from 'react';
import { Route } from 'react-router-dom';
import { THEMES } from '@policyme/global-libjs-utils';
import moment from 'moment';

import { STATES_ENUM } from '../../../../tests/ReduxStateMother/const';
import { ROUTES, USER_TYPES } from '../../../../src/utils/const';
import { createTestStore } from '../../../../tests/util';
import DisclosureIntegration from '../../../../src/pages/DisclosureIntegration';
import { makeAddDisclosure } from '../../../../src/NewActions/disclosure';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../../../src/NewActions/household';
import { calcAge } from '../../../../src/utils/helpers';

describe('Date Aura Page A11y Test', () => {
  const tenant_theme = THEMES.policyme_original;
  const URL = '/application/primary/disclosure-integration/9';
  const INITIALROUTERENTRY = '/application/primary/disclosure-integration/9';
  const SECONDARY_URL = '/application/secondary/disclosure-integration/9';
  const SECONDARY_INITIALROUTERENTRY = '/application/secondary/disclosure-integration/9';
  const typeDelay = 30;

  const AURA_QUESTION = {
    aura_response: {
      _links: {
        parentQuestion: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/questions/7',
        },
        section: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/sections/0',
        },
        self: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/questions/9',
        },
        sessionStatus: {
          completed: false,
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/status',
          submitted: false,
        },
      },
      constraints: {
        availableDateFormats: [
          'MONTH_YEAR',
          'RELATIVE_AGE',
          'MONTHS_SINCE_OCCURRENCE',
          'EXACT_DATE',
        ],
        canBeUnknown: false,
        maxDate: '2024-10-07T00:00:00Z',
        minDate: '1994-04-02T00:00:00Z',
        selectedDatePeriod: 'PAST_DATES',
      },
      context: [],
      helpText: '',
      id: 9,
      isAnswered: false,
      parentChoiceVal: 'false',
      parentQuestionId: 7,
      richHelpText: '',
      richText: '<span>When did you withdraw your application?</span>',
      text: 'When did you withdraw your application?',
      type: 'DATE',
    },
    question_id: 9,
    submitted: false,
    section_id: 1,
  };

  const AURA_QUESTION_2 = {
    aura_response: {
      _links: {
        parentQuestion: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/questions/7',
        },
        section: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/sections/0',
        },
        self: {
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/questions/9',
        },
        sessionStatus: {
          completed: false,
          href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/6c7aa0aa-8667-4d09-ad85-5b23df7888f8/status',
          submitted: false,
        },
      },
      constraints: {
        availableDateFormats: [
          'MONTHS_SINCE_OCCURRENCE',
          'EXACT_DATE',
        ],
        canBeUnknown: false,
        maxDate: '2024-10-07T00:00:00Z',
        minDate: '1994-04-02T00:00:00Z',
        selectedDatePeriod: 'PAST_DATES',
      },
      context: [],
      helpText: '',
      id: 9,
      isAnswered: false,
      parentChoiceVal: 'false',
      parentQuestionId: 7,
      richHelpText: '',
      richText: '<span>When did you withdraw your application?</span>',
      text: 'When did you withdraw your application?',
      type: 'DATE',
    },
    question_id: 9,
    submitted: false,
    section_id: 1,
  };

  ['macbook-13'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Date Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test with required error`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.SubmitForm();
        cy.contains('Enter a date').should('exist');
        cy.runA11yCheck();
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test with on Relative Age`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.get('[data-cy="available-date-When did you withdraw your application?-primary"]').click();

        cy.contains('Your Age At Time Of Event').click();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-primary"]';
        cy.get(inputDataCy).type('5000');
        cy.get(inputDataCy).should('have.value', '5000');
        cy.SubmitForm();
        cy.contains('Age should be equal to or less than ').should('exist');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '0');
        cy.get(inputDataCy).type('26');
        cy.get(inputDataCy).should('have.value', '26');
        cy.runA11yCheck();
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test Month Year input test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-primary"]';
        cy.get(inputDataCy).type('08/2004', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '08/2004');
        cy.runA11yCheck();
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('082004', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '08/2004');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('08', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '08/____');
        cy.SubmitForm();
        cy.contains('Invalid month/year').should('exist');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('121900', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '12/1900');
        cy.SubmitForm();
        cy.contains('Must be equal to or more than 04/1994').should('exist');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('122050', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '12/2050');
        cy.SubmitForm();
        cy.contains('Must be equal to or less than').should('exist');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test with on Months from Event`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropPrimary('birthdate', '02/03/1987'));

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION_2));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
        const currentTime = moment('2024-11-15').valueOf();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-primary"]';

        cy.clock(currentTime).then(() => {
          cy.get(inputDataCy).type('453');
          cy.get(inputDataCy).should('have.value', '453');
          cy.SubmitForm();
          cy.contains('Must be equal to or less than 452').should('exist');
        });
        cy.clock().invoke('restore');

        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '0');
        cy.get(inputDataCy).type('26');
        cy.get(inputDataCy).should('have.value', '26');
        cy.runA11yCheck();
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test with on Months from Event Parsing`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);
        store.dispatch(updateHouseholdPropPrimary('birthdate', '03/02/1991'));

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION_2));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
        const currentTime = moment('2024-11-19').valueOf();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-primary"]';

        cy.clock(currentTime).then(() => {
          cy.get(inputDataCy).type('406');
          cy.get(inputDataCy).should('have.value', '406');
          cy.SubmitForm();
          cy.contains('Must be equal to or less than 405').should('exist');
        });
        cy.clock().invoke('restore');
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test with on Exact Date`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION_2));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
        cy.get('[data-cy="available-date-When did you withdraw your application?-primary"]').click();
        cy.contains('Exact Date of Event').click();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-primary"]';
        const currentDayPlusOne = moment().add({ day: 1 }).format('DD/MM/YYYY');
        cy.get(inputDataCy).type(currentDayPlusOne, { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', currentDayPlusOne);
        cy.SubmitForm();
        cy.contains('Must be equal to or less than ');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('01/04/1994', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '01/04/1994');
        cy.SubmitForm();
        cy.contains('Must be equal to or more than 02/04/1994');
        cy.ClearInputByBackspaces(inputDataCy);
        cy.get(inputDataCy).should('have.value', '');
        cy.get(inputDataCy).type('02041994', { delay: typeDelay });
        cy.get(inputDataCy).should('have.value', '02/04/1994');
        cy.runA11yCheck();
      });

      it(`Date Aura Page ${tenant_theme} theme a11y test secondary birthdate restriction`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, SECONDARY_URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.SECONDARY)(9, AURA_QUESTION));

        store.dispatch(updateHouseholdPropSecondary('birthdate', '01/01/1997'));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [SECONDARY_INITIALROUTERENTRY],
              path: SECONDARY_INITIALROUTERENTRY,
            } },
        );
        const expectedMax = calcAge('01/01/1997');
        cy.get('[data-cy="available-date-When did you withdraw your application?-secondary"]').click();
        cy.contains('Your Age At Time Of Event').click();
        const inputDataCy = '[data-cy="dateQuestion-input-When did you withdraw your application?-secondary"]';
        cy.get(inputDataCy).type(`${expectedMax + 1}`);
        cy.get(inputDataCy).should('have.value', `${expectedMax + 1}`);
        cy.SubmitForm();
        cy.contains(`Age should be equal to or less than ${expectedMax}`).should('exist');
      });
    });
  });

  ['iphone-6+'].forEach((device) => {
    describe(`${device} View`, () => {
      it(`Date Aura Page ${tenant_theme} theme a11y test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, URL);

        store.dispatch(makeAddDisclosure(USER_TYPES.PRIMARY)(9, AURA_QUESTION));

        cy.setTenantConfigByTheme(tenant_theme);
        cy.setResolution(device);

        cy.mountFullAppWithNavBar(
          <Route path={ROUTES.APPLICATION_DISCLOSURE_INTEGRATION} component={DisclosureIntegration} />, { reduxStore: store,
            theme: tenant_theme,
            routerProps: {
              initialEntries: [INITIALROUTERENTRY],
              path: INITIALROUTERENTRY,
            } },
        );

        cy.runA11yCheck();
      });
    });
  });
});
