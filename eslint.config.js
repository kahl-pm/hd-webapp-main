/**
 * ESLint flat config for life-webapp-main
 * Extends PolicyMe webapp base config and enables custom local rules.
 */
const { defineConfig } = require('eslint/config');
const webappBaseConfig = require('@policyme/global-libjs-utils/src/tools/webapp/BaseEslintConfig');

module.exports = defineConfig([
  { extends: [webappBaseConfig] },
  // Project hygiene ignores
  { ignores: ['.yalc/**', 'build/**', 'buildServer/**', 'coverage/**'] },
  // Enable policyme-local custom rules with desired severities/options
  {
    rules: {
      'policyme-local/noEmptyPromiseReject': 'error',
      'policyme-local/segment': 'error',
      'policyme-local/noDirectPricingState': [
        'error',
        {
          rootObjects: ['state', '_state'],
          blacklistedSuffixes: [
            'recmd_cov_amt',
            'override_amt',
            'max_eligible_coverage',
            'selected_quote_type',
          ],
          ignoreFiles: ['WithPricing'],
        },
      ],
      'policyme-local/noDefaultMessage': 'error',
    },
  },
]);
