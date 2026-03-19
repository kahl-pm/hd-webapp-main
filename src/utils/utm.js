import jsCookie from 'js-cookie';
import { sentryWarning, sentryError } from '@policyme/global-libjs-utils';
import { postUtm, postUtmTracking, patchUtm, postConversion } from '../NewActions/fetch';
import { getPageViewName, fromStrToNull, userConsentToTracking, getCookieDomain } from './helpers';
import { updateUtm } from '../NewActions/metadata';
import { PM_ENVIRONMENT } from '../config';
import { COOKIE_EXPIRY_DAYS, PM_PRODUCT_PREFIX, USER_TYPES } from './const';
import { getMainProduct, getMainProductEventPrefix } from '../Selectors/helpers/productApp';
import { getCurrentUser, isACHCSSAffiliate, getACHCSSGroupName } from '../Selectors/userControl';
import { allCrossSellableUsers } from '../NewActions/helpers/userWrappers';

export const utmGlobalKey = 'utm_global_id';
export const utmTrackingKey = 'utm_tracking_id';

export const utmFields = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

export const utmFirstFields = [
  'utm_source_first',
  'utm_medium_first',
  'utm_campaign_first',
  'utm_term_first',
  'utm_content_first',
];

const cookieConfig = { expires: COOKIE_EXPIRY_DAYS, domain: getCookieDomain(), secure: true, sameSite: 'strict' };
const emptyUtmObject = {};
utmFields.forEach(field => {
  emptyUtmObject[field] = null;
});

export const utmExtraField = 'utm_extras';
export const utmReferringDomain = 'referring_domain';
export const utmFirstVisitedUrl = 'first_visited_url';

function areEqual(left, right) {
  let ret = true;

  if (left !== right) {
    ret = false;
    if ((left === undefined || left === null)
      && (right === undefined || right === null)) {
      return true;
    }
  }

  return ret;
}

function getCookieUtmFields(state) {
  let ret = {};
  for (let i = 0; i < utmFields.length; i++) {
    const value = jsCookie.get(utmFields[i]);
    if (value !== undefined) {
      ret[utmFields[i]] = value;
    }
  }

  // utm extra data
  let extra = jsCookie.get(utmExtraField);
  if (extra === undefined) {
    ret[utmExtraField] = null;
  } else {
    ret[utmExtraField] = JSON.parse(extra);
  }

  let referringDomainCookie = jsCookie.get(utmReferringDomain);
  ret[utmReferringDomain] = referringDomainCookie === '' ? null : referringDomainCookie;

  let firstVisitedUrlCookie = jsCookie.get(utmFirstVisitedUrl);
  ret[utmFirstVisitedUrl] = firstVisitedUrlCookie;
  if (state && (typeof ret['utm_term'] !== 'string' || ret['utm_term'] === 'null') && isACHCSSAffiliate(state)) {
    ret['utm_term'] = `ACHCCS ${getACHCSSGroupName(state)}`;
  }

  return ret;
}

export function getUtmIds(dispatch) {
  let ret = {};

  ret.utm_global_id = jsCookie.get(utmGlobalKey);
  ret.utm_tracking_id = jsCookie.get(utmTrackingKey);

  return ret;
}

// In dev env, remove .policyme.com cookies
// In prod env, remove www.policyme.com cookies
export function clearUtmCookies() {
  for (let i = 0; i < utmFields.length; i++) {
    jsCookie.remove(utmFields[i], cookieConfig);
  }
  jsCookie.remove(utmExtraField, cookieConfig);
  jsCookie.remove(utmGlobalKey, cookieConfig);
  jsCookie.remove(utmTrackingKey, cookieConfig);
  jsCookie.remove(utmReferringDomain, cookieConfig);
  jsCookie.remove(utmFirstVisitedUrl, cookieConfig);
}

export function setUtmFields(
  utmSource,
  utmMedium,
  utmCampaign,
  utmTerm,
  utmContent,
  utmExtras,
  dispatch,
  state,
) {
  const utmValues = {
    ...emptyUtmObject,
    ...getCookieUtmFields(state),
  };

  // Only overwrite existing cookie utm_source with direct if other utm_fields have changed
  let replaceSource = !(utmSource === 'direct' && utmValues.utm_source !== null);

  // check if any fields have changed, if so, remove the utmTrackingId and update cookies
  // check for equality only if there exists queryparam
  let fieldChanged = false;
  if (replaceSource && !areEqual(utmSource, utmValues.utm_source)) { fieldChanged = true; }
  if (utmMedium && !areEqual(utmMedium, utmValues.utm_medium)) { fieldChanged = true; }
  if (utmCampaign && !areEqual(utmCampaign, utmValues.utm_campaign)) { fieldChanged = true; }
  if (utmTerm && !areEqual(utmTerm, utmValues.utm_term)) { fieldChanged = true; }
  if (utmContent && !areEqual(utmContent, utmValues.utm_content)) { fieldChanged = true; }

  if (fieldChanged) {
    jsCookie.remove(utmTrackingKey, cookieConfig);

    utmFields.forEach((value, idx) => {
      /* eslint-disable prefer-rest-params */
      if (arguments[idx] !== undefined) {
        jsCookie.set(value, arguments[idx], cookieConfig);
        /* eslint-enable prefer-rest-params */
      } else {
        jsCookie.remove(value, cookieConfig);
      }
    });

    jsCookie.remove(utmExtraField, cookieConfig);
    if (utmExtras) {
      jsCookie.set(utmExtraField, JSON.stringify(utmExtras), cookieConfig);
    }
  }

  return fieldChanged;
}

export function getPatchUtmPayload(dispatch, state) {
  let { pathname } = state.router.location;
  let mainProduct = getMainProduct(state, USER_TYPES.PRIMARY);
  let extraData = jsCookie.get(utmExtraField);
  if (extraData === undefined) {
    extraData = null;
  }

  let payload = {
    current_url: `${process.env.GLOBAL_ROUTE}${pathname}`,
    email: state.primary.household.email,
    session_id: state.primary.session[`${mainProduct}_session_id`],
    app_id: state.primary.session[`${mainProduct}_application_id`],
    extra_data: JSON.parse(extraData),
  };

  return payload;
}

export function getPostConversionPayload(state, userType) {
  let mainProduct = getMainProduct(state, userType);
  let extraData = jsCookie.get(utmExtraField);
  let utm_source = jsCookie.get('utm_source');
  let utm_term = jsCookie.get('utm_term');
  if (extraData === undefined) {
    extraData = null;
  }
  let payload = {
    hh_info_id: state[userType].session.household_id,
    session_id: state[userType].session[`${mainProduct}_session_id`],
    app_id: state[userType].session[`${mainProduct}_application_id`],
    email: state[userType].household.email,
    // conversion_source is required here because it is the
    // only way to determine if a user has come to our website
    // via a shareresults link
    conversion_source: jsCookie.get('utm_source'),
    extra_data: extraData === null ? {} : JSON.parse(extraData),
    utm_source,
    utm_term,
  };
  return payload;
}

async function getNewUtmTrackingId(dispatch, utmGlobalId, payload) {
  if (!userConsentToTracking()) {
    return;
  }
  await postUtmTracking(utmGlobalId, payload)
    .then(res => {
      // save to cookies
      let utmTrackingId = res.data.utm_tracking_id;
      jsCookie.set(utmTrackingKey, utmTrackingId, cookieConfig);
      dispatch(updateUtm({
        utm_tracking_id: utmTrackingId,
      }));
      return Promise.resolve();
    })
    .catch(err => {
      sentryError(err);
      return Promise.reject(err);
    });
}

export const trackConversion = allCrossSellableUsers((userType, conversionType) => {
  return async (dispatch, getState) => {
    if (userConsentToTracking()) {
      const state = getState();
      const payload = getPostConversionPayload(state, userType);
      return postConversion(conversionType, payload)
        .catch((err) => {
          sentryWarning(err, {
            extras: {
              pathname: state.router.location.pathname,
            },
          });
        });
    }
    return Promise.resolve();
  };
});

export async function trackUtm(dispatch, state) {
  if (!userConsentToTracking()) {
    return Promise.resolve();
  }
  try {
    // check for existing utmGlobalId/utmTrackingId in cookies
    let utmGlobalId = state.metadata.utm_global_id || jsCookie.get(utmGlobalKey);
    let utmTrackingId = state.metadata.utm_tracking_id || jsCookie.get(utmTrackingKey);
    console.log(`utm tracking id in state: ${state.metadata.utm_tracking_id} in cookie: ${jsCookie.get(utmTrackingKey)}`);
    // generate new utmGlobalId or utmTrackingId on backend and save in cookies
    let ok = true;
    if (!utmGlobalId) {
      let payload = {
        ...emptyUtmObject,
        ...getCookieUtmFields(state),
      };

      await postUtm(payload)
        .then(res => {
          // save to cookies
          utmGlobalId = res.data.utm_global_id;
          utmTrackingId = res.data.utm_tracking_id;
          jsCookie.set(utmGlobalKey, utmGlobalId, cookieConfig);
          jsCookie.set(utmTrackingKey, utmTrackingId, cookieConfig);
          dispatch(updateUtm({
            utm_global_id: utmGlobalId,
            utm_tracking_id: utmTrackingId,
          }));
        })
        .catch(err => {
          ok = false;
          sentryError(err);
          // Raven.captureException(err, {});
        });
    } else if (!utmTrackingId) {
      let payload = {
        ...emptyUtmObject,
        ...getCookieUtmFields(state),
      };
      await getNewUtmTrackingId(dispatch, utmGlobalId, payload)
        .then(() => {
          utmTrackingId = jsCookie.get(utmTrackingKey);
          ok = true;
        })
        .catch(err => {
          ok = false;
          sentryError(err);
        });
    }
    if (ok) {
      // update backend with utm tracking data
      let payload = getPatchUtmPayload(dispatch, state);
      payload = fromStrToNull(payload);

      // TODO (FORM-1013): Remove temporary hack to get prefixed product events
      let productPrefix;
      let userType = getCurrentUser(state);
      const session = state[userType].session;

      if (session && (session.life_application_id
        || session.ci_application_id || session.hd_application_id)) {
        productPrefix = getMainProductEventPrefix(state, userType);
      } else {
        // TODO (FORM-1013): Remove temporary hack to get prefixed product events
        const routeRegexMatch = state.metadata.currRoute.match(/^\/(\w+\/)/);
        if (routeRegexMatch && routeRegexMatch[0] === '/ci/') {
          productPrefix = 'Critical Illness';
        } else if (routeRegexMatch && routeRegexMatch[0] === '/hd/') {
          productPrefix = 'Health and Dental';
        } else {
          productPrefix = 'Life';
        }
      }

      payload.event_name = getPageViewName(
        state.router.location.pathname,
        productPrefix,
      );

      return patchUtm(utmGlobalId, utmTrackingId, payload)
        .catch(async err => {
          // handle 404 when utm_tracking_id cannot be found,
          // instead, get a new tracking id using existing global id
          if (err.status === 404) {
            payload = {
              ...emptyUtmObject,
              ...getCookieUtmFields(state),
            };
            // delete old tracking key cookie value before creating a new one
            // jsCookie will continue reading the other cookie value if we don't delete it
            // when there's a cross-domain cookie with the same name
            const prodDomain = 'policyme.com';
            if (cookieConfig.domain !== prodDomain) {
              console.log('removing prod cookie domain');
              jsCookie.remove(utmTrackingKey,
                { expires: cookieConfig.expires, domain: prodDomain });
            }
            await getNewUtmTrackingId(dispatch, utmGlobalId, payload)
              .then(() => {
                utmTrackingId = jsCookie.get(utmTrackingKey);
                console.log('get new utm tracking id after 404 error', utmTrackingId);
                payload = getPatchUtmPayload(dispatch, state);
              })
              .catch(error => {
                sentryError(error);
              });
            patchUtm(utmGlobalId, utmTrackingId, payload)
              .catch(async error => {
                // handle error when retrying doesn't work
                sentryError(error, {
                  extras: {
                    utmGlobalId,
                    payload,
                  },
                  tags: {
                    rootcause: 'Unable to refetch new TrackingId',
                  },
                });
              });
          } else {
            sentryWarning(err, {
              extras: {
                utmGlobalId,
                utmTrackingId,
                pathname: state.router.location.pathname,
              },
            });
          }
        });
    }
  } catch (err) {
    sentryWarning(err, { tags: { rootCause: 'utm_cookies' } });
    // Raven.captureException(err, {});
  }
  return Promise.resolve();
}
