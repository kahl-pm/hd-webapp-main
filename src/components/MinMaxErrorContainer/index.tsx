import { FormHelperText, styled } from '@mui/material';
// TODO: this needs to be moved to the design system

export const MinMaxErrorContainer = styled(FormHelperText)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.1875rem',
  fontSize: theme.typography.body4.fontSize,
}));
