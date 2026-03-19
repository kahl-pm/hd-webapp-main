/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

// import fs from 'fs-extra';
// import path from 'path';
import { writeFileSync, readFileSync } from 'fs';

const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');
const _ = require('lodash');
const webpackPreprocessor = require('@cypress/webpack-preprocessor');
// eslint-disable-next-line import/no-extraneous-dependencies
const { createHtmlReport } = require('axe-html-reporter');
const webpackOptions = require('../webpack.config');
const awsHelper = require('../../server/aws_helper');
const { getServiceAccount } = require('./serviceAccount');

async function getConfigurations(env, abTestBand, jiraTicket, tenantCode) {
  const validEnvs = new Set([
    'ondemand',
    'ondemand-docker',
    'local',
    'local-test',
    'local-dev',
    'dev',
    'dev-docker',
    'prod',
    'test',
    'partiale2e',
  ]);

  if (!validEnvs.has(env)) {
    throw new Error('Unable to find configuration for environment:', env);
  }

  if (_.isEmpty(tenantCode)) {
    throw new Error('tenant code is required for ondemand environment');
  }

  if (env === 'ondemand' || env === 'ondemand-docker') {
    if (_.isEmpty(jiraTicket)) {
      throw new Error('Jira ticket is required for ondemand environment');
    }
    jiraTicket = jiraTicket.toLowerCase();
  }

  let configObj = {
    env: {},
  };
  let cypressConfig = {};

  try {
    let filename = `cypress.${tenantCode}.${env}.env.json`;
    const pathToConfigFile = path.resolve('./', 'cypress', 'config', filename);
    console.log(`Reading config file: ${pathToConfigFile}`);
    cypressConfig = await fs.readJson(pathToConfigFile);
  } catch (err) {
    console.error(`Unable to get config JSON: ${pathToConfigFile}`);
    throw new Error(err);
  }

  for (const [envKey, envConfig] of Object.entries(cypressConfig.env)) {
    if (envConfig.type === 'url' && 'fallback_url' in envConfig && 'health_check_url' in envConfig) {
      let health_check_url = envConfig.health_check_url;

      if (env === 'ondemand' || env === 'ondemand-docker' || env === 'partiale2e') {
        health_check_url = health_check_url.replace('<jira-ticket>', jiraTicket);
      }

      console.log(`Checking if ${health_check_url} is accessible`);
      try {
        const response = await fetch(health_check_url, { method: 'HEAD' });

        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
          envConfig.value = envConfig.fallback_url;
        }
      } catch (err) {
        console.error(err);
        console.error(`Unable to access ${health_check_url}`);
        envConfig.value = envConfig.fallback_url;
      }
    }

    if (env === 'ondemand' || env === 'ondemand-docker' || env === 'partiale2e') {
      envConfig.value = envConfig.value.replace('<jira-ticket>', jiraTicket);
    }
    configObj.env[envKey] = envConfig.value;
  }

  if (configObj === null) {
    throw new Error('Unable to find configuration for environment:', env);
  }

  try {
    // Loading env vars from AWS Secrets Manager
    console.log('Fetching secrets');
    try {
    await awsHelper.fetchSecrets();
    } catch (err) {
      console.error('Unable to fetch secrets from AWS Secrets Manager:', err);
      console.log('Continuing with empty secrets since this is most likely on ondemand creation');
    }
    // Store integration test key in env
    configObj.env.CLIENT_INTEGRATION_TEST_KEY = process.env.CLIENT_INTEGRATION_TEST_KEY;
    // Inject access/permissions tokens so that Cypress can make restapi-internal calls
    try {
      const {
        portalAccessToken,
        permissionsToken,
        serviceAccountEmail,
      } = await getServiceAccount(
        configObj.env.portalDomain,
        configObj.env.serviceAccountKeyfile,
        configObj.env.tenantId,
      );
      configObj.env.portalAccessToken = portalAccessToken;
      configObj.env.permissionsToken = permissionsToken;
      configObj.env.serviceAccountEmail = serviceAccountEmail;
    } catch (err) {
      console.log('Unable to get service account credentials:', err);
    }

    let configWithAB = {
      env: {
        ...configObj.env,
        abTestBand: abTestBand || 'control',
      },
    };

    console.log('Cypress is running with below config:');
    console.log(JSON.stringify(configWithAB, null, 2));

    return configWithAB;
  } catch (err) {
    console.log('Unable to create configuration for environment:', env);
    throw new Error(err);
  }
}

module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
    logA11yTestResult({ testName, violations }) {
      createHtmlReport({
        results: { violations },
        options: {
          outputDir: 'axe-reports',
          reportFileName: `${testName}-a11y-report.html`,
        },
      });

      return null;
    },
  });
  // https://www.bigbinary.com/blog/how-we-fixed-the-cypress-out-of-memory-error-in-chromium-browsers
  on("before:browser:launch", (browser, launchOptions) => {
    if (["chrome", "edge"].includes(browser.name)) {
      if (browser.isHeadless) {
        launchOptions.args.push("--no-sandbox");
        launchOptions.args.push("--disable-gl-drawing-for-tests");
        launchOptions.args.push("--disable-gpu");
      }
      launchOptions.args.push("--js-flags=--max-old-space-size=31640");
    }
    return launchOptions;
  });
  on('file:preprocessor', webpackPreprocessor({
    webpackOptions,
    watchOptions: {},
  }));
  // if we try and fail to read from a file there doesn't seem to be a way to catch
  // the thrown exception, thus we need to check before reading
  try {
    return getConfigurations(
      config.env.CYPRESS_ENV,
      config.env.ABTESTBAND,
      config.env.JIRA_TICKET,
      config.env.TENANT_CODE,
    );
  } catch (err) {
    console.error(err);
  }

  console.log(
    '\n\n\n\nFAILED TO FIND CONFIGURATION FOR ENVIRONMENT',
    config.env.CYPRESS_ENV,
    ': using dev instead\n\n\n\n\n',
  );
  return getConfigurations('dev');
  // // throw a error if unable to match the environment
  // throw new Error('Unable to find environment file');
};
