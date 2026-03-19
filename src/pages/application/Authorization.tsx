import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { sentryInfo } from '@policyme/global-libjs-utils';
import { Typography, MaxWidthContainer, UniformSpacingLayout, PageContainer, Spacer, Modal, Link, Button as NewButton, Progress, Form, isMobile, TextButton } from '@policyme/global-libjs-designsystem';
import { updateMetadata } from '../../NewActions/metadata';
import { handleSubmitAuthorization, handleConsentNextSteps,
  handleHDConfirmationDocDownload, handleQADocumentDownload } from '../../NewActions/handle';
import { onComponentLoad } from '../../NewActions/session';
import { PM_PRODUCT_PREFIX, UNDERWRITING_METHODS, AURA_DECISION_TYPES, AUTHORIZATION_TYPE, ProductType, USER_TYPES, PRIVACY_POLICY_URL } from '../../utils/const';
import WithWindowSize from '../../components/HOC/WithWindowSize';
import { getAppUnderwritingMethod, getMainProduct } from '../../Selectors/helpers/productApp';
import { getCurrentUser } from '../../Selectors/userControl';
import { getTenantBasedFormattedText, getTenantCode, isBCLEnvironment, isCAAEnvironment } from '../../tenant/helpers';
import { addPossessiveApostrophe, getCoverageTermsAndConditionsPageUrl, getPrivacyPolicyPageUrl } from '../../utils/helpers';
import { canSkipDecisionPage } from '../../Selectors/session';
import Confetti from '../../components/Confetti';
import { DEFAULT_CONSENT_VERSIONS } from '../../utils/consentVersion';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';
import { State } from '../../store/types/State';

import NoObligationCard from '../../components/NoObligationCard';
import BottomNavigation from '../../components/BottomNavigation';

const STATUS_HD = [
  {
    time: 2000,
    text: <FormattedMessage
      id="authorization.statusGatheringDetails.rulm9S"
    />,
  },
  {
    time: 4000,
    text: <FormattedMessage
      id="authorization.statusSubmittingInfo.Dd2nQg"
    />,
  },
  {
    time: 15000,
    text: <FormattedMessage
      id="authorization.statusPackingUpPolicy.1vhAos"
    />,
  },
  {
    time: 0,
    text: <FormattedMessage
      id="authorization.statusPreparingNextStep.hxcarK"
    />,
  },
];

const STEPS = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUBMITTED: 'SUBMITTED',
};

// HD consent header and CTA versions are handled inline below

export const CONSENT_BODY = {
  [PM_PRODUCT_PREFIX.HD]: {
    [UNDERWRITING_METHODS.FULLY_UNDERWRITTEN]:
      defineMessages({
        '2.0.1': {
          id: 'authorization.authorizeMIB.hd.ao16UD.fuw.v2.0.1',
        },
        '2.0.2': {
          id: 'authorization.authorizeMIB.hd.ao16UD.fuw.v2.0.2',
        },
      }),
    [UNDERWRITING_METHODS.GUARANTEED_ISSUE]:
      defineMessages({
        '2.0.1': {
          id: 'authorization.authorizeMIB.hd.ao16UD.gi.v2.0.1',
        },
        '2.0.2': {
          id: 'authorization.authorizeMIB.hd.ao16UD.gi.v2.0.2',
        },
      }),
  },
};

type ConsentBodyValuesProps = {
  ul: (chunks: React.ReactNode) => React.ReactNode;
  li: (chunks: React.ReactNode) => React.ReactNode;
  span1: (msg: React.ReactNode) => React.ReactNode;
  span3: (msg: React.ReactNode) => React.ReactNode;
  spanPrivacyPolicyLink: (msg: React.ReactNode) => React.ReactNode;
  spanQnA: (msg: React.ReactNode) => React.ReactNode;
  spanQnASecondary: (msg: React.ReactNode) => React.ReactNode;
  link: (msg: React.ReactNode) => React.ReactNode;
  underWrittenModal: (msg: React.ReactNode) => React.ReactNode;
  hasPartner: boolean;
  primaryFirstName: string;
  secondaryFirstName: string;
}
// Ignoring props because they are used in the override components
// But we did not use them here since there's no default component
export type ConsentBodyProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  mainProduct: ProductType;
  // eslint-disable-next-line react/no-unused-prop-types
  consentVersion: string;
  // eslint-disable-next-line react/no-unused-prop-types
  values: ConsentBodyValuesProps;
}

export const ConsentBody = (props: ConsentBodyProps): React.JSX.Element => (
  // No defaults allowed for consent text
  // Fill in the consent keys to use in
  // src/tenant/TenantCustomOverrides/<tenant_code>/auraConsentBody.tsx
  null
);

const AuthorizationPage = () => {
  const intl = useIntl();
  const [isMibModalOpen, setIsMibModalOpen] = useState(false);
  const [securianModalOpen, setSecurianModalOpen] = useState(false);
  const [policyMeModalOpen, setPolicyMeModalOpen] = useState(false);
  const [isCPLModalOpen, setIsCPLModalOpen] = useState(false);
  const [statementsModalOpen, setStatementsModalOpen] = useState(false);
  const [currStep, setCurrStep] = useState(STEPS.INITIAL);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [time, setTime] = useState(0);
  const [showUnderwrittenModal, setShowUnderwrittenModal] = useState(false);
  const mainProduct = useSelector(
    (state: State) => getMainProduct(state, state.userControl.currentUser),
  );
  const status = STATUS_HD;
  const dispatch = useDispatch();
  const consentVersions = DEFAULT_CONSENT_VERSIONS[getTenantCode()][mainProduct];

  const {
    isAppSubmitComplete,
    decisionLoadingStep,
    isMakingDecisionRequests,
    decisionHasBeenMade,
    isBackPressed,
    hasPartnerApplication,
    firstName,
    partnerFirstName,
    underwriting_method,
    lang,
    activeDecision,
    shouldSkipDecisionPage,
    application_language,
    main_app_id,
  } = useSelector((state: State) => ({
    isAppSubmitComplete: state.metadata.isAppSubmitComplete,
    decisionLoadingStep: state.metadata.decisionLoadingStep,
    isMakingDecisionRequests: state.metadata.isMakingDecisionRequests,
    decisionHasBeenMade: state.metadata.decisionHasBeenMade,
    isBackPressed: state.metadata.backPressed,
    hasPartnerApplication: state.userControl.hasPartnerApplication &&
      !(getMainProduct(state, getCurrentUser(state)) === PM_PRODUCT_PREFIX.HD),
    firstName: state.primary.household.firstName,
    partnerFirstName: state.secondary.household.firstName,
    underwriting_method: getAppUnderwritingMethod(
      state, getCurrentUser(state), PM_PRODUCT_PREFIX.HD,
    ),
    lang: state.primary.household.application_language,
    activeDecision: state.primary[`${mainProduct}Decision`] ?
      state.primary[`${mainProduct}Decision`].active_decision :
      '',
    shouldSkipDecisionPage: canSkipDecisionPage(state),
    application_language: state.primary.household.application_language,
    main_app_id: state.primary.session[`${mainProduct}_application_id`],
  }));

  const isHD = true; // This is an HD-only webapp
  const fuwConsentVersion = consentVersions[AUTHORIZATION_TYPE.FUW_HD];
  const giConsentVersion = consentVersions[AUTHORIZATION_TYPE.GI];

  useEffect(() => {
    // only execute componentLoad for consent page
    // not when redirecting to decision page
    if (!isAppSubmitComplete && decisionLoadingStep < status.length) {
      dispatch(onComponentLoad(() => {
        if (isMakingDecisionRequests) {
          // if user click submit but went back & forward, we want to show loading screen instead
          setCurrStep(STEPS.LOADING);
        }
      }));
    }
  }, []);

  useEffect(() => {
    // This triggers an alert dialog if the user tries to close the browser
    // while the decision is still processing
    // this could cause the app to go into a bad state so we want to be alerted in sentry
    const handleBeforeUnload = (event) => {
      if (isMakingDecisionRequests && !isBackPressed) {
        // Add an info log to sentry that the alert dialog was triggered
        // However we cannot determine if the user accepted or declined the dialog
        // so we cannot determine if the user actually left the page.
        // This would just help us to have logs in sentry to trace a user's journey.
        sentryInfo('User attempted to leave while decision is processing', { extras: { main_app_id } });

        // Trigger the browser's confirmation dialog
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // The return block of useEffect is executed when the component is unmounted
      // We need to remove the event listener to prevent memory leaks
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMakingDecisionRequests, isBackPressed]);

  useEffect(() => {
    let counter;
    // this checks to see if the decsion has compleated and closes the counter
    if (isAppSubmitComplete) {
      setTime(100);
    } else {
      counter = time < 95 && setTimeout(() => {
        // blocks the counter from starting in the background until a user clicks
        // the get my decision button on the first half of this page
        if (currStep === STEPS.LOADING) {
          setTime(time + 1);
        }
      }, 333);
    }

    return () => {
      clearTimeout(counter);
    };
  }, [time, currStep, isAppSubmitComplete]);

  useEffect(() => {
    let timeout;
    if (isAppSubmitComplete) {
      setCurrStep(STEPS.SUBMITTED);
    } else if (currStep === STEPS.LOADING && decisionLoadingStep < status.length) {
      timeout = setTimeout(() => {
        if (decisionLoadingStep < status.length - 1) {
          dispatch(updateMetadata('decisionLoadingStep', decisionLoadingStep + 1));
        }
      }, status[decisionLoadingStep].time);
    }

    // componentWillUnmount
    return () => {
      clearInterval(timeout);
    };
  }, [currStep, decisionLoadingStep, isAppSubmitComplete]);

  useEffect(() => {
    // HD: decision navigation is handled through handleConsentNextSteps
  }, [
    decisionHasBeenMade,
    shouldSkipDecisionPage,
    hasPartnerApplication,
  ]);

  const onSubmit = () => {
    dispatch(handleSubmitAuthorization());
    setCurrStep(STEPS.LOADING);
    if (process.env.BROWSER) {
      document.getElementById('main').scrollTop = 0;
    }
  };

  const getProgressHeader = () => {
    if (time === 100) {
      return <FormattedMessage
        id="authorization.progressHeaderAllSet.KPFBHY"
      />;
    } else if (time > 80) {
      return <FormattedMessage
        id="authorization.progressHeaderGettingYourDecisions.xZ63rc"
      />;
    } else if (time >= 40) {
      return <FormattedMessage
        id="authorization.progressHeaderCrunchingTheNumbers.REdY8U"
      />;
    } else if (time >= 20) {
      return <FormattedMessage
        id="authorization.progressHeaderCheckingTheMIB.VeWOuO"
      />;
    }
    return <FormattedMessage
      id="authorization.progressHeaderSubmittingYourApplications.zZv1xC"
    />;
  };

  const consentBodyValues:ConsentBodyValuesProps = {
    ul: chunks => <ul>{chunks}</ul>,
    li: chunks => <Typography variant="body1" message={chunks} component="li" pb="1rem" />,
    span1: msg => (
      <TextButton
        name="open-mib-modal"
        variant="inline"
        ariaLabel="Open MIB modal"
        label={msg}
        onClick={(e) => {
          e.preventDefault();
          setIsMibModalOpen(true);
          setScrollOffset(window.scrollY);
        }}
        dataCy="mib-modal"
      />
    ),
    span3: msg => (
      <TextButton
        name="open-privacy-modal"
        variant="inline"
        ariaLabel="Open privacy modal"
        label={msg}
        onClick={(e) => {
          e.preventDefault();
          window.open(PRIVACY_POLICY_URL(lang), '_blank');
          setScrollOffset(window.scrollY);
        }}
        dataCy="privacy-modal"
      />
    ),
    spanPrivacyPolicyLink: msg => (
      <Link
        ariaLabel="Open privary policy page"
        label={msg}
        href={getPrivacyPolicyPageUrl(lang)}
        dataCy="privacy-url"
      />
    ),
    primaryFirstName: addPossessiveApostrophe(firstName, application_language),
    secondaryFirstName: addPossessiveApostrophe(partnerFirstName, application_language),
    spanQnA: msg => (
      <TextButton
        variant="inline"
        name="open-primary-questions-and-answers-document"
        ariaLabel="Open primary questions and answers document"
        label={msg}
        dataCy="download-qa-document-authorization"
        onClick={(e) => {
          e.preventDefault();
          dispatch(handleQADocumentDownload(mainProduct, USER_TYPES.PRIMARY));
          setScrollOffset(window.scrollY);
        }}
      />
    ),
    spanQnASecondary: msg => (
      <TextButton
        variant="inline"
        name="open-secondary-questions-and-answers-document"
        ariaLabel="Open secondary questions and answers document"
        label={msg}
        dataCy="download-qa-document-authorization"
        onClick={(e) => {
          e.preventDefault();
          dispatch(handleQADocumentDownload(mainProduct, USER_TYPES.SECONDARY));
          setScrollOffset(window.scrollY);
        }}
      />
    ),
    link: msg => (
      <TextButton
        variant="inline"
        name="open-canadian-premier-life-modal"
        ariaLabel="Open canadian premier life modal"
        label={msg}
        onClick={(e) => {
          e.preventDefault();
          setIsCPLModalOpen(true);
          setScrollOffset(window.scrollY);
        }}
        dataCy="cpl-modal"
      />
    ),
    underWrittenModal: msg => (
      <TextButton
        name="open-underwritting-modal"
        ariaLabel="Open underwritting modal"
        label={msg}
        variant="inline"
        onClick={(e) => {
          e.preventDefault();
          setShowUnderwrittenModal(true);
          setScrollOffset(window.scrollY);
        }}
        dataCy="underwritting-modal"
      />
    ),
    hasPartner: hasPartnerApplication,
  };

  const supportEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const phone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return <>
    {currStep !== STEPS.INITIAL && (
      <>
        <PageContainer textAlign="left" hasFixedBanner fullHeight>
          {activeDecision === AURA_DECISION_TYPES.APPROVED ? (<>
            <MaxWidthContainer width="xl">
              <Typography
                variant="h1"
                align="center"
                message={<FormattedMessage
                  id="authorization.CongratsApproved.ZSYxj4"
                />}
              />
            </MaxWidthContainer>
            <Spacer size="spaceMedium" />
            <MaxWidthContainer width="md">
              <Typography
                variant="body1"
                align="center"
                message={<FormattedMessage
                  id="authorization.youllReview.VdPact"
                />}
              />
            </MaxWidthContainer>
          </>) : (
          // Finished but not approved
            currStep === STEPS.SUBMITTED ? (<>
              <MaxWidthContainer width="xl">
                <Typography
                  variant="h1"
                  align="center"
                  message={<FormattedMessage
                    id="authorization.pageTitleComplete.0Sk4c3"
                  />}
                />
              </MaxWidthContainer>
              <Spacer size="spaceMedium" />
              <MaxWidthContainer width="md">
                <Typography
                  variant="body1"
                  align="center"
                  message={
                    <FormattedMessage
                      id="authorization.workingHardDontReloadShort.rd5Pe4"
                    />
                }
                />
              </MaxWidthContainer>
            </>) : (
            // Still processing HD and non-HD
              <>
                <MaxWidthContainer width="xl">
                  <Typography
                    variant="h1"
                    align="center"
                    message={<FormattedMessage
                      id="authorization.thanksForYourPatience.CKu7XL"
                      values={{
                        isHD,
                      }}
                    />}
                  />
                </MaxWidthContainer>
                <Spacer size="spaceMedium" />
                <MaxWidthContainer width="md">
                  <Typography
                    variant="body1"
                    align="center"
                    message={<FormattedMessage
                      id="authorization.workingHardDontReload.HfXFg8"
                      values={{
                        br: <br />,
                      }}
                    />}
                  />
                </MaxWidthContainer>
              </>
            ))}
          <MaxWidthContainer width="md">
            <Spacer size="spaceMedium" />
            <Progress
              value={time}
              section={intl.formatMessage(getProgressHeader().props)}
              variant="determinate"
              name="application-progress"
            />
            <Spacer size="spaceMedium" />
            <UniformSpacingLayout flexDirection="column" gap="1.5rem">
              <NewButton
                name="see-my-decision"
                dataCy="see-my-decision"
                loading={!isAppSubmitComplete}
                id={`${mainProduct}-see-my-decision`}
                type="submit"
                variant="primary"
                onClick={() => dispatch(handleConsentNextSteps())}
                ref={buttonRef}
                hidden={isMobile()}
              >
                <Typography
                  variant="CTALargePrimary"
                  message={
                    <FormattedMessage id="authorization.ContinueToCheckout.Ad47v9" />
                }
                />
              </NewButton>
            </UniformSpacingLayout>
          </MaxWidthContainer>
        </PageContainer>
        <BottomNavigation
          buttonRef={buttonRef}
          position="sticky"
          isLoading={!isAppSubmitComplete}
        />
      </>
    )}
    {currStep === STEPS.INITIAL && (
      <>
        <PageContainer textAlign="left" hasFixedBanner fullHeight>
          <MaxWidthContainer width="xl">
            {underwriting_method === UNDERWRITING_METHODS.GUARANTEED_ISSUE ?
              <Typography
                variant="h1"
                align="center"
                message={<FormattedMessage
                  id="healthAndDentalConsent.headerGI.A1kj8A"
                />}
                mb="2.5rem"
              /> :
              <Typography
                variant="h1"
                align="center"
                message={<FormattedMessage
                  id="authorization.thanksOneLastThing.QHBiZc"
                  values={{
                    hasPartnerApplication,
                  }}
                />}
                mb="2.5rem"
              />}
            {
              <Typography
                  variant="h2"
                  align="center"
                  message={<FormattedMessage
                    id="authorization.clickAcceptAndContinueShort.39E7gG"
                  />}
                />
            }
          </MaxWidthContainer>
          <MaxWidthContainer width="md">
            <Modal
              name="information-about-mib"
              ariaLabelledBy="mib-modal"
              ariaDescribedBy="information-about-mib"
              header={<FormattedMessage
                id="authorization.whatYouNeedToKnowAboutMIB.mKXXAO."
              />}
              open={isMibModalOpen && currStep === STEPS.INITIAL}
              handleClose={() => {
                setIsMibModalOpen(false);
                window.scrollTo(0, scrollOffset);
              }}
            >
              <Typography
                variant="body1"
                component="div"
                message={
                  /* Important: Let's use Customization Slot instead of isBCLEnvironment */
                  isBCLEnvironment() ?
                    <FormattedMessage
                      id="authorization.mibModalText.BCL.pqNWvp"
                      values={{
                        br: <br />,
                        productIsLife: false,
                        div: msg => <Typography variant="h3" align="center" message={msg} />,
                        a: chunks => <Link label={chunks} href="https://www.mib.com/" />,
                      }}
                    /> :
                    <FormattedMessage
                      id="authorization.mibModalText.uarsIb"
                      values={{
                        br: <br />,
                        productIsLife: false,
                        div: msg => <Typography variant="h3" align="center" message={msg} />,
                        a: chunks => <Link label={chunks} href="https://www.mib.com/" />,
                      }}
                    />
                }
              />
            </Modal>
            <Modal
              name="information-about-policyme"
              ariaLabelledBy="policyme-modal"
              ariaDescribedBy="information-about-who-is-policyme"
              header={<FormattedMessage
                id="authorization.whoIsPolicyMe.OTictB"
              />}
              open={policyMeModalOpen && currStep === STEPS.INITIAL}
              handleClose={() => {
                setPolicyMeModalOpen(false);
                window.scrollTo(0, scrollOffset);
              }}
            >
              <Typography
                variant="body1"
                message={
                  <FormattedMessage
                    id="authorization.policyMeModal.9pYAlh"
                    values={{
                      br: <br />,
                    }}
                  />
                }
              />
            </Modal>
            <Modal
              name="information-about-securian"
              ariaLabelledBy="securian-modal"
              ariaDescribedBy="information-about-who-is-securian"
              header={<FormattedMessage
                id="authorization.whoIsSecurian.I4G4Jn"
              />}
              open={securianModalOpen && currStep === STEPS.INITIAL}
              handleClose={() => {
                setSecurianModalOpen(false);
                window.scrollTo(0, scrollOffset);
              }}
            >
              <Typography
                variant="body1"
                message={
                  <FormattedMessage
                    id="authorization.whoIsSecurianModal.36XMZ6"
                    values={{
                      br: <br />,
                    }}
                  />
                }
              />
            </Modal>
            <Modal
              name="information-about-cpl"
              ariaLabelledBy="cpl-modal"
              ariaDescribedBy="information-about-who-is-cpl"
              header={<FormattedMessage
                id="authorization.canadianPremierModalHeader.q156mM"
              />}
              open={isCPLModalOpen && currStep === STEPS.INITIAL}
              handleClose={() => {
                setIsCPLModalOpen(false);
                window.scrollTo(0, scrollOffset);
              }}
            >
              <Typography
                variant="body1"
                message={
                  <FormattedMessage
                    id="authorization.canadianPremierModalBody.BQ3qi0"
                  />
                }
              />
            </Modal>
            <Form
                onSubmit={onSubmit}
                name="authorize premissions"
                segmentPayload={{
                  name: 'authorize premissions',
                  product_type: mainProduct,
                }}
              >
                <div>
                  {underwriting_method === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ?
                    intl.formatMessage(
                      CONSENT_BODY.hd[UNDERWRITING_METHODS.FULLY_UNDERWRITTEN][fuwConsentVersion],
                      {
                        ul: chunks => <ul>{chunks}</ul>,
                        li: chunks => <Typography variant="body1" message={chunks} component="li" pb="1rem" />,
                        span1: msg => (
                          <TextButton
                            variant="inline"
                            name="open-questions-and-answers-document"
                            ariaLabel="Open questions and answers document"
                            label={msg}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(handleQADocumentDownload(
                                mainProduct,
                                USER_TYPES.PRIMARY,
                              ));
                            }}
                            dataCy="download-qa-document"
                          />
                        ),
                        span3: msg => (
                          <Link
                            label={msg}
                            ariaLabel="French version of the coverage terms and conditions"
                            href={getCoverageTermsAndConditionsPageUrl()}
                            dataCy="french-version-of-the-coverage-terms-and-conditions"
                          />
                        ),
                        securianLink: <TextButton
                          variant="inline"
                          name="open-securian-modal"
                          ariaLabel="Open securian modal"
                          label="Securian Canada"
                          onClick={(e) => {
                            e.preventDefault();
                            setSecurianModalOpen(true);
                            setScrollOffset(window.scrollY);
                          }}
                          dataCy="securian-modal"
                        />,
                        policyMeLink: <TextButton
                          name="open-policy-me-modal"
                          variant="inline"
                          ariaLabel="Open policy me modal"
                          label={<FormattedMessage id="tenant.PM.shortFormName" />}
                          dataCy="policyme-modal"
                          onClick={(e) => {
                            e.preventDefault();
                            setPolicyMeModalOpen(true);
                            setScrollOffset(window.scrollY);
                          }}

                        />,
                        span2: msg => (
                          <Link
                            label={msg}
                            ariaLabel="Open privacy policy page"
                            href={getPrivacyPolicyPageUrl(lang)}
                            dataCy="privacy-policy-page"
                          />
                        ),
                      },
                    )
                    :
                    intl.formatMessage(
                      CONSENT_BODY.hd[UNDERWRITING_METHODS.GUARANTEED_ISSUE][giConsentVersion],
                      {
                        span1: msg => (
                          <TextButton
                            name="download-hd-confirmation-document"
                            variant="inline"
                            ariaLabel="download hd confirmation document"
                            label={msg}
                            onClick={(e) => {
                              e.preventDefault();
                              dispatch(handleHDConfirmationDocDownload());
                            }}
                            dataCy="download-hd-confirmation-document"
                          />
                        ),
                        ul: chunks => <ul>{chunks}</ul>,
                        li: chunks => <Typography variant="body1" message={chunks} component="li" pb="1rem" />,
                        span3: msg => (
                          <Link
                            label={msg}
                            ariaLabel="French version of the coverage terms and conditions"
                            href={getCoverageTermsAndConditionsPageUrl()}
                            dataCy="french-version-of-the-coverage-terms-and-conditions"
                          />
                        ),
                      },
                    )}
                </div>
                <NoObligationCard />
                <Spacer size="spaceMedium" />
                <NewButton
                  name="submit-decision"
                  dataCy="submit-decision"
                  id={`${mainProduct}-submit-decision-btn`}
                  type="submit"
                  variant="primary"
                  ref={buttonRef}
                  hidden={isMobile()}
                >
                  <FormattedMessage
                    id="authorization.acceptAndContinue.V57Egm"
                  />
                </NewButton>
              </Form>
            <Modal
              name="bcl-underwritten-modal"
              ariaLabelledBy="bcl-underwritten-modal"
              ariaDescribedBy="information-about-bcl"
              header={<FormattedMessage
                id="secureFooter.underWrittenHeader.sCWc26"
                values={{
                  sup: (chunks) => <sup>{chunks}</sup>,
                }}
              />}
              open={showUnderwrittenModal}
              handleClose={() => setShowUnderwrittenModal(false)}
            >
              <Typography
                variant="body1"
                component="div"
                message={
                  <FormattedMessage
                    id="secureFooter.underwrittenContent.3Z8g4u"
                    values={{
                      b: (chunks) => <strong>{chunks}</strong>,
                      ul: (chunks) => <>
                        <Spacer size="spaceSmall" />
                        <UniformSpacingLayout flexDirection="column">{chunks}</UniformSpacingLayout>
                        <Spacer size="spaceSmall" />
                      </>,
                      li: (chunks) => <Typography variant="body1" message={chunks} component="li" />,
                      br: <br />,
                      supportEmail,
                      phone,
                      a: (chunks) => <Link label={chunks} href={`mailto:${supportEmail}`} />,
                      sup: (chunks) => <sup>{chunks}</sup>,
                    }}
                  />
                }
              />
            </Modal>
          </MaxWidthContainer>
        </PageContainer>

        <Spacer size="spaceMedium" />
        <Confetti show={activeDecision === AURA_DECISION_TYPES.APPROVED} />
        <BottomNavigation
          buttonRef={buttonRef}
          isLoading={currStep === STEPS.SUBMITTED && !isAppSubmitComplete}
          position="sticky"
        />
      </>
    )}
  </>;
};

export default WithWindowSize(AuthorizationPage);
