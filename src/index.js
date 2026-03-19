import React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import 'intersection-observer';

import _store, { history } from './store';
import createRootReducer from './Reducer';
import App from './App';

let store = _store;

if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver') && module.hot) {
  window.__store__ = store;

  // If redux changed we need to replace the reducers or a hard reload will be required
  // other files may need to be added here if there's issues with redux hot-reloading
  module.hot.accept([
    './store/index.js',
    './Reducer/index.js', // needed /Reducer/index.js because reducers were not reloaded otherwise
  ], () => {
    store.replaceReducer(require('./Reducer').default(history)); // eslint-disable-line
  });
  module.hot.accept((err) => {
    console.log(`hot module reload error ${err}`);
  });
}

const render = (A) => {
  return hydrate(
    <AppContainer>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <A />
        </ConnectedRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  );
};
render(App);
