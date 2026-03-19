// React Universal Componener error component
// If this appears it means a chunk was not able to be loaded and we have no way to recover
// RUC has no retry function, a workaround is to pass the original component to the error prop
// which triggers another request

import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

export default function render({ error }) {
  return <ErrorBoundary
    error={error}
  />;
}
