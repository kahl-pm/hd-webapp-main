import jointMetadata, { initialState } from '../../src/Reducer/jointMetadata';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

const nonInitialState = {
  ...initialState,
  showFinancialDifficulties: 'Y',
  showResidencyAppliedPermRes: 'N',
  showResidencyDomesticWorker: 'N',
};

describe.each([
  [STATES_ENUM.DEFAULT],
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT],
])('JointMetadata reducer with state strategy %s', (stateStrategy) => {
  describe('Action: @@jointMetadata/update', () => {
    let stateObj1;
    const action = {
      type: '@@jointMetadata/update',
      property: '',
      value: '',
    };
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
      stateObj1 = stateObj1.jointMetadata;
    });

    // Setting Y/N property
    test('Should set showFinancialDifficulties to someValue', () => {
      action.property = 'showFinancialDifficulties';
      action.value = 'someValue';
      expect(jointMetadata(stateObj1, action)).toEqual({
        ...stateObj1,
        showFinancialDifficulties: 'someValue',
      });
    });

    // Setting true/false property
    test('Should set user_partner_same_trustee to someValue', () => {
      action.property = 'user_partner_same_trustee';
      action.value = 'someValue';
      expect(jointMetadata(stateObj1, action)).toEqual({
        ...stateObj1,
        user_partner_same_trustee: 'someValue',
      });
    });

    // Add property if property does not exist
    test('Should add property newProp with value newValue when it doesnt already exist in state', () => {
      action.property = 'newProp';
      action.value = 'newValue';
      expect(jointMetadata(stateObj1, action)).toEqual({
        ...stateObj1,
        newProp: 'newValue',
      });
    });
  });

  describe('Action: @@jointMetadata/reinit', () => {
    let stateObj1;
    const action = {
      type: '@@jointMetadata/reinit',
    };
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
      stateObj1 = stateObj1.jointMetadata;
    });

    // Reinit if non-init state
    test('Should reinitialize jointMetadata to initialState', () => {
      stateObj1 = { ...nonInitialState };
      expect(jointMetadata(stateObj1, action)).toEqual({ ...initialState });
    });

    // No change if init state
    test('No change if jointMetadata is already at initialState', () => {
      stateObj1 = { ...initialState };
      expect(jointMetadata(stateObj1, action)).toEqual({ ...initialState });
    });
  });

  describe('Default', () => {
    let stateObj1;
    beforeEach(() => {
      stateObj1 = new ReduxState(stateStrategy);
      stateObj1 = stateObj1.jointMetadata;
    });
    test('Should make no changes if action is an empty object', () => {
      expect(jointMetadata(stateObj1, {})).toEqual({ ...stateObj1 });
    });
  });
});
