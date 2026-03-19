const { google } = require('googleapis');
const fetch = require('node-fetch');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const getCredentials = async (key_file) => {
  console.log('Downloading Service Account keyfile from AWS...');
  const client = new S3Client({ region: 'ca-central-1' });
  const command = new GetObjectCommand({
    Bucket: 'policyme-circleci-configs',
    Key: key_file,
    ResponseContentType: 'application/json',
  });
  const response = await client.send(command);
  const body = await response.Body.transformToString();
  return JSON.parse(body);
};

const withRetry = async (fn, retries = 3) => {
  let retried = 0;
  let lastError = null;
  while (retries - retried >= 0) {
    try {
      // No eslint, I do not wish to parallelise these async calls
      // eslint-disable-next-line no-await-in-loop
      return await fn();
    } catch (e) {
      console.log(`Failed after ${retried} retries with error ${e.message}`);
      lastError = e;
      retried++;
    }
  }
  throw lastError;
};

const getServiceAccount = async (portal_domain, key_file, tenant_id) => {
  console.log('Fetching restapi-internal tokens...');

  if (!portal_domain) {
    throw new Error('portalDomain not configured for Cypress env');
  }

  if (!key_file) {
    throw new Error('serviceAccountKeyfile not configured for Cypress env');
  }

  if (!tenant_id) {
    throw new Error('tenantId not configured for Cypress env');
  }

  // Download the keyfile from S3
  const credentials = await getCredentials(key_file);
  const { client_id, client_email } = credentials;
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/cloud-platform',
      'openid',
    ],
  });

  // Get an access token for the GCP service account
  const gcp_jwt_token = await auth.getAccessToken();
  const [access_token_response, id_token_response] = await Promise.all([
    // Get an access token for the portal
    withRetry(() => fetch(
      `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${client_email}:generateAccessToken`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gcp_jwt_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scope: ['openid'],
        }),
      },
    ).then(r => r.json())),
    // Get an id token for the portal
    withRetry(() => fetch(
      `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${client_email}:generateIdToken`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gcp_jwt_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audience: `${client_id}`,
          includeEmail: true,
          delegates: [],
        }),
      },
    ).then(r => r.json())),
  ]);
  const { accessToken } = access_token_response;
  const { token: idToken } = id_token_response;

  // Get an auth token from portal
  const portal_auth_response = await fetch(
    `${portal_domain}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-sa-email': client_email,
        'X-Tenant-Id': tenant_id,
      },
      body: JSON.stringify({
        access_token: accessToken,
        id_token: idToken,
      }),
    },
  );

  const { data: portalAuthToken } = await portal_auth_response.json();

  // Get a restapi access token from portal
  const portal_access_response = await fetch(
    `${portal_domain}/api/v1/auth/access`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-sa-email': client_email,
        'X-Tenant-Id': tenant_id,
        Authorization: `Bearer ${portalAuthToken}`,
      },
    },
  );
  const { data: portalAccessToken } = await portal_access_response.json();

  // Get permissions token for service account
  const permissions_response = await fetch(
    `${portal_domain}/api/v1/auth/permission`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-sa-email': client_email,
        'X-Tenant-Id': tenant_id,
        Authorization: `Bearer ${portalAccessToken}`,
      },
    },
  );
  const { data: permissionsToken } = await permissions_response.json();

  return {
    serviceAccountEmail: client_email,
    portalAccessToken,
    permissionsToken,
  };
};

module.exports = {
  getServiceAccount,
};
