const AURA_TEXT_QUESTION = {
  aura_response: {
    _links: {
      parentQuestion: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/1e30eccc-4d69-45b9-aeb5-56ace8b60801/questions/239"
      },
      section: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/1e30eccc-4d69-45b9-aeb5-56ace8b60801/sections/2"
      },
      self: {
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/1e30eccc-4d69-45b9-aeb5-56ace8b60801/questions/240"
      },
      sessionStatus: {
        completed: false,
        href: "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/1e30eccc-4d69-45b9-aeb5-56ace8b60801/status",
        submitted: false
      }
    },
    constraints: {
      canBeUnknown: false
    },
    context: [
      "Cardiovascular disease",
      "Non-routine investigation, test or consultation"
    ],
    helpText: "",
    id: 240,
    isAnswered: false,
    parentChoiceVal: true,
    parentQuestionId: 239,
    richHelpText: "",
    richText: <span>What was the result?</span>,
    text: "What was the result?",
    type: "TEXT"
  },
  parent_id: 239,
  question_id: 240,
  section_id: 2,
  submitted: false
}

export default AURA_TEXT_QUESTION;