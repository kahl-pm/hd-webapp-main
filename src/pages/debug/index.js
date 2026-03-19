import React, { useEffect, useState } from 'react';

import { ROUTES } from '../../utils/const';
import { GLOBAL_ROUTE } from '../../../config/const';

const DebugPage = (props) => {
  const linkComponents = [];
  Object.entries(ROUTES)
    .forEach(([key, url]) => {
      if (url.includes('/debug')) {
        linkComponents.push(
          <p>
            <a href={`${GLOBAL_ROUTE}${url}`} target="_blank" rel="noreferrer">{key}</a>
          </p>,
        );
      }
    });
  return <>{
    linkComponents.length && linkComponents
  }</>;
};

DebugPage.displayName = 'Debug Page';

export default DebugPage;
