import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Alert, AwardIcon, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import { DISCOUNTS_VALUE, DISCOUNT_CODES } from '../../utils/discounts';

interface DiscountBannerProps {
  isPermanentInsurance?: boolean;
  productType?: string;
  discountCodes?: string[];
}

const DiscountBanner = (props: DiscountBannerProps) => {
  const { productType, discountCodes } = props;

  let productTypeText;
  let hasCAAMemberShipDiscount = false;
  if (productType === PM_PRODUCT_PREFIX.HD) {
    let familyDiscountPerc;
    let caaMemberDiscountPerc;
    if (discountCodes.includes(DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT)) {
      familyDiscountPerc = DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_FAMILY_DISCOUNT];
    }
    if (discountCodes.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT)) {
      caaMemberDiscountPerc = DISCOUNTS_VALUE[DISCOUNT_CODES.CAA_HD_DISCOUNT];
      hasCAAMemberShipDiscount = true;
    }
    if (familyDiscountPerc && caaMemberDiscountPerc) {
      productTypeText = <FormattedMessage
        id="discountBanner.caaMemberAndFamily.TK9Tz4"
        values={{
          familyDiscountPerc,
          caaMemberDiscountPerc,
          b: chunks => <strong>{chunks}</strong>,
        }}
      />;
    } else if (familyDiscountPerc) {
      productTypeText = <FormattedMessage
        id="discountBanner.hdFamilyDiscount.x4dhFv"
        values={{
          discountPerc: familyDiscountPerc,
          b: chunks => <strong>{chunks}</strong>,
        }}
      />;
    } else {
      productTypeText = <FormattedMessage
        id="discountBanner.saveRates.h006s6"
        values={{
          discountPerc: caaMemberDiscountPerc,
          b: chunks => <strong>{chunks}</strong>,
        }}
      />;
    }
  }
  const getAlertHeader = () => (hasCAAMemberShipDiscount ? <FormattedMessage
    id="discountBanner.greatNews.ZbQkW1"
  /> : <FormattedMessage id="discountBanner.familySaving.QcpQMD" />);
  return (
    <>
      <Alert
        type="tip"
        icon={<AwardIcon />}
        text={productTypeText}
        heading={<Typography variant="h3" message={getAlertHeader()} component="p" />}
      />
      <Spacer size="spaceMedium" />
    </>
  );
};

export default DiscountBanner;
