import { hasFlag, TENANT_FLAGS } from '@policyme/global-libjs-utils';

export function isHDFullyUWEnabled() {
  return hasFlag(TENANT_FLAGS.ENABLE_FULLY_UW_HD);
}
