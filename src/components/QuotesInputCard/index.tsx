import React, { } from 'react';
import { Card, Divider, Spacer, Typography, Select, Tooltip, RadioGroup, ActionItem, UsersIcon, PlusIcon, XIcon } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl } from 'react-intl';
import { TenantCustomisationSlot } from '../Customisation';
import { DEPENDENT_MAX_AGE, GENDER_OPTIONS, HD_MAX_AGE, MIN_AGE, NEW_PROD_MAX_AGE, PM_PRODUCT_PREFIX, ProductType, PROVINCE_TYPES, PROVINCES, USER_TYPES } from '../../utils/const';
import { tobaccoWhatIf } from '../../constants/whatifs';
import { PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS } from '../../config';
import { isCAAEnvironment } from '../../tenant/helpers';
import { DISCOUNT_CODES, DISCOUNTS_VALUE } from '../../utils/discounts';
import DateOfBirth from '../DateOfBirth';

const smokingOptions = [
  {
    value: true,
    text: <FormattedMessage id="global.yes.JVS0d0" />,
  },
  {
    value: false,
    text: <FormattedMessage id="global.no.nlGQVZ" />,
  },
];

export const genderWhatIf = (
  <Typography
    variant="body2"
    align="left"
    message={<FormattedMessage
      id="whatifs.genderWhatIf.utw1ac"
      values={{
        br: <br />,
      }}
    />}
  />
);

const ProvinceHeaders = ({ isHd, isSecondary }: { isHd: boolean, isSecondary: boolean }) => {
  if (isHd) {
    if (isSecondary) {
      return <FormattedMessage id="quotesCompareInputs.partnerHealthcardProvince.90lrRd" />;
    }
    return <FormattedMessage id="quotesCompareInputs.healthcardProvince.mROvf4" />;
  }
  if (isSecondary) {
    return <FormattedMessage id="quotesCompareInputs.whatProvinceDoTheyLiveIn.cd3T9x" />;
  }
  return <FormattedMessage id="quotesCompareInputs.whatProvinceDoYouLiveIn.99pzOj" />;
};

const HealthCardProvince = ({ isDependent,
  name,
  product,
  updateHouseholdProp,
  user,
  provType }:
  {
    isDependent: boolean,
    name: string,
    product: string,
    updateHouseholdProp: (property: string, value: any) => void,
    user: any,
    provType: string
  }) => {
  const intl = useIntl();
  if (isDependent) {
    return null;
  }
  const isHD = product === PM_PRODUCT_PREFIX.HD;
  const isSecondary = name === USER_TYPES.SECONDARY;

  return (
    <>
      <Typography
        variant="h3"
        align="left"
        message={<ProvinceHeaders isHd={isHD} isSecondary={isSecondary} />}
      />
      <Spacer size="spaceXS" />
      <Select
        autoComplete
        autoHighlight
        label={<FormattedMessage id="global.province.pPf9cm" />}
        multiple={false}
        name={`${name}_province_search`}
        options={PROVINCE_TYPES}
        value={user[provType] in PROVINCES ? user[provType] : ''}
        onChange={(val) => {
          if (product === PM_PRODUCT_PREFIX.HD) {
            updateHouseholdProp('healthcard_province', val?.value || '');
          } else {
            updateHouseholdProp('province', val?.value || '');
          }
        }}
        required
        requiredMessage={<FormattedMessage id="address.provinceRequired.fuXlwk" />}
        dataCy={`${name}_addressProvince`}
        ariaLabel={intl.formatMessage({ id: 'global.province.pPf9cm' })}
      />
      <Spacer size="spaceSmall" />
    </>
  );
};

const DOBQuestionHeader = ({ name }: { name: string }) => {
  if (name === USER_TYPES.PRIMARY) {
    return (
      <Typography
        variant="h3"
        align="left"
        message={<FormattedMessage id="quotesCompareInputs.whatsYourDOB.RDygGW" />}
      />
    );
  }

  return (<Typography
    variant="h3"
    align="left"
    message={<FormattedMessage id="quotesCompareInputs.whatsTheirDateOfBirth.prjzcq" />}
  />);
};

const GenderQuestion = ({
  name,
  userGender,
  updateHouseholdProp,
}: {
  name: string,
  userGender: string,
  updateHouseholdProp: (property: string, value: any) => void,
}) => {
  const tooltipHeader = name !== USER_TYPES.PRIMARY ?
    <FormattedMessage id="quotesCompareInputs.whyDoWeAskAboutGenderJoint.of3Okeof" /> :
    <FormattedMessage id="quotesCompareInputs.whyDoWeAskAboutGender.keof2O" />;

  const tooltip = (
    <Tooltip
      variant="icon-only"
      tooltipButtonName="Why do we ask about your gender?"
      tooltipHeader={tooltipHeader}
      ariaLabelledBy="why-do-we-ask-about-your-gender-tooltip-header"
      ariaDescribedBy="why-do-we-ask-about-your-gender-tooltip-description"
    >
      {genderWhatIf}
    </Tooltip>
  );

  const GenderRadioGroup = (
    <>
      <Spacer size="space2XS" />
      <RadioGroup
        name={`${name}_userGender`}
        orientation="horizontal"
        labelledBy="quotesCompareInputs.whatsTheirGender.TtGnIU"
        options={GENDER_OPTIONS}
        value={userGender}
        onChange={(val) => {
          updateHouseholdProp('userGender', val.target.value);
        }}
        required
        requiredMessage={
          <FormattedMessage
            id="gender.requiredMessage.pgwWWa"
          />
        }
        data-cy={`${name}_userGender`}
      />
    </>
  );

  if (name !== USER_TYPES.PRIMARY) {
    return (
      <>
        <Typography
          variant="h3"
          align="left"
          id="quotesCompareInputs.whatsTheirGender.TtGnIU"
          icon={tooltip}
          message={<FormattedMessage id="quotesCompareInputs.whatsTheirGender.TtGnIU" />}
        />
        {GenderRadioGroup}
      </>
    );
  }

  return (
    <>
      <Typography
        variant="h3"
        align="left"
        tooltip={tooltip}
        message={<FormattedMessage id="quotesCompareInputs.whatsYourGender.867zta" />}
      />
      {GenderRadioGroup}
    </>
  );
};

const SmokingQuestion = ({
  name,
  smoke,
  updateHouseholdProp,
  isDependent,
}: {
  name: string,
  smoke: boolean,
  updateHouseholdProp: (property: string, value: any) => void,
  isDependent: boolean,
}) => {
  const intl = useIntl();
  if (isDependent) {
    return null;
  }

  const tooltip = (
    <Tooltip
      variant="icon-only"
      tooltipButtonName={intl.formatMessage({ id: 'quotesCompareInputs.whatIsConsideredNicotine.6We3O9' })}
      tooltipHeader={<FormattedMessage id="quotesCompareInputs.whatIsConsideredNicotine.6We3O9" />}
      ariaLabelledBy="what-ic-considered-nicotine-tooltip-header"
      ariaDescribedBy="what-is-considered-nicotine-tooltip-description"
    >
      {tobaccoWhatIf}
    </Tooltip>
  );

  const SmokingRadioGroup = (
    <>
      <Spacer size="space2XS" />
      <RadioGroup
        name={`${name}_smoker`}
        options={smokingOptions}
        labelledBy="quotesCompareInputs.partnerHaveYouUsedNicotine.pMRQKu"
        value={smoke}
        orientation="horizontal"
        required
        requiredMessage={<FormattedMessage id="global.smoke.required.IV0WS3" />}
        onChange={(val) => {
          updateHouseholdProp('smoke', JSON.parse(val.target.value));
        }}
        data-cy={`${name}_expertSmoker`}
      />
    </>
  );

  if (name === USER_TYPES.SECONDARY) {
    return (
      <>
        <Typography
          variant="h3"
          align="left"
          id="quotesCompareInputs.partnerHaveYouUsedNicotine.pMRQKu"
          icon={tooltip}
          message={
            <FormattedMessage id="quotesCompareInputs.partnerHaveYouUsedNicotine.pMRQKu" />
          }
        />
        {SmokingRadioGroup}
      </>
    );
  }

  return (
    <>
      <Typography
        variant="h3"
        align="left"
        tooltip={tooltip}
        message={
          <FormattedMessage id="quotesCompareInputs.haveYouUsedNicotine.LZ1idT" />
        }
      />
      {SmokingRadioGroup}
    </>
  );
};

const QuotesInputCardContent = ({
  product,
  isDependent,
  name,
  updateHouseholdProp,
  user,
  active,
}: {
  product: ProductType;
  isDependent: boolean;
  name: string;
  updateHouseholdProp: (property: string, value: any) => void;
  user: any;
  active: boolean;
}) => {
  const provType = product === PM_PRODUCT_PREFIX.HD ? 'healthcard_province' : 'province';
  const maxAge = product === PM_PRODUCT_PREFIX.HD ?
    (isDependent ? DEPENDENT_MAX_AGE : HD_MAX_AGE) :
    NEW_PROD_MAX_AGE;
  const minAge = isDependent ? 0 : MIN_AGE;

  return (
    <>
      <Divider />
      <Spacer size="spaceSmall" />
      <HealthCardProvince
        isDependent={isDependent}
        name={name}
        product={product}
        updateHouseholdProp={updateHouseholdProp}
        user={user}
        provType={provType}
      />
      <DOBQuestionHeader name={name} />
      <Spacer size="spaceXS" />
      <DateOfBirth
        name={`${name}_birthdate`}
        required
        value={user.birthdate}
        onChange={(val) => {
          updateHouseholdProp('birthdate', val);
        }}
        minAge={minAge}
        minAgeMessage={
          <FormattedMessage
            id="quotesCompareInputs.dobMinAgeMessage.7L5nVM"
            values={{
              minAge,
            }}
          />
        }
        maxAgeNearest={maxAge}
        maxAgeNearestMessage={
          <FormattedMessage
            id="quotesCompareInputs.dobMaxAgeMessage.LYcm8g"
            values={{
              maxAge,
            }}
          />
        }
        data-cy={`${name}_expertDOB`}
      />
      <Spacer size="spaceSmall" />
      <GenderQuestion
        name={name}
        userGender={user.userGender}
        updateHouseholdProp={updateHouseholdProp}
      />
      <Spacer size="spaceSmall" />
      <SmokingQuestion
        name={name}
        smoke={user.smoke}
        updateHouseholdProp={updateHouseholdProp}
        isDependent={isDependent}
      />
    </>
  );
};

const AddPartnerActionButtonSubheading = ({
  mainProduct,
}: {
  mainProduct: ProductType,
}) => {
  if (mainProduct === PM_PRODUCT_PREFIX.HD) {
    return PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS === '1' &&
      isCAAEnvironment() && (
        <Typography
          variant="body3"
          align="left"
          message={<FormattedMessage
            id="quotesInput.familyDiscountSavingPercentage.ajyuxy"
            values={{
              discountPerc: DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT],
              span: chunks => <strong>{chunks}</strong>,
            }}
          />}
        />
    );
  }

  return null;
};

export const AddPartnerActionButton = ({
  hasReachedMaxMembers,
  isJoint,
  mainProduct,
  onClick,
  dataCy,
}: {
  hasReachedMaxMembers: boolean;
  isJoint: boolean;
  mainProduct: ProductType;
  onClick: () => void;
  dataCy: string;
}) => {
  if (hasReachedMaxMembers || isJoint) {
    return null;
  }

  return (
    <>
      <ActionItem
        name="add-partner"
        variant="card"
        borderStyle="dashed"
        type="button"
        icon={<UsersIcon />}
        secondaryIcon={() => <PlusIcon variant="transparent" interactive />}
        dataCy={dataCy}
        onClick={onClick}
        heading={
          <Typography
            variant="h4"
            align="left"
            message={<FormattedMessage id="quotesCompareInputs.addYourPartner.2shHlV" />}
            component="h2"
          />
        }
        subheading={
          <AddPartnerActionButtonSubheading
            mainProduct={mainProduct}
          />
        }
      />
      <Spacer size="spaceMedium" />
    </>
  );
};

export const AddDependentActionButton = ({
  hasReachedMaxMembers,
  onClick,
}: {
  hasReachedMaxMembers: boolean;
  onClick: () => void;
}) => {
  if (hasReachedMaxMembers) {
    return null;
  }

  return (
    <>
      <ActionItem
        name="add-dependent"
        variant="card"
        borderStyle="dashed"
        type="button"
        icon={<UsersIcon />}
        dataCy="add-dependent-button"
        onClick={onClick}
        secondaryIcon={() => <PlusIcon variant="transparent" />}
        heading={
          <Typography
            variant="h4"
            align="left"
            message={<FormattedMessage id="quotesCompareInputs.addADependent.zVH7dd" />}
            component="h2"
          />
        }
        subheading={
          PM_ENABLE_FUW_HD_FAMILY_DISCOUNTS === '1' && isCAAEnvironment() &&
          <Typography
            variant="body3"
            align="left"
            message={
              <FormattedMessage
                id="quotesInput.familyDiscountSavingPercentage.ajyuxy"
                values={{
                  discountPerc: DISCOUNTS_VALUE[
                    DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT],
                  span: chunks => <strong>{chunks}</strong>,
                }}
              />
            }
          />
        }
      />
      <Spacer size="spaceMedium" />
    </>
  );
};

export interface QuotesInputCardProps {
  header: React.ReactNode;
  product: ProductType;
  deleteEnabled?: boolean;
  updateHouseholdProp: (property: string, value: any) => void;
  user: {
    healthcard_province: string;
    province: string;
    birthdate: string;
    userGender: string;
    smoke: boolean;
    hasPartner: boolean;
    application_language: string;
  } | {
    healthcard_province: string;
    province: string;
    firstName: string;
    lastName: string;
    birthdate: string;
    userGender: string;
    smoke: boolean;
  };
  name: string;
  active: boolean;
  onCardDelete?: () => void;
  hasIssue?: boolean;
  isDependent?: boolean;
}

const QuotesInputCard: React.FC<QuotesInputCardProps> = ({
  header,
  product,
  deleteEnabled = true,
  updateHouseholdProp,
  user,
  name,
  active,
  onCardDelete,
  hasIssue,
  isDependent,
}) => {
  const CardContent = (<QuotesInputCardContent
    product={product}
    isDependent={isDependent}
    updateHouseholdProp={updateHouseholdProp}
    user={user}
    name={name}
    active
  />);

  if (deleteEnabled) {
    return (
      <Card
        cardVariant="heading-and-actions"
        headingTypographyTagOverride="h2"
        action={() => (onCardDelete && onCardDelete())}
        actionDescription="Close Card Button"
        headingVariant="h2"
        icon={<XIcon variant="transparent" interactive />}
        heading={header}
        body={CardContent}
      />
    );
  }

  return (
    <Card
      cardVariant="only-heading"
      headingComponent={<Typography
        variant="h2"
        component="h2"
        align="left"
        message={header}
      />}
      body={CardContent}
    />
  );
};

export default QuotesInputCard;
