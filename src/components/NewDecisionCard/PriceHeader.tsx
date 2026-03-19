import React from 'react';
import { Typography, Divider, Tooltip, UniformSpacingLayout, Spacer, Row } from '@policyme/global-libjs-designsystem';
import { useTheme, styled } from '@mui/material';
import { ProductType } from '../../utils/const';

type PriceHeaderProps = {
  title: React.ReactNode;
  amount: string;
  frequency: React.ReactNode;
  product: ProductType;
  tootltipModalText?: React.ReactNode;
  segmentEventName?: string;
  tooltipButtonName?: string;
  tooltipHeader?: React.ReactNode;
  dense?: boolean;
};

const PriceHeader = (props: PriceHeaderProps) => {
  const {
    title,
    amount,
    frequency,
    product,
    tootltipModalText,
    tooltipHeader,
    segmentEventName,
    tooltipButtonName,
    dense,
  } = props;

  const theme = useTheme();

  return (
    <UniformSpacingLayout dense={dense} flexDirection="column">
      <Row sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Row sx={{ alignItems: 'center' }}>
          <Typography
            variant="body3"
            data-cy="todayPaymentText"
            message={title}
          />
          {tootltipModalText && <Tooltip
            variant="icon-only"
            tooltipButtonName={tooltipButtonName}
            tooltipHeader={tooltipHeader}
            ariaLabelledBy="rate-change-tooltip"
            ariaDescribedBy="rate-change-content"
            segmentPayload={{
              name: 'Rate Changed',
              product_type: product,
            }}
          >
            {tootltipModalText}
          </Tooltip>}
        </Row>
        <Row sx={{ alignItems: 'baseline' }} data-testid="approved-rate-price" data-cy="approved-rate-price">
          <Typography
            variant="h3"
            message={amount}
            component="p"
          />
          <Typography
            variant="body3"
            color={theme.palette.text.secondary}
            message={frequency}
          />
        </Row>
      </Row>
      {!tootltipModalText && <Spacer size="space2XS" />}
      <Divider />
      <Spacer size="space2XS" />
    </UniformSpacingLayout>
  );
};

export default PriceHeader;
