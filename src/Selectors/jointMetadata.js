const isPartnerSameAddress = (state) => {
  return state.jointMetadata.user_partner_same_address_flag === 'Y';
};

const isPartnerSameTrustee = (state) => {
  return state.jointMetadata.user_partner_same_trustee;
};

const isPartnerSameInterviewTime = (state) => {
  return state.jointMetadata.user_partner_same_interview;
};

export {
  isPartnerSameAddress,
  isPartnerSameInterviewTime,
  isPartnerSameTrustee,
};
