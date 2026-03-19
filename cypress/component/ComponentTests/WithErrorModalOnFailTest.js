import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { THEMES } from '@policyme/global-libjs-utils';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { withErrorModalOnFail } from '../../../src/utils/helpers';
import GenericError from '../../../src/components/GenericError';

describe('withErrorModalOnFail should show blocker modal on fail', () => {
  const ComponentThatWillFail = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      const failAsync = async () => {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            reject('This is a test error');
          }, 500);
        });
      }

      withErrorModalOnFail(failAsync, dispatch)();
    }, []);

    return (
      <GenericError />
    );
  };

  const theme = THEMES.CIBC;
  it(`${theme} - match snapshot`, () => {
    const { store, state } = createTestStore(STATES_ENUM.DEV_INIT);
    cy.setTenantConfigByTheme(theme);
    cy.setResolution('macbook-13');
    cy.mount(<ComponentThatWillFail />, { reduxStore: store, theme });
    cy.get('[data-cy="genericErrorModal-confirm"]').should('exist');
  });
});
