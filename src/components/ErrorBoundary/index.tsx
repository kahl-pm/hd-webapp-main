import React, { useEffect } from 'react';
import { Typography, PageContainer, MaxWidthContainer, Spacer, UniformSpacingLayout, TextButton } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

import { sentryFatalError } from '@policyme/global-libjs-utils';

const ErrorBoundary = ({ error }) => {
  useEffect(() => {
    sentryFatalError(error);
  }, [error]);

  const goBack = () => {
    // eslint-disable-next-line no-restricted-globals
    history.back();
  };

  const refresh = () => window.location.reload();
  return (
    <PageContainer noBackground>
      <UniformSpacingLayout flexDirection="column" justifyContent="center" alignItems="center">
        <MaxWidthContainer width="lg" bgcolor="card">
          <Typography
            variant="h1"
            message={<FormattedMessage
              id="errorBoundary.somethingWentWrong.ia7hEN"
            />}
          />
          <Spacer size="spaceMedium" />
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="errorBoundary.body.hC5X9O"
                values={{
                  a1: chunks => <TextButton variant="inline" name="goBack" onClick={() => goBack()} label={chunks} />,
                  a2: chunks => <TextButton variant="inline" name="retry" onClick={() => refresh()} label={chunks} />,
                }}
              />
        }
          />
        </MaxWidthContainer>
      </UniformSpacingLayout>
    </PageContainer>
  );
};

export default ErrorBoundary;
