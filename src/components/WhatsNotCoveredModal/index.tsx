/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IconListItem, Spacer, Typography, XIcon } from '@policyme/global-libjs-designsystem';

const XIconWithProps = () => <XIcon variant={'transparent'} size="accordionLarge" />;

const WhatsNotCoveredModal = (props) => {
  const { exclusions, isApplication, isPermanentInsurance } = props;

  return (<>
    <Typography
      variant="h4"
      message={<FormattedMessage
        id="WhatsNotCoveredModal.subHeading.AGXhDX"
      />}
    />
    <Spacer size="spaceMedium" />
    <IconListItem
      icon={XIconWithProps}
      message={
        <FormattedMessage
          id="WhatsNotCoveredModal.suicide.FBIuAP"
          values={{
            isPermanent: isPermanentInsurance,
          }}
        />
      }
    />
    {exclusions && !!exclusions.length && exclusions.map((exclusion) => (<div key={exclusion.exclusion_id}>
      <IconListItem
        icon={XIconWithProps}
        message={exclusion.description}
      />
    </div>))}
    {isApplication !== undefined && isApplication ? (
      <Typography
        variant="body1"
        message={
          <FormattedMessage
            id="WhatsNotCoveredModal.footerTextWithExclusions.RUZDvZ"
          />
        }
      />
    ) : (
      <Typography
        variant="body1"
        message={
          <FormattedMessage
            id="WhatsNotCoveredModal.footerTextWithoutExclusions.fuY6pD"
          />
        }
      />
    )}
  </>);
};

WhatsNotCoveredModal.propTypes = {
  exclusions: PropTypes.arrayOf(PropTypes.string),
  isPermanentInsurance: PropTypes.bool,
};

WhatsNotCoveredModal.defaultProps = {
  exclusions: [],
  isPermanentInsurance: false,
};

export default WhatsNotCoveredModal;
