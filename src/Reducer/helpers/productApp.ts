import { ProductAppCommonStates } from '../../store/types/State';
import { UNDERWRITING_METHODS, INSURANCE_OWNERSHIP_TYPES } from '../../utils/const';

export const productAppInitialState: ProductAppCommonStates = {
  product_added: false,
  buying_method: '',
  underwriting_method: UNDERWRITING_METHODS.FULLY_UNDERWRITTEN,
  external_advisor_id: '',
  insurance_ownership_type: INSURANCE_OWNERSHIP_TYPES.INDIVIDUAL,
};
