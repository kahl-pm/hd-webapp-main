import { getBrowserLocale } from '@policyme/global-libjs-utils';

const SLICE_NAME = 'household';

export const initialState = {
  email: '',
  isValidEmail: false, // True only when we have verified the email through kickbox
  firstName: '',
  lastName: '',
  hasPartner: '',
  partnerAge: '',
  partnerGender: '',
  userIncome: '',
  userIncomeOverride: '', // from app form
  userGender: '',
  hasSavings: '',
  partnerIncome: '',
  partnerIncomeOverride: '', // from app form
  hasDebts: '',
  residenceType: '',
  birthdate: '',
  smoke: '',
  health: '',
  phone: '',
  hasKids: '',
  kids: [],
  nonRetirementSavings: '',
  retirementSavings: '',
  useSavingsForCI: '',
  assetsTotOverride: '', // from app form, used in partner hh_info
  creditCards: '',
  linesOfCredit: '',
  homeEquityLoans: '',
  mortgage: '',
  otherDebt: '',
  studentLoans: '',
  debtsTotOverride: '', // from app form, used in partner hh_info
  hasExistingCoverage: '',
  address_line1: '',
  address_line2: '',
  city: '',
  country: '',
  postal_code: '',
  province: '',
  healthcard_province: '',
  existingCoverage: {
    spouse: {
      group: '',
      individual: '',
    },
    user: {
      group: '',
      individual: '',
    },
  },
  user_family_composition: '',
  application_language: getBrowserLocale(),
  marketingCommunicationsConsent: false,
  quote_source: '',
};

const makeHouseholdReducer = (slice) => {
  return (state, action) => {
    let updates;
    let index;
    let updateIndex;
    switch (action.type) {
      case `@@${slice}/update_household_prop`:
      case `@@all/household/update_household_prop`:
        return {
          ...state,
          [action.property]: action.value,
        };
      case `@@${slice}/update_email`:
        return {
          ...state,
          email: action.value.replace(/\s+/g, ''), // strip all whitespace
        };
      case `@@all/household/update_has_kids`:
        updates = {
          hasKids: action.value,
        };
        if (action.value === true) {
          // fix issue where pressing yes on kids when there was already data entered
          // would reset that data to the initial state
          if (state.hasKids !== true) {
            updates.kids = [emptyKid(action.reactId)];
          }
        } else {
          updates.kids = [];
        }
        return {
          ...state,
          ...updates,
        };
      case `@@all/household/add_kid`:
        return {
          ...state,
          kids: [...state.kids, emptyKid(action.reactId)],
        };
      case `@@all/household/remove_kid`:
        index = state.kids.findIndex((k) => k.reactId === action.id);
        return {
          ...state,
          kids: [
            ...state.kids.slice(0, index),
            ...state.kids.slice(index + 1),
          ],
        };
      case `@@all/household/update_kid`:
        updateIndex = state.kids.findIndex((k) => k.reactId === action.id);
        if (updateIndex === undefined) {
          return {
            ...state,
          };
        }
        return {
          ...state,
          kids: [
            ...state.kids.slice(0, updateIndex),
            { ...state.kids[updateIndex], age: action.age },
            ...state.kids.slice(updateIndex + 1),
          ],
        };
      case `@@${slice}/update_has_savings`:
      case `@@all/household/update_has_savings`:
        updates = {
          hasSavings: action.value,
        };
        if (action.value === false) {
          updates = {
            ...updates,
            retirementSavings: '',
            nonRetirementSavings: '',
          };
        }
        return {
          ...state,
          ...updates,
        };
      case `@@${slice}/update_has_debts`:
      case `@@all/household/update_has_debts`:
        updates = {
          hasDebts: action.value,
        };
        if (action.value === false) {
          updates = {
            ...updates,
            creditCards: '',
            studentLoans: '',
            homeEquityLoans: '',
            linesOfCredit: '',
            otherDebt: '',
          };
        }
        return {
          ...state,
          ...updates,
        };
      case `@@${slice}/update_residence_type`:
      case `@@all/household/update_residence_type`:
        updates = {
          residenceType: action.value,
          residence: '',
          mortgage: '',
        };
        return {
          ...state,
          ...updates,
        };

      case `@@${slice}/update_existing`:
        return {
          ...state,
          existingCoverage: {
            ...state.existingCoverage,
            user: {
              ...state.existingCoverage.user,
              [action.property]: action.value,
            },
          },
        };
      case `@@${slice}/update_address`:
        updates = parsePlacesPayload(action.payload, action.excludeProvince);
        return {
          ...state,
          ...updates,
        };
      case `@@${slice}/debug`:
        return {
          ...state,
          ...action.value,
        };
      default:
        return state;
    }
  };
};

const emptyKid = (reactId) => {
  return { reactId, age: '' };
};

export const parsePlacesPayload = (payload, excludeProvince = false) => {
  const { address_components } = payload;
  if (address_components === undefined) {
    return {
      address_line1: payload.name,
    };
  }

  const street_number_object = address_components.find(component => component.types.find(t => t === 'street_number'));
  const street_number = street_number_object ? street_number_object.long_name : '';

  const street_name_object = address_components.find(component => component.types.find(t => t === 'route'));
  const street_name = street_name_object ? street_name_object.long_name : '';

  const city_object = address_components.find(component => component.types.find(t => t === 'locality'));
  const city = city_object ? city_object.long_name : '';

  const province_object = address_components.find(component => component.types.find(t => t === 'administrative_area_level_1'));
  const province = province_object ? province_object.short_name : '';

  const postal_code_object = address_components.find(component => component.types.find(t => t === 'postal_code'));
  const postal_code = postal_code_object ? postal_code_object.long_name : '';

  const country_object = address_components.find(component => component.types.find(t => t === 'country'));
  const country = country_object ? country_object.short_name : '';

  const result = {
    address_line1: `${street_number} ${street_name}`,
    city,
    postal_code,
    country,
  };
  // we want to exclude province to prevent breaking the initialProvince on full address page
  if (!excludeProvince) {
    result.province = province;
  }
  return result;
};

export default (user) => (state = initialState, action) => (
  makeHouseholdReducer(`${user}/${SLICE_NAME}`)(state, action));
