/*
For component tests to handle components with lottie
https://robertmarshall.dev/blog/react-jest-tests-failing-using-lottie-js-solved/
*/
import 'jest-canvas-mock';

import { TENANTS } from '@policyme/global-libjs-utils';
/*
Inject unflagged PolicyMe tenant into the scope for all tests
If you need to test a different tenant, override this in your test
Overrides will be reset after each test
*/
const PM = TENANTS.PM;
global.beforeEach(() => {
  global.__policyme = {
    TENANT: {
      id: PM.id,
      name: PM.name,
      code: PM.code,
      suborg: null,
      defaultCICoverage: PM.defaultCICoverage,
    },
    THEME: PM.theme,
    URLS: {
      homepage: 'https://www.policyme.com',
      accounts: 'https://accounts.policyme.com',
    },
    FLAGS: {
      // TODO: EMPTY FOR NOW
    },
  };
});

/*
Uncomment if needed for future tests
https://testing-library.com/docs/example-react-intl
const hasFullICU = () => {
  // That's the recommended way to test for ICU support according to Node.js docs
  try {
    const january = new Date(9e8);
    const fr = new Intl.DateTimeFormat('fr-CA', { month: 'long' });
    return fr.format(january) === 'janvier';
  } catch (err) {
    return false;
  }
};

export const setupTests = () => {
  if (hasFullICU()) {
    Intl.NumberFormat.format = new Intl.NumberFormat('fr-CA').format;
    Intl.DateTimeFormat.format = new Intl.DateTimeFormat('fr-CA').format;
  } else {
    // global.Intl = IntlPolyfill
  }
};
*/
