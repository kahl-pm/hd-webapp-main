import { css } from '@emotion/react';
import { useTheme } from '@mui/material';
import { Typography } from '@policyme/global-libjs-designsystem';
import React, { useContext } from 'react';

interface Props {
  children: React.ReactNode;
}

const UserLabelBadge = ({ children }: Props) => {
  const muiTheme = useTheme();
  const badge = css`
    display: inline-block;
    width: contain;
    padding: 0.25rem;
    @media (min-width:${muiTheme.breakpoints.values.md}px) {
      padding: 0.375rem 0.75rem;
    }
  `;
  return (
    <span css={badge}>
      <Typography
        variant="body1"
        message={children}
      />
    </span>
  );
};

export default UserLabelBadge;
