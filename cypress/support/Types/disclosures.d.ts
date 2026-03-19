type HaveBeenDeclined = false | {
  // TODO: Add declined fields
}

type SafeWorkType = 'None of the above';
type RiskyWorkType = 'Adult entertainment'
  | 'Construction and transport'
  | 'Professional Entertainer (for example: actor, dancer, musician)'
  | 'Forestry / logging'
  | 'Heights / stunts'
  | 'Military service'
  | 'Offshore duties'
  | 'Overseas assignments'
  | 'Pilot (for example police force pilot, media pilot) or flight instructor'
  | 'Professional sports'
  | 'Protective services'
  | 'Underwater duties'
  | 'Working with animals';

type WorkStatus = false
  | SafeWorkType
  | {
    workType: RiskyWorkType;
    // TODO: Add risky work fields
  };

type Bankruptcy = false | {
  // TODO: Add bankruptcy fields
}

type SimpleStatusInCanada = 'Citizen or have applied for citizenship'
  | 'Permanent resident or applied for permanent residency';
type ComplexStatusInCanada = 'Refugee claimant'
  | 'On a work permit'
  | 'International student on a student visa'
  | 'Other status';

type StatusInCanada = SimpleStatusInCanada
  | {
    status: ComplexStatusInCanada;
    // TODO: Add Status in Canada followup fields
  }

type Height = {
  centimeters: number;
} | {
  feet: number;
  inches: number;
}

type Weight = {
  kilograms: number;
} | {
  pounds: number;
}

type WeightChange = false | {
  // TODO: Add weight change fields
}

type TravelPlans = false | {
  // TODO: Add travel plan fields
}

type HazardousActivities = false | {
  // TODO: Add hazardous activities fields
}

type ImpairedDriving = false | {
  // TODO: Add impaired driving fields
}

type DrivingViolation = false | {
  // TODO: Add driving violation fields
}

type CriminalOffense = false | {
  // TODO: Add criminal offense fields
}

type TobaccoUse = false | {
  // TODO: Add tobacco use fields
}

type AlcoholUse = false | {
  // TODO: Add alcohol use fields
}

type AlcoholTreatment = false | {
  // TODO: Add alcohol treatment fields
}

type CannabisUse = false | {
  // TODO: Add cannabis use fields
}

type DrugUse = false | {
  // TODO: Add drug use fields
}
type NoFamilyHealthCondition = 'None of the above';
type UnknownFamilyHealthCondition = 'Unknown';
type FamilyHealthCondition = 'Alzheimer\'s Disease'
  | 'Cardiovascular / Heart disease (chest pain, heart attack and stroke)'
  | 'Dementia'
  | 'Cancer'
  | 'Cardiomyopathy'
  | 'Diabetes'
  | 'Huntington\'s disease'
  | 'Motor neuron disease'
  | 'Multiple sclerosis'
  | 'Muscular dystrophy'
  | 'Parkinson\'s disease'
  | 'Polycystic kidney disease';

type FamilyHealth = NoFamilyHealthCondition
  | UnknownFamilyHealthCondition
  | {
    conditions: FamilyHealthCondition[];
    //  TODO: Add family health condition fields
  }

type NoPersonalHealthCondition = 'None of these';
type PersonalHealthCondition = 'Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)'
  | 'Allergies or immune system disease / disorder'
  | 'Bladder, kidney (renal) or urinary disease / disorder'
  | 'Blood disease / disorder'
  | 'Bone, joint, muscle or connective tissue disease / disorder'
  | 'Brain, cerebral or intracranial (cerebrovascular) disease / disorder'
  | 'Breathing, lung or respiratory disease / disorder (including sleep apnea)'
  | 'Cancer, cyst, tumor, unusual growth or lump of any type'
  | 'Diabetes'
  | 'Ear, nose, throat or mouth disease / disorder'
  | 'Eye disease / disorder'
  | 'Heart disease / disorder'
  | 'Hepatitis'
  | 'Hormone, gland or metabolic disease / disorder'
  | 'Hypertension or elevated blood pressure'
  | 'Hypercholesterolemia / hyperlipidemia (high cholesterol)'
  | 'Hypertriglyceridemia (high triglycerides)'
  | 'Infectious disease or virus (do not disclose common colds or flu)'
  | 'Intestine, esophagus or stomach disease / disorder'
  | 'Liver, bile duct or gallbladder disease / disorder'
  | 'Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)'
  | 'Poisoning, Burn, Concussion, Heatstroke, or Frostbite'
  | 'Prostate disease / disorder'
  | 'Reproductive disease, disorder or condition'
  | 'Sexually transmitted infection (excluding HIV / AIDS)'
  | 'Skin disease or disorder (excluding skin cancer)'
  | 'Spinal or neurological disease / disorder / symptom'
  | 'Vein, artery or circulatory disease / disorder'
  | 'Other medical condition (not listed)';

type PersonalHealth = NoPersonalHealthCondition | {
  conditions: PersonalHealthCondition[];
  // TODO: Add personal health condition fields
}

type HealthConsultation = false | {
  // TODO: Add health consultation fields
}

export type Disclosure = {
  haveBeenDeclined: HaveBeenDeclined;
  work: WorkStatus,
  bankruptcy: Bankruptcy;
  statusInCanada: StatusInCanada;
  height: Height;
  weight: Weight;
  weightChange: WeightChange;
  travelPlans: TravelPlans;
  hazardousActivities: HazardousActivities;
  impairedDriving: ImpairedDriving;
  drivingViolation: DrivingViolation;
  criminalOffense: CriminalOffense;
  tobaccoUse: TobaccoUse;
  alcoholUse: AlcoholUse;
  alcoholTreatment: AlcoholTreatment;
  cannabisUse: CannabisUse;
  drugUse: DrugUse;
  familyHealth: FamilyHealth;
  personalHealth: PersonalHealth;
  healthConsultation: HealthConsultation;
};
