import React from 'react';
import { Link, Modal, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from '@mui/material';
import { getTenantBasedFormattedText } from '../../tenant/helpers';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';

function ProvinceMismatchBlockerModal({
  opened,
  dataCy,
  handleClose,
}: {
  opened: boolean,
  handleClose: () => void,
  dataCy: string,
}) {
  const themeMui = useTheme();
  const intl = useIntl();
  const supportEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const supportPhoneNumber = getTenantBasedFormattedText(
    intl,
    TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED,
  );

  return (
    <Modal
      name="provinceMismatchBlockerModal"
      open={opened}
      header={
        <Typography
          data-cy={dataCy}
          variant="h2"
          align="center"
          message={
            <FormattedMessage
              id="quotesCompareInputs.provinceChangeBlockerHeader.8VSvRL"
            />
          }
        />
      }
      ariaDescribedBy=""
      ariaLabelledBy=""
      handleClose={handleClose}
    >
      <div>
        <Typography
          variant="body1"
          message={
            <FormattedMessage
              id="quotesCompareInputs.provinceChangeBlockerBodyDifferentProvinces.91aMJf"
            />
          }
          mb={themeMui.spacer.spaceSmall}
        />

        <Typography
          variant="body1"
          message={
            <FormattedMessage
              id="quotesCompareInputs.provinceChangeBlockerBodyContactForQuestions.eZXak1"
              values={{
                advisorEmail: (
                  <Link label={supportEmail} href={`mailto:${supportEmail}`} />
                ),
                supportPhoneNumber: (
                  <Link label={supportPhoneNumber} href={`tel:${supportPhoneNumber}`} />
                ),
              }}
            />
          }
        />
      </div>
    </Modal>
  );
}

export default ProvinceMismatchBlockerModal;
