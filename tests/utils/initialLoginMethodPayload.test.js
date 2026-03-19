import { DB_LOGIN_METHOD_TYPE_MAPPER, SSO_CONNECTION_TYPES } from '../../src/constants/socialSignOn';
import { handlePostAccountRecord } from '../../src/NewActions/handle';
import { USER_TYPES } from '../../src/utils/const';
import ReduxStateMother from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

const fetch = require('../../src/NewActions/fetch');
const helpers = require('../../src/utils/helpers');

describe('DB_LOGIN_METHOD_TYPE_MAPPER', () => {
  test('should be defined', () => {
    expect(DB_LOGIN_METHOD_TYPE_MAPPER).toBeDefined();
  });

  test('should map all SSO connection types to correct database login method types', () => {
    expect(DB_LOGIN_METHOD_TYPE_MAPPER[SSO_CONNECTION_TYPES.GOOGLE]).toBe('google_social_sign_on');
    expect(DB_LOGIN_METHOD_TYPE_MAPPER[SSO_CONNECTION_TYPES.APPLE]).toBe('apple_social_sign_on');
    expect(DB_LOGIN_METHOD_TYPE_MAPPER[SSO_CONNECTION_TYPES.FACEBOOK]).toBe('facebook_social_sign_on');
    expect(DB_LOGIN_METHOD_TYPE_MAPPER[SSO_CONNECTION_TYPES.MAGIC_LINK]).toBe('magic_link');
  });

  test('should have a mapping for every SSO connection type', () => {
    const ssoConnectionTypes = Object.values(SSO_CONNECTION_TYPES);
    const mapperKeys = Object.keys(DB_LOGIN_METHOD_TYPE_MAPPER);
    
    for (const ssoType of ssoConnectionTypes) {
      expect(mapperKeys).toContain(ssoType);
    }
    
    expect(mapperKeys.length).toBe(ssoConnectionTypes.length);
  });

  test('should have correct number of mappings', () => {
    const expectedLength = 4;
    expect(Object.keys(DB_LOGIN_METHOD_TYPE_MAPPER).length).toBe(expectedLength);
  });
});

describe('handlePostAccountRecord - login_type mapping', () => {
  let postAccountRecordSpy;
  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    postAccountRecordSpy = jest.spyOn(fetch, 'postAccountRecord').mockImplementation(() => 
      Promise.resolve({ user_id: 'test-user-id' })
    );
    
    // Mock withErrorModalOnFail to just call the function directly
    jest.spyOn(helpers, 'withErrorModalOnFail').mockImplementation((fn) => fn);
    
    dispatchMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [SSO_CONNECTION_TYPES.GOOGLE, 'google_social_sign_on'],
    [SSO_CONNECTION_TYPES.APPLE, 'apple_social_sign_on'],
    [SSO_CONNECTION_TYPES.FACEBOOK, 'facebook_social_sign_on'],
    [SSO_CONNECTION_TYPES.MAGIC_LINK, 'magic_link'],
  ])('should map login_method %s from Redux state to %s when sending to backend', async (loginMethod, expectedMappedValue) => {
    const state = new ReduxStateMother(STATES_ENUM.DEFAULT);
    state.primary.session.user_id = ''; // Ensure user_id is empty so postAccountRecord is called
    state.metadata.setMetadataProp('login_method', loginMethod);
    
    getStateMock = jest.fn().mockImplementation(() => ({ ...state.toJson() }));

    await handlePostAccountRecord(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

    expect(postAccountRecordSpy).toHaveBeenCalled();
    const callArgs = postAccountRecordSpy.mock.calls[0];
    const initialLoginMethodAttempt = callArgs[4]; // 5th parameter (0-indexed: 4)
    
    expect(initialLoginMethodAttempt).toBe(expectedMappedValue);
  });

  test('should retrieve login_method from Redux state metadata', async () => {
    const state = new ReduxStateMother(STATES_ENUM.DEFAULT);
    state.primary.session.user_id = '';
    state.metadata.setMetadataProp('login_method', SSO_CONNECTION_TYPES.GOOGLE);
    
    getStateMock = jest.fn().mockImplementation(() => ({ ...state.toJson() }));

    await handlePostAccountRecord(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

    expect(getStateMock).toHaveBeenCalled();
    expect(postAccountRecordSpy).toHaveBeenCalled();
    
    const callArgs = postAccountRecordSpy.mock.calls[0];
    expect(callArgs[4]).toBe('google_social_sign_on');
  });
});

