import { push } from 'connected-react-router';
import { calcAge } from '@policyme/global-libjs-utils';
import { _nextDisclosureQuestion } from '../../src/NewActions/handle';
import { USER_TYPES } from '../../src/utils/const';
import { STATE } from './helpers/handle.disclosure.state.mock';
import { isEmptyArray, isEmptyObj } from '../../src/utils/helpers';

jest.mock('connected-react-router', () => ({
  ...jest.requireActual('connected-react-router'),
  push: jest.fn(route => ({ type: '@@router/LOCATION_CHANGE', payload: { location: { pathname: route } } })),
}));

afterAll(() => jest.clearAllMocks());

describe('_nextDisclosureQuestion', () => {
  describe('Primary, Secondary, and two Dependents (one adult and one non-adult) (family of 4)', () => {
    test('Should navigate from "/application/primary/disclosure-integration/1" to "/application/secondary/disclosure-integration/1" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/1`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/1" to "/application/lsE4-1c1K/disclosure-integration/1" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/1`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/1" to "/application/lsE4-1c1K/disclosure-integration/2" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/2`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/9" to "/application/primary/disclosure-integration/10" (REFLECTIVE to BASE)"', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/9',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/10`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/100" to "/application/secondary/disclosure-integration/100" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/100',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/100`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/100" to "/application/lsE4-1c1K/disclosure-integration/100" (BASE)', async () => {
      const currentPath = `/application/secondary/disclosure-integration/100`;
      const expectedPath = `/application/lsE4-1c1K/disclosure-integration/100`;

      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: currentPath,
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = expectedPath;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should "not" navigate from "/application/lsE4-1c1K/disclosure-integration/100" to "/application/Y0zmi2ysCB/disclosure-integration/100" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/100',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/101`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/100" to "/application/primary/disclosure-integration/101" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/100',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/101`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/101" to "/application/secondary/disclosure-integration/101" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/101',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/101`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/101" to "/application/lsE4-1c1K/disclosure-integration/101" (BASE)', async () => {
      const currentPath = `/application/secondary/disclosure-integration/101`;
      const expectedPath = `/application/lsE4-1c1K/disclosure-integration/101`;

      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: currentPath,
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = expectedPath;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/101" to "/application/primary/disclosure-integration/119" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/101',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/119`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/142" to "/application/secondary/disclosure-integration/142" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/142`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/142" to "/application/lsE4-1c1K/disclosure-integration/142" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/142`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/142" to "/application/Y0zmi2ysCB/disclosure-integration/142" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/142`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/142" to "/application/primary/disclosure-integration/229" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/229`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/229" to "/application/secondary/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/231`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/231" to "/application/lsE4-1c1K/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/231`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/231`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/232" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/232`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/232" to "/application/Y0zmi2ysCB/disclosure-integration/234" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/232',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/233`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/234" to "/application/Y0zmi2ysCB/disclosure-integration/235" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/234',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/235`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/235" to "/application/referrer" (EXIT DISCLOSURE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/235',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/referrer`;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });
  });

  describe('Primary, no Secondary, and two Dependents (one adult and one non-adult) (family of 3)', () => {
    test('Should verify "lsE4-1c1K" as the key for adult dependent', () => {
      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: `/application/lsE4-1c1K/disclosure-integration/1`,
          },
        },
      };
      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      const dependentKeys = getStateMock().dependents.dependent_keys;
      const dob = getStateMock().dependents.dependents['lsE4-1c1K'].household.birthdate;

      expect(dependentKeys[0]).toEqual('lsE4-1c1K');
      expect(calcAge(dob)).toBeGreaterThanOrEqual(18);
    });

    test('Should verify "Y0zmi2ysCB" as the key for non-adult dependent', () => {
      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: `/application/lsE4-1c1K/disclosure-integration/1`,
          },
        },
      };
      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      const dependentKeys = getStateMock().dependents.dependent_keys;
      const dob = getStateMock().dependents.dependents.Y0zmi2ysCB.household.birthdate;

      expect(dependentKeys[1]).toEqual('Y0zmi2ysCB');
      expect(calcAge(dob)).toBeLessThanOrEqual(18);
    });

    test('Should navigate from "/application/primary/disclosure-integration/1" to "/application/lsE4-1c1K/disclosure-integration/1" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/1`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/1" to "/application/lsE4-1c1K/disclosure-integration/2" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: `/application/lsE4-1c1K/disclosure-integration/1`,
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/2`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/2" to "/application/lsE4-1c1K/disclosure-integration/7" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/2',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/7`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/7" to "/application/lsE4-1c1K/disclosure-integration/8" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/7',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/8`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/8" to "/application/lsE4-1c1K/disclosure-integration/9" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/8',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/9`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/9" to "/application/primary/disclosure-integration/10" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/9',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/10`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('primary')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/11" to "/application/lsE4-1c1K/disclosure-integration/10" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/11',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('primary')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/10`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/10" to "/application/primary/disclosure-integration/63" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/11',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/63`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/63" to "/application/lsE4-1c1K/disclosure-integration/63" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/63',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('primary')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/63`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/63" to "/application/primary/disclosure-integration/64" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/63',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/64`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/231" to "/application/lsE4-1c1K/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('primary')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/lsE4-1c1K/disclosure-integration/231`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/lsE4-1c1K/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/lsE4-1c1K/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('lsE4-1c1K')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/231`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/232" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/232`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/232" to "/application/Y0zmi2ysCB/disclosure-integration/233" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/232',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/233`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/233" to "/application/Y0zmi2ysCB/disclosure-integration/234" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/233',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/234`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/234" to "/application/Y0zmi2ysCB/disclosure-integration/235" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/234',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/235`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/235" to "/application/referrer" (EXIT DISCLOSURE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
          household: {
            phone: '',
          }
        },
        userControl: {
          ...STATE.userControl,
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/235',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/referrer`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });
  });

  describe('Primary, Secondary, no Dependents (family of 2)', () => {
    test('Should verify no Dependents', async () => {
      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      const isDependentKeysEmpty = isEmptyArray(getStateMock().dependents.dependent_keys);
      const isDependentsEmpty = isEmptyObj(getStateMock().dependents.dependent);
      expect(isDependentKeysEmpty).toBeTruthy();
      expect(isDependentsEmpty).toBeTruthy();
    });

    test('Should navigate from "/application/primary/disclosure-integration/1" to "/application/secondary/disclosure-integration/1" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/1`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/1" to "/application/primary/disclosure-integration/10" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/10`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/11" to "/application/secondary/disclosure-integration/10" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/11',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/10`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/10" to "/application/secondary/disclosure-integration/11" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/10',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/secondary/disclosure-integration/11`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/11" to "/application/primary/disclosure-integration/63" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/11',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/63`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/secondary/disclosure-integration/231" to "/application/referrer" (EXIT DISCLOSURE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/secondary/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.SECONDARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/referrer`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });
  });

  describe('Primary, no Secondary, one Dependent (one non-adult) (family of 2)', () => {
    const depKeys = STATE.dependents.dependent_keys[1];
    const depObj = STATE.dependents.dependents.Y0zmi2ysCB;

    test('Should verify only one Dependent', async () => {
      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      const dependentKeys = getStateMock().dependents.dependent_keys;

      expect(dependentKeys.length).toEqual(1);
    });

    test('Should verify "Y0zmi2ysCB" as the key for non-adult dependent', () => {
      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
      };
      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      const dependentKeys = getStateMock().dependents.dependent_keys;
      const dob = getStateMock().dependents.dependents.Y0zmi2ysCB.household.birthdate;

      expect(dependentKeys[0]).toEqual('Y0zmi2ysCB');
      expect(calcAge(dob)).toBeLessThan(18);
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (BASE to REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const dependentKeys = getStateMock().dependents.dependent_keys;

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(dependentKeys[0]).toEqual('Y0zmi2ysCB');
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/11" to "/application/primary/disclosure-integration/63" (REFLECTIVE to BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/11',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/63`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/63" to "/application/primary/disclosure-integration/64" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/63',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/64`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/64" to "/application/primary/disclosure-integration/99" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/64',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/99`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/99" to "/application/primary/disclosure-integration/100" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/99',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/100`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/100" to "/application/primary/disclosure-integration/101" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/100',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/101`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/101" to "/application/primary/disclosure-integration/119" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/101',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/119`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/119" to "/application/primary/disclosure-integration/121" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/119',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/121`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/121" to "/application/primary/disclosure-integration/126" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/121',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/126`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/126" to "/application/primary/disclosure-integration/127" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/126',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/127`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/127" to "/application/primary/disclosure-integration/130" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/127',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/130`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/130" to "/application/primary/disclosure-integration/131" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/130',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/131`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/131" to "/application/primary/disclosure-integration/133" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/131',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/133`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/133" to "/application/primary/disclosure-integration/134" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/133',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/134`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/134" to "/application/primary/disclosure-integration/135" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/134',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/135`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/135" to "/application/primary/disclosure-integration/137" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/135',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/137`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/137" to "/application/primary/disclosure-integration/140" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/137',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/140`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/140" to "/application/primary/disclosure-integration/142" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/140',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/142`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/142" to "/application/Y0zmi2ysCB/disclosure-integration/142" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/142`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/142" to "/application/primary/disclosure-integration/229" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/142',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/229`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/229" to "/application/Y0zmi2ysCB/disclosure-integration/229" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/229',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/229`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/229" to "/application/primary/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/229',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/primary/disclosure-integration/231`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/231`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/231" to "/application/Y0zmi2ysCB/disclosure-integration/232" (BASE to REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/231',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/232`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/232" to "/application/Y0zmi2ysCB/disclosure-integration/233" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/232',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/233`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/233" to "/application/Y0zmi2ysCB/disclosure-integration/234" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/233',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/234`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/234" to "/application/Y0zmi2ysCB/disclosure-integration/235" (REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {

        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/234',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/Y0zmi2ysCB/disclosure-integration/235`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/Y0zmi2ysCB/disclosure-integration/235" to "/application/referrer" (EXIT DISCLOSURE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
          household: {
            phone: '',
          }
        },
        dependents: {
          dependent_keys: [depKeys],
          dependents: {
            [depKeys]: depObj,
          },
        },
        userControl: {
          ...STATE.userControl,
          hasPartnerApplication: false,
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/Y0zmi2ysCB/disclosure-integration/235',
          },
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);
      await _nextDisclosureQuestion('Y0zmi2ysCB')(dispatchMock, getStateMock);
      const nextDisclosureRoute = `/application/referrer`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });
  });

  describe('Primary, no Secondary, no Dependents (family of 1)', () => {
    test('Should verify no Secondary', async () => {
      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      const isSecondaryEmpty = isEmptyObj(getStateMock().secondary);
      expect(isSecondaryEmpty).toBeTruthy();
    });

    test('Should verify no Dependents', async () => {
      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      const isDependentKeysEmpty = isEmptyArray(getStateMock().dependents.dependent_keys);
      const isDependentsEmpty = isEmptyObj(getStateMock().dependents.dependent);
      expect(isDependentKeysEmpty).toBeTruthy();
      expect(isDependentsEmpty).toBeTruthy();
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/10" to "/application/primary/disclosure-integration/11" (BASE to REFLECTIVE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/10',
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/11`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/142" to "/application/primary/disclosure-integration/229" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/142',
          },
        },
        userControl: {
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/229`;

      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/229" to "/application/primary/disclosure-integration/231" (BASE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {},
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/229',
          },
        },
        userControl: {
          ...STATE.userControl,
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/primary/disclosure-integration/231`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });

    test('Should navigate from "/application/primary/disclosure-integration/1" to "/application/referrer" (EXIT DISCLOSURE)', async () => {
      const dispatchMock = jest.fn();

      let reduxStore = {
        ...STATE,
        secondary: {
          household: {
            phone: '',
          }
        },
        dependents: {
          dependent_keys: [],
          dependent: {},
        },
        router: {
          ...STATE.router,
          location: {
            ...STATE.router.location,
            pathname: '/application/primary/disclosure-integration/1',
          },
        },
        userControl: {
          ...STATE.userControl,
          hasPartnerApplication: false,
        },
      };

      const getStateMock = jest.fn().mockReturnValue(reduxStore);

      await _nextDisclosureQuestion(USER_TYPES.PRIMARY)(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(1);

      const nextDisclosureRoute = `/application/referrer`;

      expect(push).toHaveBeenCalledWith(nextDisclosureRoute);
      expect(dispatchMock).toHaveBeenCalledWith(push(nextDisclosureRoute));
    });
  });
});
