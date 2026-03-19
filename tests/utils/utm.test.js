import jsCookie from 'js-cookie';
import { GLOBAL_MAIN_ENDPOINT } from '../../src/config';
import { getUtmIds, clearUtmCookies, setUtmFields, trackUtm, trackConversion } from '../../src/utils/utm';
import * as config from '../../src/config';
import { createTestStore } from '../util';

import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';
import { CONVERSION_TYPES, PM_PRODUCT_PREFIX, USER_TYPES, COOKIE_EXPIRY_DAYS } from '../../src/utils/const';

const fetchMock = require('fetch-mock');
const utils = require('@policyme/global-libjs-utils');
const helpers = require('../../src/utils/helpers');
const fetchActions = require('../../src/NewActions/fetch');
const oldconfig = require('../../src/config');
const productApp = require('../../src/Selectors/helpers/productApp');
const { fetch } = require('../../src/utils/fetch');

jest.mock('../../src/utils/fetch', () => ({ fetch: require('fetch-mock').sandbox() }));

const oldConfigCopy = { ...oldconfig };

function setCookie(name, value) {
  document.cookie = `${name}=${value};`;
}

const turnOnAnalytics = () => {
  setCookie('pm_accepted_cookies', 'true');
};

// This is required to make spyOn work with external modules
// https://stackoverflow.com/questions/67872622/jest-spyon-not-working-on-index-file-cannot-redefine-property
jest.mock('@policyme/global-libjs-utils', () => ({
  __esModule: true,
  ...jest.requireActual('@policyme/global-libjs-utils'),
}));

describe.each([
  [CONVERSION_TYPES.APP_SUBMITTED],
  [CONVERSION_TYPES.EMAIL_CREATED],
  [CONVERSION_TYPES.APP_STARTED],
])('Handle track conversion actions with conversion type %s', (conversion_type) => {
  describe('Should invoke fetch with appropriate payload', () => {
    let store, state;
    let getMainProductMock;
    let expectedPayload = {
      hh_info_id: '8a1aeadd-d177-4100-bc05-213e51d8ed21',
      session_id: undefined,
      app_id: undefined,
      email: 'selby.gomes+test_redux@policyme.com',
      conversion_source: 'test_source',
      extra_data: {},
      utm_source: 'test_source',
      utm_term: '20',
    };
    beforeEach(() => {
      turnOnAnalytics();
      let testStore = createTestStore(STATES_ENUM.DEV_INIT);
      store = testStore.store;
      state = testStore.state;
      getMainProductMock = jest.spyOn(productApp, 'getMainProduct').mockImplementation(() => PM_PRODUCT_PREFIX.HD);
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      const options = { method: 'POST', headers };
      fetch.mock(`${GLOBAL_MAIN_ENDPOINT}/conversion/${conversion_type}`, '{"someKey": "someValue"}', options);
      jest.spyOn(jsCookie, 'get').mockImplementation((argument) => {
        if (argument === 'utm_source') {
          return 'test_source';
        }
        if (argument === 'utm_extras') {
          return null;
        }
        if (argument === 'utm_term') {
          return '20';
        }
        return '';
      });
    });
    afterEach(() => {
      fetch.reset();
    });

    test('Should call postConversion fetch once with appropriate payload', async () => {
      await store.dispatch(trackConversion(conversion_type));
      expect(fetch.calls().length).toBe(1);
      expect(fetch.calls()[0][1].body).toEqual(JSON.stringify(expectedPayload));
    });
  });
});

describe.each([
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT],
])('Handle track conversion actions with state strategy %s', (stateStrategy) => {
  describe('Should call post conversion when trackConversion is invoked', () => {
    let getMainProductMock;
    let postConversionMock;
    let store, state;
    beforeEach(() => {
      turnOnAnalytics();
      let testStore = createTestStore(stateStrategy);
      store = testStore.store;
      state = testStore.state;
      getMainProductMock = jest.spyOn(productApp, 'getMainProduct').mockImplementation(() => PM_PRODUCT_PREFIX.HD);
      postConversionMock = jest.spyOn(fetchActions, 'postConversion').mockImplementation(() => {
        return Promise.resolve('returnValue');
      });
    });

    test('Should call postConversion when trackConversion is invoked', async () => {
      await store.dispatch(trackConversion(CONVERSION_TYPES.APP_STARTED));
      // HD-only: allCrossSellableUsers always dispatches for PRIMARY only
      expect(postConversionMock).toHaveBeenCalledTimes(1);
    });
  });
});

describe('getUtmIds', () => {
  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('should return object with global and tracking id set to what jsCookie.get returned when no arguments are passed', () => {
    const spy = jest.spyOn(jsCookie, 'get').mockImplementation((argument) => {
      if (argument === 'utm_global_id') {
        return 'globalReturnValue';
      }
      if (argument === 'utm_tracking_id') {
        return 'trackingReturnValue';
      }
      return '';
    });

    expect(getUtmIds()).toEqual({
      utm_global_id: 'globalReturnValue',
      utm_tracking_id: 'trackingReturnValue',
    });
  });

  test('should return object with global and tracking id set to what jsCookie.get returned when an argument are passed', () => {
    const spy = jest.spyOn(jsCookie, 'get').mockImplementation((argument) => {
      if (argument === 'utm_global_id') {
        return 'globalReturnValue';
      }
      if (argument === 'utm_tracking_id') {
        return 'trackingReturnValue';
      }

      return '';
    });

    expect(getUtmIds('someValue')).toEqual({
      utm_global_id: 'globalReturnValue',
      utm_tracking_id: 'trackingReturnValue',
    });
  });

  test('jsCookie.get should be called with utm_global_id', () => {
    const spy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });

    getUtmIds();

    expect(spy).toHaveBeenCalledWith('utm_global_id');
  });

  test('jsCookie.get should be called with utm_tracking_id', () => {
    const spy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });

    getUtmIds();

    expect(spy).toHaveBeenCalledWith('utm_tracking_id');
  });
});

describe('clearUtmCookies', () => {
  beforeEach(() => {
    turnOnAnalytics();
  });
  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('jsCookie.remove should be called with utm_extras and {domain: .policyme.com } if PM_ENVIROMENT is dev', () => {
    config.PM_ENVIRONMENT = 'dev';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_extras', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_global_id and {domain: .policyme.com } if PM_ENVIROMENT is dev', () => {
    config.PM_ENVIRONMENT = 'dev';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_global_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_tracking_id and {domain: .policyme.com } if PM_ENVIROMENT is dev', () => {
    config.PM_ENVIRONMENT = 'dev';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_tracking_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test.each([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'])('jsCookie.remove should be called with %s and {domain: www.policyme.com } if PM_ENVIROMENT is dev', (utm) => {
    config.PM_ENVIRONMENT = 'dev';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith(utm, {
      expires: COOKIE_EXPIRY_DAYS,
      domain: helpers.getCookieDomain(),
      secure: true,
      sameSite: 'strict'
    });
  });

  test('jsCookie.remove should be called with utm_extras and {domain: www.policyme.com } if PM_ENVIROMENT is prod', () => {
    config.PM_ENVIRONMENT = 'prod';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_extras', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_global_id and {domain: www.policyme.com } if PM_ENVIROMENT is prod', () => {
    config.PM_ENVIRONMENT = 'prod';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_global_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_tracking_id and {domain: www.policyme.com } if PM_ENVIROMENT is prod', () => {
    config.PM_ENVIRONMENT = 'prod';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_tracking_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test.each([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'])('jsCookie.remove should be called with %s and {domain: www.policyme.com } if PM_ENVIROMENT is prod', (utm) => {
    config.PM_ENVIRONMENT = 'prod';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith(utm, {
      expires: COOKIE_EXPIRY_DAYS,
      domain: helpers.getCookieDomain(),
      secure: true,
      sameSite: 'strict'
    });
  });

  test('jsCookie.remove should be called with utm_extras and {domain: .policyme.com } if PM_ENVIROMENT is empty string', () => {
    config.PM_ENVIRONMENT = '';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_extras', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_global_id and {domain: .policyme.com } if PM_ENVIROMENT is empty string', () => {
    config.PM_ENVIRONMENT = '';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_global_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_tracking_id and {domain: .policyme.com } if PM_ENVIROMENT is empty string', () => {
    config.PM_ENVIRONMENT = '';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith('utm_tracking_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test.each([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content'])('jsCookie.remove should be called with %s and {domain: www.policyme.com } if PM_ENVIROMENT is empty string', (utm) => {
    config.PM_ENVIRONMENT = '';
    const spy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    clearUtmCookies();

    expect(spy).toHaveBeenCalledWith(utm, {
      expires: COOKIE_EXPIRY_DAYS,
      domain: helpers.getCookieDomain(),
      secure: true,
      sameSite: 'strict'
    });
  });
});

describe('setUtmFields', () => {
  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('should return true if utm_medium value doesnt match between the argument and getCookieUtmFields could return (excluding utm_extras) are equal', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'source',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: null,
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    expect(setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extras')).toBe(true);
  });

  test('jsCookie.remove should be called with utm_tracking_id if utm_medium value doesnt match between the argument and getCookieUtmFields could return (excluding utm_extras) are equal', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'source',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: null,
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extras');

    expect(removeSpy).toHaveBeenCalledWith('utm_tracking_id', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_extras if utm_term value doesnt match between the argument and getCookieUtmFields could return (excluding utm_extras) are equal', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'source',
      utm_medium: 'medium',
      utm_campaign: 'campaign',
      utm_term: 'otherValue',
      utm_content: 'content',
      utm_extras: null,
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extras');

    expect(removeSpy).toHaveBeenCalledWith('utm_extras', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should not be called with utm_extras if utm_content value doesnt match between the argument and getCookieUtmFields could return and utm_extras is not passed as an argument', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'source',
      utm_medium: 'medium',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'otherValue',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content');

    expect(setSpy).not.toHaveBeenCalledWith('utm_extras', expect.anything(), { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_extras if utm_source value doesnt match between the argument and getCookieUtmFields could return and utm_extras is passed as an argument', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'someValue',
      utm_medium: 'medium',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_extras', 'extraString', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_source and its corresponding argument value if a value doesnt match between the argument and getCookieUtmFields could return if it defined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_source', 'source', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_medium and its corresponding argument value if a value doesnt match between the argument and getCookieUtmFields could return if it defined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaign',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_medium', 'medium', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_campaign and its corresponding argument value if a value doesnt match between the argument and getCookieUtmFields could return if it defined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'term',
      utm_content: 'content',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_campaign', 'campaign', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_term and its corresponding argument value if a value doesnt match between the argument and getCookieUtmFields could return if it defined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'content',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_term', 'term', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.set should be called with utm_content and its corresponding argument value if a value doesnt match between the argument and getCookieUtmFields could return if it defined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', 'content', 'extraString');

    expect(setSpy).toHaveBeenCalledWith('utm_content', 'content', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_content if a value doesnt match between the argument and getCookieUtmFields could return and utm_content argument is undefined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', 'term', undefined, 'extraString');

    expect(removeSpy).toHaveBeenCalledWith('utm_content', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_term if a value doesnt match between the argument and getCookieUtmFields could return and utm_term argument is undefined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', 'campaign', undefined, undefined, 'extraString');

    expect(removeSpy).toHaveBeenCalledWith('utm_term', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_campaign if a value doesnt match between the argument and getCookieUtmFields could return and utm_campaign argument is undefined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', 'medium', undefined, 'term', 'smt', 'extraString');

    expect(removeSpy).toHaveBeenCalledWith('utm_campaign', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_medium if a value doesnt match between the argument and getCookieUtmFields could return and utm_medium argument is undefined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields('source', undefined, 'campaign', 'term', 'smt', 'extraString');

    expect(removeSpy).toHaveBeenCalledWith('utm_medium', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });

  test('jsCookie.remove should be called with utm_source if a value doesnt match between the argument and getCookieUtmFields could return and utm_source argument is undefined', () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => ({
      utm_source: 'sourceVal',
      utm_medium: 'someThingElse',
      utm_campaign: 'campaignSMT',
      utm_term: 'termSMT',
      utm_content: 'contentSMT',
      utm_extras: 'utmExtras',
    }));
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => { });
    const removeSpy = jest.spyOn(jsCookie, 'remove').mockImplementation(() => { });
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const stringifySpy = jest.spyOn(JSON, 'stringify').mockImplementation((arg) => arg);

    setUtmFields(undefined, 'medium', 'campaign', 'term', undefined, 'extraString');

    expect(removeSpy).toHaveBeenCalledWith('utm_source', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
  });
});

describe('trackUtm', () => {
  const assignObj = {
    utm_source: 'source',
    utm_medium: 'medium',
    utm_campaign: 'campaign',
    utm_term: 'term',
    utm_content: 'content',
  };

  const falseStateObj = {
    metadata: {
      utm_global_id: false,
      utm_tracking_id: false,
    },
    router: {
      location: {
        pathname: '/',
      },
    },
    primary: {
      household: {
        email: 'abc@email.com',
      },
      session: {
        hd_session_id: 'aaaaa',
      },
    },
  };

  const trueStateObj = {
    metadata: {
      utm_global_id: true,
      utm_tracking_id: false,
    },
    router: {
      location: {
        pathname: '/',
      },
    },
    primary: {
      household: {
        email: 'abc@email.com',
      },
      session: {
        hd_session_id: 'aaaaa',
      },
    },
  };

  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('If there is an error, sentryWarning should be called', async () => {
    const mock = jest.spyOn(utils, 'sentryWarning').mockImplementation(() => 'someError');
    const spy = jest.fn().mockImplementation(() => { });
    await trackUtm(spy, {});
    expect(mock).toHaveBeenCalledTimes(1);
  });

  test('Dispatch should be called with updateUtm action if there is no utm_global_id in the state or cookie', async () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => assignObj);
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => false);
    const dispatchSpy = jest.fn();
    const sentrySpy = jest.spyOn(utils, 'sentryWarning').mockImplementation(() => 'someError');
    const postUtmSpy = jest.spyOn(fetchActions, 'postUtm').mockImplementation(() => Promise.resolve({
      data: {
        utm_global_id: 'globalId',
        utm_tracking_id: 'trackingId',
      },
    }));
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const parseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => ({
      distinct_id: 'distinct',
    }));
    const retrySpy = jest.spyOn(helpers, 'withRetryNoPrompt').mockImplementation(() => {
      return () => Promise.resolve('retryReturnValue');
    });

    return trackUtm(dispatchSpy, falseStateObj).then((res) => {
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: '@@metadata/update_utm',
        data: {
          utm_global_id: 'globalId',
          utm_tracking_id: 'trackingId',
        },
      });
    });
  });

  test('Should call jsCookie.set with utm_tracking_id if there is a utm_global_id but no utm_tracking_id in the state or cookie', async () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => assignObj);
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => false);
    const dispatchSpy = jest.fn();
    const sentrySpy = jest.spyOn(utils, 'sentryWarning').mockImplementation(() => 'someError');
    const postUtmTrackingSpy = jest.spyOn(fetchActions, 'postUtmTracking').mockImplementation(() => Promise.resolve({
      data: {
        utm_tracking_id: 'trackingId',
      },
    }));
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const parseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => ({
      distinct_id: 'distinct',
    }));
    const retrySpy = jest.spyOn(helpers, 'withRetryNoPrompt').mockImplementation(() => {
      return () => Promise.resolve('retryReturnValue');
    });

    return trackUtm(dispatchSpy, trueStateObj).then((res) => {
      expect(setSpy).toHaveBeenCalledWith('utm_tracking_id', 'trackingId', { expires: COOKIE_EXPIRY_DAYS, domain: helpers.getCookieDomain(), secure: true, sameSite: 'strict' });
    });
  });

  test('Dispatch should be called with updateUtm action if there is a utm_global_id but no utm_tracking_id in the state or cookie', async () => {
    const objSpy = jest.spyOn(Object, 'assign').mockImplementation(() => assignObj);
    const getSpy = jest.spyOn(jsCookie, 'get').mockImplementation(() => false);
    const dispatchSpy = jest.fn();
    const sentrySpy = jest.spyOn(utils, 'sentryWarning').mockImplementation(() => 'someError');
    const postUtmTrackingSpy = jest.spyOn(fetchActions, 'postUtmTracking').mockImplementation(() => Promise.resolve({
      data: {
        utm_tracking_id: 'trackingId',
      },
    }));
    const setSpy = jest.spyOn(jsCookie, 'set').mockImplementation(() => { });
    const parseSpy = jest.spyOn(JSON, 'parse').mockImplementation(() => ({
      distinct_id: 'distinct',
    }));
    const retrySpy = jest.spyOn(helpers, 'withRetryNoPrompt').mockImplementation(() => {
      return () => Promise.resolve('retryReturnValue');
    });

    return trackUtm(dispatchSpy, trueStateObj).then((res) => {
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: '@@metadata/update_utm',
        data: {
          utm_tracking_id: 'trackingId',
        },
      });
    });
  });

});
