/**
 * Centralized question strings for Cypress tests
 * 
 * All question strings used in test cases and disclosure commands are defined here to ensure
 * consistency and make it easier to update questions when they change.
 */

export const QUESTIONS = {
  // Employment
  ARE_YOU_CURRENTLY_WORKING: 'Are you currently working?',
  DOES_YOUR_WORK_INVOLVE: 'Does your work involve any of the following?',
  
  // Financial
  ARE_YOU_GOING_THROUGH_BANKRUPTCY: 'Are you currently going through bankruptcy?',
  
  // Status
  STATUS_IN_CANADA: 'What is your status in Canada?',
  
  // Physical measurements
  HEIGHT: 'What is your height?',
  WEIGHT: 'What is your weight?',
  WEIGHT_CHANGED: 'Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?',
  
  // Travel
  TRAVEL_PLANS: 'Within the next 12 months, do you have confirmed plans to travel outside of Canada, the U.S.A., the Caribbean (excluding Haiti), United Kingdom, European Union, China, Japan, South Korea, Australia or New Zealand?',
  
  // Activities
  HAZARDOUS_ACTIVITIES: 'In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?',
  
  // Driving
  IMPAIRED_DRIVING: 'Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?',
  DRIVING_VIOLATION: 'Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?',
  CRIMINAL_OFFENCE: 'Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)',
  
  // Tobacco/Nicotine
  TOBACCO_NICOTINE_USE: 'In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?',
  TOBACCO_NICOTINE_PRODUCTS: 'What tobacco or nicotine product(s) have you used? (Check all that apply)',
  TOBACCO_NICOTINE_FREQUENCY: 'On average, how many tobacco or nicotine products do you consume / use? ',
  
  // Alcohol
  ALCOHOL_DRINKS_PER_DAY: 'On average, do you have 1 or more alcoholic drinks per day?',
  ALCOHOL_UNITS_CONSUME: 'On average, how many units of alcohol do you consume?',
  ALCOHOL_TREATMENT: 'Have you ever been treated or professionally advised to reduce or stop drinking alcohol?',
  ALCOHOL_REHAB_RECOMMENDED: 'Has your healthcare provider recommended that you complete a formal rehabilitation program, receive counseling or psychotherapy, or participate in a support group (e.g. Alcoholics Anonymous)?',
  ALCOHOL_TREATMENT_REASON: 'What was the reason that your healthcare provider recommended that you reduce or stop drinking alcohol?',
  ALCOHOL_LAST_DRINK: 'Approximately when did you last drink alcohol?',
  
  // Cannabis
  CANNABIS_USE: 'In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?',
  
  // Drugs
  OTHER_NARCOTICS: 'Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?',
  
  // Family medical history
  FAMILY_MEDICAL_HISTORY: 'Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)',
  
  // Medical conditions
  MEDICAL_CONDITIONS: 'Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)',
  
  // Healthcare provider
  HEALTHCARE_CONSULTATION: 'Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?',
  
  // Insurance application history
  INSURANCE_APPLICATION_HISTORY: 'Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)',
};

