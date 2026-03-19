import FacebookPixel from 'react-facebook-pixel';
import { facebookInitPixel, facebookPageView, facebookTrackCustom } from '../../src/utils/facebookHelpers';
import store from '../../src/store/index';
import * as config from '../../src/config';
import { facebookTrackCustomConst, facebookInitPixelConst } from './utilsFixtures';

const oldconfig = require('../../src/config');

const oldConfigCopy = { ...oldconfig };

const fetchActions = require('../../src/NewActions/fetch');

describe('facebookInitPixel function', () => {
  const OLD_ENV = process.env;
  const { advancedMatchingData, exStateExtra, exState } = facebookInitPixelConst;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.BROWSER;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('should call facebookInitPixel if BROWSER and FACEBOOK_PIXEL are truthy and no advancedMatchingData', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should call store.dispatch with initFbFlag\s action if BROWSER and FACEBOOK_PIXEL are truthy and no advancedMatchingData', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'dispatch').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(spy).toHaveBeenCalledWith({
      type: '@@metadata/init_fb_flag',
    });
  });

  test('should call store.dispatch with clearFbQueue\s action if BROWSER and FACEBOOK_PIXEL are truthy and no advancedMatchingData', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'dispatch').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(spy).toHaveBeenCalledWith({
      type: '@@metadata/clear_fb_queue',
    });
  });

  test('should call Facebook.Pixel with expected arguments if BROWSER and FACEBOOK_PIXEL are truthy and with valid advancedMatchingData defined', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const advancedMatchingDataModified = {
      em: 'some_email',
      fn: 'first_name',
      ge: 'm',
      db: '20010927',
    };
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel(advancedMatchingData);

    expect(initSpy).toHaveBeenCalledWith(true, advancedMatchingDataModified, {
      autoConfig: true,
      debug: false,
    });
  });

  test('should call Facebook.Pixel with expected arguments if BROWSER and FACEBOOK_PIXEL are truthy and with invalid advancedMatchingData defined', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const advancedMatchingData = {
      ail: 'SOME_EMAIL',
      tName: 'FIRST_NAME',
      rGender: 'MALE',
      date: '2001-9-27',
      era: 'EXTRAS',
    };
    const advancedMatchingDataModified = {};
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel(advancedMatchingData);

    expect(initSpy).toHaveBeenCalledWith(true, advancedMatchingDataModified, {
      autoConfig: true,
      debug: false,
    });
  });

  test('should call FacebookPixel.init with expected arguments if BROWSER and FACEBOOK_PIXEL are truthy and with no advancedMatchingData defined', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(initSpy).toHaveBeenCalledWith(true, {}, {
      autoConfig: true,
      debug: false,
    });
  });

  test('should not call FacebookPixel.init if BROWSER is falsy and FACEBOOK_PIXEL is truthy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = true;
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(initSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call FacebookPixel.init if BROWSER is truthy and FACEBOOK_PIXEL is falsy', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = false;
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(initSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call FacebookPixel.init if BROWSER is falsy and FACEBOOK_PIXEL is falsy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = false;
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(initSpy).toHaveBeenCalledTimes(0);
  });

  test('should call store.getState() if BROWSER and FACEBOOK_PIXEL are truthy and no advancedMatchingData', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exState);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should call store.getState() if BROWSER and FACEBOOK_PIXEL are truthy and valid advancedMatchingData argument', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exState);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });

    facebookInitPixel(advancedMatchingData);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should call postFacebookTrackEvent 3 times if BROWSER and FACEBOOK_PIXEL are truthy and valid advancedMatchingData and state.metadata.fbEventQueue has 3 elements', () => {
    // TODO: mock facebookTrackCustom instead of mocking this which is called inside to track the number of times its called
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exStateExtra);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookInitPixel(advancedMatchingData);

    expect(trackSpy).toHaveBeenCalledTimes(3);
  });
});

describe('facebookPageView function', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });
  test('should call postFacebookTrackEvent if BROWSER and FACEBOOK_PIXEL are truthy', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spyw = jest.spyOn(store, 'getState').mockImplementation(() => {
      return { primary: { household: { email: '', phone: '' } } };
    });
    const spy = jest.spyOn(fetchActions, 'postFacebookTrackEvent');

    facebookPageView();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('should not call postFacebookTrackEvent if env.BROWSER and FACEBOOK_PIXEL are falsy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = false;
    const spy = jest.spyOn(fetchActions, 'postFacebookTrackEvent');

    facebookPageView();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent if env.BROWSER is truthy and FACEBOOK_PIXEL is falsy', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = false;
    const spy = jest.spyOn(fetchActions, 'postFacebookTrackEvent');

    facebookPageView();

    expect(spy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent if env.BROWSER is falsy and FACEBOOK_PIXEL is truthy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(fetchActions, 'postFacebookTrackEvent');

    facebookPageView();

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('facebookTrackCustom function', () => {
  const OLD_ENV = process.env;
  const { exStateGetState, exStateGetStateBackPressedTrue, exState } = facebookTrackCustomConst;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  afterAll(() => {
    Object.assign(config, oldConfigCopy);
  });

  test('should call postFacebookTrackEvent once if BROWSER and FACEBOOK_PIXEL are truthy and state is passed as argument and backPressed is false and fbInitFlag is true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', exState);

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  test('should call postFacebookTrackEvent if BROWSER and FACEBOOK_PIXEL are truthy and state is passed as argument and backPressed is false and fbInitFlag is true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', exState);

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  test('should call postFacebookTrackEvent once if BROWSER and FACEBOOK_PIXEL are truthy and no state argument and getState gives backPressed as false and FbInitFlag is true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exStateGetState);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data');

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  test('should call postFacebookTrackEvent if BROWSER and FACEBOOK_PIXEL are truthy and no state argument and getState gives backPressed as false and FbInitFlag is true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exStateGetState);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data');

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  test('should call postFacebookTrackEvent if BROWSER and FACEBOOK_PIXEL are truthy and no state argument and getState gives backPressed as false and FbInitFlag is true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exStateGetState);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data');

    expect(trackSpy).toHaveBeenCalledTimes(1);
  });

  test('should not call postFacebookTrackEvent with name and data arguments if BROWSER and FACEBOOK_PIXEL are truthy and no state argument and getState gives backPressed as true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => exStateGetStateBackPressedTrue);
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data');

    expect(trackSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent with name and data arguments if BROWSER and FACEBOOK_PIXEL are truthy and state has backPressed as true', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', { ...exState, backPressed: true });

    expect(trackSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent with name and data arguments if BROWSER is falsy and FACEBOOK_PIXEL is truthy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = true;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', { ...exState, backPressed: true });

    expect(trackSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent with name and data arguments if BROWSER is truthy and FACEBOOK_PIXEL is falsy', () => {
    process.env.BROWSER = true;
    config.FACEBOOK_PIXEL = false;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', { ...exState, backPressed: true });

    expect(trackSpy).toHaveBeenCalledTimes(0);
  });

  test('should not call postFacebookTrackEvent with name and data arguments if BROWSER is falsy and FACEBOOK_PIXEL is falsy', () => {
    process.env.BROWSER = false;
    config.FACEBOOK_PIXEL = false;
    const spy = jest.spyOn(store, 'getState').mockImplementation(() => { });
    const initSpy = jest.spyOn(FacebookPixel, 'init').mockImplementation(() => { });
    const trackSpy = jest.spyOn(fetchActions, 'postFacebookTrackEvent').mockImplementation(() => { });

    facebookTrackCustom('name', 'data', { ...exState, backPressed: true });

    expect(trackSpy).toHaveBeenCalledTimes(0);
  });
});
