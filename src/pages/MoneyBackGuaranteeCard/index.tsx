import React from 'react';
import { Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

const CancelOnlyLine = () => (
  <Typography
    variant="body2"
    message={
      <FormattedMessage
        id="moneyBack.cancelAnytime.dtWDO0"
      />
    }
  />
);

const MoneyBackGuaranteeCard = ({ showCancelLineOnly = false }: {
  showCancelLineOnly?: boolean;
}) => {
  if (showCancelLineOnly) return <CancelOnlyLine />;
  return (
    <UniformSpacingLayout flexDirection="row" gap="0.2rem">
      <Typography
        variant="body2"
        message={
          <>
            <FormattedMessage
              id="global.moneyBack.ltHgH4"
              values={{
                b: chunks => <strong>{chunks}</strong>,
              }}
            />
          </>
        }
      />

    </UniformSpacingLayout>
  );
};

export default MoneyBackGuaranteeCard;
