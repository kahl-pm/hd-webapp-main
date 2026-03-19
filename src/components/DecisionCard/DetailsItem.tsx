import { UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import React from 'react';

interface DetailItemProps {
  Icon: React.JSXElementConstructor<any>;
  children: React.ReactNode;
  marginBottom?: boolean;

}
const DetailItem = ({
  Icon,
  children,
  marginBottom = false,
}: DetailItemProps) => {
  return (
    <UniformSpacingLayout flexDirection="row" alignItems="center" fullWidth justifyContent="flex-start" gap="0.5rem">
      {Icon && <Icon />}
      {children}
    </UniformSpacingLayout>
  );
};

export default DetailItem;
