import React from 'react';

import WithWindowSize from './HOC/WithWindowSize';

interface CoverageBreakdownProps {
  cov_type: string;
  isSmUp: boolean; // From WithWindowSize
}

// Life/CI coverage breakdown removed for HD-only webapp
function CoverageBreakdown(_props: CoverageBreakdownProps) {
  return null;
}

export default WithWindowSize(CoverageBreakdown);
