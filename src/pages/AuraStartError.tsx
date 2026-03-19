import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { getUrls } from '@policyme/global-libjs-utils';
import {
  Button, isMobile, MaxWidthContainer, PageContainer, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import BottomNavigation from '../components/BottomNavigation';

const AuraStartError = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer>
        <MaxWidthContainer width="xl" bgcolor="paper">
          <UniformSpacingLayout flexDirection="column" gap="2rem" alignItems="center">
            <Typography
              message={<>
                <FormattedMessage
                  id="auraStartError.inconvenience.gWW1AV"
                />!
              </>}
              variant="h1"
              align="center"
            />
            <Typography
              variant="h2"
              message={<FormattedMessage
                id="auraStartError.maintenance.Z0O9QA"
              />}
              align="center"
            />
            <MaxWidthContainer width="lg" bgcolor="paper">
              <Typography
                message={<>
                  <FormattedMessage
                    id="auraStartError.serve.6X5x3Z"
                  />{' '}
                  <FormattedMessage
                    id="auraStartError.checkTomorrow.2mOp5P"
                  />
                </>}
                variant="body1"
                align="center"
              />
            </MaxWidthContainer>
            <MaxWidthContainer width="md" bgcolor="paper">
              <Button
                role="link"
                href={getUrls().homepage}
                ariaLabel="Redirect to homepage"
                hidden={isMobile()}
                ref={buttonRef}
              >
                <Typography
                  message={<FormattedMessage
                    id="auraStartError.backButtonText.x3SFGG"
                  />}
                  variant="CTALargePrimary"
                />

              </Button>
            </MaxWidthContainer>
          </UniformSpacingLayout>
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} />
    </>
  );
};

export default AuraStartError;
