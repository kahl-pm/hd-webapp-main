import { fromStrToNull } from '../utils/helpers';

// Fetch request middleware
const fetchWithFromStrToNullMiddleware = (url, options) => {
  const newOptions = options ? { ...options } : {};

  const isAbsoluteUrl = url.indexOf('http://') === 0 || url.indexOf('https://') === 0;
  // when deployed, we do set the url values of PM_HD_QUOTES_ENDPOINT,...
  // only their /api/v1/hd-quotess ... for http cookie work
  const isRelativeUrl = !isAbsoluteUrl;

  const localEnvShouldModify = url.includes('policyme.com') ||
  url.includes('127.0.0.1') ||
  url.includes('restapi') ||
  url.includes('localhost');

  const shouldModify = localEnvShouldModify || isRelativeUrl;

  if (shouldModify && newOptions.body) {
    newOptions.body = JSON.stringify(fromStrToNull(JSON.parse(newOptions.body)));
  }

  return [
    url,
    newOptions,
  ];
};
export default fetchWithFromStrToNullMiddleware;
