import { FormatNumberOptions, FormattedMessage, useIntl } from 'react-intl';
import React from 'react';
import { Modal, Typography, MaxWidthContainer, Spacer, Divider, UniformSpacingLayout, Row } from '@policyme/global-libjs-designsystem';
import type { HD_Plan } from '@policyme/global-libjs-utils';
import { getTenant } from '@policyme/global-libjs-utils';
import { HospitalRoom } from './OtherBenefits/HospitalRoom';
import { Ambulance } from './OtherBenefits/Ambulance';
import { MentalHealthTogetherAll } from './OtherBenefits/MentalHealthTogetherAll';
import { TelehealthMaple } from './OtherBenefits/TelehealthMaple';
import { AmountCovered } from './Vision/Vision';
import { EyeExamCoverage } from './Vision/EyeExam';
import { NursingServices } from './ExtendedMedicalCare/NursingServices';
import { Orthotics } from './ExtendedMedicalCare/Orthotics';
import { HearingAids } from './ExtendedMedicalCare/HearingAids';
import { AccidentalDentalCoverage } from './ExtendedMedicalCare/AccidentalDentalCoverage';
import { ProfessionalServicesWithLimitMax, ProfessionalServicesWithLimits } from './ProfessionalServices/ProfessionalServicesWithLimit';
import { ProfessionalServicesUnlimited } from './ProfessionalServices/ProfessionalServicesUnlimited';
import { ProfessionalServicesCoinsurance, ProfessionalServicesWithPercent } from './ProfessionalServices/ProfessionalServicesWithPercent';
import { MentalHealthServices } from './MentalHealth/MentalHealthServices';
import { SpeechTherapistCoverage } from './ExtendedMedicalCare/SpeechTherapistCoverage';
import { DiagnosticServices } from './ExtendedMedicalCare/DiagnosticServices';
import { YearlyMaximums } from './DentalCoverage/YearlyMaximums';
import { AnnualCombinedMaximums } from './DentalCoverage/AnnualCombinedMaximums';
import { MaintenanceServices } from './DentalCoverage/MaintenanceServices';
import { ComprehensiveCoveragePercentage } from './DentalCoverage/ComprehensiveCoveragePercentage';
import { MajorSurgeriesCoveragePercentage } from './DentalCoverage/MajorSurgeriesCoveragePercentage';
import { OrthodonticsCoveragePercentage } from './DentalCoverage/OrthodonticsCoveragePercentage';
import { CheckupFrequency } from './DentalCoverage/CheckupFrequency';
import { PercentCovered } from './PrescriptionDrugCoverage/PercentCovered';
import { AnnualMaximum } from './PrescriptionDrugCoverage/AnnualMaximum';
import { DispensingFee } from './PrescriptionDrugCoverage/DispensingFee';
import { MedicationsCovered } from './PrescriptionDrugCoverage/MedicationsCovered';
import { SectionDetails, SectionHeader, SubSectionHeader } from './sharedComponents';
import { getBasePlanRenderFunctions } from '../HDPlanBaseFields';
import { HD_PLAN_TENANT_CUSTOMISATION_SLOTS } from '../../tenant/customisation';

const formatCurrencyWithoutDecimalsConfig: FormatNumberOptions = { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0, currencyDisplay: 'narrowSymbol' };

interface HDFullDetailPlanModalProps {
  plan: HD_Plan;
  isHDFullyUW: boolean;
  isOpen: boolean;
  onCancel: () => void;
}

// don't need to re-render this because it's a constant
const basePlanRenderFunctions = getBasePlanRenderFunctions();

const HDFullDetailPlanModal = ({ plan, isHDFullyUW, isOpen, onCancel }:
  HDFullDetailPlanModalProps) => {
  const intl = useIntl();
  const modalIntro = intl.formatMessage(plan.planShortDescription, { br: <br /> });

  const formatPrice = (priceString) => {
    return intl.formatNumber(
      Number(priceString),
      formatCurrencyWithoutDecimalsConfig,
    );
  };

  const tenantCode = getTenant().code;
  const tenantCustomisation = HD_PLAN_TENANT_CUSTOMISATION_SLOTS[tenantCode];
  const renderFunctions = {
    ...basePlanRenderFunctions,
    ...tenantCustomisation,
  };

  const modalTitle = intl.formatMessage(plan.planTitle, { planType: plan.planType });

  return (
    <Modal
      name="plan-details-modal"
      header={modalTitle}
      open={isOpen}
      handleClose={onCancel}
      ariaDescribedBy="plan-details-modal-body"
      ariaLabelledBy="plan-details-modal"
    >
      <MaxWidthContainer width="lg" bgcolor="paper">
        <Spacer size="spaceMedium" />
        <Row>
          <Typography
            variant="body1"
            id={`plan-details-modal-intro-${plan.planType}`}
            message={modalIntro}
          />
        </Row>
        <Spacer size="spaceMedium" />
        <UniformSpacingLayout flexDirection="column" gap="2rem">
          {plan?.prescriptionDrugCoverage && (
          <div>
            <SectionHeader>
              <FormattedMessage id="planDetailsModalContent.prescriptionDrugsHeading.U0ojBr" />
            </SectionHeader>
            <PercentCovered
              plan={plan}
              isHDFullyUW={isHDFullyUW}
              renderFunctions={renderFunctions.prescriptionDrugCoverage}
            />
            <AnnualMaximum
              plan={plan}
              formatPrice={formatPrice}
              renderFunctions={renderFunctions.prescriptionDrugCoverage}
            />
            <DispensingFee
              plan={plan}
              formatPrice={formatPrice}
              renderFunctions={renderFunctions.prescriptionDrugCoverage}
            />
            <MedicationsCovered
              plan={plan}
              renderFunctions={renderFunctions.prescriptionDrugCoverage}
            />
          </div>
          )}
          {plan.prescriptionDrugCoverage && <Divider />}
          {plan.dentalCoverage && (
          <div>
            <SectionHeader>
              <FormattedMessage id="planDetailsModalContent.dentalCareHeading.eOBgnI" />
            </SectionHeader>
            <YearlyMaximums
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
              formatPrice={formatPrice}
            />
            <AnnualCombinedMaximums
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
              formatPrice={formatPrice}
            />
            <MaintenanceServices
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
            />
            <ComprehensiveCoveragePercentage
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
            />
            <MajorSurgeriesCoveragePercentage
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
            />
            <OrthodonticsCoveragePercentage
              plan={plan}
              formatPrice={formatPrice}
              renderFunctions={renderFunctions.dentalCoverage}
            />
            <CheckupFrequency
              plan={plan}
              renderFunctions={renderFunctions.dentalCoverage}
            />
          </div>
          )}
          {plan.dentalCoverage && <Divider />}
          {plan.extendedMedicalCare && (
            <div>
              <SectionHeader>
                <FormattedMessage id="planDetailsModalContent.extendedMedicalCareHeading.RNcCv7" />
              </SectionHeader>
              <NursingServices
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
              <Orthotics
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
              <HearingAids
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
              <AccidentalDentalCoverage
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
              <SubSectionHeader>
                <Typography
                  variant="h3"
                  component="h4"
                  message={
                    <FormattedMessage id="planDetailsModalContent.professionalServices.GsyUB3" />
                  }
                />
                {plan.professionalServicesWithLimit && (
                  <ProfessionalServicesWithLimits
                    plan={plan}
                    renderFunctions={renderFunctions.professionalServicesWithLimit}
                    formatPrice={formatPrice}
                  />
                )}
                {plan.professionalServicesUnlimited && (
                  <ProfessionalServicesUnlimited
                    plan={plan}
                    renderFunctions={renderFunctions.professionalServicesUnlimited}
                    formatPrice={formatPrice}
                  />
                )}
                {plan.professionalServicesWithPercent && (
                  <ProfessionalServicesWithPercent
                    plan={plan}
                    formatPrice={formatPrice}
                    renderFunctions={renderFunctions.professionalServicesWithPercent}
                  />
                )}
              </SubSectionHeader>
              <Spacer size="spaceXS" />
              {plan.professionalServicesWithLimit && (
                <ProfessionalServicesWithLimitMax
                  plan={plan}
                  renderFunctions={renderFunctions.professionalServicesWithLimit}
                  formatPrice={formatPrice}
                />
              )}
              {plan.professionalServicesWithPercent && (
                <ProfessionalServicesCoinsurance
                  plan={plan}
                  formatPrice={formatPrice}
                  renderFunctions={renderFunctions.professionalServicesWithPercent}
                />
              )}
              {/**
               * This is the fallback for the professional services details.
               * This is used if the professional services with percent is not present.
               * Pretty unique to this config so not adding to a base component.
               */}
              {!plan.professionalServicesWithPercent &&
              <SectionDetails>
                <Typography
                  variant="body1"
                  id={`professional-services-with-limit-value-${plan.planType}`}
                  message={
                    <FormattedMessage
                      id="planDetailsModalContent.professionalServicesDetails.OiwhAl"
                      values={{
                        coveragePerYear: formatPrice(
                          plan.professionalServicesWithLimit
                            ? plan.professionalServicesWithLimit.annualMax
                            : (plan.professionalServicesUnlimited &&
                                        plan.professionalServicesUnlimited?.annualMax),
                        ),
                        hasMaxPerPractitioner: plan.hasMaxPerPractitioner,
                        perVisit: plan?.professionalServicesWithLimit &&
                          plan?.professionalServicesWithLimit.perVisit,
                        hasLimit: plan?.professionalServicesWithLimit !== false,
                        b: (chunks) => <strong>{chunks}</strong>,
                      }}
                    />
                  }
                />
                </SectionDetails>}
              {plan.mentalHealth && (
                <MentalHealthServices
                  plan={plan}
                  formatPrice={formatPrice}
                  renderFunctions={renderFunctions.mentalHealth}
                />
              )}
              <SpeechTherapistCoverage
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
              <DiagnosticServices
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.extendedMedicalCare}
              />
            </div>
          )}
          {plan.extendedMedicalCare && <Divider />}

          {plan.eyeware && (
            <div>
              {plan.eyeware.amountCovered &&
                <AmountCovered
                  plan={plan}
                  formatPrice={formatPrice}
                  renderFunctions={renderFunctions.eyeware}
                />}
              {plan.eyeware.eyeExamCoverage && (
              <EyeExamCoverage
                plan={plan}
                formatPrice={formatPrice}
                renderFunctions={renderFunctions.eyeware}
              />
              )}
            </div>
          )}
          {plan.eyeware && <Divider />}

          {plan?.otherBenefits && (
          <div>
            <SectionHeader>
              <FormattedMessage id="planDetailsModalContent.otherHeading.vZ0eeT" />
            </SectionHeader>
            <TelehealthMaple
              plan={plan}
              renderFunctions={renderFunctions.otherBenefits}
            />
            <MentalHealthTogetherAll
              plan={plan}
              renderFunctions={renderFunctions.otherBenefits}
            />
            <Ambulance
              plan={plan}
              renderFunctions={renderFunctions.otherBenefits}
            />
            <HospitalRoom
              plan={plan}
              renderFunctions={renderFunctions.otherBenefits}
            />
          </div>
          )}
        </UniformSpacingLayout>
      </MaxWidthContainer>

    </Modal>

  );
};

export default HDFullDetailPlanModal;
