import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, connect } from 'react-redux';
import jsCookie from 'js-cookie';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Button, Link, MaxWidthContainer, Modal, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import {
  LOCALE,
  isInConsentRequiringRegion,
  getUserConsentFromDidomi,
  getTenant,
  getUrls,
  sentryError,
  hasFlag,
  TENANT_FLAGS,
} from '@policyme/global-libjs-utils';
import { TRACKING_COOKIES, TRACKING_COOKIES_STATUS } from '../../utils/const';
import { saveTrackingCookie } from '../../NewActions/cookies';
import { initAnalytics } from '../../App';
import { getCurrentUser } from '../../Selectors/userControl';
import { updateHouseholdPropAll } from '../../NewActions/household';
import { isCAAEnvironment, isPMEnvironment } from '../../tenant/helpers';
import { sendSegmentPageEvent } from '../../NewActions/analytics';

// Needed as part of PART-847
// Since we manually handle user consent, we need to manually set the default to granted
// GTM wlll not be initialized if user does not consent, so defaulting to granted is OK
// https://developers.google.com/tag-platform/security/guides/consent?consentmode=advanced#upgrade-consent-v2
const gtagConsentScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'granted',
  'analytics_storage': 'granted',
  'ad_user_data': 'granted',
  'ad_personalization': 'granted',
});`;

const CookieModal = (props: {
  isCookieOpen: boolean,
  onConfirm: () => void,
  onCancel: () => void,
  privacyPolicyLink: string,
}) => {
  const { isCookieOpen, privacyPolicyLink } = props;
  const cookieHeader = <Typography
    variant="h2"
    message={<FormattedMessage id="cookieModal.cookieSettings.JQGTcZ" />}
  />;

  const cookieBodyText =
    <Typography
      variant="body1"
      message={
        <FormattedMessage
          id="cookieModal.cookieBodyText.pFv8Ww"
          values={{
            a: (chunks) => <Link href={privacyPolicyLink} target="_blank" rel="noreferrer" label={chunks} />,
          }}
        />
    }
    />;
  const confirmText = <FormattedMessage id="cookieModal.acceptAllCookies.PqCrAH" />;
  const cancelText = <FormattedMessage id="cookieModal.dontAcceptCookies.lvZtPD" />;

  return (
    <Modal
      name="cookie-modal"
      open={isCookieOpen}
      header={cookieHeader}
      ariaDescribedBy="cookie-modal-body"
      ariaLabelledBy="cookie-modal"
      disableClose
    >
      <MaxWidthContainer width="md">
        {cookieBodyText}
        <Spacer size="spaceMedium" />
        <Button
          variant="primary"
          onClick={props.onConfirm}
          name="confirm"
        >
          {confirmText}
        </Button>
        <Spacer size="spaceSmall" />
        <Button
          variant="secondary"
          onClick={props.onCancel}
          name="cancel"
        >
          {cancelText}
        </Button>
      </MaxWidthContainer>
    </Modal>
  );
};

const CookieModalWrapper = (props) => {
  const [showCookieModal, setShowCookieModal] = useState(false);
  const [isManualAccept, setIsManualAccept] = useState(false);
  const dispatch = useDispatch();
  let resp;

  if (jsCookie.get(TRACKING_COOKIES.PM_ACCEPTED_COOKIES) === undefined) {
    dispatch(saveTrackingCookie(
      TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].UNKNOWN,
    ));
  }

  useEffect(() => {
    if (jsCookie.get('lang') !== undefined) {
      props.updateHouseholdPropAll('application_language', jsCookie.get('lang'));
    }
    // If user comes from CAAQuebec or a partner with Didomi, we can prefill the tracking cookie
    // This is a unique case - not a feature that would be repeated for other tenants/suborgs
    if (hasFlag(TENANT_FLAGS.HAS_DIDOMI_CONSENT) || (isCAAEnvironment() && getTenant().suborg?.name === 'QUE')) {
      if (jsCookie.get(TRACKING_COOKIES.PM_ACCEPTED_COOKIES)
      === TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].UNKNOWN) {
        // If user has not previously accepted/denied cookies, check for consent from caaquebec.com
        const consentCookieValue = getUserConsentFromDidomi();
        consentCookieValue === TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES]
          .ACCEPTED ? window?.OneTrust?.AllowAll() : window?.OneTrust?.RejectAll();
        dispatch(
          saveTrackingCookie(consentCookieValue),
        );
      }
    }
  }, []);

  // @ts-ignore -- Out of scope to fix for now (would require a refactor of the component)
  useEffect(async () => {
    let analyticsOptInByDefault = false;
    if (jsCookie.get(TRACKING_COOKIES.PM_ACCEPTED_COOKIES)
      === TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].UNKNOWN) {
      try {
        resp = await isInConsentRequiringRegion(props.analytics_location);
      } catch (e) {
        if (e.message === 'Your request origin is not allowed: null') {
          console.error('Ignoring null origin error:', e);
        } else {
          sentryError(`IPRegistry error: ${e.message}`);
          return;
        }
      }
      resp && setShowCookieModal(true);
      // For non quebec users, we accept the cookies by default,
      // For quebec users we prompt the modal
      if (!resp) {
        dispatch(saveTrackingCookie(
          TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].ACCEPTED,
        ));
        if (isPMEnvironment()) {
          analyticsOptInByDefault = true;
        }
      }
    }
    if (jsCookie.get(TRACKING_COOKIES.PM_ACCEPTED_COOKIES)
      === TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].ACCEPTED
      || analyticsOptInByDefault) {
      initAnalytics();
      isManualAccept && dispatch(sendSegmentPageEvent(props.current_path));
    }
  }, [showCookieModal]);

  const handleOnConfirm = () => {
    dispatch(saveTrackingCookie(
      TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].ACCEPTED,
    ));
    setIsManualAccept(true);
    setShowCookieModal(false);
  };

  const handleOnCancel = () => {
    dispatch(saveTrackingCookie(
      TRACKING_COOKIES_STATUS[TRACKING_COOKIES.PM_ACCEPTED_COOKIES].REJECTED,
    ));
    setShowCookieModal(false);
  };
  return (
    <CookieModal
      isCookieOpen={showCookieModal}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
      privacyPolicyLink={props.application_language === LOCALE.FR_CA ?
        `${getUrls().homepage}/fr/confidentialite`
        : `${getUrls().homepage}/privacy`}
    />
  );
};

const WithConsentManager = (WrappedComponent) => (props) => {
  const { application_language, analytics_location, current_path, ...passThroughProps } = props;
  /**
   * OneTrust integration is only enabled for tenants that have the ANALYTICS_REVAMP_ENABLED flag
   * This is because we are using the OneTrust script to handle the consent banner
   * and we don't want to load the script if the flag is not enabled.
   * If the flag is disabled, we will use the old consent manager script.
   */
  if (hasFlag(TENANT_FLAGS.ANALYTICS_REVAMP_ENABLED)) {
    initAnalytics();
    return (
      <WrappedComponent {...passThroughProps} />
    );
  }
  return (
    <>
      <Helmet>
        <script>
          {gtagConsentScript}
        </script>
      </Helmet>
      <CookieModalWrapper
        application_language={application_language}
        analytics_location={analytics_location}
        current_path={current_path}
        updateHouseholdPropAll={props.updateHouseholdPropAll}
      />
      <WrappedComponent {...passThroughProps} />
    </>
  );
};

const mapDispatchToProps = {
  updateHouseholdPropAll,
};

const mapStateToProps = (state, props) => {
  let { search } = state.router.location;
  const currentUser = getCurrentUser(state);
  return {
    application_language: state[currentUser].household.application_language,
    analytics_location: queryString.parse(search).analytics_location,
    current_path: state.router.location.pathname,
  };
};

export default (WrappedComponent) => connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithConsentManager(WrappedComponent));
