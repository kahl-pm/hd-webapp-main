import React, { Component } from 'react';
import { segmentTrackEvent, TENANT_FLAGS, hasFlag } from '@policyme/global-libjs-utils';

import ErrorBoundary from '../ErrorBoundary';

type State = {
  hasError: boolean;
  error: string;
};

class ErrorBoundaryHOC extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    // log additional errors
    console.error('[ErrorBoundaryHOC] Caught error:', error);
    console.error('[ErrorBoundaryHOC] Component stack:', errorInfo?.componentStack);
  }

  componentDidMount(): void {
    // log errors to analytics
    if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED) && this.state.hasError) {
      segmentTrackEvent('error', { error_type: 'load_error', error_details: this.state.error, error_source: 'others' });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundary
        error={this.state.error}
      />;
    }
    return this.props.children;
  }
}

export default ErrorBoundaryHOC;
