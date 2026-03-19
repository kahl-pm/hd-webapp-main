import enKeys from '../../lang/legal_en_CA.json';
import expectedEnKeys from './expected_en_CA.json';
import frKeys from '../../lang/legal_fr_CA.json';
import expectedFrKeys from './expected_fr_CA.json';

describe('Legal Content (en_CA)', () => {
  const legalContent = enKeys;
  const expectedContent = expectedEnKeys;

  for (const key in legalContent) {
    it(`should have the correct ${key}`, () => {
      const expectedValue = expectedContent[key];
      expect(expectedValue).toBe(legalContent[key]);
    });
  }

  it('should have the same number of keys', () => {
    expect(Object.keys(legalContent).length).toBe(Object.keys(expectedContent).length);
  });
});

describe('Legal Content (fr_CA)', () => {
  const legalContent = frKeys;
  const expectedContent = expectedFrKeys;

  for (const key in legalContent) {
    it(`should have the correct ${key}`, () => {
      const expectedValue = expectedContent[key];
      expect(expectedValue).toBe(legalContent[key]);
    });
  }

  it('should have the same number of keys', () => {
    expect(Object.keys(legalContent).length).toBe(Object.keys(expectedContent).length);
  });
});
