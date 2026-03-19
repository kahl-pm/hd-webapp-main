import React, { useContext, useEffect } from 'react';
import { Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { styled, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import { formatCurrencyConfig } from '../../utils/reactIntlHelpers';
import { GET_PRICING_ELEMENTS_IDS_FOR_REPORTING } from './const';
import { updateUserViewedPriceInfo } from '../../NewActions/metadata';
import { parsePriceFormattedString } from '../../utils/helpers';
import { State } from '../../store/types/State';

interface SavingBreakdown {
  caaMember: number;
  employee: number;
  joint: number;
  septemberTL: number;
}

interface ProductRowProps {
  planAmountCurrency: string;
  cov_amt: string;
  term_len: string;
  productType: typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX];
  isJoint: boolean;
  savingBreakdown: SavingBreakdown;
  jointDiscountApplied: boolean;
  isPermanentInsuranceProduct?: boolean;
  isPolicymeEmployee: boolean;
  septemberTLDiscountApplied: boolean;
}

export const SummaryRow = styled('div')(({ theme }: any) => {
  return {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    p: {
      alignSelf: 'flex-end',
    },
  };
});

const ProductRow = ({ planAmountCurrency, cov_amt,
  term_len, productType, isJoint,
  savingBreakdown, jointDiscountApplied, septemberTLDiscountApplied,
  isPermanentInsuranceProduct = false, isPolicymeEmployee = false }: ProductRowProps) => {
  const productTypeMap = {
    [PM_PRODUCT_PREFIX.HD]: <FormattedMessage id="policyType.healthDental.9IjqPz" />,
  };

  const intl = useIntl();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userType = useSelector((state:State) => state.userControl.dashboardUser);
  const {
    TOTAL_MONTHLY_NON_DISCOUNTED_PRICE_FIELD_ID,
    JOINT_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    PM_SEPT2025_TL_PROMO_SAVINGS_APPLIED_FIELD_ID,
  } = GET_PRICING_ELEMENTS_IDS_FOR_REPORTING(productType);

  const CoverageItem = ({ message, planAmountDisplay, hasPlanType = true, priceId = '' }) => (
    <SummaryRow>
      <Typography variant="body3" message={message} />
      <div style={{ display: 'flex' }}>
        <Typography
          variant="body1Bold"
          color={theme?.palette?.text?.primary}
          message={planAmountDisplay}
          // DO NOT DELETE THIS ID
          // This ID is used to query/report the pricing details the user sees.
          // The BE flags an alert in sentry if the value is different from what
          // quote engine calculates as the user's price.
          id={priceId}
        />
        {hasPlanType && (
          <Typography
            variant="body3"
            mt="0.25rem"
            ml="0.125rem"
            color={theme?.palette?.text?.secondary}
            message={
              <>
                /<FormattedMessage id="aura.unitized.month" />
              </>
            }
          />
        )}
      </div>
    </SummaryRow>
  );

  useEffect(() => {
    const totalMonthlyNonDiscountedPriceDisplayed = document.getElementById(
      TOTAL_MONTHLY_NON_DISCOUNTED_PRICE_FIELD_ID,
    );
    const jointDiscountSavingsAppliedDisplayed = document.getElementById(
      JOINT_DISCOUNT_SAVINGS_APPLIED_FIELD_ID,
    );

    dispatch(updateUserViewedPriceInfo(userType, {
      productType,
      isJointDiscountApplied: Boolean(jointDiscountSavingsAppliedDisplayed && jointDiscountSavingsAppliedDisplayed?.innerHTML !== ''),
      jointDiscountSavingsApplied: parsePriceFormattedString(
        jointDiscountSavingsAppliedDisplayed?.innerHTML || '0',
      ),
      totalMonthlyNonDiscountedPrice: {
        [productType]: parsePriceFormattedString(
          totalMonthlyNonDiscountedPriceDisplayed?.innerHTML || '0',
        ),
      },
    }));
  }, []);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <SummaryRow>
        <Typography
          variant="body2"
          message={productTypeMap[productType]}
        />
      </SummaryRow>
      {productType === PM_PRODUCT_PREFIX.HD && (
        <CoverageItem
          message={
            <FormattedMessage id="disclosure_summary.monthlyPremium.csDEId" />
          }
          planAmountDisplay={planAmountCurrency}
          // DO NOT DELETE THIS ID
          // This ID is used to query/report the pricing details the user sees.
          // The BE flags an alert in sentry if the value is different from what
          // quote engine calculates as the user's price.
          priceId={TOTAL_MONTHLY_NON_DISCOUNTED_PRICE_FIELD_ID}
        />
      )}
    </div>
  );
};

export default ProductRow;
