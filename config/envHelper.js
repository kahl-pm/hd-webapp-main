/**
 * Build-time environment variable filtering for Vite's `define` option.
 * Extracted from the webpack configs (config/client.dev.js and config/client.prod.js).
 *
 * Replicates the getClientEnvironment() logic:
 * - Filters process.env for PM_*, SENTRY_*, CLIENT_* prefixes
 * - Blacklists SENTRY_AUTH_TOKEN, SENTRY_DEPLOY_TOKEN
 * - Base64-encodes keys containing _KEY, _SECRET, or _TOKEN
 * - Returns an object suitable for Vite's `define` config
 */

const PM_APP = /^PM_/i;
const SENTRY_APP = /^SENTRY_/i;
const CLIENT_VAR = /^CLIENT_/i;
const _KEY = /_KEY/;
const _SECRET = /_SECRET/;
const _TOKEN = /_TOKEN/;

const BLACKLISTED_ENV_VARS = new Set([
  'SENTRY_AUTH_TOKEN',
  'SENTRY_DEPLOY_TOKEN',
]);

function getClientEnvironment() {
  console.log('Loading', Object.keys(process.env).length, 'environment variables');

  const variableFilterMethod = (key) => {
    if (BLACKLISTED_ENV_VARS.has(key)) {
      return false;
    }
    return PM_APP.test(key) || SENTRY_APP.test(key) || CLIENT_VAR.test(key);
  };

  const raw = Object.keys(process.env)
    .filter(variableFilterMethod)
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'production',
      },
    );

  return raw;
}

/**
 * Builds a define map for Vite.
 * Each key becomes `process.env.XXX` and is replaced with its JSON-stringified value.
 *
 * Keys containing _KEY, _SECRET, or _TOKEN are SKIPPED from build-time define
 * because their base64-encoded names contain characters (like '=') that are
 * invalid in esbuild/Vite define keys, and these values are accessed via
 * computed property access (process.env[encodeEnvVar(...)]) which static
 * replacement can't handle anyway. These sensitive values are provided at
 * runtime via window.ENVIRONMENT_VARIABLES (server/environment.js).
 */
function buildEnvDefines() {
  const raw = getClientEnvironment();
  const defines = {};

  Object.keys(raw)
    .sort()
    .forEach((key) => {
      // Skip sensitive keys — they'll be available at runtime via ENVIRONMENT_VARIABLES
      if (_KEY.test(key) || _SECRET.test(key) || _TOKEN.test(key)) {
        return;
      }
      defines[`process.env.${key}`] = JSON.stringify(raw[key]);
    });

  return defines;
}

module.exports = { buildEnvDefines, getClientEnvironment };
