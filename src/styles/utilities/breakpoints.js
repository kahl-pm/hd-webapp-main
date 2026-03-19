const breaks = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};
export default breaks;

export const sm_up = `(min-width: ${breaks.sm})`;
export const md_up = `(min-width: ${breaks.md})`;
export const lg_up = `(min-width: ${breaks.lg})`;
export const xl_up = `(min-width: ${breaks.xl})`;

export const BREAKPOINTS = [576, 768, 992, 1200];
