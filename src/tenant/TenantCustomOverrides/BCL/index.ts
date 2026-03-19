import type { TenantCustomisationConfig } from '../../../components/Customisation/types';
import ConsentBody from './auraConsentBody';
import CheckoutConsentBody from './checkoutConsentBody';
import { TENANT_OVERRIDE_SLOTS } from '../../consts';
import {
  ComplaintsLinkSlot,
  QuotesContinuedCTA, QuotesMoneyBackGuarantee
} from './slots';

export default {
  slots: {
    [TENANT_OVERRIDE_SLOTS.COMPLAINTS_LINK_SLOT]: ComplaintsLinkSlot,
    [TENANT_OVERRIDE_SLOTS.QUOTES_CONTINUED_CTA]: QuotesContinuedCTA,
    [TENANT_OVERRIDE_SLOTS.MONEY_BACK_GUARANTEE]: QuotesMoneyBackGuarantee,
  },
  components: [ConsentBody, CheckoutConsentBody],
} as TenantCustomisationConfig;
