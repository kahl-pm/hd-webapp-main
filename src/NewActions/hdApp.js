import { push } from 'connected-react-router';
import { PM_PRODUCT_PREFIX, ROUTES, USER_TYPES } from '../utils/const';

export const makeUpdateHDAppProperty = (slice) => {
  return (property, value) => {
    return {
      type: `@@${slice}/hdApp/update`,
      property,
      value,
    };
  };
};

export const updateHDAppPropertyPrimary = makeUpdateHDAppProperty(`primary`);
export const updateHDAppPropertySecondary = makeUpdateHDAppProperty(`secondary`);
