import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'intersection-observer';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en-CA';
import '@formatjs/intl-numberformat/locale-data/fr-CA';
import 'smoothscroll-polyfill';

// IMPORTANT: initTenant MUST be imported before './store' because the store
// initialization calls getTenant() which reads from window.__policyme.
// ES module imports are hoisted and executed in order, so this ensures
// tenant context is available before the store is created.
import './initTenant';
import store, { history } from './store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
