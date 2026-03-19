import React from 'react';
import {
  CustomizableBox, Spacer, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { CUSTOMIZABLE_BOX_SIZES } from '@policyme/global-libjs-designsystem/const';

type InputRowProps = React.PropsWithChildren<{
  label: React.ReactNode;
  labelComponent?: string;
  tooltip?: React.ReactNode;
  inputWidth?: keyof typeof CUSTOMIZABLE_BOX_SIZES;
  // Allows us to toggle the fullWidth option, default true.
  disableInputFullWidth?: boolean;
}>

const InputRow = ({
  label,
  labelComponent,
  children,
  tooltip,
  inputWidth = 'sm',
  disableInputFullWidth = false,
}: InputRowProps) => {
  return (
    <UniformSpacingLayout justifyContent="space-between" alignItems="center" gap="0.5rem">
      <Typography
        message={label}
        component={labelComponent}
        variant="h4"
        tooltip={tooltip}
        align="left"
      />
      {/* Making the input field wrapper box fullWidth by default due width issue in Safari */}
      <CustomizableBox width={inputWidth} fullWidth={!disableInputFullWidth}>
        <Spacer size="spaceSmall" />
        {children}
      </CustomizableBox>
    </UniformSpacingLayout>
  );
};

export default InputRow;
