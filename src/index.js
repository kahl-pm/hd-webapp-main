import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'intersection-observer';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en-CA';
import '@formatjs/intl-numberformat/locale-data/fr-CA';
import 'smoothscroll-polyfill';

import { server } from '@policyme/global-libjs-utils';
import { mapTenantToPublicKeys } from './tenant/publicKeys';
import store, { history } from './store';
import App from './App';

// Initialize tenant context client-side (was previously done by SSR)
const hostname = window.location.hostname;
const tenantInfo = server.getTenantInfo(hostname);
if (tenantInfo) {
  server.applyTenantInjection(window, hostname, tenantInfo, mapTenantToPublicKeys);
} else {
  console.error(`Unable to find tenant for hostname: ${hostname}`);
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
