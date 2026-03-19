const AURA_QUESTION = {
  aura_response: {
    _links: {
      parentQuestion: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fa268644-6b4a-4f9f-b376-4d7824cd7586/questions/257"
      },
      section: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fa268644-6b4a-4f9f-b376-4d7824cd7586/sections/3"
      },
      self: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fa268644-6b4a-4f9f-b376-4d7824cd7586/questions/266"
      },
      sessionStatus: {
        completed: false,
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/fa268644-6b4a-4f9f-b376-4d7824cd7586/status",
        submitted: false
      }
    },
    constraints: {
      canBeUnknown: false,
      maxNumberOfReadings: 3.0,
      maxValDiastolic: 200.0,
      maxValSystolic: 300.0,
      minValDiastolic: 25.0,
      minValSystolic: 50.0
    },
    context: [
      "Hypertension",
      "Blood Pressure"
    ],
    helpText: "You can enter a maximum of 3 readings.",
    id: 266,
    isAnswered: false,
    parentChoiceVal: "drv_Investigated",
    parentQuestionId: 257,
    richHelpText: "<span>You can enter a maximum of 3 readings.</span>",
    richText: "What was your most recent blood pressure reading?",
    text: "What was your most recent blood pressure reading?",
    type: "BLOOD_PRESSURE"
  },
  parent_id: 257,
  question_id: 266,
  section_id: 3,
  submitted: false
}

export default AURA_QUESTION;