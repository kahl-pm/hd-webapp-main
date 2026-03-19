import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// import WhatsNotCoveredIcon from '../ThemedSvgs/IconWhatsNotCovered';
import { Tooltip, Typography } from '@policyme/global-libjs-designsystem';
import WhatsNotCoveredModal from '../WhatsNotCoveredModal';

export default ({
  firstName, mainProductEventPrefix, product,
  exclusions, noteText, isPermanent,
}) => {
  const intl = useIntl();
  return (
    <div>
      <div>
        <Tooltip
          tooltipHeader={
            <span>
              {firstName ? <FormattedMessage
                id="ApprovedCard.header.sY9TF3"
                values={{ name: `${firstName}` }}
              /> : <FormattedMessage
                id="ApprovedCard.header.SfXh9j"
              />}
            </span>
          }
          segmentPayload={{
            name: `${mainProductEventPrefix} - TOOLTIP Whats Not Covered`,
            product_type: product,
          }}
          ariaDescribedBy="whats-not-covered-tooltip"
          ariaLabelledBy="whats-not-covered-tooltip"
          variant="icon-and-text"
          tooltipButtonLabel={
              intl.formatMessage(
                { id: 'ApprovedCard.tooltipContent.GK7RTI' },
                { span: chunks => <span>{chunks}</span> as any },
              )
            }
          tooltipButtonName="Whats Not Covered"
        >
          <WhatsNotCoveredModal exclusions={exclusions} isPermanentInsurance={isPermanent} />
        </Tooltip>
      </div>
      <div>
        {exclusions && !!exclusions.length && (
          <span>
            { noteText }
          </span>
        )}
      </div>
    </div>
  );
};
