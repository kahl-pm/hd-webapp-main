import { createTheme } from '@mui/material';

const defaultTheme = createTheme();
const defaultShadows = [...defaultTheme.shadows];

// NOTE: DO NOT MODIFY/UPDATE THIS FILE WITH ANY NEW THEME CONFIG.
// THE NEW MUI THEME CONFIG LIVES IN LIBJS-DESIGN-SYSTEM
export const muiTheme = createTheme({
  shadows: defaultShadows.map(() => 'none'),
  breakpoints: {
    // adding additional breakpoints for mobile, landscape, tablet, desktop
    // these are used in the design system, we need it in both places
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      mobile: 360,
      landscape: 568,
      tablet: 768,
      desktop: 1025,
    },
  },
});
