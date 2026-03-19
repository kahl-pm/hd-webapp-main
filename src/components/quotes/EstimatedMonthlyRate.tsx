import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Badge, Card, CustomizableBox, Divider, IconButton, PenIcon, Progress, Spacer, Tooltip, Typography,
  UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { Box } from '@mui/material';
import {
  ESTIMATED_JOINT_MONTHLY_RATE_BODY,
  ESTIMATED_MONTHLY_RATE_BODY, PM_PRODUCT_PREFIX, USER_TYPES,
} from '../../utils/const';
import {
  isJoint as isJointSelector, isPolicymeEmployee as isPolicymeEmployeeSelector,
  isPolicymePartner as isPolicymePartnerSelector,
  showPartnerDiscountUI as showPartnerDiscountUISelector,
} from '../../Selectors/userControl';
import { getBirthDateText, getGenderText, getSmokerText } from '../../Selectors/household';
import WithPricing, { usePricing } from '../HOC/WithPricing';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { DISCOUNT_CODES } from '../../utils/discounts';
import { getQuotesDiscountCodes } from '../../Selectors/quotes';
import { State } from '../../store/types/State';
import UserDetailsModal from '../UserDetailsModal';

const useNonDiscountedRateToBeRendered = ({ isPolicymeEmployee,
  nonDiscountedPriceCurrency }) => {
  const data = {
    subText: null,
    nonDiscountedPrice: isPolicymeEmployee
        ? `${nonDiscountedPriceCurrency}${useIntl().formatMessage({ id: 'global.monthly.q8Sv6g' })}`
        : null,
  };
  return { ...data, hasDataToRender: data.subText || data.nonDiscountedPrice };
};

const DesktopEstimatedRateBox = (props) => {
  const intl = useIntl();
  const {
    birthdateText, gender, smokerText, currentPrice,
    monthlyRateTooltipText, monthlyRateContentText,
    detailsText, modalOpenHandler, isJoint,
    isPolicymeEmployee, nonDiscountedPriceCurrency,
    mainProduct, originalPriceCurrency, caaMemberDiscountApplied, isSeptemberTLDiscountApplied,
  } = props;

  const { subText, nonDiscountedPrice, hasDataToRender } = useNonDiscountedRateToBeRendered({
    isPolicymeEmployee,
    nonDiscountedPriceCurrency,
  });

  return (
    <>
      <UniformSpacingLayout flexDirection="row" justifyContent="space-between">
        <Typography
          variant="h3"
          message={detailsText}
          align="left"
          icon={<IconButton
            dataCy="details-edit-icon"
            name={intl.formatMessage({ id: 'coverageRedesign.userDetailsModal.updateYourDetails.wT0ipB' })}
            onClick={() => modalOpenHandler(true)}
            icon={<PenIcon variant="transparent" interactive size="accordionLarge" />}
          />}
          iconPosition={'end'}
          pr="0.5rem"
        />
        <UniformSpacingLayout alignItems="flex-start">
          <Typography
            variant="h3"
            align="right"
            message={<FormattedMessage
              id="estimatedMonthlyRate.estimatedRate.PUKcDB"
            />}
            noWrap
            tooltip={<Tooltip
              tooltipHeader={monthlyRateTooltipText}
              segmentPayload={{
                name: 'monthly_rate_tooltip',
                product_type: PM_PRODUCT_PREFIX.HD,
              }}
              variant="icon-only"
              tooltipButtonName={intl.formatMessage({ id: 'estimatedMonthlyRate.primary.monthlyRateTooltipText.6VYG1u' })}
              ariaLabelledBy="monthly_rate_tooltip_header"
              ariaDescribedBy="monthly_rate_tooltip_description"
            >
              {monthlyRateContentText}
            </Tooltip>}
          />
        </UniformSpacingLayout>
      </UniformSpacingLayout>
      <UniformSpacingLayout flexDirection="row" justifyContent="space-between" gap="0.5rem">
        <Typography
          variant="body2"
          message={<>{birthdateText} | {gender} | {smokerText}</>}
          align="left"
          pr="2.5rem" // spacing adjustment to put smokerText to newline (on mobile) if value is 'Non-smoker'
        />
        <UniformSpacingLayout flexDirection="row" justifyContent="flex-end" alignItems="flex-end">
          <Typography variant="h1" component="p" message={currentPrice} data-cy="estimated-rate-price" />
          <Typography variant="body3" message={<FormattedMessage id="global.monthly.q8Sv6g" />} />
        </UniformSpacingLayout>
      </UniformSpacingLayout>
      {caaMemberDiscountApplied && !hasDataToRender &&
        <UniformSpacingLayout justifyContent="flex-end">
          <UniformSpacingLayout flexDirection="row" justifyContent="flex-end" alignItems="baseline">
            <Typography strikeThrough variant="body3" message={nonDiscountedPriceCurrency} />
            <Typography variant="body3" message={<FormattedMessage id="global.monthly.q8Sv6g" />} />
          </UniformSpacingLayout>
        </UniformSpacingLayout>}
      {hasDataToRender &&
        <UniformSpacingLayout justifyContent="flex-end" flexDirection="row" gap="0.25rem">
          <Typography variant="body3" message={subText} />
          <Typography variant="body3" message={nonDiscountedPrice} />
        </UniformSpacingLayout>}
    </>
  );
};

const Row = ({ title, value }) => (
  <UniformSpacingLayout flexDirection="row" justifyContent="space-between" alignItems="center">
    {title}
    <CustomizableBox>
      {value}
    </CustomizableBox>
  </UniformSpacingLayout>
);

const EstimateRateBox = (props) => {
  const { birthdateText, gender, smokerText,
    partnerGender, partnerBirthdateText, partnerSmokerText, isJoint,
    showPartnerDiscountUI, isPolicymePartner, isPolicymeEmployee,
    caaMemberDiscountApplied, isSeptemberTLDiscountApplied } = props;
  const [isMyModalOpen, setIsMyModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const { pricing } = usePricing();
  const primaryUserDataProps = {
    birthdateText,
    gender,
    smokerText,
    monthlyRateTooltipText: props.isJoint ?
      <FormattedMessage
        id="estimatedMonthlyRate.primary.monthlyRateTooltipText.rDlN6T"
      /> :
      <FormattedMessage
        id="estimatedMonthlyRate.primary.monthlyRateTooltipText.6VYG1u"
      />,
    monthlyRateContentText: props.isJoint ?
      ESTIMATED_JOINT_MONTHLY_RATE_BODY :
      ESTIMATED_MONTHLY_RATE_BODY,
    originalPriceCurrency: pricing.primary[props.mainProduct].preDecisionLastPaymentCurrency,
    currentPrice: props.primaryMnPrice,
    detailsText: <FormattedMessage
      id="estimatedMonthlyRate.primary.detailsText.LIQe2i"
    />,
    modalOpenHandler: setIsMyModalOpen,
    isJoint: props.isJoint,
    mainProduct: props.mainProduct,
    isPolicymeEmployee,
    nonDiscountedPriceCurrency:
      pricing.primary[props.mainProduct].preDecisionNonDiscountedPriceCurrency,
    caaMemberDiscountApplied,
    isSeptemberTLDiscountApplied,
  };

  const partnerDataProps = {
    birthdateText: partnerBirthdateText,
    gender: partnerGender,
    smokerText: partnerSmokerText,
    monthlyRateTooltipText: <FormattedMessage
      id="estimatedMonthlyRate.partner.monthlyRateTooltipText.ElMMZi"
    />,
    monthlyRateContentText: ESTIMATED_JOINT_MONTHLY_RATE_BODY,
    originalPriceCurrency:
      pricing.secondary[props.mainProduct].preDecisionLastPaymentCurrency,
    currentPrice: props.secondaryMnPrice,
    detailsText: <FormattedMessage
      id="estimatedMonthlyRate.partner.detailsText.oCHdRK"
    />,
    modalOpenHandler: setIsPartnerModalOpen,
    isJoint: props.isJoint,
    mainProduct: props.mainProduct,
    isPolicymeEmployee,
    nonDiscountedPriceCurrency:
      pricing.secondary[props.mainProduct].preDecisionNonDiscountedPriceCurrency,
    caaMemberDiscountApplied,
    isSeptemberTLDiscountApplied,
  };

  return (
    <Card
      cardVariant="empty"
      body={
        <Box width={'100%'}>
          {/* The reason for wrapping with <Box> is because we need width=100%. We can replace
          this with FullWidthContainer or something similar once we add it to design system. */}
          <>
            <Spacer size="spaceSmall" />
            <Divider />
            <Spacer size="spaceSmall" />
            <DesktopEstimatedRateBox {...primaryUserDataProps} />
            <UserDetailsModal
              updateUserType={USER_TYPES.PRIMARY}
              isOpen={isMyModalOpen}
              setOpen={setIsMyModalOpen}
              mainProduct={props.mainProduct}
            />
            {props.isJoint &&
              <>
                <Spacer size="spaceSmall" />
                <Divider />
                <Spacer size="spaceSmall" />
                <DesktopEstimatedRateBox {...partnerDataProps} />
                <UserDetailsModal
                  updateUserType={USER_TYPES.SECONDARY}
                  isOpen={isPartnerModalOpen}
                  setOpen={setIsPartnerModalOpen}
                  mainProduct={props.mainProduct}
                />
              </>}
          </>
        </Box>
      }
      badges={
        <Badge
          label={
            <FormattedMessage id="estimatedMonthlyRate.yourQuote.g8aPKC" />
          }
          labelComponent="h2"
          variant="tip"
        />
      }
      positioning="outer"
    />);
};

const EstimatedMonthlyRate = ({ mainProduct }) => {
  const { pricing } = usePricing();

  // Replace single useSelector with specific selectors
  const isJoint = useSelector(isJointSelector);
  const gender = useSelector((state: State) => getGenderText(state.primary));
  const birthdateText = useSelector((state: State) => getBirthDateText(state.primary));
  const smokerText = useSelector((state: State) => getSmokerText(state.primary));
  const partnerGender = useSelector((state: State) => getGenderText(state.secondary));
  const partnerBirthdateText = useSelector((state: State) => getBirthDateText(state.secondary));
  const partnerSmokerText = useSelector((state: State) => getSmokerText(state.secondary));
  const isQuoting = useSelector((state: State) => state.metadata.isQuoting);
  const primaryQuotes = useSelector((state: State) => state.primary.quotes[mainProduct].userQuotes);
  const secondaryQuotes = useSelector(
    (state: State) => state.secondary.quotes[mainProduct].userQuotes,
  );
  const currentUser = useSelector((state: State) => state.userControl.currentUser);
  const showPartnerDiscountUI = useSelector(
    (state: State) => showPartnerDiscountUISelector(state, currentUser, mainProduct),
  );
  const isPolicymePartner = useSelector(isPolicymePartnerSelector);
  const productPrefix = useSelector(
    (state: State) => getMainProductEventPrefix(state, currentUser),
  );
  const isPolicymeEmployee = useSelector(isPolicymeEmployeeSelector);
  const caaMemberDiscountApplied = useSelector(
    (state: State) => getQuotesDiscountCodes(
      state, currentUser, mainProduct,
    ).includes(DISCOUNT_CODES.CAA_DISCOUNT),
  );
  const isSeptemberTLDiscountApplied = useSelector(
    (state: State) => getQuotesDiscountCodes(
      state, currentUser, mainProduct,
    ).includes(DISCOUNT_CODES.PM_SEPT2025_PROMO),
  );

  const _props = {
    isJoint,
    gender,
    birthdateText,
    smokerText,
    partnerGender,
    partnerBirthdateText,
    partnerSmokerText,
    isQuoting,
    primaryQuotes,
    secondaryQuotes,
    showPartnerDiscountUI,
    isPolicymePartner,
    productPrefix,
    isPolicymeEmployee,
    caaMemberDiscountApplied,
    isSeptemberTLDiscountApplied,
  };
  const primaryMnPrice = pricing.primary[mainProduct].preDecisionFirstPaymentCurrency;
  const secondaryMnPrice = pricing.secondary[mainProduct].preDecisionFirstPaymentCurrency;

  return (
    <div>
      {
        primaryMnPrice !== '' && primaryMnPrice !== 'NaN' && !_props.isQuoting ?
          <EstimateRateBox
            {..._props}
            secondaryMnPrice={secondaryMnPrice}
            primaryMnPrice={primaryMnPrice}
            mainProduct={mainProduct}
            pricing={pricing}
          /> :
          <Progress name="estimated-loading" show />
      }
    </div>
  );
};

export default EstimatedMonthlyRate;
