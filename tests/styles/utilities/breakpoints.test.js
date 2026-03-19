import breaks, { BREAKPOINTS, lg_up, md_up, sm_up, xl_up } from '../../../src/styles/utilities/breakpoints';

describe('Emotion breakpoints', () => {
  it('should have the correct sm breakpoint', () => {
    expect(breaks.sm).toBe('576px');
    expect(sm_up).toBe('(min-width: 576px)');
  });

  it('should have the correct md breakpoint', () => {
    expect(breaks.md).toBe('768px');
    expect(md_up).toBe('(min-width: 768px)');
  });

  it('should have the correct lg breakpoint', () => {
    expect(breaks.lg).toBe('992px');
    expect(lg_up).toBe('(min-width: 992px)');
  });

  it('should have the correct xl breakpoint', () => {
    expect(breaks.xl).toBe('1200px');
    expect(xl_up).toBe('(min-width: 1200px)');
  });

  it('should have the correct BREAKPOINTS array', () => {
    expect(BREAKPOINTS).toEqual([576, 768, 992, 1200]);
  });
});
