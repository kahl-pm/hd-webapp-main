import { Badge, Card, Divider, FlexHtoVTablet, MaxWidthContainer, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const NextSteps = () => (
  <>
    <Typography
      variant="h2"
      align="center"
      message={<FormattedMessage
        id="startAppJoint.applyIndividual.vEaXZq"
      />}
    />
    <Spacer size="spaceMedium" />
    <MaxWidthContainer width="xl">
      <FlexHtoVTablet gap="1rem">
        <Card
          cardVariant="heading-and-outer-badge"
          heading={
            <Typography
              variant="body1Bold"
              align="left"
              message={<FormattedMessage
                id="jointContextCarousel.headerTextNotAuthSlide1.4xLblb"
              />}
            />
          }
          badges={<Badge
            variant="tip"
            label={
              <FormattedMessage
                id="jointContextCarousel.stepCounter.7WutV8"
                values={{ slideNum: 1 }}
              />
            }
          />}
          positioning="outer"
          body={
            <>
              <Divider />
              <Typography
                variant="body2"
                align="left"
                message={<FormattedMessage
                  id="jointContextCarousel.additionalTextNotAuthSlide1.RmJZVH"
                />}
              />
            </>
          }
          fullWidth
          fullHeight={false}
        />
        <Card
          cardVariant="heading-and-outer-badge"
          heading={
            <Typography
              variant="body1Bold"
              align="left"
              message={<FormattedMessage
                id="jointContextCarousel.headerTextNotAuthSlide2.D1sY0h"
              />}
            />
          }
          badges={<Badge
            variant="tip"
            label={
              <FormattedMessage
                id="jointContextCarousel.stepCounter.7WutV8"
                values={{ slideNum: 2 }}
              />
            }
          />}
          positioning="outer"
          body={
            <>
              <Divider />
              <Typography
                variant="body2"
                align="left"
                message={<FormattedMessage
                  id="jointContextCarousel.additionalTextNotAuthSlide2.utE6di"
                />}
              />
            </>
          }
          fullWidth
          fullHeight={false}
        />
        <Card
          cardVariant="heading-and-outer-badge"
          heading={
            <Typography
              variant="body1Bold"
              align="left"
              message={<FormattedMessage
                id="jointContextCarousel.headerTextNotAuthSlide3.AuPmHu"
              />}
            />
          }
          badges={<Badge
            variant="tip"
            label={
              <FormattedMessage
                id="jointContextCarousel.stepCounter.7WutV8"
                values={{ slideNum: 3 }}
              />
            }
          />}
          positioning="outer"
          body={
            <>
              <Divider />
              <Typography
                variant="body2"
                align="left"
                message={<FormattedMessage
                  id="jointContextCarousel.additionalTextNotAuthSlide3.IPZkkn"
                />}
              />
            </>
          }
          fullWidth
          fullHeight={false}
        />
      </FlexHtoVTablet>
    </MaxWidthContainer>
  </>
);
