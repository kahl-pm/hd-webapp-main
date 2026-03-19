import React from 'react';
import { Route, Switch } from 'react-router-dom';
import universal from 'react-universal-component';

import Container from '../Container';

import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import { getLoadingConfig } from './utils';

const Index = universal(
  () => import(/* webpackChunkName: "debug" */ '../../pages/debug'),
  getLoadingConfig('debug'),
);

const DebugTimeout = universal(
  () => import(/* webpackChunkName: "debug" */ '../../pages/debug/TimeoutPage'),
  getLoadingConfig('timeoutpage'),
);

// other pages
const NotFound = universal(
  () => import(/* webpackChunkName: "other" */ '../../pages/not-found'),
  getLoadingConfig('other'),
);

// Debug pages only active on non-prod environments
const DebugComponent = (props) => <Container>
  <Switch>
    <Route exact path={ROUTES.DEBUG_TIMEOUT} component={DebugTimeout} />
    <Route exact path={ROUTE_SECTIONS.DEBUG} component={Index} />
    <Route path="*" component={NotFound} />
  </Switch>
</Container>;

export default DebugComponent;
