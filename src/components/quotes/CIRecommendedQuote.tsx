import React from 'react';
import { Alert, AwardIcon, Spacer } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

export const CIRecommendedQuote = () => {
  return (
    <>
      <Alert
        icon={<AwardIcon />}
        type="tip"
        text={
          <FormattedMessage
            id="ciRecommendedQuote.recmdAmount.HqVflH"
            description="CI Recommended Quote Recmd Amount"
          />
      }
      />
      <Spacer size="spaceMedium" />
    </>
  );
};
