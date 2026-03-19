import { sentryWarning } from '@policyme/global-libjs-utils';
import store from '../store';

// Fetch request middleware to add the pathname to the request headers
// so that we can track the origin of the request in Sentry for BE systems
const fetchWithPathnameMiddleware = (url, options) => {
  try {
    const existingOptions = options ?? {};
    const existingHeaders = existingOptions.headers ?? {};

    const currentPath = store.getState().router.location.pathname;
    const pathnameHeader = {
      'X-policyme-pathname': currentPath,
    };

    return [
      url,
      {
        ...existingOptions,
        headers: {
          ...existingHeaders,
          ...pathnameHeader,
        },
      },
    ];
  } catch (error) {
    sentryWarning('Error adding pathname to headers:', error);
    return [url, options];
  }
};
export default fetchWithPathnameMiddleware;
