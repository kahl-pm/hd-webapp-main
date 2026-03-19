import React from 'react';
import { useSelector } from 'react-redux';
import {
  AffiliateLogo, Divider, isMobile, UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import { LOCALE } from '@policyme/global-libjs-utils';
import { AFFILIATE_NAMES } from '../../utils/const';

import { getAffiliateName, getCurrentUser } from '../../Selectors/userControl';
import { State } from '../../store/types/State';
import * as AffiliateLogos from '../../static/images/affliates';
import { wideLogos } from '../../static/images/affliates';

export const affiliateLogo = {
  [AFFILIATE_NAMES.WORKPERKS]: AffiliateLogos.WorkPerksLogo,
  [AFFILIATE_NAMES.PERKOPOLIS]: AffiliateLogos.PerkopolisLogo,
  [AFFILIATE_NAMES.LIFEWORKS]: AffiliateLogos.LifeWorksLogo,
  [AFFILIATE_NAMES.TRIBE]: AffiliateLogos.TribeLogo,
  [AFFILIATE_NAMES.NESTO]: AffiliateLogos.NestoLogo,
  [AFFILIATE_NAMES.BENEFITSALLIANCE]: AffiliateLogos.BenefitsAllianceLogo,
  [AFFILIATE_NAMES.HUMI]: AffiliateLogos.HumiLogo,
  [AFFILIATE_NAMES.GOODLIFEFITNESS]: AffiliateLogos.GoodLifeFitnessLogo,
  [AFFILIATE_NAMES.RATEHUB]: AffiliateLogos.RatehubLogo,
  [AFFILIATE_NAMES.COXFINANCIAL]: AffiliateLogos.CoxFinancialLogo,
  [AFFILIATE_NAMES.BENEFITSCONNECT]: AffiliateLogos.BenefitsConnectLogo,
  [AFFILIATE_NAMES.BRIDGEWELL]: AffiliateLogos.BridgewellLogo,
  [AFFILIATE_NAMES.SUTTON]: AffiliateLogos.SuttonLogo,
  [AFFILIATE_NAMES.GBCC]: AffiliateLogos.GBCCLogo,
  [AFFILIATE_NAMES.PRIMEBENEFITSGROUP]: AffiliateLogos.PrimeBenefitsGroupLogo,
  [AFFILIATE_NAMES.BELAYADVISORS]: AffiliateLogos.BelayAdvisorsLogo,
  [AFFILIATE_NAMES.MCFADDEN]: AffiliateLogos.McFaddenLogo,
  [AFFILIATE_NAMES.CONSULTINGHOUSE]: AffiliateLogos.ConsultingHouseLogo,
  [AFFILIATE_NAMES.RATEHUB_EXCLUSIVE_PERKS]: AffiliateLogos.RatehubLogo,
  [AFFILIATE_NAMES.BENEFITHUB]: AffiliateLogos.BenefitHubLogo,
  [AFFILIATE_NAMES.NESTO_EXCLUSIVE_PERKS]: AffiliateLogos.NestoLogo,
  [AFFILIATE_NAMES.ORCHARDBENEFITS]: AffiliateLogos.OrchardBenefitsLogo,
  [AFFILIATE_NAMES.BESTBENEFITS]: AffiliateLogos.BestBenefitsLogo,
  [AFFILIATE_NAMES.TELUSHEALTH]: AffiliateLogos.TelusHealthLogo,
  [AFFILIATE_NAMES.BOOMGROUP]: AffiliateLogos.BoomGroupLogo,
  [AFFILIATE_NAMES.MIKE_CARLSON]: AffiliateLogos.MikeCarlsonLogo,
  [AFFILIATE_NAMES.EMBARK]: AffiliateLogos.EmbarkLogo,
  [AFFILIATE_NAMES.MERCHANT_GROWTH]: AffiliateLogos.MerchantGrowthLogo,
  [AFFILIATE_NAMES.WAVE]: AffiliateLogos.WaveLogo,
  [AFFILIATE_NAMES.ACHCCS]: AffiliateLogos.AchccsLogo,
  [AFFILIATE_NAMES.ADRIC]: AffiliateLogos.AdricLogo,
};

const LOCALE_TO_PM_LOGO = {
  [LOCALE.EN_CA]: AffiliateLogos.PMRebrandEn,
  [LOCALE.FR_CA]: AffiliateLogos.PMRebrandFr,
};

const AffiliateLogoRow = () => {
  const affiliateName = useSelector((state: State) => getAffiliateName(state));
  const currentUser = useSelector((state: State) => getCurrentUser(state));
  const application_language = useSelector(
    (state: State) => state[currentUser].household.application_language,
  );
  const PMLogo = LOCALE_TO_PM_LOGO[application_language];

  const affiliateLogoSrc = affiliateLogo[affiliateName];

  return (
    <UniformSpacingLayout flexDirection="column">
      <UniformSpacingLayout
        justifyContent={isMobile() ? 'center' : 'flex-start'}
        alignItems="center"
        gap="0.5rem"
      >
        <AffiliateLogo
          alt="PolicyMe Logo"
          src={PMLogo}
        />
        {affiliateLogoSrc && (
          <>
            <Divider orientation="vertical" />
            <AffiliateLogo
              src={affiliateLogoSrc}
              alt={`${affiliateName} Logo`}
              wide={wideLogos.includes(affiliateName)}
              fullWidth
            />
          </>
        )}
      </UniformSpacingLayout>
    </UniformSpacingLayout>
  );
};

export default AffiliateLogoRow;
