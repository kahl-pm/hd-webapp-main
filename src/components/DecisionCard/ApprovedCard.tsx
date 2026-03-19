/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { AwardIcon, Divider, ShieldCheckIcon, ShieldIcon, Tooltip, Typography, UniformSpacingLayout, XIcon } from '@policyme/global-libjs-designsystem';
import WhatsCoveredModal from '../WhatsCoveredModal';
import { usePricing } from '../HOC/WithPricing';
import { Customisable, CustomisationSlot } from '../Customisation';
import { PM_PRODUCT_PREFIX, ProductType, USER_TYPES, UserType } from '../../utils/const';
import { isJoint as isJointSelector, showPartnerDiscountUI as showPartnerDiscountUISelector } from '../../Selectors/userControl';
import { getProductDiscountCodes } from '../../Selectors/helpers/productSession';
import { isAfterSellCIJourney, getMainProductEventPrefix, getMainProduct } from '../../Selectors/helpers/productApp';
import { getMaxEligibleTerm } from '../../Selectors/eligibility';
import ExclusionsTooltip from './ExclusionsTooltip';
import CoverageTextAndEditButton from './CoverageTextAndEditButton';
import EditProductCoverageModal from './EditProductCoverageModal';
import DiscountsUIText from './DiscountsUIText';
import RatesChanged from './RatesChanged';
import RateText from './RateText';
import DetailItem from './DetailsItem';
import { formatCurrencyWithNotationsConfig } from '../../utils/reactIntlHelpers';
import { ExclusionItem } from '../../utils/types';

import { getProductDecisionData } from '../../Selectors/decisionPage';

const ApprovedCard = ({
  showEditButton,
  userType,
  product,
  hideWhatsCoveredAndNotCoveredDetails,
  hideDetailsSection,
}:InferProps<typeof propTypes>) => {
  const intl = useIntl();
  const exclusions = useSelector<any, Array<ExclusionItem>>(state => state[userType][`${product}Decision`].exclusions);
  const { firstName, maxEligibleTerm, isAfterSellCI,
    hdDiscountCodes, isJoint,
    showPartnerDiscountUI, beneficiariesCompleted,
    mainProductEventPrefix } = useSelector(state => mapStateToProps(state, userType, product));
  const { pricing } = usePricing();
  const { preDecisionLastPaymentCurrency, approvedLastMonthlyPayment,
    approvedLastMonthlyPaymentCurrency, maxCoverageRounded, coverageAmtCurrency, term,
    approvedFirstMonthlyPaymentCurrency, coverageAmt } = pricing[userType][product];
  const [isEditProductCoverageModalOpen, setIsEditProductCoverageModalOpen] = useState(false);
  const [isExclusionConsentModalOpen, setIsExclusionConsentModalOpen] = useState(false);
  const {
    totalDebits,
    flatExtraDebits,
    smokingDiscrepancyFlag,
    hasRatingsOrSmokingDiscrepancy,
  } = useSelector((state) => getProductDecisionData(state, userType, product));
  const hasProductJointDiscount = false;

  const CustomisableWhatsCoveredModal = Customisable(WhatsCoveredModal);

  return (<>
    <CoverageTextAndEditButton
      showEditButton={showEditButton}
      approvedLastMonthlyPayment={approvedLastMonthlyPayment}
      mainProductEventPrefix={mainProductEventPrefix}
      coverageAmtCurrency={coverageAmtCurrency}
      term={term}
      isPermanent={false}
      setIsEditProductCoverageModalOpen={setIsEditProductCoverageModalOpen}
    />
    {!hideDetailsSection && (
      <UniformSpacingLayout flexDirection="column" gap="0.5rem">
        {!(totalDebits || flatExtraDebits > 0) && <DetailItem
          Icon={AwardIcon}
        >
          <Typography
            variant="body2"
            message={
              <FormattedMessage
                id="ApprovedCard.eligibleForUpTo.tv4hyk"
                values={{
                  coverage: intl.formatNumber(maxCoverageRounded, formatCurrencyWithNotationsConfig),
                  b: chunks => <strong>{chunks}</strong>,
                  maxEligibleTerm,
                  showEligibleTerm: false,
                }}
              />
            }
          />
        </DetailItem>}
        {(!hideWhatsCoveredAndNotCoveredDetails) && <>
          <DetailItem Icon={ShieldCheckIcon}>
            <Tooltip
              tooltipHeader={<FormattedMessage
                id="ApprovedCard.coveredText.2qZNi1"
                values={{ hasFirstName: !!firstName, firstName }}
              />}
              segmentPayload={{
                name: 'WhatsCovered',
                product_type: product,
              }}
              tooltipButtonName="whats-covered-tooltip"
              tooltipButtonLabel={intl.formatMessage({
                id: 'ApprovedCard.whatsCovered.S5OHCU',
              })}
              variant="icon-and-text"
              ariaDescribedBy="whats-covered-tooltip"
              ariaLabelledBy="whats-covered-tooltip"
            >
              <CustomisableWhatsCoveredModal
                  exclusionsCount={(exclusions && exclusions.length) || 0}
                  coverageAmount={coverageAmtCurrency}
                  termLength={term}
                  discountCodes={hdDiscountCodes}
                  isPermanentInsurance={false}
                />
            </Tooltip>
          </DetailItem>
          <DetailItem Icon={ShieldIcon}>
            <ExclusionsTooltip
              firstName={firstName}
              mainProductEventPrefix={mainProductEventPrefix}
              product={product}
              exclusions={exclusions}
              isPermanent={false}
              noteText={exclusions && !!exclusions.length && <FormattedMessage
                id="ApprovedCard.readMore.PcJMeu"
                values={{
                  exclusionsCount: ` ${exclusions.length + 1}`,
                }}
              />}
            />
          </DetailItem>
        </>}
        {hasRatingsOrSmokingDiscrepancy && !isAfterSellCI && <RatesChanged
          firstName={firstName}
          mainProductEventPrefix={mainProductEventPrefix}
          product={product}
          hasRatings={totalDebits || flatExtraDebits > 0}
          smokingDiscrepancyFlag={smokingDiscrepancyFlag}
          showEditButton={showEditButton}
          approvedLastMonthlyPayment={approvedLastMonthlyPayment}
        />}
        <CustomisationSlot name="approved-additional-details"><></></CustomisationSlot>
      </UniformSpacingLayout>
    )}
    <Divider />
    <RateText
      product={product}
      mainProductEventPrefix={mainProductEventPrefix}
      approvedLastMonthlyPayment={approvedLastMonthlyPayment}
      approvedLastMonthlyPaymentCurrency={approvedLastMonthlyPaymentCurrency}
      preDecisionLastPaymentCurrency={preDecisionLastPaymentCurrency}
      approvedFirstMonthlyPaymentCurrency={approvedFirstMonthlyPaymentCurrency}
      isJoint={isJoint}
      hasProductJointDiscount={hasProductJointDiscount}
      rateText={<FormattedMessage id="ApprovedCard.yourRate.I0WYB6" />}
    />
    <DiscountsUIText
      showPartnerDiscountUI={showPartnerDiscountUI}
      isJoint={isJoint}
      hasProductJointDiscount={hasProductJointDiscount}
      approvedLastMonthlyPayment={approvedLastMonthlyPayment}
      approvedLastMonthlyPaymentCurrency={approvedLastMonthlyPaymentCurrency}
      preDecisionLastPaymentCurrency={preDecisionLastPaymentCurrency}
    />
    <EditProductCoverageModal
      isEditProductCoverageModalOpen={isEditProductCoverageModalOpen}
      product={product}
      userType={userType}
      coverageAmt={coverageAmt}
      term={term}
      updateCoverageAmountAndTermAndRequoteWithDebits={() => {}}
      setIsEditProductCoverageModalOpen={setIsEditProductCoverageModalOpen}
    />
  </>);
};

const propTypes = {
  userType: PropTypes.oneOf<UserType>(Object.values(USER_TYPES)).isRequired,
  showEditButton: PropTypes.bool,
  product: PropTypes.oneOf<ProductType>(Object.values(PM_PRODUCT_PREFIX)).isRequired,
  hideWhatsCoveredAndNotCoveredDetails: PropTypes.bool,
  hideDetailsSection: PropTypes.bool,
};
ApprovedCard.propTypes = propTypes;
ApprovedCard.defaultProps = {
  showEditButton: false,
  hideWhatsCoveredAndNotCoveredDetails: false,
  hideDetailsSection: false,
};

const mapStateToProps = (state:any, userType:string, product:string) => {
  return {
    firstName: state[userType].household.firstName,
    showPartnerDiscountUI: showPartnerDiscountUISelector(
      state,
      userType,
      getMainProduct(state, state.userControl.currentUser),
    ),
    isJoint: isJointSelector(state),
    beneficiariesCompleted: false,
    hdDiscountCodes: getProductDiscountCodes(state, userType, PM_PRODUCT_PREFIX.HD),
    isAfterSellCI: isAfterSellCIJourney(state, userType),
    mainProductEventPrefix: getMainProductEventPrefix(state, userType),
    maxEligibleTerm: getMaxEligibleTerm(state, PM_PRODUCT_PREFIX.HD),
  };
};

export default ApprovedCard;
