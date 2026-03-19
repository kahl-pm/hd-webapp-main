import { allUsers } from '../../src/utils/helpers';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

test('Should call function passed to allUsers once', async () => {
  const stateObj1 = new ReduxState([STATES_ENUM.DEFAULT]);
  const dispatchMock = jest.fn();
  const func = jest.fn();
  const wrapperFunc = allUsers((user) => {
    func(user);
  });
  const getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
  await wrapperFunc()(dispatchMock, getStateMock);

  expect(func).toHaveBeenCalledTimes(1);
});

test('Should call function passed to allUsers twice', async () => {
  const stateObj1 = new ReduxState([STATES_ENUM.JOINT]);
  const dispatchMock = jest.fn();
  const func = jest.fn();
  const wrapperFunc = allUsers((user) => {
    func(user);
  });
  const getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
  await wrapperFunc()(dispatchMock, getStateMock);

  expect(func).toHaveBeenCalledTimes(2);
});
