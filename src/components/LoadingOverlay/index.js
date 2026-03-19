import React, { useEffect, useRef } from 'react';

import { Progress } from '@policyme/global-libjs-designsystem';

const LoadingComponent = () => {
  return (
    <Progress name="loading" variant="fullScreen" show />
  );
};

export default LoadingComponent;
