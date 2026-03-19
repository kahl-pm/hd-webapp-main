import React, { useContext } from 'react';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Typography, Button, PageContainer, MaxWidthContainer, Spacer } from '@policyme/global-libjs-designsystem';

import { handleMaxAttemptsClose } from '../../NewActions/auth0';
import { logout } from '../../NewActions/session';

// TODO move this component and its respective replica
//  currently residing in webapp-accounts to global-libjs-layout

const PRIMARY_HEADING = <FormattedMessage
  id="twoFactorMaxAttempts.primaryHeading.UO0WT7"
/>;

const TwoFactorMaxAttempts = (props) => {
  const dispatch = useDispatch();
  return (
    <PageContainer>
      <MaxWidthContainer width="md">
        <Typography
          variant="h1"
          message={PRIMARY_HEADING}
        />
        <Spacer size="spaceMedium" />
        <Typography
          variant="body1"
          message={<FormattedMessage id="twoFactorMaxAttempts.primaryBody.ypRYrT" />}
        />
        <Spacer size="spaceMedium" />
        <Button
          name="close"
          onClick={dispatch(logout)}
          data-cy="max-attempts-close"
        >
          <Typography
            variant="CTALargePrimary"
            message={<FormattedMessage id="global.close.OGkK7o" />}
          />
        </Button>
      </MaxWidthContainer>
    </PageContainer>
  );
};

export default TwoFactorMaxAttempts;
