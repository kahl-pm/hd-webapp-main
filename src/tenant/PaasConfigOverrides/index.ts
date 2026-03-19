import { TENANT_FLAGS } from '@policyme/global-libjs-utils';
import type { ComponentsPerPaasConfigFlag, SlotsPerPaasConfigFlag } from '../../components/Customisation/types';
import DisableJointApplication from './DisableJoint';
import QuotesInputCardGroupHD from './GroupHD/QuotesInputCardNew';
import ValidateStartAppUrlComponentGroup from './GroupHD/ValidateStartAppUrlComponent';
import MarketingCommunicationsConsentDisabled from './MarketingCommunicationsConsentDisabled';

// Slots per tenant flag
export const PAAS_CONFIG_OVERRIDE_SLOTS: SlotsPerPaasConfigFlag = {
  [TENANT_FLAGS.DISABLE_JOINT_APPLICATION]: DisableJointApplication,
  [TENANT_FLAGS.MARKETING_COMMUNICATIONS_CONSENT_DISABLED]: MarketingCommunicationsConsentDisabled,
};

// Customisable components per tenant flag
export const PAAS_CONFIG_OVERRIDE_COMPONENTS: ComponentsPerPaasConfigFlag = {
  [TENANT_FLAGS.ENABLE_GROUP_HD]: [QuotesInputCardGroupHD, ValidateStartAppUrlComponentGroup],
};
