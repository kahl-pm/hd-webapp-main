import React from 'react';
import { CustomiseOverrideComponent } from '../../../components/Customisation';
import { CheckoutConsentText } from '../../../components/DigitalConsentHtmlComponents/CheckoutConsent';

// HD-only webapp: Life/CI checkout consent messages removed
// HD checkout consent is not used through this override pattern

const CheckoutConsentTextOverride = (_props) => {
  return null;
};

export default CustomiseOverrideComponent(CheckoutConsentText, CheckoutConsentTextOverride);
