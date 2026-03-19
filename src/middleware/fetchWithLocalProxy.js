import { sentryWarning } from '@policyme/global-libjs-utils';

// Fetch request middleware to forward all requests to localhost proxy so that
// we can set httponly cookies in the browser. This is useful for local development.

function getHostFromUrl(fetchUrl) {
  try {
    // If it's a relative URL (e.g., "/api/foo"), resolve it relative to current origin
    const absoluteUrl = new URL(fetchUrl, window.location.origin);
    return absoluteUrl.host; // includes hostname and port
  } catch (err) {
    console.error('Invalid URL:', fetchUrl);
    return null;
  }
}

function replaceHostWithLocalhostProxy(url) {
  try {
    const parsed = new URL(url, window.location.origin); // handles relative & absolute
    parsed.host = 'localhost:3000'; // replaces both hostname and port
    parsed.protocol = 'http'; // ensure it's http
    return parsed.toString();
  } catch (err) {
    console.error('Invalid URL:', url);
    return url;
  }
}

const fetchWithLocalProxyMiddleware = (url, options) => {
  if (!url.includes('/api/')) {
    // Skip for local proxy
    return [url, options];
  }
  try {
    const existingOptions = options ?? {};
    const existingHeaders = existingOptions.headers ?? {};

    const urlHost = getHostFromUrl(url);
    const hostHeader = {
      'X-target-host': urlHost,
    };

    const proxyUrl = replaceHostWithLocalhostProxy(url);
    console.log('fetchWithLocalProxyMiddleware', proxyUrl, url, hostHeader, existingHeaders);
    return [
      proxyUrl,
      {
        ...existingOptions,
        headers: {
          ...existingHeaders,
          ...hostHeader,
        },
      },
    ];
  } catch (error) {
    sentryWarning('Error forwarding to localproxy middleware', error);
    return [url, options];
  }
};
export default fetchWithLocalProxyMiddleware;
