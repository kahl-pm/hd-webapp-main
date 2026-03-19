import { snakeToCamelCase } from '../utils/helpers';

// Fetch response middleware
const fetchWithCaseConverterMiddleware = (response) => {
  // response interceptor
  // Cloning the repsponse to be able to modify it's body and can still be reread.
  // https://stackoverflow.com/a/64961272
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/clone
  const json = () => response
    .clone() // response can only be consumed once so it needs to be cloned
    .json()
    .then((data) => ({ ...snakeToCamelCase(data) }));

  // eslint-disable-next-line no-param-reassign
  response.json = json;
  return response;
};
export default fetchWithCaseConverterMiddleware;
