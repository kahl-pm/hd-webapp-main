import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Card,
  Divider,
  Link,
  MailIcon,
  PhoneIcon,
  Spacer,
  Typography,
  UniformSpacingLayout,
  ResponsiveImage,
} from '@policyme/global-libjs-designsystem';

import ADVISORS from '../../static/images/speak-to-experts/Advisors-Headshots.png';

import { getTenantBasedFormattedText } from '../../tenant/helpers';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';

type SpeakToExpertProps = {
  postDecision: boolean;
  headingTag?: string;
}

const SpeakToExperts = (props: SpeakToExpertProps) => {
  const intl = useIntl();

  return (
    <Card
      cardVariant="empty"
      body={
        <div>
          {
            props.postDecision ?
              <Typography
                variant="h4"
                align="center"
                component={props.headingTag ? props.headingTag : 'h4'}
                message={<FormattedMessage
                  id="speakToExperts.headingPostDecision.PMRLhJ"
                  values={{
                    nbsp: <></>,
                  }}
                />}
              /> :
              <Typography
                variant="h4"
                align="center"
                component={props.headingTag ? props.headingTag : 'h2'}
                message={<FormattedMessage
                  id="speakToExperts.heading.P0Jiay"
                />}
              />
          }
          <Spacer size="space2XS" />
          <Typography
            variant="body3"
            message={getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_HOURS_DATE)}
            align="center"
          />
          <Spacer size="spaceSmall" />
          <Divider />
          <Spacer size="spaceSmall" />
          <UniformSpacingLayout flexDirection="column" alignItems="center">
            <Link
              label={
                <UniformSpacingLayout gap="0.125rem" alignItems="center">
                  <Typography
                    variant="CTALargePrimary"
                    mr="0.215rem"
                    component="p"
                    message={
                      getTenantBasedFormattedText(
                        intl,
                        TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED,
                      )
                    }
                    color="inherit"
                  />
                  <PhoneIcon variant="plain" size="accordionLarge" interactive />
                </UniformSpacingLayout>
              }
              href={`tel:+${getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER)}`}
            />
            <Spacer size="spaceSmall" />
            <Link
              label={
                <UniformSpacingLayout gap="0.125rem" alignItems="center">
                  <Typography
                    variant="CTALargePrimary"
                    mr="0.215rem"
                    component="p"
                    message={
                      getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL)
                    }
                    color="inherit"
                  />
                  <MailIcon variant="plain" size="accordionLarge" interactive />
                </UniformSpacingLayout>
              }
              href={`mailto:${getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL)}`}
            />
            <Spacer size="spaceMedium" />
            <ResponsiveImage alt="Advisors" src={ADVISORS} />
          </UniformSpacingLayout>
        </div>
      }
    />
  );
};

export default SpeakToExperts;
