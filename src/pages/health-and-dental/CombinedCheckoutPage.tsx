import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LOCALE, PM_PRODUCT_PREFIX } from '@policyme/global-libjs-utils';
import { useStripe } from '@stripe/react-stripe-js';
import { PageContainer, MaxWidthContainer, Spacer, Card, Badge, Divider, UniformSpacingLayout, DatePicker, Alert, AwardIcon, Form, Button, Typography, CheckIcon, PenIcon, IconButton, Progress } from '@policyme/global-libjs-designsystem';
import { authGetUserInfo } from '../../NewActions/auth';
import { onComponentLoad } from '../../NewActions/session';
import { getDecisionPageProps } from '../../Selectors/decisionPage';
import { getCurrentUser } from '../../Selectors/userControl';
import type { EffectiveDate, State } from '../../store/types/State';
import { handleEffectiveDate } from '../../NewActions/handle';
import StripePaymentCardFrame from '../../components/StripeSinglePagePayments/StripePaymentCardFrame';
import { ProductType, UserType } from '../../utils/const';
import { isDisabledDate } from '../../utils/helpers';
import SpeakToExperts from '../../components/SpeakToExperts';
import EffectiveDateFaq from '../../components/HDFaq/EffectiveDateFaq';
import PaymentSummary from '../../components/PaymentSummary';
import { PaymentsProvider } from '../../providers/PaymentProvider';
import { useAppleGooglePay } from '../../components/customHooks/useAppleGooglePay';
import StripePaymentElementOptionsCard from '../../components/StripeSetupForm/StripePaymentOptionsCard';

const HDPaymentSection = ({ userType }: { userType: UserType }) => {
  const stripe = useStripe();
  const { applePay, googlePay, paymentMethodsLoading } = useAppleGooglePay(
    stripe,
    PM_PRODUCT_PREFIX.HD as ProductType,
  );
  const showMultiplePaymentOptionsAvailable = googlePay || applePay;

  return (
    <>
      {/* Show the payment summary always for AGP
      since this the expected behaviour for AGP and show the
      payment summary if the methdos are laoding so the user
      can still review their subscription details while we load in the payment methods */}
      {(paymentMethodsLoading || showMultiplePaymentOptionsAvailable) && (
        <>
          <Card
            cardVariant="empty"
            dense
            body={
              <PaymentSummary userType={userType} />
          }
          />
          <Spacer size="spaceMedium" />
        </>
      )}
      {/* Show a loader over top of the payment flow
      until we resolve whether AGP is available or not */}
      { paymentMethodsLoading && (
        <UniformSpacingLayout alignItems="center" gap="0.5rem">
          <Progress name="loading-buffer" variant="indeterminate" show />
        </UniformSpacingLayout>
      )}
      {/* Once the payment methods are loaded,
      we either show the multiple options if we can or we show the regular payment flow */}
      {!paymentMethodsLoading && (
        showMultiplePaymentOptionsAvailable ? (
          <StripePaymentElementOptionsCard
            applePay={applePay}
            googlePay={googlePay}
            userType={userType}
          />
        ) : (
          <Card
            cardVariant="heading-and-inline-badge"
            heading={<FormattedMessage id="paymentCard.heading.24trBe" />}
            headingTypographyTagOverride="h2"
            dense
            body={
              <>
                <Divider />
                <StripePaymentCardFrame
                  userType={userType}
                  showPaymentSummary
                />
              </>
          }
            badges={
              <Badge
                type="alert"
                label={
                  <FormattedMessage id="hdCheckout.stepNumber.UtivI8" values={{ stepNumber: 2 }} />
              }
                variant="filled"
              />
          }
            positioning="inline"
          />)
      )}
    </>
  );
};

const CombinedCheckoutPage = (props: {

}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnPaymentStep, setIsOnPaymentStep] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();
  const fromDocusign = useSelector<State, boolean>(
    (state) => state.metadata.fromDocusign,
  );

  useEffect(() => {
    dispatch(
      onComponentLoad(async () => {
        if (fromDocusign) {
          await dispatch(authGetUserInfo());
        }
        setIsLoading(false);
      }),
    );
  }, []);

  const userType = useSelector<State, UserType>(getCurrentUser);

  const {
    [userType]: { hd_policy_in_force },
  } = useSelector<State, any>((state) => getDecisionPageProps(state));

  const effectiveDate = useSelector<State, EffectiveDate>(
    (state) => state.primary.hdPolicy.effective_date,
  );
  const application_language = useSelector<State, typeof LOCALE[keyof typeof LOCALE]>(
    (state) => state[userType].household.application_language,
  );
  const [showSameDayDisclaimer, setShowSameDayDisclaimer] = useState(false);

  const onEffectiveDateChange = (inputDate) => {
    const formattedDate = `${String(new Date().getMonth() + 1).padStart(
      2,
      '0',
    )}/${String(new Date().getDate()).padStart(
      2,
      '0',
    )}/${new Date().getFullYear()}`;
    const isSameDay = inputDate?.formattedDate === formattedDate;
    setShowSameDayDisclaimer(isSameDay);
    dispatch(handleEffectiveDate(inputDate));
  };

  const sameDayDisclaimer = (
    <Alert type="tip" icon={<AwardIcon />} text={<FormattedMessage id="effectiveDatePage.sameDayDisclaimer.kh2H9K" />} />
  );

  if (isLoading) {
    return (
      <Progress
        name="checkoutProgress"
        variant="indeterminate"
        show
      />
    );
  }

  return (
    <PageContainer textAlign="left">
      <Typography
        variant="h1"
        align="center"
        message={
          <FormattedMessage
            id="hdCheckout.header.guDyNs"
            values={{
              policyInForce: hd_policy_in_force,
            }}
          />
        }
      />
      <Spacer size="spaceLarge" />
      <MaxWidthContainer width="md">
        {isOnPaymentStep ? (
          <>
            <Card
              cardVariant="heading-and-inline-badge"
              heading={<FormattedMessage id="hdCheckout.effectiveDateHeader.8l8r6R" />}
              headingTypographyTagOverride="h2"
              body={
                <>
                  <Divider />
                  <UniformSpacingLayout alignItems="center" gap="0.5rem">
                    <Typography
                      variant="body2"
                      message={effectiveDate?.date.format('MMMM D, YYYY')}
                    />
                    <IconButton
                      name="edit-effective-date-button"
                      icon={<PenIcon variant="plain" interactive />}
                      onClick={() => setIsOnPaymentStep(false)}
                    />
                  </UniformSpacingLayout>
                  {showSameDayDisclaimer && sameDayDisclaimer}
                </>
              }
              badges={
                <Badge
                  type="success"
                  label={
                    <FormattedMessage id="hdCheckout.complete.wRJX6o" />
                  }
                  icon={CheckIcon}
                  variant="filled"
                />
              }
              positioning="inline"
            />
            <Spacer size="spaceMedium" />
            <PaymentsProvider>
              <HDPaymentSection userType={userType} />
            </PaymentsProvider>
          </>
        ) : (
          <>
            <Card
              cardVariant="heading-and-inline-badge"
              heading={<FormattedMessage id="hdCheckout.effectiveDateHeader.8l8r6R" />}
              headingTypographyTagOverride="h2"
              body={
                <>
                  <Divider />
                  <Typography
                    variant="body2"
                    message={
                      <FormattedMessage id="hdCheckout.datePickBody.OtYQQV" />
                    }
                  />
                  <MaxWidthContainer width="md" bgcolor="card">
                    <Form
                      onSubmit={() => {
                        setIsOnPaymentStep(true);
                      }}
                      name="Effective Date"
                      segmentPayload={{
                        name: <FormattedMessage id="effectiveDatePage.tooltipModal.content.8uIL77" />,
                        product_type: PM_PRODUCT_PREFIX.HD,
                      }}
                    >
                      <UniformSpacingLayout flexDirection="column">
                        <DatePicker
                          label={intl.formatMessage({ id: 'hdCheckout.effectiveDateHeader.8l8r6R' })}
                          ariaLabel={intl.formatMessage({ id: 'hdCheckout.effectiveDateHeader.8l8r6R' })}
                          locale={application_language}
                          disablePast
                          disableWeekends
                          required
                          maxDaysInFuture={90}
                          value={effectiveDate?.formattedDate ?? ''}
                          onChange={onEffectiveDateChange}
                          disableDateCallback={(date) => isDisabledDate(date, {
                            disableWeekends: true,
                            disableStatutoryHolidays: true,
                            maxDaysInFuture: 90,
                          })}
                        />
                        {showSameDayDisclaimer && (
                          <>
                            <Spacer size="spaceSmall" />
                            {sameDayDisclaimer}
                          </>
                        )}
                        <Spacer size="spaceSmall" />
                        <Button
                          variant="primary"
                          type="submit"
                          name="effectiveDateNextButton"
                          dataCy="group-benefits-submit"
                        >
                          <Typography
                            variant="CTALargePrimary"
                            message={
                              <FormattedMessage id="global.next.Q0fXUP" />
                            }
                          />
                        </Button>
                      </UniformSpacingLayout>
                    </Form>
                  </MaxWidthContainer>
                </>
              }
              badges={
                <Badge
                  type="alert"
                  label={
                    <FormattedMessage id="hdCheckout.stepNumber.UtivI8" values={{ stepNumber: 1 }} />
                  }
                  variant="filled"
                />
              }
              positioning="inline"
            />
            <Spacer size="spaceMedium" />
            <Card
              cardVariant="heading-and-inline-badge"
              heading={<FormattedMessage id="paymentCard.heading.24trBe" />}
              headingTypographyTagOverride="h2"
              body={<></>}
              badges={
                <Badge
                  type="alert"
                  label={
                    <FormattedMessage id="hdCheckout.stepNumber.UtivI8" values={{ stepNumber: 2 }} />
                  }
                  variant="filled"
                />
              }
              positioning="inline"
            />
            <EffectiveDateFaq />
          </>
        )}
        <Spacer size="spaceMedium" />
        <SpeakToExperts postDecision />
      </MaxWidthContainer>
    </PageContainer>
  );
};

export default CombinedCheckoutPage;
