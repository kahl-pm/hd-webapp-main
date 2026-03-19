import React from 'react';
import { Stack } from '@mui/material';

export const CoverageList = ({ children }) => (
  <Stack component="ul" spacing="0.5rem" pl="1.5rem">
    {children}
  </Stack>
);
