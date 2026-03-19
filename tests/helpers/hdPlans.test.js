import {
  getTenant,
  HD_PLANS_DATA,
  PM_HD_PLAN_TYPES,
  BMOI_HD_PLAN_TYPES,
  test as testUtils,
  TENANTS,
} from '@policyme/global-libjs-utils';
import { getPlansByTenant, getPlansToShow } from '../../src/pages/health-and-dental/plans';
import { UNDERWRITING_METHODS } from '../../src/utils/const';
import { getFromEnvironment } from '../../src/utils/environmentHelpers';

const PMConfig = TENANTS.PM;
const BMOIConfig = TENANTS.BMOI;
const setTenant = testUtils.setTenant;

jest.mock('../../src/utils/environmentHelpers');
describe('getPlansByTenant PM', () => {
  const oldConfig = getTenant();
  beforeEach(() => {
    setTenant(PMConfig);
  });
  afterAll(() => {
    setTenant(oldConfig);
  });
  it('returns GUARANTEED_ISSUE plans for POLICYME', () => {
    const underwritingMethod = UNDERWRITING_METHODS.GUARANTEED_ISSUE;
    const expectedPlans = [
      { plan_type: PM_HD_PLAN_TYPES.ECONOMIC, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.CLASSIC, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.ADVANCED, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.DENTAL_CARE, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.DRUG_CARE, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED, underwriting_method: underwritingMethod },
    ];
    const plans = getPlansByTenant(underwritingMethod);
    expect(plans).toEqual(expectedPlans);
  });

  it('returns PORTABLE plans for POLICYME', () => {
    const underwritingMethod = UNDERWRITING_METHODS.PORTABLE_COVERAGE;
    const expectedPlans = [
      { plan_type: PM_HD_PLAN_TYPES.ECONOMIC, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.CLASSIC, underwriting_method: underwritingMethod },
      { plan_type: PM_HD_PLAN_TYPES.ADVANCED, underwriting_method: underwritingMethod },
      {
        plan_type: PM_HD_PLAN_TYPES.DENTAL_CARE,
        underwriting_method: UNDERWRITING_METHODS.GUARANTEED_ISSUE,
      },
      {
        plan_type: PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED,
        underwriting_method: UNDERWRITING_METHODS.PORTABLE_COVERAGE,
      },
      {
        plan_type: PM_HD_PLAN_TYPES.DRUG_CARE,
        underwriting_method: UNDERWRITING_METHODS.GUARANTEED_ISSUE,
      },
    ];
    const plans = getPlansByTenant(underwritingMethod);
    expect(plans).toEqual(expectedPlans);
  });
});

describe('getPlansByTenant BMOI', () => {
  const oldConfig = getTenant();
  beforeEach(() => {
    setTenant(BMOIConfig);
  });
  afterAll(() => {
    setTenant(oldConfig);
  });
  it('returns GUARANTEED_ISSUE plans for BMOI', () => {
    const underwritingMethod = UNDERWRITING_METHODS.GUARANTEED_ISSUE;
    const expectedPlans = [
      { plan_type: BMOI_HD_PLAN_TYPES.BASIC, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD_NO_DENTAL, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.ENHANCED, underwriting_method: underwritingMethod },
    ];
    const plans = getPlansByTenant(underwritingMethod);
    expect(plans).toEqual(expectedPlans);
  });

  it('returns PORTABLE plans for BMOI', () => {
    const underwritingMethod = UNDERWRITING_METHODS.PORTABLE_COVERAGE;
    const expectedPlans = [
      { plan_type: BMOI_HD_PLAN_TYPES.BASIC, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD_NO_DENTAL, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.STANDARD_NO_DRUG, underwriting_method: underwritingMethod },
      { plan_type: BMOI_HD_PLAN_TYPES.ENHANCED, underwriting_method: underwritingMethod },
    ];
    const plans = getPlansByTenant(underwritingMethod);
    expect(plans).toEqual(expectedPlans);
  });
});

describe('getPlansByTenant No tenant', () => {
  const oldConfig = getTenant();
  beforeEach(() => {
    setTenant({});
  });
  afterAll(() => {
    setTenant(oldConfig);
  });
  it('returns empty array', () => {
    const underwritingMethod = UNDERWRITING_METHODS.GUARANTEED_ISSUE;
    const plans = getPlansByTenant(underwritingMethod);
    expect(plans).toEqual([]);
  });
});

describe('getPlansToShow', () => {
  const tenantCode = 'PM';
  const underwritingMethod = 'guaranteed_issue';
  const selectedCategory = 'category1';
  const shouldHideEcoPlan = true;

  const mockPlans = {
    plan1: { planType: PM_HD_PLAN_TYPES.ECONOMIC, category: 'category1' },
    plan2: { planType: PM_HD_PLAN_TYPES.DRUG_CARE, category: 'category2' },
    plan3: { planType: PM_HD_PLAN_TYPES.NO_DENTAL_ADVANCED, category: 'category1' },
    plan4: { planType: 'other', category: 'category1' },
  };

  beforeEach(() => {
    HD_PLANS_DATA[tenantCode] = {
      [underwritingMethod]: mockPlans,
    };
  });

  it('should return plans filtered by selectedCategory', () => {
    (getFromEnvironment).mockReturnValue('1');

    const result = getPlansToShow({
      tenantCode,
      underwritingMethod,
      selectedCategory,
      shouldHideEcoPlan: false,
    });

    expect(result).toEqual([
      mockPlans.plan1,
      mockPlans.plan3,
      mockPlans.plan4,
    ]);
  });

  it('should return all plans if selectedCategory is not provided', () => {
    (getFromEnvironment).mockReturnValue('1');
    const result = getPlansToShow({
      tenantCode,
      underwritingMethod,
      selectedCategory: null,
      shouldHideEcoPlan: false,
    });

    expect(result).toEqual(Object.values(mockPlans));
  });

  it('should hide economic plan if shouldHideEcoPlan is true', () => {
    const result = getPlansToShow({
      tenantCode,
      underwritingMethod,
      selectedCategory: null,
      shouldHideEcoPlan: true,
    });

    expect(result).not.toContain(mockPlans.plan1);
  });
});
