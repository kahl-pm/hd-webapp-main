import { hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import { PM_ENABLE_SEPT2025_PROMO } from '../../config';
import { isPMEnvironment } from '../helpers';

export const isMarketingCheckboxEnabled = () => {
  return (
    !hasFlag(TENANT_FLAGS.MARKETING_COMMUNICATIONS_CONSENT_DISABLED)
  );
};

// HD-only webapp: Life/CI group and simplified insurance functions removed

export const isSept2025PromoEnabled: () => boolean = () => {
  return PM_ENABLE_SEPT2025_PROMO === '1' && isPMEnvironment();
};
