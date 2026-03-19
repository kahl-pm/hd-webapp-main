import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material';
import { Card, Typography, Spacer, MaxWidthContainer, PageContainer, Progress, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { useStripe } from '@stripe/react-stripe-js';
import { FormattedMessage } from 'react-intl';
import WithReviewsIO from '../components/HOC/WithReviewsIO';
import { onComponentLoad } from '../NewActions/session';
import DecisionPageDashboardHD from '../components/NewDecisionPage/DecisionPageDashboardHD';
import { getDecisionPageProps } from '../Selectors/decisionPage';
import StripePaymentCardFrame from '../components/StripeSinglePagePayments/StripePaymentCardFrame';
import { AURA_DECISION_TYPES, PM_PRODUCT_PREFIX, POLICIES_STATUS, JointUserType, ProductType } from '../utils/const';
import { isHDOptedIn } from '../Selectors/helpers/productApp';
import SpeakToExperts from '../components/SpeakToExperts';
import { State } from '../store/types/State';
import PaymentSummary from '../components/PaymentSummary';
import { PaymentsProvider } from '../providers/PaymentProvider';
import { useAppleGooglePay } from '../components/customHooks/useAppleGooglePay';
import StripePaymentElementOptionsCard from '../components/StripeSetupForm/StripePaymentOptionsCard';
import { Customisable } from '../components/Customisation';

const CustomisableDecisionDashboardHD = Customisable(DecisionPageDashboardHD);

const DigitalConsentPaymentSection = ({
  dashboardUser,
  mainProduct,
}: {
  dashboardUser: JointUserType;
  mainProduct: ProductType;
}) => {
  const stripe = useStripe();
  const { applePay, googlePay, paymentMethodsLoading } = useAppleGooglePay(stripe, mainProduct);
  const actualShowMultiplePaymentOptionsAvailable = googlePay || applePay;

  return (
    <>
      {/* Show the payment summary always for AGP
      since this the expected behaviour for AGP and show the
      payment summary if the methdos are laoding so the user
      can still review their subscription details while we load in the payment methods */}
      {(paymentMethodsLoading || actualShowMultiplePaymentOptionsAvailable) && (
        <>
          <Card
            cardVariant="empty"
            dense
            body={<PaymentSummary userType={dashboardUser} />}
          />
          <Spacer size="spaceMedium" />
        </>
      )}
      {/* Show a loader over top of the payment flow
      until we resolve whether AGP is available or not */}
      {paymentMethodsLoading && (
        <UniformSpacingLayout alignItems="center" gap="0.5rem">
          <Progress name="loading-buffer" variant="indeterminate" show />
        </UniformSpacingLayout>
      )}
      {/* Once the payment methods are loaded,
      we either show the multiple options if we can or we show the regular payment flow */}
      {!paymentMethodsLoading && (
        actualShowMultiplePaymentOptionsAvailable ? (
          <StripePaymentElementOptionsCard
            applePay={applePay}
            googlePay={googlePay}
            userType={dashboardUser}
          />
        ) : (
          <Card
            cardVariant="empty"
            dense
            body={
              <StripePaymentCardFrame
                userType={dashboardUser}
                showPaymentSummary
              />
            }
          />
        )
      )}
    </>
  );
};

const DigitalConsentDashboardPage = () => {
  const themeMui = useTheme();
  const dispatch = useDispatch();

  const decisionPageProps = useSelector((state: State) => getDecisionPageProps(state));
  const { dashboardUser, mainProduct }: { dashboardUser: JointUserType, mainProduct: ProductType } =
    decisionPageProps;

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const {
    [dashboardUser]: {
      hd_payment_initial_complete: paymentInitialCompleted,
    },
  } = useSelector((state: State) => getDecisionPageProps(state));
  const hdOptedIn = useSelector(state => isHDOptedIn(state, dashboardUser));

  // In HD-only webapp, payment is pending when HD is the main product and payment not yet completed
  const isPaymentPending = mainProduct === PM_PRODUCT_PREFIX.HD && !paymentInitialCompleted;

  const allPoliciesActive = !isPaymentPending && hdOptedIn;

  return (
    <PageContainer textAlign="left" fullHeight>
      <MaxWidthContainer width="xl">
        {allPoliciesActive && (
          <>
            <Typography
              variant="h1"
              message={
                <FormattedMessage id="thankyouCoverageActive.heading.MrU3dj" />
              }
              mb={themeMui.spacer.spaceSmall}
              align="center"
            />
            <Typography
              variant="body1"
              message={
                <FormattedMessage id="thankyouCoverageActive.subheading.vkZu15" />
              }
              mb={themeMui.spacer.spaceMedium}
              align="center"
            />
          </>
        )}
      </MaxWidthContainer>
      <CustomisableDecisionDashboardHD
        {...decisionPageProps}
        // @ts-ignore because this component is being exported with Hotjar HOC which is stripping
        // the props from the component
        isUserSettled={allPoliciesActive}
      />
      <MaxWidthContainer width="md">
        {isPaymentPending && (
          <>
            <Spacer size="spaceMedium" />
            <Typography
              variant="h2"
              align="center"
              message={<FormattedMessage
                id="digitalConsent.paymentFormHeading.82Ay3z"
              />}
            />
            <Spacer size="spaceMedium" />
            <PaymentsProvider>
              <DigitalConsentPaymentSection
                dashboardUser={dashboardUser}
                mainProduct={mainProduct}
              />
            </PaymentsProvider>
          </>
        )}

        <Spacer size="spaceMedium" />
        <SpeakToExperts postDecision headingTag="h3" />
      </MaxWidthContainer>
    </PageContainer>
  );
};

export default WithReviewsIO()(DigitalConsentDashboardPage);
