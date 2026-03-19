import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Spacer, Progress, isMobile, Typography } from '@policyme/global-libjs-designsystem';
import { ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { useTheme } from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';
import { isDigitalConsentJourney } from '../../Selectors/userControl';
import { convertRemToPx } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, ProductType, STRIPE_WALLETS } from '../../utils/const';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { State } from '../../store/types/State';
import { SetupFormCardComponentProps } from '../StripeSinglePagePayments/StripeSetupFormCardComponent';
import PaymentLoadingLanguage from '../StripeSetupForm/PaymentLoadingLanguage';
import PaymentConsentLanguage from '../StripeSetupForm/PaymentConsentLanguage';
import { getTenantBasedFormattedText } from '../../tenant/helpers';

export interface AGPSetupFormCardComponentProps extends SetupFormCardComponentProps {
  wallet: STRIPE_WALLETS;
  setIsAcknowledged: (arg0: boolean) => void;
  isAcknowledged: boolean;
  showError: boolean;
  handleClose: () => void;
  handleClick: (event: any) => void;
}

const CopyOfStripeProvideCardInfo = () => {
  // the only reason we add this to AGP is because Stripe automatically adds it
  // to the page for CC payments. We're just manually replicating what stripe
  // renders for credit card
  const intl = useIntl();
  const provideInfoName = getTenantBasedFormattedText(intl, 'provide_Info');
  return <Typography
    variant="body3"
    message={
      <FormattedMessage
        id="tenant.ProvideCardInfo.abs92L"
        values={{
          tenantName: provideInfoName,
        }}
      />
    }
  />;
};
const AGPSetupFormCardComponent = ({
  userType,
  isAfterSellCI,
  isLoadingButton,
  handleSubmit,
  stripe,
  totalAmtDiscountedDisplay,
  totalAmtFinalDisplay,
  wallet,
  setIsAcknowledged,
  isAcknowledged,
  showError,
  handleClose,
  handleClick,
}: AGPSetupFormCardComponentProps) => {
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);

  useEffect(() => {
    stripe && setIsLoadingComponent(false);
  }, [stripe]);

  const mainProduct = useSelector<State, ProductType>(state => getMainProduct(state, userType));
  const theme = useTheme();
  const isHD = mainProduct === PM_PRODUCT_PREFIX.HD;
  const isDigitalConsent = useSelector<State, boolean>(state => isDigitalConsentJourney(state));

  const showPaymentForm = true;

  const isMobileUser = isMobile();
  const getButtonHeight = useMemo(() => {
    const remString = isMobileUser ?
      theme.buttonCTA.minHeightMobile : theme.buttonCTA.minHeightDesktop;
    let px = convertRemToPx(remString);
    // truncating logic is due to stripe having restrictions on button heights:
    // https://docs.stripe.com/js/elements_object/create_express_checkout_element#express_checkout_element_create-options-buttonHeight
    if (px < 40) return 40;
    if (px > 55) return 55;
    return px;
  }, [theme, isMobileUser]);

  return (
    <>
      {isLoadingButton && (
        <PaymentLoadingLanguage
          isDigitalConsent={isDigitalConsent}
          isHD={isHD}
        />
      )}
      {showPaymentForm && <>
        <div style={{ padding: '0 0.5rem' }} data-cy="AGP-payment-form-container">
          <CopyOfStripeProvideCardInfo />
          <Spacer size="spaceMedium" />
          <PaymentConsentLanguage
            userType={userType}
            isAfterSellCI={isAfterSellCI}
            totalAmtDiscountedDisplay={totalAmtDiscountedDisplay}
            totalAmtFinalDisplay={totalAmtFinalDisplay}
            setIsAcknowledged={setIsAcknowledged}
            isAcknowledged={isAcknowledged}
            showError={showError}
          />
          <Spacer size="spaceXS" />
          <ExpressCheckoutElement
            options={{
              buttonType: { applePay: 'check-out', googlePay: 'checkout' },
              layout: { maxColumns: 2, maxRows: 1, overflow: 'auto' },
              paymentMethodOrder: [wallet],
              wallets: { [wallet]: 'always', [wallet === 'googlePay' ? 'applePay' : 'googlePay']: 'never' },
              buttonHeight: getButtonHeight,
            }}
            onConfirm={handleSubmit}
            onCancel={handleClose}
            onClick={handleClick}
          />
        </div>
        <Progress name="PaymentSpinner" show={isLoadingComponent} />
      </>}
    </>
  );
};

export default AGPSetupFormCardComponent;
