import React from 'react';
import { Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';

const BCLDisclosure = () => {
  return (
    <Typography
      variant="body3"
      align="left"
      data-cy="bcl-disclosure"
      message={
        <FormattedMessage
          id="startAppRegular.assessmentDisclaimer.1Z2Z2b"
          values={{
            i: (chunks) => (
              <i>{chunks}</i>
            ),
          }}
        />
      }
    />
  );
};

export default BCLDisclosure;
