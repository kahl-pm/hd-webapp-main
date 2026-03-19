import { USER_TYPES } from '../../src/utils/const';
import { allUsersParallel } from '../../src/utils/helpers';

describe(' allUsersParallel tests for Primary, Secondary, Dependents', () => {
  test('should dispatch the provided function for when currentUser is PRIMARY, no SECONDARY and no DEPENDENTS (Family of 1)', async () => {
    const stateObj = {
      userControl: {
        currentUser: USER_TYPES.PRIMARY,
        hasPartnerApplication: false,
      },
      dependents: {
        dependent_keys: [],
      },
    };
    const mockDispatch = jest.fn();
    const mockFunc = jest.fn();
    const wrapperFunc = allUsersParallel((user) => {
      mockFunc(user);
    });
    const mockGetState = jest.fn().mockReturnValue(stateObj);
    await wrapperFunc()(mockDispatch, mockGetState);

    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.PRIMARY);
  });
  test('should dispatch the provided function for PRIMARY, and when currentUser is SECONDARY having hasPartnerApplication is true (Family of 2)', async () => {
    const stateObj = {
      userControl: {
        currentUser: USER_TYPES.SECONDARY,
        hasPartnerApplication: true,
      },
      dependents: {
        dependent_keys: [],
      },
    };
    const mockDispatch = jest.fn();
    const mockFunc = jest.fn();
    const wrapperFunc = allUsersParallel((user) => {
      mockFunc(user);
    });
    const mockGetState = jest.fn().mockReturnValue(stateObj);
    await wrapperFunc()(mockDispatch, mockGetState);

    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.PRIMARY);
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.SECONDARY);
  });
  test('should dispatch the provided function for PRIMARY user and five DEPENDENTS (Family of 6)', async () => {
    const mockFunc = jest.fn().mockResolvedValue('test');
    const mockDispatch = jest.fn();
    const stateObj = {
      userControl: {
        currentUser: USER_TYPES.PRIMARY,
        hasPartnerApplication: false,
      },
      dependents: {
        dependent_keys: ['dep1', 'dep2', 'dep3', 'dep4', 'dep5'],
      },
    };
    const mockGetState = jest.fn().mockReturnValue(stateObj);

    const wrapperFunc = allUsersParallel(mockFunc);
    await wrapperFunc()(mockDispatch, mockGetState);

    expect(mockFunc).toHaveBeenCalledTimes(6);
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.PRIMARY);
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.DEPENDENT, 'dep1');
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.DEPENDENT, 'dep2');
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.DEPENDENT, 'dep3');
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.DEPENDENT, 'dep4');
    expect(mockFunc).toHaveBeenCalledWith(USER_TYPES.DEPENDENT, 'dep5');
  });
  test('should handle when the dispatched function (fn) returns a promise that resolves (Family of 1)', async () => {
    const mockFunc = jest.fn().mockResolvedValue('');
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn().mockReturnValue({
      userControl: {
        currentUser: USER_TYPES.PRIMARY,
        hasPartnerApplication: false,
      },
      dependents: {
        dependent_keys: [],
      },
    });

    const wrapperFunc = allUsersParallel(mockFunc);
    const result = await wrapperFunc()(mockDispatch, mockGetState);

    expect(result[0].status).toEqual('fulfilled');
  });
});
