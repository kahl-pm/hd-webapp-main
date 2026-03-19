import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Typography,
  Button,
  Form,
  Input,
  PageContainer,
  MaxWidthContainer,
  Spacer, UniformSpacingLayout,
  isMobile,
} from '@policyme/global-libjs-designsystem';
import { onComponentLoad } from '../../NewActions/session';
import { updateHouseholdPropSecondary, updateHouseholdPropPrimary } from '../../NewActions/household';
import { getCurrentUser, isJoint as isJointSelector, isMortgageBroker } from '../../Selectors/userControl';
import { getYourPartnerText } from '../../Selectors/household';
import { addPossessiveApostrophe, formatPhoneNumber, phoneMask } from '../../utils/helpers';

import { getMainProduct } from '../../Selectors/helpers/productApp';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import { State } from '../../store/types/State';
import BottomNavigation from '../../components/BottomNavigation';
import { handleSubmitCellPhone } from '../../NewActions/handle';

interface PartnerPhoneContentProps {
  partnerName: string;
  partnerPhone: string;
}

const PartnerPhoneContent:React.FC<PartnerPhoneContentProps> = (props) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  return (
    <Input
      label={intl.formatMessage({
        id: 'cellPhone.partnerCellPhone.m0RV8T',
      })}
      placeholder={intl.formatMessage({
        id: 'cellPhone.partnerCellPhonePlaceholder.uLoTcm',
      }, {
        partnerNameWithApostrophe: props.partnerName,
      })}
      value={formatPhoneNumber(props.partnerPhone)}
      phone
      required
      requiredMessage={<FormattedMessage
        id="cellPhone.partnerCellPhoneRequiredMessage.DbVJvR"
      />}
      name="partner_cell_phone_search"
      autocomplete="off"
      onChange={(val) => {
        dispatch(updateHouseholdPropSecondary('phone', phoneMask(val)));
      }}
      data-cy="partnerPhoneNumber"
    />
  );
};

const CellPhone:React.FC = () => {
  const phone = useSelector((state:State) => state.primary.household.phone);
  const partnerPhone = useSelector((state:State) => state.secondary.household.phone);

  const isJoint = useSelector((state:State) => (isJointSelector(state) &&
    !(getMainProduct(state, getCurrentUser(state)) === PM_PRODUCT_PREFIX.HD)));
  const partnerName = useSelector((state:State) => addPossessiveApostrophe(
    getYourPartnerText(state),
    state.primary.household.application_language,
  ));

  const fromMortgage = useSelector((state:State) => isMortgageBroker(state));

  const showPhoneInput = useSelector(
    (state: State) => !state.metadata.primary.hasPreExistingPhoneNumber,
  );
  const showPartnerPhoneInput = useSelector(
    (state: State) => !state.metadata.secondary.hasPreExistingPhoneNumber,
  );

  const productType = useSelector((state:State) => getMainProduct(state, getCurrentUser(state)));

  const dispatch = useDispatch();

  const intl = useIntl();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const myPhoneNumberLabel = isJoint ?
    intl.formatMessage({
      id: 'cellPhone.yourCellPhoneNumber.7m6eUh',
    }) :
    intl.formatMessage({
      id: 'cellPhone.cellPhoneNumber.M6CFK3',
    });
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer gap={'2.5rem'} fullHeight>
      <Typography
        variant="h1"
        message={fromMortgage && isJoint ?
          <FormattedMessage
            id="cellPhone.pageTitleJointMortgage.aRQcST"
            values={{
              partnerNameWithApostrophe: partnerName,
            }}
          />
          : <FormattedMessage
              id="cellPhone.pageTitle.ziMCZ1"
              values={{
                isJoint,
                phoneExists: !showPhoneInput,
                partnerPhoneExists: !showPartnerPhoneInput,
                partnerName,
              }}
          />}
      />
      <MaxWidthContainer width="md">
        <Typography
          variant="body1"
          message={isJoint ? intl.formatMessage({
            id: 'cellPhone.phoneDescriptionJoint.VBTc4c',
          }) : intl.formatMessage({
            id: 'cellPhone.phoneDescription.tbVJ0x',
          })}
          align="center"
        />
        <Spacer size="spaceLarge" />
        <Form
          onSubmit={() => {
            dispatch(handleSubmitCellPhone());
          }}
          name="Cell Phone"
          segmentPayload={{
            name: '',
            product_type: productType,
          }}
        >
          <UniformSpacingLayout gap="0.5rem" flexDirection="column">
            {
              !fromMortgage && showPhoneInput &&
              <Input
                label={intl.formatMessage({
                  id: 'cellPhone.cellPhone.Bm7QNV',
                })}
                placeholder={myPhoneNumberLabel}
                value={formatPhoneNumber(phone)}
                phone
                required
                requiredMessage={<FormattedMessage
                  id="cellPhone.cellPhoneRequiredMessage.tWiWQT"
                />}
                name="cell_phone_search"
                autocomplete="off"
                data-cy="phoneNumber"
                onChange={(val) => dispatch(updateHouseholdPropPrimary('phone', phoneMask(val)))}
              />
            }
            {(isJoint && showPartnerPhoneInput) &&
            <PartnerPhoneContent partnerPhone={partnerPhone} partnerName={partnerName} />}
          </UniformSpacingLayout>
          <Spacer size="spaceLarge" />
          <Button type="submit" variant="primary" name="next" data-cy="submit" hidden={isMobile()} ref={buttonRef}>
            <Typography
              message={<FormattedMessage
                id="global.next.Q0fXUP"
              />}
              variant="CTALargePrimary"
            />
          </Button>

          {/* <SecureFooter /> */}
        </Form>
      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>;
};

export default CellPhone;
