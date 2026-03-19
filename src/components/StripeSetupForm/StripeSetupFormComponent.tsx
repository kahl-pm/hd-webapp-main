import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PaymentElement } from '@stripe/react-stripe-js';
import { Button, Form, isMobile, Progress, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { isJoint as isJointSelector, showPartnerDiscountUI as showPartnerDiscountUISelector } from '../../Selectors/userControl';
import { getWithPricingFields } from '../HOC/WithPricing';
import { getPlanTypeDisplay } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, PLAN_TYPES, USER_TYPES, STRIPE_OPTIONS } from '../../utils/const';
import { DISCOUNT_CODES } from '../../utils/discounts';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { getAllProductDiscountCodes } from '../../Selectors/helpers/productSession';
import CardHolderName from './CardHolderName';
import { updateIsLoading } from '../../NewActions/helpersMetadata';
import { State } from '../../store/types/State';

export interface SetupFormComponentProps {
  userType: typeof USER_TYPES[keyof typeof USER_TYPES];
  isAfterSellCI: boolean;
  isLoadingButton: boolean;
  handleSubmit: (event: any) => Promise<any>;
  stripe: any;
  totalAmtDiscountedDisplay: string;
  totalAmtFinalDisplay: string;
}

const SetupFormComponent = forwardRef<HTMLButtonElement, SetupFormComponentProps>(({
  userType,
  isAfterSellCI,
  isLoadingButton,
  handleSubmit,
  stripe,
  totalAmtDiscountedDisplay,
  totalAmtFinalDisplay,
}, ref) => {
  const intl = useIntl();
  const [isLoadingComponent, setIsLoadingComponent] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    stripe && setIsLoadingComponent(false);
  }, [stripe]);

  const { pricing } = useSelector((state: State) => getWithPricingFields(state));
  const planType = useSelector<any, string>(
    state => state[userType].payment.planType || PLAN_TYPES.MONTHLY,
  );
  const showPartnerDiscountUI = useSelector(state => showPartnerDiscountUISelector(
    state,
    userType,
    getMainProduct(state, userType),
  ));
  const isJoint = useSelector((state: State) => isJointSelector(state));
  const isHD = useSelector(state => getMainProduct(state, userType) === PM_PRODUCT_PREFIX.HD);
  const discountCodes = useSelector(state => getAllProductDiscountCodes(state, userType));
  const productType = useSelector(state => getMainProduct(state, userType));
  const hdApprovedFirstPayment = pricing.overall.hd.totalFirstPaymentCurrency;

  const hdText = <FormattedMessage
    id="stripeSetupForm.helcimDisclaimerHD.KLjdi1"
    values={{
      hdApprovedFirstPayment,
    }}
  />;
  const jointAndHasPartnerDiscountCodeText = <FormattedMessage
    id="stripeSetupForm.jointHelcimDisclaimer.nL5YJ1"
    values={{
      planType: getPlanTypeDisplay(intl, planType),
      totalAmtDiscountedDisplay,
      totalAmtFinalDisplay,
    }}
  />;

  const notJointOrNotPartnerDiscountCodeText = <FormattedMessage
    id="stripeSetupForm.helcimDisclaimer.foYYu1"
    values={{
      planType: getPlanTypeDisplay(intl, planType),
      totalAmtFinalDisplay,
    }}
  />;

  const jointAndHasDiscountCodesText = <FormattedMessage
    id="stripeSetupForm.jointHelcimDisclaimerNoAftersell.J6Nbt1"
    values={{
      planType: getPlanTypeDisplay(intl, planType),
      totalAmtDiscountedDisplay,
      totalAmtFinalDisplay,
    }}
  />;

  const notJointAndHasDiscountCodesText = <FormattedMessage
    id="stripeSetupForm.helcimDisclaimerNoAftersell.2RUts1"
    values={{ planType: getPlanTypeDisplay(intl, planType), totalAmtFinalDisplay }}
  />;

  const isJointAndHasJointDiscountCodes =
  isJoint && discountCodes.includes(DISCOUNT_CODES.JOINT_DISCOUNT_V2);

  const partnerUIText = isJointAndHasJointDiscountCodes ?
    jointAndHasPartnerDiscountCodeText : notJointOrNotPartnerDiscountCodeText;

  const notPartnerUIText = isJointAndHasJointDiscountCodes && !isAfterSellCI ?
    jointAndHasDiscountCodesText : notJointAndHasDiscountCodesText;

  const lifeCIText = showPartnerDiscountUI && !isAfterSellCI ? partnerUIText : notPartnerUIText;

  const isCypressStripeForm = useSelector<State, boolean>(
    state => state.metadata.isCypressStripeForm,
  );

  const debugOptions: StripePaymentElementOptions = { fields: { billingDetails: { address: { postalCode: 'never' } } } };

  return (
    <>
      <Form
        name="paymentForm"
        dataCy="paymentForm form"
        onSubmit={async (event) => {
          dispatch(updateIsLoading(true));
          await handleSubmit(event);
          dispatch(updateIsLoading(false));
        }}
        segmentPayload={{
          name: 'payment',
          product_type: productType,
        }}
      >
        <CardHolderName userType={userType} />

        {/* Disable postal code field for Cypress tests, see
        https://policyme.atlassian.net/wiki/spaces/EN/pages/3184230401/Crowdsourcing+solutions+for+ITT+-+Stripe+Form+Bug */}
        {isCypressStripeForm
          ? (<PaymentElement options={debugOptions} />)
          : <PaymentElement options={STRIPE_OPTIONS} />}
        <Typography align="left" variant="body3" message={isHD ? hdText : lifeCIText} />
        <Button
          type="submit"
          dataCy="submit"
          className={isLoadingButton ? `btn-primary disabled` : 'btn-primary'}
          disabled={isLoadingButton}
          hidden={isMobile()}
          ref={ref}
        >
          <FormattedMessage id="paymentForm.processMyPayment.DbZIO9" />
        </Button>
        <Progress name="PaymentSpinner" show={isLoadingComponent} />
      </Form>
      <Progress name="PaymentComponentLoadingSpinner" show={isLoadingComponent} />
    </>
  );
});

export default SetupFormComponent;
