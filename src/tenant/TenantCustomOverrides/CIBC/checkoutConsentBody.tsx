import React from 'react';
import { CustomiseOverrideComponent } from '../../../components/Customisation';
import { CheckoutConsentText } from '../../../components/DigitalConsentHtmlComponents/CheckoutConsent';

// HD-only webapp: Life/CI checkout consent messages removed

const CheckoutConsentTextOverride = (_props) => {
  return null;
};

export default CustomiseOverrideComponent(CheckoutConsentText, CheckoutConsentTextOverride);
