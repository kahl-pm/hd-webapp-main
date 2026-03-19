import React from 'react';
import { PM_PRODUCT_PREFIX, TENANT_FLAGS } from '@policyme/global-libjs-utils';

import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { createTestStore } from '../../../tests/util';
import { CustomisableValidateStartAppUrl } from '../../../src/pages/StartApp';
import { updateHDAppPropertyPrimary } from '../../../src/NewActions/hdApp';
import { INSURANCE_OWNERSHIP_TYPES, PROVINCES_ABBREVIATIONS } from '../../../src/utils/const';
import { updateHouseholdPropPrimary } from '../../../src/NewActions/household';
import { TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS } from './config';
import { updateMetadata } from '../../../src/NewActions/metadata';

const PROVINCES_TO_TEST = [
  PROVINCES_ABBREVIATIONS.QC,
  PROVINCES_ABBREVIATIONS.ON,
  PROVINCES_ABBREVIATIONS.BC,
];

describe('StartApp Page Validation Test', () => {
  TENANT_THEMES_ENABLED_FOR_COMPONENT_TESTS.forEach((theme) => {
    PROVINCES_TO_TEST.forEach((province) => {
      it(`StartApp Page Group Validation ${theme} ${province} test`, () => {
        const { store, state } = createTestStore(STATES_ENUM.DEV_INIT, '/life/hd/start-app');
        cy.setTenantConfigByTheme(theme);
        cy.setResolution('iphone-6+');

        store.dispatch(updateHDAppPropertyPrimary('insurance_ownership_type', INSURANCE_OWNERSHIP_TYPES.GROUP));
        store.dispatch(updateHouseholdPropPrimary('healthcard_province', province));
        store.dispatch(updateMetadata('preAppMainProduct', 'hd'));

        const redirectStub = cy.stub().as('redirectStub');

        cy.mount(
          <CustomisableValidateStartAppUrl
            insurance_ownership_type={INSURANCE_OWNERSHIP_TYPES.GROUP}
            mainProduct={PM_PRODUCT_PREFIX.HD}
            redirectToPage={redirectStub}
            province={province}
          />,
          {
            reduxStore: store,
            theme,
          },
        );

        let isInvalidState = false;

        let enable_group_hd;
        cy.window()
          .then((win) => {
            enable_group_hd = win.__policyme.FLAGS[TENANT_FLAGS.ENABLE_GROUP_HD];
          })
          .then(() => {
            if (enable_group_hd) {
              // Group is only invalid for Quebec province if tenant has group enabled
              if (province === PROVINCES_ABBREVIATIONS.QC) {
                isInvalidState = true;
              } else {
                isInvalidState = false;
              }
            } else {
              // Group is invalid for non-quebec provinces if tenant does not have group enabled
              isInvalidState = true;
            }
            if (isInvalidState) {
              cy.get('@redirectStub').should('have.been.calledOnce');
            } else {
              cy.get('@redirectStub').should('not.have.been.calledOnce');
            }
          });
      });
    });
  });
});
