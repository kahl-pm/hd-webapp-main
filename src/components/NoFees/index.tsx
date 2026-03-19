import { UniformSpacingLayout, AwardIcon, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import React from 'react';

const NoFees = () => {
  return (
    <UniformSpacingLayout
      flexDirection="row"
      gap="1rem"
    >
      {/** @ts-ignore desktop is not a valid size */}
      <AwardIcon size="desktop" />
      <Typography
        align="left"
        variant="body3"
        message={<FormattedMessage id="startApp.noFees.HdhbFg" />}
      />
    </UniformSpacingLayout>
  );
};

export default NoFees;
