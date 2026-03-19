import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ActionItem, PenIcon, RightArrowIcon, FileTextIcon, OctagonAlertIcon, ShieldIcon } from '@policyme/global-libjs-designsystem';
import { useSelector, useDispatch } from 'react-redux';
import { segmentTrackEvent } from '@policyme/global-libjs-utils';
import { styled } from '@mui/material';

import { handleDownloadPolicyCoverageTerms, handleQADocumentDownload } from '../../NewActions/handle';
import { getMainProductEventPrefix, getDigitalConsentStatus } from '../../Selectors/helpers/productApp';

import { PM_PRODUCT_PREFIX, ProductType, UserType, DIGITAL_CONSENT_STATUS } from '../../utils/const';

import { usePricing } from '../HOC/WithPricing';

import EditProductCoverageModal from '../DecisionCard/EditProductCoverageModal';

type CardContentProps = {
  product: ProductType;
  userType: UserType;
  showEditButton: boolean;
}

/**
 * This is a temporary solution because we're styling icons
 * here as an edge case because lucide can't apply fills while
 * maintaining certain paths inside the svg.
 */
const SVGContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.icon.borderRadius,
  backgroundColor: theme.icon.frameBackgroundColor,
}));

const CardContent = (props: CardContentProps): React.JSX.Element => {
  const { product, userType, showEditButton } = props;

  const [isEditProductCoverageModalOpen, setIsEditProductCoverageModalOpen] = useState(false);
  const [isExclusionConsentModalOpen, setIsExclusionConsentModalOpen] = useState(false);

  const dispatch = useDispatch();
  const { pricing } = usePricing();

  // Accessing the data from the Redux store
  const firstName = useSelector((state) => state[userType].household.firstName);
  const mainProductEventPrefix = useSelector((state) => getMainProductEventPrefix(state, userType));
  const exclusions = useSelector(state => state[userType][`${product}Decision`].exclusions || []);
  const digitalConsentStatus = useSelector(
    state => getDigitalConsentStatus(state, userType, product),
  );
  const isConsented = digitalConsentStatus === DIGITAL_CONSENT_STATUS.CONSENTED;

  const { approvedLastMonthlyPayment, coverageAmtCurrency,
    term, coverageAmt, maxCoverageRounded } = pricing[userType][product];

  if (coverageAmt > maxCoverageRounded) {
    throw new Error(`Error: Coverage amount (${coverageAmt}) is greater than max coverage (${maxCoverageRounded})`);
  }

  return (<>
    {showEditButton && approvedLastMonthlyPayment && !isConsented && <ActionItem
      name="edit-coverage"
      variant="ghost"
      type="button"
      heading={<FormattedMessage id="ApprovedCard.editCoverage.f7kAuJ" />}
      subheading={<FormattedMessage
        id="ApprovedCard.coverageText.wlweBN"
        values={{
          coverageAmt: <strong>{coverageAmtCurrency}</strong>,
          term: <strong>{term}</strong>,
          isPermanent: false,
          b: chunks => <strong>{chunks}</strong>,
        }}
      />}
      icon={<SVGContainer><PenIcon variant="transparent" /></SVGContainer>}
      onClick={() => {
        segmentTrackEvent(`${mainProductEventPrefix} - MODAL - Edit ${mainProductEventPrefix} Coverage`, {});
        setIsEditProductCoverageModalOpen(true);
      }}
      secondaryIcon={RightArrowIcon}
      dataTestIdSubheading="approved-card-coverage-text"
      dataTestId="approved-card-edit"
      dataCy="edit-coverage"
    />}
    <ActionItem
      name="download-policy-coverage"
      variant="ghost"
      type="button"
      role="link"
      heading={<FormattedMessage id="digitalConsent.reviewCoverageTerms.XFA9GC" />}
      icon={<SVGContainer><ShieldIcon variant="transparent" /></SVGContainer>}
      secondaryIcon={RightArrowIcon}
      onClick={() => dispatch(handleDownloadPolicyCoverageTerms(userType, product))}
      dataCy="download-policy-coverage"
    />
    {!isConsented && <ActionItem
      name="download-q-and-a-document"
      variant="ghost"
      type="button"
      role="link"
      heading={<FormattedMessage id="digitalConsent.reviewApplicationAnswers.iLXhzX" />}
      icon={<SVGContainer><FileTextIcon variant="transparent" /></SVGContainer>}
      secondaryIcon={RightArrowIcon}
      onClick={() => dispatch(handleQADocumentDownload(product, userType))}
      dataCy="download-qa-document-dashboard"
    />}
    <ActionItem
      name="review-exclusions"
      variant="ghost"
      type="button"
      heading={<FormattedMessage id="digitalConsent.reviewExclusion.a8NXqM" />}
      icon={<SVGContainer><OctagonAlertIcon variant="transparent" /></SVGContainer>}
      secondaryIcon={RightArrowIcon}
      onClick={() => { setIsExclusionConsentModalOpen(isOpen => !isOpen); }}
      dataCy="review-exclusions"
    />

    {/* Modals */}
    {!isConsented && <EditProductCoverageModal
      isEditProductCoverageModalOpen={isEditProductCoverageModalOpen}
      product={product}
      userType={userType}
      coverageAmt={coverageAmt}
      term={term}
      updateCoverageAmountAndTermAndRequoteWithDebits={() => {}}
      setIsEditProductCoverageModalOpen={setIsEditProductCoverageModalOpen}
    />}
  </>);
};

export default CardContent;
