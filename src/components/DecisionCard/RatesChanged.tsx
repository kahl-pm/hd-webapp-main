import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { css } from '@emotion/react';
// import RatesChangedIcon from '../ThemedSvgs/IconRatesChanged';
// import Tooltip from '../Tooltip';
import { InfoIcon, Tooltip, Typography } from '@policyme/global-libjs-designsystem';
import RatesChangedModal from '../RatesChangedModal';
import DetailItem from './DetailsItem';

export default ({
  firstName,
  mainProductEventPrefix,
  product,
  hasRatings,
  smokingDiscrepancyFlag,
  showEditButton,
  approvedLastMonthlyPayment,
}) => {
  return (
    <DetailItem Icon={InfoIcon}>
      <div>
        <div>
          <Tooltip
            tooltipHeader={<span>
              {firstName ? <FormattedMessage
                id="ApprovedCard.headerText.1GYbaG"
                values={{ name: `${firstName}`, lineBreak: <br /> }}
              /> : <FormattedMessage id="ApprovedCard.headerText.EfBZO0" values={{ lineBreak: <br /> }} />}
            </span>}
            tooltipButtonLabel="Rates Changed"
            variant="icon-and-text"
            tooltipButtonName="Rates Changed"
            segmentPayload={{
              name: `${mainProductEventPrefix} - TOOLTIP Rates Changed`,
              product_type: product,
            }}
            ariaDescribedBy="rates-changed-tooltip"
            ariaLabelledBy="rates-changed-tooltip"
          >
            <RatesChangedModal
              hasRatings={hasRatings}
              smokingDiscrepancyFlag={smokingDiscrepancyFlag}
            />
          </Tooltip>
        </div>
        { showEditButton && approvedLastMonthlyPayment &&
          <span>
            <Typography
              variant="body3"
              message={<FormattedMessage id="ApprovedCard.editCoverage.DthXsF" />}
            />
          </span> }
      </div>
    </DetailItem>
  );
};
