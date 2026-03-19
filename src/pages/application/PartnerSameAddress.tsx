import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Form, isMobile, MaxWidthContainer, PageContainer, RadioGroup, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { getYourPartnerText } from '../../Selectors/household';
import { onComponentLoad, nextQuestion } from '../../NewActions/session';
import { updateJointMetadata } from '../../NewActions/jointMetadata';
import { handleSubmitFullAddress } from '../../NewActions/handle';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { USER_TYPES } from '../../utils/const';

import { State } from '../../store/types/State';
import BottomNavigation from '../../components/BottomNavigation';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

const PartnerSameAddress = () => {
  const dispatch = useDispatch();
  const partnerFirstName = useSelector<State, string>(getYourPartnerText);
  const user_partner_same_address_flag = useSelector(
    (state: State) => state.jointMetadata.user_partner_same_address_flag,
  );
  const productType = useSelector((state: State) => getMainProduct(state, USER_TYPES.SECONDARY));

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const title = (
    <FormattedMessage
      id="partnerSameAddress.headingQuestion.K07qpV"
      values={{
        partnerFirstName,
      }}
    />
  );

  const handleFormSubmit = () => {
    if (user_partner_same_address_flag === 'N') {
      dispatch(nextQuestion());
    } else {
      dispatch(handleSubmitFullAddress(USER_TYPES.SECONDARY));
    }
  };

  const handleOptionChange = (event) => {
    dispatch(updateJointMetadata('user_partner_same_address_flag', event.target.value));
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (<>
    <PageContainer fullHeight>
      <Typography
        variant="h1"
        message={title}
        align="center"
        id="PartnerSameAddressTitle"
      />
      <Spacer size="spaceXL" />
      <MaxWidthContainer width="md">
        <Form
          onSubmit={handleFormSubmit}
          name="Partner Same Address"
          segmentPayload={{
            name: title,
            product_type: productType,
          }}
        >
          <RadioGroup
            options={YES_NO_Y_N}
            value={user_partner_same_address_flag}
            onChange={handleOptionChange}
            name="partner_same_address"
            data-cy="partner_same_address"
            labelledBy="PartnerSameAddressTitle"
            orientation="horizontal"
            variant="outlined"
            required
          />
          <Spacer size="spaceLarge" />
          <Button type="submit" name="Submit Partner Same Address" dataCy="submitPartnerSameAddress" hidden={isMobile()} ref={buttonRef}>
            <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
          </Button>
        </Form>      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>
  );
};

export default PartnerSameAddress;
