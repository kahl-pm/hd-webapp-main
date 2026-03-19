import shortid from 'shortid';
import ReduxState from '../ReduxStateMother';
import { STATES_ENUM } from '../ReduxStateMother/const';
import session from '../../src/Reducer/session';
import { USER_TYPES } from '../../src/utils/const';

describe('Verify actions update the correct state for Primary and Secondary account holders', () => {
  let stateObj = {};
  test.each([
    ['@@primary/session/update', 'life_family_id', USER_TYPES.PRIMARY],
    ['@@primary/session/update', 'ci_family_id', USER_TYPES.PRIMARY],
    ['@@secondary/session/update', 'life_family_id', USER_TYPES.SECONDARY],
    ['@@secondary/session/update', 'ci_family_id', USER_TYPES.SECONDARY],
  ])('Action: "%s" with Property: "%s" should update its value for User: "%s"', (actionType, property, userType) => {
    const family_id = shortid.generate();
    const updateAction = {
      type: actionType,
      property,
      value: family_id,
    };
    const newState = session(userType)(stateObj, updateAction);
    expect(newState).toEqual({ ...stateObj, [property]: family_id });
  });
});
