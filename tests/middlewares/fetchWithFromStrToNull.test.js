import fetchWithFromStrToNullMiddleware from '../../src/middleware/fetchWithFromStrToNull';

describe('fetchWithFromStrToNullMiddleware', () => {
  describe('URL handling', () => {
    test('should not modify options for absolute URLs without matching patterns', () => {
      const url = 'https://example.com/api';
      const options = {
        body: JSON.stringify({ field: '' }),
      };
      const [resultUrl, resultOptions] = fetchWithFromStrToNullMiddleware(url, options);

      expect(resultUrl).toBe(url);
      expect(resultOptions).toEqual(options);
    });

    test('should modify options for policyme.com URLs', () => {
      const url = 'https://api.policyme.com/v1/endpoint';
      const options = {
        body: JSON.stringify({ field: '' }),
      };
      const [resultUrl, resultOptions] = fetchWithFromStrToNullMiddleware(url, options);
      expect(resultUrl).toBe(url);
      expect(JSON.parse(resultOptions.body)).toEqual({ field: null });
    });

    test('should modify options for localhost URLs', () => {
      const url = 'http://localhost:3000/api';
      const options = {
        body: JSON.stringify({ field: '' }),
      };
      const [resultUrl, resultOptions] = fetchWithFromStrToNullMiddleware(url, options);

      expect(resultUrl).toBe(url);
      expect(JSON.parse(resultOptions.body)).toEqual({ field: null });
    });

    test('should modify options for relative URLs', () => {
      const url = '/api/v1/endpoint';
      const options = {
        body: JSON.stringify({ field: '' }),
      };
      const [resultUrl, resultOptions] = fetchWithFromStrToNullMiddleware(url, options);

      expect(resultUrl).toBe(url);
      expect(JSON.parse(resultOptions.body)).toEqual({ field: null });
    });
  });
});
