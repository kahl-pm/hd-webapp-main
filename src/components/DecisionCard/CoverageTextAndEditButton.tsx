import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { segmentTrackEvent } from '@policyme/global-libjs-utils';
import { PenIcon, TextButton, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

export default ({
  showEditButton,
  approvedLastMonthlyPayment,
  mainProductEventPrefix,
  coverageAmtCurrency,
  term,
  isPermanent,
  setIsEditProductCoverageModalOpen,
}) => {
  return (
    <UniformSpacingLayout flexDirection="row" justifyContent="space-between" alignItems="center" fullWidth>
      <Typography
        variant="body1"
        message={
          <FormattedMessage
            id="ApprovedCard.coverageText.wlweBN"
            values={{
              coverageAmt: <strong>{coverageAmtCurrency}</strong>,
              term: <strong>{term}</strong>,
              isPermanent,
              b: chunks => <strong>{chunks}</strong>,
            }}
          />
          }
      />
      {showEditButton && approvedLastMonthlyPayment &&
        <TextButton
          name="Edit Coverage"
          endIcon={<PenIcon variant="transparent" interactive />}
          label={<FormattedMessage id="global.edit.7cpJVX" />}
          onClick={() => {
            segmentTrackEvent(`${mainProductEventPrefix} - MODAL - Edit ${mainProductEventPrefix} Coverage`, {});
            setIsEditProductCoverageModalOpen(true);
          }}
          data-cy="edit-coverage"
          data-testid="approved-card-edit"
        />}
    </UniformSpacingLayout>
  );
};
