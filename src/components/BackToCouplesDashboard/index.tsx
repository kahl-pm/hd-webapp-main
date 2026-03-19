import React from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Card, isMobile, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { JointIllustration } from '../ThemedSvgs/JointContextSlide5';
import { JOURNEY_INGRESS_POINTS } from '../../utils/const';
import { journeyIngress } from '../../NewActions/session';

interface BackToCouplesDashboardProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const BackToCouplesDashboard: React.FC<BackToCouplesDashboardProps> = (props) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(journeyIngress(JOURNEY_INGRESS_POINTS.DECISION));
  };

  return (
    <>
      <Card
        cardVariant="only-heading"
        heading={
          <Typography
            variant="h3"
            message={<FormattedMessage id="backToCouplesDashboard.heading.OB58ki" />}
            align="center"
          />
        }
        body={
          <>
            <Spacer size="spaceMedium" />
            <JointIllustration />
            <Spacer size="spaceMedium" />
            <Button
              onClick={handleClick}
              variant="primary"
              type="button"
              name="backToCouplesDashboard"
              hidden={isMobile()}
              ref={props.buttonRef}
            >
              <Typography
                variant="CTALargePrimary"
                message={<FormattedMessage id="backToCouplesDashboard.buttonCta.AcqjqX" />}
              />
            </Button>
          </>
        }
      />
    </>
  );
};

export default BackToCouplesDashboard;
