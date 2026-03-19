import React from 'react';
import {
  Accordion, ChevronDownIcon, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

const SingleCoverageAccordion = () => (
  <Accordion
    id="howCoverageWorks"
    variant="default"
    heading={
      <Typography
        variant="h4"
        message={<FormattedMessage
          id="howCoverageWorksSingle.howCoverageWorks.2azqJV"
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
            <FormattedMessage
              id="howCoverageWorksSingle.para1.uethsV"
            />
            }
        />
        <Typography
          variant="body2"
          align="left"
          message={
            <FormattedMessage
              id="howCoverageWorksSingle.para2.cnMtbT"
            />
            }
        />
        <Typography
          variant="body2"
          align="left"
          message={<>
            <FormattedMessage
              id="howCoverageWorksSingle.para3.l8hKfF"
            /> {' '}
            <FormattedMessage
              id="howCoverageWorksSingle.para4.OtJ0N3"
              values={{
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />
          </>}
        />
      </UniformSpacingLayout>
      }
  />
);

export default SingleCoverageAccordion;
