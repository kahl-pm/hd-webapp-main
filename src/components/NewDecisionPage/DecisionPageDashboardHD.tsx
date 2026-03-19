import React, { useState, useEffect } from 'react';
import { Typography, Card, Accordion, ChevronDownIcon, Row, Spacer, Checkbox, Button, Form, Avatar, Divider, ActionItem, ShieldIcon, RightArrowIcon, TextButton } from '@policyme/global-libjs-designsystem';
import { FormattedMessage, useIntl, FormattedNumber, injectIntl } from 'react-intl';
import { useTheme, styled } from '@mui/material';
import { getTenant, HD_Plan, RAW_HD_PLANS_DATA } from '@policyme/global-libjs-utils';

import { AURA_DECISION_TYPES, UNDERWRITING_METHODS, PM_PRODUCT_PREFIX } from '../../utils/const';
import { getDecisionCardTitle } from '../DecisionCard/utils';
import { formatCurrencyConfig } from '../../utils/reactIntlHelpers';
import { getBadges } from '../NewDecisionCard/helpers';
import { transformMemberPropsForDecision } from '../../utils/transformMemberProps';
import { DESCRIPTION_MAP, NAME_MAP } from '../../pages/health-and-dental/plans';
import { getTenantBasedFormattedText } from '../../tenant/helpers';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';
import { familyHasExclusions } from '../../Selectors/hdDecision';

import PriceHeader from '../NewDecisionCard/PriceHeader';
import HDExclusionsModal from '../NewDecisionCard/HDModals/HDExclusionsModal';
import HDFullDetailPlanModal from '../HDFullDetailPlanModal';
import { usePricing } from '../HOC/WithPricing';

const MAX_MEMBERS_DISPLAYED = 6;

/**
 * This is a temporary solution because we're styling icons
 * here as an edge case because lucide can't apply fills while
 * maintaining certain paths inside the svg.
 */
const SVGContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.icon.borderRadius,
  backgroundColor: theme.icon.frameBackgroundColor,
}));

function ExclusionsModal({
  isOpen,
  onCancel,
  firstName,
  exclusions,
}) {
  const intl = useIntl();
  const advisorEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const advisorPhone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER);
  const supportHours = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_HOURS);
  const advisorPhoneFormatted =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);

  return (
    <>
      <HDExclusionsModal
        isOpen={isOpen}
        onCancel={onCancel}
        firstName={firstName}
        exclusions={exclusions}
        advisorEmail={advisorEmail}
        advisorPhone={advisorPhone}
        supportHours={supportHours}
        advisorPhoneFormatted={advisorPhoneFormatted}
      />
    </>
  );
}

const MemberList = ({ members, onExclusionsClick }) => {
  return members.map((member, index) => (
    <React.Fragment key={member.name}>
      <Row sx={{ gap: '1rem', alignItems: 'center' }}>
        <Avatar variant="tag" content={`${member.firstName[0]}${member.lastName[0]}`} index={index} />
        <div>
          <Typography variant="body2Bold" message={member.name} />
          {member.hasExclusions ? (
            <TextButton
              onClick={() => onExclusionsClick(member.firstName, member.exclusions)}
              label={member.role}
              name={`${member.firstName} exclusions`}
            />
          ) : (
            <Typography variant="body3" message={member.role} />
          )}
        </div>
      </Row>
      {index !== (members.length - 1) && <Spacer size="spaceSmall" />}
    </React.Fragment>
  ));
};

const DecisionDashboardPageHD = (props) => {
  const intl = useIntl();
  const theme = useTheme();

  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [showExclusionDeclaration, setShowExclusionDeclaration] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exclusionDeclaration, setExclusionDeclaration] = useState(false);
  const [exclusionDeclarationDisabled, setExclusionDeclarationDisabled] = useState(false);
  // Exclusions Modal state
  const [showExclusionsModal, setShowExclusionsModal] = useState(false);
  const [exclusionsModalOptions, setExclusionsModalOptions] = useState({
    exclusions: [],
    firstName: '',
  });

  let planData = {};

  if (props.primary.selectedPlanType
    && props.primary.tenantName
    && props.primary.underwritingMethod) {
    const selectedPlanType = props.primary.selectedPlanType;
    const tenantName = props.primary.tenantName;
    const underwritingMethod = props.primary.underwritingMethod;

    const isGi = props.primary.isGi;
    const isJointApp = props.primary.isJoint;

    const plans = RAW_HD_PLANS_DATA[getTenant().code][underwritingMethod];
    const plan = plans?.[selectedPlanType] ?? {};

    // @ts-ignore there is no mn_prems in the type
    const price = plan?.mn_prems;
    // @ts-ignore there is no mn_prems in the type
    const nonDiscountedPrice = plan?.original_mn_prems;
    // @ts-ignore there is no mn_prems in the type
    const isDiscounted = plan?.is_discounted;
    const name = NAME_MAP[getTenant().code][selectedPlanType];
    const description = DESCRIPTION_MAP[selectedPlanType];

    planData = {
      ...plan,
      // eslint-disable-next-line
      formattedPrice: <FormattedNumber style="currency" currency="CAD" value={price} />,
      // eslint-disable-next-line
      formattedNonDiscountedPrice: isDiscounted ? <FormattedNumber style="currency" currency="CAD" value={nonDiscountedPrice} /> : null,
      isJoint: isJointApp,
      isGuaranteedAcceptance: isGi,
      name,
      description,
    };
  }

  const isApproved = props.family.family_decision === AURA_DECISION_TYPES.APPROVED;
  const isPaid = props.primary.hd_payment_initial_complete;
  const { pricing } = usePricing();
  const hdOverallPlanAmountCurrent = pricing.overall.hd.totalFirstPaymentMonthlyAmount;

  const family_members = transformMemberPropsForDecision(props);

  // Show exclusion declaration if family has exclusions and decision is approved
  useEffect(() => {
    if (props.family.family_decision === 'Approved' && familyHasExclusions(props.family.family_exclusions)) {
      setShowExclusionDeclaration(true);
      if (!props.primary.hd_policy_in_force) {
        setIsAccordionExpanded(true);
      }
    }
  }, [props.family.family_decision, props.family.family_exclusions]);

  // Disable exclusion declaration if initial payment is complete
  useEffect(() => {
    if (isPaid) {
      setExclusionDeclarationDisabled(true);
      setExclusionDeclaration(true);
    }
  }, [isPaid]);

  if (!hdOverallPlanAmountCurrent || !family_members?.length) {
    return null;
  }

  const onSubmit = async () => {
    if (showExclusionDeclaration) {
      await props.handleUpsertHDExclusionsDeclaration(props.dashboardUser);
    }
    props.updateMetadata('paymentSliderDown', false);
    props.handleApprovedStepsPage(props.dashboardUser);
  };

  const badges = getBadges(
    PM_PRODUCT_PREFIX.HD,
    isApproved ? AURA_DECISION_TYPES.APPROVED : AURA_DECISION_TYPES.REFER_TO_UNDERWRITER,
  );

  const openExclusionsModal = (userFirstName, userExclusions) => {
    setExclusionsModalOptions({
      firstName: userFirstName,
      exclusions: userExclusions,
    });
    setShowExclusionsModal(true);
  };

  const closeExclusionsModal = () => {
    setExclusionsModalOptions({
      firstName: '',
      exclusions: [],
    });
    setShowExclusionsModal(false);
  };

  const getGroupData = () => {
    const groupData = [];
    family_members.slice(0, MAX_MEMBERS_DISPLAYED).forEach((user) => {
      groupData.push(`${user.firstName[0]}${user.lastName[0]}`);
    });
    return groupData;
  };

  return (
    <>
      <Typography
        variant="body3"
        align="center"
        secondaryText
        mb="1rem"
        message={<FormattedMessage id="hdDecision.secondaryHeading.S64qUx" />}
      />
      <Typography
        variant="h1"
        align="center"
        mb="1rem"
        message={<FormattedMessage
          id="hdDecisionDashboard.header.78aisU"
          values={{
            approved: isApproved,
            paid: isPaid,
          }}
        />}
      />
      <Typography
        variant="h2"
        align="center"
        mb="1.5rem"
        message={<FormattedMessage
          id="hdDecisionDashboard.subHeader.kjU5tT"
          values={{
            approved: isApproved,
            paid: isPaid,
            b: chunks => chunks,
          }}
        />}
      />

      <Card
        cardVariant="heading-and-inline-badge"
        body={<Row sx={{ flexDirection: 'column', width: '100%' }}>
          <PriceHeader
            title={<FormattedMessage id="decisionCard.yourRate.jB7yLn" />}
            amount={intl.formatNumber(hdOverallPlanAmountCurrent, formatCurrencyConfig)}
            frequency={<FormattedMessage id="global.monthly.q8Sv6g" />}
            segmentEventName="HD - TOOLTIP Monthly Premium"
            product={PM_PRODUCT_PREFIX.HD}
          />
          {family_members.length > 1 ? (<>
            <Accordion
              inlineContent={<Typography
                variant="h4"
                color={theme.palette.text.primary}
                message={`${intl.formatMessage({ id: 'hdDecision.peopleCovered.PlcfYh' })}:`}
              />}
              heading={isAccordionExpanded ? <FormattedMessage id="hdDecision.seeLess.Gf5gBd" /> : <FormattedMessage id="hdDecision.seeMore.qoB4YV" />}
              variant="inline"
              position="right"
              id="insured-people-list"
              ariaControls="insured-people-list"
              icon={ChevronDownIcon}
              onChange={() => setIsAccordionExpanded((prev) => !prev)}
              expandedOverride={isAccordionExpanded}
              detail={
                <MemberList
                  members={family_members}
                  onExclusionsClick={openExclusionsModal}
                />
              }
            />
            {!isAccordionExpanded && <Avatar variant="grouped" groupData={getGroupData()} surplus={family_members.length > MAX_MEMBERS_DISPLAYED ? family_members.length - MAX_MEMBERS_DISPLAYED : undefined} />}
          </>) : <>
            <Typography
              variant="h4"
              color={theme.palette.text.primary}
              message={`${intl.formatMessage({ id: 'hdDecision.peopleCovered.PlcfYh' })}:`}
            />
            <Spacer size="space2XS" />
            <MemberList members={family_members} onExclusionsClick={openExclusionsModal} />
          </>}
          {isApproved && <><Spacer size="space2XS" />
            <Divider />
            <Spacer size="space2XS" />
            <ActionItem
              name="download-policy-coverage"
              variant="ghost"
              type="button"
              heading={<FormattedMessage id="ApprovedCard.whatsCovered.S5OHCU" />}
              icon={<SVGContainer><ShieldIcon variant="transparent" /></SVGContainer>}
              secondaryIcon={RightArrowIcon}
              onClick={() => setShowModal(!showModal)}
              dataCy="download-policy-coverage"
            />
            <HDFullDetailPlanModal
              // This might not be overlapping enough because we're arbitrarily
              // adding more data here than the component will allow,
              // will require a refactor to resolve.
              plan={planData as HD_Plan}
              isHDFullyUW={
                props.primary.underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN
              }
              isOpen={showModal}
              onCancel={() => setShowModal(false)}
            />
          </>}
        </Row>}
        positioning="inline"
        heading={getDecisionCardTitle(PM_PRODUCT_PREFIX.HD)}
        headingTypographyTagOverride="h3"
        badges={badges}
      />

      <Spacer size="spaceMedium" />

      <Form
        name="Decision Dashboard"
        onSubmit={onSubmit}
        segmentPayload={{
          name: 'HD Decision Dashboard',
          product_type: PM_PRODUCT_PREFIX.HD,
        }}
      >
        {showExclusionDeclaration && <>
          <Checkbox
            name="requiredCheck"
            containerVariant="card"
            label={
              <Typography
                variant="body3"
                align="left"
                message={<FormattedMessage
                  id="decisionDashboardPageHD.exclusionsDeclaration.88CORz"
                  values={{
                    b: (msg) => <strong>{msg}</strong>,
                  }}
                />}
              />
              }
            checked={exclusionDeclaration}
            onChange={(e) => setExclusionDeclaration(e.target.checked)}
            required
            disabled={exclusionDeclarationDisabled}
            errorMessage={<FormattedMessage
              id="authorization.authorizeMIBRequiredMessage.VmIRci"
            />}
            data-cy="checkbox-quotes-input"
          />
          <Spacer size="spaceMedium" />
        </>}
        {isApproved &&
        !isPaid &&
        (<>
          {(props.fromAccounts &&
            props.primary.underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN) && <>
              <Typography
                align="center"
                variant="body3"
                message={
                  <FormattedMessage
                    id="hdDecisionDashboard.acknowledgmentDropJourney.53aBn6"
                  />
                }
              />
              <Spacer size="spaceSmall" />
            </>}
          <Button
            dataCy="NextStep"
            type="submit"
            variant="primary"
            name="NextStep"
            disabled={showExclusionDeclaration && !exclusionDeclaration}
          >
            <Typography
              variant="CTALargePrimary"
              align="center"
              color="white"
              message={<FormattedMessage id="global.checkout.u47buw" />}
            />
          </Button>
          <Spacer size="spaceSmall" />
          <Typography
            variant="body3"
            align="center"
            message={<FormattedMessage id="DecisionDashboardPageLife.cancelNoFees.atbAXb" />}
          />
          </>)}
      </Form>

      <ExclusionsModal
        isOpen={showExclusionsModal}
        onCancel={closeExclusionsModal}
        {...exclusionsModalOptions}
      />
    </>
  );
};

export default injectIntl(DecisionDashboardPageHD);
