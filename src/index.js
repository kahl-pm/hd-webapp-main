import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'intersection-observer';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en-CA';
import '@formatjs/intl-numberformat/locale-data/fr-CA';
import 'smoothscroll-polyfill';

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
