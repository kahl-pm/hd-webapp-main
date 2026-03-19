import React from 'react';
import { Route, Switch } from 'react-router-dom';
import universal from 'react-universal-component';
import { useCustomPages } from '../Customisation';

import Container from '../Container';

import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import { getLoadingConfig } from './utils';

const Callback = universal(
  () => import(/* webpackChunkName: "docusign" */ '../../pages/docusign/Callback'),
  getLoadingConfig('docusign'),
);

// other pages
const NotFound = universal(
  () => import(/* webpackChunkName: "other" */ '../../pages/not-found'),
  getLoadingConfig('other'),
);

const DocusignComponent = () => {
  const customPages = useCustomPages({ includeSections: [ROUTE_SECTIONS.DOCUSIGN] });
  return (
    <Container>
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
        <Route exact path={ROUTES.DOCUSIGN_APPLICATION_CALLBACK} component={Callback} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Container>
  );
};

export default DocusignComponent;
