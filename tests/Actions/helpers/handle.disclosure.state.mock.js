export const STATE = {
  primary: {
    household: {
      email: 'jude.martin+2024-Jan25-fuw-caa-2-2478@policyme.com',
      firstName: 'Jude',
      lastName: 'Martin',
      hasPartner: true,
      partnerAge: '',
      partnerGender: '',
      userIncome: '',
      userIncomeOverride: 80000,
      userGender: 'Male',
      hasSavings: '',
      partnerIncome: '',
      partnerIncomeOverride: 80000,
      hasDebts: '',
      residenceType: '',
      birthdate: '01/01/1995',
      smoke: false,
      health: '',
      phone: '',
      hasKids: '',
      kids: [],
      nonRetirementSavings: '',
      retirementSavings: '',
      assetsTotOverride: '',
      creditCards: '',
      linesOfCredit: '',
      homeEquityLoans: '',
      mortgage: '',
      otherDebt: '',
      studentLoans: '',
      debtsTotOverride: '',
      hasExistingCoverage: '',
      address_line1: '618 Patricia Street',
      address_line2: '',
      city: 'Jasper',
      country: 'CA',
      postal_code: 'T0E 1E0',
      province: 'AB',
      healthcard_province: 'AB',
      existingCoverage: {
        spouse: {
          group: '',
          individual: '',
        },
        user: {
          group: '',
          individual: '',
        },
      },
      user_family_composition: 'Self + Partner + Kids',
      application_language: 'en-CA',
    },
    session: {
      household_id: '9b3be808-ec64-4c53-baa4-4a4cc3ce604f',
      household_id_vers: 0,
      hd_session_id: '37904acc-39b2-4452-83e7-16b211c2f77c',
      hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
      hd_policy_id: '',
      hd_family_id: 'd23aa4f9-4141-4fc3-b274-1024d04c7c1a',
      aura_session_id: 'fd285371-c755-4a52-b25a-e5c65644d591',
      promo_code: '',
      auth_num_attempts_remaining: '',
      auth_num_otp_attempts_remaining: '',
      auth_otp_authorized: '',
      auth_medium: '',
      auth_validate_email_phone: '',
      auth_verify_access_code: '',
      helcim_customer_code: '',
      twilio_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3OTUwLCJpYXQiOjE3MDYxMjI1ODYsImV4cCI6MTcwNjE0MDU4NiwicGF5bG9hZCI6eyJ1c2VyX3Rva2VuIjoidzUzMGRZZzI1amE0eVFWYlhqVHRuUjJRVENLMjAwWmRnSVA4dE1PaGRPMy04MkV1eGpMb0RlNlJmRVhEWnFrcHdVOXBUTzhKbEEtNDFNWVBvM3dPVG8tcXlqdDM2eFVXZmdBZGF6YjU3aXdoY0VmWVdHMmZZallIaWRiLVViMnNERGlnZjJUZGQ3dXhQYzNQSHFnVmxjNUZ3Y2R3UElzMno1U0FvY2JGcUxXZkRvVUdON1ZmMktUSkxaTUJSY2xFYmJqVTR0X3R4cGtQWjBrVFF2emhWUWpCT0pCdzFUaUNYY0RpRGo2YmswQzg4TkpQSHVwRlpvRXk0eGtEWVkwSGJUeUtuY3MzdFdybmtDN2hlWk1lVlMzMmpBbEtDVXozQXMtamhqUF81NFlEMFVyWnotUVpOWF9HTXZrLUJzd2YxV1hHVkhXOEJXNnRGU2VTS2hrYkpnIiwiZW52IjoidGVzdCIsInRlbmFudF9pZCI6IjdhYmYwNTEyLWNlMmYtNGQxZC05MGM0LTU2MDc0MmNiZGZiYiIsIm9uX2RlbWFuZF9lbnYiOiJDT1JFLTI0NzgifX0.b6OK8qPl2qGU7z2yctExziqg3aDTEpeXi4wXH1IsQYg',
      user_id: 17950,
    },
    disclosure: {
      disclosures: {
        1: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/1',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.',
            id: 1,
            isAnswered: false,
            richHelpText: '<span>Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.</span>',
            richText: '<span>Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)</span>',
            text: 'Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 1,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 0,
        },
        10: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/10',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 10,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently working?</span>',
            text: 'Are you currently working?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 10,
            questionType: 'SINGLE_CHOICE',
            value: 'true',
          },
          section_id: 0,
        },
        11: {
          question: {
            _links: {
              parentQuestion: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/10',
              },
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/11',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Adult entertainment</span>',
                  text: 'Adult entertainment',
                  unknownAnswer: false,
                  value: 'choiceValue2',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Construction and transport</span>',
                  text: 'Construction and transport',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Professional Entertainer (for example: actor, dancer, musician)</span>',
                  text: 'Professional Entertainer (for example: actor, dancer, musician)',
                  unknownAnswer: false,
                  value: 'dt_Entertainer',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Forestry / logging</span>',
                  text: 'Forestry / logging',
                  unknownAnswer: false,
                  value: 'choiceValue5',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Heights / stunts</span>',
                  text: 'Heights / stunts',
                  unknownAnswer: false,
                  value: 'choiceValue3',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Military service</span>',
                  text: 'Military service',
                  unknownAnswer: false,
                  value: 'choiceValue6',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Offshore duties</span>',
                  text: 'Offshore duties',
                  unknownAnswer: false,
                  value: 'choiceValue7',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Overseas assignments</span>',
                  text: 'Overseas assignments',
                  unknownAnswer: false,
                  value: 'choiceValue4',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Pilot (for example police force pilot, media pilot) or flight instructor</span>',
                  text: 'Pilot (for example police force pilot, media pilot) or flight instructor',
                  unknownAnswer: false,
                  value: 'dt_Pilot',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Professional sports</span>',
                  text: 'Professional sports',
                  unknownAnswer: false,
                  value: 'choiceValue8',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Protective services</span>',
                  text: 'Protective services',
                  unknownAnswer: false,
                  value: 'choiceValue9',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Underwater duties</span>',
                  text: 'Underwater duties',
                  unknownAnswer: false,
                  value: 'choiceValue10',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Working with animals</span>',
                  text: 'Working with animals',
                  unknownAnswer: false,
                  value: 'choiceValue11',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>None of the above</span>',
                  text: 'None of the above',
                  unknownAnswer: false,
                  value: 'choiceValue12',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 11,
            isAnswered: false,
            parentChoiceVal: 'true',
            parentQuestionId: 10,
            richHelpText: '',
            richText: '<span>Does your work involve any of the following?</span>',
            text: 'Does your work involve any of the following?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 11,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue12',
          },
          section_id: 0,
        },
        63: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/63',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 63,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently going through bankruptcy?</span>',
            text: 'Are you currently going through bankruptcy?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 63,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 0,
        },
        64: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/64',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Citizen or have applied for citizenship</span>',
                  text: 'Citizen or have applied for citizenship',
                  unknownAnswer: false,
                  value: 'drv_Citizen',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Permanent resident or applied for permanent residency</span>',
                  text: 'Permanent resident or applied for permanent residency',
                  unknownAnswer: false,
                  value: 'drv_PermanentResident',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Permanent resident or applied for permanent residency</span>',
                  text: 'Permanent resident or applied for permanent residency',
                  unknownAnswer: false,
                  value: 'drv_LandedImmigrant',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Refugee claimant</span>',
                  text: 'Refugee claimant',
                  unknownAnswer: false,
                  value: 'drv_RefugeeClaimant',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>On a work permit</span>',
                  text: 'On a work permit',
                  unknownAnswer: false,
                  value: 'drv_ForeignNational',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>International student on a student visa</span>',
                  text: 'International student on a student visa',
                  unknownAnswer: false,
                  value: 'drv_Visitor',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Other status</span>',
                  text: 'Other status',
                  unknownAnswer: false,
                  value: 'drv_Other',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'If you are on a permit or are a refugee and have applied for permanent residency, please select the \'Permanent or applied for permanent residency\' option.',
            id: 64,
            isAnswered: false,
            richHelpText: '<span>If you are on a permit or are a refugee and have applied for permanent residency, please select the &#39;Permanent or applied for permanent residency&#39; option.</span>',
            richText: '<span>What is your status in Canada?</span>',
            text: 'What is your status in Canada?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 64,
            questionType: 'SINGLE_CHOICE',
            value: 'drv_PermanentResident',
          },
          section_id: 0,
        },
        99: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/99',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              availableUnits: [
                {
                  decimalPrecision: 0,
                  label: 'feet/inches',
                  symbolParts: [
                    'ft',
                    'in',
                  ],
                  unitSymbol: 'ft_in',
                  validationRanges: [
                    {
                      lower: 3,
                      upper: 12,
                    },
                    {
                      lower: 0,
                      upper: 11,
                    },
                  ],
                },
                {
                  decimalPrecision: null,
                  label: 'centimeters',
                  symbolParts: [
                    'cm',
                  ],
                  unitSymbol: 'cm',
                  validationRanges: [
                    {
                      lower: 91,
                      upper: 394,
                    },
                  ],
                },
              ],
              canBeUnknown: false,
              componentType: 'TextInput',
            },
            context: [],
            externalId: '10000',
            helpText: '',
            id: 99,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>What is your height?</span>',
            text: 'What is your height?',
            type: 'UNITIZED',
          },
          answer: {
            id: 99,
            questionType: 'UNITIZED',
            value: {
              selectedUnit: 'ft_in',
              answerParts: [
                5,
                6,
              ],
            },
          },
          section_id: 0,
        },
        100: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/100',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              availableUnits: [
                {
                  decimalPrecision: 1,
                  label: 'pounds',
                  symbolParts: [
                    'lb',
                  ],
                  unitSymbol: 'lb',
                  validationRanges: [
                    {
                      lower: 1,
                      upper: 600,
                    },
                  ],
                },
                {
                  decimalPrecision: null,
                  label: 'kilograms',
                  symbolParts: [
                    'kg',
                  ],
                  unitSymbol: 'kg',
                  validationRanges: [
                    {
                      lower: 0,
                      upper: 273,
                    },
                  ],
                },
              ],
              canBeUnknown: false,
              componentType: 'TextInput',
            },
            context: [],
            externalId: '10001',
            helpText: '',
            id: 100,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>What is your weight?</span>',
            text: 'What is your weight?',
            type: 'UNITIZED',
          },
          answer: {
            id: 100,
            questionType: 'UNITIZED',
            value: {
              selectedUnit: 'lb',
              answerParts: [
                '165',
              ],
            },
          },
          section_id: 0,
        },
        101: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/101',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 101,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Has your weight changed by more than <strong>15 pounds (6.5 kilograms)</strong> in the past 12 months?</span>',
            text: 'Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 101,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue0',
          },
          section_id: 0,
        },
        119: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/119',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes travelling, working or living outside of the specified regions. ',
            id: 119,
            isAnswered: false,
            richHelpText: '<span>This includes travelling, working or living outside of the specified regions. </span>',
            richText: '<span>Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?</span>',
            text: 'Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 119,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        121: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/121',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.',
            id: 121,
            isAnswered: false,
            richHelpText: '<span>This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.</span>',
            richText: '<span>In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?</span>',
            text: 'In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 121,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        126: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/126',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes any charges relating to driving under the influence of alcohol or drugs.',
            id: 126,
            isAnswered: false,
            richHelpText: '<span>This includes any charges relating to driving under the influence of alcohol or drugs.</span>',
            richText: '<span>Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?</span>',
            text: 'Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 126,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        127: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/127',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.',
            id: 127,
            isAnswered: false,
            richHelpText: '<span>Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.</span>',
            richText: '<span>Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?</span>',
            text: 'Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 127,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        130: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/130',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 130,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)</span>',
            text: 'Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 130,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        131: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/131',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.',
            id: 131,
            isAnswered: false,
            richHelpText: '<span>Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.</span>',
            richText: '<span>In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?</span>',
            text: 'In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 131,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        133: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/133',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'dt_AlcoholUse',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Base your response on your typical drinking habits for a given day.',
            id: 133,
            isAnswered: false,
            richHelpText: '<span>Base your response on your typical drinking habits for a given day.</span>',
            richText: '<span>On average, do you have 1 or more alcoholic drinks per day?</span>',
            text: 'On average, do you have 1 or more alcoholic drinks per day?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 133,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        134: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/134',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'false',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.',
            id: 134,
            isAnswered: false,
            richHelpText: '<span>Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.</span>',
            richText: '<span>Have you ever been treated or professionally advised to reduce or stop drinking alcohol?</span>',
            text: 'Have you ever been treated or professionally advised to reduce or stop drinking alcohol?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 134,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue0',
          },
          section_id: 1,
        },
        135: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/135',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 135,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?</span>',
            text: 'In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 135,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        137: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/137',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.',
            id: 137,
            isAnswered: false,
            richHelpText: '<span>Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.</span>',
            richText: '<span>Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?</span>',
            text: 'Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 137,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        140: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/2',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/140',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  richText: '<span>Alzheimer&#39;s Disease</span>',
                  text: 'Alzheimer\'s Disease',
                  unknownAnswer: false,
                  value: 'dt_AlzheimersDisease',
                },
                {
                  richText: '<span>Cardiovascular / Heart disease (chest pain, heart attack and stroke)</span>',
                  text: 'Cardiovascular / Heart disease (chest pain, heart attack and stroke)',
                  unknownAnswer: false,
                  value: 'dt_CardiovascularDisease',
                },
                {
                  richText: '<span>Dementia</span>',
                  text: 'Dementia',
                  unknownAnswer: false,
                  value: 'dt_Dementia',
                },
                {
                  richText: '<span>Cancer</span>',
                  text: 'Cancer',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  richText: '<span>Cardiomyopathy</span>',
                  text: 'Cardiomyopathy',
                  unknownAnswer: false,
                  value: 'dt_Cardiomyopathy',
                },
                {
                  richText: '<span>Diabetes</span>',
                  text: 'Diabetes',
                  unknownAnswer: false,
                  value: 'dt_DiabetesMellitus',
                },
                {
                  richText: '<span>Huntington&#39;s disease</span>',
                  text: 'Huntington\'s disease',
                  unknownAnswer: false,
                  value: 'dt_HuntingtonsDisease',
                },
                {
                  richText: '<span>Motor neuron disease</span>',
                  text: 'Motor neuron disease',
                  unknownAnswer: false,
                  value: 'dt_MotorNeuronDisease',
                },
                {
                  richText: '<span>Multiple sclerosis</span>',
                  text: 'Multiple sclerosis',
                  unknownAnswer: false,
                  value: 'dt_MultipleSclerosis',
                },
                {
                  richText: '<span>Muscular dystrophy</span>',
                  text: 'Muscular dystrophy',
                  unknownAnswer: false,
                  value: 'dt_MuscularDystrophy',
                },
                {
                  richText: '<span>Parkinson&#39;s disease</span>',
                  text: 'Parkinson\'s disease',
                  unknownAnswer: false,
                  value: 'dt_ParkinsonsDisease',
                },
                {
                  richText: '<span>Polycystic kidney disease</span>',
                  text: 'Polycystic kidney disease',
                  unknownAnswer: false,
                  value: 'dt_PolycysticKidneyDisease',
                },
                {
                  richText: '<span>None of the above</span>',
                  text: 'None of the above',
                  unknownAnswer: false,
                  value: 'NONE_OF_ABOVE_CHOICE_CODE',
                },
                {
                  richText: '<span>Unknown</span>',
                  text: 'Unknown',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'CheckBoxResp',
            },
            context: [],
            helpText: 'Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.',
            id: 140,
            isAnswered: false,
            richHelpText: '<span>Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.</span>',
            richText: '<span>Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)</span>',
            text: 'Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)',
            type: 'MULTIPLE_CHOICE',
          },
          answer: {
            id: 140,
            questionType: 'MULTIPLE_CHOICE',
            value: [
              'NONE_OF_ABOVE_CHOICE_CODE',
            ],
          },
          section_id: 2,
        },
        142: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/142',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  richText: '<span>Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)</span>',
                  text: 'Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)',
                  unknownAnswer: false,
                  value: 'dt_HumanImmunodeficiencyVirus',
                },
                {
                  richText: '<span>Allergies or immune system disease / disorder</span>',
                  text: 'Allergies or immune system disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue21',
                },
                {
                  richText: '<span>Bladder, kidney (renal) or urinary disease / disorder</span>',
                  text: 'Bladder, kidney (renal) or urinary disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue22',
                },
                {
                  richText: '<span>Blood disease / disorder</span>',
                  text: 'Blood disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue20',
                },
                {
                  richText: '<span>Bone, joint, muscle or connective tissue disease / disorder</span>',
                  text: 'Bone, joint, muscle or connective tissue disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue19',
                },
                {
                  richText: '<span>Brain, cerebral or intracranial (cerebrovascular) disease / disorder</span>',
                  text: 'Brain, cerebral or intracranial (cerebrovascular) disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  richText: '<span>Breathing, lung or respiratory disease / disorder (including sleep apnea)</span>',
                  text: 'Breathing, lung or respiratory disease / disorder (including sleep apnea)',
                  unknownAnswer: false,
                  value: 'choiceValue8',
                },
                {
                  richText: '<span>Cancer, cyst, tumor, unusual growth or lump of any type</span>',
                  text: 'Cancer, cyst, tumor, unusual growth or lump of any type',
                  unknownAnswer: false,
                  value: 'choiceValue2',
                },
                {
                  richText: '<span>Diabetes</span>',
                  text: 'Diabetes',
                  unknownAnswer: false,
                  value: 'choiceValue23',
                },
                {
                  richText: '<span>Ear, nose, throat or mouth disease / disorder</span>',
                  text: 'Ear, nose, throat or mouth disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue6',
                },
                {
                  richText: '<span>Eye disease / disorder</span>',
                  text: 'Eye disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue7',
                },
                {
                  richText: '<span>Heart disease / disorder</span>',
                  text: 'Heart disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue18',
                },
                {
                  richText: '<span>Hepatitis</span>',
                  text: 'Hepatitis',
                  unknownAnswer: false,
                  value: 'choiceValue25',
                },
                {
                  richText: '<span>Hormone, gland or metabolic disease / disorder</span>',
                  text: 'Hormone, gland or metabolic disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue9',
                },
                {
                  richText: '<span>Hypertension or elevated blood pressure </span>',
                  text: 'Hypertension or elevated blood pressure ',
                  unknownAnswer: false,
                  value: 'dt_Hypertension',
                },
                {
                  richText: '<span>Hypercholesterolemia / hyperlipidemia (high cholesterol)</span>',
                  text: 'Hypercholesterolemia / hyperlipidemia (high cholesterol)',
                  unknownAnswer: false,
                  value: 'dt_Hypercholesterolemia',
                },
                {
                  richText: '<span>Hypertriglyceridemia (high triglycerides)</span>',
                  text: 'Hypertriglyceridemia (high triglycerides)',
                  unknownAnswer: false,
                  value: 'dt_Hypertriglyceridemia',
                },
                {
                  richText: '<span>Infectious disease or virus (do not disclose common colds or flu)</span>',
                  text: 'Infectious disease or virus (do not disclose common colds or flu)',
                  unknownAnswer: false,
                  value: 'choiceValue10',
                },
                {
                  richText: '<span>Intestine, esophagus or stomach disease / disorder</span>',
                  text: 'Intestine, esophagus or stomach disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue12',
                },
                {
                  richText: '<span>Liver, bile duct or gallbladder disease / disorder</span>',
                  text: 'Liver, bile duct or gallbladder disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue13',
                },
                {
                  richText: '<span>Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)</span>',
                  text: 'Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)',
                  unknownAnswer: false,
                  value: 'choiceValue14',
                },
                {
                  richText: '<span>Poisoning, Burn, Concussion, Heatstroke, or Frostbite</span>',
                  text: 'Poisoning, Burn, Concussion, Heatstroke, or Frostbite',
                  unknownAnswer: false,
                  value: 'choiceValue11',
                },
                {
                  richText: '<span>Prostate disease / disorder</span>',
                  text: 'Prostate disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
                {
                  richText: '<span>Reproductive disease, disorder or condition</span>',
                  text: 'Reproductive disease, disorder or condition',
                  unknownAnswer: false,
                  value: 'choiceValue15',
                },
                {
                  richText: '<span>Sexually transmitted infection (excluding HIV / AIDS)</span>',
                  text: 'Sexually transmitted infection (excluding HIV / AIDS)',
                  unknownAnswer: false,
                  value: 'choiceValue16',
                },
                {
                  richText: '<span>Skin disease or disorder (excluding skin cancer)</span>',
                  text: 'Skin disease or disorder (excluding skin cancer)',
                  unknownAnswer: false,
                  value: 'choiceValue17',
                },
                {
                  richText: '<span>Spinal or neurological disease / disorder / symptom</span>',
                  text: 'Spinal or neurological disease / disorder / symptom',
                  unknownAnswer: false,
                  value: 'choiceValue5',
                },
                {
                  richText: '<span>Vein, artery or circulatory disease / disorder</span>',
                  text: 'Vein, artery or circulatory disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue4',
                },
                {
                  richText: '<span>Other medical condition (not listed)</span>',
                  text: 'Other medical condition (not listed)',
                  unknownAnswer: false,
                  value: 'choiceValue3',
                },
                {
                  richText: '<span>None of these</span>',
                  text: 'None of these',
                  unknownAnswer: false,
                  value: 'NONE_OF_ABOVE_CHOICE_CODE',
                },
              ],
              componentType: 'CheckBoxResp',
            },
            context: [],
            helpText: 'Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.',
            id: 142,
            isAnswered: false,
            richHelpText: '<span>Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.</span>',
            richText: '<span>Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply) </span>',
            text: 'Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)',
            type: 'MULTIPLE_CHOICE',
          },
          answer: {
            id: 142,
            questionType: 'MULTIPLE_CHOICE',
            value: [
              'NONE_OF_ABOVE_CHOICE_CODE',
            ],
          },
          section_id: 3,
        },
        229: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/229',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 229,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)</span>',
            text: 'Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 229,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 3,
        },
        231: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/questions/231',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fd285371-c755-4a52-b25a-e5c65644d591/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Including hospitalization(s) or emergency care.',
            id: 231,
            isAnswered: false,
            richHelpText: '<span>Including hospitalization(s) or emergency care.</span>',
            richText: '<span>Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?</span>',
            text: 'Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 231,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 3,
        },
      },
      order: [
        10,
        11,
        63,
        64,
        99,
        100,
        101,
        119,
        121,
        126,
        127,
        130,
        131,
        133,
        134,
        135,
        137,
        140,
        142,
        229,
        231,
        1,
      ],
      sections: [
        {
          id: 0,
          question_ids: [
            1,
            10,
            63,
            64,
            99,
            100,
            101,
          ],
          title: 'Personal',
        },
        {
          id: 1,
          question_ids: [
            119,
            121,
            126,
            127,
            130,
            131,
            133,
            134,
            135,
            137,
          ],
          title: 'Lifestyle',
        },
        {
          id: 2,
          question_ids: [
            140,
          ],
          title: 'Family History ',
        },
        {
          id: 3,
          question_ids: [
            142,
            229,
            231,
          ],
          title: 'Medical History',
        },
      ],
      submitted: true,
    },
    payment: {
      cardFirstName: '',
      cardLastName: '',
      cardNumber: '',
      cardExpiryMonth: '',
      cardExpiryYear: '',
      cardCVV: '',
      planType: 'monthly',
      errorMessage: '',
      pmHelcimAttempt: 0,
      useDefaultAddress: false,
      address: {
        address_line1: '',
        address_line2: '',
        city: '',
        province: '',
        country: '',
        postal_code: '',
      },
      stripeCustomerID: '',
      setupIntentClientSecret: '',
      stripeSubscriptionID: {},
      stripePaymentMethodID: '',
    },
    quotes: {
      hd: {
        userQuotes: {
          individual: [
            {
              mn_prems: 203.07,
              plan_type: 'enhanced',
              is_discounted: false,
              selected: true,
            },
            {
              mn_prems: 97.4,
              plan_type: 'essential',
              is_discounted: false,
              selected: false,
            },
            {
              mn_prems: 125.08,
              plan_type: 'standard',
              is_discounted: false,
              selected: false,
            },
          ],
        },
        recmdQuotes: {},
        maxCovQuotes: {},
        noMedicalQuotes: {},
        discountCodes: [],
      },
    },
    hdSession: {
      selected_quote: '',
      selected_term: '',
      term: '',
      override_amt: '',
      selected_quote_type: 1,
      joint_role: 0,
      max_eligible_coverage: '',
      plan_type: 'enhanced',
      determine_plan: null,
      prescription_drug_flag: null,
      losing_benefits: null,
    },
    hdDecision: {
      active_decision: '',
      initial_decision: '',
      policy_status: '',
      aps_field_required_flag: '',
      mvr_required_flag: '',
      nurse_visit_required_flag: '',
      aura_uw_decision_error_flag: '',
      risks: [],
      tobacco_rating_flag: false,
      smoking_discrepancy_flag: false,
      uw_total_debits: 0,
      uw_flat_extra_debits: 0,
      active_maximum_eligible_coverage: '',
      exclusions: [],
    },
    hdApp: {
      birthplace: '',
      birthplace_provstate: '',
      product_added: true,
      buying_method: 'Stand-alone',
      underwriting_method: 'fully_underwritten',
    },
    hdPolicy: {
      applicationDate: '',
      payment_initial_completed: false,
      payment_recurring_completed: false,
      policy_document_signature_completed: false,
      exclusions_flag: false,
      premium_class: '',
      annual_premiums_issued: '',
      annual_premiums_applied: '',
      monthly_premiums_issued: '',
      monthly_premiums_applied: '',
      original_monthly_premiums_issued: '',
      original_annual_premiums_issued: '',
      discounts: [],
      coverageAmount: '',
      term: '',
      quote_breakdown: {},
      add_ons_completed: false,
      hbm_status: null,
      effective_date: '',
    },
  },
  secondary: {
    household: {
      email: '',
      firstName: 'Jude Partner',
      lastName: 'Martin Partner',
      hasPartner: true,
      partnerAge: '',
      partnerGender: '',
      userIncome: '',
      userIncomeOverride: 80000,
      userGender: 'Female',
      hasSavings: '',
      partnerIncome: '',
      partnerIncomeOverride: 80000,
      hasDebts: '',
      residenceType: '',
      birthdate: '03/04/1994',
      smoke: false,
      health: '',
      hasKids: '',
      kids: [],
      nonRetirementSavings: '',
      retirementSavings: '',
      assetsTotOverride: '',
      creditCards: '',
      linesOfCredit: '',
      homeEquityLoans: '',
      mortgage: '',
      otherDebt: '',
      studentLoans: '',
      debtsTotOverride: '',
      hasExistingCoverage: '',
      address_line1: '618 Patricia Street',
      address_line2: '',
      city: 'Jasper',
      country: 'CA',
      postal_code: 'T0E 1E0',
      province: 'AB',
      healthcard_province: 'AB',
      existingCoverage: {
        spouse: {
          group: '',
          individual: '',
        },
        user: {
          group: '',
          individual: '',
        },
      },
      user_family_composition: 'Self + Partner + Kids',
      application_language: 'en-CA',
    },
    session: {
      household_id: '4bc0438a-743c-49d1-b7af-b22d5df64955',
      household_id_vers: 0,
      hd_session_id: '37904acc-39b2-4452-83e7-16b211c2f77c',
      hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
      hd_policy_id: '',
      hd_family_id: 'd23aa4f9-4141-4fc3-b274-1024d04c7c1a',
      aura_session_id: '275c5d72-708b-4a74-95e3-539f97d37840',
      promo_code: '',
      auth_num_attempts_remaining: '',
      auth_num_otp_attempts_remaining: '',
      auth_otp_authorized: '',
      auth_medium: '',
      auth_validate_email_phone: '',
      auth_verify_access_code: '',
      helcim_customer_code: '',
      twilio_token: '',
      user_id: 17950,
    },
    disclosure: {
      disclosures: {
        1: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/1',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.',
            id: 1,
            isAnswered: false,
            richHelpText: '<span>Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.</span>',
            richText: '<span>Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)</span>',
            text: 'Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 1,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 0,
        },
        10: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/10',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 10,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently working?</span>',
            text: 'Are you currently working?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 10,
            questionType: 'SINGLE_CHOICE',
            value: 'true',
          },
          section_id: 0,
        },
        11: {
          question: {
            _links: {
              parentQuestion: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/10',
              },
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/11',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Adult entertainment</span>',
                  text: 'Adult entertainment',
                  unknownAnswer: false,
                  value: 'choiceValue2',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Construction and transport</span>',
                  text: 'Construction and transport',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Professional Entertainer (for example: actor, dancer, musician)</span>',
                  text: 'Professional Entertainer (for example: actor, dancer, musician)',
                  unknownAnswer: false,
                  value: 'dt_Entertainer',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Forestry / logging</span>',
                  text: 'Forestry / logging',
                  unknownAnswer: false,
                  value: 'choiceValue5',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Heights / stunts</span>',
                  text: 'Heights / stunts',
                  unknownAnswer: false,
                  value: 'choiceValue3',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Military service</span>',
                  text: 'Military service',
                  unknownAnswer: false,
                  value: 'choiceValue6',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Offshore duties</span>',
                  text: 'Offshore duties',
                  unknownAnswer: false,
                  value: 'choiceValue7',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Overseas assignments</span>',
                  text: 'Overseas assignments',
                  unknownAnswer: false,
                  value: 'choiceValue4',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Pilot (for example police force pilot, media pilot) or flight instructor</span>',
                  text: 'Pilot (for example police force pilot, media pilot) or flight instructor',
                  unknownAnswer: false,
                  value: 'dt_Pilot',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Professional sports</span>',
                  text: 'Professional sports',
                  unknownAnswer: false,
                  value: 'choiceValue8',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Protective services</span>',
                  text: 'Protective services',
                  unknownAnswer: false,
                  value: 'choiceValue9',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Underwater duties</span>',
                  text: 'Underwater duties',
                  unknownAnswer: false,
                  value: 'choiceValue10',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Working with animals</span>',
                  text: 'Working with animals',
                  unknownAnswer: false,
                  value: 'choiceValue11',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>None of the above</span>',
                  text: 'None of the above',
                  unknownAnswer: false,
                  value: 'choiceValue12',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 11,
            isAnswered: false,
            parentChoiceVal: 'true',
            parentQuestionId: 10,
            richHelpText: '',
            richText: '<span>Does your work involve any of the following?</span>',
            text: 'Does your work involve any of the following?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 11,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue12',
          },
          section_id: 0,
        },
        63: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/63',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 63,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently going through bankruptcy?</span>',
            text: 'Are you currently going through bankruptcy?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 63,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 0,
        },
        64: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/64',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Citizen or have applied for citizenship</span>',
                  text: 'Citizen or have applied for citizenship',
                  unknownAnswer: false,
                  value: 'drv_Citizen',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Permanent resident or applied for permanent residency</span>',
                  text: 'Permanent resident or applied for permanent residency',
                  unknownAnswer: false,
                  value: 'drv_PermanentResident',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Permanent resident or applied for permanent residency</span>',
                  text: 'Permanent resident or applied for permanent residency',
                  unknownAnswer: false,
                  value: 'drv_LandedImmigrant',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Refugee claimant</span>',
                  text: 'Refugee claimant',
                  unknownAnswer: false,
                  value: 'drv_RefugeeClaimant',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>On a work permit</span>',
                  text: 'On a work permit',
                  unknownAnswer: false,
                  value: 'drv_ForeignNational',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>International student on a student visa</span>',
                  text: 'International student on a student visa',
                  unknownAnswer: false,
                  value: 'drv_Visitor',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Other status</span>',
                  text: 'Other status',
                  unknownAnswer: false,
                  value: 'drv_Other',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'If you are on a permit or are a refugee and have applied for permanent residency, please select the \'Permanent or applied for permanent residency\' option.',
            id: 64,
            isAnswered: false,
            richHelpText: '<span>If you are on a permit or are a refugee and have applied for permanent residency, please select the &#39;Permanent or applied for permanent residency&#39; option.</span>',
            richText: '<span>What is your status in Canada?</span>',
            text: 'What is your status in Canada?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 64,
            questionType: 'SINGLE_CHOICE',
            value: 'drv_PermanentResident',
          },
          section_id: 0,
        },
        99: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/99',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              availableUnits: [
                {
                  decimalPrecision: 0,
                  label: 'feet/inches',
                  symbolParts: [
                    'ft',
                    'in',
                  ],
                  unitSymbol: 'ft_in',
                  validationRanges: [
                    {
                      lower: 3,
                      upper: 12,
                    },
                    {
                      lower: 0,
                      upper: 11,
                    },
                  ],
                },
                {
                  decimalPrecision: null,
                  label: 'centimeters',
                  symbolParts: [
                    'cm',
                  ],
                  unitSymbol: 'cm',
                  validationRanges: [
                    {
                      lower: 91,
                      upper: 394,
                    },
                  ],
                },
              ],
              canBeUnknown: false,
              componentType: 'TextInput',
            },
            context: [],
            externalId: '10000',
            helpText: '',
            id: 99,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>What is your height?</span>',
            text: 'What is your height?',
            type: 'UNITIZED',
          },
          answer: {
            id: 99,
            questionType: 'UNITIZED',
            value: {
              selectedUnit: 'ft_in',
              answerParts: [
                5,
                6,
              ],
            },
          },
          section_id: 0,
        },
        100: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/100',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              availableUnits: [
                {
                  decimalPrecision: 1,
                  label: 'pounds',
                  symbolParts: [
                    'lb',
                  ],
                  unitSymbol: 'lb',
                  validationRanges: [
                    {
                      lower: 1,
                      upper: 600,
                    },
                  ],
                },
                {
                  decimalPrecision: null,
                  label: 'kilograms',
                  symbolParts: [
                    'kg',
                  ],
                  unitSymbol: 'kg',
                  validationRanges: [
                    {
                      lower: 0,
                      upper: 273,
                    },
                  ],
                },
              ],
              canBeUnknown: false,
              componentType: 'TextInput',
            },
            context: [],
            externalId: '10001',
            helpText: '',
            id: 100,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>What is your weight?</span>',
            text: 'What is your weight?',
            type: 'UNITIZED',
          },
          answer: {
            id: 100,
            questionType: 'UNITIZED',
            value: {
              selectedUnit: 'lb',
              answerParts: [
                '165',
              ],
            },
          },
          section_id: 0,
        },
        101: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/0',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/101',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 101,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Has your weight changed by more than <strong>15 pounds (6.5 kilograms)</strong> in the past 12 months?</span>',
            text: 'Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 101,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue0',
          },
          section_id: 0,
        },
        119: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/119',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes travelling, working or living outside of the specified regions. ',
            id: 119,
            isAnswered: false,
            richHelpText: '<span>This includes travelling, working or living outside of the specified regions. </span>',
            richText: '<span>Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?</span>',
            text: 'Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 119,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        121: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/121',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.',
            id: 121,
            isAnswered: false,
            richHelpText: '<span>This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.</span>',
            richText: '<span>In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?</span>',
            text: 'In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 121,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        126: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/126',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'This includes any charges relating to driving under the influence of alcohol or drugs.',
            id: 126,
            isAnswered: false,
            richHelpText: '<span>This includes any charges relating to driving under the influence of alcohol or drugs.</span>',
            richText: '<span>Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?</span>',
            text: 'Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 126,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        127: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/127',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.',
            id: 127,
            isAnswered: false,
            richHelpText: '<span>Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.</span>',
            richText: '<span>Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?</span>',
            text: 'Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 127,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        130: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/130',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 130,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)</span>',
            text: 'Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 130,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        131: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/131',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.',
            id: 131,
            isAnswered: false,
            richHelpText: '<span>Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.</span>',
            richText: '<span>In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?</span>',
            text: 'In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 131,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        133: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/133',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'dt_AlcoholUse',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Base your response on your typical drinking habits for a given day.',
            id: 133,
            isAnswered: false,
            richHelpText: '<span>Base your response on your typical drinking habits for a given day.</span>',
            richText: '<span>On average, do you have 1 or more alcoholic drinks per day?</span>',
            text: 'On average, do you have 1 or more alcoholic drinks per day?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 133,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        134: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/134',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'false',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.',
            id: 134,
            isAnswered: false,
            richHelpText: '<span>Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.</span>',
            richText: '<span>Have you ever been treated or professionally advised to reduce or stop drinking alcohol?</span>',
            text: 'Have you ever been treated or professionally advised to reduce or stop drinking alcohol?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 134,
            questionType: 'SINGLE_CHOICE',
            value: 'choiceValue0',
          },
          section_id: 1,
        },
        135: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/135',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 135,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?</span>',
            text: 'In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 135,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        137: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/1',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/137',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.',
            id: 137,
            isAnswered: false,
            richHelpText: '<span>Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.</span>',
            richText: '<span>Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?</span>',
            text: 'Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 137,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 1,
        },
        140: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/2',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/140',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  richText: '<span>Alzheimer&#39;s Disease</span>',
                  text: 'Alzheimer\'s Disease',
                  unknownAnswer: false,
                  value: 'dt_AlzheimersDisease',
                },
                {
                  richText: '<span>Cardiovascular / Heart disease (chest pain, heart attack and stroke)</span>',
                  text: 'Cardiovascular / Heart disease (chest pain, heart attack and stroke)',
                  unknownAnswer: false,
                  value: 'dt_CardiovascularDisease',
                },
                {
                  richText: '<span>Dementia</span>',
                  text: 'Dementia',
                  unknownAnswer: false,
                  value: 'dt_Dementia',
                },
                {
                  richText: '<span>Cancer</span>',
                  text: 'Cancer',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  richText: '<span>Cardiomyopathy</span>',
                  text: 'Cardiomyopathy',
                  unknownAnswer: false,
                  value: 'dt_Cardiomyopathy',
                },
                {
                  richText: '<span>Diabetes</span>',
                  text: 'Diabetes',
                  unknownAnswer: false,
                  value: 'dt_DiabetesMellitus',
                },
                {
                  richText: '<span>Huntington&#39;s disease</span>',
                  text: 'Huntington\'s disease',
                  unknownAnswer: false,
                  value: 'dt_HuntingtonsDisease',
                },
                {
                  richText: '<span>Motor neuron disease</span>',
                  text: 'Motor neuron disease',
                  unknownAnswer: false,
                  value: 'dt_MotorNeuronDisease',
                },
                {
                  richText: '<span>Multiple sclerosis</span>',
                  text: 'Multiple sclerosis',
                  unknownAnswer: false,
                  value: 'dt_MultipleSclerosis',
                },
                {
                  richText: '<span>Muscular dystrophy</span>',
                  text: 'Muscular dystrophy',
                  unknownAnswer: false,
                  value: 'dt_MuscularDystrophy',
                },
                {
                  richText: '<span>Parkinson&#39;s disease</span>',
                  text: 'Parkinson\'s disease',
                  unknownAnswer: false,
                  value: 'dt_ParkinsonsDisease',
                },
                {
                  richText: '<span>Polycystic kidney disease</span>',
                  text: 'Polycystic kidney disease',
                  unknownAnswer: false,
                  value: 'dt_PolycysticKidneyDisease',
                },
                {
                  richText: '<span>None of the above</span>',
                  text: 'None of the above',
                  unknownAnswer: false,
                  value: 'NONE_OF_ABOVE_CHOICE_CODE',
                },
                {
                  richText: '<span>Unknown</span>',
                  text: 'Unknown',
                  unknownAnswer: false,
                  value: 'choiceValue0',
                },
              ],
              componentType: 'CheckBoxResp',
            },
            context: [],
            helpText: 'Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.',
            id: 140,
            isAnswered: false,
            richHelpText: '<span>Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.</span>',
            richText: '<span>Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)</span>',
            text: 'Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)',
            type: 'MULTIPLE_CHOICE',
          },
          answer: {
            id: 140,
            questionType: 'MULTIPLE_CHOICE',
            value: [
              'NONE_OF_ABOVE_CHOICE_CODE',
            ],
          },
          section_id: 2,
        },
        142: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/142',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  richText: '<span>Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)</span>',
                  text: 'Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)',
                  unknownAnswer: false,
                  value: 'dt_HumanImmunodeficiencyVirus',
                },
                {
                  richText: '<span>Allergies or immune system disease / disorder</span>',
                  text: 'Allergies or immune system disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue21',
                },
                {
                  richText: '<span>Bladder, kidney (renal) or urinary disease / disorder</span>',
                  text: 'Bladder, kidney (renal) or urinary disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue22',
                },
                {
                  richText: '<span>Blood disease / disorder</span>',
                  text: 'Blood disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue20',
                },
                {
                  richText: '<span>Bone, joint, muscle or connective tissue disease / disorder</span>',
                  text: 'Bone, joint, muscle or connective tissue disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue19',
                },
                {
                  richText: '<span>Brain, cerebral or intracranial (cerebrovascular) disease / disorder</span>',
                  text: 'Brain, cerebral or intracranial (cerebrovascular) disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue1',
                },
                {
                  richText: '<span>Breathing, lung or respiratory disease / disorder (including sleep apnea)</span>',
                  text: 'Breathing, lung or respiratory disease / disorder (including sleep apnea)',
                  unknownAnswer: false,
                  value: 'choiceValue8',
                },
                {
                  richText: '<span>Cancer, cyst, tumor, unusual growth or lump of any type</span>',
                  text: 'Cancer, cyst, tumor, unusual growth or lump of any type',
                  unknownAnswer: false,
                  value: 'choiceValue2',
                },
                {
                  richText: '<span>Diabetes</span>',
                  text: 'Diabetes',
                  unknownAnswer: false,
                  value: 'choiceValue23',
                },
                {
                  richText: '<span>Ear, nose, throat or mouth disease / disorder</span>',
                  text: 'Ear, nose, throat or mouth disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue6',
                },
                {
                  richText: '<span>Eye disease / disorder</span>',
                  text: 'Eye disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue7',
                },
                {
                  richText: '<span>Heart disease / disorder</span>',
                  text: 'Heart disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue18',
                },
                {
                  richText: '<span>Hepatitis</span>',
                  text: 'Hepatitis',
                  unknownAnswer: false,
                  value: 'choiceValue25',
                },
                {
                  richText: '<span>Hormone, gland or metabolic disease / disorder</span>',
                  text: 'Hormone, gland or metabolic disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue9',
                },
                {
                  richText: '<span>Hypertension or elevated blood pressure </span>',
                  text: 'Hypertension or elevated blood pressure ',
                  unknownAnswer: false,
                  value: 'dt_Hypertension',
                },
                {
                  richText: '<span>Hypercholesterolemia / hyperlipidemia (high cholesterol)</span>',
                  text: 'Hypercholesterolemia / hyperlipidemia (high cholesterol)',
                  unknownAnswer: false,
                  value: 'dt_Hypercholesterolemia',
                },
                {
                  richText: '<span>Hypertriglyceridemia (high triglycerides)</span>',
                  text: 'Hypertriglyceridemia (high triglycerides)',
                  unknownAnswer: false,
                  value: 'dt_Hypertriglyceridemia',
                },
                {
                  richText: '<span>Infectious disease or virus (do not disclose common colds or flu)</span>',
                  text: 'Infectious disease or virus (do not disclose common colds or flu)',
                  unknownAnswer: false,
                  value: 'choiceValue10',
                },
                {
                  richText: '<span>Intestine, esophagus or stomach disease / disorder</span>',
                  text: 'Intestine, esophagus or stomach disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue12',
                },
                {
                  richText: '<span>Liver, bile duct or gallbladder disease / disorder</span>',
                  text: 'Liver, bile duct or gallbladder disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue13',
                },
                {
                  richText: '<span>Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)</span>',
                  text: 'Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)',
                  unknownAnswer: false,
                  value: 'choiceValue14',
                },
                {
                  richText: '<span>Poisoning, Burn, Concussion, Heatstroke, or Frostbite</span>',
                  text: 'Poisoning, Burn, Concussion, Heatstroke, or Frostbite',
                  unknownAnswer: false,
                  value: 'choiceValue11',
                },
                {
                  richText: '<span>Reproductive disease, disorder or condition</span>',
                  text: 'Reproductive disease, disorder or condition',
                  unknownAnswer: false,
                  value: 'choiceValue15',
                },
                {
                  richText: '<span>Sexually transmitted infection (excluding HIV / AIDS)</span>',
                  text: 'Sexually transmitted infection (excluding HIV / AIDS)',
                  unknownAnswer: false,
                  value: 'choiceValue16',
                },
                {
                  richText: '<span>Skin disease or disorder (excluding skin cancer)</span>',
                  text: 'Skin disease or disorder (excluding skin cancer)',
                  unknownAnswer: false,
                  value: 'choiceValue17',
                },
                {
                  richText: '<span>Spinal or neurological disease / disorder / symptom</span>',
                  text: 'Spinal or neurological disease / disorder / symptom',
                  unknownAnswer: false,
                  value: 'choiceValue5',
                },
                {
                  richText: '<span>Vein, artery or circulatory disease / disorder</span>',
                  text: 'Vein, artery or circulatory disease / disorder',
                  unknownAnswer: false,
                  value: 'choiceValue4',
                },
                {
                  richText: '<span>Other medical condition (not listed)</span>',
                  text: 'Other medical condition (not listed)',
                  unknownAnswer: false,
                  value: 'choiceValue3',
                },
                {
                  richText: '<span>None of these</span>',
                  text: 'None of these',
                  unknownAnswer: false,
                  value: 'NONE_OF_ABOVE_CHOICE_CODE',
                },
              ],
              componentType: 'CheckBoxResp',
            },
            context: [],
            helpText: 'Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.',
            id: 142,
            isAnswered: false,
            richHelpText: '<span>Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.</span>',
            richText: '<span>Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply) </span>',
            text: 'Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)',
            type: 'MULTIPLE_CHOICE',
          },
          answer: {
            id: 142,
            questionType: 'MULTIPLE_CHOICE',
            value: [
              'NONE_OF_ABOVE_CHOICE_CODE',
            ],
          },
          section_id: 3,
        },
        229: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/229',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: '',
            id: 229,
            isAnswered: false,
            richHelpText: '',
            richText: '<span>Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)</span>',
            text: 'Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 229,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 3,
        },
        231: {
          question: {
            _links: {
              section: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/sections/3',
              },
              self: {
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/questions/231',
              },
              sessionStatus: {
                completed: false,
                href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/275c5d72-708b-4a74-95e3-539f97d37840/status',
                submitted: false,
              },
            },
            constraints: {
              canBeUnknown: false,
              choices: [
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>Yes</span>',
                  text: 'Yes',
                  unknownAnswer: false,
                  value: 'true',
                },
                {
                  questionType: 'SINGLE_CHOICE',
                  richText: '<span>No</span>',
                  text: 'No',
                  unknownAnswer: false,
                  value: 'false',
                },
              ],
              componentType: 'RadioResp',
            },
            context: [],
            helpText: 'Including hospitalization(s) or emergency care.',
            id: 231,
            isAnswered: false,
            richHelpText: '<span>Including hospitalization(s) or emergency care.</span>',
            richText: '<span>Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?</span>',
            text: 'Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?',
            type: 'SINGLE_CHOICE',
          },
          answer: {
            id: 231,
            questionType: 'SINGLE_CHOICE',
            value: 'false',
          },
          section_id: 3,
        },
      },
      order: [
        1,
        10,
        11,
        63,
        64,
        99,
        100,
        101,
        119,
        121,
        126,
        127,
        130,
        131,
        133,
        134,
        135,
        137,
        140,
        142,
        229,
        231,
      ],
      sections: [
        {
          id: 0,
          question_ids: [
            1,
            10,
            63,
            64,
            99,
            100,
            101,
          ],
          title: 'Personal',
        },
        {
          id: 1,
          question_ids: [
            119,
            121,
            126,
            127,
            130,
            131,
            133,
            134,
            135,
            137,
          ],
          title: 'Lifestyle',
        },
        {
          id: 2,
          question_ids: [
            140,
          ],
          title: 'Family History ',
        },
        {
          id: 3,
          question_ids: [
            142,
            229,
            231,
          ],
          title: 'Medical History',
        },
      ],
      submitted: true,
    },
    payment: {
      cardFirstName: '',
      cardLastName: '',
      cardNumber: '',
      cardExpiryMonth: '',
      cardExpiryYear: '',
      cardCVV: '',
      planType: 'monthly',
      errorMessage: '',
      pmHelcimAttempt: 0,
      useDefaultAddress: false,
      address: {
        address_line1: '',
        address_line2: '',
        city: '',
        province: '',
        country: '',
        postal_code: '',
      },
      stripeCustomerID: '',
      setupIntentClientSecret: '',
      stripeSubscriptionID: {},
      stripePaymentMethodID: '',
    },
    quotes: {
      hd: {
        userQuotes: {
          individual: [
            {
              mn_prems: 203.07,
              plan_type: 'enhanced',
              is_discounted: false,
              selected: true,
            },
            {
              mn_prems: 97.4,
              plan_type: 'essential',
              is_discounted: false,
              selected: false,
            },
            {
              mn_prems: 125.08,
              plan_type: 'standard',
              is_discounted: false,
              selected: false,
            },
          ],
        },
        recmdQuotes: {},
        maxCovQuotes: {},
        noMedicalQuotes: {},
        discountCodes: [],
      },
    },
    hdSession: {
      selected_quote: '',
      selected_term: '',
      term: '',
      override_amt: '',
      selected_quote_type: 2,
      joint_role: 0,
      max_eligible_coverage: '',
      plan_type: 'enhanced',
      determine_plan: null,
      prescription_drug_flag: null,
      losing_benefits: null,
    },
    hdDecision: {
      active_decision: '',
      initial_decision: '',
      policy_status: '',
      aps_field_required_flag: '',
      mvr_required_flag: '',
      nurse_visit_required_flag: '',
      aura_uw_decision_error_flag: '',
      risks: [],
      tobacco_rating_flag: false,
      smoking_discrepancy_flag: false,
      uw_total_debits: 0,
      uw_flat_extra_debits: 0,
      active_maximum_eligible_coverage: '',
      exclusions: [],
    },
    hdApp: {
      birthplace: '',
      birthplace_provstate: '',
      product_added: true,
      buying_method: 'Stand-alone',
      underwriting_method: 'fully_underwritten',
    },
    hdPolicy: {
      applicationDate: '',
      payment_initial_completed: false,
      payment_recurring_completed: false,
      policy_document_signature_completed: false,
      exclusions_flag: false,
      premium_class: '',
      annual_premiums_issued: '',
      annual_premiums_applied: '',
      monthly_premiums_issued: '',
      monthly_premiums_applied: '',
      original_monthly_premiums_issued: '',
      original_annual_premiums_issued: '',
      discounts: [],
      coverageAmount: '',
      term: '',
      quote_breakdown: {},
      add_ons_completed: false,
      hbm_status: null,
      effective_date: '',
    },
  },
  dependents: {
    dependent_keys: [
      'lsE4-1c1K',
      'Y0zmi2ysCB',
    ],
    dependents: {
      'lsE4-1c1K': {
        session: {
          household_id: 'e6968df9-4f6f-451d-a982-2aae3572aebd',
          household_id_vers: 0,
          hd_session_id: '37904acc-39b2-4452-83e7-16b211c2f77c',
          hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
          hd_policy_id: '',
          hd_family_id: 'd23aa4f9-4141-4fc3-b274-1024d04c7c1a',
          aura_session_id: '28cb3a25-12b9-4c3a-b192-961b0a25c355',
          promo_code: '',
          auth_num_attempts_remaining: '',
          auth_num_otp_attempts_remaining: '',
          auth_otp_authorized: '',
          auth_medium: '',
          auth_validate_email_phone: '',
          auth_verify_access_code: '',
          helcim_customer_code: '',
          twilio_token: '',
          user_id: '',
        },
        household: {
          email: '',
          firstName: 'Jude Dep1',
          lastName: 'Martin Dep1',
          hasPartner: '',
          partnerAge: '',
          partnerGender: '',
          userIncome: '',
          userIncomeOverride: '',
          userGender: 'Female',
          hasSavings: '',
          partnerIncome: '',
          partnerIncomeOverride: '',
          hasDebts: '',
          residenceType: '',
          birthdate: '03/03/2004',
          smoke: '',
          health: '',
          phone: '',
          hasKids: '',
          kids: [],
          nonRetirementSavings: '',
          retirementSavings: '',
          assetsTotOverride: '',
          creditCards: '',
          linesOfCredit: '',
          homeEquityLoans: '',
          mortgage: '',
          otherDebt: '',
          studentLoans: '',
          debtsTotOverride: '',
          hasExistingCoverage: '',
          address_line1: '',
          address_line2: '',
          city: '',
          country: '',
          postal_code: '',
          province: '',
          healthcard_province: 'AB',
          existingCoverage: {
            spouse: {
              group: '',
              individual: '',
            },
            user: {
              group: '',
              individual: '',
            },
          },
          user_family_composition: '',
          application_language: 'en-CA',
        },
        quotes: {
          hd: {
            userQuotes: {
              individual: [
                {
                  mn_prems: 133.39,
                  plan_type: 'enhanced',
                  is_discounted: false,
                  selected: true,
                },
                {
                  mn_prems: 63.73,
                  plan_type: 'essential',
                  is_discounted: false,
                  selected: false,
                },
                {
                  mn_prems: 80.03,
                  plan_type: 'standard',
                  is_discounted: false,
                  selected: false,
                },
              ],
            },
          },
        },
        decision: {
          active_decision: '',
          initial_decision: '',
          policy_status: '',
          aps_field_required_flag: '',
          mvr_required_flag: '',
          nurse_visit_required_flag: '',
          aura_uw_decision_error_flag: '',
          risks: [],
          tobacco_rating_flag: false,
          smoking_discrepancy_flag: false,
          uw_total_debits: 0,
          uw_flat_extra_debits: 0,
          active_maximum_eligible_coverage: '',
          exclusions: [],
        },
        disclosure: {
          disclosures: {
            1: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/1',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.',
                id: 1,
                isAnswered: false,
                richHelpText: '<span>Include any change requests or reinstatements that were cancelled, postponed, declined, withdrawn, or modified. For example, a modification could be a policy issued with a reduced benefit amount; a rating could be a substandard policy.</span>',
                richText: '<span>Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)</span>',
                text: 'Other than for reasons already declared in this application, have you ever had an application for life, critical illness, or health insurance declined, postponed, offered with exclusions or at a higher premium; had a reinstatement application denied; or had an insurer cancel your policy after issue? (You do not need to disclose higher premiums resulting from the renewal of a policy or a policy cancellation due to non-payment of premiums)',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 1,
                questionType: 'SINGLE_CHOICE',
                value: 'true',
              },
              section_id: 0,
            },
            2: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/1',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/2',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      richText: '<span>It was <strong>postponed</strong>, <strong>declined</strong> or <strong>modified </strong>(coverage type or amount of coverage was adjusted)</span>',
                      text: 'It was postponed, declined or modified (coverage type or amount of coverage was adjusted)',
                      unknownAnswer: false,
                      value: 'drv_Assigned',
                    },
                    {
                      richText: '<span>It was <strong>rated</strong> (price increased) by the insurance company</span>',
                      text: 'It was rated (price increased) by the insurance company',
                      unknownAnswer: false,
                      value: 'drv_Sold',
                    },
                    {
                      richText: '<span>It was <strong>cancelled</strong> by me or I changed my job and <strong>no longer have group coverage</strong></span>',
                      text: 'It was cancelled by me or I changed my job and no longer have group coverage',
                      unknownAnswer: false,
                      value: 'drv_Transferred',
                    },
                    {
                      richText: '<span>I <strong>withdrew </strong>my application for insurance</span>',
                      text: 'I withdrew my application for insurance',
                      unknownAnswer: false,
                      value: 'drv_Unknown',
                    },
                  ],
                  componentType: 'CheckBoxResp',
                },
                context: [],
                helpText: '',
                id: 2,
                isAnswered: false,
                parentChoiceVal: 'true',
                parentQuestionId: 1,
                richHelpText: '',
                richText: '<span>Which of the following best describes your previous life, health or critical illness insurance application or policy?</span>',
                text: 'Which of the following best describes your previous life, health or critical illness insurance application or policy?',
                type: 'MULTIPLE_CHOICE',
              },
              answer: {
                id: 2,
                questionType: 'MULTIPLE_CHOICE',
                value: [
                  'drv_Unknown',
                ],
              },
              section_id: 0,
            },
            7: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/2',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/7',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 7,
                isAnswered: false,
                parentChoiceVal: 'drv_Unknown',
                parentQuestionId: 2,
                richHelpText: '',
                richText: '<span>Did you withdraw the application either because you received insurance from another company, were not interested anymore or premiums did not fit your budget? </span>',
                text: 'Did you withdraw the application either because you received insurance from another company, were not interested anymore or premiums did not fit your budget? ',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 7,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 0,
            },
            8: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/7',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/8',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                },
                context: [],
                helpText: '',
                id: 8,
                isAnswered: false,
                parentChoiceVal: 'false',
                parentQuestionId: 7,
                richHelpText: '',
                richText: '<span>Please provide the reason why you withdrew your application:</span>',
                text: 'Please provide the reason why you withdrew your application:',
                type: 'TEXT',
              },
              answer: {
                id: 8,
                questionType: 'TEXT',
                value: 'test',
              },
              section_id: 0,
            },
            9: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/7',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/9',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  availableDateFormats: [
                    'MONTH_YEAR',
                    'RELATIVE_AGE',
                    'MONTHS_SINCE_OCCURRENCE',
                    'EXACT_DATE',
                  ],
                  canBeUnknown: false,
                  maxDate: '2024-01-24T00:00:00Z',
                  minDate: '2004-03-03T00:00:00Z',
                  selectedDatePeriod: 'PAST_DATES',
                },
                context: [],
                helpText: '',
                id: 9,
                isAnswered: false,
                parentChoiceVal: 'false',
                parentQuestionId: 7,
                richHelpText: '',
                richText: '<span>When did you withdraw your application?</span>',
                text: 'When did you withdraw your application?',
                type: 'DATE',
              },
              answer: {
                id: 9,
                questionType: 'DATE',
                value: {
                  dateFormat: 'MONTH_YEAR',
                  value: '10/2022',
                },
              },
              section_id: 0,
            },
            10: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/10',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 10,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Are you currently working?</span>',
                text: 'Are you currently working?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 10,
                questionType: 'SINGLE_CHOICE',
                value: 'true',
              },
              section_id: 0,
            },
            11: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/10',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/11',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Adult entertainment</span>',
                      text: 'Adult entertainment',
                      unknownAnswer: false,
                      value: 'choiceValue2',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Construction and transport</span>',
                      text: 'Construction and transport',
                      unknownAnswer: false,
                      value: 'choiceValue1',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Professional Entertainer (for example: actor, dancer, musician)</span>',
                      text: 'Professional Entertainer (for example: actor, dancer, musician)',
                      unknownAnswer: false,
                      value: 'dt_Entertainer',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Forestry / logging</span>',
                      text: 'Forestry / logging',
                      unknownAnswer: false,
                      value: 'choiceValue5',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Heights / stunts</span>',
                      text: 'Heights / stunts',
                      unknownAnswer: false,
                      value: 'choiceValue3',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Military service</span>',
                      text: 'Military service',
                      unknownAnswer: false,
                      value: 'choiceValue6',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Offshore duties</span>',
                      text: 'Offshore duties',
                      unknownAnswer: false,
                      value: 'choiceValue7',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Overseas assignments</span>',
                      text: 'Overseas assignments',
                      unknownAnswer: false,
                      value: 'choiceValue4',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Pilot (for example police force pilot, media pilot) or flight instructor</span>',
                      text: 'Pilot (for example police force pilot, media pilot) or flight instructor',
                      unknownAnswer: false,
                      value: 'dt_Pilot',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Professional sports</span>',
                      text: 'Professional sports',
                      unknownAnswer: false,
                      value: 'choiceValue8',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Protective services</span>',
                      text: 'Protective services',
                      unknownAnswer: false,
                      value: 'choiceValue9',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Underwater duties</span>',
                      text: 'Underwater duties',
                      unknownAnswer: false,
                      value: 'choiceValue10',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Working with animals</span>',
                      text: 'Working with animals',
                      unknownAnswer: false,
                      value: 'choiceValue11',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>None of the above</span>',
                      text: 'None of the above',
                      unknownAnswer: false,
                      value: 'choiceValue12',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 11,
                isAnswered: false,
                parentChoiceVal: 'true',
                parentQuestionId: 10,
                richHelpText: '',
                richText: '<span>Does your work involve any of the following?</span>',
                text: 'Does your work involve any of the following?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 11,
                questionType: 'SINGLE_CHOICE',
                value: 'choiceValue12',
              },
              section_id: 0,
            },
            63: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/63',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 63,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Are you currently going through bankruptcy?</span>',
                text: 'Are you currently going through bankruptcy?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 63,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 0,
            },
            64: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/64',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Citizen or have applied for citizenship</span>',
                      text: 'Citizen or have applied for citizenship',
                      unknownAnswer: false,
                      value: 'drv_Citizen',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Permanent resident or applied for permanent residency</span>',
                      text: 'Permanent resident or applied for permanent residency',
                      unknownAnswer: false,
                      value: 'drv_PermanentResident',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Permanent resident or applied for permanent residency</span>',
                      text: 'Permanent resident or applied for permanent residency',
                      unknownAnswer: false,
                      value: 'drv_LandedImmigrant',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Refugee claimant</span>',
                      text: 'Refugee claimant',
                      unknownAnswer: false,
                      value: 'drv_RefugeeClaimant',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>On a work permit</span>',
                      text: 'On a work permit',
                      unknownAnswer: false,
                      value: 'drv_ForeignNational',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>International student on a student visa</span>',
                      text: 'International student on a student visa',
                      unknownAnswer: false,
                      value: 'drv_Visitor',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Other status</span>',
                      text: 'Other status',
                      unknownAnswer: false,
                      value: 'drv_Other',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'If you are on a permit or are a refugee and have applied for permanent residency, please select the \'Permanent or applied for permanent residency\' option.',
                id: 64,
                isAnswered: false,
                richHelpText: '<span>If you are on a permit or are a refugee and have applied for permanent residency, please select the &#39;Permanent or applied for permanent residency&#39; option.</span>',
                richText: '<span>What is your status in Canada?</span>',
                text: 'What is your status in Canada?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 64,
                questionType: 'SINGLE_CHOICE',
                value: 'drv_PermanentResident',
              },
              section_id: 0,
            },
            99: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/99',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  availableUnits: [
                    {
                      decimalPrecision: 0,
                      label: 'feet/inches',
                      symbolParts: [
                        'ft',
                        'in',
                      ],
                      unitSymbol: 'ft_in',
                      validationRanges: [
                        {
                          lower: 3,
                          upper: 12,
                        },
                        {
                          lower: 0,
                          upper: 11,
                        },
                      ],
                    },
                    {
                      decimalPrecision: null,
                      label: 'centimeters',
                      symbolParts: [
                        'cm',
                      ],
                      unitSymbol: 'cm',
                      validationRanges: [
                        {
                          lower: 91,
                          upper: 394,
                        },
                      ],
                    },
                  ],
                  canBeUnknown: false,
                  componentType: 'TextInput',
                },
                context: [],
                externalId: '10000',
                helpText: '',
                id: 99,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>What is your height?</span>',
                text: 'What is your height?',
                type: 'UNITIZED',
              },
              answer: {
                id: 99,
                questionType: 'UNITIZED',
                value: {
                  selectedUnit: 'ft_in',
                  answerParts: [
                    5,
                    2,
                  ],
                },
              },
              section_id: 0,
            },
            100: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/100',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  availableUnits: [
                    {
                      decimalPrecision: 1,
                      label: 'pounds',
                      symbolParts: [
                        'lb',
                      ],
                      unitSymbol: 'lb',
                      validationRanges: [
                        {
                          lower: 1,
                          upper: 600,
                        },
                      ],
                    },
                    {
                      decimalPrecision: null,
                      label: 'kilograms',
                      symbolParts: [
                        'kg',
                      ],
                      unitSymbol: 'kg',
                      validationRanges: [
                        {
                          lower: 0,
                          upper: 273,
                        },
                      ],
                    },
                  ],
                  canBeUnknown: false,
                  componentType: 'TextInput',
                },
                context: [],
                externalId: '10001',
                helpText: '',
                id: 100,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>What is your weight?</span>',
                text: 'What is your weight?',
                type: 'UNITIZED',
              },
              answer: {
                id: 100,
                questionType: 'UNITIZED',
                value: {
                  selectedUnit: 'lb',
                  answerParts: [
                    '160',
                  ],
                },
              },
              section_id: 0,
            },
            101: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/0',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/101',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'choiceValue0',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 101,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Has your weight changed by more than <strong>15 pounds (6.5 kilograms)</strong> in the past 12 months?</span>',
                text: 'Within the past 12 months, has your weight changed by more than 15 pounds (6.5 kilograms)?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 101,
                questionType: 'SINGLE_CHOICE',
                value: 'choiceValue0',
              },
              section_id: 0,
            },
            119: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/119',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'This includes travelling, working or living outside of the specified regions. ',
                id: 119,
                isAnswered: false,
                richHelpText: '<span>This includes travelling, working or living outside of the specified regions. </span>',
                richText: '<span>Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?</span>',
                text: 'Within the next 12 months, do you have booked and confirmed travel plans outside of Canada, the U.S., the Caribbean (excluding Haiti), the UK, or the European Union?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 119,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            121: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/121',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.',
                id: 121,
                isAnswered: false,
                richHelpText: '<span>This includes hazardous hobbies or hazardous side jobs, including rock climbing, SCUBA diving, sky diving etc.</span>',
                richText: '<span>In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?</span>',
                text: 'In the last 3 years, have you engaged in or do you intend to engage in any hazardous activities, extreme sports, or aviation (other than as a fare-paying passenger)?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 121,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            126: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/126',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'This includes any charges relating to driving under the influence of alcohol or drugs.',
                id: 126,
                isAnswered: false,
                richHelpText: '<span>This includes any charges relating to driving under the influence of alcohol or drugs.</span>',
                richText: '<span>Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?</span>',
                text: 'Within the last 10 years, have you been found guilty of impaired driving, or are there any such charges pending?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 126,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            127: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/127',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.',
                id: 127,
                isAnswered: false,
                richHelpText: '<span>Select ‘yes’ if you have had any of the following: an at-fault major accident, a license suspension, a major moving violation (e.g. reckless driving), or any minor moving / seatbelt / speeding violations. Exclude any DUIs from this question.</span>',
                richText: '<span>Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?</span>',
                text: 'Within the last 3 years, have you been found guilty of a driving violation, or are there any such charges pending?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 127,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            130: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/130',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 130,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)</span>',
                text: 'Have you ever been found guilty of a criminal offence or are there any criminal charges pending? (do not disclose impaired driving/DUI\'s within this question)',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 130,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            131: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/131',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.',
                id: 131,
                isAnswered: false,
                richHelpText: '<span>Please indicate any use of e-cigarettes or vaping products (excluding cannabis products) or more than 12 cigars per year.</span>',
                richText: '<span>In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?</span>',
                text: 'In the past 12 months, have you used any form of tobacco or nicotine products / substitutes?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 131,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            133: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/133',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'dt_AlcoholUse',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Base your response on your typical drinking habits for a given day.',
                id: 133,
                isAnswered: false,
                richHelpText: '<span>Base your response on your typical drinking habits for a given day.</span>',
                richText: '<span>On average, do you have 1 or more alcoholic drinks per day?</span>',
                text: 'On average, do you have 1 or more alcoholic drinks per day?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 133,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            134: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/134',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'false',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'choiceValue0',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.',
                id: 134,
                isAnswered: false,
                richHelpText: '<span>Professional advice includes medical advice from a healthcare professional including a doctor, clinical nurse specialist, counselor or other licensed practitioner.</span>',
                richText: '<span>Have you ever been treated or professionally advised to reduce or stop drinking alcohol?</span>',
                text: 'Have you ever been treated or professionally advised to reduce or stop drinking alcohol?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 134,
                questionType: 'SINGLE_CHOICE',
                value: 'choiceValue0',
              },
              section_id: 1,
            },
            135: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/135',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 135,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?</span>',
                text: 'In the past 5 years, have you used cannabis or cannabidiol (CBD oil) in any form?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 135,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            137: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/1',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/137',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.',
                id: 137,
                isAnswered: false,
                richHelpText: '<span>Examples: cocaine, amphetamines or other stimulants, barbiturates or other sedatives, hallucinogens, heroin, morphine, opium, or other narcotics etc.</span>',
                richText: '<span>Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?</span>',
                text: 'Have you ever used any other narcotics or any drugs that were not prescribed by a healthcare provider (excluding cannabis)?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 137,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 1,
            },
            140: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/2',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/140',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      richText: '<span>Alzheimer&#39;s Disease</span>',
                      text: 'Alzheimer\'s Disease',
                      unknownAnswer: false,
                      value: 'dt_AlzheimersDisease',
                    },
                    {
                      richText: '<span>Cardiovascular / Heart disease (chest pain, heart attack and stroke)</span>',
                      text: 'Cardiovascular / Heart disease (chest pain, heart attack and stroke)',
                      unknownAnswer: false,
                      value: 'dt_CardiovascularDisease',
                    },
                    {
                      richText: '<span>Dementia</span>',
                      text: 'Dementia',
                      unknownAnswer: false,
                      value: 'dt_Dementia',
                    },
                    {
                      richText: '<span>Cancer</span>',
                      text: 'Cancer',
                      unknownAnswer: false,
                      value: 'choiceValue1',
                    },
                    {
                      richText: '<span>Cardiomyopathy</span>',
                      text: 'Cardiomyopathy',
                      unknownAnswer: false,
                      value: 'dt_Cardiomyopathy',
                    },
                    {
                      richText: '<span>Diabetes</span>',
                      text: 'Diabetes',
                      unknownAnswer: false,
                      value: 'dt_DiabetesMellitus',
                    },
                    {
                      richText: '<span>Huntington&#39;s disease</span>',
                      text: 'Huntington\'s disease',
                      unknownAnswer: false,
                      value: 'dt_HuntingtonsDisease',
                    },
                    {
                      richText: '<span>Motor neuron disease</span>',
                      text: 'Motor neuron disease',
                      unknownAnswer: false,
                      value: 'dt_MotorNeuronDisease',
                    },
                    {
                      richText: '<span>Multiple sclerosis</span>',
                      text: 'Multiple sclerosis',
                      unknownAnswer: false,
                      value: 'dt_MultipleSclerosis',
                    },
                    {
                      richText: '<span>Muscular dystrophy</span>',
                      text: 'Muscular dystrophy',
                      unknownAnswer: false,
                      value: 'dt_MuscularDystrophy',
                    },
                    {
                      richText: '<span>Parkinson&#39;s disease</span>',
                      text: 'Parkinson\'s disease',
                      unknownAnswer: false,
                      value: 'dt_ParkinsonsDisease',
                    },
                    {
                      richText: '<span>Polycystic kidney disease</span>',
                      text: 'Polycystic kidney disease',
                      unknownAnswer: false,
                      value: 'dt_PolycysticKidneyDisease',
                    },
                    {
                      richText: '<span>None of the above</span>',
                      text: 'None of the above',
                      unknownAnswer: false,
                      value: 'NONE_OF_ABOVE_CHOICE_CODE',
                    },
                    {
                      richText: '<span>Unknown</span>',
                      text: 'Unknown',
                      unknownAnswer: false,
                      value: 'choiceValue0',
                    },
                  ],
                  componentType: 'CheckBoxResp',
                },
                context: [],
                helpText: 'Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.',
                id: 140,
                isAnswered: false,
                richHelpText: '<span>Polycystic kidney disease (PKD) is an inherited disorder in which clusters of cysts develop primarily within the kidneys, causing the kidneys to enlarge and lose function over time.</span>',
                richText: '<span>Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)</span>',
                text: 'Have any of your immediate family members (biological parents or siblings) been diagnosed with any of the following? (Check all that apply)',
                type: 'MULTIPLE_CHOICE',
              },
              answer: {
                id: 140,
                questionType: 'MULTIPLE_CHOICE',
                value: [
                  'NONE_OF_ABOVE_CHOICE_CODE',
                ],
              },
              section_id: 2,
            },
            142: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/142',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      richText: '<span>Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)</span>',
                      text: 'Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)',
                      unknownAnswer: false,
                      value: 'dt_HumanImmunodeficiencyVirus',
                    },
                    {
                      richText: '<span>Allergies or immune system disease / disorder</span>',
                      text: 'Allergies or immune system disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue21',
                    },
                    {
                      richText: '<span>Bladder, kidney (renal) or urinary disease / disorder</span>',
                      text: 'Bladder, kidney (renal) or urinary disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue22',
                    },
                    {
                      richText: '<span>Blood disease / disorder</span>',
                      text: 'Blood disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue20',
                    },
                    {
                      richText: '<span>Bone, joint, muscle or connective tissue disease / disorder</span>',
                      text: 'Bone, joint, muscle or connective tissue disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue19',
                    },
                    {
                      richText: '<span>Brain, cerebral or intracranial (cerebrovascular) disease / disorder</span>',
                      text: 'Brain, cerebral or intracranial (cerebrovascular) disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue1',
                    },
                    {
                      richText: '<span>Breathing, lung or respiratory disease / disorder (including sleep apnea)</span>',
                      text: 'Breathing, lung or respiratory disease / disorder (including sleep apnea)',
                      unknownAnswer: false,
                      value: 'choiceValue8',
                    },
                    {
                      richText: '<span>Cancer, cyst, tumor, unusual growth or lump of any type</span>',
                      text: 'Cancer, cyst, tumor, unusual growth or lump of any type',
                      unknownAnswer: false,
                      value: 'choiceValue2',
                    },
                    {
                      richText: '<span>Diabetes</span>',
                      text: 'Diabetes',
                      unknownAnswer: false,
                      value: 'choiceValue23',
                    },
                    {
                      richText: '<span>Ear, nose, throat or mouth disease / disorder</span>',
                      text: 'Ear, nose, throat or mouth disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue6',
                    },
                    {
                      richText: '<span>Eye disease / disorder</span>',
                      text: 'Eye disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue7',
                    },
                    {
                      richText: '<span>Heart disease / disorder</span>',
                      text: 'Heart disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue18',
                    },
                    {
                      richText: '<span>Hepatitis</span>',
                      text: 'Hepatitis',
                      unknownAnswer: false,
                      value: 'choiceValue25',
                    },
                    {
                      richText: '<span>Hormone, gland or metabolic disease / disorder</span>',
                      text: 'Hormone, gland or metabolic disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue9',
                    },
                    {
                      richText: '<span>Hypertension or elevated blood pressure </span>',
                      text: 'Hypertension or elevated blood pressure ',
                      unknownAnswer: false,
                      value: 'dt_Hypertension',
                    },
                    {
                      richText: '<span>Hypercholesterolemia / hyperlipidemia (high cholesterol)</span>',
                      text: 'Hypercholesterolemia / hyperlipidemia (high cholesterol)',
                      unknownAnswer: false,
                      value: 'dt_Hypercholesterolemia',
                    },
                    {
                      richText: '<span>Hypertriglyceridemia (high triglycerides)</span>',
                      text: 'Hypertriglyceridemia (high triglycerides)',
                      unknownAnswer: false,
                      value: 'dt_Hypertriglyceridemia',
                    },
                    {
                      richText: '<span>Infectious disease or virus (do not disclose common colds or flu)</span>',
                      text: 'Infectious disease or virus (do not disclose common colds or flu)',
                      unknownAnswer: false,
                      value: 'choiceValue10',
                    },
                    {
                      richText: '<span>Intestine, esophagus or stomach disease / disorder</span>',
                      text: 'Intestine, esophagus or stomach disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue12',
                    },
                    {
                      richText: '<span>Liver, bile duct or gallbladder disease / disorder</span>',
                      text: 'Liver, bile duct or gallbladder disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue13',
                    },
                    {
                      richText: '<span>Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)</span>',
                      text: 'Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)',
                      unknownAnswer: false,
                      value: 'choiceValue14',
                    },
                    {
                      richText: '<span>Poisoning, Burn, Concussion, Heatstroke, or Frostbite</span>',
                      text: 'Poisoning, Burn, Concussion, Heatstroke, or Frostbite',
                      unknownAnswer: false,
                      value: 'choiceValue11',
                    },
                    {
                      richText: '<span>Reproductive disease, disorder or condition</span>',
                      text: 'Reproductive disease, disorder or condition',
                      unknownAnswer: false,
                      value: 'choiceValue15',
                    },
                    {
                      richText: '<span>Sexually transmitted infection (excluding HIV / AIDS)</span>',
                      text: 'Sexually transmitted infection (excluding HIV / AIDS)',
                      unknownAnswer: false,
                      value: 'choiceValue16',
                    },
                    {
                      richText: '<span>Skin disease or disorder (excluding skin cancer)</span>',
                      text: 'Skin disease or disorder (excluding skin cancer)',
                      unknownAnswer: false,
                      value: 'choiceValue17',
                    },
                    {
                      richText: '<span>Spinal or neurological disease / disorder / symptom</span>',
                      text: 'Spinal or neurological disease / disorder / symptom',
                      unknownAnswer: false,
                      value: 'choiceValue5',
                    },
                    {
                      richText: '<span>Vein, artery or circulatory disease / disorder</span>',
                      text: 'Vein, artery or circulatory disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue4',
                    },
                    {
                      richText: '<span>Other medical condition (not listed)</span>',
                      text: 'Other medical condition (not listed)',
                      unknownAnswer: false,
                      value: 'choiceValue3',
                    },
                    {
                      richText: '<span>None of these</span>',
                      text: 'None of these',
                      unknownAnswer: false,
                      value: 'NONE_OF_ABOVE_CHOICE_CODE',
                    },
                  ],
                  componentType: 'CheckBoxResp',
                },
                context: [],
                helpText: 'Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.',
                id: 142,
                isAnswered: false,
                richHelpText: '<span>Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.</span>',
                richText: '<span>Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply) </span>',
                text: 'Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)',
                type: 'MULTIPLE_CHOICE',
              },
              answer: {
                id: 142,
                questionType: 'MULTIPLE_CHOICE',
                value: [
                  'NONE_OF_ABOVE_CHOICE_CODE',
                ],
              },
              section_id: 3,
            },
            229: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/229',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 229,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)</span>',
                text: 'Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 229,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 3,
            },
            231: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/questions/231',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/28cb3a25-12b9-4c3a-b192-961b0a25c355/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Including hospitalization(s) or emergency care.',
                id: 231,
                isAnswered: false,
                richHelpText: '<span>Including hospitalization(s) or emergency care.</span>',
                richText: '<span>Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?</span>',
                text: 'Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 231,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 3,
            },
          },
          order: [
            1,
            2,
            7,
            8,
            9,
            10,
            11,
            63,
            64,
            99,
            100,
            101,
            119,
            121,
            126,
            127,
            130,
            131,
            133,
            134,
            135,
            137,
            140,
            142,
            229,
            231,
          ],
          sections: [
            {
              id: 0,
              question_ids: [
                1,
                10,
                63,
                64,
                99,
                100,
                101,
              ],
              title: 'Personal',
            },
            {
              id: 1,
              question_ids: [
                119,
                121,
                126,
                127,
                130,
                131,
                133,
                134,
                135,
                137,
              ],
              title: 'Lifestyle',
            },
            {
              id: 2,
              question_ids: [
                140,
              ],
              title: 'Family History ',
            },
            {
              id: 3,
              question_ids: [
                142,
                229,
                231,
              ],
              title: 'Medical History',
            },
          ],
          submitted: false,
        },
        submitted: true,
      },
      Y0zmi2ysCB: {
        session: {
          household_id: '7a13250a-65b0-4a4d-8fbe-2d6fe5900894',
          household_id_vers: 0,
          hd_session_id: '37904acc-39b2-4452-83e7-16b211c2f77c',
          hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
          hd_policy_id: '',
          hd_family_id: 'd23aa4f9-4141-4fc3-b274-1024d04c7c1a',
          aura_session_id: '61594859-a5cd-4fc0-b8ae-5bd803d2d945',
          promo_code: '',
          auth_num_attempts_remaining: '',
          auth_num_otp_attempts_remaining: '',
          auth_otp_authorized: '',
          auth_medium: '',
          auth_validate_email_phone: '',
          auth_verify_access_code: '',
          helcim_customer_code: '',
          twilio_token: '',
          user_id: '',
        },
        household: {
          email: '',
          firstName: 'Jude Dep2',
          lastName: 'Martin Dep2',
          hasPartner: '',
          partnerAge: '',
          partnerGender: '',
          userIncome: '',
          userIncomeOverride: '',
          userGender: 'Male',
          hasSavings: '',
          partnerIncome: '',
          partnerIncomeOverride: '',
          hasDebts: '',
          residenceType: '',
          birthdate: '02/02/2022',
          smoke: '',
          health: '',
          phone: '',
          hasKids: '',
          kids: [],
          nonRetirementSavings: '',
          retirementSavings: '',
          assetsTotOverride: '',
          creditCards: '',
          linesOfCredit: '',
          homeEquityLoans: '',
          mortgage: '',
          otherDebt: '',
          studentLoans: '',
          debtsTotOverride: '',
          hasExistingCoverage: '',
          address_line1: '',
          address_line2: '',
          city: '',
          country: '',
          postal_code: '',
          province: '',
          healthcard_province: 'AB',
          existingCoverage: {
            spouse: {
              group: '',
              individual: '',
            },
            user: {
              group: '',
              individual: '',
            },
          },
          user_family_composition: '',
          application_language: 'en-CA',
        },
        quotes: {
          hd: {
            userQuotes: {
              individual: [
                {
                  mn_prems: 80.95,
                  plan_type: 'enhanced',
                  is_discounted: false,
                  selected: true,
                },
                {
                  mn_prems: 38.83,
                  plan_type: 'essential',
                  is_discounted: false,
                  selected: false,
                },
                {
                  mn_prems: 48.87,
                  plan_type: 'standard',
                  is_discounted: false,
                  selected: false,
                },
              ],
            },
          },
        },
        decision: {
          active_decision: '',
          initial_decision: '',
          policy_status: '',
          aps_field_required_flag: '',
          mvr_required_flag: '',
          nurse_visit_required_flag: '',
          aura_uw_decision_error_flag: '',
          risks: [],
          tobacco_rating_flag: false,
          smoking_discrepancy_flag: false,
          uw_total_debits: 0,
          uw_flat_extra_debits: 0,
          active_maximum_eligible_coverage: '',
          exclusions: [],
        },
        disclosure: {
          disclosures: {
            142: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/142',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      richText: '<span>Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)</span>',
                      text: 'Acquired immunodeficiency syndrome (AIDS) / Human immunodeficiency virus (HIV)',
                      unknownAnswer: false,
                      value: 'dt_HumanImmunodeficiencyVirus',
                    },
                    {
                      richText: '<span>Allergies or immune system disease / disorder</span>',
                      text: 'Allergies or immune system disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue21',
                    },
                    {
                      richText: '<span>Bladder, kidney (renal) or urinary disease / disorder</span>',
                      text: 'Bladder, kidney (renal) or urinary disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue22',
                    },
                    {
                      richText: '<span>Blood disease / disorder</span>',
                      text: 'Blood disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue20',
                    },
                    {
                      richText: '<span>Bone, joint, muscle or connective tissue disease / disorder</span>',
                      text: 'Bone, joint, muscle or connective tissue disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue19',
                    },
                    {
                      richText: '<span>Brain, cerebral or intracranial (cerebrovascular) disease / disorder</span>',
                      text: 'Brain, cerebral or intracranial (cerebrovascular) disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue1',
                    },
                    {
                      richText: '<span>Breathing, lung or respiratory disease / disorder (including sleep apnea)</span>',
                      text: 'Breathing, lung or respiratory disease / disorder (including sleep apnea)',
                      unknownAnswer: false,
                      value: 'choiceValue8',
                    },
                    {
                      richText: '<span>Cancer, cyst, tumor, unusual growth or lump of any type</span>',
                      text: 'Cancer, cyst, tumor, unusual growth or lump of any type',
                      unknownAnswer: false,
                      value: 'choiceValue2',
                    },
                    {
                      richText: '<span>Diabetes</span>',
                      text: 'Diabetes',
                      unknownAnswer: false,
                      value: 'choiceValue23',
                    },
                    {
                      richText: '<span>Ear, nose, throat or mouth disease / disorder</span>',
                      text: 'Ear, nose, throat or mouth disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue6',
                    },
                    {
                      richText: '<span>Eye disease / disorder</span>',
                      text: 'Eye disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue7',
                    },
                    {
                      richText: '<span>Heart disease / disorder</span>',
                      text: 'Heart disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue18',
                    },
                    {
                      richText: '<span>Hepatitis</span>',
                      text: 'Hepatitis',
                      unknownAnswer: false,
                      value: 'choiceValue25',
                    },
                    {
                      richText: '<span>Hormone, gland or metabolic disease / disorder</span>',
                      text: 'Hormone, gland or metabolic disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue9',
                    },
                    {
                      richText: '<span>Hypertension or elevated blood pressure </span>',
                      text: 'Hypertension or elevated blood pressure ',
                      unknownAnswer: false,
                      value: 'dt_Hypertension',
                    },
                    {
                      richText: '<span>Hypercholesterolemia / hyperlipidemia (high cholesterol)</span>',
                      text: 'Hypercholesterolemia / hyperlipidemia (high cholesterol)',
                      unknownAnswer: false,
                      value: 'dt_Hypercholesterolemia',
                    },
                    {
                      richText: '<span>Hypertriglyceridemia (high triglycerides)</span>',
                      text: 'Hypertriglyceridemia (high triglycerides)',
                      unknownAnswer: false,
                      value: 'dt_Hypertriglyceridemia',
                    },
                    {
                      richText: '<span>Infectious disease or virus (do not disclose common colds or flu)</span>',
                      text: 'Infectious disease or virus (do not disclose common colds or flu)',
                      unknownAnswer: false,
                      value: 'choiceValue10',
                    },
                    {
                      richText: '<span>Intestine, esophagus or stomach disease / disorder</span>',
                      text: 'Intestine, esophagus or stomach disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue12',
                    },
                    {
                      richText: '<span>Liver, bile duct or gallbladder disease / disorder</span>',
                      text: 'Liver, bile duct or gallbladder disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue13',
                    },
                    {
                      richText: '<span>Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)</span>',
                      text: 'Mental health, psychological, emotional, eating or developmental disorder (including but not limited to stress, anxiety, depression, PTSD, schizophrenia, anorexia or suicidal thoughts)',
                      unknownAnswer: false,
                      value: 'choiceValue14',
                    },
                    {
                      richText: '<span>Poisoning, Burn, Concussion, Heatstroke, or Frostbite</span>',
                      text: 'Poisoning, Burn, Concussion, Heatstroke, or Frostbite',
                      unknownAnswer: false,
                      value: 'choiceValue11',
                    },
                    {
                      richText: '<span>Prostate disease / disorder</span>',
                      text: 'Prostate disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue0',
                    },
                    {
                      richText: '<span>Reproductive disease, disorder or condition</span>',
                      text: 'Reproductive disease, disorder or condition',
                      unknownAnswer: false,
                      value: 'choiceValue15',
                    },
                    {
                      richText: '<span>Sexually transmitted infection (excluding HIV / AIDS)</span>',
                      text: 'Sexually transmitted infection (excluding HIV / AIDS)',
                      unknownAnswer: false,
                      value: 'choiceValue16',
                    },
                    {
                      richText: '<span>Skin disease or disorder (excluding skin cancer)</span>',
                      text: 'Skin disease or disorder (excluding skin cancer)',
                      unknownAnswer: false,
                      value: 'choiceValue17',
                    },
                    {
                      richText: '<span>Spinal or neurological disease / disorder / symptom</span>',
                      text: 'Spinal or neurological disease / disorder / symptom',
                      unknownAnswer: false,
                      value: 'choiceValue5',
                    },
                    {
                      richText: '<span>Vein, artery or circulatory disease / disorder</span>',
                      text: 'Vein, artery or circulatory disease / disorder',
                      unknownAnswer: false,
                      value: 'choiceValue4',
                    },
                    {
                      richText: '<span>Other medical condition (not listed)</span>',
                      text: 'Other medical condition (not listed)',
                      unknownAnswer: false,
                      value: 'choiceValue3',
                    },
                    {
                      richText: '<span>None of these</span>',
                      text: 'None of these',
                      unknownAnswer: false,
                      value: 'NONE_OF_ABOVE_CHOICE_CODE',
                    },
                  ],
                  componentType: 'CheckBoxResp',
                },
                context: [],
                helpText: 'Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.',
                id: 142,
                isAnswered: false,
                richHelpText: '<span>Provide information to the best of your ability.  Please disclose the medical condition name, not the treatment received or the test / procedure performed.</span>',
                richText: '<span>Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply) </span>',
                text: 'Have you ever been diagnosed with, suffered from or received treatment for any of the following medical conditions? (Check all that apply)',
                type: 'MULTIPLE_CHOICE',
              },
              answer: {
                id: 142,
                questionType: 'MULTIPLE_CHOICE',
                value: [
                  'NONE_OF_ABOVE_CHOICE_CODE',
                ],
              },
              section_id: 3,
            },
            229: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/229',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: '',
                id: 229,
                isAnswered: false,
                richHelpText: '',
                richText: '<span>Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)</span>',
                text: 'Are you currently taking or plan on taking any prescription medication that you have not yet disclosed on this application? (Excluding medication for birth control, smoking cessation, and erectile dysfunction)',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 229,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 3,
            },
            231: {
              question: {
                _links: {
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/231',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>Yes</span>',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>No</span>',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [],
                helpText: 'Including hospitalization(s) or emergency care.',
                id: 231,
                isAnswered: false,
                richHelpText: '<span>Including hospitalization(s) or emergency care.</span>',
                richText: '<span>Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?</span>',
                text: 'Other than routine check-ups / tests, in the past 10 years, have you consulted, or are you planning to consult a healthcare provider for any other reason which you have not yet disclosed?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 231,
                questionType: 'SINGLE_CHOICE',
                value: 'true',
              },
              section_id: 3,
            },
            232: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/231',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/232',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      text: 'ACE (Angiotensin Converting Enzyme) Levels',
                      value: '2338_searchQual1',
                    },
                    {
                      text: 'ACE Inhibitors',
                      value: '2926_searchQual2',
                    },
                    {
                      text: 'ACE Levels Levels (Serum)',
                      value: '2338_searchQual3',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Ache',
                      value: '7492_searchQual4',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Condition',
                      value: '7489_searchQual5',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Disorder',
                      value: '7489_searchQual6',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Impairment',
                      value: '7489_searchQual7',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Inflammation',
                      value: '7495_searchQual8',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Injury',
                      value: '9838_searchQual9',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Pain',
                      value: '7492_searchQual10',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Problem',
                      value: '7489_searchQual11',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Sprain',
                      value: '8128_searchQual12',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Strain',
                      value: '8128_searchQual13',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Swelling',
                      value: '7495_searchQual14',
                    },
                    {
                      text: 'ACL (Anterior Cruciate Ligament) Tear',
                      value: '9838_searchQual15',
                    },
                    {
                      text: 'ACL Repair',
                      value: '5922_searchQual16',
                    },
                    {
                      text: 'ACL Surgery',
                      value: '5922_searchQual17',
                    },
                    {
                      text: 'ACLE (Acute Cutaneous Lupus Erythematosus)',
                      value: '4459_searchQual18',
                    },
                    {
                      text: 'ACP (Acid Phosphatase) Levels',
                      value: '2310_searchQual19',
                    },
                    {
                      text: 'ACR (Albumin-to-Creatinine Ratio) Levels',
                      value: '2697_searchQual20',
                    },
                    {
                      text: 'ACTH',
                      value: '2927_searchQual21',
                    },
                    {
                      text: 'ACTH (Adrenocorticotropic Hormone) Levels',
                      value: '2315_searchQual22',
                    },
                    {
                      text: 'ACTH (Cosyntropin) Stimulation',
                      value: '2312_searchQual23',
                    },
                    {
                      text: 'ACTH Suppression Level',
                      value: '2495_searchQual24',
                    },
                    {
                      text: 'ACTH Suppression Test',
                      value: '2495_searchQual25',
                    },
                    {
                      text: 'Acalabrutinib',
                      value: '100969_searchQual26',
                    },
                    {
                      text: 'Acamprosate Calcium',
                      value: '11692_searchQual27',
                    },
                    {
                      text: 'Acanthamoeba Keratitis',
                      value: '9760_searchQual28',
                    },
                    {
                      text: 'Acanthosis Nigricans',
                      value: '3334_searchQual29',
                    },
                    {
                      text: 'Acapnia',
                      value: '5252_searchQual30',
                    },
                    {
                      text: 'Acarbose',
                      value: '11169_searchQual31',
                    },
                    {
                      text: 'Acathisia',
                      value: '5107_searchQual32',
                    },
                    {
                      text: 'Accessory Spleen',
                      value: '100618_searchQual33',
                    },
                    {
                      text: 'Accident or Trauma',
                      value: '9271_searchQual34',
                    },
                    {
                      text: 'Accolate',
                      value: '11376_searchQual35',
                    },
                    {
                      text: 'Accommodative Disorder',
                      value: '14493_searchQual36',
                    },
                    {
                      text: 'Accommodative Dysfunction',
                      value: '14493_searchQual37',
                    },
                    {
                      text: 'Accuneb',
                      value: '11385_searchQual38',
                    },
                    {
                      text: 'Accupril',
                      value: '10839_searchQual39',
                    },
                    {
                      text: 'Accuretic',
                      value: '10842_searchQual40',
                    },
                    {
                      text: 'Acebutolol',
                      value: '10587_searchQual41',
                    },
                    {
                      text: 'Acebutolol HCl',
                      value: '10587_searchQual42',
                    },
                    {
                      text: 'Acellular Pertussis',
                      value: '12220_searchQual43',
                    },
                    {
                      text: 'Aceon',
                      value: '10827_searchQual44',
                    },
                    {
                      text: 'Acetabular Dysplasia',
                      value: '12361_searchQual45',
                    },
                    {
                      text: 'Acetaminophen',
                      value: '6088_searchQual46',
                    },
                    {
                      text: 'Acetaminophen Levels',
                      value: '2306_searchQual47',
                    },
                    {
                      text: 'Acetaminophen and Codeine',
                      value: '12085_searchQual48',
                    },
                    {
                      text: 'Acetaminophen and Codeine Phosphate',
                      value: '12085_searchQual49',
                    },
                    {
                      text: 'Acetaminophen with Codeine',
                      value: '12085_searchQual50',
                    },
                    {
                      text: 'Acetaminophen-Codeine',
                      value: '12085_searchQual51',
                    },
                    {
                      text: 'Acetaminophen-Phenyltoloxamine',
                      value: '12082_searchQual52',
                    },
                    {
                      text: 'Acetaminophen-Phenyltoloxamine-Caffeine',
                      value: '12082_searchQual53',
                    },
                    {
                      text: 'Acetaminophen-Phenyltoloxamine-salicylamide',
                      value: '12082_searchQual54',
                    },
                    {
                      text: 'Acetaminophen-Phenyltoloxamine-salicylamide-caffeine',
                      value: '12082_searchQual55',
                    },
                    {
                      text: 'Acetaminophen-Salicylamide',
                      value: '12082_searchQual56',
                    },
                    {
                      text: 'Acetaminophen-Tramadol Hydrochloride',
                      value: '12085_searchQual57',
                    },
                    {
                      text: 'Acetaminophen-aspirin-caffeine-salicylamide',
                      value: '12082_searchQual58',
                    },
                    {
                      text: 'Acetazolamide',
                      value: '100253_searchQual59',
                    },
                    {
                      text: 'Acetazolamide Sodium',
                      value: '100253_searchQual60',
                    },
                    {
                      text: 'Acetic Acid (Vaginal)',
                      value: '12235_searchQual61',
                    },
                    {
                      text: 'Acetic Acid-Oxyquinoline',
                      value: '12235_searchQual62',
                    },
                    {
                      text: 'Acetic Acid-ricinoleic',
                      value: '12235_searchQual63',
                    },
                    {
                      text: 'Acetoacetate Levels',
                      value: '2644_searchQual64_searchQual260',
                    },
                    {
                      text: 'Acetoacetic Acid Levels',
                      value: '2644_searchQual65_searchQual261',
                    },
                    {
                      text: 'Acetohydroxamic Acid',
                      value: '12169_searchQual66',
                    },
                    {
                      text: 'Acetone Bodies Levels',
                      value: '2644_searchQual67',
                    },
                    {
                      text: 'Acetone Levels',
                      value: '2644_searchQual68',
                    },
                    {
                      text: 'Acetone in the Urine',
                      value: '4010_searchQual69',
                    },
                    {
                      text: 'Acetonuria',
                      value: '3950_searchQual70',
                    },
                    {
                      text: 'Acetylcholine Chloride',
                      value: '12202_searchQual71',
                    },
                    {
                      text: 'Acetylcholine Receptor Antibody Detection',
                      value: '2307_searchQual72',
                    },
                    {
                      text: 'Acetylcholinesterase Levels',
                      value: '2451_searchQual73',
                    },
                    {
                      text: 'Acetylcysteine',
                      value: '100819_searchQual74',
                    },
                    {
                      text: 'Acetylsalicylic Acid',
                      value: '12082_searchQual75',
                    },
                    {
                      text: 'Acetylsalicylic Acid-Metoclopramide',
                      value: '101135_searchQual76',
                    },
                    {
                      text: 'Achalasia',
                      value: '3789_searchQual77',
                    },
                    {
                      text: 'Achalasia Cardia',
                      value: '3789_searchQual78',
                    },
                    {
                      text: 'Achalasia of Cardia',
                      value: '3789_searchQual79',
                    },
                    {
                      text: 'Ache',
                      value: '4367_searchQual80',
                    },
                    {
                      text: 'Ache in Bones',
                      value: '7552_searchQual81',
                    },
                    {
                      text: 'Achilles Enthesopathy',
                      value: '7450_searchQual82',
                    },
                    {
                      text: 'Achilles Tendinitis',
                      value: '7456_searchQual83',
                    },
                    {
                      text: 'Achilles Tendon Ache',
                      value: '7450_searchQual84',
                    },
                    {
                      text: 'Achilles Tendon Impairment',
                      value: '4379_searchQual85',
                    },
                    {
                      text: 'Achilles Tendon Infection',
                      value: '7447_searchQual86',
                    },
                    {
                      text: 'Achilles Tendon Inflammation',
                      value: '7456_searchQual87',
                    },
                    {
                      text: 'Achilles Tendon Injury',
                      value: '9553_searchQual88',
                    },
                    {
                      text: 'Achilles Tendon Pain',
                      value: '7450_searchQual89',
                    },
                    {
                      text: 'Achilles Tendon Problem',
                      value: '7453_searchQual90',
                    },
                    {
                      text: 'Achilles Tendon Rupture',
                      value: '101810_searchQual91',
                    },
                    {
                      text: 'Achilles Tendon Sprain',
                      value: '9835_searchQual92',
                    },
                    {
                      text: 'Achilles Tendon Swelling',
                      value: '7456_searchQual93',
                    },
                    {
                      text: 'Achilles Tendon Tear',
                      value: '101810_searchQual94',
                    },
                    {
                      text: 'Aching Achilles Tendon',
                      value: '7450_searchQual95',
                    },
                    {
                      text: 'Aching Back',
                      value: '7516_searchQual96_searchQual262',
                    },
                    {
                      text: 'Aching Spine',
                      value: '7516_searchQual97',
                    },
                    {
                      text: 'Achlorhydria',
                      value: '14313_searchQual98',
                    },
                    {
                      text: 'Achondroplasia',
                      value: '3484_searchQual99',
                    },
                    {
                      text: 'Achromachia',
                      value: '3338_searchQual100_searchQual263',
                    },
                    {
                      text: 'Achromasia',
                      value: '3338_searchQual101',
                    },
                    {
                      text: 'Achromatosis',
                      value: '3338_searchQual102',
                    },
                    {
                      text: 'Achromia',
                      value: '3338_searchQual103',
                    },
                    {
                      text: 'Acid Elution Test',
                      value: '2647_searchQual104',
                    },
                    {
                      text: 'Acid Hemolysin',
                      value: '2606_searchQual105',
                    },
                    {
                      text: 'Acid Indigestion',
                      value: '3858_searchQual106',
                    },
                    {
                      text: 'Acid Jelly (vaginal)',
                      value: '12235_searchQual107',
                    },
                    {
                      text: 'Acid Loading Test (Ph)',
                      value: '2308_searchQual108',
                    },
                    {
                      text: 'Acid Maltase Deficiency',
                      value: '3589_searchQual109',
                    },
                    {
                      text: 'Acid Mucopolysaccharides Levels',
                      value: '2309_searchQual110_searchQual264',
                    },
                    {
                      text: 'Acid Perfusion Test',
                      value: '2384_searchQual111',
                    },
                    {
                      text: 'Acid Phosphatase Levels',
                      value: '2310_searchQual112',
                    },
                    {
                      text: 'Acid Reflux',
                      value: '3853_searchQual113',
                    },
                    {
                      text: 'Acid-Fast Bacillus Culture',
                      value: '2580_searchQual114_searchQual265',
                    },
                    {
                      text: 'Acid-Fast Bacillus Sensitivity',
                      value: '2580_searchQual115_searchQual266',
                    },
                    {
                      text: 'Acid-Fast Bacillus Smear',
                      value: '2580_searchQual116_searchQual267',
                    },
                    {
                      text: 'Acid-Fast Stain',
                      value: '2311_searchQual117',
                    },
                    {
                      text: 'Acidic Vaginal Jelly',
                      value: '12235_searchQual118',
                    },
                    {
                      text: 'Acidosis',
                      value: '3485_searchQual119',
                    },
                    {
                      text: 'Acitretin',
                      value: '11010_searchQual120',
                    },
                    {
                      text: 'Aclidinium',
                      value: '11382_searchQual121',
                    },
                    {
                      text: 'Aclidinium Bromide',
                      value: '11382_searchQual122',
                    },
                    {
                      text: 'Acne',
                      value: '3335_searchQual123',
                    },
                    {
                      text: 'Acne Erythematosa',
                      value: '3428_searchQual124',
                    },
                    {
                      text: 'Acne Inversa',
                      value: '14274_searchQual125',
                    },
                    {
                      text: 'Acne Rosacea',
                      value: '3428_searchQual126_searchQual268',
                    },
                    {
                      text: 'Acne vulgaris',
                      value: '3335_searchQual127',
                    },
                    {
                      text: 'Acosta\'s Disease',
                      value: '3496_searchQual128',
                    },
                    {
                      text: 'Acoustic Neuroma',
                      value: '4795_searchQual129',
                    },
                    {
                      text: 'Acquired Antithrombin Deficiency Disorder',
                      value: '4121_searchQual130',
                    },
                    {
                      text: 'Acquired Aplastic Anemia',
                      value: '4106_searchQual131',
                    },
                    {
                      text: 'Acquired Bronchiectasis',
                      value: '5222_searchQual132',
                    },
                    {
                      text: 'Acquired Hypogammaglobulinaemia',
                      value: '4129_searchQual133',
                    },
                    {
                      text: 'Acquired Hypogammaglobulinemia',
                      value: '4129_searchQual134',
                    },
                    {
                      text: 'Acquired Immune Deficiency Syndrome',
                      value: '100702_searchQual135',
                    },
                    {
                      text: 'Acral Lentiginous Melanoma',
                      value: '5078_searchQual136',
                    },
                    {
                      text: 'Acrochorda',
                      value: '3432_searchQual137',
                    },
                    {
                      text: 'Acrochordon',
                      value: '3432_searchQual138',
                    },
                    {
                      text: 'Acrocyanosis',
                      value: '3220_searchQual139',
                    },
                    {
                      text: 'Acrodermatitis',
                      value: '3336_searchQual140',
                    },
                    {
                      text: 'Acrodermatitis (Infantile Lichenoid)',
                      value: '3336_searchQual141',
                    },
                    {
                      text: 'Acrodermatitis (Papular Infantile)',
                      value: '3336_searchQual142',
                    },
                    {
                      text: 'Acromegaly',
                      value: '3486_searchQual143',
                    },
                    {
                      text: 'Acromioplasty',
                      value: '9046_searchQual144',
                    },
                    {
                      text: 'Acroparesthesia',
                      value: '14426_searchQual145',
                    },
                    {
                      text: 'Acroparesthesia Syndrome',
                      value: '14426_searchQual146',
                    },
                    {
                      text: 'Acrophobia',
                      value: '13099_searchQual147',
                    },
                    {
                      text: 'ActHIB',
                      value: '3198_searchQual148',
                    },
                    {
                      text: 'Actemra',
                      value: '10953_searchQual149',
                    },
                    {
                      text: 'Actigall',
                      value: '13878_searchQual150',
                    },
                    {
                      text: 'Actinic Keratosis',
                      value: '3393_searchQual151',
                    },
                    {
                      text: 'Actinomycosis',
                      value: '100738_searchQual152',
                    },
                    {
                      text: 'Actiq',
                      value: '13692_searchQual153',
                    },
                    {
                      text: 'Activated Clotting Time',
                      value: '2313_searchQual154',
                    },
                    {
                      text: 'Activated Coagulation Time',
                      value: '2313_searchQual155',
                    },
                    {
                      text: 'Activated Partial Thromboplastin Time',
                      value: '2728_searchQual156',
                    },
                    {
                      text: 'Activated Protein C Resistance',
                      value: '4101_searchQual157',
                    },
                    {
                      text: 'Active Anaphylaxis',
                      value: '5207_searchQual158',
                    },
                    {
                      text: 'Active-Cyclobenzaprine',
                      value: '12193_searchQual159',
                    },
                    {
                      text: 'Actonel',
                      value: '13800_searchQual160',
                    },
                    {
                      text: 'Actoplus met XR',
                      value: '11268_searchQual161',
                    },
                    {
                      text: 'Actos',
                      value: '11262_searchQual162',
                    },
                    {
                      text: 'Acupressure',
                      value: '2929_searchQual163',
                    },
                    {
                      text: 'Acupuncture',
                      value: '2929_searchQual164',
                    },
                    {
                      text: 'Acupuncturist (visit)',
                      value: '2817_searchQual165',
                    },
                    {
                      text: 'Acute Appendicitis',
                      value: '3796_searchQual166',
                    },
                    {
                      text: 'Acute Atelectasis',
                      value: '5215_searchQual167',
                    },
                    {
                      text: 'Acute Care',
                      value: '100312_searchQual168',
                    },
                    {
                      text: 'Acute Care Visit',
                      value: '100312_searchQual169',
                    },
                    {
                      text: 'Acute Colitis',
                      value: '100690_searchQual170',
                    },
                    {
                      text: 'Acute Confusional State',
                      value: '5128_searchQual171',
                    },
                    {
                      text: 'Acute Cough',
                      value: '5230_searchQual172',
                    },
                    {
                      text: 'Acute Cutaneous Lupus Erythematosus (ACLE)',
                      value: '4459_searchQual173',
                    },
                    {
                      text: 'Acute Cystitis',
                      value: '100718_searchQual174',
                    },
                    {
                      text: 'Acute Depression',
                      value: '5132_searchQual175',
                    },
                    {
                      text: 'Acute Duodenitis',
                      value: '3829_searchQual176',
                    },
                    {
                      text: 'Acute Eosinophilic Pneumonia',
                      value: '5271_searchQual177',
                    },
                    {
                      text: 'Acute Gastric Mucosal Lesion',
                      value: '100745_searchQual178',
                    },
                    {
                      text: 'Acute Gastritis',
                      value: '12445_searchQual179',
                    },
                    {
                      text: 'Acute Glomerulonephritis',
                      value: '12367_searchQual180',
                    },
                    {
                      text: 'Acute Granulocytic Leukemia',
                      value: '4800_searchQual181',
                    },
                    {
                      text: 'Acute HIV Syndrome',
                      value: '4266_searchQual182',
                    },
                    {
                      text: 'Acute Hemolysis',
                      value: '100890_searchQual183',
                    },
                    {
                      text: 'Acute Hepatitis',
                      value: '12544_searchQual184',
                    },
                    {
                      text: 'Acute Hepatitis B',
                      value: '13312_searchQual185',
                    },
                    {
                      text: 'Acute Hepatitis C',
                      value: '12373_searchQual186',
                    },
                    {
                      text: 'Acute Intermittent Porphyria',
                      value: '4174_searchQual187',
                    },
                    {
                      text: 'Acute Interstitial Pneumonia',
                      value: '5274_searchQual188',
                    },
                    {
                      text: 'Acute Interstitial Pneumonitis',
                      value: '5274_searchQual189',
                    },
                    {
                      text: 'Acute Low Back Pain',
                      value: '13648_searchQual190_searchQual269',
                    },
                    {
                      text: 'Acute Lymphoblastic Leukemia',
                      value: '4796_searchQual191',
                    },
                    {
                      text: 'Acute Lymphocytic Leukemia',
                      value: '4797_searchQual192',
                    },
                    {
                      text: 'Acute Lymphoid Leukemia',
                      value: '4798_searchQual193',
                    },
                    {
                      text: 'Acute Mastitis',
                      value: '4012_searchQual194',
                    },
                    {
                      text: 'Acute Mountain Sickness',
                      value: '3496_searchQual195',
                    },
                    {
                      text: 'Acute Myeloblastic Leukemia',
                      value: '4799_searchQual196',
                    },
                    {
                      text: 'Acute Myelogenous Leukemia',
                      value: '4800_searchQual197',
                    },
                    {
                      text: 'Acute Myeloid Leukemia',
                      value: '4800_searchQual198',
                    },
                    {
                      text: 'Acute Necrotizing Ulcerative Gingivitis',
                      value: '3670_searchQual199',
                    },
                    {
                      text: 'Acute Nephritis',
                      value: '12367_searchQual200',
                    },
                    {
                      text: 'Acute Non-Lymphocytic Leukemia',
                      value: '4801_searchQual201',
                    },
                    {
                      text: 'Acute Organic Brain Syndrome',
                      value: '5169_searchQual202',
                    },
                    {
                      text: 'Acute Pancreatitis',
                      value: '7462_searchQual203',
                    },
                    {
                      text: 'Acute Poststreptococcal Glomerulonephritis (PSGN)',
                      value: '12367_searchQual204',
                    },
                    {
                      text: 'Acute Promyelocytic Leukemia (APL)',
                      value: '4800_searchQual205',
                    },
                    {
                      text: 'Acute Prostatitis',
                      value: '12577_searchQual206',
                    },
                    {
                      text: 'Acute Pyelonephritis',
                      value: '12475_searchQual207',
                    },
                    {
                      text: 'Acute Renal Failure',
                      value: '12568_searchQual208',
                    },
                    {
                      text: 'Acute Retroviral Syndrome',
                      value: '4266_searchQual209',
                    },
                    {
                      text: 'Acute Rheumatic Carditis',
                      value: '3318_searchQual210',
                    },
                    {
                      text: 'Acute Rhinitis',
                      value: '3747_searchQual211',
                    },
                    {
                      text: 'Acute Sinusitis',
                      value: '3755_searchQual212',
                    },
                    {
                      text: 'Acute Stress Disorder',
                      value: '5103_searchQual213',
                    },
                    {
                      text: 'Acute Stress Reaction',
                      value: '5103_searchQual214_searchQual270',
                    },
                    {
                      text: 'Acute Thyroiditis',
                      value: '3513_searchQual215',
                    },
                    {
                      text: 'Acute Tubular Necrosis (ATN)',
                      value: '14394_searchQual216',
                    },
                    {
                      text: 'Acute Uremia',
                      value: '14397_searchQual217',
                    },
                    {
                      text: 'Acute Viral Rhinopharyngitis',
                      value: '4229_searchQual218',
                    },
                    {
                      text: 'Acute febrile neutrophilic dermatosis',
                      value: '3438_searchQual219',
                    },
                    {
                      text: 'Acyclovir',
                      value: '13880_searchQual220',
                    },
                    {
                      text: 'aciphex',
                      value: '12226_searchQual221',
                    },
                    {
                      text: 'acticlate',
                      value: '12217_searchQual222',
                    },
                    {
                      text: 'acuflex',
                      value: '12082_searchQual223',
                    },
                    {
                      text: 'acular',
                      value: '12202_searchQual224',
                    },
                    {
                      text: 'acuvail',
                      value: '12202_searchQual225',
                    },
                    {
                      text: '(ATN) Acute Tubular Necrosis',
                      value: '14394_searchQual226',
                    },
                    {
                      text: '2019-nCoV Acute Respiratory Disease',
                      value: '14267_searchQual227',
                    },
                    {
                      text: '2019-nCoV Acute Respiratory Disease Test',
                      value: '14300_searchQual228',
                    },
                    {
                      text: '3 Lead Pacemaker',
                      value: '101691_searchQual229',
                    },
                    {
                      text: '5-Hydroxyindole Acetic Acid Levels',
                      value: '2302_searchQual230',
                    },
                    {
                      text: 'ADHD (Attention Deficit Hyperactivity Disorder)',
                      value: '5113_searchQual231',
                    },
                    {
                      text: 'AEP (Acute Eosinophilic Pneumonia)',
                      value: '5271_searchQual232',
                    },
                    {
                      text: 'AFB (Acid-Fast Bacillus) Culture',
                      value: '2580_searchQual233',
                    },
                    {
                      text: 'AFB (Acid-Fast Bacillus) Sensitivity',
                      value: '2580_searchQual234',
                    },
                    {
                      text: 'AFB (Acid-Fast Bacillus) Smear',
                      value: '2580_searchQual235',
                    },
                    {
                      text: 'AICD (Artificial Implanted Cardiac Defibrillator)',
                      value: '3027_searchQual236',
                    },
                    {
                      text: 'AIDS (Acquired Immune Deficiency Syndrome)',
                      value: '100702_searchQual237',
                    },
                    {
                      text: 'AIP (Acute Intermittent Porphyria)',
                      value: '4174_searchQual238',
                    },
                    {
                      text: 'AK-poly-bac',
                      value: '12202_searchQual239',
                    },
                    {
                      text: 'ALL (Acute Lymphoblastic Leukemia)',
                      value: '4796_searchQual240',
                    },
                    {
                      text: 'AML (Acute Myeloid Leukemia)',
                      value: '4800_searchQual241',
                    },
                    {
                      text: 'AMP (Acid Mucopolysaccharides) Levels',
                      value: '2309_searchQual242',
                    },
                    {
                      text: 'AMS (Acute Mountain Sickness)',
                      value: '3496_searchQual243',
                    },
                    {
                      text: 'ANUG (Acute Necrotizing Ulcerative Gingivitis)',
                      value: '3670_searchQual244',
                    },
                    {
                      text: 'APAP Machine',
                      value: '3019_searchQual245',
                    },
                    {
                      text: 'APC-R (Activated Protein C Resistance)',
                      value: '4101_searchQual246',
                    },
                    {
                      text: 'APTT (Activated Partial Thromboplastin Time)',
                      value: '2728_searchQual247',
                    },
                    {
                      text: 'ARS (Acute Retroviral Syndrome)',
                      value: '4266_searchQual248',
                    },
                    {
                      text: 'Abacavir Sulfate',
                      value: '11680_searchQual249',
                    },
                    {
                      text: 'Abacavir Sulfate-Lamivudine',
                      value: '11683_searchQual250',
                    },
                    {
                      text: 'Abacavir-Dolutegravir-Lamivud',
                      value: '11686_searchQual251',
                    },
                    {
                      text: 'Abacavir-Lamivudine-Zidovudine',
                      value: '11689_searchQual252',
                    },
                    {
                      text: 'Abatacept',
                      value: '10923_searchQual253',
                    },
                    {
                      text: 'Abdominal Paracentesis',
                      value: '2305_searchQual254',
                    },
                    {
                      text: 'Abdominal Wall Displacement',
                      value: '3781_searchQual255',
                    },
                    {
                      text: 'Abemaciclib',
                      value: '102076_searchQual256',
                    },
                    {
                      text: 'Abiraterone Acetate',
                      value: '100313_searchQual257',
                    },
                    {
                      text: 'Ablation, Cardiac',
                      value: '13153_searchQual258',
                    },
                    {
                      text: 'Abscess (Stomach)',
                      value: '3788_searchQual259',
                    },
                    {
                      text: 'Acetoacetate Levels',
                      value: '2644_searchQual64_searchQual260',
                    },
                    {
                      text: 'Acetoacetic Acid Levels',
                      value: '2644_searchQual65_searchQual261',
                    },
                    {
                      text: 'Aching Back',
                      value: '7516_searchQual96_searchQual262',
                    },
                    {
                      text: 'Achromachia',
                      value: '3338_searchQual100_searchQual263',
                    },
                    {
                      text: 'Acid Mucopolysaccharides Levels',
                      value: '2309_searchQual110_searchQual264',
                    },
                    {
                      text: 'Acid-Fast Bacillus Culture',
                      value: '2580_searchQual114_searchQual265',
                    },
                    {
                      text: 'Acid-Fast Bacillus Sensitivity',
                      value: '2580_searchQual115_searchQual266',
                    },
                    {
                      text: 'Acid-Fast Bacillus Smear',
                      value: '2580_searchQual116_searchQual267',
                    },
                    {
                      text: 'Acne Rosacea',
                      value: '3428_searchQual126_searchQual268',
                    },
                    {
                      text: 'Acute Low Back Pain',
                      value: '13648_searchQual190_searchQual269',
                    },
                    {
                      text: 'Acute Stress Reaction',
                      value: '5103_searchQual214_searchQual270',
                    },
                    {
                      text: 'Adacel',
                      value: '12220_searchQual271',
                    },
                    {
                      text: 'Age Related Macular Degeneration',
                      value: '3701_searchQual272',
                    },
                    {
                      text: 'Age related cataract',
                      value: '12505_searchQual273',
                    },
                    {
                      text: 'Age-Related Macular Degeneration',
                      value: '3701_searchQual274',
                    },
                    {
                      text: 'Aldactazide',
                      value: '10854_searchQual275',
                    },
                    {
                      text: 'Aldactone',
                      value: '9241_searchQual276',
                    },
                    {
                      text: 'Alefacept',
                      value: '11013_searchQual277',
                    },
                    {
                      text: 'Alexander Technique Practitioner (visit)',
                      value: '2817_searchQual278',
                    },
                    {
                      text: 'Allergic Reaction',
                      value: '3495_searchQual279',
                    },
                    {
                      text: 'Altace',
                      value: '10845_searchQual280',
                    },
                    {
                      text: 'Alternative Health Practitioner',
                      value: '2929_searchQual281',
                    },
                    {
                      text: 'Altinac',
                      value: '100110_searchQual282',
                    },
                    {
                      text: 'Amikacin Levels',
                      value: '2326_searchQual283',
                    },
                    {
                      text: 'Amino Acid Cervical',
                      value: '12235_searchQual284',
                    },
                    {
                      text: 'Amino Acid-Urea (vaginal)',
                      value: '12235_searchQual285',
                    },
                    {
                      text: 'Amino Acids Levels (Urine)',
                      value: '2327_searchQual286',
                    },
                    {
                      text: 'Aminoaciduria Levels',
                      value: '2327_searchQual287',
                    },
                    {
                      text: 'Aminosalicylic Acid',
                      value: '11088_searchQual288',
                    },
                    {
                      text: 'Amlactin',
                      value: '10189_searchQual289',
                    },
                    {
                      text: 'Ammonium Lactate (topical)',
                      value: '10189_searchQual290',
                    },
                    {
                      text: 'Ampicillin-Sulbactam',
                      value: '9058_searchQual291',
                    },
                    {
                      text: 'Anaphylactic Shock',
                      value: '5207_searchQual292',
                    },
                    {
                      text: 'Anaphylactoid Purpura',
                      value: '4144_searchQual293',
                    },
                    {
                      text: 'Anaphylactoid Reaction',
                      value: '5207_searchQual294',
                    },
                    {
                      text: 'Anemia (Diamond-Blackfan)',
                      value: '4180_searchQual295',
                    },
                    {
                      text: 'Anemia (Macrocytic)',
                      value: '4113_searchQual296',
                    },
                    {
                      text: 'Anemia (Sideroblastic Acquired - Nutritional Imbalance)',
                      value: '13084_searchQual297',
                    },
                    {
                      text: 'Anemia (Sideroblastic Acquired - Toxin Exposure)',
                      value: '13087_searchQual298',
                    },
                    {
                      text: 'Anemia (Sideroblastic Acquired - Underlying Disease)',
                      value: '13090_searchQual299',
                    },
                    {
                      text: 'Anemia (Sideroblastic Acquired)',
                      value: '13003_searchQual300',
                    },
                    {
                      text: 'Angiotensin Converting Enzyme (ACE) Levels',
                      value: '2338_searchQual301',
                    },
                    {
                      text: 'Ankle Fracture',
                      value: '8098_searchQual302',
                    },
                    {
                      text: 'Ankle Joint Fracture',
                      value: '8098_searchQual303',
                    },
                    {
                      text: 'Ankle Replacement',
                      value: '4444_searchQual304',
                    },
                    {
                      text: 'Ankle-Brachial Index Test',
                      value: '8287_searchQual305',
                    },
                    {
                      text: 'Ankylosis (Back)',
                      value: '101798_searchQual306',
                    },
                    {
                      text: 'Antacids',
                      value: '2936_searchQual307',
                    },
                    {
                      text: 'Anterior Cruciate Ligament Ache',
                      value: '7492_searchQual308',
                    },
                    {
                      text: 'Anthracosis',
                      value: '5209_searchQual309',
                    },
                    {
                      text: 'Anthrax Vaccine Adsorbed',
                      value: '3198_searchQual310',
                    },
                    {
                      text: 'Anthrax vaccine',
                      value: '3198_searchQual311',
                    },
                    {
                      text: 'Anti-Bacterial',
                      value: '2941_searchQual312',
                    },
                    {
                      text: 'Anti-Deoxyribonucleic Acid Antibodies Serology',
                      value: '2345_searchQual313',
                    },
                    {
                      text: 'Anti-Hemolytic Factor',
                      value: '2954_searchQual314',
                    },
                    {
                      text: 'Anti-Hemolytic Factors',
                      value: '2954_searchQual315',
                    },
                    {
                      text: 'Antihemophilic Factor A Levels',
                      value: '2550_searchQual316',
                    },
                    {
                      text: 'Antihemophilic Factor B Levels',
                      value: '2547_searchQual317',
                    },
                    {
                      text: 'Antithrombin Deficiency (Acquired) Disorder',
                      value: '4121_searchQual318',
                    },
                    {
                      text: 'Anxiety Attack',
                      value: '5111_searchQual319',
                    },
                    {
                      text: 'Aortic Valve Replacement',
                      value: '8902_searchQual320',
                    },
                    {
                      text: 'Aortoiliac Occlusive Disease',
                      value: '3233_searchQual321',
                    },
                    {
                      text: 'Apraclonidine HCl',
                      value: '12202_searchQual322',
                    },
                    {
                      text: 'Arachnitis',
                      value: '4563_searchQual323',
                    },
                    {
                      text: 'Arachnodactyly',
                      value: '4385_searchQual324',
                    },
                    {
                      text: 'Arachnoid Cyst',
                      value: '4564_searchQual325',
                    },
                    {
                      text: 'Arachnoiditis',
                      value: '14188_searchQual326',
                    },
                    {
                      text: 'Arachnoiditis (Other)',
                      value: '14188_searchQual327',
                    },
                    {
                      text: 'Arachnoiditis (Spinal)',
                      value: '14432_searchQual328',
                    },
                    {
                      text: 'Arm Ache',
                      value: '7504_searchQual329',
                    },
                    {
                      text: 'Arm Bone Fracture Repair',
                      value: '101603_searchQual330',
                    },
                    {
                      text: 'Arm Displacement',
                      value: '8104_searchQual331',
                    },
                    {
                      text: 'Arm Fracture',
                      value: '8107_searchQual332',
                    },
                    {
                      text: 'Arthralgia (Sacro Iliac)',
                      value: '4387_searchQual333',
                    },
                    {
                      text: 'Arthritis (Bacterial)',
                      value: '4389_searchQual334',
                    },
                    {
                      text: 'Arthritis (Reactive)',
                      value: '4394_searchQual335',
                    },
                    {
                      text: 'Artificial Implanted Cardiac Defibrillator',
                      value: '3027_searchQual336',
                    },
                    {
                      text: 'Asacol',
                      value: '10458_searchQual337',
                    },
                    {
                      text: 'Asacol (Oral)',
                      value: '11599_searchQual338',
                    },
                    {
                      text: 'Asacol (Rectal)',
                      value: '11602_searchQual339',
                    },
                    {
                      text: 'Ascorbic Acid',
                      value: '13789_searchQual340',
                    },
                    {
                      text: 'Ascorbic Acid Deficiency',
                      value: '7510_searchQual341',
                    },
                    {
                      text: 'Asthma Attack',
                      value: '5214_searchQual342',
                    },
                    {
                      text: 'Atacand',
                      value: '10692_searchQual343',
                    },
                    {
                      text: 'Atacand HCT',
                      value: '10695_searchQual344',
                    },
                    {
                      text: 'Atelectasis (Acute)',
                      value: '5215_searchQual345',
                    },
                    {
                      text: 'Atopic Cataract',
                      value: '12412_searchQual346',
                    },
                    {
                      text: 'Atracurium',
                      value: '12199_searchQual347',
                    },
                    {
                      text: 'Atracurium Besylate',
                      value: '12199_searchQual348',
                    },
                    {
                      text: 'Atrial Tachycardia',
                      value: '3456_searchQual349',
                    },
                    {
                      text: 'Atrioventricular nodal reentry tachycardia',
                      value: '3469_searchQual350',
                    },
                    {
                      text: 'Attention Deficit Hyperactivity Disorder',
                      value: '5113_searchQual351',
                    },
                    {
                      text: 'Auto Accident',
                      value: '100260_searchQual352',
                    },
                    {
                      text: 'Automobile Accident',
                      value: '100260_searchQual353',
                    },
                    {
                      text: 'Axonics Sacral Neuromodulation',
                      value: '102073_searchQual354',
                    },
                    {
                      text: 'Azacitidine',
                      value: '13697_searchQual355',
                    },
                    {
                      text: 'Azmacort',
                      value: '11517_searchQual356',
                    },
                    {
                      text: 'BAO (Basal Acid Output) Levels',
                      value: '2381_searchQual357',
                    },
                    {
                      text: 'BIH (Benign Intracranial Hypertension)',
                      value: '4577_searchQual358',
                    },
                    {
                      text: 'BN (Brachial Neuritis)',
                      value: '4579_searchQual359',
                    },
                    {
                      text: 'Bacillary Angiomatosis',
                      value: '4245_searchQual360',
                    },
                    {
                      text: 'Bacillary Colitis',
                      value: '4316_searchQual361',
                    },
                    {
                      text: 'Bacillary Dysentery',
                      value: '4316_searchQual362',
                    },
                    {
                      text: 'Bacillary Epithelioid Angiomatosis',
                      value: '4245_searchQual363',
                    },
                    {
                      text: 'Bacitracin (Ophthalmic)',
                      value: '12202_searchQual364',
                    },
                    {
                      text: 'Bacitracin-Neomycin-Polymyxin B-Hydrocortisone',
                      value: '12202_searchQual365',
                    },
                    {
                      text: 'Bacitracin-Polymyxin B',
                      value: '12202_searchQual366',
                    },
                    {
                      text: 'Back Ache',
                      value: '7516_searchQual367',
                    },
                    {
                      text: 'Back Adjustment',
                      value: '3007_searchQual368',
                    },
                    {
                      text: 'Back Alignment',
                      value: '3007_searchQual369',
                    },
                    {
                      text: 'Back Ankylosis',
                      value: '101798_searchQual370',
                    },
                    {
                      text: 'Back Damage',
                      value: '7966_searchQual371',
                    },
                    {
                      text: 'Back Dislocation',
                      value: '8113_searchQual372',
                    },
                    {
                      text: 'Back Disorder',
                      value: '7513_searchQual373',
                    },
                    {
                      text: 'Back Fracture',
                      value: '8116_searchQual374',
                    },
                    {
                      text: 'Back Impairment',
                      value: '9556_searchQual375',
                    },
                    {
                      text: 'Back Infection',
                      value: '9847_searchQual376',
                    },
                    {
                      text: 'Back Inflammation',
                      value: '7519_searchQual377',
                    },
                    {
                      text: 'Back Injury',
                      value: '8737_searchQual378',
                    },
                    {
                      text: 'Back Luxation',
                      value: '8113_searchQual379',
                    },
                    {
                      text: 'Back Muscle Myalgia',
                      value: '101872_searchQual380',
                    },
                    {
                      text: 'Back Muscle Strain',
                      value: '8119_searchQual381',
                    },
                    {
                      text: 'Back Muscle Tension',
                      value: '8119_searchQual382',
                    },
                    {
                      text: 'Back Pain',
                      value: '7516_searchQual383',
                    },
                    {
                      text: 'Back Preventative Maintenance',
                      value: '3007_searchQual384',
                    },
                    {
                      text: 'Back Problem',
                      value: '9556_searchQual385',
                    },
                    {
                      text: 'Back Spasm',
                      value: '14461_searchQual386',
                    },
                    {
                      text: 'Back Sprain',
                      value: '8119_searchQual387',
                    },
                    {
                      text: 'Back Strain',
                      value: '8119_searchQual388',
                    },
                    {
                      text: 'Back Subluxation',
                      value: '8113_searchQual389',
                    },
                    {
                      text: 'Back Swelling',
                      value: '7519_searchQual390',
                    },
                    {
                      text: 'Back Tension',
                      value: '8119_searchQual391',
                    },
                    {
                      text: 'Back X-Ray',
                      value: '2902_searchQual392',
                    },
                    {
                      text: 'Back pain due to pregnancy',
                      value: '101875_searchQual393',
                    },
                    {
                      text: 'Back surgery',
                      value: '5919_searchQual394',
                    },
                    {
                      text: 'Backache',
                      value: '12352_searchQual395',
                    },
                    {
                      text: 'Baclofen',
                      value: '12193_searchQual396',
                    },
                    {
                      text: 'Bacteremia',
                      value: '100217_searchQual397',
                    },
                    {
                      text: 'Bacteremic Shock',
                      value: '4313_searchQual398',
                    },
                    {
                      text: 'Bacterial Arthritis',
                      value: '4389_searchQual399',
                    },
                    {
                      text: 'Bacterial Conjunctivitis',
                      value: '3642_searchQual400',
                    },
                    {
                      text: 'Bacterial Endocarditis',
                      value: '3273_searchQual401',
                    },
                    {
                      text: 'Bacterial Infection',
                      value: '9643_searchQual402',
                    },
                    {
                      text: 'Bacterial Keratitis',
                      value: '9760_searchQual403',
                    },
                    {
                      text: 'Bacterial Pneumonia',
                      value: '14283_searchQual404',
                    },
                    {
                      text: 'Bacterial Vaginosis Tests',
                      value: '2877_searchQual405',
                    },
                    {
                      text: 'Bacteriuria',
                      value: '3958_searchQual406',
                    },
                    {
                      text: 'Bactocill in dextrose',
                      value: '9058_searchQual407',
                    },
                    {
                      text: 'Bactrim',
                      value: '2969_searchQual408',
                    },
                    {
                      text: 'Bactroban (topical)',
                      value: '2969_searchQual409',
                    },
                    {
                      text: 'Bactroban Cream',
                      value: '2969_searchQual410',
                    },
                    {
                      text: 'Bactroban Nasal',
                      value: '12196_searchQual411',
                    },
                    {
                      text: 'Bactroban Ointment',
                      value: '2969_searchQual412',
                    },
                    {
                      text: 'Band-Like Opacity',
                      value: '100472_searchQual413',
                    },
                    {
                      text: 'Baraclude',
                      value: '13715_searchQual414',
                    },
                    {
                      text: 'Basal Acid Output (BAO) Levels',
                      value: '2381_searchQual415',
                    },
                    {
                      text: 'Belatacept',
                      value: '102068_searchQual416',
                    },
                    {
                      text: 'Benign Intracranial Hypertension',
                      value: '4577_searchQual417',
                    },
                    {
                      text: 'Benzocaine- tannic acid-menthol-cetylpyridium',
                      value: '12121_searchQual418',
                    },
                    {
                      text: 'Besifloxacin HCl',
                      value: '12202_searchQual419',
                    },
                    {
                      text: 'Beta-hydroxybutyric Acid Levels',
                      value: '2644_searchQual420',
                    },
                    {
                      text: 'Betapace',
                      value: '13765_searchQual421',
                    },
                    {
                      text: 'Bevacizumab',
                      value: '13699_searchQual422',
                    },
                    {
                      text: 'BiPap Machine',
                      value: '3019_searchQual423',
                    },
                    {
                      text: 'Bilateral Acoustic Neurofibromatosis',
                      value: '7834_searchQual424',
                    },
                    {
                      text: 'Bile Acid Sequestrants',
                      value: '2986_searchQual425',
                    },
                    {
                      text: 'Bisacodyl',
                      value: '3093_searchQual426',
                    },
                    {
                      text: 'Bisacodyl-PEG-KCl-NaBicar-NaCl',
                      value: '3093_searchQual427',
                    },
                    {
                      text: 'Biventricular Pacemaker',
                      value: '101691_searchQual428',
                    },
                    {
                      text: 'Black Fever',
                      value: '4278_searchQual429',
                    },
                    {
                      text: 'Black Light Test',
                      value: '2901_searchQual430',
                    },
                    {
                      text: 'Black Lung Disease',
                      value: '5269_searchQual431',
                    },
                    {
                      text: 'Black Measles',
                      value: '4305_searchQual432',
                    },
                    {
                      text: 'Black Outs',
                      value: '4647_searchQual433',
                    },
                    {
                      text: 'Black Tarry Feces',
                      value: '3911_searchQual434',
                    },
                    {
                      text: 'Black Tarry Stool',
                      value: '3911_searchQual435',
                    },
                    {
                      text: 'Blackfan–Diamond Anemia',
                      value: '4180_searchQual436',
                    },
                    {
                      text: 'Blackheads',
                      value: '3345_searchQual437',
                    },
                    {
                      text: 'Blackout',
                      value: '4647_searchQual438',
                    },
                    {
                      text: 'Blackwater Fever',
                      value: '4286_searchQual439',
                    },
                    {
                      text: 'Bloating of the Stomach',
                      value: '7438_searchQual440',
                    },
                    {
                      text: 'Blocked Nasolacrimal Duct',
                      value: '3646_searchQual441',
                    },
                    {
                      text: 'Blood Clotting Test for Factor I Levels',
                      value: '2545_searchQual442',
                    },
                    {
                      text: 'Blood Clotting Test for Factor II Levels',
                      value: '2546_searchQual443',
                    },
                    {
                      text: 'Blood Clotting Test for Factor IX Levels',
                      value: '2547_searchQual444',
                    },
                    {
                      text: 'Blood Clotting Test for Factor V Levels',
                      value: '2548_searchQual445',
                    },
                    {
                      text: 'Blood Clotting Test for Factor VII Levels',
                      value: '2549_searchQual446',
                    },
                    {
                      text: 'Blood Clotting Test for Factor VIII Levels',
                      value: '2550_searchQual447',
                    },
                    {
                      text: 'Blood Clotting Test for Factor X Levels',
                      value: '2551_searchQual448',
                    },
                    {
                      text: 'Blood Clotting Test for Factor XI Levels',
                      value: '2552_searchQual449',
                    },
                    {
                      text: 'Blood Clotting Test for Factor XII Levels',
                      value: '2553_searchQual450',
                    },
                    {
                      text: 'Blood Clotting Test for Factor XIII',
                      value: '2554_searchQual451',
                    },
                    {
                      text: 'Blood Uric Acid Level',
                      value: '2870_searchQual452',
                    },
                    {
                      text: 'Bone Ache',
                      value: '7552_searchQual453',
                    },
                    {
                      text: 'Bone Fracture',
                      value: '9850_searchQual454',
                    },
                    {
                      text: 'Bone Fracture (Ankle)',
                      value: '8098_searchQual455',
                    },
                    {
                      text: 'Bone Fracture (Finger)',
                      value: '8149_searchQual456',
                    },
                    {
                      text: 'Bone Fracture (Forearm)',
                      value: '100784_searchQual457',
                    },
                    {
                      text: 'Bone Fracture Repair',
                      value: '101676_searchQual458',
                    },
                    {
                      text: 'Bone Fracture Repair (Arm)',
                      value: '101603_searchQual459',
                    },
                    {
                      text: 'Bone Fracture Repair (Clavicle)',
                      value: '101604_searchQual460',
                    },
                    {
                      text: 'Bone Fracture Repair (Elbow)',
                      value: '101673_searchQual461',
                    },
                    {
                      text: 'Bone Fracture Repair (Eye Socket)',
                      value: '101607_searchQual462',
                    },
                    {
                      text: 'Bone Fracture Repair (Finger)',
                      value: '101608_searchQual463',
                    },
                    {
                      text: 'Bone Fracture Repair (Foot)',
                      value: '101609_searchQual464',
                    },
                    {
                      text: 'Bone Fracture Repair (Hand)',
                      value: '101612_searchQual465',
                    },
                    {
                      text: 'Bone Fracture Repair (Hip)',
                      value: '101613_searchQual466',
                    },
                    {
                      text: 'Bone Fracture Repair (Knee)',
                      value: '101236_searchQual467',
                    },
                    {
                      text: 'Bone Fracture Repair (Mandible)',
                      value: '101616_searchQual468',
                    },
                    {
                      text: 'Bone Fracture Repair (Shoulder)',
                      value: '101619_searchQual469',
                    },
                    {
                      text: 'Bone Fracture Repair (Spine)',
                      value: '101675_searchQual470',
                    },
                    {
                      text: 'Bone Fracture Repair (Toe)',
                      value: '101621_searchQual471',
                    },
                    {
                      text: 'Bone Fracture Repair (Wrist)',
                      value: '101669_searchQual472',
                    },
                    {
                      text: 'Brace',
                      value: '3172_searchQual473',
                    },
                    {
                      text: 'Brachial Artery Cannulation',
                      value: '13980_searchQual474',
                    },
                    {
                      text: 'Brachial Neuritis',
                      value: '4579_searchQual475',
                    },
                    {
                      text: 'Brachial Neuropathy',
                      value: '4579_searchQual476',
                    },
                    {
                      text: 'Brachial Palsy',
                      value: '14433_searchQual477',
                    },
                    {
                      text: 'Brachial Plexus Avulsion',
                      value: '4580_searchQual478',
                    },
                    {
                      text: 'Brachial Plexus Disorder',
                      value: '4580_searchQual479',
                    },
                    {
                      text: 'Brachial Plexus Impairment',
                      value: '4580_searchQual480',
                    },
                    {
                      text: 'Brachial Plexus Injury',
                      value: '4580_searchQual481',
                    },
                    {
                      text: 'Brachial Plexus Neuroma',
                      value: '5039_searchQual482',
                    },
                    {
                      text: 'Brachial Plexus Palsy',
                      value: '14433_searchQual483',
                    },
                    {
                      text: 'Brachial Plexus Rupture',
                      value: '4580_searchQual484',
                    },
                    {
                      text: 'Brachialgia',
                      value: '100341_searchQual485',
                    },
                    {
                      text: 'Brachycephaly',
                      value: '100296_searchQual486',
                    },
                    {
                      text: 'Brachydactyly type E',
                      value: '3501_searchQual487',
                    },
                    {
                      text: 'Brachydactyly-Short Stature-Hypertension Syndrome',
                      value: '3501_searchQual488',
                    },
                    {
                      text: 'Brachytherapy',
                      value: '2989_searchQual489',
                    },
                    {
                      text: 'Bradycardia-Tachycardia Syndrome',
                      value: '3458_searchQual490',
                    },
                    {
                      text: 'Brivaracetam',
                      value: '100318_searchQual491',
                    },
                    {
                      text: 'Briviact',
                      value: '100318_searchQual492',
                    },
                    {
                      text: 'Broken Back',
                      value: '8116_searchQual493',
                    },
                    {
                      text: 'Bromfenac Sodium',
                      value: '12202_searchQual494',
                    },
                    {
                      text: 'Brugada Syndrome Type II (Saddleback)',
                      value: '100528_searchQual495',
                    },
                    {
                      text: 'C Difficile Bacteria',
                      value: '4226_searchQual496',
                    },
                    {
                      text: 'C-Reactive Protein (CRP)',
                      value: '2414_searchQual497',
                    },
                    {
                      text: 'C-Reactive Protein Levels',
                      value: '2414_searchQual498',
                    },
                    {
                      text: 'C1 Esterase Inhibiting Factor Levels',
                      value: '2415_searchQual499',
                    },
                    {
                      text: 'C1 Inhibiting Factor Levels',
                      value: '2415_searchQual500',
                    },
                    {
                      text: 'C1-INH (C1 Esterase Inhibiting Factor) Levels',
                      value: '2415_searchQual501',
                    },
                    {
                      text: 'CAT Scan, Head and Face',
                      value: '8536_searchQual502',
                    },
                    {
                      text: 'CC (Closing Capacity Test)',
                      value: '2456_searchQual503',
                    },
                    {
                      text: 'CJD (Creutzfeldt-Jacob Disease)',
                      value: '4611_searchQual504',
                    },
                    {
                      text: 'CLO (Campylobacter-like organism) Serology',
                      value: '2608_searchQual505',
                    },
                    {
                      text: 'CP (Chondromalacia patellae)',
                      value: '4404_searchQual506',
                    },
                    {
                      text: 'CPAP Machine',
                      value: '3019_searchQual507',
                    },
                    {
                      text: 'CRP (C-Reactive Protein) Levels',
                      value: '2414_searchQual508',
                    },
                    {
                      text: 'CST (Contraction Stress Test)',
                      value: '2564_searchQual509',
                    },
                    {
                      text: 'CT (Computed Tomography), Head and Face',
                      value: '8536_searchQual510',
                    },
                    {
                      text: 'CVA (Cerebrovascular Accident)',
                      value: '4597_searchQual511',
                    },
                    {
                      text: 'Cacchi Ricci Disease',
                      value: '4014_searchQual512',
                    },
                    {
                      text: 'Calcaneus Fracture',
                      value: '8167_searchQual513',
                    },
                    {
                      text: 'Calcium Acetate',
                      value: '13703_searchQual514',
                    },
                    {
                      text: 'Campylobacter Infection',
                      value: '4218_searchQual515',
                    },
                    {
                      text: 'Campylobacter Serology',
                      value: '2420_searchQual516',
                    },
                    {
                      text: 'Campylobacteriosis',
                      value: '4218_searchQual517',
                    },
                    {
                      text: 'Cancer (Placenta Site Trophoblastic)',
                      value: '4888_searchQual518',
                    },
                    {
                      text: 'Cancer (Placenta)',
                      value: '14249_searchQual519',
                    },
                    {
                      text: 'Cancer (Stomach)',
                      value: '4898_searchQual520',
                    },
                    {
                      text: 'Cancer (Yolk Sac)',
                      value: '4915_searchQual521',
                    },
                    {
                      text: 'Car Accident',
                      value: '100260_searchQual522',
                    },
                    {
                      text: 'Carbachol',
                      value: '12202_searchQual523',
                    },
                    {
                      text: 'Carbonyl Iron/Ascorbic Acid',
                      value: '5635_searchQual524',
                    },
                    {
                      text: 'Cardiac (Heart) Block',
                      value: '3457_searchQual525',
                    },
                    {
                      text: 'Cardiac Ablation',
                      value: '13153_searchQual526',
                    },
                    {
                      text: 'Cardiac Arrest',
                      value: '3460_searchQual527',
                    },
                    {
                      text: 'Cardiac Arrhythmia',
                      value: '3452_searchQual528',
                    },
                    {
                      text: 'Cardiac Ascites',
                      value: '3248_searchQual529',
                    },
                    {
                      text: 'Cardiac Asthma',
                      value: '3248_searchQual530',
                    },
                    {
                      text: 'Cardiac Blood Pool Scan',
                      value: '2717_searchQual531',
                    },
                    {
                      text: 'Cardiac Blood Pooling Imaging',
                      value: '2717_searchQual532',
                    },
                    {
                      text: 'Cardiac CT scoring',
                      value: '8305_searchQual533',
                    },
                    {
                      text: 'Cardiac Calcium Scoring',
                      value: '8305_searchQual534',
                    },
                    {
                      text: 'Cardiac Catheterization',
                      value: '2774_searchQual535',
                    },
                    {
                      text: 'Cardiac Catheterization',
                      value: '3015_searchQual536',
                    },
                    {
                      text: 'Cardiac Decompensation',
                      value: '3248_searchQual537',
                    },
                    {
                      text: 'Cardiac Dilatation',
                      value: '3247_searchQual538',
                    },
                    {
                      text: 'Cardiac Dilation',
                      value: '3247_searchQual539',
                    },
                    {
                      text: 'Cardiac Disease',
                      value: '9490_searchQual540',
                    },
                    {
                      text: 'Cardiac Disorder',
                      value: '9490_searchQual541',
                    },
                    {
                      text: 'Cardiac Dyspnea',
                      value: '3248_searchQual542',
                    },
                    {
                      text: 'Cardiac Dysrhythmia',
                      value: '3452_searchQual543',
                    },
                    {
                      text: 'Cardiac Edema',
                      value: '14243_searchQual544',
                    },
                    {
                      text: 'Cardiac Enzyme Studies',
                      value: '13330_searchQual545',
                    },
                    {
                      text: 'Cardiac Enzyme Study',
                      value: '13330_searchQual546',
                    },
                    {
                      text: 'Cardiac Event Monitoring',
                      value: '8308_searchQual547',
                    },
                    {
                      text: 'Cardiac Exercise Test',
                      value: '2539_searchQual548',
                    },
                    {
                      text: 'Cardiac Failure',
                      value: '3248_searchQual549',
                    },
                    {
                      text: 'Cardiac Fibrosis',
                      value: '14228_searchQual550',
                    },
                    {
                      text: 'Cardiac Glycosides',
                      value: '2994_searchQual551',
                    },
                    {
                      text: 'Cardiac Glycosides Levels',
                      value: '2427_searchQual552',
                    },
                    {
                      text: 'Cardiac Hypertrophy',
                      value: '3249_searchQual553',
                    },
                    {
                      text: 'Cardiac Infarction',
                      value: '3298_searchQual554',
                    },
                    {
                      text: 'Cardiac Ischaemia',
                      value: '3299_searchQual555',
                    },
                    {
                      text: 'Cardiac Ischemia',
                      value: '3299_searchQual556',
                    },
                    {
                      text: 'Cardiac Massage',
                      value: '2996_searchQual557',
                    },
                    {
                      text: 'Cardiac Perfusion Scan',
                      value: '8569_searchQual558',
                    },
                    {
                      text: 'Cardiac Resuscitation',
                      value: '2996_searchQual559',
                    },
                    {
                      text: 'Cardiac Resynchronization Device',
                      value: '101691_searchQual560',
                    },
                    {
                      text: 'Cardiac Resynchronization Therapy',
                      value: '101691_searchQual561',
                    },
                    {
                      text: 'Cardiac Stent',
                      value: '8953_searchQual562',
                    },
                    {
                      text: 'Cardiac Stress Test',
                      value: '2539_searchQual563',
                    },
                    {
                      text: 'Cardiac Syndrome X',
                      value: '3250_searchQual564',
                    },
                    {
                      text: 'Cardiac Tamponade',
                      value: '14258_searchQual565',
                    },
                    {
                      text: 'Cardiac Test',
                      value: '2428_searchQual566',
                    },
                    {
                      text: 'Cardiac cath',
                      value: '3015_searchQual567',
                    },
                    {
                      text: 'Cardiovascular and Thoracic Surgeon (visit)',
                      value: '2817_searchQual568',
                    },
                    {
                      text: 'Carglumic Acid',
                      value: '11731_searchQual569',
                    },
                    {
                      text: 'Cascade Stomach',
                      value: '100620_searchQual570',
                    },
                    {
                      text: 'Cataract (Disease Related)',
                      value: '12676_searchQual571',
                    },
                    {
                      text: 'Cefaclor',
                      value: '12127_searchQual572',
                    },
                    {
                      text: 'Celiac Disease',
                      value: '3805_searchQual573',
                    },
                    {
                      text: 'Celiac Sprue',
                      value: '3805_searchQual574',
                    },
                    {
                      text: 'Central Venous Catheter Placement',
                      value: '13989_searchQual575',
                    },
                    {
                      text: 'Centriacinar Emphysema',
                      value: '5237_searchQual576',
                    },
                    {
                      text: 'Cerebrovascular Accident',
                      value: '4597_searchQual577',
                    },
                    {
                      text: 'Cerefolin NAC',
                      value: '100819_searchQual578',
                    },
                    {
                      text: 'CerefolinNAC',
                      value: '100819_searchQual579',
                    },
                    {
                      text: 'Cervical Fracture',
                      value: '10054_searchQual580',
                    },
                    {
                      text: 'Cervical Spinal Fracture',
                      value: '10054_searchQual581',
                    },
                    {
                      text: 'Cervical Spine Fracture',
                      value: '9859_searchQual582',
                    },
                    {
                      text: 'Cervical Vertebral Fracture',
                      value: '10054_searchQual583',
                    },
                    {
                      text: 'Cervico brachial neuralgia',
                      value: '100341_searchQual584',
                    },
                    {
                      text: 'Cervicobrachalgia',
                      value: '100341_searchQual585',
                    },
                    {
                      text: 'Cervicobrachial Neuralgia',
                      value: '100341_searchQual586',
                    },
                    {
                      text: 'Cervicobrachialgia',
                      value: '100341_searchQual587',
                    },
                    {
                      text: 'Cetacort',
                      value: '10422_searchQual588',
                    },
                    {
                      text: 'Cetrorelix Acetate',
                      value: '12157_searchQual589',
                    },
                    {
                      text: 'Character Disorder',
                      value: '5176_searchQual590',
                    },
                    {
                      text: 'Cheekbone Fracture',
                      value: '100939_searchQual591',
                    },
                    {
                      text: 'Cheratussin AC',
                      value: '100106_searchQual592',
                    },
                    {
                      text: 'Child Birth Requiring Vacuum Extraction',
                      value: '14327_searchQual593',
                    },
                    {
                      text: 'Childbirth Requiring Vacuum Extraction',
                      value: '14327_searchQual594',
                    },
                    {
                      text: 'Chiropractic',
                      value: '3007_searchQual595',
                    },
                    {
                      text: 'Chiropractic Adjustment',
                      value: '3007_searchQual596',
                    },
                    {
                      text: 'Chiropractic Treatment',
                      value: '3007_searchQual597',
                    },
                    {
                      text: 'Chiropractor Treatment',
                      value: '3007_searchQual598',
                    },
                    {
                      text: 'Chloasma faciei',
                      value: '3354_searchQual599',
                    },
                    {
                      text: 'Chondromalacia patellae',
                      value: '4404_searchQual600',
                    },
                    {
                      text: 'Christmas Factor Assay',
                      value: '2547_searchQual601',
                    },
                    {
                      text: 'Chronic Active TB (Tuberculosis)',
                      value: '5298_searchQual602',
                    },
                    {
                      text: 'Chronic Active Tuberculosis',
                      value: '5298_searchQual603',
                    },
                    {
                      text: 'Chronic Bacterial Prostatitis',
                      value: '12580_searchQual604',
                    },
                    {
                      text: 'Chronic Headache',
                      value: '4656_searchQual605',
                    },
                    {
                      text: 'Chronic Inactive TB (Tuberculosis)',
                      value: '5298_searchQual606',
                    },
                    {
                      text: 'Chronic Inactive Tuberculosis',
                      value: '5298_searchQual607',
                    },
                    {
                      text: 'Cinacalcet',
                      value: '100366_searchQual608',
                    },
                    {
                      text: 'Ciprofloxacin',
                      value: '12163_searchQual609',
                    },
                    {
                      text: 'Ciprofloxacin HCl',
                      value: '12202_searchQual610',
                    },
                    {
                      text: 'Ciprofloxacin-Ciproflox HCl ER',
                      value: '12163_searchQual611',
                    },
                    {
                      text: 'Cirrhosis (Macronodular)',
                      value: '3815_searchQual612',
                    },
                    {
                      text: 'Cisatracurium Besylate',
                      value: '12199_searchQual613',
                    },
                    {
                      text: 'Citracal',
                      value: '3030_searchQual614',
                    },
                    {
                      text: 'Citric Acid Levels',
                      value: '2455_searchQual615',
                    },
                    {
                      text: 'Citric Acid Levels (Urine)',
                      value: '2455_searchQual616',
                    },
                    {
                      text: 'Citric Acid-Sodium Citrate',
                      value: '12169_searchQual617',
                    },
                    {
                      text: 'Clavicle Bone Fracture Repair',
                      value: '101604_searchQual618',
                    },
                    {
                      text: 'Clavicle Fracture',
                      value: '8512_searchQual619',
                    },
                    {
                      text: 'Climacteric',
                      value: '4015_searchQual620',
                    },
                    {
                      text: 'Closing Capacity Test',
                      value: '2456_searchQual621',
                    },
                    {
                      text: 'Clot Retraction',
                      value: '2457_searchQual622',
                    },
                    {
                      text: 'Cluster Headaches',
                      value: '4657_searchQual623',
                    },
                    {
                      text: 'Coccyx Fracture',
                      value: '9898_searchQual624',
                    },
                    {
                      text: 'Coeliac Disease',
                      value: '3805_searchQual625',
                    },
                    {
                      text: 'Coeliac Sprue',
                      value: '3805_searchQual626',
                    },
                    {
                      text: 'Colace',
                      value: '3093_searchQual627',
                    },
                    {
                      text: 'Colitis (Bacillary)',
                      value: '4316_searchQual628',
                    },
                    {
                      text: 'Collarbone Displacement',
                      value: '11554_searchQual629',
                    },
                    {
                      text: 'Comet-Tail Artifact',
                      value: '100569_searchQual630',
                    },
                    {
                      text: 'Community Acquired Pneumonia',
                      value: '5270_searchQual631',
                    },
                    {
                      text: 'Computed Tomography (CT) Scan of the Head and Face',
                      value: '8536_searchQual632',
                    },
                    {
                      text: 'Condyloma Acuminatum',
                      value: '4230_searchQual633',
                    },
                    {
                      text: 'Congenital Aganglionic Megacolon',
                      value: '3887_searchQual634',
                    },
                    {
                      text: 'Congenital Cataract',
                      value: '12583_searchQual635',
                    },
                    {
                      text: 'Congenital Megacolon',
                      value: '3887_searchQual636',
                    },
                    {
                      text: 'Congestive Cardiac Failure',
                      value: '3248_searchQual637',
                    },
                    {
                      text: 'Contact Asthma',
                      value: '5214_searchQual638',
                    },
                    {
                      text: 'Contact Dermatitis',
                      value: '100867_searchQual639',
                    },
                    {
                      text: 'Contact Lenses',
                      value: '3012_searchQual640',
                    },
                    {
                      text: 'Contacts',
                      value: '3012_searchQual641',
                    },
                    {
                      text: 'Contraception',
                      value: '3013_searchQual642',
                    },
                    {
                      text: 'Contraceptive Device (Female)',
                      value: '12139_searchQual643',
                    },
                    {
                      text: 'Contraceptive Device (Male)',
                      value: '12139_searchQual644',
                    },
                    {
                      text: 'Contraceptive Sponge',
                      value: '12139_searchQual645',
                    },
                    {
                      text: 'Contraceptives',
                      value: '12139_searchQual646',
                    },
                    {
                      text: 'Contraction Stress Test (CST)',
                      value: '2564_searchQual647',
                    },
                    {
                      text: 'Corneal Laceration',
                      value: '9754_searchQual648',
                    },
                    {
                      text: 'Corneal Opacity',
                      value: '9757_searchQual649',
                    },
                    {
                      text: 'Costal Joint Fracture',
                      value: '8494_searchQual650',
                    },
                    {
                      text: 'Coughing Attack',
                      value: '5230_searchQual651',
                    },
                    {
                      text: 'Cruciate Ligament Ache',
                      value: '7597_searchQual652',
                    },
                    {
                      text: 'Cutaneous Lupus Erythematosus (Acute)',
                      value: '4459_searchQual653',
                    },
                    {
                      text: 'Cutireaction Allergy Test',
                      value: '2320_searchQual654',
                    },
                    {
                      text: 'Cyst (Sebaceous)',
                      value: '7927_searchQual655',
                    },
                    {
                      text: 'Cyst Removal (Sebaceous)',
                      value: '101224_searchQual656',
                    },
                    {
                      text: 'Cystic Acne',
                      value: '3335_searchQual657',
                    },
                    {
                      text: 'DBA (Diamond-Blackfan Anemia)',
                      value: '4180_searchQual658',
                    },
                    {
                      text: 'DTaP-IPV Vaccine',
                      value: '12220_searchQual659',
                    },
                    {
                      text: 'DTaP-IPV-Hib Vaccine',
                      value: '12220_searchQual660',
                    },
                    {
                      text: 'DaCosta\'s Syndrome',
                      value: '14208_searchQual661',
                    },
                    {
                      text: 'DaCosta’s Syndrome',
                      value: '14208_searchQual662',
                    },
                    {
                      text: 'Dacarbazine',
                      value: '13709_searchQual663',
                    },
                    {
                      text: 'Dacryocystitis',
                      value: '14495_searchQual664',
                    },
                    {
                      text: 'Dacryostenosis',
                      value: '3646_searchQual665',
                    },
                    {
                      text: 'Dactylitis',
                      value: '4417_searchQual666',
                    },
                    {
                      text: 'Darifenacin',
                      value: '12232_searchQual667',
                    },
                    {
                      text: 'DeSanctis–Cacchione Syndrome',
                      value: '3451_searchQual668',
                    },
                    {
                      text: 'Decavac',
                      value: '12220_searchQual669',
                    },
                    {
                      text: 'Dectancyl (Dexaméthasone acétate)',
                      value: '102009_searchQual670',
                    },
                    {
                      text: 'Delta ALA (Aminolevulinic Acid) Levels',
                      value: '2491_searchQual671',
                    },
                    {
                      text: 'Delta Aminoevulinic Acid Levels (Urine)',
                      value: '2491_searchQual672',
                    },
                    {
                      text: 'Delta Aminolevulinic Acid Levels',
                      value: '2491_searchQual673',
                    },
                    {
                      text: 'Dental Bleaching',
                      value: '2493_searchQual674',
                    },
                    {
                      text: 'Dental Braces',
                      value: '3028_searchQual675',
                    },
                    {
                      text: 'Dental Extraction',
                      value: '3028_searchQual676',
                    },
                    {
                      text: 'Dental Impaction',
                      value: '3649_searchQual677',
                    },
                    {
                      text: 'Deoxyursocholic Acid',
                      value: '13878_searchQual678',
                    },
                    {
                      text: 'Depacon',
                      value: '11166_searchQual679',
                    },
                    {
                      text: 'Depo-Provera Contraceptive',
                      value: '12139_searchQual680',
                    },
                    {
                      text: 'Depo-SubQ Provera Contraceptive',
                      value: '12139_searchQual681',
                    },
                    {
                      text: 'Dermatitis (Contact)',
                      value: '100867_searchQual682',
                    },
                    {
                      text: 'Dermatitis (Photocontact)',
                      value: '14282_searchQual683',
                    },
                    {
                      text: 'Dermatomycosis furfuracea',
                      value: '3440_searchQual684',
                    },
                    {
                      text: 'Desmopressin Acetate',
                      value: '100089_searchQual685',
                    },
                    {
                      text: 'Detached Retina',
                      value: '3741_searchQual686',
                    },
                    {
                      text: 'Diabetic Cataract',
                      value: '12415_searchQual687',
                    },
                    {
                      text: 'Diabetic Ketoacidosis (DKA)',
                      value: '12265_searchQual688',
                    },
                    {
                      text: 'Diabetic Maculopathy',
                      value: '100655_searchQual689',
                    },
                    {
                      text: 'Diamond-Blackfan Anemia',
                      value: '4180_searchQual690',
                    },
                    {
                      text: 'Diaphragm (Contraceptive)',
                      value: '12139_searchQual691',
                    },
                    {
                      text: 'Diclofenac',
                      value: '10446_searchQual692',
                    },
                    {
                      text: 'Diclofenac and Misoprostol',
                      value: '11472_searchQual693',
                    },
                    {
                      text: 'Dicloxacillin',
                      value: '9058_searchQual694',
                    },
                    {
                      text: 'Diffusing Capacity',
                      value: '2672_searchQual695',
                    },
                    {
                      text: 'Dilacor',
                      value: '10881_searchQual696',
                    },
                    {
                      text: 'Dilatation of Stomach',
                      value: '100552_searchQual697',
                    },
                    {
                      text: 'Diltzac',
                      value: '10881_searchQual698',
                    },
                    {
                      text: 'Diphenhydramine-Hydrocortisone-Nystatin- tetracycline',
                      value: '12148_searchQual699',
                    },
                    {
                      text: 'Diphtheria vaccine',
                      value: '12220_searchQual700',
                    },
                    {
                      text: 'Diphtheria-Acellular Pertussis-Tetanus vaccine',
                      value: '12220_searchQual701',
                    },
                    {
                      text: 'Disaccharidase Deficiency',
                      value: '3568_searchQual702',
                    },
                    {
                      text: 'Dislocated Back',
                      value: '8113_searchQual703',
                    },
                    {
                      text: 'Disorder of the Trachea',
                      value: '14305_searchQual704',
                    },
                    {
                      text: 'Displaced Ankle',
                      value: '8101_searchQual705',
                    },
                    {
                      text: 'Displacement of the Capital Epiphysis of the Femur',
                      value: '14441_searchQual706',
                    },
                    {
                      text: 'Drug Induced Headache',
                      value: '100740_searchQual707',
                    },
                    {
                      text: 'Duetact',
                      value: '11265_searchQual708',
                    },
                    {
                      text: 'Dupuytren\'s Contracture',
                      value: '4419_searchQual709',
                    },
                    {
                      text: 'Duraclon',
                      value: '10710_searchQual710',
                    },
                    {
                      text: 'DynaCirc',
                      value: '10758_searchQual711',
                    },
                    {
                      text: 'Dynabac D5-Pak',
                      value: '12178_searchQual712',
                    },
                    {
                      text: 'EBCT (for cardiac calcium)',
                      value: '8305_searchQual713',
                    },
                    {
                      text: 'EPS (Electrophysiology Study) Intracardiac',
                      value: '2640_searchQual714',
                    },
                    {
                      text: 'ERT (Estrogen Replacement Therapy)',
                      value: '3070_searchQual715',
                    },
                    {
                      text: 'Ear Vacuum',
                      value: '3036_searchQual716',
                    },
                    {
                      text: 'Earache',
                      value: '3657_searchQual717',
                    },
                    {
                      text: 'Ejection Fraction Study',
                      value: '2717_searchQual718',
                    },
                    {
                      text: 'Elbow Ache',
                      value: '7642_searchQual719',
                    },
                    {
                      text: 'Elbow Bone Fracture Repair',
                      value: '101673_searchQual720',
                    },
                    {
                      text: 'Elbow Fracture',
                      value: '8143_searchQual721',
                    },
                    {
                      text: 'Elbow Joint Fracture',
                      value: '8143_searchQual722',
                    },
                    {
                      text: 'Elbow Replacement',
                      value: '4444_searchQual723',
                    },
                    {
                      text: 'Electron Beam Computerized Tomography (for cardiac calcium)',
                      value: '8305_searchQual724',
                    },
                    {
                      text: 'Emphysematous Opacity',
                      value: '100455_searchQual725',
                    },
                    {
                      text: 'Encepahlitis vaccine',
                      value: '3198_searchQual726',
                    },
                    {
                      text: 'Encephalomalacia',
                      value: '14190_searchQual727',
                    },
                    {
                      text: 'Endotracheal Intubation',
                      value: '3048_searchQual728',
                    },
                    {
                      text: 'Enlarged Cardiac Shadow',
                      value: '100466_searchQual729',
                    },
                    {
                      text: 'Entacapone',
                      value: '13885_searchQual730',
                    },
                    {
                      text: 'Epilepsy (Jacksonian)',
                      value: '4635_searchQual731',
                    },
                    {
                      text: 'Episodic Headache',
                      value: '4656_searchQual732',
                    },
                    {
                      text: 'Erythromycin Lactobionate',
                      value: '12178_searchQual733',
                    },
                    {
                      text: 'Eslicarbazapine Acetate',
                      value: '11109_searchQual734',
                    },
                    {
                      text: 'Esophageal Achalasia',
                      value: '3789_searchQual735',
                    },
                    {
                      text: 'Esophageal Acidity Levels',
                      value: '2528_searchQual736',
                    },
                    {
                      text: 'Esophageal Laceration',
                      value: '100292_searchQual737',
                    },
                    {
                      text: 'Esophageal Replacement',
                      value: '14008_searchQual738',
                    },
                    {
                      text: 'Estradiol-Norethindrone Acetate',
                      value: '3070_searchQual739',
                    },
                    {
                      text: 'Estradiol-Norethindrone Acetate Transdermal System',
                      value: '3070_searchQual740',
                    },
                    {
                      text: 'Estrogen Replacement',
                      value: '3070_searchQual741',
                    },
                    {
                      text: 'Estrogen Replacement Therapy',
                      value: '3070_searchQual742',
                    },
                    {
                      text: 'Ethacrynic Acid',
                      value: '13865_searchQual743',
                    },
                    {
                      text: 'Ethynodiol Diacetate-Ethinyl Estradiol',
                      value: '12139_searchQual744',
                    },
                    {
                      text: 'Etodolac',
                      value: '100108_searchQual745',
                    },
                    {
                      text: 'Eustachian Tube Disorder',
                      value: '100228_searchQual746',
                    },
                    {
                      text: 'Eustachian Tube Stenosis',
                      value: '100228_searchQual747',
                    },
                    {
                      text: 'Evoxac',
                      value: '12130_searchQual748',
                    },
                    {
                      text: 'Excimer laser photorefractive keratectomy (PRK) for nearsightedness',
                      value: '8881_searchQual749',
                    },
                    {
                      text: 'Excimer laser photorefractive keratectomy for farsightedness (H-PRK)',
                      value: '8884_searchQual750',
                    },
                    {
                      text: 'Exercise Cardiac Stress Test',
                      value: '2539_searchQual751',
                    },
                    {
                      text: 'Exradioisotope Scan (Cardiac)',
                      value: '2838_searchQual752',
                    },
                    {
                      text: 'Extracorporeal shock wave lithotripsy',
                      value: '3097_searchQual753',
                    },
                    {
                      text: 'Extractable Nuclear Antigen Antibodies Serology',
                      value: '2542_searchQual754',
                    },
                    {
                      text: 'Eye Lens Displacement',
                      value: '3658_searchQual755',
                    },
                    {
                      text: 'Eye Socket Bone Fracture Repair',
                      value: '101607_searchQual756',
                    },
                    {
                      text: 'Eye Socket Fracture',
                      value: '8503_searchQual757',
                    },
                    {
                      text: 'Eye Test (Refraction)',
                      value: '2788_searchQual758',
                    },
                    {
                      text: 'Eye Test - Acuity',
                      value: '2886_searchQual759',
                    },
                    {
                      text: 'FENa (Fractional Excretion Of Sodium) Levels',
                      value: '2576_searchQual760',
                    },
                    {
                      text: 'FNAC (Fine Needle Aspiration Cytology)',
                      value: '2388_searchQual761',
                    },
                    {
                      text: 'FSH (Facioscapulohumeral Muscular Dystrophy)',
                      value: '4646_searchQual762',
                    },
                    {
                      text: 'FSHD (Facioscapulohumeral Muscular Dystrophy)',
                      value: '4646_searchQual763',
                    },
                    {
                      text: 'FSHMD (Facioscapulohumeral Muscular Dystrophy)',
                      value: '4646_searchQual764',
                    },
                    {
                      text: 'Face Bruise',
                      value: '100907_searchQual765',
                    },
                    {
                      text: 'Face Transplant',
                      value: '9691_searchQual766',
                    },
                    {
                      text: 'Face X-Ray',
                      value: '2902_searchQual767',
                    },
                    {
                      text: 'Facelift',
                      value: '101779_searchQual768',
                    },
                    {
                      text: 'Facial Bone Fracture',
                      value: '101075_searchQual769',
                    },
                    {
                      text: 'Facial Nerve Paralysis',
                      value: '4575_searchQual770',
                    },
                    {
                      text: 'Facial Neuralgia',
                      value: '4788_searchQual771',
                    },
                    {
                      text: 'Facial Radiography',
                      value: '2902_searchQual772',
                    },
                    {
                      text: 'Facial Spasm',
                      value: '12403_searchQual773',
                    },
                    {
                      text: 'Facial X-ray',
                      value: '2902_searchQual774',
                    },
                    {
                      text: 'Facioscapulohumeral Muscular Dystrophy',
                      value: '4646_searchQual775',
                    },
                    {
                      text: 'Factitious Disorders',
                      value: '5162_searchQual776',
                    },
                    {
                      text: 'Factive',
                      value: '12163_searchQual777',
                    },
                    {
                      text: 'Factor I Assay',
                      value: '2545_searchQual778',
                    },
                    {
                      text: 'Factor I Levels (Blood)',
                      value: '2545_searchQual779',
                    },
                    {
                      text: 'Factor I Levels (Serum)',
                      value: '2545_searchQual780',
                    },
                    {
                      text: 'Factor II Assay',
                      value: '2546_searchQual781',
                    },
                    {
                      text: 'Factor II Levels (Blood)',
                      value: '2546_searchQual782',
                    },
                    {
                      text: 'Factor II Levels (Serum)',
                      value: '2546_searchQual783',
                    },
                    {
                      text: 'Factor IX Assay',
                      value: '2547_searchQual784',
                    },
                    {
                      text: 'Factor IX Deficiency',
                      value: '4141_searchQual785',
                    },
                    {
                      text: 'Factor IX Levels (Blood)',
                      value: '2547_searchQual786',
                    },
                    {
                      text: 'Factor IX Levels (Serum)',
                      value: '2547_searchQual787',
                    },
                    {
                      text: 'Factor V Assay',
                      value: '2548_searchQual788',
                    },
                    {
                      text: 'Factor V Leiden',
                      value: '4131_searchQual789',
                    },
                    {
                      text: 'Factor V Levels (Blood)',
                      value: '2548_searchQual790',
                    },
                    {
                      text: 'Factor V Levels (Serum)',
                      value: '2548_searchQual791',
                    },
                    {
                      text: 'Factor VII Assay',
                      value: '2549_searchQual792',
                    },
                    {
                      text: 'Factor VII Deficiency (FVII)',
                      value: '14264_searchQual793',
                    },
                    {
                      text: 'Factor VII Levels (Blood)',
                      value: '2549_searchQual794',
                    },
                    {
                      text: 'Factor VII Levels (Serum)',
                      value: '2549_searchQual795',
                    },
                    {
                      text: 'Factor VIII Assay',
                      value: '2550_searchQual796',
                    },
                    {
                      text: 'Factor VIII Deficiency',
                      value: '4140_searchQual797',
                    },
                    {
                      text: 'Factor VIII Levels (Blood)',
                      value: '2550_searchQual798',
                    },
                    {
                      text: 'Factor VIII Levels (Serum)',
                      value: '2550_searchQual799',
                    },
                    {
                      text: 'Factor X Antigen Levels (Blood)',
                      value: '2551_searchQual800',
                    },
                    {
                      text: 'Factor X Antigen Levels (Serum)',
                      value: '2551_searchQual801',
                    },
                    {
                      text: 'Factor X Assay',
                      value: '2551_searchQual802',
                    },
                    {
                      text: 'Factor X Levels (Blood)',
                      value: '2551_searchQual803',
                    },
                    {
                      text: 'Factor X Levels (Serum)',
                      value: '2551_searchQual804',
                    },
                    {
                      text: 'Factor XI Antigen Levels (Blood)',
                      value: '2552_searchQual805',
                    },
                    {
                      text: 'Factor XI Antigen Levels (Serum)',
                      value: '2552_searchQual806',
                    },
                    {
                      text: 'Factor XI Assay',
                      value: '2552_searchQual807',
                    },
                    {
                      text: 'Factor XI Deficiency',
                      value: '4142_searchQual808',
                    },
                    {
                      text: 'Factor XI Levels (Blood)',
                      value: '2552_searchQual809',
                    },
                    {
                      text: 'Factor XI Levels (Serum)',
                      value: '2552_searchQual810',
                    },
                    {
                      text: 'Factor XII Antigen Levels (Blood)',
                      value: '2553_searchQual811',
                    },
                    {
                      text: 'Factor XII Antigen Levels (Serum)',
                      value: '2553_searchQual812',
                    },
                    {
                      text: 'Factor XII Assay',
                      value: '2553_searchQual813',
                    },
                    {
                      text: 'Factor XIII Antigen Levels (Blood)',
                      value: '2554_searchQual814',
                    },
                    {
                      text: 'Factor XIII Antigen Levels (Serum)',
                      value: '2554_searchQual815',
                    },
                    {
                      text: 'Factor XIII Assay',
                      value: '2554_searchQual816',
                    },
                    {
                      text: 'Faecal Impaction',
                      value: '3822_searchQual817',
                    },
                    {
                      text: 'Family Practitioner (visit)',
                      value: '2817_searchQual818',
                    },
                    {
                      text: 'Fear of Confined Spaces',
                      value: '5123_searchQual819',
                    },
                    {
                      text: 'Fear of Enclosed Spaces',
                      value: '5123_searchQual820',
                    },
                    {
                      text: 'Fear of Open Spaces',
                      value: '5106_searchQual821',
                    },
                    {
                      text: 'Febre Maculosa',
                      value: '4305_searchQual822',
                    },
                    {
                      text: 'Fecal Impaction',
                      value: '3822_searchQual823',
                    },
                    {
                      text: 'Feet Ache',
                      value: '7672_searchQual824',
                    },
                    {
                      text: 'Femoral Fracture',
                      value: '13264_searchQual825',
                    },
                    {
                      text: 'Femoral Neck Fracture',
                      value: '13264_searchQual826',
                    },
                    {
                      text: 'Fenofibric Acid',
                      value: '10485_searchQual827',
                    },
                    {
                      text: 'Fibula Fracture',
                      value: '102035_searchQual828',
                    },
                    {
                      text: 'Finger Ache',
                      value: '7663_searchQual829',
                    },
                    {
                      text: 'Finger Bone Fracture Repair',
                      value: '101608_searchQual830',
                    },
                    {
                      text: 'Finger Displacement',
                      value: '8515_searchQual831',
                    },
                    {
                      text: 'Finger Fracture',
                      value: '8149_searchQual832',
                    },
                    {
                      text: 'Fistula (Tracheoesophageal)',
                      value: '9640_searchQual833',
                    },
                    {
                      text: 'Flesh Eating Bacteria',
                      value: '100264_searchQual834',
                    },
                    {
                      text: 'Flu Vaccine',
                      value: '3198_searchQual835',
                    },
                    {
                      text: 'Flu and hepatitis B vaccine',
                      value: '3198_searchQual836',
                    },
                    {
                      text: 'Fludrocortisone Acetate',
                      value: '3016_searchQual837',
                    },
                    {
                      text: 'Fluocinolone Acetonide',
                      value: '11608_searchQual838',
                    },
                    {
                      text: 'Fluocinolone Acetonide (topical)',
                      value: '11034_searchQual839',
                    },
                    {
                      text: 'Fluoracaine',
                      value: '12202_searchQual840',
                    },
                    {
                      text: 'Fluorescein-Proparacaine',
                      value: '12202_searchQual841',
                    },
                    {
                      text: 'Fluorometholone acetate',
                      value: '12202_searchQual842',
                    },
                    {
                      text: 'Fluorouracil',
                      value: '3024_searchQual843',
                    },
                    {
                      text: 'Folacin Levels',
                      value: '2573_searchQual844',
                    },
                    {
                      text: 'Folic Acid',
                      value: '13791_searchQual845',
                    },
                    {
                      text: 'Folic Acid Deficiency',
                      value: '3531_searchQual846',
                    },
                    {
                      text: 'Folic Acid Levels',
                      value: '2573_searchQual847',
                    },
                    {
                      text: 'Folic Acid Levels (Blood)',
                      value: '2573_searchQual848',
                    },
                    {
                      text: 'Folic Acid Levels (Serum)',
                      value: '2573_searchQual849',
                    },
                    {
                      text: 'Folinic Acid',
                      value: '13719_searchQual850',
                    },
                    {
                      text: 'Foot Bone Fracture Repair',
                      value: '101609_searchQual851',
                    },
                    {
                      text: 'Foot Displacement',
                      value: '8518_searchQual852',
                    },
                    {
                      text: 'Foot Fracture',
                      value: '8155_searchQual853',
                    },
                    {
                      text: 'Forearm Fracture',
                      value: '100784_searchQual854',
                    },
                    {
                      text: 'Fractional Excretion Of Sodium Levels',
                      value: '2576_searchQual855',
                    },
                    {
                      text: 'Fracture (Spine)',
                      value: '8209_searchQual856',
                    },
                    {
                      text: 'Fracture Of The Vertebral Spine',
                      value: '8209_searchQual857',
                    },
                    {
                      text: 'Fracture of the Cervical Spine',
                      value: '10054_searchQual858',
                    },
                    {
                      text: 'Fracture of the Femoral Neck',
                      value: '8191_searchQual859',
                    },
                    {
                      text: 'Fracture of the Thoracic Spine',
                      value: '10108_searchQual860',
                    },
                    {
                      text: 'Fractured Ankle',
                      value: '8098_searchQual861',
                    },
                    {
                      text: 'Fractured Ankle Joint',
                      value: '8098_searchQual862',
                    },
                    {
                      text: 'Fractured Arm',
                      value: '8107_searchQual863',
                    },
                    {
                      text: 'Fractured Bone',
                      value: '9850_searchQual864',
                    },
                    {
                      text: 'Fractured Cervical Vertebra',
                      value: '10054_searchQual865',
                    },
                    {
                      text: 'Fractured Cheekbone',
                      value: '100939_searchQual866',
                    },
                    {
                      text: 'Fractured Clavicle',
                      value: '8512_searchQual867',
                    },
                    {
                      text: 'Fractured Collar Bone',
                      value: '8512_searchQual868',
                    },
                    {
                      text: 'Fractured Collarbone',
                      value: '8512_searchQual869',
                    },
                    {
                      text: 'Fractured Costal Joint',
                      value: '8494_searchQual870',
                    },
                    {
                      text: 'Fractured Elbow',
                      value: '8143_searchQual871',
                    },
                    {
                      text: 'Fractured Eye Socket',
                      value: '8503_searchQual872',
                    },
                    {
                      text: 'Fractured Femur',
                      value: '8191_searchQual873',
                    },
                    {
                      text: 'Fractured Fibula',
                      value: '102035_searchQual874',
                    },
                    {
                      text: 'Fractured Finger',
                      value: '8149_searchQual875',
                    },
                    {
                      text: 'Fractured Foot',
                      value: '8155_searchQual876',
                    },
                    {
                      text: 'Fractured Forearm',
                      value: '100784_searchQual877',
                    },
                    {
                      text: 'Fractured Hand',
                      value: '8161_searchQual878',
                    },
                    {
                      text: 'Fractured Jaw',
                      value: '8500_searchQual879',
                    },
                    {
                      text: 'Fractured Jaw Joint',
                      value: '8500_searchQual880',
                    },
                    {
                      text: 'Fractured Knee',
                      value: '8509_searchQual881',
                    },
                    {
                      text: 'Fractured Knee Joint',
                      value: '8509_searchQual882',
                    },
                    {
                      text: 'Fractured Leg',
                      value: '8191_searchQual883',
                    },
                    {
                      text: 'Fractured Lower Leg',
                      value: '8191_searchQual884',
                    },
                    {
                      text: 'Fractured Mandible',
                      value: '8500_searchQual885',
                    },
                    {
                      text: 'Fractured Metacarpal Bone',
                      value: '8161_searchQual886',
                    },
                    {
                      text: 'Fractured Metacarpal Joint',
                      value: '8161_searchQual887',
                    },
                    {
                      text: 'Fractured Metacarpus',
                      value: '8161_searchQual888',
                    },
                    {
                      text: 'Fractured Metatarsus',
                      value: '8155_searchQual889',
                    },
                    {
                      text: 'Fractured Nasal Bone',
                      value: '100389_searchQual890',
                    },
                    {
                      text: 'Fractured Navicular Bone',
                      value: '8155_searchQual891',
                    },
                    {
                      text: 'Fractured Nose',
                      value: '100389_searchQual892',
                    },
                    {
                      text: 'Fractured Patella',
                      value: '8509_searchQual893',
                    },
                    {
                      text: 'Fractured Pelvis',
                      value: '13636_searchQual894',
                    },
                    {
                      text: 'Fractured Radius',
                      value: '8107_searchQual895',
                    },
                    {
                      text: 'Fractured Rib',
                      value: '8494_searchQual896',
                    },
                    {
                      text: 'Fractured Scaphoid Bone',
                      value: '8227_searchQual897',
                    },
                    {
                      text: 'Fractured Shoulder',
                      value: '8200_searchQual898',
                    },
                    {
                      text: 'Fractured Shoulder Bone',
                      value: '8200_searchQual899',
                    },
                    {
                      text: 'Fractured Shoulder Joint',
                      value: '8200_searchQual900',
                    },
                    {
                      text: 'Fractured Spine',
                      value: '8209_searchQual901',
                    },
                    {
                      text: 'Fractured Sternum',
                      value: '8497_searchQual902',
                    },
                    {
                      text: 'Fractured Thoracic Vertebra',
                      value: '10108_searchQual903',
                    },
                    {
                      text: 'Fractured Thumb',
                      value: '10165_searchQual904',
                    },
                    {
                      text: 'Fractured Tibia',
                      value: '8191_searchQual905',
                    },
                    {
                      text: 'Fractured Toe',
                      value: '8218_searchQual906',
                    },
                    {
                      text: 'Fractured Ulna',
                      value: '8107_searchQual907',
                    },
                    {
                      text: 'Fractured Upper Arm',
                      value: '100783_searchQual908',
                    },
                    {
                      text: 'Fractured Wrist',
                      value: '8227_searchQual909',
                    },
                    {
                      text: 'Free Valproic Acid Levels',
                      value: '2878_searchQual910',
                    },
                    {
                      text: 'GALT (Galactose 1 Phosphate Uridyl Transferase)',
                      value: '2581_searchQual911',
                    },
                    {
                      text: 'Gabapentin Enacarbil',
                      value: '11118_searchQual912',
                    },
                    {
                      text: 'Gal 1 PUT (Galactose 1 Phosphate Uridyl Transferase) Levels',
                      value: '2581_searchQual913',
                    },
                    {
                      text: 'Galactorrhea',
                      value: '14411_searchQual914',
                    },
                    {
                      text: 'Galactosaemia Screen',
                      value: '2581_searchQual915',
                    },
                    {
                      text: 'Galactose 1 Phosphate Uridyl Transferase Levels',
                      value: '2581_searchQual916',
                    },
                    {
                      text: 'Galactosemia Screen',
                      value: '2581_searchQual917',
                    },
                    {
                      text: 'Galactosylceramide Lipidosis',
                      value: '4676_searchQual918',
                    },
                    {
                      text: 'Gall Bladder Ejection Fraction Scan',
                      value: '2582_searchQual919',
                    },
                    {
                      text: 'Gallbladder Comet-Tail Artifact',
                      value: '100584_searchQual920',
                    },
                    {
                      text: 'Gallbladder Ejection Fraction Scan',
                      value: '2582_searchQual921',
                    },
                    {
                      text: 'Ganirelix Acetate',
                      value: '12157_searchQual922',
                    },
                    {
                      text: 'Gastric Acid Secretion Levels',
                      value: '2585_searchQual923',
                    },
                    {
                      text: 'Gastric Acid Secretion Test',
                      value: '2824_searchQual924',
                    },
                    {
                      text: 'Gastric Acid Stimulation',
                      value: '2586_searchQual925',
                    },
                    {
                      text: 'Gastric Acid Titration Levels',
                      value: '2381_searchQual926',
                    },
                    {
                      text: 'Gastric Hyperacidity',
                      value: '3541_searchQual927',
                    },
                    {
                      text: 'Gastric Overacidity',
                      value: '3541_searchQual928',
                    },
                    {
                      text: 'Gated Cardiac Scan',
                      value: '2717_searchQual929',
                    },
                    {
                      text: 'Gatifloxacin',
                      value: '12202_searchQual930',
                    },
                    {
                      text: 'Gemifloxacin Mesylate',
                      value: '12163_searchQual931',
                    },
                    {
                      text: 'General Practitioner (visit)',
                      value: '2817_searchQual932',
                    },
                    {
                      text: 'Generalized ACLE (Acute Cutaneous Lupus Erythematosus)',
                      value: '4459_searchQual933',
                    },
                    {
                      text: 'Generalized Acute Cutaneous Lupus Erythematosus',
                      value: '4459_searchQual934',
                    },
                    {
                      text: 'Glatiramer Acetate',
                      value: '10992_searchQual935',
                    },
                    {
                      text: 'Goserelin Acetate',
                      value: '13756_searchQual936',
                    },
                    {
                      text: 'Granular Reticular Opacity',
                      value: '100486_searchQual937',
                    },
                    {
                      text: 'Grief Reaction',
                      value: '13802_searchQual938',
                    },
                    {
                      text: 'Ground-Glass Opacity',
                      value: '100468_searchQual939',
                    },
                    {
                      text: 'Guaiac Smear Test',
                      value: '2558_searchQual940',
                    },
                    {
                      text: 'Guaiac Stool Test',
                      value: '2558_searchQual941',
                    },
                    {
                      text: 'GuanFACINE',
                      value: '10737_searchQual942',
                    },
                    {
                      text: 'Guanabenz Acetate',
                      value: '10734_searchQual943',
                    },
                    {
                      text: 'HAART (Highly Active Antiretroviral Therapy)',
                      value: '3069_searchQual944',
                    },
                    {
                      text: 'HACE (High Altitude Cerebral Edema)',
                      value: '7726_searchQual945',
                    },
                    {
                      text: 'HPL (Human Placental Lactogen) Level',
                      value: '2629_searchQual946',
                    },
                    {
                      text: 'HPV 9-Valent Recomb Vaccine',
                      value: '3198_searchQual947',
                    },
                    {
                      text: 'HPV Bivalent (16 and 18) Vaccine',
                      value: '3198_searchQual948',
                    },
                    {
                      text: 'HPV Quadrivalent Vaccine',
                      value: '3198_searchQual949',
                    },
                    {
                      text: 'HPV vaccine',
                      value: '3198_searchQual950',
                    },
                    {
                      text: 'HRT (Hormone Replacement Therapy)',
                      value: '3070_searchQual951',
                    },
                    {
                      text: 'HTNB (Hypertension-with-Brachydactyly) Syndrome',
                      value: '3501_searchQual952',
                    },
                    {
                      text: 'HVA (Homovanillic Acid) Level',
                      value: '2625_searchQual953',
                    },
                    {
                      text: 'HVA (Homovanillic Acid) Level Urine',
                      value: '2625_searchQual954',
                    },
                    {
                      text: 'Haemophilus B Polysac Conj Vaccine',
                      value: '3198_searchQual955',
                    },
                    {
                      text: 'Hageman Factor Assay',
                      value: '2553_searchQual956',
                    },
                    {
                      text: 'Hair Replacement Surgery',
                      value: '101611_searchQual957',
                    },
                    {
                      text: 'Haldol Lactate',
                      value: '14463_searchQual958',
                    },
                    {
                      text: 'Hand Ache',
                      value: '7696_searchQual959',
                    },
                    {
                      text: 'Hand Bone Fracture Repair',
                      value: '101612_searchQual960',
                    },
                    {
                      text: 'Hand Displacement',
                      value: '8521_searchQual961',
                    },
                    {
                      text: 'Hand Fracture',
                      value: '8161_searchQual962',
                    },
                    {
                      text: 'Headache',
                      value: '4656_searchQual963',
                    },
                    {
                      text: 'Headache (Cluster)',
                      value: '4657_searchQual964',
                    },
                    {
                      text: 'Headache (Hormone)',
                      value: '100966_searchQual965',
                    },
                    {
                      text: 'Headache (Migraine)',
                      value: '4658_searchQual966',
                    },
                    {
                      text: 'Headache (Organic)',
                      value: '4659_searchQual967',
                    },
                    {
                      text: 'Headache (Other)',
                      value: '14510_searchQual968',
                    },
                    {
                      text: 'Headache (Sinus)',
                      value: '4660_searchQual969',
                    },
                    {
                      text: 'Headache (Spinal)',
                      value: '4661_searchQual970',
                    },
                    {
                      text: 'Headache (Tension Type)',
                      value: '4662_searchQual971',
                    },
                    {
                      text: 'Heart Attack',
                      value: '3298_searchQual972',
                    },
                    {
                      text: 'Heart Attack Enzymes',
                      value: '13330_searchQual973',
                    },
                    {
                      text: 'Heart Valve Replacement',
                      value: '8902_searchQual974',
                    },
                    {
                      text: 'Heart-Lung Machine',
                      value: '2995_searchQual975',
                    },
                    {
                      text: 'Heel Ache',
                      value: '7708_searchQual976',
                    },
                    {
                      text: 'Heel Fracture',
                      value: '8167_searchQual977',
                    },
                    {
                      text: 'Helicobacter Pylori',
                      value: '3859_searchQual978',
                    },
                    {
                      text: 'Helicobacter pylori Serology',
                      value: '2608_searchQual979',
                    },
                    {
                      text: 'Helicobacter pylori Tests',
                      value: '2608_searchQual980',
                    },
                    {
                      text: 'Hemoglobin Associated Acetaldehyde (HAA)',
                      value: '8329_searchQual981',
                    },
                    {
                      text: 'Hemophilia (Factor IX Deficiency)',
                      value: '4141_searchQual982',
                    },
                    {
                      text: 'Hemophilia (Factor VIII Deficiency)',
                      value: '4140_searchQual983',
                    },
                    {
                      text: 'Hemophilia (Factor XI Deficiency)',
                      value: '4142_searchQual984',
                    },
                    {
                      text: 'Hepatitis A and B Vaccine',
                      value: '3198_searchQual985',
                    },
                    {
                      text: 'Hepatitis A vaccine',
                      value: '12205_searchQual986',
                    },
                    {
                      text: 'Hepatitis A-Hep B Recomb Vac',
                      value: '3198_searchQual987',
                    },
                    {
                      text: 'Hepatitis B Surface Antibody Serology',
                      value: '2613_searchQual988',
                    },
                    {
                      text: 'Hepatitis B Surface Antigen Serology',
                      value: '2613_searchQual989',
                    },
                    {
                      text: 'Hepatitis B Vac Recombinant',
                      value: '12205_searchQual990',
                    },
                    {
                      text: 'Hepatitis B vaccine',
                      value: '12205_searchQual991',
                    },
                    {
                      text: 'High-Sensitivity C-reactive Protein Levels',
                      value: '2414_searchQual992',
                    },
                    {
                      text: 'Highly Active Antiretroviral Therapy',
                      value: '3069_searchQual993',
                    },
                    {
                      text: 'Hip Ache',
                      value: '7738_searchQual994',
                    },
                    {
                      text: 'Hip Bone Fracture Repair',
                      value: '101613_searchQual995',
                    },
                    {
                      text: 'Hip Fracture',
                      value: '8173_searchQual996',
                    },
                    {
                      text: 'Hip Joint Replacement',
                      value: '8908_searchQual997',
                    },
                    {
                      text: 'Hip Replacement',
                      value: '4444_searchQual998',
                    },
                    {
                      text: 'Hip Replacement',
                      value: '8908_searchQual999',
                    },
                    {
                      text: 'Hip Replacement Surgery',
                      value: '8908_searchQual1000',
                    },
                    {
                      text: 'History and Physical Exam for Low Back Pain',
                      value: '2690_searchQual1001',
                    },
                    {
                      text: 'Hollow Back',
                      value: '4457_searchQual1002',
                    },
                    {
                      text: 'Homovanillic Acid Level',
                      value: '2625_searchQual1003',
                    },
                    {
                      text: 'Hormonal Contraception',
                      value: '12139_searchQual1004',
                    },
                    {
                      text: 'Hormonal headache',
                      value: '100966_searchQual1005',
                    },
                    {
                      text: 'Hormone Replacement Therapy',
                      value: '3070_searchQual1006',
                    },
                    {
                      text: 'Hormone headache',
                      value: '100966_searchQual1007',
                    },
                    {
                      text: 'Hospital Acquired Pneumonia',
                      value: '12280_searchQual1008',
                    },
                    {
                      text: 'Human Placental Lactogen Level',
                      value: '2629_searchQual1009',
                    },
                    {
                      text: 'Humeral Fracture',
                      value: '100783_searchQual1010',
                    },
                    {
                      text: 'Humpback',
                      value: '4448_searchQual1011',
                    },
                    {
                      text: 'Hunchback',
                      value: '4448_searchQual1012',
                    },
                    {
                      text: 'Hurt my Achilles Tendon',
                      value: '9553_searchQual1013',
                    },
                    {
                      text: 'Hyperacidity',
                      value: '3541_searchQual1014',
                    },
                    {
                      text: 'Hyperactive Thyroid',
                      value: '3551_searchQual1015',
                    },
                    {
                      text: 'Hyperactivity',
                      value: '5144_searchQual1016',
                    },
                    {
                      text: 'Hyperactivity State',
                      value: '5144_searchQual1017',
                    },
                    {
                      text: 'Hyperprolactinemia',
                      value: '6041_searchQual1018',
                    },
                    {
                      text: 'Hypersensitivity Reaction',
                      value: '3495_searchQual1019',
                    },
                    {
                      text: 'Hypertension with Brachydactyly (HTNB) Syndrome',
                      value: '3501_searchQual1020',
                    },
                    {
                      text: 'Hypertensive Cardiac Disease',
                      value: '14369_searchQual1021',
                    },
                    {
                      text: 'Hypoacidity',
                      value: '14348_searchQual1022',
                    },
                    {
                      text: 'Hypochondriac',
                      value: '5147_searchQual1023',
                    },
                    {
                      text: 'IBC (Iron Binding Capacity) Levels',
                      value: '2852_searchQual1024',
                    },
                    {
                      text: 'ICD (Implantable Cardiac Defibrillator)',
                      value: '3027_searchQual1025',
                    },
                    {
                      text: 'ICH (Intracerebral Hemorrhage)',
                      value: '4590_searchQual1026',
                    },
                    {
                      text: 'ICI (Intracervical Insemination)',
                      value: '3056_searchQual1027',
                    },
                    {
                      text: 'ICP (Intracranial Pressure Monitoring)',
                      value: '2641_searchQual1028',
                    },
                    {
                      text: 'IIH (Idiopathic Intracranial Hypertension)',
                      value: '4673_searchQual1029',
                    },
                    {
                      text: 'IRT (Immunoreactive Trypsinogen) Levels',
                      value: '2861_searchQual1030',
                    },
                    {
                      text: 'IUD (Intra Uterine Contraceptive Device)',
                      value: '12139_searchQual1031',
                    },
                    {
                      text: 'Icatibant Acetate',
                      value: '12172_searchQual1032',
                    },
                    {
                      text: 'Idiopathic Facial Paralysis',
                      value: '4575_searchQual1033',
                    },
                    {
                      text: 'Idiopathic Intracranial Hypertension',
                      value: '4673_searchQual1034',
                    },
                    {
                      text: 'Idiopathic Retinal Detachment',
                      value: '3741_searchQual1035',
                    },
                    {
                      text: 'Ignis Sacer',
                      value: '4247_searchQual1036',
                    },
                    {
                      text: 'Immunoreactive Trypsinogen Levels',
                      value: '2861_searchQual1037',
                    },
                    {
                      text: 'Impacted Tooth',
                      value: '3649_searchQual1038',
                    },
                    {
                      text: 'Implantable Cardiac Defibrillator',
                      value: '3027_searchQual1039',
                    },
                    {
                      text: 'Implantable Cardiac Monitor',
                      value: '102071_searchQual1040',
                    },
                    {
                      text: 'Indacaterol',
                      value: '11424_searchQual1041',
                    },
                    {
                      text: 'Indacaterol Maleate',
                      value: '11424_searchQual1042',
                    },
                    {
                      text: 'Indacaterol and Glycopyrrolate',
                      value: '100364_searchQual1043',
                    },
                    {
                      text: 'Indacaterol/Glycopyrronium Bromide',
                      value: '100364_searchQual1044',
                    },
                    {
                      text: 'Indometacin',
                      value: '10392_searchQual1045',
                    },
                    {
                      text: 'Indomethacin',
                      value: '10392_searchQual1046',
                    },
                    {
                      text: 'Indomethacin (Injection)',
                      value: '11593_searchQual1047',
                    },
                    {
                      text: 'Indomethacin (Oral)',
                      value: '11590_searchQual1048',
                    },
                    {
                      text: 'Infantile Osteomalacia',
                      value: '4515_searchQual1049',
                    },
                    {
                      text: 'Infiltrative Opacity',
                      value: '100467_searchQual1050',
                    },
                    {
                      text: 'Inflammation of the Achilles Tendon',
                      value: '7456_searchQual1051',
                    },
                    {
                      text: 'Inflammation of the Sacroiliac Joint',
                      value: '4517_searchQual1052',
                    },
                    {
                      text: 'Inflammation of the Stomach Lining',
                      value: '3851_searchQual1053',
                    },
                    {
                      text: 'Injured Back',
                      value: '8737_searchQual1054',
                    },
                    {
                      text: 'Inositol Niacinate',
                      value: '13797_searchQual1055',
                    },
                    {
                      text: 'Insulin Reaction',
                      value: '5611_searchQual1056',
                    },
                    {
                      text: 'Insulin-like Growth Factor 1 (IGF-1)',
                      value: '2816_searchQual1057',
                    },
                    {
                      text: 'Intra Uterine Contraceptive Device',
                      value: '12139_searchQual1058',
                    },
                    {
                      text: 'Intracardiac Catheterization',
                      value: '3015_searchQual1059',
                    },
                    {
                      text: 'Intracardiac EPS (Electrophysiology Study)',
                      value: '2640_searchQual1060',
                    },
                    {
                      text: 'Intracardiac Electrophysiology Study',
                      value: '2640_searchQual1061',
                    },
                    {
                      text: 'Intracerebral Hemorrhage',
                      value: '4590_searchQual1062',
                    },
                    {
                      text: 'Intracervical Insemination',
                      value: '3056_searchQual1063',
                    },
                    {
                      text: 'Intracranial Abscess',
                      value: '4552_searchQual1064',
                    },
                    {
                      text: 'Intracranial Cancer',
                      value: '4839_searchQual1065',
                    },
                    {
                      text: 'Intracranial Hemorrhage',
                      value: '4590_searchQual1066',
                    },
                    {
                      text: 'Intracranial Hypertension',
                      value: '4673_searchQual1067',
                    },
                    {
                      text: 'Intracranial Pressure Monitoring',
                      value: '2641_searchQual1068',
                    },
                    {
                      text: 'Intracranial Tumor',
                      value: '9667_searchQual1069',
                    },
                    {
                      text: 'Intracutaneous (Intradermal) Allergy Test',
                      value: '2320_searchQual1070',
                    },
                    {
                      text: 'Intraosseous Catheter Placement',
                      value: '14021_searchQual1071',
                    },
                    {
                      text: 'Iodine Uptake Test, Radioactive',
                      value: '2780_searchQual1072',
                    },
                    {
                      text: 'Iron Binding Capacity Levels',
                      value: '2852_searchQual1073',
                    },
                    {
                      text: 'Ivacaftor',
                      value: '11872_searchQual1074',
                    },
                    {
                      text: 'Jacksonian Epilepsy',
                      value: '4635_searchQual1075',
                    },
                    {
                      text: 'Jacksonian March',
                      value: '4635_searchQual1076',
                    },
                    {
                      text: 'Jacksonian Seizure',
                      value: '4635_searchQual1077',
                    },
                    {
                      text: 'Jacobi Ulcer',
                      value: '4820_searchQual1078',
                    },
                    {
                      text: 'Japan Encephalitis Virus Vacc',
                      value: '3198_searchQual1079',
                    },
                    {
                      text: 'Jaw Fracture',
                      value: '9925_searchQual1080',
                    },
                    {
                      text: 'Joint Ache',
                      value: '7765_searchQual1081',
                    },
                    {
                      text: 'Joint Replacement',
                      value: '4444_searchQual1082',
                    },
                    {
                      text: 'Joint Replacement Surgery',
                      value: '5920_searchQual1083',
                    },
                    {
                      text: 'Junctional Tachycardia',
                      value: '12430_searchQual1084',
                    },
                    {
                      text: 'Kasabach-Merritt Syndrome',
                      value: '3282_searchQual1085',
                    },
                    {
                      text: 'Keratosis (Actinic)',
                      value: '3393_searchQual1086',
                    },
                    {
                      text: 'Ketoacidosis',
                      value: '12265_searchQual1087',
                    },
                    {
                      text: 'Ketorolac Tromethamine',
                      value: '12202_searchQual1088',
                    },
                    {
                      text: 'Kidney Acute Injury',
                      value: '4062_searchQual1089',
                    },
                    {
                      text: 'Knee Ache',
                      value: '7783_searchQual1090',
                    },
                    {
                      text: 'Knee Bone Fracture Repair',
                      value: '101236_searchQual1091',
                    },
                    {
                      text: 'Knee Fracture',
                      value: '8509_searchQual1092',
                    },
                    {
                      text: 'Knee Fracture Repair',
                      value: '101236_searchQual1093',
                    },
                    {
                      text: 'Knee Joint Fracture',
                      value: '8509_searchQual1094',
                    },
                    {
                      text: 'Knee Joint Replacement',
                      value: '8920_searchQual1095',
                    },
                    {
                      text: 'Knee Replacement',
                      value: '4444_searchQual1096',
                    },
                    {
                      text: 'Knee Replacement',
                      value: '8920_searchQual1097',
                    },
                    {
                      text: 'Knee Replacement Surgery',
                      value: '8920_searchQual1098',
                    },
                    {
                      text: 'LACI (Lacunar Infarct)',
                      value: '11668_searchQual1099',
                    },
                    {
                      text: 'LD (Lactate Dehydrogenase) Isoenzymes Levels',
                      value: '2649_searchQual1100',
                    },
                    {
                      text: 'LD (Lactate Dehydrogenase) Levels',
                      value: '2649_searchQual1101',
                    },
                    {
                      text: 'LDH (Lactate Dehydrogenase) Isoenzymes Levels',
                      value: '2649_searchQual1102',
                    },
                    {
                      text: 'LDH (Lactate Dehydrogenase) Levels',
                      value: '2649_searchQual1103',
                    },
                    {
                      text: 'LDH-1 (Lactate Dehydrogenase Isoenzymes) Test',
                      value: '2649_searchQual1104',
                    },
                    {
                      text: 'Labile Factor Deficiency',
                      value: '14264_searchQual1105',
                    },
                    {
                      text: 'Lac-Hydrin',
                      value: '10189_searchQual1106',
                    },
                    {
                      text: 'Laceration',
                      value: '100384_searchQual1107',
                    },
                    {
                      text: 'Lack of Semen',
                      value: '3956_searchQual1108',
                    },
                    {
                      text: 'Lack of Sperm Cells',
                      value: '3957_searchQual1109',
                    },
                    {
                      text: 'Lack of Sweating',
                      value: '3497_searchQual1110',
                    },
                    {
                      text: 'Lacosamide',
                      value: '11121_searchQual1111',
                    },
                    {
                      text: 'Lacrimal Duct Gland Disorder',
                      value: '3646_searchQual1112',
                    },
                    {
                      text: 'Lacrimal Duct Inflammation',
                      value: '14495_searchQual1113',
                    },
                    {
                      text: 'Lacrimal Gland Sarcoma',
                      value: '7657_searchQual1114',
                    },
                    {
                      text: 'Lacrisert',
                      value: '12202_searchQual1115',
                    },
                    {
                      text: 'Lactase Deficiency',
                      value: '3568_searchQual1116',
                    },
                    {
                      text: 'Lactate Dehydrogenase Isoenzymes',
                      value: '2649_searchQual1117',
                    },
                    {
                      text: 'Lactate Dehydrogenase Levels',
                      value: '2649_searchQual1118',
                    },
                    {
                      text: 'Lactate Levels',
                      value: '2650_searchQual1119',
                    },
                    {
                      text: 'Lactate Test',
                      value: '2650_searchQual1120',
                    },
                    {
                      text: 'LactiCare-HC',
                      value: '10422_searchQual1121',
                    },
                    {
                      text: 'Lactic Acid',
                      value: '2650_searchQual1122',
                    },
                    {
                      text: 'Lactic Acid Dehydrogenase (LDH) - Cardiac Enzyme Studies',
                      value: '2649_searchQual1123',
                    },
                    {
                      text: 'Lactic Acid Dehydrogenase Levels',
                      value: '2649_searchQual1124',
                    },
                    {
                      text: 'Lactic Acid Levels',
                      value: '2650_searchQual1125',
                    },
                    {
                      text: 'Lactic Dehydrogenase Levels',
                      value: '2649_searchQual1126',
                    },
                    {
                      text: 'Lactogenic Hormone Level',
                      value: '2629_searchQual1127',
                    },
                    {
                      text: 'Lactose Intolerance',
                      value: '3568_searchQual1128',
                    },
                    {
                      text: 'Lactose Intolerance Hydrogen Breath Test',
                      value: '2651_searchQual1129',
                    },
                    {
                      text: 'Lactulose',
                      value: '11833_searchQual1130',
                    },
                    {
                      text: 'Lacunar Infarct',
                      value: '11668_searchQual1131',
                    },
                    {
                      text: 'Lacunar Stroke',
                      value: '11668_searchQual1132',
                    },
                    {
                      text: 'Lanreotide Acetate',
                      value: '11881_searchQual1133',
                    },
                    {
                      text: 'Laryngotracheal Reconstruction',
                      value: '14022_searchQual1134',
                    },
                    {
                      text: 'Laryngotracheobronchitis',
                      value: '4232_searchQual1135',
                    },
                    {
                      text: 'Laryngotracheoplasty',
                      value: '14022_searchQual1136',
                    },
                    {
                      text: 'Lastacaft',
                      value: '12202_searchQual1137',
                    },
                    {
                      text: 'Leg Ache',
                      value: '7792_searchQual1138',
                    },
                    {
                      text: 'Leg Fracture',
                      value: '8191_searchQual1139',
                    },
                    {
                      text: 'Lesser Curvature of the Stomach Shortened',
                      value: '100433_searchQual1140',
                    },
                    {
                      text: 'Leuprolide Acetate',
                      value: '13757_searchQual1141',
                    },
                    {
                      text: 'LevETIRAcetam',
                      value: '11160_searchQual1142',
                    },
                    {
                      text: 'Levacet',
                      value: '12082_searchQual1143',
                    },
                    {
                      text: 'Levo-Alpha Acetyl Methadol',
                      value: '13751_searchQual1144',
                    },
                    {
                      text: 'Levofloxacin',
                      value: '8821_searchQual1145',
                    },
                    {
                      text: 'Levomilnacipran',
                      value: '13558_searchQual1146',
                    },
                    {
                      text: 'Lichen acuminatus',
                      value: '3400_searchQual1147',
                    },
                    {
                      text: 'Lidocaine-HC Acetate-Psyllium',
                      value: '12091_searchQual1148',
                    },
                    {
                      text: 'Life Support Machine',
                      value: '3095_searchQual1149',
                    },
                    {
                      text: 'Linaclotide',
                      value: '12166_searchQual1150',
                    },
                    {
                      text: 'Linear Opacity',
                      value: '100471_searchQual1151',
                    },
                    {
                      text: 'Localized ACLE (Acute Cutaneous Lupus Erythematosus)',
                      value: '4459_searchQual1152',
                    },
                    {
                      text: 'Localized Acute Cutaneous Lupus Erythematosus',
                      value: '4459_searchQual1153',
                    },
                    {
                      text: 'Lomefloxacin HCl',
                      value: '12163_searchQual1154',
                    },
                    {
                      text: 'Low Back Pain',
                      value: '10099_searchQual1155',
                    },
                    {
                      text: 'Low Back Sprain',
                      value: '10102_searchQual1156',
                    },
                    {
                      text: 'Lower Back Condition',
                      value: '4528_searchQual1157',
                    },
                    {
                      text: 'Lower Back Constriction',
                      value: '4534_searchQual1158',
                    },
                    {
                      text: 'Lower Back Damage',
                      value: '10096_searchQual1159',
                    },
                    {
                      text: 'Lower Back Disease',
                      value: '4528_searchQual1160',
                    },
                    {
                      text: 'Lower Back Disorder',
                      value: '4528_searchQual1161',
                    },
                    {
                      text: 'Lower Back Impairment',
                      value: '4528_searchQual1162',
                    },
                    {
                      text: 'Lower Back Inflammation',
                      value: '10105_searchQual1163',
                    },
                    {
                      text: 'Lower Back Injury',
                      value: '10096_searchQual1164',
                    },
                    {
                      text: 'Lower Back Irritation',
                      value: '10099_searchQual1165',
                    },
                    {
                      text: 'Lower Back Pain',
                      value: '10099_searchQual1166',
                    },
                    {
                      text: 'Lower Back Problem',
                      value: '4528_searchQual1167',
                    },
                    {
                      text: 'Lower Back Swelling',
                      value: '10105_searchQual1168',
                    },
                    {
                      text: 'Lower Back Syndrome',
                      value: '4528_searchQual1169',
                    },
                    {
                      text: 'Lower Backache',
                      value: '10099_searchQual1170',
                    },
                    {
                      text: 'Lower Leg Fracture',
                      value: '8191_searchQual1171',
                    },
                    {
                      text: 'Lumacaftor-Ivacaftor',
                      value: '11899_searchQual1172',
                    },
                    {
                      text: 'Lumbar Back Sprain',
                      value: '10102_searchQual1173',
                    },
                    {
                      text: 'Lumbar Disc Displacement',
                      value: '12469_searchQual1174',
                    },
                    {
                      text: 'Lumbar Fracture',
                      value: '10090_searchQual1175',
                    },
                    {
                      text: 'Lumbar Spinal Fracture',
                      value: '10090_searchQual1176',
                    },
                    {
                      text: 'Lumbar Vertebral Fracture',
                      value: '10090_searchQual1177',
                    },
                    {
                      text: 'Lumbo-Sacral Fracture',
                      value: '10090_searchQual1178',
                    },
                    {
                      text: 'Lumbosacral Fracture',
                      value: '10090_searchQual1179',
                    },
                    {
                      text: 'Lumbosacral Fusion',
                      value: '14460_searchQual1180',
                    },
                    {
                      text: 'Lumbosacral Spine Condition',
                      value: '4528_searchQual1181',
                    },
                    {
                      text: 'Lumbosacral Spine Damage',
                      value: '10096_searchQual1182',
                    },
                    {
                      text: 'Lumbosacral Spine Disease',
                      value: '4528_searchQual1183',
                    },
                    {
                      text: 'Lumbosacral Spine Disorder',
                      value: '4528_searchQual1184',
                    },
                    {
                      text: 'Lumbosacral Spine Inflammation',
                      value: '10105_searchQual1185',
                    },
                    {
                      text: 'Lumbosacral Spine Injury',
                      value: '10096_searchQual1186',
                    },
                    {
                      text: 'Lumbosacral Spine Problem',
                      value: '4528_searchQual1187',
                    },
                    {
                      text: 'Lupaneta Pack',
                      value: '12157_searchQual1188',
                    },
                    {
                      text: 'Lupus Erythematosus (Acute Cutaneous)',
                      value: '4459_searchQual1189',
                    },
                    {
                      text: 'Lupus Erythematosus (Subacute Cutaneous)',
                      value: '4464_searchQual1190',
                    },
                    {
                      text: 'MAC (Mycobacterium Avium Complex)',
                      value: '4290_searchQual1191',
                    },
                    {
                      text: 'MUGA (Multigated Graft Acquisition) Scan',
                      value: '2717_searchQual1192',
                    },
                    {
                      text: 'Macitentan',
                      value: '100323_searchQual1193',
                    },
                    {
                      text: 'Macrobid',
                      value: '12229_searchQual1194',
                    },
                    {
                      text: 'Macrocytic Anemia',
                      value: '4112_searchQual1195',
                    },
                    {
                      text: 'Macrolides',
                      value: '12178_searchQual1196',
                    },
                    {
                      text: 'Macromastia',
                      value: '101835_searchQual1197',
                    },
                    {
                      text: 'Macronodular Cirrhosis',
                      value: '3815_searchQual1198',
                    },
                    {
                      text: 'Macroscopic Hematuria',
                      value: '3998_searchQual1199',
                    },
                    {
                      text: 'Macugen',
                      value: '12202_searchQual1200',
                    },
                    {
                      text: 'Macular Degeneration',
                      value: '3701_searchQual1201',
                    },
                    {
                      text: 'Macular Edema',
                      value: '100378_searchQual1202',
                    },
                    {
                      text: 'Macular Hole',
                      value: '100713_searchQual1203',
                    },
                    {
                      text: 'Macular Pucker',
                      value: '100714_searchQual1204',
                    },
                    {
                      text: 'Malarial Vaccine',
                      value: '2957_searchQual1205',
                    },
                    {
                      text: 'Mandible Bone Fracture Repair',
                      value: '101616_searchQual1206',
                    },
                    {
                      text: 'Mandible Fracture',
                      value: '8500_searchQual1207',
                    },
                    {
                      text: 'Mandibular Fracture',
                      value: '8500_searchQual1208',
                    },
                    {
                      text: 'Mandibular Joint Fracture',
                      value: '8500_searchQual1209',
                    },
                    {
                      text: 'Maximal Breathing Capacity',
                      value: '2686_searchQual1210',
                    },
                    {
                      text: 'Maximum Breathing Capacity',
                      value: '2686_searchQual1211',
                    },
                    {
                      text: 'Measles Virus Vaccine',
                      value: '3198_searchQual1212',
                    },
                    {
                      text: 'Measles and Rubella Vaccines',
                      value: '3198_searchQual1213',
                    },
                    {
                      text: 'Measles mumps rubella vaccine',
                      value: '3198_searchQual1214',
                    },
                    {
                      text: 'Measles vaccine',
                      value: '3198_searchQual1215',
                    },
                    {
                      text: 'Measles-mumps-rubella-varicella vaccine',
                      value: '3198_searchQual1216',
                    },
                    {
                      text: 'Mechanical Back Pain',
                      value: '7516_searchQual1217',
                    },
                    {
                      text: 'Medium-chain acyl-CoA dehydrogenase (MCAD) deficiency',
                      value: '100293_searchQual1218',
                    },
                    {
                      text: 'Medrol Acetate',
                      value: '3175_searchQual1219',
                    },
                    {
                      text: 'Medroxyprogesterone Acetate',
                      value: '13884_searchQual1220',
                    },
                    {
                      text: 'Megace',
                      value: '13758_searchQual1221',
                    },
                    {
                      text: 'Megacolon',
                      value: '3909_searchQual1222',
                    },
                    {
                      text: 'Megacolon (Toxic)',
                      value: '3910_searchQual1223',
                    },
                    {
                      text: 'Megestrol Acetate',
                      value: '13758_searchQual1224',
                    },
                    {
                      text: 'Meningococcal Vaccine',
                      value: '3198_searchQual1225',
                    },
                    {
                      text: 'Mepracine',
                      value: '12109_searchQual1226',
                    },
                    {
                      text: 'Metacarpal Bone Fracture',
                      value: '8161_searchQual1227',
                    },
                    {
                      text: 'Metacarpal Fracture',
                      value: '8161_searchQual1228',
                    },
                    {
                      text: 'Metacarpal Joint Fracture',
                      value: '8161_searchQual1229',
                    },
                    {
                      text: 'Metatarsal Fracture',
                      value: '8155_searchQual1230',
                    },
                    {
                      text: 'Methacholine Bronchial Provocation Test',
                      value: '2408_searchQual1231',
                    },
                    {
                      text: 'Methacholine Challenge Test',
                      value: '2408_searchQual1232',
                    },
                    {
                      text: 'Methenamine-Methylene Blue-Benzoic Acid-Phenyl Salicylate-Hycoscyamine',
                      value: '12229_searchQual1233',
                    },
                    {
                      text: 'Methylmalonic Acid Levels',
                      value: '2695_searchQual1234',
                    },
                    {
                      text: 'Methylprednisolone Acetate',
                      value: '3175_searchQual1235',
                    },
                    {
                      text: 'Mevacor',
                      value: '10497_searchQual1236',
                    },
                    {
                      text: 'MgCit-Bisacod-Pet-PEG-Metoclop',
                      value: '3093_searchQual1237',
                    },
                    {
                      text: 'Micronodular Opacities',
                      value: '100463_searchQual1238',
                    },
                    {
                      text: 'Micronodular Opacity',
                      value: '100463_searchQual1239',
                    },
                    {
                      text: 'Mid Back Condition',
                      value: '4529_searchQual1240',
                    },
                    {
                      text: 'Mid Back Damage',
                      value: '10287_searchQual1241',
                    },
                    {
                      text: 'Mid Back Disease',
                      value: '4529_searchQual1242',
                    },
                    {
                      text: 'Mid Back Disorder',
                      value: '4529_searchQual1243',
                    },
                    {
                      text: 'Mid Back Impairment',
                      value: '4529_searchQual1244',
                    },
                    {
                      text: 'Mid Back Inflammation',
                      value: '10290_searchQual1245',
                    },
                    {
                      text: 'Mid Back Injury',
                      value: '10114_searchQual1246',
                    },
                    {
                      text: 'Mid Back Problem',
                      value: '4529_searchQual1247',
                    },
                    {
                      text: 'Mid Back Swelling',
                      value: '10290_searchQual1248',
                    },
                    {
                      text: 'Migraine Headache',
                      value: '4658_searchQual1249',
                    },
                    {
                      text: 'Miliary Opacities',
                      value: '100463_searchQual1250',
                    },
                    {
                      text: 'Milnacipran',
                      value: '100094_searchQual1251',
                    },
                    {
                      text: 'Milnacipran HCl',
                      value: '100094_searchQual1252',
                    },
                    {
                      text: 'Milnacipran Hydrochloride',
                      value: '100094_searchQual1253',
                    },
                    {
                      text: 'Mitral Valve Replacement',
                      value: '8902_searchQual1254',
                    },
                    {
                      text: 'Mivacron',
                      value: '12199_searchQual1255',
                    },
                    {
                      text: 'Mivacurium Chloride',
                      value: '12199_searchQual1256',
                    },
                    {
                      text: 'Motorcycle Accident',
                      value: '9271_searchQual1257',
                    },
                    {
                      text: 'Moxifloxacin HCl',
                      value: '8821_searchQual1258',
                    },
                    {
                      text: 'Mucopolysaccharidosis',
                      value: '13901_searchQual1259',
                    },
                    {
                      text: 'Multigated Graft Acquisition Scan',
                      value: '2717_searchQual1260',
                    },
                    {
                      text: 'Mumps Virus Vaccine Live',
                      value: '3198_searchQual1261',
                    },
                    {
                      text: 'Mumps and Rubella Vac',
                      value: '3198_searchQual1262',
                    },
                    {
                      text: 'Mumps vaccine',
                      value: '3198_searchQual1263',
                    },
                    {
                      text: 'Mycobacterium Avium',
                      value: '4290_searchQual1264',
                    },
                    {
                      text: 'Mycobacterium Avium Complex',
                      value: '4290_searchQual1265',
                    },
                    {
                      text: 'Mycophenolic Acid',
                      value: '13886_searchQual1266',
                    },
                    {
                      text: 'NLDO (Nasolacrimal Duct Obstruction)',
                      value: '3646_searchQual1267',
                    },
                    {
                      text: 'Nalidixic Acid',
                      value: '12229_searchQual1268',
                    },
                    {
                      text: 'Nasacort AQ',
                      value: '12196_searchQual1269',
                    },
                    {
                      text: 'Nasal Bone Fracture',
                      value: '100389_searchQual1270',
                    },
                    {
                      text: 'Nasal Packing',
                      value: '3113_searchQual1271',
                    },
                    {
                      text: 'Nasolacrimal Duct Obstruction',
                      value: '3646_searchQual1272',
                    },
                    {
                      text: 'Natacyn',
                      value: '12202_searchQual1273',
                    },
                    {
                      text: 'Navicular Bone Fracture',
                      value: '8155_searchQual1274',
                    },
                    {
                      text: 'Neck Brace',
                      value: '3002_searchQual1275',
                    },
                    {
                      text: 'Neck Fracture',
                      value: '10009_searchQual1276',
                    },
                    {
                      text: 'Neomycin-Bacitracin -Polymyxin (Ophthalmic)',
                      value: '12202_searchQual1277',
                    },
                    {
                      text: 'Nepafenac',
                      value: '12202_searchQual1278',
                    },
                    {
                      text: 'Nephritis (Acute)',
                      value: '12367_searchQual1279',
                    },
                    {
                      text: 'Nervous Stomach',
                      value: '14309_searchQual1280',
                    },
                    {
                      text: 'Niacin',
                      value: '10482_searchQual1281',
                    },
                    {
                      text: 'Niacin Flush Free',
                      value: '13797_searchQual1282',
                    },
                    {
                      text: 'Niacin SR',
                      value: '10482_searchQual1283',
                    },
                    {
                      text: 'Niacin-Lovastatin ER',
                      value: '10500_searchQual1284',
                    },
                    {
                      text: 'Niacin-Simvastatin ER',
                      value: '10503_searchQual1285',
                    },
                    {
                      text: 'Niacinol',
                      value: '13797_searchQual1286',
                    },
                    {
                      text: 'Niacor',
                      value: '10482_searchQual1287',
                    },
                    {
                      text: 'Nicotinic Acid Deficiency',
                      value: '7840_searchQual1288',
                    },
                    {
                      text: 'Nifediac',
                      value: '10815_searchQual1289',
                    },
                    {
                      text: 'Nodular Opacity',
                      value: '100459_searchQual1290',
                    },
                    {
                      text: 'Norethindrone Acetate and Ethinyl Estradiol',
                      value: '12139_searchQual1291',
                    },
                    {
                      text: 'Norethindrone Acetate and Ethinyl Estradiol and Ferrous Fumarate',
                      value: '12139_searchQual1292',
                    },
                    {
                      text: 'Norfloxacin',
                      value: '12163_searchQual1293',
                    },
                    {
                      text: 'Norpace',
                      value: '13768_searchQual1294',
                    },
                    {
                      text: 'Nose Fracture',
                      value: '100389_searchQual1295',
                    },
                    {
                      text: 'Nurse Practitioner (visit)',
                      value: '2817_searchQual1296',
                    },
                    {
                      text: 'Nutracort',
                      value: '10422_searchQual1297',
                    },
                    {
                      text: 'Obstructed Lacrimal Duct',
                      value: '3646_searchQual1298',
                    },
                    {
                      text: 'Octreotide Acetate',
                      value: '11956_searchQual1299',
                    },
                    {
                      text: 'Ofloxacin',
                      value: '12163_searchQual1300',
                    },
                    {
                      text: 'Omacor',
                      value: '13796_searchQual1301',
                    },
                    {
                      text: 'Omadacycline',
                      value: '2969_searchQual1302',
                    },
                    {
                      text: 'Omega-3 Polyunsaturated Fatty Acids',
                      value: '13796_searchQual1303',
                    },
                    {
                      text: 'Optic Disc Opacity',
                      value: '100642_searchQual1304',
                    },
                    {
                      text: 'Optic Papilla Opacity',
                      value: '100642_searchQual1305',
                    },
                    {
                      text: 'Oral Maxillofacial Surgeon (visit)',
                      value: '2817_searchQual1306',
                    },
                    {
                      text: 'Organic Headache',
                      value: '4659_searchQual1307',
                    },
                    {
                      text: 'Osteomalacia',
                      value: '4493_searchQual1308',
                    },
                    {
                      text: 'Overactive Bladder',
                      value: '9550_searchQual1309',
                    },
                    {
                      text: 'Overactive Parathyroid',
                      value: '3549_searchQual1310',
                    },
                    {
                      text: 'Overactive Parathyroid Gland',
                      value: '3549_searchQual1311',
                    },
                    {
                      text: 'Overactive Thyroid',
                      value: '3551_searchQual1312',
                    },
                    {
                      text: 'Overactive Thyroid Gland',
                      value: '3551_searchQual1313',
                    },
                    {
                      text: 'Oxacillin Sodium (injection)',
                      value: '9058_searchQual1314',
                    },
                    {
                      text: 'Oxacillin Sodium in Dextrose',
                      value: '9058_searchQual1315',
                    },
                    {
                      text: 'PCL (Posterior Cruciate Ligament) Ache',
                      value: '7900_searchQual1316',
                    },
                    {
                      text: 'PCV (Packed Cell Volume)',
                      value: '2609_searchQual1317',
                    },
                    {
                      text: 'PEG 3350-KCl-Na Bicarb-NaCl',
                      value: '3093_searchQual1318',
                    },
                    {
                      text: 'PEG 3350-KCl-NaBcb-NaCl-NaSulf',
                      value: '3093_searchQual1319',
                    },
                    {
                      text: 'PEG-KCl-NaCl-NaSulf-Na Asc-C',
                      value: '3093_searchQual1320',
                    },
                    {
                      text: 'PF (Pemphigus foliaceus)',
                      value: '7876_searchQual1321',
                    },
                    {
                      text: 'PRA (Plasma Renin Activity)',
                      value: '2782_searchQual1322',
                    },
                    {
                      text: 'PRL (Prolactin) Levels',
                      value: '2760_searchQual1323',
                    },
                    {
                      text: 'Pacemaker',
                      value: '100573_searchQual1324',
                    },
                    {
                      text: 'Pacemaker',
                      value: '3125_searchQual1325',
                    },
                    {
                      text: 'Pacemaker Check',
                      value: '2857_searchQual1326',
                    },
                    {
                      text: 'Pacemaker Evaluation',
                      value: '2857_searchQual1327',
                    },
                    {
                      text: 'Pacemaker Monitoring',
                      value: '2857_searchQual1328',
                    },
                    {
                      text: 'Pacemaker Rhythm',
                      value: '100507_searchQual1329',
                    },
                    {
                      text: 'Pacerone',
                      value: '13760_searchQual1330',
                    },
                    {
                      text: 'Pachymeningitis',
                      value: '4685_searchQual1331',
                    },
                    {
                      text: 'Packed Cell Volume',
                      value: '2609_searchQual1332',
                    },
                    {
                      text: 'Paclitaxel',
                      value: '13727_searchQual1333',
                    },
                    {
                      text: 'Painful Back',
                      value: '7516_searchQual1334',
                    },
                    {
                      text: 'Painful Subacute Thyroiditis',
                      value: '3513_searchQual1335',
                    },
                    {
                      text: 'Pancreas Displacement',
                      value: '100412_searchQual1336',
                    },
                    {
                      text: 'Pancreatitis (acute)',
                      value: '7462_searchQual1337',
                    },
                    {
                      text: 'Panic Attack',
                      value: '5111_searchQual1338',
                    },
                    {
                      text: 'Papular Acrodermatitis of Childhood',
                      value: '3336_searchQual1339',
                    },
                    {
                      text: 'Papulovesicular Acro-located Syndrome',
                      value: '3336_searchQual1340',
                    },
                    {
                      text: 'Paracentesis',
                      value: '2305_searchQual1341',
                    },
                    {
                      text: 'Paracentesis',
                      value: '14101_searchQual1342',
                    },
                    {
                      text: 'Paracetamol',
                      value: '3127_searchQual1343',
                    },
                    {
                      text: 'Paracetamol with  Codeine',
                      value: '12085_searchQual1344',
                    },
                    {
                      text: 'Paracetamol-Codeine',
                      value: '12085_searchQual1345',
                    },
                    {
                      text: 'Paracetamol/Salicylate Levels',
                      value: '2306_searchQual1346',
                    },
                    {
                      text: 'Parathormone Intact Molecule',
                      value: '2726_searchQual1347',
                    },
                    {
                      text: 'Paroxysmal Supraventricular Tachycardia',
                      value: '3469_searchQual1348',
                    },
                    {
                      text: 'Paroxysmal Tachycardia',
                      value: '3469_searchQual1349',
                    },
                    {
                      text: 'Patellar Fracture',
                      value: '8509_searchQual1350',
                    },
                    {
                      text: 'Patulous Eustachian Tube',
                      value: '100228_searchQual1351',
                    },
                    {
                      text: 'Peginesatide Acetate',
                      value: '11971_searchQual1352',
                    },
                    {
                      text: 'Pelvic Fracture',
                      value: '13636_searchQual1353',
                    },
                    {
                      text: 'Pelvis Bone Fracture Repair',
                      value: '101717_searchQual1354',
                    },
                    {
                      text: 'Pelvis Fracture',
                      value: '13636_searchQual1355',
                    },
                    {
                      text: 'Pemphigus foliaceus',
                      value: '7876_searchQual1356',
                    },
                    {
                      text: 'Penlac',
                      value: '12103_searchQual1357',
                    },
                    {
                      text: 'Pentacel',
                      value: '12220_searchQual1358',
                    },
                    {
                      text: 'Percutaneous Biliary Stent Placement',
                      value: '3129_searchQual1359',
                    },
                    {
                      text: 'Perfusion Imaging (Cardiac)',
                      value: '2838_searchQual1360',
                    },
                    {
                      text: 'Pericarditis (Acute)',
                      value: '3304_searchQual1361',
                    },
                    {
                      text: 'Perineal Laceration',
                      value: '8038_searchQual1362',
                    },
                    {
                      text: 'Peripheral Activators',
                      value: '3131_searchQual1363',
                    },
                    {
                      text: 'Peripheral Facial Palsy',
                      value: '4575_searchQual1364',
                    },
                    {
                      text: 'Permanent Brachytherapy',
                      value: '2989_searchQual1365',
                    },
                    {
                      text: 'Pharmacologic Stress Test',
                      value: '13333_searchQual1366',
                    },
                    {
                      text: 'Pharmacotherapy',
                      value: '3132_searchQual1367',
                    },
                    {
                      text: 'Photocontact Dermatitis',
                      value: '14282_searchQual1368',
                    },
                    {
                      text: 'Physical Exam and History for Urinary Tract Infection',
                      value: '12346_searchQual1369',
                    },
                    {
                      text: 'Piperacillin Sodium (injection)',
                      value: '9058_searchQual1370',
                    },
                    {
                      text: 'Piperacillin Sodium-D5W',
                      value: '9058_searchQual1371',
                    },
                    {
                      text: 'Piperacillin-Tazobactam',
                      value: '9058_searchQual1372',
                    },
                    {
                      text: 'Pipracil in D5W',
                      value: '9058_searchQual1373',
                    },
                    {
                      text: 'Pirbuterol Acetate',
                      value: '11340_searchQual1374',
                    },
                    {
                      text: 'Pituitary Cachexia',
                      value: '3585_searchQual1375',
                    },
                    {
                      text: 'Pityriasis Simplex Facial',
                      value: '100962_searchQual1376',
                    },
                    {
                      text: 'Placenta Cancer',
                      value: '14249_searchQual1377',
                    },
                    {
                      text: 'Placenta Carcinoma',
                      value: '4888_searchQual1378',
                    },
                    {
                      text: 'Placenta Choriocarcinoma',
                      value: '14249_searchQual1379',
                    },
                    {
                      text: 'Placenta Praevia',
                      value: '4039_searchQual1380',
                    },
                    {
                      text: 'Placenta Previa',
                      value: '4039_searchQual1381',
                    },
                    {
                      text: 'Placenta Site Trophoblastic Cancer',
                      value: '4888_searchQual1382',
                    },
                    {
                      text: 'Placenta Site Trophoblastic Tumor',
                      value: '9595_searchQual1383',
                    },
                    {
                      text: 'Plaque Extraction',
                      value: '2493_searchQual1384',
                    },
                    {
                      text: 'Plasma Renin Activity',
                      value: '2782_searchQual1385',
                    },
                    {
                      text: 'Plasma Renin Activity (PRA) Test',
                      value: '2782_searchQual1386',
                    },
                    {
                      text: 'Plasma Replacement Therapy',
                      value: '101702_searchQual1387',
                    },
                    {
                      text: 'Plasmacytoma',
                      value: '4167_searchQual1388',
                    },
                    {
                      text: 'Pneumoccocal vaccine',
                      value: '3198_searchQual1389',
                    },
                    {
                      text: 'Pneumococcal 13-Val Conj Vacc',
                      value: '3198_searchQual1390',
                    },
                    {
                      text: 'Pneumonia (Acute Eosinophilic)',
                      value: '5271_searchQual1391',
                    },
                    {
                      text: 'Pneumonia (Acute Interstitial)',
                      value: '5274_searchQual1392',
                    },
                    {
                      text: 'Pneumonitis (Acute Interstitial)',
                      value: '5274_searchQual1393',
                    },
                    {
                      text: 'Pneumothoraces',
                      value: '5275_searchQual1394',
                    },
                    {
                      text: 'Polio vaccine',
                      value: '3198_searchQual1395',
                    },
                    {
                      text: 'Polyethylene glycol-electrolyte solution-Bisacodyl',
                      value: '3093_searchQual1396',
                    },
                    {
                      text: 'Polypectomy (Stomach)',
                      value: '101886_searchQual1397',
                    },
                    {
                      text: 'Pontiac Fever',
                      value: '4277_searchQual1398',
                    },
                    {
                      text: 'Poor Stomach Elasticity',
                      value: '100626_searchQual1399',
                    },
                    {
                      text: 'Porphyria (Acute Intermittent)',
                      value: '4174_searchQual1400',
                    },
                    {
                      text: 'Post-Operative Stomach',
                      value: '100414_searchQual1401',
                    },
                    {
                      text: 'Post-cardiac Injury Syndrome',
                      value: '14255_searchQual1402',
                    },
                    {
                      text: 'Posterior Cruciate Ligament Ache',
                      value: '7900_searchQual1403',
                    },
                    {
                      text: 'Posterior Vitreous Detachment',
                      value: '3777_searchQual1404',
                    },
                    {
                      text: 'Postural Orthostatic Tachycardia Syndrome',
                      value: '13108_searchQual1405',
                    },
                    {
                      text: 'Potassium Citrate-Citric Acid',
                      value: '12169_searchQual1406',
                    },
                    {
                      text: 'Pravachol',
                      value: '10509_searchQual1407',
                    },
                    {
                      text: 'Pravigard Pac',
                      value: '3173_searchQual1408',
                    },
                    {
                      text: 'Pregnancy Back Pain',
                      value: '101875_searchQual1409',
                    },
                    {
                      text: 'Pregnancy-related back pain',
                      value: '101875_searchQual1410',
                    },
                    {
                      text: 'Premature Atrial Contractions (PACs)',
                      value: '12427_searchQual1411',
                    },
                    {
                      text: 'Premature Contractions (Heart)',
                      value: '3471_searchQual1412',
                    },
                    {
                      text: 'Premature Ejaculation',
                      value: '4046_searchQual1413',
                    },
                    {
                      text: 'Premature Ventricular Contractions (PVCs)',
                      value: '12517_searchQual1414',
                    },
                    {
                      text: 'Prescription For Spectacles',
                      value: '3060_searchQual1415',
                    },
                    {
                      text: 'Primacor',
                      value: '13726_searchQual1416',
                    },
                    {
                      text: 'Prolactin Levels',
                      value: '2760_searchQual1417',
                    },
                    {
                      text: 'Prolactinoma',
                      value: '5067_searchQual1418',
                    },
                    {
                      text: 'Promacta',
                      value: '100988_searchQual1419',
                    },
                    {
                      text: 'Proparacaine HCl',
                      value: '12202_searchQual1420',
                    },
                    {
                      text: 'Proparacaine-Fluorescein',
                      value: '12202_searchQual1421',
                    },
                    {
                      text: 'Propylthiouracil',
                      value: '10554_searchQual1422',
                    },
                    {
                      text: 'Prozac',
                      value: '13477_searchQual1423',
                    },
                    {
                      text: 'Psittacosis',
                      value: '4298_searchQual1424',
                    },
                    {
                      text: 'Public Road Accident',
                      value: '100260_searchQual1425',
                    },
                    {
                      text: 'Pulmonary Circular Opacity',
                      value: '100451_searchQual1426',
                    },
                    {
                      text: 'Pulmonic Valve Replacement',
                      value: '8902_searchQual1427',
                    },
                    {
                      text: 'Pyramidal Tract Disease',
                      value: '14194_searchQual1428',
                    },
                    {
                      text: 'Pyramidal Tract Syndrome',
                      value: '14194_searchQual1429',
                    },
                    {
                      text: 'Pyroglutamic Acidosis',
                      value: '100301_searchQual1430',
                    },
                    {
                      text: 'Quinacrine HCl',
                      value: '12109_searchQual1431',
                    },
                    {
                      text: 'RAIU (Radioactive Iodine Uptake)',
                      value: '2780_searchQual1432',
                    },
                    {
                      text: 'RH disease vaccine',
                      value: '12205_searchQual1433',
                    },
                    {
                      text: 'RTA (Renal Tubular Acidosis)',
                      value: '4065_searchQual1434',
                    },
                    {
                      text: 'Rabies vaccine',
                      value: '3198_searchQual1435',
                    },
                    {
                      text: 'Racepinephrine HCI',
                      value: '11415_searchQual1436',
                    },
                    {
                      text: 'Rachicentesis',
                      value: '2442_searchQual1437',
                    },
                    {
                      text: 'Rachiocentesis',
                      value: '2442_searchQual1438',
                    },
                    {
                      text: 'Rachitis',
                      value: '4515_searchQual1439',
                    },
                    {
                      text: 'Radial Displacement',
                      value: '8104_searchQual1440',
                    },
                    {
                      text: 'Radial Fracture',
                      value: '100784_searchQual1441',
                    },
                    {
                      text: 'Radiation Cataract',
                      value: '100370_searchQual1442',
                    },
                    {
                      text: 'Radioactive Iodine Therapy',
                      value: '3148_searchQual1443',
                    },
                    {
                      text: 'Radioactive Iodine Uptake',
                      value: '2780_searchQual1444',
                    },
                    {
                      text: 'Radioactive Iodine Uptake Test',
                      value: '2780_searchQual1445',
                    },
                    {
                      text: 'Radioactive Thyroid Scan',
                      value: '2780_searchQual1446',
                    },
                    {
                      text: 'Radius Fracture',
                      value: '100784_searchQual1447',
                    },
                    {
                      text: 'Rarefaction Of Bone',
                      value: '4497_searchQual1448',
                    },
                    {
                      text: 'Reactive Airway Disease',
                      value: '13117_searchQual1449',
                    },
                    {
                      text: 'Reactive Amyloidoses',
                      value: '4104_searchQual1450',
                    },
                    {
                      text: 'Reactive Arthritis',
                      value: '4394_searchQual1451',
                    },
                    {
                      text: 'Reactive Depression',
                      value: '5132_searchQual1452',
                    },
                    {
                      text: 'Reactive Thrombocythemia',
                      value: '4199_searchQual1453',
                    },
                    {
                      text: 'Reactive Thrombocytosis',
                      value: '4199_searchQual1454',
                    },
                    {
                      text: 'Reattachment',
                      value: '101242_searchQual1455',
                    },
                    {
                      text: 'Refraction Test',
                      value: '2788_searchQual1456',
                    },
                    {
                      text: 'Renal Acute Injury',
                      value: '4062_searchQual1457',
                    },
                    {
                      text: 'Renal Tubular Acidosis',
                      value: '4065_searchQual1458',
                    },
                    {
                      text: 'Reticular Opacity',
                      value: '100485_searchQual1459',
                    },
                    {
                      text: 'Retinal Detachment',
                      value: '3741_searchQual1460',
                    },
                    {
                      text: 'Retinal Detachment Repair',
                      value: '101243_searchQual1461',
                    },
                    {
                      text: 'Retinal Detachment Surgery',
                      value: '101243_searchQual1462',
                    },
                    {
                      text: 'Revefenacin',
                      value: '100987_searchQual1463',
                    },
                    {
                      text: 'Rexaphenac',
                      value: '10446_searchQual1464',
                    },
                    {
                      text: 'Rh Factor Incompatibility',
                      value: '4182_searchQual1465',
                    },
                    {
                      text: 'Rhegmatogenous Retinal Detachment',
                      value: '12418_searchQual1466',
                    },
                    {
                      text: 'Rhesus Factor',
                      value: '2397_searchQual1467',
                    },
                    {
                      text: 'Rheumatoid Factor (RF)',
                      value: '8362_searchQual1468',
                    },
                    {
                      text: 'Rhophylac',
                      value: '12205_searchQual1469',
                    },
                    {
                      text: 'Rib Fracture',
                      value: '8494_searchQual1470',
                    },
                    {
                      text: 'Rib Fracture Scarring',
                      value: '100474_searchQual1471',
                    },
                    {
                      text: 'Robitussin AC',
                      value: '100106_searchQual1472',
                    },
                    {
                      text: 'Rosacea',
                      value: '3428_searchQual1473',
                    },
                    {
                      text: 'Rotavirus Vac Live Pentavalent',
                      value: '3198_searchQual1474',
                    },
                    {
                      text: 'Rotavirus Vaccine',
                      value: '3198_searchQual1475',
                    },
                    {
                      text: 'Rotavirus Vaccine Live Oral',
                      value: '3198_searchQual1476',
                    },
                    {
                      text: 'Roundback',
                      value: '4448_searchQual1477',
                    },
                    {
                      text: 'Routine Pacemaker Check',
                      value: '2857_searchQual1478',
                    },
                    {
                      text: 'Rubella Virus Vaccine',
                      value: '3198_searchQual1479',
                    },
                    {
                      text: 'Rubella vaccine',
                      value: '3198_searchQual1480',
                    },
                    {
                      text: 'SACE (Serum Angiotensin Converting Enzyme) Levels',
                      value: '2338_searchQual1481',
                    },
                    {
                      text: 'SARS (Severe Acute Respiratory Syndrome)',
                      value: '5287_searchQual1482',
                    },
                    {
                      text: 'SBP (Spontaneous Bacterial Peritonitis)',
                      value: '4319_searchQual1483',
                    },
                    {
                      text: 'SGOT (Serum Glutamic Oxaloacetic Transaminase)',
                      value: '2373_searchQual1484',
                    },
                    {
                      text: 'Saccharomyces Boulardii',
                      value: '2948_searchQual1485',
                    },
                    {
                      text: 'Sacral Fracture',
                      value: '10090_searchQual1486',
                    },
                    {
                      text: 'Sacral Spinal Ankylosis',
                      value: '101802_searchQual1487',
                    },
                    {
                      text: 'Sacrococcygeal Cyst',
                      value: '101840_searchQual1488',
                    },
                    {
                      text: 'Sacrococcygeal Fistula',
                      value: '101840_searchQual1489',
                    },
                    {
                      text: 'Sacrocolpopexy',
                      value: '101215_searchQual1490',
                    },
                    {
                      text: 'Sacroiliac Hypermobility',
                      value: '100307_searchQual1491',
                    },
                    {
                      text: 'Sacroiliac Joint Fusion',
                      value: '14447_searchQual1492',
                    },
                    {
                      text: 'Sacroiliac Joint Inflammation',
                      value: '4517_searchQual1493',
                    },
                    {
                      text: 'Sacroiliitis',
                      value: '4517_searchQual1494',
                    },
                    {
                      text: 'Sacubitril and Valsartan',
                      value: '13754_searchQual1495',
                    },
                    {
                      text: 'Sacubitril-Valsartan',
                      value: '13754_searchQual1496',
                    },
                    {
                      text: 'Sacubitril/Valsartan',
                      value: '13754_searchQual1497',
                    },
                    {
                      text: 'Saddle Back',
                      value: '4457_searchQual1498',
                    },
                    {
                      text: 'Salacyn',
                      value: '11046_searchQual1499',
                    },
                    {
                      text: 'Salicylic Acid',
                      value: '11046_searchQual1500',
                    },
                    {
                      text: 'Salicylic Acid-Benzoic Acid',
                      value: '11049_searchQual1501',
                    },
                    {
                      text: 'Salpingitis Eustachian',
                      value: '3722_searchQual1502',
                    },
                    {
                      text: 'Scan, Cardiac Blood Pool',
                      value: '2717_searchQual1503',
                    },
                    {
                      text: 'Scaphoid Bone Fracture',
                      value: '8227_searchQual1504',
                    },
                    {
                      text: 'Scapula Fracture',
                      value: '14281_searchQual1505',
                    },
                    {
                      text: 'Scapular Fracture',
                      value: '14281_searchQual1506',
                    },
                    {
                      text: 'Scopace',
                      value: '12226_searchQual1507',
                    },
                    {
                      text: 'Sebaceous Cyst',
                      value: '7927_searchQual1508',
                    },
                    {
                      text: 'Second Degree Atrioventricular Block Wenckebach',
                      value: '100609_searchQual1509',
                    },
                    {
                      text: 'Secondary Retinal Detachment',
                      value: '3741_searchQual1510',
                    },
                    {
                      text: 'Senile Cataract',
                      value: '12505_searchQual1511',
                    },
                    {
                      text: 'Serologic Test For B. Anthracis',
                      value: '2807_searchQual1512',
                    },
                    {
                      text: 'Serum Factor VIII Antigen',
                      value: '2550_searchQual1513',
                    },
                    {
                      text: 'Serum Glutamic Oxaloacetic Transaminase (SGOT)',
                      value: '2373_searchQual1514',
                    },
                    {
                      text: 'Serum Glutamic-Oxaloacetic Transaminase Levels',
                      value: '2373_searchQual1515',
                    },
                    {
                      text: 'Serum Iron-Binding Capacity Levels',
                      value: '2852_searchQual1516',
                    },
                    {
                      text: 'Severe Acute Respiratory Syndrome',
                      value: '5287_searchQual1517',
                    },
                    {
                      text: 'Severe Acute Respiratory Syndrome Coronavirus-2',
                      value: '14267_searchQual1518',
                    },
                    {
                      text: 'Severe Acute Respiratory Syndrome Coronavirus-2 Test',
                      value: '14300_searchQual1519',
                    },
                    {
                      text: 'Shortened Lesser Curvature of the Stomach',
                      value: '100433_searchQual1520',
                    },
                    {
                      text: 'Shortness of Breath (Routine Activities)',
                      value: '5603_searchQual1521',
                    },
                    {
                      text: 'Shoulder Ache',
                      value: '7939_searchQual1522',
                    },
                    {
                      text: 'Shoulder Bone Fracture',
                      value: '8200_searchQual1523',
                    },
                    {
                      text: 'Shoulder Bone Fracture Repair',
                      value: '101619_searchQual1524',
                    },
                    {
                      text: 'Shoulder Fracture',
                      value: '8200_searchQual1525',
                    },
                    {
                      text: 'Shoulder Joint Fracture',
                      value: '8200_searchQual1526',
                    },
                    {
                      text: 'Shoulder Replacement',
                      value: '4444_searchQual1527',
                    },
                    {
                      text: 'Sideroachrestic Anemia',
                      value: '4119_searchQual1528',
                    },
                    {
                      text: 'Sideroblastic Anemia (Acquired)',
                      value: '13003_searchQual1529',
                    },
                    {
                      text: 'Sideroblastic Anemia Acquired (Nutritional Imbalance)',
                      value: '13084_searchQual1530',
                    },
                    {
                      text: 'Sideroblastic Anemia Acquired (Toxin Exposure)',
                      value: '13087_searchQual1531',
                    },
                    {
                      text: 'Sideroblastic Anemia Acquired (Underlying Disease)',
                      value: '13090_searchQual1532',
                    },
                    {
                      text: 'Simmonds\' Cachexia',
                      value: '3596_searchQual1533',
                    },
                    {
                      text: 'Simmonds’ Cachexia',
                      value: '3596_searchQual1534',
                    },
                    {
                      text: 'Simple Acne',
                      value: '3335_searchQual1535',
                    },
                    {
                      text: 'Sinus Headache',
                      value: '4660_searchQual1536',
                    },
                    {
                      text: 'Sinus Tachycardia',
                      value: '13682_searchQual1537',
                    },
                    {
                      text: 'Skin Cancer (Acral Lentiginous)',
                      value: '5078_searchQual1538',
                    },
                    {
                      text: 'Skin Reaction Allergy Test',
                      value: '2320_searchQual1539',
                    },
                    {
                      text: 'Skull Bone Fracture Repair',
                      value: '101674_searchQual1540',
                    },
                    {
                      text: 'Skull Fracture',
                      value: '13261_searchQual1541',
                    },
                    {
                      text: 'Slo-Niacin',
                      value: '10482_searchQual1542',
                    },
                    {
                      text: 'Smac20',
                      value: '2700_searchQual1543',
                    },
                    {
                      text: 'Sodium Picosulfate-Mag Oxide-Cit Acid',
                      value: '3093_searchQual1544',
                    },
                    {
                      text: 'Solifenacin Succinate',
                      value: '12232_searchQual1545',
                    },
                    {
                      text: 'Sore Achilles Tendon',
                      value: '7450_searchQual1546',
                    },
                    {
                      text: 'Sore Back',
                      value: '7516_searchQual1547',
                    },
                    {
                      text: 'Spacol T/S',
                      value: '12226_searchQual1548',
                    },
                    {
                      text: 'Spectacle Wearer',
                      value: '3060_searchQual1549',
                    },
                    {
                      text: 'Spinal (Cervical) Fracture',
                      value: '10054_searchQual1550',
                    },
                    {
                      text: 'Spinal (Coccyx) Fracture',
                      value: '10072_searchQual1551',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Fracture',
                      value: '10090_searchQual1552',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Impairment',
                      value: '4528_searchQual1553',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Infection',
                      value: '10093_searchQual1554',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Injury',
                      value: '10096_searchQual1555',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Pain',
                      value: '10099_searchQual1556',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Sprain',
                      value: '10102_searchQual1557',
                    },
                    {
                      text: 'Spinal (Lumbosacral) Swelling',
                      value: '10105_searchQual1558',
                    },
                    {
                      text: 'Spinal (Thoracic) Damage',
                      value: '10287_searchQual1559',
                    },
                    {
                      text: 'Spinal (Thoracic) Fracture',
                      value: '10108_searchQual1560',
                    },
                    {
                      text: 'Spinal (Thoracic) Impairment',
                      value: '4529_searchQual1561',
                    },
                    {
                      text: 'Spinal (Thoracic) Infection',
                      value: '10111_searchQual1562',
                    },
                    {
                      text: 'Spinal (Thoracic) Injury',
                      value: '10114_searchQual1563',
                    },
                    {
                      text: 'Spinal (Thoracic) Pain',
                      value: '10117_searchQual1564',
                    },
                    {
                      text: 'Spinal (Thoracic) Sprain',
                      value: '10120_searchQual1565',
                    },
                    {
                      text: 'Spinal (Thoracic) Swelling',
                      value: '10123_searchQual1566',
                    },
                    {
                      text: 'Spinal Ache',
                      value: '7516_searchQual1567',
                    },
                    {
                      text: 'Spinal Fracture',
                      value: '8209_searchQual1568',
                    },
                    {
                      text: 'Spinal Lumbosacral Fusion',
                      value: '14460_searchQual1569',
                    },
                    {
                      text: 'Spinal Stenosis (Lower Back)',
                      value: '4534_searchQual1570',
                    },
                    {
                      text: 'Spinal Stenosis (Lumbosacral)',
                      value: '4534_searchQual1571',
                    },
                    {
                      text: 'Spinal Stenosis (Middle Back)',
                      value: '4535_searchQual1572',
                    },
                    {
                      text: 'Spinal Stenosis (Thoracic Spine)',
                      value: '4535_searchQual1573',
                    },
                    {
                      text: 'Spine Bone Fracture Repair',
                      value: '101675_searchQual1574',
                    },
                    {
                      text: 'Spironolactone',
                      value: '9241_searchQual1575',
                    },
                    {
                      text: 'Spironolactone-Altizide',
                      value: '101162_searchQual1576',
                    },
                    {
                      text: 'Spironolactone-Hydrochlorothiazide',
                      value: '10854_searchQual1577',
                    },
                    {
                      text: 'Spontaneous Bacterial Peritonitis',
                      value: '4319_searchQual1578',
                    },
                    {
                      text: 'Sprain (Lumbo-sacral Spine)',
                      value: '10102_searchQual1579',
                    },
                    {
                      text: 'Sprain (Lumbosacral Spine)',
                      value: '10102_searchQual1580',
                    },
                    {
                      text: 'Sprain (Thoracic Spine)',
                      value: '10162_searchQual1581',
                    },
                    {
                      text: 'Stereotactic surgery',
                      value: '101912_searchQual1582',
                    },
                    {
                      text: 'Sternum Fracture',
                      value: '8497_searchQual1583',
                    },
                    {
                      text: 'Stiff Achilles Tendon',
                      value: '7450_searchQual1584',
                    },
                    {
                      text: 'Stiff Back',
                      value: '8119_searchQual1585',
                    },
                    {
                      text: 'Stiff Lower Back',
                      value: '10099_searchQual1586',
                    },
                    {
                      text: 'Stiff Lumbosacral Spine',
                      value: '10099_searchQual1587',
                    },
                    {
                      text: 'Stiff Mid Back',
                      value: '10117_searchQual1588',
                    },
                    {
                      text: 'Stiff Thoracic Spine',
                      value: '10117_searchQual1589',
                    },
                    {
                      text: 'Stomach Abscess',
                      value: '3788_searchQual1590',
                    },
                    {
                      text: 'Stomach Ache',
                      value: '3935_searchQual1591',
                    },
                    {
                      text: 'Stomach Acid Levels',
                      value: '2585_searchQual1592',
                    },
                    {
                      text: 'Stomach Acid Test',
                      value: '2824_searchQual1593',
                    },
                    {
                      text: 'Stomach Atrophy',
                      value: '14347_searchQual1594',
                    },
                    {
                      text: 'Stomach Bacteria',
                      value: '3859_searchQual1595',
                    },
                    {
                      text: 'Stomach Bloating',
                      value: '7438_searchQual1596',
                    },
                    {
                      text: 'Stomach Bug',
                      value: '3852_searchQual1597',
                    },
                    {
                      text: 'Stomach Cancer',
                      value: '4898_searchQual1598',
                    },
                    {
                      text: 'Stomach Condition',
                      value: '3937_searchQual1599',
                    },
                    {
                      text: 'Stomach Cramping',
                      value: '3936_searchQual1600',
                    },
                    {
                      text: 'Stomach Cramps',
                      value: '3936_searchQual1601',
                    },
                    {
                      text: 'Stomach Damage',
                      value: '3937_searchQual1602',
                    },
                    {
                      text: 'Stomach Discomfort',
                      value: '3935_searchQual1603',
                    },
                    {
                      text: 'Stomach Disease',
                      value: '3937_searchQual1604',
                    },
                    {
                      text: 'Stomach Disorder',
                      value: '3937_searchQual1605',
                    },
                    {
                      text: 'Stomach Diverticulum',
                      value: '13204_searchQual1606',
                    },
                    {
                      text: 'Stomach Flu',
                      value: '3852_searchQual1607',
                    },
                    {
                      text: 'Stomach Impairment',
                      value: '3937_searchQual1608',
                    },
                    {
                      text: 'Stomach Infection',
                      value: '3851_searchQual1609',
                    },
                    {
                      text: 'Stomach Inflammation',
                      value: '3851_searchQual1610',
                    },
                    {
                      text: 'Stomach Injury',
                      value: '3937_searchQual1611',
                    },
                    {
                      text: 'Stomach Lining Inflammation',
                      value: '3851_searchQual1612',
                    },
                    {
                      text: 'Stomach Pain',
                      value: '3935_searchQual1613',
                    },
                    {
                      text: 'Stomach Polyp',
                      value: '12451_searchQual1614',
                    },
                    {
                      text: 'Stomach Problem',
                      value: '3937_searchQual1615',
                    },
                    {
                      text: 'Stomach Pumped',
                      value: '3178_searchQual1616',
                    },
                    {
                      text: 'Stomach Pumping',
                      value: '2588_searchQual1617',
                    },
                    {
                      text: 'Stomach Surgery',
                      value: '100277_searchQual1618',
                    },
                    {
                      text: 'Stomach Trouble',
                      value: '3937_searchQual1619',
                    },
                    {
                      text: 'Stomach Tube',
                      value: '3179_searchQual1620',
                    },
                    {
                      text: 'Stomach Tube Insertion',
                      value: '3179_searchQual1621',
                    },
                    {
                      text: 'Stomach Tumor',
                      value: '7972_searchQual1622',
                    },
                    {
                      text: 'Stomach Ulcer',
                      value: '3942_searchQual1623',
                    },
                    {
                      text: 'Stomach Ulcer Test',
                      value: '2608_searchQual1624',
                    },
                    {
                      text: 'Stomach Virus',
                      value: '12496_searchQual1625',
                    },
                    {
                      text: 'Stress Fracture',
                      value: '10150_searchQual1626',
                    },
                    {
                      text: 'Stress Fracture (Bone)',
                      value: '10150_searchQual1627',
                    },
                    {
                      text: 'Subacromial Smoothing',
                      value: '9043_searchQual1628',
                    },
                    {
                      text: 'Subacrominal Bursitis',
                      value: '4399_searchQual1629',
                    },
                    {
                      text: 'Subacute Bacterial Endocarditis (SBE)',
                      value: '3273_searchQual1630',
                    },
                    {
                      text: 'Subacute Granulomatous Thyroiditis',
                      value: '3513_searchQual1631',
                    },
                    {
                      text: 'Subacute Nonsuppurative Thyroiditis',
                      value: '3513_searchQual1632',
                    },
                    {
                      text: 'Subacute Osteomyelitis',
                      value: '4378_searchQual1633',
                    },
                    {
                      text: 'Subacute Sinusitis',
                      value: '3755_searchQual1634',
                    },
                    {
                      text: 'Subacute Spongiform Encephalopathy',
                      value: '4611_searchQual1635',
                    },
                    {
                      text: 'Subacute Thyroiditis',
                      value: '3513_searchQual1636',
                    },
                    {
                      text: 'Subarachnoid Haemorrhage',
                      value: '4767_searchQual1637',
                    },
                    {
                      text: 'Subarachnoid Hemorrhage',
                      value: '4767_searchQual1638',
                    },
                    {
                      text: 'Sulfacetamide Sodium',
                      value: '12202_searchQual1639',
                    },
                    {
                      text: 'Sulfacetamide-Prednisolone',
                      value: '12202_searchQual1640',
                    },
                    {
                      text: 'Sulfuric Acid-Sulfonated Phenolics',
                      value: '12214_searchQual1641',
                    },
                    {
                      text: 'Sulindac',
                      value: '12079_searchQual1642',
                    },
                    {
                      text: 'Super Bacterium',
                      value: '4240_searchQual1643',
                    },
                    {
                      text: 'Supraventricular Tachycardia',
                      value: '3469_searchQual1644',
                    },
                    {
                      text: 'Surfactant Deficiency Disorder (SDD)',
                      value: '14339_searchQual1645',
                    },
                    {
                      text: 'Sway Back',
                      value: '4457_searchQual1646',
                    },
                    {
                      text: 'Swollen Back',
                      value: '7519_searchQual1647',
                    },
                    {
                      text: 'Swollen Lower Back',
                      value: '10105_searchQual1648',
                    },
                    {
                      text: 'Swollen Lumbosacral Spine',
                      value: '10105_searchQual1649',
                    },
                    {
                      text: 'Swollen Mid Back',
                      value: '10123_searchQual1650',
                    },
                    {
                      text: 'Swollen Stomach',
                      value: '7438_searchQual1651',
                    },
                    {
                      text: 'Swollen Thoracic Spine',
                      value: '10290_searchQual1652',
                    },
                    {
                      text: 'Syndrome X (Cardiac)',
                      value: '3250_searchQual1653',
                    },
                    {
                      text: 'TB (Tuberculosis) Chronic Active',
                      value: '5298_searchQual1654',
                    },
                    {
                      text: 'TB (Tuberculosis) Chronic Inactive',
                      value: '5298_searchQual1655',
                    },
                    {
                      text: 'TD (Tay-Sachs Disease)',
                      value: '3598_searchQual1656',
                    },
                    {
                      text: 'TIA (Transient Ischemic Attack)',
                      value: '4785_searchQual1657',
                    },
                    {
                      text: 'TIBC (Total Iron Binding Capacity) Levels',
                      value: '2852_searchQual1658',
                    },
                    {
                      text: 'TOS (Thoracic Outlet Syndrome)',
                      value: '4780_searchQual1659',
                    },
                    {
                      text: 'TRAP (Tartrate Resistant Acid Phosphatase) Levels',
                      value: '2832_searchQual1660',
                    },
                    {
                      text: 'Tachycardia',
                      value: '3480_searchQual1661',
                    },
                    {
                      text: 'Tachypnea',
                      value: '5296_searchQual1662',
                    },
                    {
                      text: 'Tacrine Hydrochloride',
                      value: '11746_searchQual1663',
                    },
                    {
                      text: 'Tacrolimus',
                      value: '13738_searchQual1664',
                    },
                    {
                      text: 'Tacrolimus Ointment',
                      value: '10189_searchQual1665',
                    },
                    {
                      text: 'Tacrolimus Topical',
                      value: '10189_searchQual1666',
                    },
                    {
                      text: 'Tartrate Resistant Acid Phosphatase Levels',
                      value: '2832_searchQual1667',
                    },
                    {
                      text: 'Tay-Sachs Disease',
                      value: '3598_searchQual1668',
                    },
                    {
                      text: 'Tay-Sachs Test',
                      value: '2392_searchQual1669',
                    },
                    {
                      text: 'Tazorac',
                      value: '11052_searchQual1670',
                    },
                    {
                      text: 'Teeth Bleaching',
                      value: '2493_searchQual1671',
                    },
                    {
                      text: 'Teeth Fracture',
                      value: '14161_searchQual1672',
                    },
                    {
                      text: 'Temporary Brachytherapy',
                      value: '2989_searchQual1673',
                    },
                    {
                      text: 'Tender Achilles Tendon',
                      value: '7450_searchQual1674',
                    },
                    {
                      text: 'Tendon Achilles Tear',
                      value: '101810_searchQual1675',
                    },
                    {
                      text: 'Tension Type Headache',
                      value: '4662_searchQual1676',
                    },
                    {
                      text: 'Tesamorelin Acetate',
                      value: '12040_searchQual1677',
                    },
                    {
                      text: 'Tetanus Vaccination',
                      value: '12220_searchQual1678',
                    },
                    {
                      text: 'Tetanus Vaccine',
                      value: '12220_searchQual1679',
                    },
                    {
                      text: 'Tetanus and Polio vaccine',
                      value: '12220_searchQual1680',
                    },
                    {
                      text: 'Tetracaine HCl',
                      value: '12202_searchQual1681',
                    },
                    {
                      text: 'Tetracycline HCl',
                      value: '12217_searchQual1682',
                    },
                    {
                      text: 'Tetracyclines',
                      value: '12217_searchQual1683',
                    },
                    {
                      text: 'Tetrofosmin Scintigraphy (Cardiac)',
                      value: '2838_searchQual1684',
                    },
                    {
                      text: 'Therapy with Bacteriophages',
                      value: '2987_searchQual1685',
                    },
                    {
                      text: 'Thoracentesis',
                      value: '2747_searchQual1686',
                    },
                    {
                      text: 'Thoracentesis',
                      value: '8971_searchQual1687',
                    },
                    {
                      text: 'Thoracic Adipose Tissue',
                      value: '100464_searchQual1688',
                    },
                    {
                      text: 'Thoracic Aneurysm',
                      value: '3322_searchQual1689',
                    },
                    {
                      text: 'Thoracic Aortic Aneurysm',
                      value: '3322_searchQual1690',
                    },
                    {
                      text: 'Thoracic Aortogram',
                      value: '2362_searchQual1691',
                    },
                    {
                      text: 'Thoracic Brachial Ganglia Syndrome',
                      value: '101904_searchQual1692',
                    },
                    {
                      text: 'Thoracic Disc Herniation',
                      value: '12472_searchQual1693',
                    },
                    {
                      text: 'Thoracic Drainage',
                      value: '101722_searchQual1694',
                    },
                    {
                      text: 'Thoracic Fracture',
                      value: '10108_searchQual1695',
                    },
                    {
                      text: 'Thoracic Gas Volume Levels',
                      value: '2400_searchQual1696',
                    },
                    {
                      text: 'Thoracic Outlet Syndrome',
                      value: '4780_searchQual1697',
                    },
                    {
                      text: 'Thoracic Radiculopathy',
                      value: '12472_searchQual1698',
                    },
                    {
                      text: 'Thoracic Specialist (visit)',
                      value: '2817_searchQual1699',
                    },
                    {
                      text: 'Thoracic Spinal Ankylosis',
                      value: '101800_searchQual1700',
                    },
                    {
                      text: 'Thoracic Spinal Arthralgia',
                      value: '101791_searchQual1701',
                    },
                    {
                      text: 'Thoracic Spinal Compression',
                      value: '100298_searchQual1702',
                    },
                    {
                      text: 'Thoracic Spinal Degeneration',
                      value: '7606_searchQual1703',
                    },
                    {
                      text: 'Thoracic Spinal Fracture',
                      value: '10108_searchQual1704',
                    },
                    {
                      text: 'Thoracic Spinal Syndrome',
                      value: '4529_searchQual1705',
                    },
                    {
                      text: 'Thoracic Spine Condition',
                      value: '4529_searchQual1706',
                    },
                    {
                      text: 'Thoracic Spine Damage',
                      value: '7996_searchQual1707',
                    },
                    {
                      text: 'Thoracic Spine Disease',
                      value: '4529_searchQual1708',
                    },
                    {
                      text: 'Thoracic Spine Disorder',
                      value: '4529_searchQual1709',
                    },
                    {
                      text: 'Thoracic Spine Fracture',
                      value: '10153_searchQual1710',
                    },
                    {
                      text: 'Thoracic Spine Impairment',
                      value: '10156_searchQual1711',
                    },
                    {
                      text: 'Thoracic Spine Infection',
                      value: '7999_searchQual1712',
                    },
                    {
                      text: 'Thoracic Spine Inflammation',
                      value: '10290_searchQual1713',
                    },
                    {
                      text: 'Thoracic Spine Injury',
                      value: '10287_searchQual1714',
                    },
                    {
                      text: 'Thoracic Spine Pain',
                      value: '10159_searchQual1715',
                    },
                    {
                      text: 'Thoracic Spine Problem',
                      value: '4529_searchQual1716',
                    },
                    {
                      text: 'Thoracic Spine Sprain',
                      value: '10162_searchQual1717',
                    },
                    {
                      text: 'Thoracic Spine Swelling',
                      value: '10290_searchQual1718',
                    },
                    {
                      text: 'Thoracic Spine Syndrome',
                      value: '4529_searchQual1719',
                    },
                    {
                      text: 'Thoracic Spondylolisthesis',
                      value: '100123_searchQual1720',
                    },
                    {
                      text: 'Thoracic Spondylolysis',
                      value: '13621_searchQual1721',
                    },
                    {
                      text: 'Thoracic Spondylosis',
                      value: '13267_searchQual1722',
                    },
                    {
                      text: 'Thoracic Strain',
                      value: '10162_searchQual1723',
                    },
                    {
                      text: 'Thoracic Thermography',
                      value: '2840_searchQual1724',
                    },
                    {
                      text: 'Thoracic Vertebra Syndrome',
                      value: '4529_searchQual1725',
                    },
                    {
                      text: 'Thoracic Vertebral Arthralgia',
                      value: '101791_searchQual1726',
                    },
                    {
                      text: 'Thoracic Vertebral Compression',
                      value: '100298_searchQual1727',
                    },
                    {
                      text: 'Thoracic Vertebral Degeneration',
                      value: '7606_searchQual1728',
                    },
                    {
                      text: 'Thoracic Vertebral Fracture',
                      value: '10153_searchQual1729',
                    },
                    {
                      text: 'Thoracic Vertebral Injury',
                      value: '10129_searchQual1730',
                    },
                    {
                      text: 'Thoracic Vertebral Sprain',
                      value: '10162_searchQual1731',
                    },
                    {
                      text: 'Thoracic Vertebral Syndrome',
                      value: '4529_searchQual1732',
                    },
                    {
                      text: 'Thoracoscopy',
                      value: '2841_searchQual1733',
                    },
                    {
                      text: 'Thrombocythemia (Reactive)',
                      value: '4199_searchQual1734',
                    },
                    {
                      text: 'Thumb Fracture',
                      value: '10165_searchQual1735',
                    },
                    {
                      text: 'Tiazac',
                      value: '10881_searchQual1736',
                    },
                    {
                      text: 'Tibia Fracture',
                      value: '8191_searchQual1737',
                    },
                    {
                      text: 'Tibial Fracture',
                      value: '8191_searchQual1738',
                    },
                    {
                      text: 'Tibial Tubercle Apophyseal Traction Injury',
                      value: '4480_searchQual1739',
                    },
                    {
                      text: 'Tissue Plasminogen Activator Infusion',
                      value: '3189_searchQual1740',
                    },
                    {
                      text: 'Toe Ache',
                      value: '8011_searchQual1741',
                    },
                    {
                      text: 'Toe Bone Fracture Repair',
                      value: '101621_searchQual1742',
                    },
                    {
                      text: 'Toe Displacement',
                      value: '8215_searchQual1743',
                    },
                    {
                      text: 'Toe Fracture',
                      value: '8218_searchQual1744',
                    },
                    {
                      text: 'Tofacitinib Citrate',
                      value: '10956_searchQual1745',
                    },
                    {
                      text: 'Tooth Extraction',
                      value: '2493_searchQual1746',
                    },
                    {
                      text: 'Tooth Fracture',
                      value: '14161_searchQual1747',
                    },
                    {
                      text: 'Toothache',
                      value: '3768_searchQual1748',
                    },
                    {
                      text: 'Tophaceous Gout',
                      value: '12649_searchQual1749',
                    },
                    {
                      text: 'Torn Achilles Tendon',
                      value: '101810_searchQual1750',
                    },
                    {
                      text: 'Total Iron Binding Capacity Levels',
                      value: '2852_searchQual1751',
                    },
                    {
                      text: 'Toxic Megacolon',
                      value: '3910_searchQual1752',
                    },
                    {
                      text: 'Trace Element Deficiency',
                      value: '3606_searchQual1753',
                    },
                    {
                      text: 'Tracheal Deviation',
                      value: '100623_searchQual1754',
                    },
                    {
                      text: 'Tracheal Disease',
                      value: '14305_searchQual1755',
                    },
                    {
                      text: 'Tracheal Disorder',
                      value: '14305_searchQual1756',
                    },
                    {
                      text: 'Tracheal Intubation',
                      value: '3048_searchQual1757',
                    },
                    {
                      text: 'Tracheal Resection',
                      value: '14068_searchQual1758',
                    },
                    {
                      text: 'Tracheitis',
                      value: '102052_searchQual1759',
                    },
                    {
                      text: 'Tracheobronchial Stenting',
                      value: '14068_searchQual1760',
                    },
                    {
                      text: 'Tracheoesophageal Fistula Repair',
                      value: '101246_searchQual1761',
                    },
                    {
                      text: 'Tracheoplasty',
                      value: '14039_searchQual1762',
                    },
                    {
                      text: 'Tracheostomy',
                      value: '14068_searchQual1763',
                    },
                    {
                      text: 'Tracheotomy',
                      value: '14068_searchQual1764',
                    },
                    {
                      text: 'Trachoma',
                      value: '3769_searchQual1765',
                    },
                    {
                      text: 'Tracleer',
                      value: '13750_searchQual1766',
                    },
                    {
                      text: 'Traction',
                      value: '3195_searchQual1767',
                    },
                    {
                      text: 'Tramadol Hydrochloride-Acetaminophen',
                      value: '12085_searchQual1768',
                    },
                    {
                      text: 'Tramadol-Acetaminophen',
                      value: '12085_searchQual1769',
                    },
                    {
                      text: 'Tranexamic Acid',
                      value: '100100_searchQual1770',
                    },
                    {
                      text: 'Transcatheter Aortic Valve Replacement',
                      value: '8902_searchQual1771',
                    },
                    {
                      text: 'Transient Ischemic Attack',
                      value: '4785_searchQual1772',
                    },
                    {
                      text: 'Transtelephonic Pacemaker Monitoring',
                      value: '2857_searchQual1773',
                    },
                    {
                      text: 'Traumatic Cataract',
                      value: '12409_searchQual1774',
                    },
                    {
                      text: 'Traumatic Low Back Pain',
                      value: '100392_searchQual1775',
                    },
                    {
                      text: 'Traumatic Retinal Detachment',
                      value: '3741_searchQual1776',
                    },
                    {
                      text: 'Traumatic Subarachnoid Haemorrhage',
                      value: '12490_searchQual1777',
                    },
                    {
                      text: 'Traumatic Subarachnoid Hemorrhage',
                      value: '12490_searchQual1778',
                    },
                    {
                      text: 'Treadmill Cardiac Test',
                      value: '2539_searchQual1779',
                    },
                    {
                      text: 'Triacylglycerol Levels',
                      value: '2858_searchQual1780',
                    },
                    {
                      text: 'Triamcinolone Acetate (Inhaled)',
                      value: '11517_searchQual1781',
                    },
                    {
                      text: 'Triamcinolone Acetate (Injection)',
                      value: '11520_searchQual1782',
                    },
                    {
                      text: 'Triamcinolone Acetate (Nasal)',
                      value: '11632_searchQual1783',
                    },
                    {
                      text: 'Triamcinolone Acetate (Oral)',
                      value: '11629_searchQual1784',
                    },
                    {
                      text: 'Triamcinolone Acetate (Topical)',
                      value: '11511_searchQual1785',
                    },
                    {
                      text: 'Triamcinolone Acetonide (Inhaled)',
                      value: '11650_searchQual1786',
                    },
                    {
                      text: 'Triamcinolone Acetonide (Nasal)',
                      value: '12196_searchQual1787',
                    },
                    {
                      text: 'Triamcinolone Acetonide (Topical)',
                      value: '12223_searchQual1788',
                    },
                    {
                      text: 'Triamcinolone Hexacetonide (Injection)',
                      value: '11653_searchQual1789',
                    },
                    {
                      text: 'Triamcinolone acetate (IJ)',
                      value: '11520_searchQual1790',
                    },
                    {
                      text: 'Tricuspid Valve Replacement',
                      value: '8902_searchQual1791',
                    },
                    {
                      text: 'Trifluridine-Tipiracil',
                      value: '12058_searchQual1792',
                    },
                    {
                      text: 'Trypsin-like Immunoreactivity Levels',
                      value: '2861_searchQual1793',
                    },
                    {
                      text: 'Tuberculosis Chronic Active',
                      value: '5298_searchQual1794',
                    },
                    {
                      text: 'Tuberculosis Chronic Inactive',
                      value: '5298_searchQual1795',
                    },
                    {
                      text: 'Tumor (Stomach)',
                      value: '7972_searchQual1796',
                    },
                    {
                      text: 'Twisted Back',
                      value: '9556_searchQual1797',
                    },
                    {
                      text: 'Tygacil',
                      value: '12106_searchQual1798',
                    },
                    {
                      text: 'Type 5 Acid Phosphatase Levels',
                      value: '2832_searchQual1799',
                    },
                    {
                      text: 'Typhoid VI Polysaccharide Vacc',
                      value: '3198_searchQual1800',
                    },
                    {
                      text: 'Typhoid Vaccine',
                      value: '3198_searchQual1801',
                    },
                    {
                      text: 'Typhoid fever vaccine',
                      value: '3198_searchQual1802',
                    },
                    {
                      text: 'UACS (Upper Airway Cough Syndrome)',
                      value: '3733_searchQual1803',
                    },
                    {
                      text: 'UIBC (Unsaturated Iron Binding Capacity) Levels',
                      value: '2852_searchQual1804',
                    },
                    {
                      text: 'Ulcer (Stomach)',
                      value: '3942_searchQual1805',
                    },
                    {
                      text: 'Ulipristal Acetate',
                      value: '12139_searchQual1806',
                    },
                    {
                      text: 'Ulnar Displacement',
                      value: '8104_searchQual1807',
                    },
                    {
                      text: 'Ulnar Fracture',
                      value: '100784_searchQual1808',
                    },
                    {
                      text: 'Ultracet',
                      value: '12085_searchQual1809',
                    },
                    {
                      text: 'Underactive Thyroid',
                      value: '3560_searchQual1810',
                    },
                    {
                      text: 'Unsaturated Iron Binding Capacity Levels',
                      value: '2852_searchQual1811',
                    },
                    {
                      text: 'Upadacitinib',
                      value: '9247_searchQual1812',
                    },
                    {
                      text: 'Upper Arm Displacement',
                      value: '8104_searchQual1813',
                    },
                    {
                      text: 'Upper Arm Fracture',
                      value: '100783_searchQual1814',
                    },
                    {
                      text: 'Upper Back (Cervical) Backache',
                      value: '9871_searchQual1815',
                    },
                    {
                      text: 'Upper Back Bruise',
                      value: '100906_searchQual1816',
                    },
                    {
                      text: 'Upper Back Disorder',
                      value: '4529_searchQual1817',
                    },
                    {
                      text: 'Upper Back Stiffness',
                      value: '9871_searchQual1818',
                    },
                    {
                      text: 'Upset Stomach',
                      value: '7759_searchQual1819',
                    },
                    {
                      text: 'Uremia (Acute)',
                      value: '14397_searchQual1820',
                    },
                    {
                      text: 'Uric Acid Levels',
                      value: '2870_searchQual1821',
                    },
                    {
                      text: 'Uric Acid Levels (Blood)',
                      value: '2870_searchQual1822',
                    },
                    {
                      text: 'Uric Acid Levels (Serum)',
                      value: '2870_searchQual1823',
                    },
                    {
                      text: 'Uric Acid Levels (Urine)',
                      value: '2870_searchQual1824',
                    },
                    {
                      text: 'Urinary Tract Infection',
                      value: '101824_searchQual1825',
                    },
                    {
                      text: 'Urinary Tract Infection (UTI)',
                      value: '101824_searchQual1826',
                    },
                    {
                      text: 'Urinary Uric Acid Level',
                      value: '2870_searchQual1827',
                    },
                    {
                      text: 'Ursacholic Acid',
                      value: '13878_searchQual1828',
                    },
                    {
                      text: 'Ursodeoxycholic Acid',
                      value: '13878_searchQual1829',
                    },
                    {
                      text: 'Uterine Displacement',
                      value: '4089_searchQual1830',
                    },
                    {
                      text: 'VIP (Vasoactive Intestinal Polypeptide) Levels',
                      value: '2880_searchQual1831',
                    },
                    {
                      text: 'VMAU (Vanillylmandelic Acid) Levels (Urine)',
                      value: '2879_searchQual1832',
                    },
                    {
                      text: 'VTG (Thoracic Gas Volume) Levels',
                      value: '2400_searchQual1833',
                    },
                    {
                      text: 'Vaccine for Malaria',
                      value: '2957_searchQual1834',
                    },
                    {
                      text: 'Vaccines',
                      value: '3198_searchQual1835',
                    },
                    {
                      text: 'Valacyclovir',
                      value: '13880_searchQual1836',
                    },
                    {
                      text: 'Valacyclovir Hydrochloride',
                      value: '13880_searchQual1837',
                    },
                    {
                      text: 'Valnac',
                      value: '10189_searchQual1838',
                    },
                    {
                      text: 'Valproic Acid',
                      value: '11166_searchQual1839',
                    },
                    {
                      text: 'Valproic Acid Levels',
                      value: '2878_searchQual1840',
                    },
                    {
                      text: 'Vanillylmandelic Acid Levels',
                      value: '2879_searchQual1841',
                    },
                    {
                      text: 'Vanillylmandelic Acid, Test for',
                      value: '2879_searchQual1842',
                    },
                    {
                      text: 'Varicella Virus Vaccine Live',
                      value: '12205_searchQual1843',
                    },
                    {
                      text: 'Varicella vaccine',
                      value: '12205_searchQual1844',
                    },
                    {
                      text: 'Vasoactive Intestinal Polypeptide Levels',
                      value: '2880_searchQual1845',
                    },
                    {
                      text: 'Vasovagal Attack',
                      value: '4647_searchQual1846',
                    },
                    {
                      text: 'Vena Cava Filter Placement',
                      value: '13984_searchQual1847',
                    },
                    {
                      text: 'Ventricular Tachycardia',
                      value: '100619_searchQual1848',
                    },
                    {
                      text: 'Vertebral Ankylosis (Sacral)',
                      value: '101802_searchQual1849',
                    },
                    {
                      text: 'Vertebral Ankylosis (Thoracic)',
                      value: '101800_searchQual1850',
                    },
                    {
                      text: 'Viracept',
                      value: '11947_searchQual1851',
                    },
                    {
                      text: 'Vision Test (Refraction',
                      value: '2788_searchQual1852',
                    },
                    {
                      text: 'Vision Test - Acuity',
                      value: '2886_searchQual1853',
                    },
                    {
                      text: 'Visual Acuity Test',
                      value: '2886_searchQual1854',
                    },
                    {
                      text: 'Visual Acuity Test Left',
                      value: '8398_searchQual1855',
                    },
                    {
                      text: 'Visual Acuity Test Right',
                      value: '8395_searchQual1856',
                    },
                    {
                      text: 'Visual Tract Disorder',
                      value: '9772_searchQual1857',
                    },
                    {
                      text: 'Vital Capacity',
                      value: '2888_searchQual1858',
                    },
                    {
                      text: 'Vitreous Detachment',
                      value: '3777_searchQual1859',
                    },
                    {
                      text: 'Vivactil',
                      value: '9094_searchQual1860',
                    },
                    {
                      text: 'Vivotif Berna Vaccine',
                      value: '3198_searchQual1861',
                    },
                    {
                      text: 'Von Leiden Factor',
                      value: '4131_searchQual1862',
                    },
                    {
                      text: 'Von Willebrand Factor Level',
                      value: '2550_searchQual1863',
                    },
                    {
                      text: 'Vopac MDS',
                      value: '10446_searchQual1864',
                    },
                    {
                      text: 'Waldenstrom\'s Macroglobulinemia',
                      value: '5100_searchQual1865',
                    },
                    {
                      text: 'Wandering Pacemaker',
                      value: '3481_searchQual1866',
                    },
                    {
                      text: 'Watermelon Stomach',
                      value: '3847_searchQual1867',
                    },
                    {
                      text: 'Weil-Felix Reaction',
                      value: '2555_searchQual1868',
                    },
                    {
                      text: 'Wenkebach Phenomenon',
                      value: '3457_searchQual1869',
                    },
                    {
                      text: 'Whole Blood Clotting Time and Clot Retraction Time',
                      value: '2899_searchQual1870',
                    },
                    {
                      text: 'Wisdom Tooth Extraction',
                      value: '9013_searchQual1871',
                    },
                    {
                      text: 'Wrist Ache',
                      value: '8092_searchQual1872',
                    },
                    {
                      text: 'Wrist Bone Fracture Repair',
                      value: '101669_searchQual1873',
                    },
                    {
                      text: 'Wrist Displacement',
                      value: '8224_searchQual1874',
                    },
                    {
                      text: 'Wrist Fracture',
                      value: '8227_searchQual1875',
                    },
                    {
                      text: 'Wrist Replacement',
                      value: '4444_searchQual1876',
                    },
                    {
                      text: 'X-Ray Back',
                      value: '2902_searchQual1877',
                    },
                    {
                      text: 'X-Ray Face',
                      value: '2902_searchQual1878',
                    },
                    {
                      text: 'X-Ray Facial',
                      value: '2902_searchQual1879',
                    },
                    {
                      text: 'X-Ray, Back',
                      value: '2902_searchQual1880',
                    },
                    {
                      text: 'X-Ray, Face',
                      value: '2902_searchQual1881',
                    },
                    {
                      text: 'Xray Back',
                      value: '2902_searchQual1882',
                    },
                    {
                      text: 'Xray Face',
                      value: '2902_searchQual1883',
                    },
                    {
                      text: 'Xray Facial',
                      value: '2902_searchQual1884',
                    },
                    {
                      text: 'Yellow fever vaccine',
                      value: '3198_searchQual1885',
                    },
                    {
                      text: 'Yolk Sac Cancer',
                      value: '4915_searchQual1886',
                    },
                    {
                      text: 'Yolk Sac Tumor',
                      value: '9607_searchQual1887',
                    },
                    {
                      text: 'Zantac',
                      value: '13794_searchQual1888',
                    },
                    {
                      text: 'Ziac',
                      value: '10689_searchQual1889',
                    },
                    {
                      text: 'Zinacef',
                      value: '102062_searchQual1890',
                    },
                    {
                      text: 'Zoledronic Acid',
                      value: '100102_searchQual1891',
                    },
                    {
                      text: 'Zoster Vaccine Live',
                      value: '12205_searchQual1892',
                    },
                    {
                      text: 'altacaine',
                      value: '12202_searchQual1893',
                    },
                    {
                      text: 'alyacen',
                      value: '12139_searchQual1894',
                    },
                    {
                      text: 'antihemophilic factor (recombinant), fc fusion protein',
                      value: '100809_searchQual1895',
                    },
                    {
                      text: 'bempedoic acid',
                      value: '101172_searchQual1896',
                    },
                    {
                      text: 'cervical amino acid',
                      value: '12235_searchQual1897',
                    },
                    {
                      text: 'citric acid-potassium citrate-sodium citrate',
                      value: '12169_searchQual1898',
                    },
                    {
                      text: 'daptacel',
                      value: '12220_searchQual1899',
                    },
                    {
                      text: 'debacterol',
                      value: '12214_searchQual1900',
                    },
                    {
                      text: 'diclofenac-misoprostol',
                      value: '12082_searchQual1901',
                    },
                    {
                      text: 'durabac',
                      value: '12082_searchQual1902',
                    },
                    {
                      text: 'dynacin',
                      value: '12217_searchQual1903',
                    },
                    {
                      text: 'estrace (topical)',
                      value: '12235_searchQual1904',
                    },
                    {
                      text: 'fazaclo',
                      value: '11737_searchQual1905',
                    },
                    {
                      text: 'generlac',
                      value: '11833_searchQual1906',
                    },
                    {
                      text: 'influenza vaccine',
                      value: '3198_searchQual1907',
                    },
                    {
                      text: 'lobac',
                      value: '12082_searchQual1908',
                    },
                    {
                      text: 'macrodantin',
                      value: '12229_searchQual1909',
                    },
                    {
                      text: 'menactra',
                      value: '3198_searchQual1910',
                    },
                    {
                      text: 'miostat isopto carbachol',
                      value: '12202_searchQual1911',
                    },
                    {
                      text: 'mydriacyl',
                      value: '12202_searchQual1912',
                    },
                    {
                      text: 'myrac',
                      value: '12217_searchQual1913',
                    },
                    {
                      text: 'naprapac',
                      value: '12079_searchQual1914',
                    },
                    {
                      text: 'narapac',
                      value: '12079_searchQual1915',
                    },
                    {
                      text: 'nevanac',
                      value: '12202_searchQual1916',
                    },
                    {
                      text: 'novacort',
                      value: '12091_searchQual1917',
                    },
                    {
                      text: 'oracea',
                      value: '12217_searchQual1918',
                    },
                    {
                      text: 'oracit',
                      value: '12169_searchQual1919',
                    },
                    {
                      text: 'oxytetracycline',
                      value: '12202_searchQual1920',
                    },
                    {
                      text: 'potassium citrate-sodium citrate-citric acid',
                      value: '12169_searchQual1921',
                    },
                    {
                      text: 'prevacid',
                      value: '12226_searchQual1922',
                    },
                    {
                      text: 'quadracel',
                      value: '12220_searchQual1923',
                    },
                    {
                      text: 'rectacort-HC',
                      value: '12091_searchQual1924',
                    },
                    {
                      text: 'rectacreme HC',
                      value: '12091_searchQual1925',
                    },
                    {
                      text: 'rubella and varicella vaccine',
                      value: '12205_searchQual1926',
                    },
                    {
                      text: 'sulfac',
                      value: '12202_searchQual1927',
                    },
                    {
                      text: 'sulfacetamide-fluorometholone',
                      value: '12202_searchQual1928',
                    },
                    {
                      text: 'tanacof-XR',
                      value: '2970_searchQual1929',
                    },
                    {
                      text: 'tenivac',
                      value: '12220_searchQual1930',
                    },
                    {
                      text: 'testanus-diptheria Vaccine',
                      value: '12220_searchQual1931',
                    },
                    {
                      text: 'thiosalicylic acid sodium',
                      value: '12082_searchQual1932',
                    },
                    {
                      text: 'tropicacyl',
                      value: '12202_searchQual1933',
                    },
                    {
                      text: 'ultracaps',
                      value: '11965_searchQual1934',
                    },
                    {
                      text: 'uroqid-acid',
                      value: '12229_searchQual1935',
                    },
                    {
                      text: 'versacloz',
                      value: '11737_searchQual1936',
                    },
                    {
                      text: 'viokace',
                      value: '11965_searchQual1937',
                    },
                    {
                      text: 'zomacton',
                      value: '12022_searchQual1938',
                    },
                    {
                      text: 'ac (Not in List)',
                      value: '5613_searchQual1939',
                    },
                  ],
                  componentType: 'SearchResp',
                  notInListDisclosureType: {
                    text: 'Other Medical Condition',
                    value: '5613_searchQual0',
                  },
                },
                context: [],
                helpText: 'Please provide the name(s) of the medical condition(s), disease(s), disorder(s), treatment (s) or test (s).',
                id: 232,
                isAnswered: false,
                parentChoiceVal: 'true',
                parentQuestionId: 231,
                richHelpText: '<span>Please provide the name(s) of the medical condition(s), disease(s), disorder(s), treatment (s) or test (s).</span>',
                richText: '<span>What is the medical condition, treatment, or test that required you to consult a healthcare provider?</span>',
                text: 'What is the medical condition, treatment, or test that required you to consult a healthcare provider?',
                type: 'SEARCH',
              },
              answer: {
                id: 232,
                questionType: 'SEARCH',
                value: [
                  {
                    value: '2926_searchQual2',
                    text: 'ACE Inhibitors',
                    label: 'ACE Inhibitors',
                  },
                ],
              },
              section_id: 3,
            },
            233: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/232',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/233',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>It&#x27;s been completed</span>',
                      text: 'It\'s been completed',
                      unknownAnswer: false,
                      value: 'drv_Completed',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>It&#x27;s in progress</span>',
                      text: 'It\'s in progress',
                      unknownAnswer: false,
                      value: 'drv_InProgress',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: '<span>It&#x27;s been planned</span>',
                      text: 'It\'s been planned',
                      unknownAnswer: false,
                      value: 'drv_Planned',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [
                  'ACE Inhibitors',
                ],
                helpText: '',
                id: 233,
                isAnswered: false,
                parentChoiceVal: '2926_searchQual2',
                parentQuestionId: 232,
                richHelpText: '',
                richText: '<span>What is the status of your treatment?</span>',
                text: 'What is the status of your treatment?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 233,
                questionType: 'SINGLE_CHOICE',
                value: 'drv_Completed',
              },
              section_id: 3,
            },
            234: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/233',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/234',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  availableDateFormats: [
                    'MONTH_YEAR',
                    'RELATIVE_AGE',
                    'MONTHS_SINCE_OCCURRENCE',
                    'EXACT_DATE',
                  ],
                  canBeUnknown: false,
                  maxDate: '2024-01-24T00:00:00Z',
                  minDate: '2022-02-02T00:00:00Z',
                  selectedDatePeriod: 'PAST_DATES',
                },
                context: [
                  'ACE Inhibitors',
                ],
                helpText: '',
                id: 234,
                isAnswered: false,
                parentChoiceVal: 'drv_Completed',
                parentQuestionId: 233,
                richHelpText: '',
                richText: '<span>Approximately when did you last receive or take this treatment?</span>',
                text: 'Approximately when did you last receive or take this treatment?',
                type: 'DATE',
              },
              answer: {
                id: 234,
                questionType: 'DATE',
                value: {
                  dateFormat: 'MONTH_YEAR',
                  value: '10/2022',
                },
              },
              section_id: 3,
            },
            235: {
              question: {
                _links: {
                  parentQuestion: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/233',
                  },
                  section: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/sections/3',
                  },
                  self: {
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/questions/235',
                  },
                  sessionStatus: {
                    completed: false,
                    href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/61594859-a5cd-4fc0-b8ae-5bd803d2d945/status',
                    submitted: false,
                  },
                },
                constraints: {
                  canBeUnknown: false,
                  choices: [
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: 'Yes',
                      text: 'Yes',
                      unknownAnswer: false,
                      value: 'true',
                    },
                    {
                      questionType: 'SINGLE_CHOICE',
                      richText: 'No',
                      text: 'No',
                      unknownAnswer: false,
                      value: 'false',
                    },
                  ],
                  componentType: 'RadioResp',
                },
                context: [
                  'ACE Inhibitors',
                ],
                helpText: '',
                id: 235,
                isAnswered: false,
                parentChoiceVal: 'drv_Completed',
                parentQuestionId: 233,
                richHelpText: '',
                richText: '<span>Have you had any complications as a result of your treatment?</span>',
                text: 'Have you had any complications as a result of your treatment?',
                type: 'SINGLE_CHOICE',
              },
              answer: {
                id: 235,
                questionType: 'SINGLE_CHOICE',
                value: 'false',
              },
              section_id: 3,
            },
          },
          order: [
            142,
            229,
            231,
            232,
            233,
            234,
            235,
          ],
          sections: [
            {
              id: 0,
              question_ids: [],
              title: 'Personal',
            },
            {
              id: 1,
              question_ids: [],
              title: 'Lifestyle',
            },
            {
              id: 2,
              question_ids: [],
              title: 'Family History ',
            },
            {
              id: 3,
              question_ids: [
                142,
                229,
                231,
              ],
              title: 'Medical History',
            },
          ],
          submitted: false,
        },
        submitted: true,
      },
    },
  },
  partnerDisclosure: {
    disclosures: {},
    order: [],
    sections: [],
    submitted: false,
  },
  metadata: {
    initialized: false,
    paymentSliderDown: false,
    redirectedTo: '',
    isLoading: false,
    hasError: false,
    hasCustomError: false,
    currRoute: '/application/contact',
    backPressed: false,
    forwardPressed: true,
    isQuoting: true,
    fromQuoteCompare: false,
    fromStartApp: false,
    fromDocusign: false,
    fromDropJourney: false,
    dateTime: '',
    question: '',
    isContactModalOpen: false,
    name: '',
    isConfirmationOpen: false,
    debugFlag: true,
    suggestedEmail: null,
    emailIsDeliverable: false,
    hasLocalHistory: true,
    sentEappsMessage: false,
    isChatbotInitialized: false,
    user_lead_source: '',
    user_lead_source_other: '',
    standard_beneficiary_flag: '',
    fbInitFlag: false,
    fbEventQueue: [],
    abTestBand: 'control',
    docusignUrlStatus: 'uninitialized',
    docusignSource: 0,
    experienceLevel: '',
    isJoint: '',
    isPartnerFormComplete: false,
    verifiedEmails: [],
    hasCheckedSecondaryApp: false,
    eappValidateValue: '',
    eappValidateMedium: '',
    eappValidateShortCode: '',
    app_insurer_url: '',
    numValidateAttemptsRemaining: 7,
    hasSubmittedSecondaryApp: false,
    hasSubmittedABTestData: true,
    isSearchLoading: false,
    consentMIBPull: false,
    consentPrivacyPolicy: false,
    decisionLoadingStep: 0,
    isMakingDecisionRequests: false,
    isAppSubmitComplete: false,
    decisionHasBeenMade: false,
    isComingFromConsentPage: false,
    selectedApprovedSteps: false,
    hasEligibilityIssue: false,
    ineligibleUser: null,
    abRequestInFlight: false,
    konami: false,
    is_download_policy_journey: false,
    advisor_id: '',
    advisor_full_name: '',
    secondary_submitted: false,
    isNoMedicalSelected: false,
    syncNurseVisitClickRate: '',
    noMedicalClickRateStatus: '',
    documentReferrer: 'https://caa-dev.us.auth0.com/',
    initialWindowLocationHref: 'https://core-2478.life-health.ama.ab.ondemand.policyme.com/life/magic-link-auth/callback?user_id=17950&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjE3OTUwLCJpYXQiOjE3MDYxMjI1ODYsImV4cCI6MTcwNjE0MDU4NiwicGF5bG9hZCI6eyJ1c2VyX3Rva2VuIjoidzUzMGRZZzI1amE0eVFWYlhqVHRuUjJRVENLMjAwWmRnSVA4dE1PaGRPMy04MkV1eGpMb0RlNlJmRVhEWnFrcHdVOXBUTzhKbEEtNDFNWVBvM3dPVG8tcXlqdDM2eFVXZmdBZGF6YjU3aXdoY0VmWVdHMmZZallIaWRiLVViMnNERGlnZjJUZGQ3dXhQYzNQSHFnVmxjNUZ3Y2R3UElzMno1U0FvY2JGcUxXZkRvVUdON1ZmMktUSkxaTUJSY2xFYmJqVTR0X3R4cGtQWjBrVFF2emhWUWpCT0pCdzFUaUNYY0RpRGo2YmswQzg4TkpQSHVwRlpvRXk0eGtEWVkwSGJUeUtuY3MzdFdybmtDN2hlWk1lVlMzMmpBbEtDVXozQXMtamhqUF81NFlEMFVyWnotUVpOWF9HTXZrLUJzd2YxV1hHVkhXOEJXNnRGU2VTS2hrYkpnIiwiZW52IjoidGVzdCIsInRlbmFudF9pZCI6IjdhYmYwNTEyLWNlMmYtNGQxZC05MGM0LTU2MDc0MmNiZGZiYiIsIm9uX2RlbWFuZF9lbnYiOiJDT1JFLTI0NzgifX0.b6OK8qPl2qGU7z2yctExziqg3aDTEpeXi4wXH1IsQYg&app_id=94673034-20fa-4a37-9071-589a6a1e49fc',
    locationHistory: [
      '/magic-link-auth/callback',
      '/application/primary/full-address',
      '/application/partner-same-address',
      '/application/birth-location',
      '/application/employment-income-annual-self',
      '/application/primary-transition',
      '/application/primary/disclosure-integration/1',
      '/application/secondary/disclosure-integration/1',
      '/application/lsE4-1c1K/disclosure-integration/1',
      '/application/lsE4-1c1K/disclosure-integration/2',
      '/application/lsE4-1c1K/disclosure-integration/7',
      '/application/lsE4-1c1K/disclosure-integration/8',
      '/application/lsE4-1c1K/disclosure-integration/9',
      '/application/primary/disclosure-integration/10',
      '/application/primary/disclosure-integration/11',
      '/application/secondary/disclosure-integration/10',
      '/application/secondary/disclosure-integration/11',
      '/application/lsE4-1c1K/disclosure-integration/10',
      '/application/lsE4-1c1K/disclosure-integration/11',
      '/application/primary/disclosure-integration/63',
      '/application/secondary/disclosure-integration/63',
      '/application/lsE4-1c1K/disclosure-integration/63',
      '/application/primary/disclosure-integration/64',
      '/application/secondary/disclosure-integration/64',
      '/application/lsE4-1c1K/disclosure-integration/64',
      '/application/primary/disclosure-integration/99',
      '/application/secondary/disclosure-integration/99',
      '/application/lsE4-1c1K/disclosure-integration/99',
      '/application/primary/disclosure-integration/100',
      '/application/secondary/disclosure-integration/100',
      '/application/lsE4-1c1K/disclosure-integration/100',
      '/application/primary/disclosure-integration/101',
      '/application/secondary/disclosure-integration/101',
      '/application/lsE4-1c1K/disclosure-integration/101',
      '/application/primary/disclosure-integration/119',
      '/application/secondary/disclosure-integration/119',
      '/application/lsE4-1c1K/disclosure-integration/119',
      '/application/primary/disclosure-integration/121',
      '/application/secondary/disclosure-integration/121',
      '/application/lsE4-1c1K/disclosure-integration/121',
      '/application/primary/disclosure-integration/126',
      '/application/secondary/disclosure-integration/126',
      '/application/lsE4-1c1K/disclosure-integration/126',
      '/application/primary/disclosure-integration/127',
      '/application/secondary/disclosure-integration/127',
      '/application/lsE4-1c1K/disclosure-integration/127',
      '/application/primary/disclosure-integration/130',
      '/application/secondary/disclosure-integration/130',
      '/application/lsE4-1c1K/disclosure-integration/130',
      '/application/primary/disclosure-integration/131',
      '/application/secondary/disclosure-integration/131',
      '/application/lsE4-1c1K/disclosure-integration/131',
      '/application/primary/disclosure-integration/133',
      '/application/secondary/disclosure-integration/133',
      '/application/lsE4-1c1K/disclosure-integration/133',
      '/application/primary/disclosure-integration/134',
      '/application/secondary/disclosure-integration/134',
      '/application/lsE4-1c1K/disclosure-integration/134',
      '/application/primary/disclosure-integration/135',
      '/application/secondary/disclosure-integration/135',
      '/application/lsE4-1c1K/disclosure-integration/135',
      '/application/primary/disclosure-integration/137',
      '/application/secondary/disclosure-integration/137',
      '/application/lsE4-1c1K/disclosure-integration/137',
      '/application/primary/disclosure-integration/140',
      '/application/secondary/disclosure-integration/140',
      '/application/lsE4-1c1K/disclosure-integration/140',
      '/application/primary/disclosure-integration/142',
      '/application/secondary/disclosure-integration/142',
      '/application/lsE4-1c1K/disclosure-integration/142',
      '/application/Y0zmi2ysCB/disclosure-integration/142',
      '/application/primary/disclosure-integration/229',
      '/application/secondary/disclosure-integration/229',
      '/application/lsE4-1c1K/disclosure-integration/229',
      '/application/Y0zmi2ysCB/disclosure-integration/229',
      '/application/primary/disclosure-integration/231',
      '/application/secondary/disclosure-integration/231',
      '/application/lsE4-1c1K/disclosure-integration/231',
      '/application/Y0zmi2ysCB/disclosure-integration/231',
      '/application/Y0zmi2ysCB/disclosure-integration/232',
      '/application/Y0zmi2ysCB/disclosure-integration/233',
      '/application/Y0zmi2ysCB/disclosure-integration/234',
      '/application/Y0zmi2ysCB/disclosure-integration/235',
      '/application/contact',
    ],
    fromPrimaryUser: false,
    blockPrimaryPages: false,
    smq_quote_num: '',
    smq_mn_prems: '',
    smq_secondary_mn_prems: '',
    association_complete: false,
    isFirstRendering: false,
    isCurrentlyHydratingData: false,
    completedStartApp: false,
    hasInProgressPolicy: false,
    finishedHydrating: true,
    primary: {
      disclosuresAnswered: [
        1,
        1,
        2,
        7,
        8,
        9,
        10,
        11,
        10,
        11,
        63,
        63,
        64,
        64,
        99,
        99,
        100,
        100,
        101,
        101,
        119,
        119,
        121,
        121,
        126,
        126,
        127,
        127,
        130,
        130,
        131,
        131,
        133,
        133,
        134,
        134,
        135,
        135,
        137,
        137,
        140,
        140,
        142,
        142,
        142,
        229,
        229,
        229,
        231,
        231,
        231,
        232,
        233,
        234,
        235,
      ],
      applications_links_created: false,
      session: {
        hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
      },
      hasPreExistingPhoneNumber: false,
      hdApp: {
        product_added: true,
        buying_method: 'Stand-alone',
        underwriting_method: 'fully_underwritten',
      },
    },
    secondary: {
      disclosuresAnswered: [
        1,
        10,
        11,
        63,
        64,
        99,
        100,
        101,
        119,
        121,
        126,
        127,
        130,
        131,
        133,
        134,
        135,
        137,
        140,
        142,
        229,
        231,
      ],
      applications_links_created: false,
      session: {
        hd_application_id: '94673034-20fa-4a37-9071-589a6a1e49fc',
      },
      hasPreExistingPhoneNumber: false,
      hdApp: {
        product_added: true,
        buying_method: 'Stand-alone',
        underwriting_method: 'fully_underwritten',
      },
    },
    fromBlog: false,
    productDocusign: '',
    docusignCallbackType: '',
    primaryReviewEsignCompleted: false,
    secondaryReviewEsignCompleted: false,
    dealLinkProductType: '',
    currentUser: 'primary',
    isShadowAccountStartApp: false,
    closePolicyFlag: false,
    authorizedCitizenship: false,
    planTypeStartApp: 'enhanced',
    navbarFirstName: 'Jude',
    navbarLastName: 'Martin',
    defaultPlanSlide: 'standard',
    utm_source: 'direct',
    utm_extras: {
      gacid: 'GA1.1.794033487.1700766928',
    },
    prevRoute: '/application/Y0zmi2ysCB/disclosure-integration/235',
    preAppMainProduct: 'hd',
    hasPreExistingPhoneNumber: false,
  },
  jointMetadata: {
    showFinancialDifficulties: '',
    showResidencyAppliedPermRes: '',
    showResidencyDomesticWorker: '',
    showResidencyPhysician: '',
    showResidencySkilledWorker: '',
    showLicense: '',
    showLicenseSuspended: '',
    showSecondaryBeneficiaries: '',
    showTrustee: '',
    couple_beneficiaries_flag: '',
    user_partner_same_address_flag: 'Y',
    user_partner_same_interview: false,
    user_partner_same_trustee: false,
    user_partner_same_secondary_beneficiary: false,
    has_done_blood_urine_height_weight: '',
  },
  debug: {},
  userControl: {
    currentUser: 'primary',
    hasPartnerApplication: true,
    availableProducts: [
      'hd',
    ],
    dashboardUser: 'primary',
    affiliate: {
      affiliateCategory: false,
    },
    isHealthAndDental: false,
    theme: 'AMA',
    hd_quotes: {
      enhanced: {
        is_discounted: false,
        mn_prems: 620.48,
        original_mn_prems: 620.48,
        selected: true,
      },
      essential: {
        is_discounted: false,
        mn_prems: 297.36,
        original_mn_prems: 297.36,
        selected: false,
      },
      standard: {
        is_discounted: false,
        mn_prems: 379.06,
        original_mn_prems: 379.06,
        selected: false,
      },
    },
  },
  router: {
    location: {
      pathname: '/application/contact',
      search: '',
      hash: '',
      key: 'vl96vc',
      query: {},
    },
    action: 'PUSH',
  },
};
