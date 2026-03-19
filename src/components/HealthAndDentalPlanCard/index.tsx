import React, { useContext, useState, Children } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import { Icon, styled } from '@mui/material';
import { Modal,
  Card, Typography, Button,
  UniformSpacingLayout, Divider, PillBottleIcon,
  DentalIcon, GlassesIcon,
  BrainIcon,
  BedSingleIcon, TextButton, Spacer,
  BriefcaseMedicalIcon,
  ShieldPlusIcon, Row, NoBedIcon, MaxWidthContainer } from '@policyme/global-libjs-designsystem';

import HDFullDetailPlanModal from '../HDFullDetailPlanModal';
import { formatCurrencyWithoutDecimalsConfig } from '../../utils/reactIntlHelpers';

/**
 * This is a temporary solution because we're styling icons
 * here as an edge case because lucide can't apply fills while
 * maintaining certain paths inside the svg.
 */
const IconContainer = styled('div')(({ theme }) => ({
  minWidth: '2rem',
  [theme.breakpoints.down('tablet')]: {
    minWidth: '1.5rem',
  },
}));

/**
 * This is a temporary solution because we're styling icons
 * here as an edge case because lucide can't apply fills while
 * maintaining certain paths inside the svg.
 */
const SVGContainer = styled('div')(({ theme }) => ({
  borderRadius: theme.icon.borderRadius,
  backgroundColor: theme.icon.frameBackgroundColor,
}));

export const formatCurrency = (intl, value, currency) => {
  if (!value) { return ''; }

  return intl.formatNumber(
    value,
    {
      currency: currency ?? 'CAD',
      style: 'currency',
      currencyDisplay: 'narrowSymbol',
    },
  );
};

const CardBody: React.FC<any> = ({
  plan,
  noButton,
  isHDFullyUW,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showPrivacyBedModal, setShowPrivacyBedModal] = useState(false);

  const intl = useIntl();

  const formatPrice = (priceString) => {
    return intl.formatNumber(Number(priceString), formatCurrencyWithoutDecimalsConfig);
  };
  return (
    <UniformSpacingLayout flexDirection="column" gap="1rem">
      <Divider />
      <Typography
        variant="body2Bold"
        align="left"
        message={<FormattedMessage
          id="healthAndDentalCard.highlights.IZJsk1"
          values={{ isJoint: plan.isJoint }}
        />}
      />
      {plan.drugCoverageNotIncluded &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <PillBottleIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.coinsuranceOnlyDental.LY9K19"
              values={{
                strong: chunks => <strong>{chunks}</strong>,
                i: chunks => <em>{chunks}</em>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {plan.prescriptionDrugCoverage &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">
          <PillBottleIcon variant="default" />
          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.prescription.a5ZjPp"
              values={{
                percentCovered: plan?.prescriptionDrugCoverage?.percentCovered,
                annualMax: formatPrice(plan?.prescriptionDrugCoverage?.annualMax),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {(plan.dentalCoverage?.year1 && plan.dentalCoverage?.year2) &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-end">

          <DentalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.dentalCoverage.hcYcOO"
              values={{
                year1: formatPrice(plan?.dentalCoverage?.year1),
                year2: formatPrice(plan?.dentalCoverage?.year2),
                yearsAfter: formatPrice(plan?.dentalCoverage?.yearsAfter),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {(plan.dentalCoverage?.year1 && !plan.dentalCoverage.year2) &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <DentalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.dentalCoverageNoYear2.Jzc74I"
                // Dental coverage starts at <> in yr 1 and <> every year after
              values={{
                year1: formatPrice(plan?.dentalCoverage?.year1),
                yearsAfter: formatPrice(plan?.dentalCoverage?.yearsAfter),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {plan.dentalCoverage?.annualCombinedMax &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <DentalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.dentalCoverageConstant.aH7ILN"
              values={{
                annualCombinedMax: formatPrice(plan?.dentalCoverage?.annualCombinedMax),
                b: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {!plan.dentalCoverage &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <DentalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.dentalNotIncluded.m8Npe4"
              values={{
                strong: chunks => <strong>{chunks}</strong>,
                i: chunks => <em>{chunks}</em>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {plan.eyeware &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <GlassesIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.eyeCoverage.j8ic1O"
              values={{
                amountCovered: formatPrice(plan?.eyeware?.amountCovered),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {plan.professionalServicesWithLimit &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <BriefcaseMedicalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.professionalServiceLimited.RzsuLw"
              values={{
                perVisit: formatPrice(plan?.professionalServicesWithLimit?.perVisit),
                annualMax: formatPrice(plan?.professionalServicesWithLimit?.annualMax),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}
      {plan.professionalServicesWithPercent &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <BriefcaseMedicalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.professionalServicePercent.uYvHZF"
              values={{
                percent: plan?.professionalServicesWithPercent?.percent,
                annualMax: formatPrice(plan?.professionalServicesWithPercent?.annualMax),
                b: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {plan.professionalServicesUnlimited &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <BriefcaseMedicalIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.professionalServiceUnlimited.cWvAYC"
              values={{
                annualMax: formatPrice(plan?.professionalServicesUnlimited?.annualMax),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {plan.mentalHealth &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <BrainIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.mentalHealth.Skju7W"
              values={{
                annualMax: formatPrice(plan?.mentalHealth?.annualMax),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {plan.otherBenefits.hospitalRoom && !plan.otherBenefits.hospitalRoom.hideFromPlanCard &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <BedSingleIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.hospitalBed.dYBVLl"
              values={{
                daysCovered: (plan?.otherBenefits.hospitalRoom?.daysCovered),
                strong: chunks => <strong>{chunks}</strong>,
              }}
            />}
          />
        </UniformSpacingLayout>}

      {plan.otherBenefits &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <ShieldPlusIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.otherBenefits.BTq5FX"
            />}
          />
        </UniformSpacingLayout>}

      {plan.doesNotIncludeHospitalPrivacy &&
        <UniformSpacingLayout flexDirection="row" gap="1rem" justifyContent="flex-start">

          <NoBedIcon variant="default" />

          <Typography
            variant="body3"
            align="left"
            message={
              <FormattedMessage
                id="healthAndDentalCard.noPrivateBed.yhBbL4"
                values={{
                  strong: chunks => <strong>{chunks}</strong>,
                  i: chunks => <em>{chunks}</em>,
                  span: chunks => <TextButton
                    name="HospitalBedButton"
                    variant="inline"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPrivacyBedModal(true);
                    }}
                    label={chunks as unknown as string}
                  />,
                }}
              />
            }
          />
        </UniformSpacingLayout>}

      {plan.hospitalRoomNoLimit &&
      <UniformSpacingLayout gap="1rem" justifyContent="flex-start">

        <BedSingleIcon variant="default" />

        <Typography
          variant="body3"
          align="left"
          message={
            <Row sx={{
              gap: '0.3rem',
              width: 'max-content',
            }}
            >
              <FormattedMessage
                id="healthAndDentalCard.hospitalBedNoLimit.LhXO5v"
                values={{
                  daysCovered: (plan?.hospitalRoom?.daysCovered),
                  span: chunks => <TextButton
                    name="HospitalBedButton"
                    onClick={() => setShowPrivacyBedModal(true)}
                    label={chunks as unknown as string}
                  />,
                }}
              />
            </Row>
            }
        />
      </UniformSpacingLayout>}
      {plan.showHospitalPrivacy && (
      <Row>
        {/* FINE to remove for now according to design team
        <HospitalPrivacyCard
          formattedPeriod={plan?.hospitalRoom?.daysCovered}
          formattedPrice={plan?.hospitalRoom?.price}
          onChange={plan?.hospitalPrivacyOnChange}
          selected={plan?.hospitalPrivacySelected}
          applicantsCount={plan?.applicantsCount}
        /> */}
      </Row>
      )}
      <TextButton
        name="FullPlanDetailsButton"
        onClick={() => setShowModal(true)}
        label={intl.formatMessage({ id: 'healthAndDentalCard.seeFullPlanDetailsHere.1Z3Z3d' })}
      />
      {!noButton &&
      <Row>
        <Button
          onClick={plan.onChoosePlan}
          type="button"
          className="btn-primary btn-narrow"
          data-cy={plan.id.split(' ').join('-')}
          name="choosePlan"
        >
          <Typography
            variant="CTALargePrimary"
            message={<FormattedMessage
              id="healthAndDentalCard.chooseThisPlan.tkWohr"
            />}
          />
        </Button>
      </Row>}
      <Modal
        name="hospital-privacy-modal"
        header={<FormattedMessage id="healthAndDentalCard.hospitalPrivacy.modalTitle.u9qDYX" />}
        open={showPrivacyBedModal}
        handleClose={() => setShowPrivacyBedModal(false)}
        ariaDescribedBy="hospital-privacy-modal-body"
        ariaLabelledBy="hospital-privacy-modal"
      >
        <MaxWidthContainer width="md">
          <Spacer size="spaceMedium" />
          <Typography
            variant="body3"
            align="left"
            message={<FormattedMessage
              id="healthAndDentalCard.hospitalPrivacy.modalBody.u8aaUa"
              values={{ br: <br /> }}
            />}
          />
        </MaxWidthContainer>
      </Modal>
      <HDFullDetailPlanModal
        plan={plan}
        isHDFullyUW={isHDFullyUW}
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
      />
    </UniformSpacingLayout>
  );
};
/**
 * The need for these styles is a one off because of the needs of this
 * page. The design system doesn't have components that can be used out
 * of the box to achieve the desired layout. So we need some flexibility here.
 */
const StylesPriceRows = {
  gap: '0.5rem',
  alignItems: 'flex-end',
  flexWrap: 'nowrap',
  justifyContent: 'flex-end',
};

const CardHeading = ({ plan }) => {
  return (
    <Row
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <UniformSpacingLayout flexDirection="column">
        <Typography
          variant="h2"
          message={plan.name}
          align="left"
        />
        <Typography
          variant="body4"
          align="left"
          message={plan.description}
          italic
        />
      </UniformSpacingLayout>
      <UniformSpacingLayout flexDirection="column">
        <Row sx={StylesPriceRows}>
          <Typography
            variant="h3"
            component="p"
            message={plan.formattedPrice}
          />
          <Typography
            variant="body4"
            message={plan.formattedPeriod}
          />
        </Row>
        {plan.formattedNonDiscountedPrice ? <Row sx={StylesPriceRows}>
          <Typography
            variant="body4"
            message={plan.formattedNonDiscountedPrice}
            strikeThrough
          />
          <Typography
            variant="body4"
            message={plan.formattedPeriod}
            strikeThrough
          />
        </Row> : null}
        <Typography
          variant="body4"
          align="right"
          message={<FormattedMessage
            id="healthAndDentalCard.yourPremium.aWob4e"
            values={{ isJoint: plan.isJoint }}
          />}
          italic
        />
      </UniformSpacingLayout>
    </Row>
  );
};

export default function PlanCard({
  plan,
  noButton,
  isHDFullyUW,
}) {
  const intl = useIntl();
  // We are falling back to original name in NAME_MAP until we have fully migrated all tenants
  // TODO: Get rid of conditional check here
  const name = plan.planName ? intl.formatMessage(plan.planName as MessageDescriptor) : plan.name;
  const updatedPlan = { ...plan, ...{ name } };
  return <Card
    cardVariant="only-heading"
    headingComponent={<CardHeading plan={updatedPlan} />}
    body={<CardBody plan={updatedPlan} noButton={noButton} isHDFullyUW={isHDFullyUW} />}
  />;
}

PlanCard.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  plan: PropTypes.object,
  noButton: PropTypes.bool.isRequired,
};

PlanCard.defaultProps = {
  plan: {},
};
