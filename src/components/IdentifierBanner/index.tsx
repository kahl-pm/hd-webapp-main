import React from 'react';
import {
  Avatar, HighlightedRow, MaxWidthContainer, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

interface IdentifierBannerProps {
  userInfo: {
    firstName: string;
    lastName: string;
    userPosition: number;
  }
}

const IdentifierBanner = ({ userInfo }: IdentifierBannerProps) => {
  const NameSection = () => (
    <UniformSpacingLayout flexDirection="column" alignItems="flex-start" gap="0.25rem">
      <Typography
        message={
          <FormattedMessage id="identifierBanner.questionAbout.26Mu96" />
        }
        variant="body2Bold"
        component="h2"
      />
      <Typography
        message={
          userInfo.firstName
        }
        variant="h3"
      />
    </UniformSpacingLayout>
  );
  const initials = `${(userInfo?.firstName?.[0] || '').toUpperCase()}`
    + `${(userInfo?.lastName?.[0] || '').toUpperCase()}`;

  const AvatarSection = () => (
    <Avatar variant="tag" index={userInfo.userPosition} content={initials} />
  );

  if (userInfo?.userPosition % 2 === 0) {
    return (
      <MaxWidthContainer width="md">
        <HighlightedRow>
          <UniformSpacingLayout justifyContent="space-between" gap="1rem" alignItems="center">
            <NameSection />
            <AvatarSection />
          </UniformSpacingLayout>
        </HighlightedRow>
      </MaxWidthContainer>
    );
  }
  return (
    <MaxWidthContainer width="md">
      <HighlightedRow>
        <UniformSpacingLayout justifyContent="flex-start" gap="1rem" alignItems="center">
          <AvatarSection />
          <NameSection />
        </UniformSpacingLayout>
      </HighlightedRow>
    </MaxWidthContainer>
  );
};

export default IdentifierBanner;
