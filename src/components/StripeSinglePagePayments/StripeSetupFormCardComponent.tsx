import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Form, Button, Spacer, Typography, Progress } from '@policyme/global-libjs-designsystem';
import { segmentTrackEvent, hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import { isDigitalConsentJourney } from '../../Selectors/userControl';
import { getShowPaymentForm } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, USER_TYPES, AUTHORIZATION_TYPE, ProductType, STRIPE_OPTIONS } from '../../utils/const';
import { getMainProduct, isAppOptedEmpty } from '../../Selectors/helpers/productApp';
import CardHolderName from '../StripeSetupForm/CardHolderName';
import { DEFAULT_CONSENT_VERSIONS } from '../../utils/consentVersion';
import { getTenantCode } from '../../tenant/helpers';
import { CHECKOUT_CONSENT_CTA } from '../DigitalConsentHtmlComponents/CheckoutConsent';
import PaymentSummary from '../PaymentSummary';
import { State } from '../../store/types/State';
import PaymentLoadingLanguage from '../StripeSetupForm/PaymentLoadingLanguage';
import PaymentConsentLanguage from '../StripeSetupForm/PaymentConsentLanguage';

export interface SetupFormCardComponentProps {
  userType: typeof USER_TYPES[keyof typeof USER_TYPES];
  isAfterSellCI: boolean;
  isLoadingButton: boolean;
  handleSubmit: (event: any) => Promise<any>;
  stripe: any;
  totalAmtDiscountedDisplay: string;
  totalAmtFinalDisplay: string;
  showPaymentSummary: boolean;
}

const SetupFormCardComponent = ({
  userType,
  isAfterSellCI,
  isLoadingButton,
  handleSubmit,
  stripe,
  totalAmtDiscountedDisplay,
  totalAmtFinalDisplay,
  showPaymentSummary,
}: SetupFormCardComponentProps) => {
  const intl = useIntl();
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const handleOnClick = () => {
    if (!hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
      segmentTrackEvent('Checkout Button Clicked', {});
    }
  };

  useEffect(() => {
    stripe && setIsLoadingComponent(false);
  }, [stripe]);

  const mainProduct = useSelector<State, ProductType>(state => getMainProduct(state, userType));
  const isHD = mainProduct === PM_PRODUCT_PREFIX.HD;
  const isDigitalConsent = useSelector<State, boolean>(state => isDigitalConsentJourney(state));
  const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][mainProduct];
  const lifeOrCiConsentVersion = consentVersions[AUTHORIZATION_TYPE.CHECKOUT_CONSENT];
  const isCiOptedEmpty = useSelector(state => isAppOptedEmpty(
    state,
    userType,
    PM_PRODUCT_PREFIX.CI,
  ));
  const ci_approved = false;

  const showPaymentForm = getShowPaymentForm(
    isDigitalConsent,
    mainProduct,
    ci_approved,
    isCiOptedEmpty,
  );

  const isCypressStripeForm =
    useSelector<State, boolean>(state => state.metadata.isCypressStripeForm);

  const debugOptions: StripePaymentElementOptions = { fields: { billingDetails: { address: { postalCode: 'never' } } } };
  return (
    <>
      {isLoadingButton && (
        <PaymentLoadingLanguage
          isDigitalConsent={isDigitalConsent}
          isHD={isHD}
        />
      )}
      {showPaymentSummary && <PaymentSummary userType={userType} />}
      {showPaymentForm && <>
        <Spacer size="spaceMedium" />
        <div style={{ padding: '0 0.5rem' }}>
          <Form
            name="paymentForm"
            dataCy="paymentForm form"
            onSubmit={async (event) => { await handleSubmit(event); }}
          >
            <CardHolderName userType={userType} />
            {/* Disable postal code field for Cypress tests, see
            https://policyme.atlassian.net/wiki/spaces/EN/pages/3184230401/Crowdsourcing+solutions+for+ITT+-+Stripe+Form+Bug */}
            {isCypressStripeForm
              ? (<PaymentElement options={debugOptions} />)
              : <PaymentElement options={STRIPE_OPTIONS} />}
            <Spacer size="spaceMedium" />
            <PaymentConsentLanguage
              userType={userType}
              isAfterSellCI={isAfterSellCI}
              totalAmtDiscountedDisplay={totalAmtDiscountedDisplay}
              totalAmtFinalDisplay={totalAmtFinalDisplay}
              setIsAcknowledged={setIsAcknowledged}
              isAcknowledged={isAcknowledged}
            />
            <Spacer size="spaceMedium" />
            <Button
              name="submit-payment"
              type="submit"
              dataCy="submit"
              className={`btn-primary wide ${isLoadingButton ? 'disabled' : ''}`}
              onClick={() => handleOnClick()}
              disabled={isLoadingButton}
            >
              <Typography
                variant="CTALargePrimary"
                message={
                  isDigitalConsent ? (
                    intl.formatMessage(
                      CHECKOUT_CONSENT_CTA[lifeOrCiConsentVersion],
                      {
                        totalPrice: totalAmtDiscountedDisplay,
                      },
                    )
                  ) : (
                    <FormattedMessage
                      id="paymentCard.checkoutCta.x6zNZH"
                      values={{
                        totalPrice: totalAmtDiscountedDisplay,
                      }}
                    />
                  )
                }
              />
            </Button>
          </Form>
        </div>
        <Progress name="PaymentSpinner" show={isLoadingComponent} />
      </>}
    </>
  );
};

export default SetupFormCardComponent;
