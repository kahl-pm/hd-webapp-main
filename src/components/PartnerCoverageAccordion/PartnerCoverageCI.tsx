import React from 'react';
import { Accordion, ChevronDownIcon, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

const PartnerCoverageCIAccordion = () => (
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
      <UniformSpacingLayout flexDirection="column" gap="2rem">
        <Typography
          variant="body2"
          align="left"
          message={
            <>
              <FormattedMessage
                id="howCoverageWorksJoint.para1.38Ru6q"
              />{' '}
              <FormattedMessage
                id="howCoverageWorksJoint.para2.pZmeEg"
              />
            </>
            }
        />
        <Typography
          variant="body2"
          align="left"
          message={
            <>
              <FormattedMessage
                id="howCoverageWorksJoint.para3.IIgyBo"
              />{' '}
              <FormattedMessage
                id="howCoverageWorksJoint.para4.b4km1m"
              />
            </>
            }
        />
        <Typography
          variant="body2"
          align="left"
          message={
            <>
              <FormattedMessage
                id="howCoverageWorksJoint.para5.57Gs6S"
              />{' '}
              <FormattedMessage
                id="howCoverageWorksJoint.para6.sEWpTF"
                values={{
                  strong: chunks => <strong>{chunks}</strong>,
                }}
              />
            </>
            }
        />
      </UniformSpacingLayout>
      }
  />
);

export default PartnerCoverageCIAccordion;
