/* eslint no-restricted-syntax: ["error", {
  "selector": "NewExpression[callee.name='Error']",
  "message": "Use HandleApiError instead of throwing new Error for handling API requests errors"
}] */

import jsCookie from 'js-cookie';
import { encodeEnvVar, handleApiError, LOCALE, accountIdWrapper } from '@policyme/global-libjs-utils';
import {
  ACCOUNTS_ENDPOINT,
  ACCOUNTS_BASE_ENDPOINT,
  ANALYTICS_ENDPOINT,
  PM_DEVOPS_ENDPOINT,
  AURA_ENDPOINT,
  COPY_STATE_ENDPOINT,
  DOCUSIGN_ENDPOINT,
  GLOBAL_MAIN_ENDPOINT,
  GLOBAL_MAIN_BASE_ENDPOINT,
  HD_MAIN_ENDPOINT,
  HD_QUOTES_ENDPOINT,
  JIRA_RESOURCES_ENDPOINT,
  RELEASE_VERSION,
  PAYMENTS_ENDPOINT,
  HBM_ENDPOINT,
  DOCUMENTS_ENDPOINT,
  HD_DOCUMENTS_ENDPOINT,
  PM_ENABLE_DOCUMENTS_MICROSERVICE,
} from '../config';
import { fromStrToNull, isLocalOrProdEnv, snakeToCamelCase, getFileNameFromContentDisposition, injectMagicLinkIntegrationTestHeaders } from '../utils/helpers';
import { PM_PRODUCT_TYPE, ProductTypeFull, QA_DOCUMENT_ORIGIN, PolicyStatusType, AuthorizationType } from '../utils/const';
import { getFromEnvironment } from '../utils/environmentHelpers';
import { fetch } from '../utils/fetch';
import { Enum } from '../utils/types';
import { ProductPrefix } from '../Selectors/helpers/productApp';

let internal_endpoint = getFromEnvironment('PM_INTERNAL_ENDPOINT');
let jira_client_id = process.env.PM_JIRA_CLIENT_ID;
let jira_client_secret = process.env[`${encodeEnvVar('PM_JIRA_CLIENT_SECRET')}`];
let jira_redirect_url = getFromEnvironment('PM_JIRA_REDIRECT_URL');
if (!isLocalOrProdEnv && (jira_client_id === undefined
  || jira_client_secret === undefined
  || jira_redirect_url === undefined)) {
  console.error('Either environment is not local or prod');
  console.error('Please set following environment variables if you\'re not running app in local:');
  console.error('PM_JIRA_CLIENT_ID or PM_JIRA_CLIENT_SECRET or PM_JIRA_REDIRECT_URL ');
}

if (!internal_endpoint) {
  internal_endpoint = 'https://portal.test.policyme.com/api';
}

function getProductDocumentsEndpoint(product: ProductTypeFull) {
  if (PM_ENABLE_DOCUMENTS_MICROSERVICE === '1') {
    if (product === PM_PRODUCT_TYPE.HEALTH_AND_DENTAL) {
      return HD_DOCUMENTS_ENDPOINT;
    }
  }
  return DOCUMENTS_ENDPOINT;
}

export function postUtm(payload) {
  const endpoint = `${ANALYTICS_ENDPOINT}/utm`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postUtm', endpoint, res, payload);
      }
      return res;
    })
    .then(res => res.json());
}

export function postUtmTracking(globalId, payload) {
  const endpoint = `${ANALYTICS_ENDPOINT}/utm/${globalId}/tracking`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postUtmTracking', endpoint, res, payload);
      }
      return res;
    })
    .then(res => res.json());
}

export function patchUtm(globalId, trackingId, payload) {
  const endpoint = `${ANALYTICS_ENDPOINT}/utm/${globalId}/tracking/${trackingId}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchUtm', endpoint, res, payload);
      }
      return res;
    })
    .then(res => res.json());
}

export function patchExpenses(householdId, householdIdVers, payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/household_infos/${householdId}/${householdIdVers}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchExpenses', endpoint, res, payload);
      }
      return res;
    })
    .then(res => res.json());
}

export function postConversion(conversion_type, payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/conversion/${conversion_type}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postConversion', endpoint, res, payload);
      }
      return res;
    })
    .then(res => res.json());
}

export function postCrm(payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/crm`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postCrm', endpoint, res, payload);
      }
      return res.json();
    });
}

export function postHouseholdInfos(data) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/household_infos`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postHouseholdInfos', endpoint, res, data);
      }
      return res.json();
    });
}

export function putHouseholdInfos(householdId, householdIdVers, payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/household_infos/${householdId}/${householdIdVers}`;
  return fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('putHouseholdInfos', endpoint, res, payload);
      }
      return res.json();
    });
}

export function patchHouseholdInfos(household_id, household_id_vers, payload) {
  // If email or phone fields are masked, it means they already exist in the DB
  // hence we want to remove them from the payload
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/household_infos/${household_id}/${household_id_vers}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchHouseholdInfos', endpoint, res, payload);
      }
      return res.json();
    });
}

export function getEmailVerification(email) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/email/verify?email=${email}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getEmailVerification', endpoint, res);
    }
    return res.json();
  });
}

export function checkPhoneNumberExists(app_id) {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users/${app_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('checkPhoneNumberExists', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function postDocusignEnvelope(
  policy_id,
  source,
  user_type,
  is_download_policy_journey = false,
) {
  const endpoint = `${DOCUSIGN_ENDPOINT}/envelope/${policy_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(
      {
        source,
        user_type,
        is_download_policy_journey,
        // if we're going to add any more here we should use an object instead of more params
      },
    ),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postDocusignEnvelope', endpoint, res, {
        source,
        user_type,
        is_download_policy_journey,
      });
    }
    return res.json();
  });
}

export const postDocusignEnvelopeUpload = async (policy_id) => {
  const endpoint = `${DOCUSIGN_ENDPOINT}/envelope-upload/policy/${policy_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({}),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postDocusignEnvelopeUpload', endpoint, res);
    }
    return res.json();
  });
};

export function postABTestData(session_id, payload) {
  const endpoint = `${ANALYTICS_ENDPOINT}/pm_ab_test/${session_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postABTestData', endpoint, res, payload);
    }
    return res.json();
  });
}

export function postDisclosureSession(
  hd_app_id,
  hh_info_id,
) {
  const appId = hd_app_id;
  const endpoint = `${AURA_ENDPOINT}/disclosure/session/${appId}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({ hd_app_id, hh_info_id }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postDisclosureSession', endpoint, res, {
        hd_app_id, hh_info_id,
      });
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function patchDisclosureSession(aura_session_id, payload = {}) {
  const endpoint = `${AURA_ENDPOINT}/disclosure/session/${aura_session_id}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('patchDisclosureSession', endpoint, res, payload);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function postGiAuraSession(payload) {
  const endpoint = `${AURA_ENDPOINT}/disclosure/gi_session`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postGiAuraSession', endpoint, res, payload);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function getDisclosureNextQuestion(aura_session_id, question_id) {
  const endpoint = `${AURA_ENDPOINT}/disclosure/session/${aura_session_id}/question/${question_id}/next`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getDisclosureNextQuestion', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function patchDisclosureAnswer(
  aura_session_id,
  question_id,
  payload,
) {
  const endpoint = `${AURA_ENDPOINT}/disclosure/session/${aura_session_id}/question/${question_id}`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('patchDisclosureAnswer', endpoint, res, payload);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function getDisclosureSearch(aura_session_id, question_id, query) {
  const endpoint = `${AURA_ENDPOINT}/disclosure/session/${aura_session_id}/question/${question_id}?search=${query}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getDisclosureSearch', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function postAuraDecisionCalc(
  policy_id, { hh_info_id },
) {
  const endpoint = `${AURA_ENDPOINT}/decision/${policy_id}/calc`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({ hh_info_id }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postAuraDecisionCalc', endpoint, res, { hh_info_id });
    }
    return res.json();
  }).then(res => {
    // Convert response to camelCase
    let convertedRes = res.data;
    Object.values(PM_PRODUCT_TYPE).forEach((product) => {
      if (convertedRes[product]) {
        convertedRes[product].discounts = snakeToCamelCase(convertedRes[product].discounts);
      }
    });
    return convertedRes;
  });
}

export async function postOverallAuraDecisionCalc({
  policy_id,
}) {
  const endpoint = `${AURA_ENDPOINT}/decision/${policy_id}/calc_overall`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  });

  if (!response.ok) {
    throw await handleApiError('postOverallAuraDecisionCalc', endpoint, response);
  }

  const { data } = await response.json();

  // TODO: add snakeToCamelCase for discounts (if needed for H&D)

  return data;
}

export function postIdVerificationCheck(policy_id) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/id-verification/${policy_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: null,
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postIdVerificationCheck', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
}

export function postAuraAuthorization(policy_id, payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/aura_authorization/${policy_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postAuraAuthorization', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
}

export function getAuthUserInfo(app_id) {
  return accountIdWrapper(getAuthUserInfoUserId, getAuthUserInfoAccountId, app_id);
}

function getAuthUserInfoUserId(app_id) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/policy/${app_id}/journey`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getAuthUserInfo', endpoint, res);
    }
    return res.json();
  }).then(res => {
    let convertedRes = res.data;
    Object.values(PM_PRODUCT_TYPE).forEach((product) => {
      if (convertedRes.primary[product]) {
        convertedRes.primary[product].discounts =
          snakeToCamelCase(convertedRes.primary[product].discounts);
      }
      if (convertedRes.secondary[product]) {
        convertedRes.secondary[product].discounts =
          snakeToCamelCase(convertedRes.secondary[product].discounts);
      }
      if (convertedRes.dependents.length > 0) {
        convertedRes.dependents.map((depObj) => {
          let depObjCopy = depObj;
          if (depObjCopy[product]) {
            depObjCopy[product].discounts = snakeToCamelCase(depObjCopy[product].discounts);
          }
          return {
            ...depObjCopy,
          };
        });
      }
    });
    console.log(convertedRes.dependents);
    return convertedRes;
  });
}

function getAuthUserInfoAccountId(app_id) {
  const endpoint = `${GLOBAL_MAIN_BASE_ENDPOINT}/v2/policy/${app_id}/journey`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getAuthUserInfo', endpoint, res);
    }
    return res.json();
  }).then(res => {
    let convertedRes = res.data;
    Object.values(PM_PRODUCT_TYPE).forEach((product) => {
      if (convertedRes.primary[product]) {
        convertedRes.primary[product].discounts =
          snakeToCamelCase(convertedRes.primary[product].discounts);
      }
      if (convertedRes.secondary[product]) {
        convertedRes.secondary[product].discounts =
          snakeToCamelCase(convertedRes.secondary[product].discounts);
      }
      if (convertedRes.dependents.length > 0) {
        convertedRes.dependents.map((depObj) => {
          let depObjCopy = depObj;
          if (depObjCopy[product]) {
            depObjCopy[product].discounts = snakeToCamelCase(depObjCopy[product].discounts);
          }
          return {
            ...depObjCopy,
          };
        });
      }
    });
    console.log(convertedRes.dependents);
    return convertedRes;
  });
}

export function postValidateContact(app_id, payload) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/auth/application/${app_id}/validate`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postValidateContact', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
}

export function postSecondaryAppToken(app_id) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/auth/application/secondary/${app_id}/token`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postSecondaryAppToken', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function getABTestRecords(session_id) {
  const endpoint = `${ANALYTICS_ENDPOINT}/pm_ab_test/${session_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getABTestRecords', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export const postProductSessionDiscounts = (session_id, payload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/product_sessions/${session_id}/discounts`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postProductSessionDiscounts', endpoint, res, payload);
      }
      return res.json();
    })
    .then(res => res.data);
};

interface UpsertDiscountPayload {
  discounts: Array<string>,
  orig_mn_prems: string,
  orig_yr_prems: string,
  is_joint: boolean,
  has_dependents: boolean,
  product_prefix: ProductPrefix
}
export const addProductSessionDiscounts = (session_id: string, payload: UpsertDiscountPayload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/product_sessions/${session_id}/upsert_discounts`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('addProductSessionDiscounts', endpoint, res, payload);
      }
      return res.json();
    })
    .then(res => res.data);
};

interface DeleteDiscountsPayload {
  discounts: Array<string>,
  product_prefix: ProductPrefix
}
export const removeProductSessionDiscounts =
(session_id: string, payload: DeleteDiscountsPayload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/product_sessions/${session_id}/delete_discounts`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'DELETE',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('removeProductSessionDiscounts', endpoint, res, payload);
      }
      return res.json();
    })
    .then(res => res.data);
};

export function postFacebookTrackEvent(payload) {
  const endpoint = `${ANALYTICS_ENDPOINT}/facebook/fb-event`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postFacebookTrackEvent', endpoint, res, payload);
      }
      return res;
    });
}

export const updatePartnerPlaceholderEmail = (app_id, payload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/account/email/${app_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('updatePartnerPlaceholderEmail', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export const sendVerificationAuth0Email = (app_id, close_policy_flag = false) => {
  return accountIdWrapper(sendVerificationAuth0EmailUserId, sendVerificationAuth0EmailAccountId, app_id, close_policy_flag);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link sendVerificationAuth0EmailAccountId} instead
 */
const sendVerificationAuth0EmailUserId = (app_id,
  close_policy_flag = false) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/auth0/email`;
  const orgHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  const headers = injectMagicLinkIntegrationTestHeaders(orgHeaders);
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull(
      { app_id, close_policy_flag, from_accounts: false, application_lang: jsCookie.get('lang') },
    )),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('sendVerificationAuth0Email', endpoint, res, { app_id, close_policy_flag });
    }
    return res.json();
  }).then(res => res.data);
};

const sendVerificationAuth0EmailAccountId = (app_id,
  close_policy_flag = false) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/email/auth0`;
  const orgHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  const headers = injectMagicLinkIntegrationTestHeaders(orgHeaders);
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull(
      { app_id, close_policy_flag, from_accounts: false, application_lang: jsCookie.get('lang') },
    )),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('sendVerificationAuth0EmailAccountId', endpoint, res, { app_id, close_policy_flag });
    }
    return res.json();
  }).then(res => res.data);
};

export const sendCheckPolicyClosed = (policy_id) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/policy/is_policy_closed/${policy_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('sendCheckPolicyClosed', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link verifyEmailMagicLinkAccountId} instead
 */
export const verifyEmailMagicLink = (
  code, app_id,
) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/email_link/${code}/validate`;
  const orgHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  const headers = injectMagicLinkIntegrationTestHeaders(orgHeaders);
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      app_id,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyEmailMagicLink', endpoint, res, { app_id });
    }
    return res.json();
  }).then(res => res.data);
};

export const verifyEmailMagicLinkAccountId = (
  code, app_id,
) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/email/${code}/validate`;
  const orgHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  const headers = injectMagicLinkIntegrationTestHeaders(orgHeaders);
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      app_id,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyEmailMagicLinkAccountId', endpoint, res, { app_id });
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link verifyAuth0MagicLink} instead
 */
export const verifyAuth0EmailMagicLink = (
  app_id,
  user_id,
) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/email-link/auth0/validate/${user_id}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      app_id,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyAuth0EmailMagicLink', endpoint, res, { app_id });
    }
    return res.json();
  }).then(res => res.data);
};

export const verifyAuth0MagicLink = (
  app_id,
  account_id,
) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/email/auth0/validate/${account_id}`;
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-hd-webapp-main-version': RELEASE_VERSION,
  };
  return fetch(endpoint, {
    headers,
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      app_id,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyAuth0MagicLink', endpoint, res, { app_id });
    }
    return res.json();
  }).then(res => res.data);
};

export const getAffiliateInfo = (affiliateId) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/affiliate/${affiliateId}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getAffiliateInfo', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link getAllInProgressPolicies} instead
 */
export const getInProgressPolicies = (user_id, product, isPermanent) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/policy/in_progress_policy/${product}/${user_id}?isPermanent=${isPermanent}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getInProgressPolicies', endpoint, res);
    }
    return res.json();
  }).then(res => res.data.has_in_progress_policy);
};

export const getAllInProgressPolicies = (account_id, product, isPermanent) => {
  const endpoint = `${GLOBAL_MAIN_BASE_ENDPOINT}/v2/policy/in_progress_policy/${product}/account/${account_id}?isPermanent=${isPermanent}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getAllInProgressPolicies', endpoint, res);
    }
    return res.json();
  }).then(res => res.data.has_in_progress_policy);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link closeInProgressPoliciesForAccount} instead
 */
export const closeInProgressPolicies = (
  payload,
  user_id,
  isPermanent,
) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/policy/close_in_progress_policies/${user_id}?isPermanent=${isPermanent}`;
  return fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('closeInProgressPolicies', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data.policy_id);
};

export const closeInProgressPoliciesForAccount = (
  payload,
  account_id,
  isPermanent,
) => {
  const endpoint = `${GLOBAL_MAIN_BASE_ENDPOINT}/v2/policy/close_in_progress_policies/account/${account_id}?isPermanent=${isPermanent}`;
  return fetch(endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('closeInProgressPoliciesForAccount', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data.policy_id);
};

export const postAccRatedAlertCallback = (payload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/advisor/callback/${payload.session_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postAccRatedAlertCallback', endpoint, res, payload);
    }
    return res;
  });
};

export const postGenerateAdvisor = (payload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/advisor/${payload.app_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postGenerateAdvisor', endpoint, res, payload);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
};

export const validateJiraToken = (
  jiraToken,
) => {
  return fetch(JIRA_RESOURCES_ENDPOINT, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jiraToken}`,
    },
    method: 'GET',
  }).then(res => {
    return res.status === 200;
  }).catch(err => {
    return false;
  });
};

export const createJireTicketWithState = (
  jiraTicketTitle,
  jiraTicketDesc,
  selectedTeam,
  currState,
  jiraToken,
  jiraTicketNumber,
) => {
  return fetch(`${internal_endpoint}${COPY_STATE_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ 'jira-token': `${jiraToken}`, 'jira-ticket-title': jiraTicketTitle, 'jira-ticket-desc': jiraTicketDesc, 'proj-team': selectedTeam, state: currState, 'jira-ticket': jiraTicketNumber }),
  })
    .then(res => {
      if (!res.ok) {
        return res.status;
      }
      return res.json();
    });
};

export const getJiraToken = (
  code,
) => {
  return fetch('https://auth.atlassian.com/oauth/token', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(
      {
        grant_type: 'authorization_code',
        client_id: jira_client_id,
        client_secret: jira_client_secret,
        code,
        redirect_uri: jira_redirect_url,
      },
    ),
  })
    .then(res => {
      if (!res.ok) {
        return res.status;
      }
      return res.json();
    })
    .catch(err => {
      return err;
    });
};

export const refreshJiraToken = (
  refresh_token,
) => {
  return fetch('https://auth.atlassian.com/oauth/token', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(
      {
        grant_type: 'refresh_token',
        client_id: jira_client_id,
        client_secret: jira_client_secret,
        refresh_token,
        redirect_uri: jira_redirect_url,
      },
    ),
  })
    .then(res => {
      if (!res.ok) {
        return res.status;
      }
      return res.json();
    })
    .catch(err => {
      return 401;
    });
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postAccountsRecord} instead
 */
export const postAccountRecord = (
  email,
  account_language_preference,
  ab_test_band,
  analytics_blocked,
  initial_login_method_attempt,
  disableUpdateIfExists = false,
) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      email,
      account_language_preference,
      ab_test_band,
      analytics_blocked,
      disableUpdateIfExists,
      initial_login_method_attempt,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postAccountRecord', endpoint, res, { email, account_language_preference, ab_test_band, analytics_blocked, disableUpdateIfExists, initial_login_method_attempt });
    }
    return res.json();
  }).then(res => res.data);
};

export const postAccountsRecord = (
  email,
  account_language_preference,
  ab_test_band,
  analytics_blocked,
  initial_login_method_attempt,
  disableUpdateIfExists = false,
) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(fromStrToNull({
      email,
      account_language_preference,
      ab_test_band,
      analytics_blocked,
      disableUpdateIfExists,
      initial_login_method_attempt,
    })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postAccountsRecord', endpoint, res, { email, account_language_preference, ab_test_band, analytics_blocked, disableUpdateIfExists, initial_login_method_attempt });
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link patchMarketingCommsConsent} instead
 */
export const patchMarketingCommunicationsConsent = (
  user_id,
  marketing_comms_consent,
) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/account/${user_id}/marketing_communication_consent`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
    body: JSON.stringify({ marketing_comms_consent }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('patchMarketingCommunicationsConsent', endpoint, res,
        { marketing_comms_consent });
    }
    return res.json();
  }).then(res => res.data);
};

export const patchMarketingCommsConsent = (
  account_id,
  marketing_comms_consent,
) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts/${account_id}/marketing_communication_consent`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
    body: JSON.stringify({ marketing_comms_consent }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('patchMarketingCommsConsent', endpoint, res,
        { marketing_comms_consent });
    }
    return res.json();
  }).then(res => res.data);
};

export const patchAuthUser = (policy_id) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users/policies/${policy_id}/alternateId`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('patchAuthUser', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
};

export const getDropLink = (policy_id) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/get_verify_link/${policy_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getDropLink', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postUpsertCustomerIDForAccount} instead
 */
export const postUpsertCustomerID = (payload) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/user/${payload?.user_id}/customer`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postUpsertCustomerID', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export const postUpsertCustomerIDForAccount = (payload) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/account/${payload?.account_id}/customer`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postUpsertCustomerIDForAccount', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postStripeCreateSetupIntentForAccount} instead
 */
export const postStripeCreateSetupIntent = (payload, user_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/user/${user_id}/customer/${payload?.stripe_customer_id}/setup-intent`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postStripeCreateSetupIntent', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export const postStripeCreateSetupIntentForAccount = (payload, account_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/account/${account_id}/customer/${payload?.stripe_customer_id}/setup-intent`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postStripeCreateSetupIntentForAccount', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postCreateSubscriptionAndFinalizeStripeSubscriptionForAccount} instead
 */
// eslint-disable-next-line max-len
export const postCreateSubscriptionAndFinalizeStripeSubscription = (payload, user_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/user/${user_id}/customer/${payload?.stripe_customer_id}/subscription-and-finalize`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    // 402: We need to capture the payment error so we don't reject the promise
    if (!res.ok && res.status !== 402) {
      return handleApiError('postCreateSubscriptionAndFinalizeStripeSubscription', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data || res);
};

// eslint-disable-next-line max-len
export const postCreateSubscriptionAndFinalizeStripeSubscriptionForAccount = (payload, account_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/account/${account_id}/customer/${payload?.stripe_customer_id}/subscription-and-finalize`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    // 402: We need to capture the payment error so we don't reject the promise
    if (!res.ok && res.status !== 402) {
      return handleApiError('postCreateSubscriptionAndFinalizeStripeSubscriptionForAccount', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data || res);
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postCreateHDSubscriptionAndFinalizeStripeSubscriptionForAccount} instead
 */
// eslint-disable-next-line max-len
export const postCreateHDSubscriptionAndFinalizeStripeSubscription = (payload, user_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/user/${user_id}/customer/${payload.stripe_customer_id}/hd-subscription-and-finalize`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    // 402: We need to capture the payment error so we don't reject the promise
    if (!res.ok && res.status !== 402) {
      return handleApiError('postCreateSubscriptionAndFinalizeStripeSubscription', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data || res);
};

// eslint-disable-next-line max-len
export const postCreateHDSubscriptionAndFinalizeStripeSubscriptionForAccount = (payload, account_id) => {
  const endpoint = `${PAYMENTS_ENDPOINT}/account/${account_id}/customer/${payload.stripe_customer_id}/hd-subscription-and-finalize`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    // 402: We need to capture the payment error so we don't reject the promise
    if (!res.ok && res.status !== 402) {
      return handleApiError('postCreateHDSubscriptionAndFinalizeStripeSubscriptionForAccount', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data || res);
};

export function postFamily(data) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/add_to_family/${data.hh_info_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postFamilyMemberHouseholdInfo', endpoint, res, data);
      }
      return res.json();
    });
}

export function postSessionQuotes(session_id, data) {
  const endpoint = `${HD_MAIN_ENDPOINT}/hd_sessions/${session_id}/quotes`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postSessionQuotes', endpoint, res, data);
      }
      return res.json();
    });
}

export function patchSessionQuotes(session_id, data) {
  const endpoint = `${HD_MAIN_ENDPOINT}/hd_sessions/${session_id}/quotes`;
  return fetch(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchSessionQuotes', endpoint, res, data);
      }
      return res.json();
    });
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link getAccountInformation} instead
 */
export function getUserAccountInformation(user_id) {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users/${user_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getUserAccountInformation', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function getAccountInformation(account_id) {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts/${account_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getAccountInformation', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link getWebappAccountInformation} instead
 */
export function getWebappUserAccountInformation(user_id) {
  const endpoint = `${ACCOUNTS_ENDPOINT}/webapp/users/${user_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getWebappUserAccountInformation', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function getWebappAccountInformation(account_id) {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/webapp/accounts/${account_id}`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getWebappAccountInformation', endpoint, res);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export function fetchSessionQuotes(data) {
  const endpoint = `${HD_QUOTES_ENDPOINT}/quotes`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('fetchSessionQuotes', endpoint, res, data);
      }
      return res.json();
    });
}

export function postSetupHbm(policy_id) {
  const endpoint = `${HBM_ENDPOINT}/plan_member/${policy_id}/upsert`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postSetupHbm', endpoint, res);
      }
      return res.json();
    });
}

export function postHDExclusionsDeclaration(hd_policy_id, payload) {
  const endpoint = `${HD_MAIN_ENDPOINT}/hd_exclusions_declaration/${hd_policy_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postHDExclusionsDeclaration', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link getUserAccount2FaStatus} instead
 */
export const getUser2FaStatus = async (userId) => {
  const USER_ACCOUNT_PATH = '/users';
  const endpoint = `${ACCOUNTS_ENDPOINT}${USER_ACCOUNT_PATH}/${userId}/two_factor_status`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getUser2FaStatus', endpoint, res);
    }
    return res.json();
  });
};

export const getUserAccount2FaStatus = async (account_id) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts/${account_id}/two_factor_status`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getUserAccount2FaStatus', endpoint, res);
    }
    return res.json();
  });
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postPhoneNumberForAccount2Fa} instead
 */
export const postPhoneNumberFor2Fa = async (user_id, phone) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/phone/validate/${user_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(fromStrToNull({ phone })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postPhoneNumberFor2FA', endpoint, res, { phone });
    }
    return res.json();
  });
};

export const postPhoneNumberForAccount2Fa = async (account_id, phone) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/phone/validate/${account_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(fromStrToNull({ phone })),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postPhoneNumberForAccount2Fa', endpoint, res, { phone });
    }
    return res.json();
  });
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link verifyAccountOTP} instead
 */
export const verifyOTP = async (user_id, otp) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/phone/verify-otp/${user_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: otp ? JSON.stringify(fromStrToNull({ otp })) : JSON.stringify(fromStrToNull({})),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyOTP', endpoint, res, { otp });
    }
    return res.json();
  });
};

export const verifyAccountOTP = async (account_id, otp) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/phone/verify-otp/${account_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: otp ? JSON.stringify(fromStrToNull({ otp })) : JSON.stringify(fromStrToNull({})),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('verifyAccountOTP', endpoint, res, { otp });
    }
    return res.json();
  });
};

export const downloadQADocument = async ({
  product_type,
  app_id,
  qa_document_origin,
  is_digital_consent_application,
}: {
  product_type: ProductTypeFull,
  app_id: string,
  qa_document_origin?: Enum<typeof QA_DOCUMENT_ORIGIN>,
  is_digital_consent_application?: boolean,
}) => {
  const endpoint = `${getProductDocumentsEndpoint(product_type)}/consent-qa/${app_id}`;
  const body:any = {
    product_type,
  };
  if (qa_document_origin) {
    body.qa_document_origin = qa_document_origin;
  }
  if (is_digital_consent_application) {
    body.is_digital_consent_application = is_digital_consent_application;
  }
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });

  if (!response.ok) {
    return handleApiError('downloadQADocument', endpoint, response, body);
  }

  const responseBlob = await response.blob();

  const contentDisposition = response.headers.get('Content-Disposition');

  const filename = getFileNameFromContentDisposition(contentDisposition);

  return [responseBlob, filename];
};

export function postDigitalConsentStatus(
  policy_id,
  digital_consent_status,
) {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/policy/digital_consent_status/${policy_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({
      digital_consent_status,
    }),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postDigitalConsentStatus', endpoint, res, { digital_consent_status });
      }
      return res.json();
    });
}

export const downloadHDConsentDoc = async ({
  product_type,
  app_id,
}) => {
  const endpoint = `${getProductDocumentsEndpoint(product_type)}/hd-confirmation/${app_id}`;
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_type,
    }),
    method: 'POST',
  });

  if (!response.ok) {
    return handleApiError('downloadHDConsentDoc', endpoint, response, { product_type });
  }

  const responseBlob = await response.blob();

  const contentDisposition = response.headers.get('Content-Disposition');

  let filename = '';

  if (contentDisposition) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    let matches = filenameRegex.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  return [responseBlob, filename];
};

export function postGenerateAndUploadConsentDocuments(
  policy_id,
  product_type,
) {
  const endpoint = `${getProductDocumentsEndpoint(product_type)}/upload-digital-consent/${policy_id}`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({
      fail_documents: false,
    }),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postGenerateAndUploadConsentDocuments', endpoint, res, { fail_documents: false });
      }
      return res.json();
    });
}

export const downloadPolicyCoverageTerms = async ({
  policy_id,
  product_type
}) => {
  const endpoint = `${getProductDocumentsEndpoint(product_type)}/policy-coverage-terms/${policy_id}`;
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    method: 'POST',
  });

  if (!response.ok) {
    return handleApiError('downloadPolicyCoverageTerms', endpoint, response);
  }

  const responseBlob = await response.blob();

  const contentDisposition = response.headers.get('Content-Disposition');

  const filename = getFileNameFromContentDisposition(contentDisposition);

  return [responseBlob, filename];
};

export const getTraceId = async () => {
  const endpoint = `${PM_DEVOPS_ENDPOINT}/api/global-devops/v1/trace`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      return handleApiError('getTraceId', endpoint, res);
    }
    return res.json();
  });
};

export const postValidateDigitalConsentDocuments = async (
  policy_id:string,
  product_type: ProductTypeFull,
):Promise<boolean> => {
  const endpoint = `${getProductDocumentsEndpoint(product_type)}/digital-consent/validate-document-generation/${policy_id}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify({}),
  });
  if (!res.ok) {
    return handleApiError('postValidateDigitalConsentDocuments', endpoint, res);
  }

  return true;
};

export interface IPostSendOTPResponse {
  data: {
    failed: boolean;
    invalid: false;
    num_attempts_remaining: number;
    num_resend_attempts: number;
    success: boolean;
  }
}

export const postSendOTP = async (
  app_id: string,
  application_lang: typeof LOCALE[keyof typeof LOCALE],
): Promise<IPostSendOTPResponse> => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/auth0/otp/${app_id}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ app_id, application_lang }),
  });
  if (!res.ok) {
    return handleApiError('postSendOTP', endpoint, res, { app_id, application_lang });
  }

  return res.json();
};

export interface IVerifyOTPResponse {
  data: {
    expired: boolean;
    failed: boolean;
    num_otp_attempts_remaining: number;
    success: boolean;
  }
}

export const postVerifyOTP = async (
  app_id: string,
  otp: string,
): Promise<IVerifyOTPResponse> => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/auth0/otp/verify/${app_id}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ app_id, otp }),
  });
  if (!res.ok) {
    return handleApiError('postVerifyOTP', endpoint, res, { app_id, otp });
  }

  return res.json();
};

export interface IValidatePurchaseJourneyParamsResponse {
  data: boolean;
}

export interface IValidatePurchaseJourneyParamsRequest {
  app_id: string;
  email: string;
  external_advisor_id: string;
  user_id: string;
  product_type: string;
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link validatePurchaseJourneyParameters} instead
 */
export const validatePurchaseJourneyParams = async (
  params: IValidatePurchaseJourneyParamsRequest,
): Promise<IValidatePurchaseJourneyParamsResponse> => {
  const { app_id, email, external_advisor_id, user_id, product_type } = params;
  console.log('validatePurchaseJourneyParams', params);
  const endpoint = `${ACCOUNTS_ENDPOINT}/validate-params/${app_id}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, external_advisor_id, user_id, product_type }),
  });
  if (!res.ok) {
    return handleApiError('validatePurchaseJourneyParams', endpoint, res,
      { email, external_advisor_id, user_id, product_type });
  }

  return res.json();
};

export interface IValidatePurchaseJourneyParametersRequest {
  app_id: string;
  email: string;
  external_advisor_id: string;
  account_id: string;
  product_type: string;
}

export const validatePurchaseJourneyParameters = async (
  params: IValidatePurchaseJourneyParametersRequest,
): Promise<IValidatePurchaseJourneyParamsResponse> => {
  const { app_id, email, external_advisor_id, account_id, product_type } = params;
  console.log('validatePurchaseJourneyParameters', params);
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/validate-params/${app_id}`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ email, external_advisor_id, account_id, product_type }),
  });
  if (!res.ok) {
    return handleApiError('validatePurchaseJourneyParameters', endpoint, res,
      { email, external_advisor_id, account_id, product_type });
  }

  return res.json();
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link saveUserConsentForAccount} instead
 */
export async function saveUserConsent({ user_id, consent }) {
  const endpoint = `${ACCOUNTS_ENDPOINT}/user/${user_id}/consent`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(consent),
  });
  if (!res.ok) {
    return handleApiError('saveUserConsent', endpoint, res, consent);
  }
  return res.json();
}

export async function saveUserConsentForAccount({ account_id, consent }) {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts/${account_id}/user_consent`;
  const res = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    body: JSON.stringify(consent),
  });
  if (!res.ok) {
    return handleApiError('saveUserConsentForAccount', endpoint, res, consent);
  }
  return res.json();
}

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link upsertAccountMetadata} instead
 */
export const upsertUserMetadata = (
  user_id: string,
  metadata_key: string,
  metadata_value: string,
) => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users/${user_id}/tenant-account-metadata/upsert`;

  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PUT',
    body: JSON.stringify({
      metadata_key,
      metadata_value,
    }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('upsertUserMetadata', endpoint, res, { metadata_key, metadata_value });
    }
    return res.json();
  }).then(res => res.data);
};

export const upsertAccountMetadata = (
  account_id: string,
  metadata_key: string,
  metadata_value: string,
) => {
  const endpoint = `${ACCOUNTS_BASE_ENDPOINT}/v2/accounts/${account_id}/tenant-account-metadata/upsert`;

  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PUT',
    body: JSON.stringify({
      metadata_key,
      metadata_value,
    }),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('upsertAccountMetadata', endpoint, res, { metadata_key, metadata_value });
    }
    return res.json();
  }).then(res => res.data);
};

export const getLoginStatus = () => {
  const endpoint = `${ACCOUNTS_ENDPOINT}/users/login_status`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'GET',
  }).then(res => {
    if (!res.ok) {
      if (res.status === 401) {
        return { logged_in: false };
      }
      return handleApiError('checkLoginStatus', endpoint, res);
    }
    return res.json();
  }).then(res => res.data);
};

export const postAdvisorLedCheckout = (data: { isAdvisorLedCheckout: boolean, appId: string }) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/advisor/payment-checkout/${data.appId}`;

  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'POST',
    body: JSON.stringify({ is_advisor_led_checkout: data.isAdvisorLedCheckout }),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('postAdvisorLedCheckout', endpoint, res);
      }
      return res.json();
    }).then(res => res.data);
};
