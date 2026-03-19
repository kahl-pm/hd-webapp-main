import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { goBack } from 'connected-react-router';
import {
  Card, isMobile, LeftArrowIcon, Link, Modal, Navigation, PhoneIcon, Spacer, TenantLogoContainer,
  TextButton, Typography, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { getTenant, getUrls, hasFlag, LOCALE, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { useTheme } from '@mui/material';
import { getLocaleText } from '../../Selectors/household';
import { toggleLanguage } from '../../NewActions/household';
import {
  allowLanguageToggle, checkForBackToDashButton, checkForShowBackButton,
} from '../../Selectors/router';
import { getUserFromURL, getPrivacyPolicyPageUrl } from '../../utils/helpers';
import { getTenantBasedFormattedText, isBCLEnvironment } from '../../tenant/helpers';
import { TENANT_SUBORGANIZATION_CODES, TENANT_TEXT_KEYS } from '../../tenant/consts';
import AmfDetailsModal from '../AmfDetailsModal';
import { State } from '../../store/types/State';
import LoggedStatusComponent from '../LoggedStatusComponent';
import ProgressCard from './ProgressCard';
import { journeyIngress } from '../../NewActions/session';
import { JOURNEY_INGRESS_POINTS, LEGAL_AND_COMPLIANCE_URL } from '../../utils/const';
import { getRoutePageOptions } from '../../config/pageOptionsConfig';
import AffiliateLogoRow, { affiliateLogo } from '../AffiliateLogoRow';
import { getABTestBand } from '../../Selectors/metadata';
import { getAffiliateName } from '../../Selectors/userControl';
import { LocaleType } from '../../utils/types';

const ControlCenter = () => {
  const dispatch = useDispatch();
  const currentLangText = useSelector<State, string>((state) => getLocaleText(state.primary));
  const currPath = useSelector<State, string>((state) => state.router.location.pathname);
  const userType =
    useSelector<State, string>((state) => getUserFromURL(currPath) ??
      state.userControl.currentUser);
  // Do not show back button on mobile since its in the bottom nav
  const showBackToDash =
    useSelector<State, boolean>((state) => !isMobile() && checkForBackToDashButton(
      userType, currPath, state,
    ));

  // Do not show back button on mobile since its in the bottom nav
  const showBack = useSelector<State, boolean>((state) => !isMobile() && checkForShowBackButton(
    userType, currPath, state, showBackToDash,
  ));
  const showLanguageToggle = useSelector<State, boolean>((state) => allowLanguageToggle(state));
  return (
    <UniformSpacingLayout
      flexDirection="row"
      justifyContent={showBack || showBackToDash ? 'space-between' : 'flex-end'}
      sx={{
        marginLeft: '0.5rem',
      }}
    >
      {(showBack || showBackToDash) && (
        <TextButton
          label={<Typography
            variant="CTALargePrimary"
            message={<FormattedMessage id="global.back.Est6xJ" />}
          />}
          name="back"
          aria-label="back"
          startIcon={<LeftArrowIcon variant="transparent" interactive size="accordionSmall" />}
          onClick={() => dispatch(showBackToDash ?
            journeyIngress(JOURNEY_INGRESS_POINTS.DECISION)
            : goBack())}
        />
      )}
      <UniformSpacingLayout
        flexDirection="row"
        justifyContent="flex-end"
        gap="1rem"
      >
        <LoggedStatusComponent />
        {showLanguageToggle && (
          <TextButton
            label={<Typography variant="CTALargePrimary" message={currentLangText} />}
            aria-label={`Language Toggle - ${currentLangText}`}
            name="Language Toggle"
            onClick={() => dispatch(toggleLanguage())}
            dataCy="language-toggle"
          />
        )}
      </UniformSpacingLayout>
    </UniformSpacingLayout>
  );
};

const ContactCenter = () => {
  const intl = useIntl();
  const advisorPhone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER);
  const advisorPhoneFormatted =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);

  const ContactCardContent = (
    <>
      <Typography
        variant="body3"
        message={<FormattedMessage id="contactCenter.questions.WwV7j2" />}
        secondaryText
      />
      <Spacer size="space3XS" />
      {!isMobile() ? <Typography variant="body3" message={advisorPhoneFormatted} /> : <Link
        label={<Typography variant="CTASmallPrimary" message={advisorPhoneFormatted} />}
        href={`tel:${advisorPhone}`}
        aria-label="call our support team"
        inlineBlock
      />}
    </>
  );
  return (
    <UniformSpacingLayout>
      <Card
        cardVariant="empty"
        body={ContactCardContent}
        noShadow
      />
    </UniformSpacingLayout>
  );
};

const FooterSection = () => {
  const theme = useTheme();
  const intl = useIntl();

  const isCAAQuebec = getTenant().suborg?.name === TENANT_SUBORGANIZATION_CODES.QUE;
  const [showAmfDetailsModal, setShowAmfDetailsModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showUnderwrittenModal, setShowUnderwrittenModal] = useState(false);
  const showAmfTooltip = hasFlag(TENANT_FLAGS.SHOW_AMF_TOOLTIP) || isCAAQuebec;
  const supportEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const phone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);
  const application_language =
    useSelector<State, LocaleType>((state) => state.primary.household.application_language);
  const isBCLEnv = isBCLEnvironment();
  const secureFooterItems = [
    {
      /**
       * This is a temporary hack, we should not be referring to a specific tenant
       * TODO: https://policyme.atlassian.net/browse/PART-802
       */
      condition: isBCLEnv,
      content: (
        <>
          <Link
            label={
              <Typography
                variant="CTASmallPrimary"
                message={
                  <FormattedMessage id="secureFooter.privacyPolicy.3Z8g4u" />
                }
              />
            }
            href={getPrivacyPolicyPageUrl(application_language)}
            inlineBlock
            ariaLabel={'Privacy Policy'}
          />
          <TextButton
            label={
              <Typography
                variant="CTASmallPrimary"
                message={<FormattedMessage id="secureFooter.underWrittenBy.3Z8g4u" />}
                icon={<FormattedMessage
                  id="global.registeredTradeMark.rM5zx2"
                  values={{ sup: (chunks) => <sup>{chunks}</sup> }}
                />}
              />
            }
            onClick={() => setShowUnderwrittenModal(true)}
            name="Underwritten-By"
          />
          <Modal
            name="Underwritten-modal"
            header={<FormattedMessage
              id="secureFooter.underWrittenHeader.sCWc26"
              values={{
                sup: (chunks) => <sup>{chunks}</sup>,
              }}
            />}
            open={showUnderwrittenModal}
            handleClose={() => setShowUnderwrittenModal(false)}
            ariaDescribedBy="Underwritten-modal-body"
            ariaLabelledBy="Underwritten-modal"
          >
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="secureFooter.underwrittenContent.3Z8g4u"
                  values={{
                    b: (chunks) => <strong>{chunks}</strong>,
                    ul: (chunks) => <ul css={{ paddingInlineStart: '1.5rem' }}>{chunks}</ul>,
                    li: (chunks) => <li>{chunks}</li>,
                    br: <br />,
                    phone,
                    supportEmail,
                    a: (chunks) => <Link label={chunks} href={`mailto:${supportEmail}`} />,
                    sup: (chunks) => <sup>{chunks}</sup>,
                  }}
                />
              }
            />
          </Modal>
        </>
      ),
    },
    {
      condition: !isBCLEnv,
      content: (
        <Link
          label={
            <Typography
              variant="CTASmallPrimary"
              message={
                <FormattedMessage id="secureFooter.legalCompliance.NrJKho" />
              }
            />
          }
          href={LEGAL_AND_COMPLIANCE_URL(application_language)}
          inlineBlock
          ariaLabel={'Legal and Compliance'}
        />
      ),
    },
    {
      condition: !isBCLEnv,
      content: (
        <>
          <TextButton
            onClick={() => setShowDisclaimerModal(true)}
            label={<Typography variant="CTASmallPrimary" message={<FormattedMessage id="secureFooter.disclaimer.GVFW9l" />} />}
            name="Disclaimer"
          />
          <Modal
            name="Disclaimer-modal"
            open={showDisclaimerModal}
            handleClose={() => setShowDisclaimerModal(false)}
            ariaLabelledBy="Disclaimer-modal"
            ariaDescribedBy="Disclaimer-modal-body"
            header={<FormattedMessage id="secureFooter.disclaimerModal.xo48is" />}
          >
            <Typography
              variant="body2"
              message={<FormattedMessage id="secureFooter.disclaimerContent.JU4a5k" />}
            />
          </Modal>
        </>
      ),
    },
    {
      condition: showAmfTooltip,
      content: (
        <>
          <TextButton
            onClick={() => setShowAmfDetailsModal(true)}
            label={<Typography variant="CTASmallPrimary" message={<FormattedMessage id="secureFooter.distributedByPM.jXaoHM" />} />}
            name="Distributed-by-PolicyMe"
          />
          <AmfDetailsModal
            open={showAmfDetailsModal}
            handleClose={() => setShowAmfDetailsModal(false)}
          />
        </>
      ),
    },
  ];

  return (
    <UniformSpacingLayout
      flexDirection="column"
      justifyContent="flex-start"
      gap={theme.spacer.spaceSmall}
      sx={{
        marginTop: 'auto',
      }}
    >
      {secureFooterItems.map((item) => item.condition && item.content)}
    </UniformSpacingLayout>
  );
};

const AffiliateLogo = () => {
  const abTestBand = useSelector(getABTestBand);
  const currentRoute = useSelector((state: State) => state.router.location.pathname);

  const pageOption = getRoutePageOptions(abTestBand, currentRoute);
  return !pageOption.hideAffiliateLogo && (
    <AffiliateLogoRow />
  );
};

const RebrandNav = () => {
  const theme = useTheme();
  const intl = useIntl();
  const TenantLogo = theme.logo[intl.locale];
  const affiliateName = useSelector((state: State) => getAffiliateName(state));
  const abTestBand = useSelector(getABTestBand);
  const currentRoute = useSelector((state: State) => state.router.location.pathname);
  const pageOption = getRoutePageOptions(abTestBand, currentRoute);

  const advisorPhone = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER);

  const showAffiliate = !!affiliateLogo[affiliateName];

  const isMobileView = isMobile();

  const Content = (
    <UniformSpacingLayout
      flexDirection="column"
      justifyContent="flex-start"
      sx={{
        padding: isMobileView ? '1rem' : '2rem',
        height: '100%',
        ...(pageOption.useAlternateNavBackground && {
          backgroundColor: theme._figmaPaletteVariables.cardBg2,
          borderRight: `1px solid ${theme.card.divider}`,
        }),
      }}
    >
      {/* No tenant logo on mobile due to space constraints,
        it is in the top nav on mobile */}
      {!isMobileView ?
        showAffiliate ? <AffiliateLogo /> :
        <TenantLogoContainer
          justifyContent="flex-start"
        >
          <TenantLogo />
        </TenantLogoContainer> : null}

      <Spacer size="spaceMedium" />
      <ControlCenter />
      <Spacer size="spaceMedium" />
      <ProgressCard />
      <Spacer size="spaceSmall" />
      <ContactCenter />
      <FooterSection />
    </UniformSpacingLayout>
  );
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Navigation
        open={open}
        onClose={() => setOpen(!open)}
        content={Content}
        mobileNavContent={<>
          {/* Displaying tenant logo or affiliate logo in top nav */}
          {showAffiliate ? <AffiliateLogo /> :
          <TenantLogoContainer isTopNav>
            <TenantLogo />
          </TenantLogoContainer>}
          <Link
            ariaLabel="Call our support team"
            href={`tel:${advisorPhone}`}
            label={
              <UniformSpacingLayout>
                {/* Wrapping the icon by UniformSpacingLayout to remove
                excess space below the icon added by Link component */}
                <PhoneIcon
                  variant="interactive"
                />
              </UniformSpacingLayout>
                }
          />
        </>}
      />
    </>
  );
};

export default RebrandNav;
