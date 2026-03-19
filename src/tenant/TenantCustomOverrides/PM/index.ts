import type { TenantCustomisationConfig } from '../../../components/Customisation/types';
import ConsentBody from './auraConsentBody';
import CheckoutConsentBody from './checkoutConsentBody';

export default {
  slots: {},
  components: [ConsentBody, CheckoutConsentBody],
} as TenantCustomisationConfig;
