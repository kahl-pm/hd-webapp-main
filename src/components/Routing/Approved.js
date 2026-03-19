import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import universal from 'react-universal-component';
import { useCustomPages } from '../Customisation';

import Container from '../Container';
import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import { getLoadingConfig, checkIfMigratedPage } from './utils';

const EffectiveDate = universal(
  () => import(/* webpackChunkName: "approved" */ '../../pages/approved/EffectiveDate'),
  getLoadingConfig('approved'),
);

const PaymentInProgress = universal(
  () => import(/* webpackChunkName: "other" */ '../../pages/approved/PaymentInProgress'),
  getLoadingConfig('other'),
);

const PaymentReceived = universal(
  () => import(/* webpackChunkName: "other" */ '../../pages/approved/PaymentReceived'),
  getLoadingConfig('other'),
);

const StripePaymentForm = universal(
  () => import(/* webpackChunkName: "approved" */ '../../pages/approved/StripePaymentForm'),
  getLoadingConfig('approved'),
);

const ApprovedComponent = () => {
  const currentLocation = useLocation();
  const customPages = useCustomPages({ includeSections: [ROUTE_SECTIONS.APPROVED] });

  const isNewDesignSystemMigratedPage = checkIfMigratedPage(currentLocation);

  return (<>
    <Container
      isNewDesignSystemMigratedPage={isNewDesignSystemMigratedPage}
    >
      <Switch>
        { /* Customisation framework pages */
          customPages.map(([path, component]) => (
            <Route
              key={path}
              path={path}
              component={component}
            />
          ))
        }
        <Route exact path={ROUTES.APPROVED_PAYMENT_FORM} component={StripePaymentForm} />
        <Route exact path={ROUTES.APPROVED_EFFECTIVE_DATE} component={EffectiveDate} />
        <Route exact path={ROUTES.PAYMENT_IN_PROGRESS} component={PaymentInProgress} />
        <Route exact path={ROUTES.PAYMENT_RECEIVED} component={PaymentReceived} />
      </Switch>
    </Container>
  </>);
};

export default ApprovedComponent;
