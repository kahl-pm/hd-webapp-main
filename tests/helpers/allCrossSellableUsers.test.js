import { allCrossSellableUsers } from '../../src/NewActions/helpers/userWrappers';
import { PM_PRODUCT_PREFIX } from '../../src/utils/const';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

test('Joint: Should call function passed to allCrossSellableUsers once for HD', async () => {
  const stateObj1 = new ReduxState([STATES_ENUM.JOURNEY_JOINT_HD_GI]);
  const dispatchMock = jest.fn();
  const func = jest.fn();
  const wrapperFunc = allCrossSellableUsers((user, product) => {
    func(user);
  });
  const getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
  await wrapperFunc(PM_PRODUCT_PREFIX.HD)(dispatchMock, getStateMock);

  expect(func).toHaveBeenCalledTimes(1);
});

test('Individual: Should call function passed to allCrossSellableUsers once for HD', async () => {
  const stateObj1 = new ReduxState([STATES_ENUM.JOURNEY_INDIVIDUAL_HD_GI]);
  const dispatchMock = jest.fn();
  const func = jest.fn();
  const wrapperFunc = allCrossSellableUsers((user, product) => {
    func(user);
  });
  const getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
  await wrapperFunc(PM_PRODUCT_PREFIX.HD)(dispatchMock, getStateMock);

  expect(func).toHaveBeenCalledTimes(1);
});
