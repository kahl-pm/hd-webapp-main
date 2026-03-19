const { defineConfig } = require('cypress');
// const { cypressConfig } = require('@axe-core/watcher');
const webpackConfig = require('./cypress/webpack.config');

module.exports = defineConfig({
  projectId: 'mnrh5j',
  chromeWebSecurity: false,
  defaultCommandTimeout: 20000,

  // errno: -2,
  // code: 'ENOENT',
  // syscall: 'open',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      // You will need to npm install -d cypress-terminal-report in your branch
      // require('cypress-terminal-report/src/installLogsPrinter')(on, { printLogsToConsole: "always" });
      return require('./cypress/plugins/index.js')(on, config);
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: [
      'cypress/e2e/CypressPausingPoints/**/*',
      'cypress/e2e/utm.js',
    ],
    numTestsKeptInMemory: 1,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
  },
  retries: 0,
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
      webpackConfig,
    },
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    specPattern: 'cypress/component/**/*.{js,jsx,ts,tsx}',
    experimentalJustInTimeCompile: true,
  },
});

// module.exports = defineConfig(
//   cypressConfig({
//     projectId: 'mnrh5j',
//     chromeWebSecurity: false,
//     defaultCommandTimeout: 10000,
//     // errno: -2,
//     // code: 'ENOENT',
//     // syscall: 'open',
//     e2e: {
//     // We've imported your old cypress plugins here.
//     // You may want to clean this up later by importing these.
//       setupNodeEvents(on, config) {
//         return require('./cypress/plugins/index.js')(on, config);
//       },
//       specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
//       excludeSpecPattern: [
//         'cypress/e2e/CypressPausingPoints/**/*',
//         'cypress/e2e/utm.js',
//       ],

//     },
//     retries: 1,
//     component: {
//       devServer: {
//         framework: 'react',
//         bundler: 'webpack',
//         webpackConfig,
//       },
//       setupNodeEvents(on, config) {
//         return require('./cypress/plugins/index.js')(on, config);
//       },
//       specPattern: 'cypress/component/**/*.{js,jsx,ts,tsx}',
//     },
//     axe: {
//       apiKey: '5869e546-30cb-4c8c-a186-41e2796b0e69',
//     },
//   }),
// );
