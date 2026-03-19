import React from 'react';
import { useDispatch } from 'react-redux';
import { CustomiseOverrideComponent } from '../../../components/Customisation';
import QuotesInputCard, { QuotesInputCardProps } from '../../../components/QuotesInputCard';
import { updateHDAppPropertyPrimary } from '../../../NewActions/hdApp';
import { INSURANCE_OWNERSHIP_TYPES, PM_PRODUCT_PREFIX, PROVINCES_ABBREVIATIONS, USER_TYPES } from '../../../utils/const';
import { isGroupHDEnabled } from './helpers';
import { makeUpdateProductAppProp } from '../../../NewActions/helpers/productApp';

const QuotesInputCardNew: React.FC<QuotesInputCardProps> = (props) => {
  const dispatch = useDispatch();
  return <QuotesInputCard
    {...props}
    updateHouseholdProp={(property, value) => {
      props.updateHouseholdProp(property, value);
      if (isGroupHDEnabled() && property === 'healthcard_province') {
        const insuranceOwnershipType = value === PROVINCES_ABBREVIATIONS.QC ?
          INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL : INSURANCE_OWNERSHIP_TYPES.GROUP;
        dispatch(updateHDAppPropertyPrimary('insurance_ownership_type', insuranceOwnershipType));
        dispatch(makeUpdateProductAppProp(PM_PRODUCT_PREFIX.HD, USER_TYPES.PRIMARY)('insurance_ownership_type', insuranceOwnershipType));
      }
    }}
  />;
};

export default CustomiseOverrideComponent(QuotesInputCard, QuotesInputCardNew);
