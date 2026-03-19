import type { Disclosure } from '../Types/disclosures';

/**
 * Disclosure answers to get an automatic approval
 */
export const SimpleApproval:Disclosure = {
  haveBeenDeclined: false,
  work: 'None of the above',
  bankruptcy: false,
  statusInCanada: 'Permanent resident or applied for permanent residency',
  height: { centimeters: 180 },
  weight: { kilograms: 73 },
  weightChange: false,
  travelPlans: false,
  hazardousActivities: false,
  impairedDriving: false,
  drivingViolation: false,
  criminalOffense: false,
  tobaccoUse: false,
  alcoholUse: false,
  alcoholTreatment: false,
  cannabisUse: false,
  drugUse: false,
  familyHealth: 'None of the above',
  personalHealth: 'None of these',
  healthConsultation: false,
};

/**
 * Disclosure answers to Select approved and FUW to RUW
 */
export const SelectApprovedFuwRUWBankruptcy:Disclosure = {
  haveBeenDeclined: false,
  work: 'None of the above',
  bankruptcy: true,
  statusInCanada: 'Permanent resident or applied for permanent residency',
  height: { centimeters: 165 },
  weight: { kilograms: 60 },
  weightChange: false,
  travelPlans: false,
  hazardousActivities: false,
  impairedDriving: false,
  drivingViolation: false,
  criminalOffense: false,
  tobaccoUse: false,
  alcoholUse: false,
  alcoholTreatment: false,
  cannabisUse: false,
  drugUse: false,
  familyHealth: 'None of the above',
  personalHealth: 'None of these',
  healthConsultation: false,
};

/**
 * Disclosure answers to Select approved and FUW to RUW with smoking discrepancy
 */
export const SelectApprovedFuwRUWBankruptcySmokingDiscrepancy:Disclosure = {
  haveBeenDeclined: false,
  work: 'None of the above',
  bankruptcy: true,
  statusInCanada: 'Permanent resident or applied for permanent residency',
  height: { centimeters: 165 },
  weight: { kilograms: 60 },
  weightChange: false,
  travelPlans: false,
  hazardousActivities: false,
  impairedDriving: false,
  drivingViolation: false,
  criminalOffense: false,
  tobaccoUse: true,
  alcoholUse: false,
  alcoholTreatment: false,
  cannabisUse: false,
  drugUse: false,
  familyHealth: 'None of the above',
  personalHealth: 'None of these',
  healthConsultation: false,
};
