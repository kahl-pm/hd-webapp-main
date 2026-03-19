import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import metadata from '../../src/Reducer/metadata';
import { USER_INTENT_VALUES } from '../../src/utils/const';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';

describe('Verify actions update the correct state for User Intent', () => {
  let stateObj = {
    isPermLifeEnabled: false,
  };
  test.each([
    ['', false],
    [`${USER_INTENT_VALUES.WHOLE_INSURANCE}`, false],
    [`${USER_INTENT_VALUES.WHOLE_INSURANCE} | ${USER_INTENT_VALUES.HOME_AUTO_HEALTH}`, false],
    [`${USER_INTENT_VALUES.HOME_AUTO_HEALTH}`, false],
    [`${USER_INTENT_VALUES.MORTGAGE}`, false],
  ])('User Intent: "%s" should set isPermLifeEnabled to be: "%s"', (value, isPermLifeEnabled) => {
    const updateAction = {
      type: '@@metadata/update_metadata',
      property: 'userIntent',
      value,
    };
    const newState = metadata(stateObj, updateAction);
    expect(newState).toEqual({ ...stateObj, userIntent: value, isPermLifeEnabled });
  });
});

