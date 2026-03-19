/**
 * Standalone prebuild script for AWS Secrets Manager.
 *
 * Runs before `vite build` to fetch environment variables from
 * AWS Secrets Manager and set them as process.env vars so they
 * are available to Vite's `define` config.
 *
 * Usage: node server/aws_helper_prebuild.js
 */
const awsHelper = require('./aws_helper');

async function main() {
  try {
    console.log('Fetching AWS secrets before build...');
    await awsHelper.fetchSecrets();
    console.log('AWS secrets loaded successfully.');
  } catch (err) {
    console.error('Error fetching AWS secrets:', err);
    // Don't exit with error in local dev (no AWS credentials)
    if (process.env.CIRCLECI) {
      process.exit(1);
    }
    console.log('Continuing build without AWS secrets (local development).');
  }
}

main();
