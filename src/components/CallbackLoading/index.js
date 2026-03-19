import React, { useEffect } from 'react';
import { PageContainer, Progress } from '@policyme/global-libjs-designsystem';

const CallbackLoading = ({ callbackLogicHandler }) => {
  useEffect(() => {
    callbackLogicHandler();
  }, []);

  return (
    <PageContainer fullHeight>
      <center>
        <Progress name="loading" show />
      </center>
    </PageContainer>
  );
};

export default CallbackLoading;
