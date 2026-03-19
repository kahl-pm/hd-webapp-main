import React, { useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Accordion, ChevronDownIcon, Typography, Divider, Spacer } from '@policyme/global-libjs-designsystem';
import { useTheme, styled } from '@mui/material';
import { isJoint as isJointSelector, isPolicymeEmployee as isPolicymeEmployeeSelector } from '../../Selectors/userControl';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import ProductRow, { SummaryRow } from './NewProductRow';
import { formatCurrencyConfig } from '../../utils/reactIntlHelpers';
import { DISCOUNTS_VALUE, DISCOUNT_CODES } from '../../utils/discounts';
import { updateUserViewedPriceInfo } from '../../NewActions/metadata';
import { GET_PRICING_ELEMENTS_IDS_FOR_REPORTING } from './const';
import { State } from '../../store/types/State';
import { parsePriceFormattedString } from '../../utils/helpers';

interface Props {
  showPartnerDiscountUI: boolean;
  totalPrice: number;
  firstPaymentDate: string;
  savings: any;
  hdOptedIn: boolean;
  hdPlanAmountCurrency: string;
  hdPlanAmount: number;
  caaMemberDiscountApplied: boolean;
  jointDiscountApplied: boolean;
  septemberTLDiscountApplied: boolean;
  familyDiscountApplied: boolean;
  totalLastPayment: number;
}

const TotalPriceSummary = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    alignItems: 'flex-end',
    paddingRight: theme.spacer.space2XS,
  };
});

const PaymentContent = styled('div')(({ theme }) => {
  return {
    paddingRight: theme.spacer.space2XS,
  };
});

const PaymentSummaryFrame = ({
  totalPrice, hdOptedIn,
  hdPlanAmountCurrency,
  savings,
  hdPlanAmount = 0,
  showPartnerDiscountUI, firstPaymentDate, caaMemberDiscountApplied,
  totalLastPayment, jointDiscountApplied = false,
  familyDiscountApplied = false,
  septemberTLDiscountApplied = false,
}: Props) => {
  const theme = useTheme();
  const intl = useIntl();
  const isJoint = useSelector(isJointSelector);
  const userType = useSelector((state:State) => state.userControl.dashboardUser);
  const dispatch = useDispatch();
  const beforeSavingAmount = Number(hdOptedIn) * hdPlanAmount;
  const numOfProduct = [hdOptedIn].filter((opt) => opt).length;
  const {
    FAMILY_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    CAA_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    EXCLUSIVE_PERK_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
  } = GET_PRICING_ELEMENTS_IDS_FOR_REPORTING(PM_PRODUCT_PREFIX.HD);

  useEffect(() => {
    const exclusivePerkDiscountSavingsApplied = document.getElementById(
      EXCLUSIVE_PERK_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    );

    const caaDiscountSavingsApplied = document.getElementById(
      CAA_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    );

    const familyDiscountSavingsApplied = document.getElementById(
      FAMILY_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    );

    const isExclusivePerkDiscountApplied = Boolean(exclusivePerkDiscountSavingsApplied && exclusivePerkDiscountSavingsApplied?.innerHTML !== '');
    const isCaaDiscountApplied = Boolean(caaDiscountSavingsApplied && caaDiscountSavingsApplied?.innerHTML !== '');
    const isFamilyDiscountApplied = Boolean(familyDiscountSavingsApplied && familyDiscountSavingsApplied?.innerHTML !== '');

    dispatch(updateUserViewedPriceInfo(userType, {
      isExclusivePerkDiscountApplied,
      isCaaDiscountApplied,
      isFamilyDiscountApplied,
      caaDiscountSavingsApplied: parsePriceFormattedString(
        caaDiscountSavingsApplied?.innerHTML || '0',
      ),
      familyDiscountSavingsApplied: parsePriceFormattedString(
        familyDiscountSavingsApplied?.innerHTML || '0',
      ),
    }));
  }, []);

  const SummaryItem = ({ label, value, dataCy = '', hasPlanType = false, isH3 = false, price_id = '' }) => (
    <SummaryRow data-cy={dataCy}>
      <Typography variant="body1" message={label} />
      <div style={{ display: 'flex' }}>
        <Typography
          variant={isH3 ? 'h3' : 'body1Bold'}
          color={theme?.palette?.text?.primary}
          message={value}
          component="p"
          // DO NOT DELETE THIS ID
          // This ID is used to query/report the pricing details the user sees.
          // The BE flags an alert in sentry if the value is different from what
          // quote engine calculates as the user's price.
          id={price_id}
        />
        {hasPlanType && <Typography
          variant="body3"
          mt="0.25rem"
          ml="0.125rem"
          component="p"
          color={theme?.palette?.text?.secondary}
          message={
            <>
              /<FormattedMessage id="aura.unitized.month" />
            </>
          }
        />}
      </div>
    </SummaryRow>
  );

  const paymentContent = (
    <PaymentContent id="payment-summary-accordion-body">
      {hdOptedIn ?
        <ProductRow
          planAmountCurrency={hdPlanAmountCurrency}
          cov_amt={''}
          term_len={''}
          productType={PM_PRODUCT_PREFIX.HD}
          isJoint={isJoint}
          savingBreakdown={savings.hd?.discountBreakdown || savings.life?.discountBreakdown}
          jointDiscountApplied={jointDiscountApplied}
          isPermanentInsuranceProduct={false}
          isPolicymeEmployee={false}
          septemberTLDiscountApplied={septemberTLDiscountApplied}
        /> : null}
      <Divider />
      <div style={{ padding: '1rem 0' }}>
        <>
          {caaMemberDiscountApplied && (
            <>
              <SummaryItem
                label={<FormattedMessage id="paymentSummary.digitalConsentBeforeSavings.u54T9x" />}
                value={intl.formatNumber(beforeSavingAmount, formatCurrencyConfig)}
                hasPlanType
              />
              <Spacer size="space2XS" />
              <SummaryItem
                label={<FormattedMessage
                  id="paymentSummary.digitalConsentCaaSavings.aef1rQ"
                  values={{
                    discountPerc: DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_DISCOUNT],
                  }}
                />}
                value={`-${intl.formatNumber(
                  Number(hdOptedIn) * savings.hd.discountBreakdown.caaHd,
                  formatCurrencyConfig,
                )}`}
                hasPlanType
                price_id={CAA_DISCOUNT_SAVINGS_APPLIED_FIELD_ID}
              />
              <Spacer size="space2XS" />
            </>
          )}
          {familyDiscountApplied && (
            <>
              <SummaryItem
                label={
                  <FormattedMessage
                    id="paymentSummary.familySaving.ncXZqH"
                    values={{
                      discountPerc: DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT],
                    }}
                  />
                }
                value={`-${intl.formatNumber(
                  Number(hdOptedIn) * savings.hd.discountBreakdown.family, formatCurrencyConfig,
                )}`}
                hasPlanType
                price_id={FAMILY_DISCOUNT_SAVINGS_APPLIED_FIELD_ID}
              />
              <Spacer size="space2XS" />
            </>
          )}
          {showPartnerDiscountUI ? (
            <>
              <SummaryItem
                dataCy="firstTwoMonths"
                label={
                  <FormattedMessage id="ApprovedCard.rateBreakdown.B5UPKi" />
                }
                value={<FormattedMessage id="global.free.9WJe8V" />}
                // DO NOT DELETE THIS ID
                // This ID is used to query/report the pricing details the user sees.
                // The BE flags an alert in sentry if the value is different from what
                // quote engine calculates as the user's price.
                price_id={EXCLUSIVE_PERK_DISCOUNT_SAVINGS_APPLIED_FIELD_ID}
              />
              <Spacer size="space2XS" />
              <SummaryItem
                dataCy="todayPaymentText"
                label={<FormattedMessage id="paymentSummary.totalToday.z4au8T" />}
                value={intl.formatNumber(showPartnerDiscountUI ?
                  0 : totalPrice, formatCurrencyConfig)}
                isH3
              />
              <Spacer size="space2XS" />
            </>
          ) : jointDiscountApplied ? (
            <>
              <SummaryItem
                dataCy="todayPaymentText"
                label={<FormattedMessage id="paymentSummary.todayPayment.1gevpw" />}
                value={intl.formatNumber(totalPrice, formatCurrencyConfig)}
                isH3
              />
              <Spacer size="space2XS" />
            </>
          ) : null}
        </>
        {!showPartnerDiscountUI && jointDiscountApplied ? (
          <SummaryItem
            label={<FormattedMessage id="estimatedMonthlyRate.afterFirstYear.TaG7hq" />}
            value={intl.formatNumber(totalLastPayment, formatCurrencyConfig)}
            hasPlanType
            isH3
          />
        ) : <SummaryItem
          dataCy="totalPaymentDue"
          label={<FormattedMessage
            id="paymentSummary.totalPayment.MlIiBQ"
            values={{ showPartnerDiscountUI, firstPaymentDate }}
          />}
          hasPlanType
          value={intl.formatNumber(totalPrice, formatCurrencyConfig)}
        />}
      </div>
      <Divider />
    </PaymentContent>
  );

  return (
    <>
      <Accordion
        defaultExpanded
        variant="inline"
        icon={ChevronDownIcon}
        detail={paymentContent}
        position="left"
        heading={<>
          <FormattedMessage id="paymentSummary.digitalConsentYourSummary.d9Auy1" /> ({numOfProduct})
        </>}
        id="payment-summary-accordion-header"
        ariaControls="payment-summary-accordion-body"
        inlineContent={<TotalPriceSummary>
          <Typography
            variant="h3"
            component="p"
            color={theme?.palette?.text?.primary}
            message={intl.formatNumber(totalPrice, formatCurrencyConfig)}
          />
          <Typography
            variant="body3"
            ml={theme.spacer.space4XS}
            mt={theme.spacer.space2XS}
            color={theme?.palette?.text?.secondary}
            message={
              <span>
                /<FormattedMessage id="aura.unitized.month" />
              </span>
            }
          />
        </TotalPriceSummary>}
      />
    </>
  );
};

export default PaymentSummaryFrame;
