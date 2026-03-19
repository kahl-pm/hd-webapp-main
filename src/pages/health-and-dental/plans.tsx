/* eslint-disable react/style-prop-object */
import React from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  BMOI_BASIC_PLAN_TYPES,
  BMOI_HD_PLAN_TYPES,
  CAA_BASIC_PLAN_TYPES,
  CAA_HD_PLAN_TYPES,
  getTenant,
  HD_Plan,
  HD_PLANS_DATA,
  HDTenantCodes,
  PM_BASIC_PLAN_TYPES,
  PM_HD_PLAN_TYPES,
  TENANTS_NAME_CODES_MAPPING,
} from '@policyme/global-libjs-utils';
import { FORMATTED_PERIOD, UNDERWRITING_METHODS, UnderwritingMethod } from '../../utils/const';
import { HdQuotes } from '../../store/types/State';

type ListOfAllPlans = BMOI_BASIC_PLAN_TYPES | PM_BASIC_PLAN_TYPES | CAA_BASIC_PLAN_TYPES;

type ListOfAllPlansPlusDental = ListOfAllPlans
  & { dental_secure?: React.ReactNode; dental_care?: React.ReactNode };

type TenantPlan = {
  plan_type: string;
  underwriting_method: string;
};

export const NAME_MAP: Record<HDTenantCodes, ListOfAllPlansPlusDental> = {
  [TENANTS_NAME_CODES_MAPPING.CAA_NATIONAL]: {
    essential: <FormattedMessage id="pages.hd.plans.economic.4G9ijL" />,
    standard: <FormattedMessage id="pages.hd.plans.standard.9d9iZZ" />,
    enhanced: <FormattedMessage id="pages.hd.plans.enhanced.Xk00yz" />,
    dental_secure: <FormattedMessage id="pages.hd.plans.onlyDental.o9DF7Z" />,
  },
  [TENANTS_NAME_CODES_MAPPING.POLICYME]: {
    economic: <FormattedMessage id="pages.hd.plans.economic.o9im6g" />,
    classic: <FormattedMessage id="pages.hd.plans.classic.5ed49d" />,
    advanced: <FormattedMessage id="pages.hd.plans.advanced.45f6gh" />,
    dental_care: <FormattedMessage id="pages.hd.plans.dentalCare.jat23j" />,
    drug_care: <FormattedMessage id="pages.hd.plans.drugCare.w2xQ8t" />,
    no_dental_advanced: <FormattedMessage id="pages.hd.plans.noDentalAdvanced.GHCvw4" />,
  },
  [TENANTS_NAME_CODES_MAPPING.BMOI]: {
    basic: <FormattedMessage id="pages.hd.plans.basic.guKeFZ" />,
    standard: <FormattedMessage id="pages.hd.plans.standard.9d9iZZ" />,
    standard_no_dental: <FormattedMessage id="pages.hd.plans.standardNoDental.rey4vL" />,
    standard_no_drug: <FormattedMessage id="pages.hd.plans.standardNoDrug.Pr6B0j" />,
    enhanced: <FormattedMessage id="pages.hd.plans.enhanced.Xk00yz" />,
  },
};

export const DESCRIPTION_MAP = {
  essential: <FormattedMessage id="pages.hd.plans.essential.zZ88jL" />,
  standard: <FormattedMessage id="pages.hd.plans.standard.1ZUxj0" />,
  enhanced: <FormattedMessage id="pages.hd.plans.enhanced.ddL20X" />,
  dental_secure: <FormattedMessage id="pages.hd.plans.onlyDental.0Zfp9F" />,
  economic: <FormattedMessage id="pages.hd.plans.economic.Eb2pMf" />,
  classic: <FormattedMessage id="pages.hd.plans.classic.k8l1dy" />,
  advanced: <FormattedMessage id="pages.hd.plans.advanced.9weTPr" />,
  dental_care: <FormattedMessage id="pages.hd.plans.dental_care.EI7ESN" />,
  drug_care: <FormattedMessage id="pages.hd.plans.description.drugCare.VdLcXo" />,
  basic: <FormattedMessage id="pages.hd.plans.description.basic.0CTLq0" />,
  standard_no_dental: <FormattedMessage id="pages.hd.plans.description.standardNoDental.Zfv3wd" />,
  standard_no_drug: <FormattedMessage id="pages.hd.plans.description.standardNoDrug.uTv5xw" />,
  no_dental_advanced: <FormattedMessage id="pages.hd.plans.noDentalAdvanced.iPGcMV" />,
};

export const DENTAL_PLAN = {
  PM: PM_HD_PLAN_TYPES.DENTAL_CARE,
  CAA: CAA_HD_PLAN_TYPES.DENTAL_SECURE,
  BMOI: BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG,
};

export const isDentalPlan = (planType) => {
  const DENTAL_PLAN_LIST = Object.entries(DENTAL_PLAN).map(([key, value]) => ({ key, value }));
  return DENTAL_PLAN_LIST.some((plan) => plan.value === planType);
};

export const isDrugCarePlan = (planType) => planType === PM_HD_PLAN_TYPES.DRUG_CARE;

export const NON_DENTAL_PLANS: Record<HDTenantCodes, Array<string>> = {
  PM: [
    PM_HD_PLAN_TYPES.ECONOMIC,
    PM_HD_PLAN_TYPES.CLASSIC,
    PM_HD_PLAN_TYPES.ADVANCED,
    PM_HD_PLAN_TYPES.DRUG_CARE,
    PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED,
  ],
  CAA: [
    CAA_HD_PLAN_TYPES.ESSENTIAL,
    CAA_HD_PLAN_TYPES.STANDARD,
    CAA_HD_PLAN_TYPES.ENHANCED,
  ],
  BMOI: [
    BMOI_HD_PLAN_TYPES.BASIC,
    BMOI_HD_PLAN_TYPES.STANDARD,
    BMOI_HD_PLAN_TYPES.STANDARD_NO_DENTAL,
    BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG,
    BMOI_HD_PLAN_TYPES.ENHANCED,
  ],
};

/**
 * Get the list of plans we want to show to the user based on the tenant, underwriting method
 * we need to do this because when portable is selected, we still show the GI dental plan
 * @param {str} underwriting_method
 * @returns list of plan objects `{plan_type: str, underwriting_method: str}`
 */
export const getPlansByTenant = (underwriting_method: UnderwritingMethod) => {
  const plansToShow: TenantPlan[] = getTenant()?.hdPlans?.[underwriting_method] || [];
  return plansToShow;
};

interface GetPlansToShowParams {
  tenantCode: string;
  underwritingMethod: string;
  shouldHideEcoPlan: boolean;
  selectedCategory: string;
}

/**
 * Iteratively construct the plan object based on the plan type and underwriting method
 */
export function getPlansToShow({
  tenantCode,
  underwritingMethod,
  selectedCategory,
  shouldHideEcoPlan,
}: GetPlansToShowParams) {
  let result: Array<HD_Plan> = [];
  const plans = HD_PLANS_DATA[tenantCode][underwritingMethod];

  if (selectedCategory) {
    result = Object.keys(plans).filter(planType => {
      const plan = plans[planType];
      return plan.category === selectedCategory;
    }).map(planType => plans[planType]);
  } else {
    result = Object.keys(plans).map(planType => plans[planType]);
  }

  // HIDE ECO PLAN
  result = result.filter(
    plan => {
      if (plan.planType === PM_HD_PLAN_TYPES.ECONOMIC) {
        return !shouldHideEcoPlan;
      }

      return true;
    },
  );

  return result;
}

interface GetHDPlansParams {
  isJoint: boolean;
  isMobile: boolean;
  isGi: boolean;
  giIncludeDrugCoverage: boolean;
  tenantCode: string;
  underwritingMethod: UnderwritingMethod;
  shouldHideEcoPlan: boolean;
}

export function getHDPlans(plans: HdQuotes | {}, {
  isJoint,
  isMobile,
  isGi,
  tenantCode,
  underwritingMethod,
  selectedCategory,
  shouldHideEcoPlan,
}) {
  const plansToShow: HD_Plan[] = getPlansToShow({
    tenantCode,
    underwritingMethod,
    selectedCategory,
    shouldHideEcoPlan,
  });

  // We only want to show plans that have quotes
  const plansWithQuotes = plansToShow.filter((plan) => plan.planType in plans);

  return plansWithQuotes.map((plan) => {
    const price = plans[plan.planType].mn_prems;
    const nonDiscountedPrice = plans[plan.planType].original_mn_prems;
    const isDiscounted = plans[plan.planType].is_discounted;
    const name = NAME_MAP[tenantCode][plan.planType];
    const description = DESCRIPTION_MAP[plan.planType];
    const isFullyUw = underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN;

    return {
      ...plan,
      formattedPrice: <FormattedNumber style="currency" currency="CAD" value={price} />,
      formattedNonDiscountedPrice: isDiscounted ? (
        <FormattedNumber style="currency" currency="CAD" value={nonDiscountedPrice} />
      ) : null,
      formattedPeriod: FORMATTED_PERIOD[plan.formattedPeriod],
      isJoint,
      isGuaranteedAcceptance: isGi,
      name,
      description,
      isFullyUw,
    };
  });
}
