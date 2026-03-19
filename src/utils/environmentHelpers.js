/*
This is method to can supply the environment variables set in the AWS EB (ElasticbeakStalk)
and AWS SM (Secret Manager). Variables from AWS SM are loaded during the build process which
executes on CircleCI and AWS EB variables are loaded during the bootstraping of the application via
injection in file server/environment.js.

Upadting variables in AWS SM needs a rebuild to take effect. While updating variables
in AWS EB does not requires only a restart of the application.

Variables set in AWS EB always have precedence over variables set in AWS SM.
*/
export const getFromEnvironment = (key) => {
  if (!process.env.BROWSER || window === undefined) {
    return process.env[key];
  }

  const runtime_variables = window.ENVIRONMENT_VARIABLES;

  if (runtime_variables !== undefined &&
    runtime_variables[key] !== undefined) {
    return runtime_variables[key];
  }

  /* We added this switch case because
  process.env.PM_ACCOUNTS_ENDPOINT and process.env[key] are not the same
  */
  switch (key) {
    case 'PM_ACCOUNTS_ENDPOINT':
      return process.env.PM_ACCOUNTS_ENDPOINT;
    case 'PM_DEMO_ENV':
      return process.env.PM_DEMO_ENV;
    case 'PM_INTERNAL_ENDPOINT':
      return process.env.PM_INTERNAL_ENDPOINT;
    case 'PM_HD_MAIN_ENDPOINT':
      return process.env.PM_HD_MAIN_ENDPOINT;
    case 'PM_HD_QUOTES_ENDPOINT':
      return process.env.PM_HD_QUOTES_ENDPOINT;
    case 'PM_GLOBAL_MAIN_ENDPOINT':
      return process.env.PM_GLOBAL_MAIN_ENDPOINT;
    case 'PM_AURA_ENDPOINT':
      return process.env.PM_AURA_ENDPOINT;
    case 'PM_DOCUSIGN_ENDPOINT':
      return process.env.PM_DOCUSIGN_ENDPOINT;
    case 'PM_ANALYTICS_ENDPOINT':
      return process.env.PM_ANALYTICS_ENDPOINT;
    case 'PM_PAYMENTS_ENDPOINT':
      return process.env.PM_PAYMENTS_ENDPOINT;
    case 'PM_HBM_ENDPOINT':
      return process.env.PM_HBM_ENDPOINT;
    case 'PM_DOCUMENTS_ENDPOINT':
      return process.env.PM_DOCUMENTS_ENDPOINT;
    case 'PM_ENVIRONMENT':
      return process.env.PM_ENVIRONMENT;
    case 'SENTRY_DSK':
      return process.env.SENTRY_DSK;
    case 'PM_WEBAPP_ACCOUNT_URL':
      return process.env.PM_WEBAPP_ACCOUNT_URL;
    case 'PM_JIRA_REDIRECT_URL':
      return process.env.PM_JIRA_REDIRECT_URL;
    case 'PM_DEVOPS_ENDPOINT':
      return process.env.PM_DEVOPS_ENDPOINT;
    case 'PM_ENABLE_GROUP_HD_CAA':
      return process.env.PM_ENABLE_GROUP_HD_CAA;
    case 'PM_ENABLE_GROUP_TL_CI_CAA':
      return process.env.PM_ENABLE_GROUP_TL_CI_CAA;
    case 'PM_HD_MAIN_BASE_ENDPOINT':
      return process.env.PM_HD_MAIN_BASE_ENDPOINT;
    case 'PM_GLOBAL_MAIN_BASE_ENDPOINT':
      return process.env.PM_GLOBAL_MAIN_BASE_ENDPOINT;
    case 'PM_ACCOUNTS_BASE_ENDPOINT':
      return process.env.PM_ACCOUNTS_BASE_ENDPOINT;
    default:
      return process.env[key];
  }
};

/**
 * Sensitive env var keys are encoded in base64
 * @param key string
 * @returns base64 encoded string
 */
export const encodeEnvVar = (key) => {
  return btoa(key);
};
