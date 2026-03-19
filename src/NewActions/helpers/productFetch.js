/* eslint no-restricted-syntax: ["error", {
  "selector": "NewExpression[callee.name='Error']",
  "message": "Use HandleApiError instead of throwing new Error for handling API requests errors"
}] */

import { handleApiError, ApiRequestError } from '@policyme/global-libjs-utils';
import {
  RELEASE_VERSION, GLOBAL_MAIN_ENDPOINT, DOCUSIGN_ENDPOINT,
  HD_MAIN_ENDPOINT, HD_MAIN_BASE_ENDPOINT,
} from '../../config';
import { PM_PRODUCT_PREFIX, PM_PRODUCT_TYPE, USER_TYPES } from '../../utils/const';
import { fetch } from '../../utils/fetch';

const getProductMainEndpoint = (product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return HD_MAIN_ENDPOINT;
  }

  return '';
};

const getCreateAppEndpointByProduct = (product) => {
  if (product === PM_PRODUCT_PREFIX.HD) {
    return `${HD_MAIN_BASE_ENDPOINT}/v2`;
  }

  return '';
};

const getProductQuotesEndpoint = (product) => {
  return '';
};

export const postProductSession = (product, slice) => {
  const hh_info_id = slice.household_id;
  const determine_plan = slice.determine_plan;
  const losing_benefits = slice.losing_benefits;
  const prescription_drug_flag = slice.prescription_drug_flag;
  const existing_hd_plan_flag = slice.existing_hd_plan_flag;
  const existing_hd_plan_option = slice.existing_hd_plan_option;
  const coverage_fit_flag = slice.coverage_fit_flag;
  const family_composition_flag = slice.family_composition_flag;
  const household_income = slice.household_income;
  const family_id = slice[`${product}_family_id`];
  const affiliate_id = slice.affiliate_id;
  const plan_type = slice.plan_type;
  const payload = product === PM_PRODUCT_PREFIX.HD ?
    {
      family_id,
      affiliate_id,
      plan_type,
      determine_plan,
      existing_hd_plan_flag,
      existing_hd_plan_option,
      prescription_drug_flag,
      hh_info_id,
      losing_benefits,
      coverage_fit_flag,
      family_composition_flag,
      household_income,
    } : { hh_info_id, affiliate_id };
  const endpoint = `${getProductMainEndpoint(product)}/${product}_sessions/${hh_info_id}`;
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
        return handleApiError('postProductSession', endpoint, res, payload);
      }
      return res.json();
    });
};

export const patchProductSession = (product, slice, payload) => {
  const session_id = slice[`${product}_session_id`];
  const endpoint = `${getProductMainEndpoint(product)}/${product}_sessions/${session_id}`;

  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchProductSession', endpoint, res, payload);
      }
      return res.json();
    });
};

export const postAssociateJointProductSessions = (
  product,
  primary_app_id,
  secondary_app_id,
) => {
  const payload = { app_id: secondary_app_id };
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/applications/${primary_app_id}/link/joint`;
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
      return handleApiError('postAssociateJointProductSessions', endpoint, res, payload);
    }
    return res.json();
  });
};

/**
 * @deprecated ACCOUNT_ID_MIGRATION This function is being deprecated. Please refer to https://policyme.atlassian.net/wiki/spaces/SMPL/pages/3855220791/TD+Update+Account+Identifier#%F0%9F%9A%A7-Development-Status to determine the current status of this initiative and what steps to follow.
 * @note ACCOUNT_ID_MIGRATION_DEPRECATED Use {@link postProductAppForAccount} instead
 */
export const postProductApp = (product, product_session_id, payload) => {
  const endpoint = `${getProductMainEndpoint(product)}/${product}_apps/session/${product_session_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postProductApp', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export const postProductAppForAccount = (product, product_session_id, payload) => {
  const endpoint = `${getCreateAppEndpointByProduct(product)}/${product}_apps/session/${product_session_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.ok) {
      return handleApiError('postProductApp', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export const patchProductApp = (product, app_id, payload) => {
  const endpoint = `${getProductMainEndpoint(product)}/${product}_apps/${app_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchProductApp', endpoint, res, payload);
      }
      return res.json();
    })
    .then(res => res.data);
};

export const patchInsuranceOwnershipType = (app_id, payload) => {
  const endpoint = `${GLOBAL_MAIN_ENDPOINT}/app/insurance_ownership_type/${app_id}`;
  return fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
    .then(res => {
      if (!res.ok) {
        return handleApiError('patchInsuranceOwnershipType', endpoint, res, payload);
      }
      return res.json();
    })
    .then(res => res.data);
};

export const postProductPolicies = (product, payload, userType) => {
  const endpoint = `${getProductMainEndpoint(product)}/${product}_policies/${payload.app_id}`;
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
      return handleApiError('postProductPolicies', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
};

export function patchProductPolicies(product, policy_id, payload) {
  const endpoint = `${getProductMainEndpoint(product)}/${product}_policies/${policy_id}`;
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
      return handleApiError('patchProductPolicies', endpoint, res, payload);
    }
    return res.json();
  }).then(res => res.data);
}

export function sendProductEligibilityStatus(product, app_id, payload) {
  const endpoint = `${getProductMainEndpoint(product)}/eligible/${app_id}`;
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
      return handleApiError('sendProductEligibilityStatus', endpoint, res, payload);
    }
    return res.json();
  }).then(res => {
    return res.data;
  });
}

export async function fetchQuotes(product, args, withDebits = false) {
  const { amt, term, day, mon, yr, userGender, smoke, isJoint, hasDependents, seq_num,
    discount_codes, uw_total_debits, uw_flat_extra_debits,
    partner_uw_total_debits, partner_uw_flat_extra_debits, application_date,
    insurance_ownership_type, underwriting_method } = args;
  let endpoint = `${getProductQuotesEndpoint(product)}/quotes${withDebits ? '-with-ratings' : ''}?` +
    `amt=${amt}&term=${term}&is_joint=${isJoint}&has_dependents=${hasDependents}` +
    `&birthday=${day}&birthmon=${mon}&birthyr=${yr}&gender=${userGender}&is_smoker=${smoke}` +
    `&total_debits=${uw_total_debits}&flat_extra_debits=${uw_flat_extra_debits}&insurance_ownership_type=${insurance_ownership_type}` +
    `&underwriting_method=${underwriting_method}`;

  if (isJoint) {
    const { partnerDay, partnerMon, partnerYr, partnerGender, partnerSmoke } = args;
    endpoint += `&partner_birthday=${partnerDay}&partner_birthmon=${partnerMon}&partner_birthyr=${partnerYr}` +
      `&partner_gender=${partnerGender}&partner_is_smoker=${partnerSmoke}` +
      `&partner_total_debits=${partner_uw_total_debits}&partner_flat_extra_debits=${partner_uw_flat_extra_debits}`;
  }

  if (discount_codes.length > 0) {
    endpoint += `&discount_codes=${encodeURIComponent(discount_codes.join())}`;
  }

  if (application_date) {
    endpoint += `&application_date=${application_date}`;
  }

  endpoint += `&seq_num=${seq_num}`;
  let res = null;
  res = await fetch(endpoint,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-hd-webapp-main-version': RELEASE_VERSION,
      },
    });
  if (!res.ok) {
    if (res.status === 404) {
      const error_body = await res.json();
      if (error_body?.error) {
        return Promise.reject(new ApiRequestError(error_body.error));
      }
    }
    return handleApiError('fetchQuotes', endpoint, res, args);
  }
  return res.json();
}

export function generateRenewals(policy_id, product) {
  const endpoint = `${getProductMainEndpoint(product)}/${product}_policies/${policy_id}/generate-renewals`;
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-hd-webapp-main-version': RELEASE_VERSION,
    },
  }).then(res => {
    if (!res.ok) {
      return handleApiError('generateRenewals', endpoint, res);
    }
    return res.json();
  });
}
