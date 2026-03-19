import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { MaxWidthContainer, PageContainer, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { hasFlag, TENANT_FLAGS, segmentTrackEvent } from '@policyme/global-libjs-utils';
import { sendEventAll } from '../../NewActions/analytics';
import { getMainProduct, getMainProductEventPrefix, ProductPrefix } from '../../Selectors/helpers/productApp';
import { ThankYouCelebration } from '../ThemedSvgs/blobbies';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import SpeakToExperts from '../SpeakToExperts';
import BackToCouplesDashboard from '../BackToCouplesDashboard/index';
import BottomNavigation from '../BottomNavigation';
import { State } from '../../store/types/State';

interface Props {
  showBackToDash: boolean;
}

const ThankYouComponent = (props: Props) => {
  const dispatch = useDispatch();
  const mainProduct = useSelector<State, ProductPrefix>(
    state => getMainProduct(state, state.userControl.dashboardUser),
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const productPrefix = useSelector<any, string>(
    state => getMainProductEventPrefix(state, state.userControl.dashboardUser),
  );
  useEffect(() => {
    if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
      segmentTrackEvent('policy_settled', { product_type: mainProduct });
    } else {
      dispatch(sendEventAll(`${productPrefix} - Policy Settled`));
    }
  }, []);

  return (
    <>
      <PageContainer fullHeight>
        <MaxWidthContainer width="md">
          <Typography
            variant="h1"
            message={<FormattedMessage id="thankyouDefault.heading.F0a5Co" />}
          />
          <Spacer size="spaceSmall" />
          <Typography
            variant="h2"
            message={mainProduct === PM_PRODUCT_PREFIX.HD
              ? <FormattedMessage id="thankyouHD.subheading.R2zAr5" />
              : <FormattedMessage id="thankyouDefault.subheading.Oieg51" />}
          />
          <Spacer size="spaceMedium" />
          <MaxWidthContainer width="sm">
            <ThankYouCelebration />
          </MaxWidthContainer>
          <Spacer size="spaceMedium" />
          <Typography
            variant="body1"
            component="p"
            message={mainProduct === PM_PRODUCT_PREFIX.HD
              ? <FormattedMessage id="thankyouHD.confirmationText.vBvq61" />
              : <FormattedMessage
                  id="checkoutpage.ConfirmationText.GgcgG0"
                  values={{
                    b: (chunks) => <strong>{chunks}</strong>,
                  }}
              />}
          />
          {
            props.showBackToDash && (
              <>
                <Spacer size="spaceMedium" />
                <BackToCouplesDashboard buttonRef={buttonRef} />
              </>
            )
          }
          <Spacer size="spaceMedium" />
          <SpeakToExperts headingTag="h2" postDecision />
        </MaxWidthContainer>
      </PageContainer>
      {props.showBackToDash && <BottomNavigation buttonRef={buttonRef} position="sticky" />}
    </>
  );
};

export default ThankYouComponent;
