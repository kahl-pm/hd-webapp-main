import React from 'react';
import {
  Accordion, ChevronDownIcon, Spacer, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

const PartnerCoverageLifeAccordion = () => (
  <Accordion
    id="howCoverageWorksWithPartner"
    variant="default"
    heading={
      <Typography
        variant="h4"
        message={<FormattedMessage
          id="global.coverageWithPartner.lDtQj5"
        />}
      />
  }
    icon={ChevronDownIcon}
    detail={
      <UniformSpacingLayout flexDirection="column">
        <Typography
          variant="body2"
          align="left"
          message={
            <FormattedMessage
              id="partnerCoverage.twoPolicies.6Q2X0F"
            />
            }
        />
        <Spacer size="spaceMedium" />
        <Typography
          variant="body2"
          align="left"
          message={

            <FormattedMessage
              id="partnerCoverage.eitherPassAway.pYFRHv"
            />
            }
        />
        <Spacer size="spaceMedium" />
        <Typography
          variant="body2"
          align="left"
          message={

            <FormattedMessage
              id="partnerCoverage.bothPassAway.hM4KuR"
            />

            }
        />
      </UniformSpacingLayout>
      }
  />
);

export default PartnerCoverageLifeAccordion;
