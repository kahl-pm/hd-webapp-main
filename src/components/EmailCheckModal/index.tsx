import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Form, MaxWidthContainer, Modal, RadioGroup, Spacer, Typography } from '@policyme/global-libjs-designsystem';

import { USER_TYPES, YES_NO_Y_N } from '../../utils/const';
import { State } from '../../store/types/State';

interface EmailCheckModalProps {
  onSelect: (emailWasAccepted: boolean, userType: string) => void
  userType: string
}

const EmailCheckModal = (props: EmailCheckModalProps) => {
  const suggestedEmail = useSelector((state: State) => state.metadata.suggestedEmail);

  return (
    <Modal
      name="emailCheckModal"
      open={suggestedEmail !== null}
      handleClose={() => props.onSelect(false, props.userType)}
      ariaDescribedBy="emailCheckModalBody"
      ariaLabelledBy="emailCheckModalHeader"
    >
      <MaxWidthContainer width="md" bgcolor="paper">
        <Typography
          variant="h2"
          message={
            <FormattedMessage
              id="emailCheckModal.confirmEmail.7vBPgz"
              values={{ validatePartnerEmail: props.userType === USER_TYPES.SECONDARY }}
            />
          }
          id="emailCheckModalHeader"
          align="center"
        />
        <Spacer size="spaceMedium" />
        <Typography
          variant="body2"
          message={
            <FormattedMessage
              id="emailCheckModal.didYouMean.f8f5ym"
              values={{ email: suggestedEmail, b: (chunks) => <Typography variant="body2Bold" component="span" message={chunks} /> }}
            />
          }
          id="emailCheckModalBody"
          align="center"
        />
        <Spacer size="spaceMedium" />
        <Button name="confirm-change-email" variant="primary" onClick={() => { props.onSelect(true, props.userType); }}>
          <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.yes.JVS0d0" />} />
        </Button>
        <Spacer size="spaceSmall" />
        <Button name="deny-change-email" variant="secondary" role="link" onClick={() => { props.onSelect(false, props.userType); }}>
          <Typography variant="CTALargeSecondary" message={<FormattedMessage id="global.no.nlGQVZ" />} />
        </Button>
      </MaxWidthContainer>
    </Modal>
  );
};

export default EmailCheckModal;
