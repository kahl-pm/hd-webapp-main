import { CAA_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';
import {
  UNDERWRITING_METHODS,
  PRESCRIPTION_DRUG_FLAG,
  TWO_FACTOR_FLOW,
} from '../../src/utils/const';

describe('Product fields constants', () => {
  test('hd consts should have the correct plan types', () => {
    const expectedLength = 4;
    const expectedKeys = ['ESSENTIAL', 'STANDARD', 'ENHANCED', 'DENTAL_SECURE'];
    const expectedValues = ['essential', 'standard', 'enhanced', 'dental_secure'];
    expect(Object.keys(CAA_HD_PLAN_TYPES).length).toEqual(expectedLength);
    expect(Object.keys(CAA_HD_PLAN_TYPES)).toEqual(expectedKeys);
    expect(Object.values(CAA_HD_PLAN_TYPES)).toEqual(expectedValues);
  });
  test('product consts should have the underwriting methods', () => {
    const expectedCount = 3;
    const expectedKeys = ['GUARANTEED_ISSUE', 'FULLY_UNDERWRITTEN', 'PORTABLE_COVERAGE'];
    const expectedValues = ['guaranteed_issue', 'fully_underwritten', 'portable_coverage'];
    expect(Object.keys(UNDERWRITING_METHODS).length).toEqual(expectedCount);
    expect(Object.keys(UNDERWRITING_METHODS)).toEqual(expectedKeys);
    expect(Object.values(UNDERWRITING_METHODS)).toEqual(expectedValues);
  });
});

describe('Prescription Drug Flag fields constants', () => {
  test('Prescription flag should have the correct values for UI selection', () => {
    const expectedLength = 4;
    const expectedKeys = ['NEITHER', 'PRIMARY_ONLY', 'SECONDARY_ONLY', 'BOTH'];
    const expectedValues = ['neither', 'primary_only', 'secondary_only', 'both'];
    expect(Object.keys(PRESCRIPTION_DRUG_FLAG).length).toEqual(expectedLength);
    expect(Object.keys(PRESCRIPTION_DRUG_FLAG)).toEqual(expectedKeys);
    expect(Object.values(PRESCRIPTION_DRUG_FLAG)).toEqual(expectedValues);
  });
});

describe('Two Factor Flow fields constants', () => {
  test('Two Factor Flow should have the correct keys and values', () => {
    const expectedLength = 4;
    const expectedKeys = ['SHOW_OTP_PAGE', 'SHOW_PHONE_PAGE', 'SHOW_CREATE_ACCOUNT_PAGE', 'SHOW_DASHBOARD_PAGE'];
    const expectedValues = ['Show otp page', 'Show phone page', 'Show create account page', 'Show dashboard page'];
    expect(Object.keys(TWO_FACTOR_FLOW).length).toEqual(expectedLength);
    expect(Object.keys(TWO_FACTOR_FLOW)).toEqual(expectedKeys);
    expect(Object.values(TWO_FACTOR_FLOW)).toEqual(expectedValues);
  });
});
