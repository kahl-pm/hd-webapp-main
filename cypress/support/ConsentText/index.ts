import { LOCALE } from '@policyme/global-libjs-utils';
import { ExpectedConsentCopyValues, LOCALE_TYPE } from './types';

export const validateConsentCopy = (
  copy:JQuery<HTMLElement>|string,
  expected:ExpectedConsentCopyValues,
  lang:LOCALE_TYPE = LOCALE.EN_CA,
) => {
  if (typeof copy === 'string') {
    expect(expected.text[lang].length).to.equal(1);
    expect(copy.trim()).to.equal(expected.text[lang][0]);
  } else {
    expect(copy).to.have.length(expected.text[lang].length);
    expected.text[lang].forEach((text, index) => {
      expect(copy.eq(index).text().trim()).to.equal(text);
    });
  }
};
