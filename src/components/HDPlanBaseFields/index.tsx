/**
 * This component is used to render the base fields for the HD Plan.
 */

import React from 'react';
import type { HD_Plan } from '@policyme/global-libjs-utils';
import { BasePercentCovered } from '../HDFullDetailPlanModal/PrescriptionDrugCoverage/PercentCovered';
import { BaseAnnualMaximum } from '../HDFullDetailPlanModal/PrescriptionDrugCoverage/AnnualMaximum';
import { BaseDispensingFee } from '../HDFullDetailPlanModal/PrescriptionDrugCoverage/DispensingFee';
import { BaseMedicationsCovered } from '../HDFullDetailPlanModal/PrescriptionDrugCoverage/MedicationsCovered';
import { BaseYearlyMaximums } from '../HDFullDetailPlanModal/DentalCoverage/YearlyMaximums';
import { BaseAnnualCombinedMaximums } from '../HDFullDetailPlanModal/DentalCoverage/AnnualCombinedMaximums';
import { BaseMaintenanceServices } from '../HDFullDetailPlanModal/DentalCoverage/MaintenanceServices';
import { BaseComprehensiveCoveragePercentage } from '../HDFullDetailPlanModal/DentalCoverage/ComprehensiveCoveragePercentage';
import { BaseMajorSurgeriesCoveragePercentage } from '../HDFullDetailPlanModal/DentalCoverage/MajorSurgeriesCoveragePercentage';
import { BaseOrthodonticsCoveragePercentage } from '../HDFullDetailPlanModal/DentalCoverage/OrthodonticsCoveragePercentage';
import { BaseCheckupFrequency } from '../HDFullDetailPlanModal/DentalCoverage/CheckupFrequency';
import { BaseNursingServices } from '../HDFullDetailPlanModal/ExtendedMedicalCare/NursingServices';
import { BaseOrthoticsCoverage } from '../HDFullDetailPlanModal/ExtendedMedicalCare/Orthotics';
import { BaseHearingAids } from '../HDFullDetailPlanModal/ExtendedMedicalCare/HearingAids';
import { BaseAccidentalDentalCoverage } from '../HDFullDetailPlanModal/ExtendedMedicalCare/AccidentalDentalCoverage';
import { BaseProfessionalServicesWithLimit, BaseProfessionalServicesWithLimitMax } from '../HDFullDetailPlanModal/ProfessionalServices/ProfessionalServicesWithLimit';
import { BaseProfessionalServicesUnlimited } from '../HDFullDetailPlanModal/ProfessionalServices/ProfessionalServicesUnlimited';
import { BaseProfessionalServicesCoinsurance, BaseProfessionalServicesWithPercent } from '../HDFullDetailPlanModal/ProfessionalServices/ProfessionalServicesWithPercent';
import { BaseLimitApplies, BaseMentalHealthAnnualMax, BaseMentalHealthPerSessionMax } from '../HDFullDetailPlanModal/MentalHealth/MentalHealthServices';
import { BaseSpeechTherapistCoverage, BaseSpeechTherapistCoveragePercent, BaseSpeechTherapistCoveragePerVisit, BaseSpeechTherapistsRAndCLimit } from '../HDFullDetailPlanModal/ExtendedMedicalCare/SpeechTherapistCoverage';
import { BaseDiagnosticServices } from '../HDFullDetailPlanModal/ExtendedMedicalCare/DiagnosticServices';
import { BaseAmountCovered } from '../HDFullDetailPlanModal/Vision/Vision';
import { BaseEyeExam } from '../HDFullDetailPlanModal/Vision/EyeExam';
import { BaseTelehealthMaple } from '../HDFullDetailPlanModal/OtherBenefits/TelehealthMaple';
import { BaseMentalHealthTogetherAll } from '../HDFullDetailPlanModal/OtherBenefits/MentalHealthTogetherAll';
import { BaseAmbulance } from '../HDFullDetailPlanModal/OtherBenefits/Ambulance';
import { BaseHospitalRoom } from '../HDFullDetailPlanModal/OtherBenefits/HospitalRoom';
// Define eligible fields by omitting non-renderable fields
type EligibleFields = Omit<HD_Plan,
  'id' | 'planType' | 'onChoosePlan' | 'isOnlyDental' | 'drugCoverageNotIncluded' | 'hasMaxPerPractitioner'
  | 'doesNotIncludeHospitalPrivacy' | 'formattedPeriod' | 'category'
>;

export type PrescriptionDrugCoverage = HDPlanRenderFunctions['prescriptionDrugCoverage'];
export type DentalCoverage = HDPlanRenderFunctions['dentalCoverage'];
export type ExtendedMedicalCare = HDPlanRenderFunctions['extendedMedicalCare'];
export type ProfessionalServicesWithLimit = HDPlanRenderFunctions['professionalServicesWithLimit'];
export type ProfessionalServicesUnlimited = HDPlanRenderFunctions['professionalServicesUnlimited'];
export type ProfessionalServicesWithPercent = HDPlanRenderFunctions['professionalServicesWithPercent'];
export type MentalHealth = HDPlanRenderFunctions['mentalHealth'];
export type EyeWare = HDPlanRenderFunctions['eyeware'];
export type OtherBenefits = HDPlanRenderFunctions['otherBenefits'];
/**
 * This type is used to create a recursive type that handles nested fields.
 */
type NestedRenderFunctions<T> = {
  [K in keyof T]?: T[K] extends object
    ? NestedRenderFunctions<NonNullable<T[K]>>
    : (value?: NonNullable<T[K]>, id?: string, additionalProps?: any) => React.ReactNode;
};

export type HDPlanRenderFunctions = {
  [K in keyof EligibleFields]?: EligibleFields[K] extends object | false
    ? NestedRenderFunctions<NonNullable<EligibleFields[K]>>
  : (value?: NonNullable<EligibleFields[K]>,
    id?: string, additionalProps?: any) => React.ReactNode;
};

/**
 * This is the base render functions for the HD Plan.
 * This is used to only render the base components for the HD Plan.
 */
const basePlanRenderFunctions: HDPlanRenderFunctions = {
  prescriptionDrugCoverage: {
    percentCovered: (value: string, id: string, additionalProps: { isHDFullyUW: boolean }) => {
      return <BasePercentCovered value={value} id={id} isHDFullyUW={additionalProps.isHDFullyUW} />;
    },
    annualMax: (value: number,
      id: string,
      additionalProps: { formatPrice: (val: number) => string }) => {
      return <BaseAnnualMaximum value={value} id={id} formatPrice={additionalProps.formatPrice} />;
    },
    dispensingFee: (dispensingFee,
      id,
      additionalProps: { formatPrice: (val: number) => string,
        dispensingFeeCovered: boolean }) => {
      return <BaseDispensingFee
        dispensingFee={dispensingFee}
        id={id}
        formatPrice={additionalProps.formatPrice}
        dispensingFeeCovered={additionalProps.dispensingFeeCovered}
      />;
    },
    usesFormulary: (value: boolean, id: string) => {
      return <BaseMedicationsCovered value={value} id={id} />;
    },
  },
  dentalCoverage: {
    // need to refactor, should combine year1 and annualCombinedMax
    annualCombinedMax: (value, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseAnnualCombinedMaximums
        value={value && value}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    year1: (year1, id, additionalProps:
      {
        year2: number
        yearsAfter: number
        formatPrice: (val: number) => string
      }) => <BaseYearlyMaximums
        year1={year1}
        id={id}
        formatPrice={additionalProps.formatPrice}
        year2={additionalProps.year2}
        yearsAfter={additionalProps.yearsAfter}
      />,
    maintenanceCoveragePercentage: (
      maintenanceCoveragePercentage,
      id, additionalProps:
      {
        hasMaintenanceCoveragePercentageYear2: boolean
      },
    ) => <BaseMaintenanceServices
      maintenanceCoveragePercentage={maintenanceCoveragePercentage}
      id={id}
      hasMaintenanceCoveragePercentageYear2={additionalProps.hasMaintenanceCoveragePercentageYear2}
    />,
    comprehensiveCoveragePercentage: (
      value, id,
    ) => <BaseComprehensiveCoveragePercentage value={value} id={id} />,
    majorSurgeriesCoveragePercentage: (
      majorSurgeriesCoveragePercentage, id, additionalProps:
      {
        majorSurgeriesYear: string
      },
    ) => <BaseMajorSurgeriesCoveragePercentage
      percent={majorSurgeriesCoveragePercentage}
      id={id}
      year={additionalProps.majorSurgeriesYear}
    />,
    orthodonticsCoveragePercentage: (
      orthodonticsCoveragePercentage, id, additionalProps:
      {
        orthodonticsMaxCoverage: number
        orthodonticsInitialYears: number
        formatPrice: (priceString: number) => string
      },
    ) => <BaseOrthodonticsCoveragePercentage
      orthodonticsCoveragePercentage={orthodonticsCoveragePercentage}
      id={id}
      orthodonticsMaxCoverage={additionalProps.orthodonticsMaxCoverage}
      orthodonticsInitialYears={additionalProps.orthodonticsInitialYears}
      formatPrice={additionalProps.formatPrice}
    />,
    checkupFrequencyInMonths: (
      checkupFrequencyInMonths, id,
    ) => <BaseCheckupFrequency
      checkupFrequencyInMonths={checkupFrequencyInMonths}
      id={id}
    />,
  },
  extendedMedicalCare: {
    year1: (year1, id, additionalProps:
      {
        year2: number
        yearsAfter: number
        monthsWait: number
        annualMax: number
        formatPrice: (val: number) => string
      }) => <BaseNursingServices
        year1={year1 && year1}
        id={id}
        year2={additionalProps.year2}
        yearsAfter={additionalProps.yearsAfter}
        formatPrice={additionalProps.formatPrice}
        monthsWait={additionalProps.monthsWait}
        annualMax={additionalProps.annualMax}
      />,
    orthoticsCoverage: (orthoticsCoverage, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseOrthoticsCoverage
        orthoticsCoverage={orthoticsCoverage && orthoticsCoverage}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    hearingAidsCoverage: (hearingAidsCoverage, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseHearingAids
        hearingAidsCoverage={hearingAidsCoverage && hearingAidsCoverage}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    accidentalDentalCoverage: (accidentalDentalCoverage, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseAccidentalDentalCoverage
        accidentalDentalCoverage={accidentalDentalCoverage && accidentalDentalCoverage}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    speechTherapistsCoverage: (speechTherapistsCoverage, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseSpeechTherapistCoverage
        speechTherapistsCoverage={speechTherapistsCoverage && speechTherapistsCoverage}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    speechTherapistsCoveragePercent: (
      speechTherapistsCoveragePercent,
      id,
    ) => <BaseSpeechTherapistCoveragePercent
      speechTherapistsCoveragePercent={speechTherapistsCoveragePercent
          && speechTherapistsCoveragePercent}
      id={id}
    />,
    speechTherapistsCoveragePerVisit: (speechTherapistsCoveragePerVisit, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseSpeechTherapistCoveragePerVisit
        speechTherapistsCoveragePerVisit={speechTherapistsCoveragePerVisit
          && speechTherapistsCoveragePerVisit}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    speechTherapistsRAndCLimit: () => <BaseSpeechTherapistsRAndCLimit />,
    diagnosticServices: (diagnosticServices, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseDiagnosticServices
        diagnosticServices={diagnosticServices && diagnosticServices}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
  },
  professionalServicesWithLimit: {
    perVisit: (perVisit, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseProfessionalServicesWithLimit
        perVisit={perVisit}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    annualMax: (annualMax, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseProfessionalServicesWithLimitMax
        annualMax={annualMax && annualMax}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
  },
  professionalServicesUnlimited: {
    annualMax: (annualMax, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseProfessionalServicesUnlimited
        annualMax={annualMax}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
  },
  professionalServicesWithPercent: {
    percent: (percent, id, additionalProps:
      {
        formatPrice: (val: number) => string
        annualMax: number
      }) => <BaseProfessionalServicesCoinsurance
        percent={percent}
        id={id}
        formatPrice={additionalProps.formatPrice}
        annualMax={additionalProps.annualMax}
      />,
    annualMax: (annualMax, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseProfessionalServicesWithPercent
        annualMax={annualMax}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
  },
  mentalHealth: {
    annualMax: (annualMax, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseMentalHealthAnnualMax
        annualMax={annualMax}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    perSession: (perSession, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseMentalHealthPerSessionMax
        perSession={perSession}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    limitApplies: (limitApplies, id) => <BaseLimitApplies
      limitApplies={limitApplies}
      id={id}
    />,
  },
  eyeware: {
    amountCovered: (amountCovered, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseAmountCovered
        amountCovered={amountCovered}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
    eyeExamCoverage: (eyeExamCoverage, id, additionalProps:
      {
        formatPrice: (val: number) => string
      }) => <BaseEyeExam
        eyeExamCoverage={eyeExamCoverage}
        id={id}
        formatPrice={additionalProps.formatPrice}
      />,
  },
  otherBenefits: {
    telehealthMaple: (telehealthMaple, id) => <BaseTelehealthMaple
      telehealthMaple={telehealthMaple}
      id={id}
    />,
    mentalHealthTogetherAll: (mentalHealthTogetherAll, id) => <BaseMentalHealthTogetherAll
      mentalHealthTogetherAll={mentalHealthTogetherAll}
      id={id}
    />,
    ambulance: (ambulance, id) => <BaseAmbulance
      ambulance={ambulance}
      id={id}
    />,
    // @ts-ignore - move hospitalRoom out of otherBenefits
    hospitalRoom: (
      value: {
        daysCovered: number,
        daysCoveredFull: number,
      },
      id: string,
    ) => <BaseHospitalRoom
      value={value}
      id={id}
    />,
  },
};

const getBasePlanRenderFunctions = () => {
  return basePlanRenderFunctions;
};

export {
  getBasePlanRenderFunctions,
};
