import { USER_TYPES } from '../../utils/const';

export const makeUpdateProductPolicyProp = (userType, product) => {
  return (property, value) => {
    return {
      type: `@@${userType}/${product}Policy/update`,
      property,
      value,
    };
  };
};
