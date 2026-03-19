import React, { memo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Checkbox, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { Customisable } from '../../Customisation';
import NotImplementedDefaultExceptionThrower from '../../NotImplementedDefaultExceptionThrower';
import { ProductType } from '../../../utils/const';

// Stripe payment form footer consent versioned key
export type CheckoutConsentBodyValuesProps = {
  br: React.ReactNode;
  b: (chunks: React.ReactNode) => React.ReactNode;
  span1: (msg: React.ReactNode) => React.ReactNode;
  p: (msg: React.ReactNode) => React.ReactNode;
  planType: string,
  totalAmtDiscountedDisplay: string,
}

export const ContentSectionOption = {
  BODY: 'body',
  CHECKBOX: 'checkbox',
} as const;
export type ContentSectionType = typeof ContentSectionOption[keyof typeof ContentSectionOption];

type CheckoutConsentTextProps = {
  mainProduct: ProductType;
  lifeOrCiConsentVersion: string;
  values: CheckoutConsentBodyValuesProps;
  action: React.Dispatch<React.SetStateAction<boolean>>;
  checked: boolean;
  showError?: boolean;
}

export const CheckoutConsentText = (props:CheckoutConsentTextProps | {}) => (
  <NotImplementedDefaultExceptionThrower />
);

// We are using memoization to prevent rerendering on form state change
// details can be found in https://github.com/policyme/life-webapp-main/pull/7659#issue-2324107775
export const CustomisableCheckoutConsentBody = memo(Customisable(CheckoutConsentText),
  (prevProps: CheckoutConsentTextProps, nextProps: CheckoutConsentTextProps) => {
    return prevProps.mainProduct === nextProps.mainProduct &&
      prevProps.lifeOrCiConsentVersion === nextProps.lifeOrCiConsentVersion &&
      prevProps.values.planType === nextProps.values.planType &&
      prevProps.values.totalAmtDiscountedDisplay === nextProps.values.totalAmtDiscountedDisplay &&
      prevProps.checked === nextProps.checked &&
      prevProps.showError === nextProps.showError;
  });

// Checkout consent CTA versioned key
export const CHECKOUT_CONSENT_CTA = defineMessages({
  '1.0.0': {
    id: 'checkoutConsentCTA.jBrvnM.v1.0.0',
  },
  '2.0.0': {
    id: 'checkoutConsentCTA.jBrvnM.v2.0.0',
  },
});

// shared UI used for all tenant components
export const InternalCheckoutConsentFrame = ({
  bodyText,
  checkboxText,
  props,
}) => {
  const intl = useIntl();
  return (
    <div data-cy="consent-block">
      {bodyText}
      <Spacer size="spaceMedium" />
      <Checkbox
        dataCy="consent-block"
        required
        name="payment-acknowledgement"
        label={<Typography message={checkboxText} variant="body3" component="span" />}
        errorMessage={intl.formatMessage({
          id: 'global.selectCheckbox.at1v2a',
        })}
        error={props.showError && !props.checked}
        checked={props.checked}
        onChange={() => props.action((prevChecked) => !prevChecked)}
      />
    </div>
  );
};
