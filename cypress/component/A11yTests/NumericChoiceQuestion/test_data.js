const AURA_QUESTION = {
  "aura_response": {
    "_links": {
      "parentQuestion": {
        "href": "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/c09ee3cd-a573-441c-b030-39ce56682485/questions/245"
      },
      "section": {
        "href": "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/c09ee3cd-a573-441c-b030-39ce56682485/sections/3"
      },
      "self": {
        "href": "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/c09ee3cd-a573-441c-b030-39ce56682485/questions/246"
      },
      "sessionStatus": {
        "completed": false,
        "href": "/disclosures/api/v1/clients/svc4aurapolmetest/sessions/c09ee3cd-a573-441c-b030-39ce56682485/status",
        "submitted": false
      }
    },
    "constraints": {
      "canBeUnknown": false,
      "choices": [
        {
          "prompt": null,
          "questionType": "NUMERIC_CHOICE",
          "richText": "<span>Monoplegia (paralysis of one limb)</span>",
          "text": "Monoplegia (paralysis of one limb)",
          "unknownAnswer": false,
          "value": "0"
        },
        {
          "prompt": null,
          "questionType": "NUMERIC_CHOICE",
          "richText": "<span>Diplegia or paraplegia (paralysis of both arms or legs)</span>",
          "text": "Diplegia or paraplegia (paralysis of both arms or legs)",
          "unknownAnswer": false,
          "value": "1"
        },
        {
          "prompt": null,
          "questionType": "NUMERIC_CHOICE",
          "richText": "<span>Quadriplegia or tetraplegia (paralysis of all four limbs)</span>",
          "text": "Quadriplegia or tetraplegia (paralysis of all four limbs)",
          "unknownAnswer": false,
          "value": "2"
        }
      ],
      "componentType": "SingleSelectBoxResp"
    },
    "context": [
      "Spinal cord injury"
    ],
    "helpText": "",
    "id": 246,
    "isAnswered": false,
    "parentChoiceVal": "true",
    "parentQuestionId": 245,
    "richHelpText": "",
    "richText": "<span>What is the degree of your paralysis?</span>",
    "text": "What is the degree of your paralysis?",
    "type": "NUMERIC_CHOICE"
  },
  "parent_id": 245,
  "question_id": 246,
  "section_id": 3,
  "submitted": false
}

export default AURA_QUESTION;
