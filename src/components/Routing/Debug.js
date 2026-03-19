import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Container from '../Container';

import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import LoadingComponent from '../LoadingOverlay';

const Index = React.lazy(
  () => import('../../pages/debug'),
);

const DebugTimeout = React.lazy(
  () => import('../../pages/debug/TimeoutPage'),
);

// other pages
const NotFound = React.lazy(
  () => import('../../pages/not-found'),
);

// Debug pages only active on non-prod environments
const DebugComponent = (props) => <Container>
  <Suspense fallback={<LoadingComponent />}>
  <Switch>
    <Route exact path={ROUTES.DEBUG_TIMEOUT} component={DebugTimeout} />
    <Route exact path={ROUTE_SECTIONS.DEBUG} component={Index} />
    <Route path="*" component={NotFound} />
  </Switch>
  </Suspense>
</Container>;

export default DebugComponent;
