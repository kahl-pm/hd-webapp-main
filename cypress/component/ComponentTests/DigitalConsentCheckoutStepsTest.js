import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { handleDigitalConsentCheckout } from '../../../src/NewActions/handle';
import GenericError from '../../../src/components/GenericError';
import { USER_TYPES } from '../../../src/utils/const';

describe('Digital Consent Steps', () => {
  const TestComponent = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(handleDigitalConsentCheckout(USER_TYPES.PRIMARY));
    }, []);

    return (
      <GenericError />
    );
  };

  it(`shouild not call later steps if earlier one fails`, () => {
    const theme = THEMES.CIBC;
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT);
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.intercept('POST', `**/api/global-main/v1/aura_authorization/**`, {
      statusCode: 200,
      body: {
        success: true,
      },
    });
    cy.intercept('POST', /\/api\/(global-documents|lci-documents)\/v1\/digital-consent\/validate-document-generation\//, {
      statusCode: 400,
      body: null,
    });
    cy.intercept('POST', `**/api/global-main/v1/policy/digital_consent_status/**`, {
      statusCode: 200,
      body: {
        success: 1,
      },
    }).as('digitalConsentStatus');
    cy.intercept('POST', /\/api\/(global-documents|lci-documents)\/v1\/upload-digital-consent\//, {
      statusCode: 200,
      body: {
        data: {},
      },
    }).as('uploadDigitalConsent');
    cy.intercept('POST', `**/api/global-main/v1/crm`, {
      statusCode: 200,
      body: {
        sucess: 1,
      },
    });
    cy.mount(<TestComponent />, { reduxStore: store, theme });

    cy.get('[data-cy="genericErrorModal-cancel"]').click({ timeout: 5000 });
    cy.get('@digitalConsentStatus.all', { timeout: 500 }).then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
    cy.get('@uploadDigitalConsent.all', { timeout: 500 }).then((interceptions) => {
      expect(interceptions).to.have.length(0);
    });
  });
});
