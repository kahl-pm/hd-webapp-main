import React from 'react';
import { CustomiseOverrideComponent } from '../../../components/Customisation';
import { ConsentBody, ConsentBodyProps } from '../../../pages/application/Authorization';

// HD-only webapp: Life/CI consent body messages removed
// HD consent is handled directly in Authorization.tsx via CONSENT_BODY.hd

const ConsentBodyOverride = (
  _props: ConsentBodyProps,
) => {
  // HD consent is rendered directly in Authorization.tsx, not through this override
  return null;
};

export default CustomiseOverrideComponent(ConsentBody, ConsentBodyOverride);
