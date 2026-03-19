import { PM_PRODUCT_PREFIX, ProductType } from '../../utils/const';

export function getPreAppMainProductMetadata(pathname: string) : [ProductType, string] {
  const hasHDInUrl = pathname.match(/^\/(\w+\/)/) && pathname.match(/^\/(\w+\/)/)[0] === '/hd/';

  if (hasHDInUrl) {
    return [PM_PRODUCT_PREFIX.HD, 'Health and Dental'];
  }

  return [PM_PRODUCT_PREFIX.HD, 'Health and Dental'];
}
