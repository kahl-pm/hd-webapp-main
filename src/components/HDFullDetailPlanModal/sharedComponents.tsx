import { Typography, Row } from '@policyme/global-libjs-designsystem';
import React, { Children } from 'react';

export const SectionHeader = ({ children }) => {
  return (
    <Row sx={{ justifyContent: 'flex-start' }}>
      <Typography
        variant="h3"
        message={children}
      />
    </Row>
  );
};

// children: Any number of Typography components
export const SubSectionHeader = ({ children }) => {
  const justifyContentValue =
    Children.count(children) > 1 ? 'space-between' : 'flex-start';
  return (
    <Row
      sx={{
        justifyContent: justifyContentValue,
        padding: '1.5rem 1rem 0rem 2rem',
      }}
    >
      {children}
    </Row>
  );
};

export const SectionDetails = ({ children }) => {
  return <Row sx={{ padding: '0 1rem 0 2rem' }}>{children}</Row>;
};
