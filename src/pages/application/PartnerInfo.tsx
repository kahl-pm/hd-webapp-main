import React, { useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Form, Input, isMobile, MaxWidthContainer, PageContainer, Spacer, Typography } from '@policyme/global-libjs-designsystem';

import { changeSuggestedEmailAndNext, updateHouseholdPropSecondary } from '../../NewActions/household';
import { handlePartnerEmailVerifyAndNext } from '../../NewActions/handle';
import { onComponentLoad } from '../../NewActions/session';
import { getYourPartnerText, getPartnerHisOrHerText } from '../../Selectors/household';

import { USER_TYPES } from '../../utils/const';
import { addPossessiveApostrophe } from '../../utils/helpers';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { State } from '../../store/types/State';
import EmailCheckModal from '../../components/EmailCheckModal';
import BottomNavigation from '../../components/BottomNavigation';

const PartnerInfo = () => {
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const intl = useIntl();
  const dispatch = useDispatch();

  const partnerEmail = useSelector((state: State) => state.secondary.household.email);
  const primaryEmail = useSelector((state: State) => state.primary.household.email);
  const disablePartnerEmail = useSelector((state: State) => (
    partnerEmail !== primaryEmail && state.metadata.verifiedEmails.includes(partnerEmail))
    || state.metadata.backPressed);

  const application_language = useSelector(
    (state: State) => state.primary.household.application_language,
  );
  const partnerName = useSelector((state: State) => getYourPartnerText(state));
  const productType = useSelector((state: State) => getMainProduct(state, USER_TYPES.SECONDARY));

  const title = (
    <FormattedMessage
      id="partnerInfo.pageTitle.kAHxHI"
      values={{
        nameWithApostrohphe: addPossessiveApostrophe(
          partnerName,
          application_language,
        ),
      }}
    />
  );

  const inputPlaceholder = intl.formatMessage({ id: 'partnerInfo.email.atkrT2' });
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer fullHeight>
      <MaxWidthContainer width="md">
        <Typography
          variant="h1"
          message={title}
        />
        <Spacer size="spaceMedium" />
        <Typography variant="body1" message={<FormattedMessage id="partnerInfo.pageDescription.M2H2O8" />} />
      </MaxWidthContainer>
      <Spacer size="spaceMedium" />
      <MaxWidthContainer width="md">
        <Form
          onSubmit={() => { dispatch(handlePartnerEmailVerifyAndNext()); }}
          name="Partner Email"
          segmentPayload={{
            name: title,
            product_type: productType,
          }}
        >
          <Input
            label={inputPlaceholder}
            placeholder={inputPlaceholder}
            value={partnerEmail}
            onChange={(field) => dispatch(updateHouseholdPropSecondary('email', field))}
            required
            requiredMessage={<FormattedMessage
              id="global.emailRequiredMessage.pFGo2O"
            />}
            email
            name="partner_email_search"
            custom={(val) => (val.toLowerCase() !== primaryEmail.toLowerCase())}
            customMessage={<FormattedMessage
              id="partnerInfo.emailcustomMessage.utfuKu"
            />}
            data-cy="partnerEmail"
            disabled={disablePartnerEmail}
          />
          <Spacer size="spaceMedium" />
          <Button type="submit" name="submit" dataCy="submit" hidden={isMobile()} ref={buttonRef}>
            <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
          </Button>
        </Form>
        {/* <SecureFooter noRelative /> */}
      </MaxWidthContainer>
      <EmailCheckModal
        onSelect={
          (emailWasAccepted, userType) => {
            dispatch(changeSuggestedEmailAndNext(emailWasAccepted, userType));
          }
        }
        userType={USER_TYPES.SECONDARY}
      />
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>;
};

export default PartnerInfo;
