import { GROUP_NAMES } from '../../tenant/consts';
import { ProductType, UnderwritingMethod, UserType } from '../../utils/const';

export interface StartAppStateProps {
  email: string;
  firstName: string;
  lastName: string;
  firstNameDisabled: boolean;
  lastNameDisabled: boolean;
  emailDisabled: boolean;
  partnerFirstName: string;
  partnerLastName: string;
  suggestedEmail: string;
  isJoint: boolean;
  fromStartApp: boolean;
  disableStartAppInput: boolean;
  mainProduct: ProductType;
  dependent_keys: string[];
  dependents: unknown;
  underwriting_method: UnderwritingMethod;
  loggedInUser: boolean;
  isACHCSSAffiliate: boolean;
  groupName: typeof GROUP_NAMES[number] | null;
}

export interface StartAppProps extends StartAppStateProps {}

export type ParamsProps = {
  match: {
    params: {
      product: ProductType;
      userType: UserType;
    };
  };
};

export interface ValidateStartAppUrlProps {
  province: string;
  insurance_ownership_type: string;
  mainProduct: ProductType;
  redirectToPage: Function;
}
