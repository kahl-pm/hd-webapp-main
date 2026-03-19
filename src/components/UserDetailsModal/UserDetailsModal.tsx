import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Divider, Form, Modal, Spacer, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { segmentTrackEvent, hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { useUserDetailsContext } from './UserDetailsContext';
import {
  MODAL_FIELDS,
  QUOTE_TYPES,
  USER_TYPES,
} from '../../utils/const';
import { updateJointQuoteAndRequoteAllProducts } from '../../NewActions/helpers/productSession';
import { updateMetadata } from '../../NewActions/metadata';
import UserDetailsHeader from './UserDetailsHeader';
import UpdateDateOfBirth from './UpdateDateOfBirth';
import UpdateProvince from './UpdateProvince';
import UpdateGender from './UpdateGender';
import UpdateSmoke from './UpdateSmoke';
import { updateHasPartnerApplication } from '../../NewActions/userControl';
import { saveHouseholdCookies } from '../../NewActions/cookies';
import { getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { getCurrentUser, isPolicymeEmployee as isPolicymeEmployeeSelector, isJointQuote } from '../../Selectors/userControl';
import { getProvince } from '../../Selectors/household';
import ProvinceMismatchBlockerModal from '../ProvinceMismatchBlockerModal';

type UserDetailsModalProps = {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  mainProduct: 'life' | 'ci';
};

const UserDetailsModal = ({ isOpen, setOpen, mainProduct }: UserDetailsModalProps) => {
  const {
    persistValues,
    updateUserType,
    currentUserType,
    isUpdatingPartner,
    hasPartnerApplication,
    values,
    setValues,
    persistedValues,
  } = useUserDetailsContext();
  const isJoint = useSelector(isJointQuote(currentUserType, isUpdatingPartner));
  const dispatch = useDispatch();
  const productPrefix = useSelector(
    (_state) => getMainProductEventPrefix(_state, getCurrentUser(_state)),
  );
  const isPolicymeEmployee = useSelector((_state) => isPolicymeEmployeeSelector(_state));

  const postSubmit = () => {
    if (isUpdatingPartner) {
      dispatch(updateHasPartnerApplication(true));
    }
    persistValues();
    if (updateUserType === USER_TYPES.SECONDARY) {
      dispatch(updateMetadata('isPartnerFormComplete', true));
    }
    dispatch(updateJointQuoteAndRequoteAllProducts(
      isJoint ? QUOTE_TYPES.JOINT : QUOTE_TYPES.PRIMARY,
    ));
    dispatch(saveHouseholdCookies());
  };

  // https://policyme.atlassian.net/browse/CORE-4209
  useEffect(() => {
    if (isOpen) {
      setValues(persistedValues);
    }
  }, [isOpen, persistedValues, setValues]);

  return (
    <Modal
      name="user-details-modal"
      header={isUpdatingPartner ?
        <FormattedMessage
          id="coverageRedesign.joint.addPartnerCoverage.YA0nPR"
          description="Add coverage for your partner"
        />
        :
        <FormattedMessage
          id="coverageRedesign.userDetailsModal.updateYourDetails.wT0ipB"
          description="Update your details"
        />}
      open={isOpen}
      handleClose={() => {
        setOpen(false);
      }}
      data-cy="joint"
      ariaLabelledBy="user-details-modal-title"
      ariaDescribedBy="user-details-modal-body"
    >
      <div>
        <UserDetailsHeader
          mainProduct={mainProduct}
          isPolicymeEmployee={isPolicymeEmployee}
        />
        <Form
          onSubmit={() => {
            postSubmit();
            setOpen(false);
          }}
          name="Joint Partner Form"
          segmentPayload={{
            name: `${productPrefix}-QUOTES PAGE User Edits ${isUpdatingPartner ? 'Partner\'s ' : ''} Basic Inputs`,
            product_type: mainProduct,
          }}
          dataCy="add-partner-form"
        >
          <Spacer size="spaceSmall" />
          <Divider />
          <Spacer size="spaceSmall" />
          <UniformSpacingLayout flexDirection="column" gap="1rem">
            <UpdateProvince />
            <UpdateDateOfBirth />
            <UpdateGender />
            <UpdateSmoke />
            <Button
              type="submit"
              name="submit"
              variant="primary"
              data-cy="joint-submit"
              disableTextTransform
            >
              <Typography
                variant="CTALargePrimary"
                message={
                  <FormattedMessage
                    id="coverageRedesign.userDetailsModal.confirmText.GVRd7V"
                    values={{
                      isUpdatingPartner,
                    }}
                  />
                }
              />
            </Button>
            {isUpdatingPartner && <Button
              name="remove-partner-button"
              onClick={() => {
                if (isUpdatingPartner) {
                  dispatch(updateJointQuoteAndRequoteAllProducts(QUOTE_TYPES.PRIMARY));
                  dispatch(updateHasPartnerApplication(false));
                }
                setOpen(false);
              }}
              variant="secondary"
              data-cy="joint-submit"
              disableTextTransform
            >
              <Typography
                variant="CTALargeSecondary"
                message={
                  <FormattedMessage
                    id="coverageRedesign.userDetailsModal.cancelText.tN6cQm"
                  />
                }
              />
            </Button>}
          </UniformSpacingLayout>
        </Form>
      </div>
    </Modal>
  );
};

export default UserDetailsModal;
