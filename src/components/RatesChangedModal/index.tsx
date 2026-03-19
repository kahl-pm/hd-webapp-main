import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Typography, UniformSpacingLayout, Link, Button } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { RATINGS_MESSAGE, SMOKING_DISCREPANCY_MESSAGE } from './constants';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';
import { getTenantBasedFormattedText } from '../../tenant/helpers';

const RatesChangedModal = (props) => {
  const { hasRatings, smokingDiscrepancyFlag } = props;
  const intl = useIntl();
  const supportEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const supportPhoneNumberFormatted =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);

  let modalContent: React.ReactNode = '';
  if (hasRatings) {
    modalContent = RATINGS_MESSAGE;
  } else if (smokingDiscrepancyFlag) {
    modalContent = SMOKING_DISCREPANCY_MESSAGE;
  }

  return (
    <UniformSpacingLayout gap="1.5rem" flexDirection="column" justifyContent="center">
      <Typography variant="body1" message={modalContent} />
      <Typography
        variant="h3"
        align="center"
        message={
          <>
            <FormattedMessage id="RatesChangedModal.mistake.po3esZ" />{' '}
            <FormattedMessage id="RatesChangedModal.questions.TNLYAh" />
          </>
        }
      />
      <Typography
        variant="body1"
        message={
          <FormattedMessage
            id="RatesChangedModal.askAway.gcjLvg"
            values={{
              advisorEmail: (
                <Link label={supportEmail} href={`mailto:${supportEmail}`} />
              ),
              advisorPhone: (
                <Link label={supportPhoneNumberFormatted} href={`tel:${supportPhoneNumberFormatted}`} />
              ),
            }}
          />
        }
      />
    </UniformSpacingLayout>);
};

RatesChangedModal.propTypes = {
  hasRatings: PropTypes.bool,
  smokingDiscrepancyFlag: PropTypes.bool,
};

RatesChangedModal.defaultProps = {
  hasRatings: false,
  smokingDiscrepancyFlag: false,
};

export default RatesChangedModal;
