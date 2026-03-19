import { makePostProductAppRecord } from '../../src/NewActions/helpers/productApp';
import { PM_PRODUCT_PREFIX } from '../../src/utils/const';
import ReduxStateMother from '../ReduxStateMother';

const productFetchActions = require('../../src/NewActions/helpers/productFetch');
const productAppSelectors = require('../../src/Selectors/helpers/productApp');

describe('makePostProductAppRecord', () => {
  test.each([[PM_PRODUCT_PREFIX.HD]])('Should include external_advisor_id for %s', async (productPrefix) => {
    const postProductAppMock = jest.spyOn(productFetchActions, 'postProductApp').mockImplementation(() => Promise.resolve({}));
    jest.spyOn(productAppSelectors, 'getMainProduct').mockImplementation(() => productPrefix);

    const state = new ReduxStateMother();
    state.primary[`${productPrefix}App`] = {
      ...state.primary[`${productPrefix}App`],
      external_advisor_id: 98789.0,
    };
    state.metadata.preAppMainProduct = productPrefix;
    const getState = jest.fn().mockImplementation(() => ({ ...state }));

    await makePostProductAppRecord('primary', productPrefix)(() => {}, getState);

    expect(postProductAppMock.mock.calls[0][2].external_advisor_id).toBe(98789);
  });
});
