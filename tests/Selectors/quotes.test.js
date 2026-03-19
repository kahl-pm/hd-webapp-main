import { getTenant, LOCALE, sentryError, TENANTS, test as testUtils } from '@policyme/global-libjs-utils';
import ReduxState from '../ReduxStateMother';
import {
  getFirstSignificantQuote,
  getHdComparePlansUrl,
} from '../../src/Selectors/quotes';
import { UNDERWRITING_METHODS } from '../../src/utils/const';
import { STATES_ENUM } from '../ReduxStateMother/const';

const PMConfig = TENANTS.PM;
const BMOIConfig = TENANTS.BMOI;
const CAAConfig = TENANTS.CAA;
const setTenant = testUtils.setTenant;
describe.each([
  [[
    { value: 0.01 },
    { value: 0.00 },
    { value: 100 },
  ], 0],
  [[
    { value: 1500.00 },
    { value: 0.00 },
    { value: 100 },
  ], 1],
  [[
    { value: 0 },
    { value: 0.00 },
    { value: 369.99 },
  ], 2],
])('getFirstSiginificantQuote returns quote with value > 0.01', (quoteBreakdown, index) => {
  const expected = [
    { value: 100 },
    { value: 1500.00 },
    { value: 369.99 },
  ];
  expect(getFirstSignificantQuote(quoteBreakdown)).toEqual(expected[index]);
});

jest.mock('@policyme/global-libjs-utils', () => ({
  ...jest.requireActual('@policyme/global-libjs-utils'),
  sentryError: jest.fn(),
}));

describe('getHdComparePlansUrl', () => {
  const oldConfig = getTenant();
  afterEach(() => {
    sentryError.mockReset();
  });
  afterAll(() => {
    setTenant(oldConfig);
  });
  test.each([
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE, PMConfig, LOCALE.EN_CA, 'https://localhost/documents/assets/hd/pm-hd-plan-comparison-chart-guaranteed-issue-en.pdf'],
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE, PMConfig, LOCALE.FR_CA, 'https://localhost/documents/assets/hd/pm-hd-comparaison-des-regimes-emission-garantie-fr.pdf'],
    [UNDERWRITING_METHODS.PORTABLE_COVERAGE, BMOIConfig, LOCALE.EN_CA, 'https://localhost/documents/assets/hd/pm-hd-plan-comparison-chart-protect-en.pdf'],
    [UNDERWRITING_METHODS.PORTABLE_COVERAGE, BMOIConfig, LOCALE.FR_CA, 'https://localhost/documents/assets/hd/pm-hd-comparaison-des-regimes-protege-fr.pdf'],
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN, CAAConfig, LOCALE.EN_CA, 'https://localhost/documents/Plan+Comparison+Chart+-+CAA+Health+and+Dental+Fully+Underwritten+Plans.pdf'],
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN, CAAConfig, LOCALE.FR_CA, 'https://localhost/documents/Comparaison+des+re%CC%81gimes+-+Re%CC%81gime+d%E2%80%99assurance+sante%CC%81+et+dentaire+CAA+a%CC%80+tarification+comple%CC%80te.pdf'],
  ])('Should return expected url for underwriting method of %s for tenant and locale', (underwriting_method, tenant, locale, expected_url) => {
    setTenant(tenant);
    const state = {
      primary: {
        hdApp: {
          underwriting_method,
        },
        household: {
          application_language: locale,
        },
      },
    };

    expect(getHdComparePlansUrl(state)).toEqual(expected_url);
    expect(sentryError).not.toHaveBeenCalled();
  });

  test('Should throw sentry error if no matching document found', () => {
    setTenant(PMConfig);
    const state = {
      primary: {
        hdApp: {
          underwriting_method: 'wrong_underwriting_method',
        },
        household: {
          application_language: LOCALE.EN_CA,
        },
      },
    };
    expect(getHdComparePlansUrl(state)).toEqual('https://localhost/');
    expect(sentryError).toHaveBeenCalledWith('getHdComparePlansUrl: No hd document URL found for PM wrong_underwriting_method en-CA');
  });
});
