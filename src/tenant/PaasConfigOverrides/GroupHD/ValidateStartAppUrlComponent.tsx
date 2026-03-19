import React, { useEffect } from 'react';
import { PM_PRODUCT_PREFIX } from '@policyme/global-libjs-utils';
import { CustomiseOverrideComponent } from '../../../components/Customisation';
import { ValidateStartAppUrlProps } from '../../../pages/types/StartApp.types';
import { ValidateStartAppUrlComponent as Default } from '../../../pages/StartApp';
import { INSURANCE_OWNERSHIP_TYPES, PROVINCES_ABBREVIATIONS } from '../../../utils/const';

const ValidateStartAppUrlComponentGroup: React.FC<ValidateStartAppUrlProps> = (props) => {
  const { province, insurance_ownership_type, mainProduct, redirectToPage } = props;
  useEffect(() => {
    if (mainProduct === PM_PRODUCT_PREFIX.HD) {
      // Group insurance is not allowed for Quebec
      if (province === PROVINCES_ABBREVIATIONS.QC &&
        insurance_ownership_type === INSURANCE_OWNERSHIP_TYPES.GROUP) {
        redirectToPage();
      }
    }
  }, []);

  return null;
};

export default CustomiseOverrideComponent(Default, ValidateStartAppUrlComponentGroup);
