import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Link, Modal, Typography, UniformSpacingLayout, NativeList } from '@policyme/global-libjs-designsystem';
import { styled } from '@mui/material';
import { AMF_CLIENT_NUMBER, INFO_EMAIL } from '../../utils/const';
import { getAMFAuthorityRecordsURL, getComplaintsPath } from '../../utils/helpers';
import { getTenantBasedFormattedText } from '../../tenant/helpers';
import { TENANT_OVERRIDE_SLOTS, TENANT_TEXT_KEYS } from '../../tenant/consts';
import { State } from '../../store/types/State';
import { TenantCustomisationSlot } from '../Customisation';

export interface AmfDetailsModalProps {
  open: boolean,
  handleClose: () => void,
}

// This can be removed once everything is migrated to the new design system
// and globalcss is removed
const LiWhithoutMargin = styled('li')({
  margin: '0px !important',
});

const useSupportEmail = () => {
  const intl = useIntl();
  return getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
};

const SupportEmailSlot = () => {
  const supportEmail = useSupportEmail();
  return <FormattedMessage
    id="amfDetails.email.rTcLxF"
    values={{
      supportEmail: <Link href={`mailto:${INFO_EMAIL}`} label={INFO_EMAIL} />,
    }}
  />;
};

const AmfDetailsModal = ({ open, handleClose }: AmfDetailsModalProps) => {
  const lang = useSelector((state: State) => state.primary.household.application_language);
  const intl = useIntl();
  const phone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);
  const complaintsLink = getComplaintsPath(lang);
  const amfDetailsRows = [
    <Typography
      variant="body1"
      message={
        <FormattedMessage
          id="amfDetails.name.icPtaH"
          values={{
            strong: (chunks) => <Typography variant="body1Bold" component="span" message={chunks} />,
          }}
        />
      }
      id="emailCheckModalBody"
    />,
    <Typography
      variant="body1"
      align="left"
      message={
        <>
          <FormattedMessage
            id="amfDetails.contactInformation.KBQVYi"
            values={{
              strong: (chunks) => <Typography variant="body1Bold" component="span" message={chunks} />,
            }}
          />
          <NativeList gap="0.5rem" marginBlockStart="1rem" paddingInlineStart="2rem">
            <LiWhithoutMargin>
              <FormattedMessage
                id="amfDetails.phone.FZpIHY"
                values={{
                  phoneNumber: <Link href={`tel:${phone}`} label={phone} />,
                }}
              />
            </LiWhithoutMargin>
            <LiWhithoutMargin>
              <TenantCustomisationSlot name={TENANT_OVERRIDE_SLOTS.SUPPORT_EMAIL_SLOT}>
                <SupportEmailSlot />
              </TenantCustomisationSlot>
            </LiWhithoutMargin>
            <LiWhithoutMargin>
              <FormattedMessage
                id="amfDetails.address.oFTlwR"
              />
            </LiWhithoutMargin>
          </NativeList>
        </>
      }
      id="emailCheckModalBody"
    />,
    <Typography
      variant="body1"
      message={
        <FormattedMessage
          id="amfDetails.amfClientNumber.rJOXOi"
          values={{
            AMF_CLIENT_NUMBER,
            a: (chunks: any) => <Link href={getAMFAuthorityRecordsURL(lang)} target="_blank" label={chunks} />,
          }}
        />
      }
    />,
    <TenantCustomisationSlot name={TENANT_OVERRIDE_SLOTS.COMPLAINTS_LINK_SLOT}>
      <Typography
        variant="body1"
        message={
          <FormattedMessage
            id="amfDetails.complaints.YkV0uE"
            values={{
              strong: (chunks) => <Typography variant="body1Bold" component="span" message={chunks} />,
              supportEmail: <Link href={`mailto:${INFO_EMAIL}`} label={INFO_EMAIL} />,
              a: (chunks: any) => (
                <Link href={complaintsLink} target="_blank" label={chunks} />
              ),
            }}
          />
        }
      />
    </TenantCustomisationSlot>,
  ];

  return (
    <Modal
      header={
        <FormattedMessage
          id="secureFooter.distributedByPM.jXaoHM"
        />
      }
      open={open}
      handleClose={handleClose}
      name="amf-details-modal-title"
      ariaLabelledBy="amf-details-modal-title"
      ariaDescribedBy="amf-details-modal-description"
    >
      <UniformSpacingLayout flexDirection="column" gap="1rem" textAlign="left">
        {amfDetailsRows}
      </UniformSpacingLayout>
    </Modal>
  );
};

export default AmfDetailsModal;
