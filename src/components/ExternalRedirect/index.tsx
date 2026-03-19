import React, { useEffect } from 'react';

export default function ExternalRedirect({ redirectTo }) {
  useEffect(() => {
    if (window?.location) {
      window.location.replace(redirectTo);
    }
  }, [redirectTo]);
  return null;
}
