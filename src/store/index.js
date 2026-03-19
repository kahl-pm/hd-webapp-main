import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { StaticRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import thunkMiddleware from 'redux-thunk';
import { flagsmithInit, rollABTestBand } from '@policyme/global-libjs-utils';
import createRootReducer from '../Reducer';
import { parseQueryParams } from './helpers';
import sentryResponseMiddleware from '../middleware/fetchWithSentryHandling';
import strToNullRequestMiddleware from '../middleware/fetchWithFromStrToNull';
import fetchWithLocalProxyMiddleware from '../middleware/fetchWithLocalProxy';
import tenantIdRequestMiddleware from '../middleware/fetchWithTenantId';
import fetchWithPathnameMiddleware from '../middleware/fetchWithPathname';
import { addRequestMiddleware, addResponseMiddleware } from '../utils/fetch';
import { updateMetadata, initABTestBand } from '../NewActions/metadata';
import { getABTestBandCookie } from '../utils/helpers';

let _history;

export function createNewStore(_initialState) { // creates an initialized react store
  if (!process.env.BROWSER) { // server rendering, use static router
    const staticRouter = new StaticRouter();
    staticRouter.props = { location: '/', context: {}, basename: process.env.GLOBAL_ROUTE };
    _history = staticRouter.render().props.history;
  } else if ((process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver') && typeof window !== 'undefined') { // support hot module reloading in dev by saving history
    _history = window.__history__ || createBrowserHistory({ basename: process.env.GLOBAL_ROUTE });
    window.__history__ = _history;
  } else { // prod - create a new history object, do not save to window for reuse
    _history = createBrowserHistory({ basename: process.env.GLOBAL_ROUTE });
  }
  const initialState = _initialState || {};
  const enhancers = [];
  const middleware = [
    thunkMiddleware,
    routerMiddleware(_history),
  ];

  if (process.env.BROWSER && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver')) {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension({
        // This lets us easily set ab test band in Redux devtools
        actionCreators: {
          setABTestBand: (band) => updateMetadata('abTestBand', band),
        },
      }));
    }
  }

  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
  );

  let _store;
  let _testStore;
  // only allowed for ondemand environments
  const isAllowJourneyTestEnvironment = (process.env.NODE_ENV !== 'production' || process.env.PM_ONDEMAND_ENV);
  if ((typeof window !== 'undefined' && isAllowJourneyTestEnvironment && window.__PRELOADED_STATE__) || (process.env.STORYBOOK_ENV !== 'storybook' && (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cypressserver'))) { // dev - use singleton store saving to window
    if (!initialState && (typeof window !== 'undefined') && window.__store__) { // reuse existing
      _store = window.__store__;
    } else { // create and save to window
      _store = createStore(
        createRootReducer(_history),
        initialState,
        composedEnhancers,
      );
      if (typeof window !== 'undefined') {
        const preloadedState = window.__PRELOADED_STATE__;
        _testStore = createStore(
          createRootReducer(_history),
          preloadedState ?? initialState,
          composedEnhancers,
        );
        window.__store__ = _testStore;
      }
    }
  } else { // prod - just create store, do not save anywhere
    _store = createStore(
      createRootReducer(_history),
      initialState,
      composedEnhancers,
    );
  }

  const store = isAllowJourneyTestEnvironment && _testStore ? _testStore : _store;

  if (process.env.BROWSER) {
    console.log('store: initialising fetch middleware');
    // initialise fetch middleware
    addRequestMiddleware(strToNullRequestMiddleware);
    addRequestMiddleware(tenantIdRequestMiddleware);
    addRequestMiddleware(fetchWithPathnameMiddleware);
    if (String(process.env.PM_ENVIRONMENT) === 'local'
    && String(process.env.PM_IS_DOCKER) !== '1') {
      addRequestMiddleware(fetchWithLocalProxyMiddleware);
    }
    addResponseMiddleware(sentryResponseMiddleware);
    // addResponseMiddleware(caseConvertedResponseMiddleware);

    const cookieBand = getABTestBandCookie();
    store.dispatch(initABTestBand(cookieBand ?? rollABTestBand()));

    parseQueryParams(store);
  }

  return store;
}

/**
 * Initialize Flagsmith before creating Redux store
 * so any checks during store creation can utilize it.
 * NOTE:
 *  - Initialization is intentionally asynchronous and not awaited
 *    to avoid blocking the store and app boot.
 *  - As a result, there will always be a possibility where
 *    flag validation occurs before the flagsmithInit completes. This
 *    is by design as feature flag management should prioritize
 *    availability over consistency.
 */
if (process.env.BROWSER) {
  flagsmithInit({});
}
const exportedStore = createNewStore();

export default exportedStore;
export const history = _history;
