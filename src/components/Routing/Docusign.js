import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useCustomPages } from '../Customisation';

import Container from '../Container';

import { ROUTES, ROUTE_SECTIONS } from '../../utils/const';
import LoadingComponent from '../LoadingOverlay';

const Callback = React.lazy(
  () => import('../../pages/docusign/Callback'),
);

// other pages
const NotFound = React.lazy(
  () => import('../../pages/not-found'),
);

const DocusignComponent = () => {
  const customPages = useCustomPages({ includeSections: [ROUTE_SECTIONS.DOCUSIGN] });
  return (
    <Container>
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
        <Route exact path={ROUTES.DOCUSIGN_APPLICATION_CALLBACK} component={Callback} />
        <Route path="*" component={NotFound} />
      </Switch>
      </Suspense>
    </Container>
  );
};

export default DocusignComponent;
