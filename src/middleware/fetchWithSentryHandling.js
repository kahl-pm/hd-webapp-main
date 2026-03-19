import { sentryError, segmentTrackEvent, TENANT_FLAGS, hasFlag } from '@policyme/global-libjs-utils';

// Fetch response middleware
const fetchWithSentryHandlingMiddleware = (response) => {
  if (!response.ok && response.status === 403) {
    // 403 error handling
    const err = new Error('Request blocked by WAF');
    sentryError(err, { extras: { input: response.url } });
    if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
      // TODO: use correct error source
      const errSource = response.url;
      segmentTrackEvent('error', { errorType: response.status, errorDetails: response.statusText, errorSource: errSource });
    }
    return Promise.reject(err);
  }

  return response;
};
export default fetchWithSentryHandlingMiddleware;
