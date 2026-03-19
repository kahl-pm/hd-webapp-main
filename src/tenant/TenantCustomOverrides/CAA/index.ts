import type { TenantCustomisationConfig } from '../../../components/Customisation/types';
import { TENANT_OVERRIDE_SLOTS } from '../../consts';
import ConsentBody from './auraConsentBody';
import CheckoutConsentBody from './checkoutConsentBody';
import { ComplaintsLinkSlot, SupportEmailSlot } from './slots';

export default {
  slots: {
    [TENANT_OVERRIDE_SLOTS.COMPLAINTS_LINK_SLOT]: ComplaintsLinkSlot,
    [TENANT_OVERRIDE_SLOTS.SUPPORT_EMAIL_SLOT]: SupportEmailSlot,
  },
  components: [ConsentBody, CheckoutConsentBody],
} as TenantCustomisationConfig;
