const AURA_QUESTION = {
  aura_response: {
    _links: {
      parentQuestion: {
        href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/a5cc115f-8a43-4f3d-baee-30e1b707dd7d/questions/139',
      },
      section: {
        href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/a5cc115f-8a43-4f3d-baee-30e1b707dd7d/sections/2',
      },
      self: {
        href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/a5cc115f-8a43-4f3d-baee-30e1b707dd7d/questions/231',
      },
      sessionStatus: {
        completed: false,
        href: '/disclosures/api/v1/clients/svc4aurapolmetest/sessions/a5cc115f-8a43-4f3d-baee-30e1b707dd7d/status',
        submitted: false,
      },
    },
    constraints: {
      canBeUnknown: false,
      componentType: 'TextInput',
      decimalPrecision: 0,
      maxVal: 999,
      minVal: 0,
    },
    context: [
      'Cardiovascular disease',
    ],
    helpText: 'Indicate all immediate family members (Parents and/or Siblings) who have been diagnosed with this condition.',
    id: 231,
    isAnswered: false,
    parentChoiceVal: 'dt_CardiovascularDisease',
    parentQuestionId: 139,
    richHelpText: '<span>Indicate all immediate family members (Parents and/or Siblings) who have been diagnosed with this condition.</span>',
    richText: '<span>Approximately how many immediate family members have been diagnosed with <span class="de-text-token">Cardiovascular disease</span>, prior to the age of 60? </span>',
    text: 'Approximately how many immediate family members have been diagnosed with Cardiovascular disease, prior to the age of 60? ',
    type: 'NUMERIC',
  },
  question_id: 231,
  submitted: false,
  section_id: 2,
};

export default AURA_QUESTION;
