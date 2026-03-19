const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { ElasticBeanstalkClient, DescribeConfigurationSettingsCommand } = require('@aws-sdk/client-elastic-beanstalk');

const AWS_REGION_CA_CENTRAL_1 = 'ca-central-1';
let PM_APP_NAME = 'life-webapp-main';
if (process.env.PM_APP_NAME !== undefined) {
  PM_APP_NAME = process.env.PM_APP_NAME;
}
const PULL_REQUEST_REGEX = /pull\/\d+/;

/**
 * Function to get pm_env for secret manager
 * @returns pm_env
 */
const getSecretsMgrEnv = () => {
  if (process.env.CIRCLECI) {
    if (PULL_REQUEST_REGEX.test(process.env.CIRCLE_BRANCH)){
      /**
       * Only deploy from pull request in case of hotfix
       */
      return "dev"
    }

    switch (process.env.CIRCLE_BRANCH) {
      case 'master':
        return 'prod';
      case 'develop':
        return 'dev';
      default:
        return 'test';
    }
  }

  const pmEnvRegex = /(prod|dev|test|eng\d{1,3}|pl\d{1,3})|local/;
  const engPlEnvRegex = /(eng\d{1,3}|pl\d{1,3})/;
  let pm_env = 'test';

  if (process.env.PM_ENV === undefined
      || process.env.PM_ENV.length === 0
      || process.env.PM_ENV === 'local'
      || process.env.PM_ENV === 'development'
  ) {
    console.log(`setting pm_env to test for local environment [pm_env=test]`);
    pm_env = 'test';
  } else if (process.env.PM_ENV !== undefined && process.env.PM_ENV.length > 0) {
  // set pm_env to test if it's pl or eng env
    pm_env = process.env.PM_ENV;

    if (!pmEnvRegex.test(pm_env)) throw new Error(`Invalid PM_ENV [pm_env=${pm_env}]`);

    if (engPlEnvRegex.test(pm_env)) {
      pm_env = 'test';
    }
  } else {
    throw new Error(`Invalid PM_ENV`);
  }

  console.log(`setting pm_env [pm_env=${pm_env}]`);
  return pm_env;
};

/*
* @param {String} secret_key
* @param {String} secret_value
* @returns
*/
const setEnvVars = (secret_key, secret_value) => {
  /**
   * check for env specific overrides
   * ex: PM_LIFE_RESTAPI_MAIN_URL__ENG1__ should override PM_LIFE_RESTAPI_MAIN_URL
   */
  const app_specific_override_regex = /.*__[A-Z0-9]*__$/;

  // set the environment variable if not set
  if (process.env.PM_ENV !== undefined
      && process.env.PM_ENV.length > 0
      && secret_key.search(app_specific_override_regex, secret_key) !== -1) {
    if (secret_key.endsWith(`__${process.env.PM_ENV.toUpperCase()}__`)) {
      console.log(`adding app specific override [PM_APP_NAME=${PM_APP_NAME}, pm_env=${process.env.PM_ENV}, env_key=${env_key}]`);
      const env_key_without_env_suffix = secret_key.replace(`__${process.env.PM_ENV.toUpperCase()}__`, '');

      // Below is to allow custom env vars already set at a application level
      // set env var name if env var is not yet defined
      if (process.env[env_key_without_env_suffix] !== undefined) {
        process.env[env_key_without_env_suffix] = secret_value;
        console.log(`replacing env_key_without_env_suffix in override [PM_APP_NAME=${PM_APP_NAME}, pm_env=${process.env.PM_ENV}, env_key=${env_key_without_env_suffix}]`);
      } else {
        console.log(`skipping [PM_APP_NAME=${PM_APP_NAME}, pm_env=${process.env.PM_ENV}, env_key=${env_key}]`);
      }
    }
  } else if (process.env[secret_key] === undefined) {
    // Below is to allow custom env vars already set at a application level
    // set env var name if env var is not yet defined
    process.env[secret_key] = secret_value;
    console.log(`adding & validating env variable [PM_APP_NAME=${PM_APP_NAME}, env_key=${secret_key}, env_value_exists=${process.env[secret_key] !== undefined}]`);
  } else {
    console.log(`skipping  [PM_APP_NAME=${PM_APP_NAME}, env_key=${secret_key}]`);
  }
};

const getSecretsFromSecretManager = async (region, secretId) => {
  const secretsManagerClient = new SecretsManagerClient({ region });
  const command = new GetSecretValueCommand({
    SecretId: secretId,
  });

  try {
    const data = await secretsManagerClient.send(command);
    if ('SecretString' in data) {
      const secretString = data.SecretString;
      const properties = JSON.parse(secretString);
      console.log('Fetched', Object.keys(properties).length, 'environment variables from SecretsManager');
      return properties;
    }
  } catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }

  return {};
};

const getEnvironmentVariablesFromElasticBeanstalk = async (app_name, environment_name) => {
  const elasticBeanstalkClient = new ElasticBeanstalkClient({ region: AWS_REGION_CA_CENTRAL_1 });

  const command = new DescribeConfigurationSettingsCommand({
    ApplicationName: app_name,
    EnvironmentName: `${app_name}-${environment_name}`.toLowerCase(),
  });

  try {
    const data = await elasticBeanstalkClient.send(command);
    const configurationSettings = data.ConfigurationSettings;
    // Process the configuration settings
    let environmentProperties = configurationSettings.map(setting => setting.OptionSettings);
    // Process the environment properties
    if (!environmentProperties || environmentProperties.length !== 1) {
      return [];
    }

    environmentProperties = environmentProperties[0].filter(setting => setting.Namespace === 'aws:elasticbeanstalk:application:environment');
    console.log('Fetched', environmentProperties.length, 'environment variables from ElasticBeanStack');

    return environmentProperties.reduce((properties, currentValue) => {
      properties[currentValue.OptionName] = currentValue.Value;
      return properties;
    }, {});
  } catch (error) {
    console.error('Error retrieving environment configuration:', error);
    throw error;
  }

  return {};
};

const isReleaseBranch = (branchName) => {
  const releaseBranchPattern = new RegExp('^release/[A-Z]{2,4}[0-9]?-[0-9]+(-[a-z0-9]+)+$');
  return branchName !== undefined && releaseBranchPattern.test(branchName);
};

const getJiraTicketNumberFromBranch = (branchName) => {
  let jira_ticket_parts = branchName.split('/');

  if (jira_ticket_parts.length < 2) {
    return null;
  }

  jira_ticket_parts = jira_ticket_parts[1].split('-');

  if (jira_ticket_parts.length < 2) {
    return null;
  }

  const team_jira_board = jira_ticket_parts[0];
  const issue_number = jira_ticket_parts[1];

  const jira_ticket_number = `${team_jira_board}-${issue_number}`;

  console.log('jira_ticket_number =', jira_ticket_number);
  return jira_ticket_number;
}

const getEnvironmentFromCircleBranch = (circleBranch) => {

  if (circleBranch === undefined || circleBranch === null) {
    return null
  }

  if (circleBranch === "master") {
    /**
     * July 24th 2023
     * We always deploy to prod-clone from cirlceci
     * hence we want to fetch the env vars from prod-clone instead and not prod
     */
    return "prod-clone";
  }

  /**
   * NP2 and WEB branches deploy to the shared test environment, not ondemands
   */
  if (circleBranch.includes("NP2-") || circleBranch.includes("WEB-")) {
    return "test";
  }

  if (isReleaseBranch(circleBranch)) {
    return getJiraTicketNumberFromBranch(circleBranch);
  }

  if (circleBranch === "develop") {
    return "dev";
  }

  if (isReleaseBranch(circleBranch)) {
    return getJiraTicketNumberFromBranch(circleBranch);
  }

  if (PULL_REQUEST_REGEX.test(circleBranch)) {
    /**
     *  July 31s 2023
     *  This is being added to support hotfix deployment worfklow
     *  details: https://policyme.atlassian.net/wiki/spaces/EN/pages/2654306308/Deploying+a+Hotfix+to+Dev+environment+101
     *  for hotfix, we want to defaul to dev since we want to deploy a hotfix to dev
     */
    return "dev";
  }

  return null;
};

/**
 * Fetch secrets from AWS Secrets Manager using contexts
 *
 * @param {Array} contexts
 * @returns
 */
const fetchSecrets = async () => {
  const pm_env = getSecretsMgrEnv();
  const context = `PM_LIFE_WEBAPP_MAIN_${pm_env.toUpperCase()}`;
  console.log(`fetching secrets for contexts [pm_env=${pm_env}, context=${context}]`);

  if (process.env.CIRCLECI) {
    const branchName = process.env.CIRCLE_BRANCH;
    const eb_environment = getEnvironmentFromCircleBranch(branchName);
    if (eb_environment === null) {
      /**
      * edge case throw error
      * reach out to devops-support on slack
      * */
      throw Error(`[Branch: ${branchName}] not supported for deployment, please reach out to @devops-support`);
    }

    environmentVariables = await getEnvironmentVariablesFromElasticBeanstalk("life-webapp-main", eb_environment);
    Object.entries(environmentVariables).forEach(([secret_key, secret_value]) => setEnvVars(secret_key, secret_value));
  }

  const secrets = await getSecretsFromSecretManager(AWS_REGION_CA_CENTRAL_1, context);
  Object.entries(secrets)
    .forEach(([secret_key, secret_value]) => setEnvVars(secret_key, secret_value));
};

module.exports = {
  fetchSecrets,
  isReleaseBranch,
  getJiraTicketNumberFromBranch,
  getSecretsMgrEnv,
  getEnvironmentFromCircleBranch
};
