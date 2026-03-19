import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  RadioGroup,
  Typography,
  Button,
  Form,
  MaxWidthContainer,
  Spacer,
  PageContainer,
  isMobile,
} from '@policyme/global-libjs-designsystem';

import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { handleDiscountsForCAAAllUsers } from '../NewActions/handle';
import { getQuotesDiscountCodes, getUserQuotes } from '../Selectors/quotes';
import { DISCOUNT_CODES } from '../utils/discounts';
import { PM_PRODUCT_PREFIX, USER_TYPES } from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { State } from '../store/types/State';
import BottomNavigation from '../components/BottomNavigation';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

interface CAAMemberProps {
  hasPartnerApplication: boolean;
  hasQuotes: boolean;
  caaMemberDiscountApplied: boolean;
}

const CAAMember: React.FC = () => {
  const _state = useSelector<State, State>((state) => state);

  const userType = USER_TYPES.PRIMARY;
  const mainProduct = useSelector(state => getMainProduct(state, userType));
  const quotesDiscountCodes = getQuotesDiscountCodes(
    _state, _state.userControl.currentUser, mainProduct,
  );

  const props: CAAMemberProps = {
    hasPartnerApplication: _state.userControl.hasPartnerApplication,
    hasQuotes: getUserQuotes(_state, mainProduct).length > 0,
    caaMemberDiscountApplied: quotesDiscountCodes.includes(DISCOUNT_CODES.CAA_DISCOUNT) ||
      quotesDiscountCodes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT),
  };

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const dispatch = useDispatch();
  const [optionSelected, setOptionSelected] = useState(props.caaMemberDiscountApplied ?
    'Y' : props.hasQuotes ? 'N' : '');

  const caaMemberQuestion = <FormattedMessage
    id="caaMember.isCAAMember.a2jdDp"
    values={{
      hasPartnerApplication: props.hasPartnerApplication,
    }}
  />;

  const onSubmit = async () => {
    const isCaaMember = optionSelected === 'Y';
    await dispatch(handleDiscountsForCAAAllUsers(isCaaMember));
    dispatch(nextQuestion());
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <PageContainer fullHeight>
        <Typography variant="h1" message={caaMemberQuestion} align="center" id="caaMemeberQuestion" />
        <Spacer size="spaceLarge" />
        <Form
          onSubmit={onSubmit}
          name="CAA Member"
          segmentPayload={{
            name: caaMemberQuestion,
            product_type: mainProduct,
          }}
        >
          <MaxWidthContainer width="md">
            <RadioGroup
              labelledBy="caaMemeberQuestion"
              options={YES_NO_Y_N}
              value={optionSelected}
              onChange={(e) => setOptionSelected(e.currentTarget.value)}
              name="caa_member"
              required
              orientation="horizontal"
              data-cy="caaMember"
              variant="outlined"
            />
            <Spacer size="spaceLarge" />
            <Button
              variant="primary"
              type="submit"
              name="Next Button"
              dataCy="submit"
              hidden={isMobile()}
              ref={buttonRef}
            >
              <Typography
                variant="CTALargePrimary"
                align="center"
                color="white"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
          </MaxWidthContainer>
        </Form>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default CAAMember;
