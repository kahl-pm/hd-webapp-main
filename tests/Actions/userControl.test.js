import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';
import { updateHasPartnerApplication } from '../../src/NewActions/userControl';

describe('Verify updateHasPartnerApplication', () => {
  const dispatchMock = jest.fn();
  let getStateMock;
  let stateObj1;

  describe('When setting joint application', () => {
    beforeEach(() => {
      stateObj1 = new ReduxState(STATES_ENUM.JOINT);
      getStateMock = jest.fn().mockImplementation(() => ({ ...stateObj1 }));
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should dispatch hasPartnerApplication update', () => {
      updateHasPartnerApplication(true)(dispatchMock, getStateMock);
      expect(dispatchMock).toBeCalled();
      // Should dispatch: updateUserControlProp, updateSessionPropAllProducts x2,
      // updateHouseholdPropAll, saveJointQuoteToggleCookie, sendSegmentIdentifyEvent
      expect(dispatchMock.mock.calls.length).toBeGreaterThanOrEqual(5);
    });
  });
});
