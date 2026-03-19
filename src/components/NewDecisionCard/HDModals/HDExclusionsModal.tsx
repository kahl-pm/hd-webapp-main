import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, Typography, XIcon, Link, Row, IconListItem, NativeList } from '@policyme/global-libjs-designsystem';

interface HDExclusionsModalProps {
  isOpen: boolean;
  onCancel: () => void;
  firstName: string;
  exclusions: string[];
  advisorEmail: string;
  advisorPhone: string;
  supportHours: string;
  advisorPhoneFormatted: string;
}

const XIconTransparent = () => <XIcon variant={'transparent'} size="accordionLarge" />;

const HDExclusionsModal = ({
  isOpen,
  onCancel,
  firstName,
  exclusions,
  advisorEmail,
  advisorPhone,
  supportHours,
  advisorPhoneFormatted,
}: HDExclusionsModalProps) => {
  return (
    <Modal
      name="HDExclusionsModal"
      header={<FormattedMessage
        id="personCovered.modal.headerText.ueL2CQ"
        values={{ firstName }}
      />}
      open={isOpen}
      handleClose={onCancel}
      ariaDescribedBy="HD-exclusions-modal-body"
      ariaLabelledBy="HD-exclusions-modal"
    >
      <Typography
        variant="body1"
        mb="1rem"
        message={<FormattedMessage
          id="personCovered.exclusionsText.Sgl7mp"
          values={{
            p: chunks => chunks,
          }}
        />}
      />
      <NativeList paddingInlineStart="0rem">
        {exclusions.map((exclusion) => (
          <IconListItem
            renderAs="li"
            icon={XIconTransparent}
            message={exclusion}
          />
        ))}
      </NativeList>
      <Typography
        variant="h3"
        my="1rem"
        message={<FormattedMessage
          id="personCovered.haveQuestions.64qsl5"
        />}
      />
      <Typography
        variant="body1"
        message={<FormattedMessage
          id="personCovered.support.ztikD0"
          values={{
            p: chunks => chunks,
            a1: chunks => <Link label={chunks} href={`mailto:${advisorEmail}`} />,
            a2: chunks => <Link
              label={chunks}
              href={`tel:${advisorPhone}`}
            />,
            advisorEmail,
            supportHours,
            advisorPhoneFormatted,
            nbsp: <>&nbsp;</>,
          }}
        />}
      />
    </Modal>
  );
};

export default HDExclusionsModal;
