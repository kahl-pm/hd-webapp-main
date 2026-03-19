import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button, MaxWidthContainer, Modal, Spacer, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

import { hideConfirmationModal } from '../../NewActions/metadata';
import { State } from '../../store/types/State';

function ConfirmationModal() {
  const dispatch = useDispatch();

  const confirmationBodyText = useSelector((state: State) => state.metadata.confirmationBodyText);
  const confirmationHeader = useSelector((state: State) => state.metadata.confirmationHeader);
  const isConfirmationOpen = useSelector((state: State) => state.metadata.isConfirmationOpen);

  return (
    <Modal
      name="confirmationModal"
      open={isConfirmationOpen}
      handleClose={() => dispatch(hideConfirmationModal())}
      ariaLabelledBy="confirmationModalHeader"
      ariaDescribedBy="confirmationModalBody"
      role="alertdialog"
      header={confirmationHeader}
    >
      <MaxWidthContainer width="md" bgcolor="paper">
        <UniformSpacingLayout gap="1.5rem" flexDirection="column">
          <Typography variant="body2" message={confirmationBodyText} align="center" />
          <Button variant="primary" name="closeConfirmationModalBody" onClick={() => dispatch(hideConfirmationModal())}>
            <Typography variant="CTALargePrimary" message={'OK'} />
          </Button>
        </UniformSpacingLayout>
      </MaxWidthContainer>
    </Modal>
  );
}

export default ConfirmationModal;
