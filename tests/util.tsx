import React from 'react';
import util from 'util';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { THEMES, LOCALE } from '@policyme/global-libjs-utils';
import { ThemeProvider } from '@policyme/global-libjs-designsystem';
import { CustomisationProvider } from '../src/components/Customisation';
import { createNewStore } from '../src/store';
import ReduxStateMother from './ReduxStateMother';
import { STATES_ENUM } from './ReduxStateMother/const';
import enMessages from '../compiled-lang/en_CA.json';
import frMessages from '../compiled-lang/fr_CA.json';
import { stripTrailingSlash } from '../src/utils/helpers';
import { getTenantCustomisationConfig } from '../src/tenant/customisation';

// Set up test store with optional custom path
export function createTestStore(strategy:number, pathname?:string) {
  let stateClass = new ReduxStateMother(strategy);
  if (pathname) {
    stateClass.router.setPathname(pathname);
    stateClass.metadata.setMetadataProp('currRoute', stripTrailingSlash(pathname));
  }
  stateClass.metadata.setMetadataProp('abTestBand', 'control');
  stateClass.metadata.setMetadataProp('isCypressStripeForm', true);
  const _store = createNewStore(
    { ...stateClass.toJson() },
  );
  const state = _store.getState();
  return { store: _store, state };
}

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = createNewStore(preloadedState),
    locale = LOCALE.EN_CA as string,
    theme = THEMES.policyme_original,
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    // can add theme provider here next time
    const messages = locale === LOCALE.FR_CA ? frMessages : enMessages;
    return (
      <Provider store={store}>
        <IntlProvider locale={locale} messages={messages}>
          <ThemeProvider theme={theme} useRebrandTheme={false}>
            <CustomisationProvider
              abTestConfig={[]}
              abTestBand="control"
              tenantConfig={getTenantCustomisationConfig()}
            >
              {children}
            </CustomisationProvider>
          </ThemeProvider>
        </IntlProvider>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// For this method of finding the current state of a promise, util.inspect() is used

// When we inspect a pending promise, the output is: Promise { <pending> }

// When we inspect a rejected promise, the output is: Promise { <rejected> undefined } where
// whatever resolve() 's  argument is. When nothing is passed, its undefined

// When we inspect a resolved promise, the output is: Promise { undefined }
// where the argument in resolve is inside the curly braces

export function isPromisePending(promise) {
  return util.inspect(promise) === 'Promise { <pending> }';
}

export function isPromiseRejected(promise) {
  return util.inspect(promise).startsWith('Promise { <rejected>');
}

export function isPromiseResolved(promise) {
  // if the promise's state is neither rejected or pending, its resolved
  return !isPromiseRejected(promise) && !isPromisePending(promise);
}

export function isPromise(possiblePromise) {
  let promise = false;
  try {
    if (typeof possiblePromise === 'object' && typeof possiblePromise.then === 'function') {
      promise = true;
    }
  } catch {
    // do nothing
  }
  return promise;
}

export const isJointStrategy = (strategy) => {
  const jointStrategies = Object.entries(STATES_ENUM).filter(([k, v]) => k.includes('JOINT')).map(([k, v]) => v);
  return jointStrategies.includes(strategy);
};

export const isPartnerStrategy = (strategy) => {
  const partnerStrategies = Object.entries(STATES_ENUM).filter(([k, v]) => k.includes('PARTNER')).map(([k, v]) => v);
  return partnerStrategies.includes(strategy);
};
