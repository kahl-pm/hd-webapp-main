import ReduxState from '../ReduxStateMother';
import * as constants from '../../src/utils/const';
import {
  isPartnerSameAddress,
  isPartnerSameTrustee,
  isPartnerSameInterviewTime,
} from '../../src/Selectors/jointMetadata';
import { STATES_ENUM } from '../ReduxStateMother/const';

describe.each([
  [STATES_ENUM.DEFAULT],
  [STATES_ENUM.DEV_INIT],
  [STATES_ENUM.JOINT],
])('jointMetadata with state strategy %s', (stateStrategy) => {
  let stateObj1;
  beforeEach(() => {
    stateObj1 = new ReduxState(stateStrategy);
  });

  describe('isPartnerSameAddress', () => {
    test('The user_partner_same_address_flag is set to Y and should return true', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_address_flag', 'Y');
      expect(isPartnerSameAddress(stateObj1)).toEqual(true);
    });

    test('The user_partner_same_address_flag is set to N and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_address_flag', 'N');
      expect(isPartnerSameAddress(stateObj1)).toEqual(false);
    });

    test('The user_partner_same_address_flag is empty and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_address_flag', '');
      expect(isPartnerSameAddress(stateObj1)).toEqual(false);
    });
  });

  describe('isPartnerSameTrustee', () => {
    test('The user_partner_same_trustee is set to true and should return true', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_trustee', true);
      expect(isPartnerSameTrustee(stateObj1)).toEqual(true);
    });

    test('The user_partner_same_trustee is set to false and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_trustee', false);
      expect(isPartnerSameTrustee(stateObj1)).toEqual(false);
    });

    test('The user_partner_same_trustee is empty and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_trustee', undefined);
      expect(isPartnerSameTrustee(stateObj1)).toEqual(undefined);
    });
  });

  describe('isPartnerSameInterviewTime', () => {
    test('The user_partner_same_interview is set to true and should return true', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_interview', true);
      expect(isPartnerSameInterviewTime(stateObj1)).toEqual(true);
    });

    test('The user_partner_same_interview is set to N and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_interview', false);
      expect(isPartnerSameInterviewTime(stateObj1)).toEqual(false);
    });

    test('The user_partner_same_interview is empty and should return false', () => {
      stateObj1.jointMetadata.setJointMetadataProp('user_partner_same_interview', undefined);
      expect(isPartnerSameInterviewTime(stateObj1)).toEqual(undefined);
    });
  });
});
