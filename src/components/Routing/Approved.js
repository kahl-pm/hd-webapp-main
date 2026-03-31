import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useCustomPages } from '../Customisation';

import Container from '../Container';
import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import { checkIfMigratedPage } from './utils';
import LoadingComponent from '../LoadingOverlay';

const EffectiveDate = React.lazy(
  () => import('../../pages/approved/EffectiveDate'),
);

const PaymentInProgress = React.lazy(
  () => import('../../pages/approved/PaymentInProgress'),
);

const PaymentReceived = React.lazy(
  () => import('../../pages/approved/PaymentReceived'),
);

const StripePaymentForm = React.lazy(
  () => import('../../pages/approved/StripePaymentForm'),
);

const ApprovedComponent = () => {
  const currentLocation = useLocation();
  const customPages = useCustomPages({ includeSections: [ROUTE_SECTIONS.APPROVED] });

  const isNewDesignSystemMigratedPage = checkIfMigratedPage(currentLocation);

  return (<>
    <Container
      isNewDesignSystemMigratedPage={isNewDesignSystemMigratedPage}
    >
      <Suspense fallback={<LoadingComponent />}>
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
      </Suspense>
    </Container>
  </>);
};

export default ApprovedComponent;
