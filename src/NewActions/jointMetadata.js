export function updateJointMetadata(property, value) {
  return {
    type: '@@jointMetadata/update',
    property,
    value,
  };
}

export function reInitJointMetadata() {
  return {
    type: '@@jointMetadata/reinit',
  };
}

// No-op: beneficiary logic removed for HD-only flow
export function initializeJointSecondaryBeneficiaries(value) {
  return (dispatch) => {
    // No-op for HD-only flow
  };
}
