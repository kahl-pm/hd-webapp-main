import {
  sendEventAll,
} from '../../src/NewActions/analytics';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

const facebookHelpers = require('../../src/utils/facebookHelpers');

describe.each([
  [STATES_ENUM.DEFAULT],
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT],
])('Analytics actions with state strategy %s', (stateStrategy) => {
  describe('sendEventAll', () => {
    const dispatchMock = jest.fn();
    let getStateMock;
    let stateObj1;
    let facebookTrackCustomMock;
    beforeEach(() => {
      facebookTrackCustomMock = jest.spyOn(facebookHelpers, 'facebookTrackCustom').mockImplementation(() => 'facebookTrackCustomMockReturnValue');
      stateObj1 = new ReduxState(stateStrategy);
      getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
    });

    describe.each([
      ['eventNameValue', 'eventNameValue', 'eventNameValue'],
      ['nothing', undefined, undefined],
    ])('When %s is passed in as an argument', (text, arg, expectedArgValue) => {

      test(`Should call facebookTrackCustom once with ${expectedArgValue}`, () => {
        sendEventAll(arg)(dispatchMock, getStateMock);

        expect(facebookTrackCustomMock).toHaveBeenCalledTimes(1);
        expect(facebookTrackCustomMock).toHaveBeenCalledWith(expectedArgValue);
      });
    });
  });
});
