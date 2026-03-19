import React from 'react';
import { Typography, Button, UniformSpacingLayout, MaxWidthContainer, Spacer, PageContainer } from '@policyme/global-libjs-designsystem';
import { getUrls } from '@policyme/global-libjs-utils';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material';

import { getDecisionPageProps } from '../../Selectors/decisionPage';
import { journeyIngress } from '../../NewActions/session';

import { JOURNEY_INGRESS_POINTS, USER_TYPES, ProductType, UserType } from '../../utils/const';

import { updateUserControlProp } from '../../NewActions/userControl';
import SpeakToExperts from '../SpeakToExperts';
import { State } from '../../store/types/State';

type ThankYouProps = {
  product: ProductType;
  userType: UserType;
  showBackToDash: boolean;
  hasPartnerApplication: boolean;
};

const ThankYou = (props: ThankYouProps) => {
  const { product, userType, showBackToDash, hasPartnerApplication } = props;

  const dispatch = useDispatch();
  const theme = useTheme();

  const {
    [userType]: {
      paymentInitialCompleted,
      first_name,
    },
  } = useSelector<any, any>(state => getDecisionPageProps(state));

  const partnerUserType =
    userType === USER_TYPES.PRIMARY
      ? USER_TYPES.SECONDARY
      : USER_TYPES.PRIMARY;

  const {
    [partnerUserType]: {
      first_name: partnerFirstName,
    },
  } = useSelector((state: State) => getDecisionPageProps(state));

  const handleClick = () => {
    dispatch(updateUserControlProp('dashboardUser', partnerUserType));
    dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
  };

  const isPaymentCompletedForCurrentUser = paymentInitialCompleted;

  //  the showBackToDash already checks if the user is joint and if one of the partners
  //  payment is pending thus no need to check that here and just get the partner name
  //  based on if the current user has made the payment or not.
  const partnerNameToDisplay = isPaymentCompletedForCurrentUser ? partnerFirstName : first_name;

  const showPartnerhint = showBackToDash;

  const ThankYouTabDetails = () => {
    return (
      <>
      </>
    );
  };

  return (
    <PageContainer textAlign="left" fullHeight>
      <MaxWidthContainer width="md">
        <Typography
          variant="h1"
          message={<FormattedMessage id="thankyouDefault.heading.F0a5Co" />}
          mb={theme.spacer.spaceSmall}
          align="center"
        />
        <Typography
          variant="body1"
          message={<FormattedMessage id="thankyouHD.confirmationText.vBvq61" />}
          mb={showPartnerhint ? theme.spacer.spaceSmall : theme.spacer.spaceMedium}
          align="center"
        />
        <MaxWidthContainer width="sm">
          <Button ariaLabel="go to accounts" href={`${getUrls().accounts}`}>
            <Typography
              variant="CTALargePrimary"
              message={
                <FormattedMessage id="thankyouHD.goToAccount.t76aZ6" />
              }
            />
          </Button>
        </MaxWidthContainer>
        <Spacer size="spaceMedium" />
        {showPartnerhint && (
          <Typography
            variant="h2"
            message={
              <FormattedMessage
                id="thankyouCofirming.activatePartner.rt5Ar1"
                values={{
                  partnerName: partnerNameToDisplay,
                }}
              />
            }
            mb={theme.spacer.spaceMedium}
            align="center"
          />
        )}
        <UniformSpacingLayout flexDirection="column" gap={theme.spacer.spaceMedium}>
          {showPartnerhint ? (
            <Button
              variant="primary"
              onClick={handleClick}
              dataCy="submit"
              name="thank-you-joint"
            >
              <Typography
                variant="CTALargePrimary"
                message={
                  <FormattedMessage
                    id="thankyouDefault.backToDecisionCta.wtAKM8"
                    values={{
                      partnerName: partnerNameToDisplay,
                    }}
                  />
                }
              />
            </Button>
          ) : null}
          {(showPartnerhint || !hasPartnerApplication) && <ThankYouTabDetails />}
          <div>
            <SpeakToExperts postDecision />
          </div>
        </UniformSpacingLayout>
      </MaxWidthContainer>
    </PageContainer>
  );
};

export default ThankYou;
