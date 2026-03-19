/**
 * Custom fetch interface with middleware support and automatic retry
 */
import { sentryError } from '@policyme/global-libjs-utils';
import { delayRequest } from './helpers';

// IMPORTANT: __INNER_FETCHER SHOULD NOT BE IMPORTED ANYWHERE FOR USE. IT'S ONLY PURPOSE
// OUTSIDE OF THIS MODULE IS TO BE IMPORTED IN FRONTEND JEST TESTS.
export const __INNER_FETCHER = {
  fetch: typeof window !== 'undefined' ? window.fetch?.bind(window) : () => {},
};

const NUM_RETRIES = 3;

async function retryFetch(url, fetchOptions, numRetries) {
  function onError(res) {
    const retriesLeft = numRetries - 1;
    if (!retriesLeft) {
      // return the response to let upstream handle the error
      return res;
    }
    return delayRequest(() => retryFetch(url, fetchOptions, retriesLeft));
  }
  try {
    const response = await __INNER_FETCHER.fetch(url, fetchOptions);
    if (!response.ok) {
      // log sentry error for status 504 before retry
      if (response.status === 504) {
        sentryError('Gateway timeout', { tags: { endpoint: `${url}` } });
      }
      return onError(response);
    }
    return response;
  } catch (e) {
    // handle network error or exceptions
    if (!numRetries) {
      throw e;
    }
    return delayRequest(() => retryFetch(url, fetchOptions, numRetries - 1));
  }
}

const requestMiddleware = [];
export const addRequestMiddleware = (middleware) => {
  requestMiddleware.push(middleware);
};

const responseMiddleware = [];
export const addResponseMiddleware = (middleware) => {
  responseMiddleware.push(middleware);
};

export const fetch = async (url, options) => {
  const [modifiedUrl, modifiedOptions] = requestMiddleware.reduce(
    (acc, middleware) => middleware(acc[0], acc[1]),
    [url, options],
  );

  /**
   * The cookielaw domain does not expect these custom headers, and is not a part of our
   * network of services. Therefore, to avoid any CORS issues,
   * we skip this middleware to add custom headers.
   */
  // Check if the request is going to a cookielaw domain
  const isCookieLawRequest = typeof url === 'string' && url.includes('cdn.cookielaw');
  if (isCookieLawRequest) {
    return __INNER_FETCHER.fetch(url, modifiedOptions);
  }

  let response = await retryFetch(modifiedUrl, modifiedOptions, NUM_RETRIES);

  const modifiedResponse = responseMiddleware.reduce(
    (acc, middleware) => middleware(acc),
    response,
  );
  return modifiedResponse;
};
