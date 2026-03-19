import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import userControl from '../../src/Reducer/userControl';
import { PM_PRODUCT_PREFIX } from '../../src/utils/const';

describe('When joint app is disabled, hasPartnerApplication should not be set to true', () => {
  let stateObj = {
    hasPartnerApplication: false,
  };
  beforeEach(() => {
    global.__policyme = {
      FLAGS: {
        [TENANT_FLAGS.DISABLE_JOINT_APPLICATION]: true,
      },
    };
  });
  test.each([
    [true],
    [false],
  ])('Setting hasPartnerApplication with value: "%s"', (value) => {
    const updateAction = {
      type: '@@user_control/update_property',
      property: 'hasPartnerApplication',
      value,
    };
    const newState = userControl(stateObj, updateAction);
    expect(newState).toEqual({ ...stateObj, hasPartnerApplication: false });
  });

  test.each([
    [[PM_PRODUCT_PREFIX.HD]],
  ])('Setting availableProducts with value', (value) => {
    const updateAction = {
      type: '@@user_control/update_property',
      property: 'availableProducts',
      value,
    };
    const newState = userControl(stateObj, updateAction).availableProducts;
    expect(newState).toContain(PM_PRODUCT_PREFIX.HD);
  });
});
