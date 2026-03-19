import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Typography, TextButton } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { isDigitalConsentJourney, isJoint as isJointSelector, showPartnerDiscountUI as showPartnerDiscountUISelector } from '../../Selectors/userControl';
import { getWithPricingFields } from '../HOC/WithPricing';
import { getPlanTypeDisplay } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, PLAN_TYPES, AUTHORIZATION_TYPE, ProductType, USER_TYPES } from '../../utils/const';
import { DISCOUNT_CODES } from '../../utils/discounts';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { getAllProductDiscountCodes } from '../../Selectors/helpers/productSession';
import { DEFAULT_CONSENT_VERSIONS } from '../../utils/consentVersion';
import { getTenantCode } from '../../tenant/helpers';
import { CheckoutConsentBodyValuesProps, CustomisableCheckoutConsentBody } from '../DigitalConsentHtmlComponents/CheckoutConsent';
import { handleQADocumentDownload } from '../../NewActions/handle';
import { State } from '../../store/types/State';

interface PaymentConsentLanguageProps {
  userType: typeof USER_TYPES[keyof typeof USER_TYPES];
  isAfterSellCI: boolean;
  totalAmtDiscountedDisplay: string;
  totalAmtFinalDisplay: string;
  setIsAcknowledged: (arg0: boolean) => void;
  isAcknowledged: boolean;
  showError?: boolean;
}

const PaymentConsentLanguage = ({
  userType,
  isAfterSellCI,
  totalAmtDiscountedDisplay,
  totalAmtFinalDisplay,
  setIsAcknowledged,
  isAcknowledged,
  showError,
}: PaymentConsentLanguageProps) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const { pricing } = useSelector((state: State) => getWithPricingFields(state));
  const planType = useSelector<any, string>(
    state => state[userType].payment.planType || PLAN_TYPES.MONTHLY,
  );
  const mainProduct = useSelector<State, ProductType>(state => getMainProduct(state, userType));
  const showPartnerDiscountUI = useSelector<State, boolean>(state => showPartnerDiscountUISelector(
    state,
    userType,
    mainProduct,
  ));
  const isJoint = useSelector<State, boolean>(state => isJointSelector(state));
  const isHD = mainProduct === PM_PRODUCT_PREFIX.HD;
  const discountCodes = useSelector(state => getAllProductDiscountCodes(state, userType));
  const hdApprovedFirstPayment = pricing.overall.hd.totalFirstPaymentCurrency;
  const isDigitalConsent = useSelector<State, boolean>(state => isDigitalConsentJourney(state));
  const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][mainProduct];
  const lifeOrCiConsentVersion = consentVersions[AUTHORIZATION_TYPE.CHECKOUT_CONSENT];

  const CheckoutConsentBodyValues:CheckoutConsentBodyValuesProps = {
    b: chunks => <strong>{chunks}</strong>,
    br: <br />,
    p: msg => (
      <Typography variant="body3" data-cy="consent-text" message={msg} />
    ),
    span1: msg => (
      <TextButton
        variant="inline"
        name="open-questions-and-answers-document"
        ariaLabel="Open questions and answers document"
        label={msg}
        onClick={(e) => {
          e.preventDefault();
          dispatch(handleQADocumentDownload(mainProduct, userType));
        }}
      />
    ),
    planType,
    totalAmtDiscountedDisplay,
  };

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

  return (
    <>
      {isDigitalConsent
        ? <>
          <Typography
            variant="body3"
            message={<FormattedMessage id="checkoutConsent.authorizePayment.12fhsd" />}
          />
          <CustomisableCheckoutConsentBody
            mainProduct={mainProduct}
            lifeOrCiConsentVersion={lifeOrCiConsentVersion}
            values={CheckoutConsentBodyValues}
            action={setIsAcknowledged}
            checked={isAcknowledged}
            showError={showError}
          />
        </>
        : <Typography variant="body3" message={isHD ? hdText : lifeCIText} />}
    </>
  );
};

export default PaymentConsentLanguage;
