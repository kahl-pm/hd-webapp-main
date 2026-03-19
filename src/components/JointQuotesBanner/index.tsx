import { Alert, AwardIcon, Card, Divider, Input, RadioGroup, Spacer, Switch, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import React from 'react';
import { segmentTrackEvent } from '@policyme/global-libjs-utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../utils/helpers';
import { PM_PRODUCT_PREFIX, QUOTE_TYPES, USER_FAMILY_COMPOSITION, USER_TYPES } from '../../utils/const';
import { State } from '../../store/types/State';
import { getMainProduct, getMainProductEventPrefix } from '../../Selectors/helpers/productApp';
import { isPolicymeEmployee as isPolicymeEmployeeSelector } from '../../Selectors/userControl';
import { updateAllUserSessionPropAllProducts } from '../../NewActions/helpers/productSession';
import { updateHasPartnerApplication } from '../../NewActions/userControl';
import { updateHouseholdPropSecondary } from '../../NewActions/household';

const addPartnerOptions = [
  {
    value: 'true',
    text: <FormattedMessage
      id="global.yes.JVS0d0"
    />,
  },
  {
    value: 'false',
    text: <FormattedMessage
      id="global.no.nlGQVZ"
    />,
  },
];

const BannerText = ({ mainProduct,
  isPolicymeEmployee }) => {
  // HD-only webapp: no Life-specific banner text
  return null;
};

export const JointQuotesBanner = () => {
  const dispatch = useDispatch();
  const userFamilyComposition = useSelector(
    (state: State) => state.primary.household.user_family_composition,
  );
  const mainProduct = useSelector((state: State) => getMainProduct(state, USER_TYPES.PRIMARY));
  const isPolicymeEmployee = useSelector(
    (state: State) => isPolicymeEmployeeSelector(state),
  );
  const hasPartnerApplication = useSelector(
    (state: State) => state.userControl.hasPartnerApplication,
  );
  const productPrefix = useSelector(
    (state: State) => getMainProductEventPrefix(state, USER_TYPES.PRIMARY),
  );

  // if its not a partner selection, we don't show joint toggle option
  if (isEmpty(userFamilyComposition) ||
    userFamilyComposition === USER_FAMILY_COMPOSITION.SELF_KIDS ||
    userFamilyComposition === USER_FAMILY_COMPOSITION.SELF) {
    return <></>;
  }

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hasPartnerApp = e.target.checked;
    dispatch(
      updateAllUserSessionPropAllProducts(
        'selected_quote_type',
        hasPartnerApp
          ? QUOTE_TYPES.JOINT
          : QUOTE_TYPES.PRIMARY,
      ),
    );
    dispatch(updateHasPartnerApplication(hasPartnerApp));
  };

  return (
    <>
      <Card
        cardVariant="empty"
        body={
          <>
            <UniformSpacingLayout>
              <Switch
                name="joint-quotes-toggle-banner"
                checked={hasPartnerApplication}
                onChange={handleToggleChange}
                data-cy="toggleJointQuotesBanner"
                label={<FormattedMessage
                  id="jointQuoteBanner.gettingQuoteForPartner.6beQpT"
                />}
              />
            </UniformSpacingLayout>
            <BannerText
              mainProduct={mainProduct}
              isPolicymeEmployee={isPolicymeEmployee}
            />
          </>
        }
      />
    </>
  );
};

export const MortgageJointQuotesBanner = ({ partnerFirstName, partnerLastName }) => {
  const intl = useIntl();
  const hasPartner = useSelector(
    (state: State) => state.primary.household.hasPartner,
  );
  const dispatch = useDispatch();
  return (
    <>
      <Card
        cardVariant="empty"
        body={
          <>
            <Typography
              variant="h3"
              align="left"
              id="quotesCompareInputs.mortgageDoYouWantCoverageForYourPartner.HgBErI"
              message={
                <FormattedMessage
                  id="quotesCompareInputs.mortgageDoYouWantCoverageForYourPartner.HgBErI"
                />
            }
            />
            <Spacer size="spaceSmall" />
            <Divider />
            <Spacer size="spaceSmall" />
            <Alert
              type="tip"
              icon={<AwardIcon />}
              text={<FormattedMessage
                id="jointQuoteBanner.save10Percent.L2nIkc"
              />}
              textTextAlign="left"
            />
            <Spacer size="space2XS" />
            <RadioGroup
              name="addPartner"
              orientation="horizontal"
              labelledBy="quotesCompareInputs.mortgageDoYouWantCoverageForYourPartner.HgBErI"
              options={addPartnerOptions}
              value={String(hasPartner)}
              onChange={(val) => {
                dispatch(
                  updateHasPartnerApplication(JSON.parse(val.target.value)),
                );
              }}
              data-cy={'mortgageHasPartner'}
              requiredMessage={<FormattedMessage
                id="quotesCompareInputs.mortgageAddPartnerRequiredMessage.v2vPoK"
              />}
            />
            {hasPartner && (
              <>
                <Spacer size="space2XS" />
                <Typography
                  variant="h4"
                  message={
                    <FormattedMessage
                      id="quotesCompareInputs.mortgageGreatWhatsYourPartnersName.scHmBq"
                    />
              }
                />
                <Spacer size="space2XS" />
                <Input
                  label={
                    intl.formatMessage({ id: 'quotesCompareInputs.mortgagePartnersLegalFirstName.hX8lqP' })
                  }
                  value={partnerFirstName}
                  onChange={(value) => {
                    dispatch(updateHouseholdPropSecondary('firstName', value));
                  }}
                  name="first_name_search"
                  data-cy="firstName"
                  required
                  requiredMessage={<FormattedMessage
                    id="quotesCompareInputs.mortgagePartnerFirstNameRequiredMessage.A8hd6C"
                  />}
                />
                <Input
                  label={
                    intl.formatMessage({ id: 'quotesCompareInputs.mortgagePartnersLegalLastName.I61q2z' })
                  }
                  value={partnerLastName}
                  onChange={(value) => {
                    dispatch(updateHouseholdPropSecondary('lastName', value));
                  }}
                  name="last_name_search"
                  data-cy="lastName"
                  required
                  requiredMessage={<FormattedMessage
                    id="quotesCompareInputs.mortgagePartnerLastNameRequiredMessage.A8hd6C"
                  />}
                />
              </>
            )}
          </>
        }
      />
    </>
  );
};
