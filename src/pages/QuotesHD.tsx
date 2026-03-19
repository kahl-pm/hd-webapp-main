import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Alert, AwardIcon, MaxWidthContainer, PageContainer, Spacer, TabsV2, TextButton, Typography, Tooltip, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { getTenant, CAA_HD_PLAN_TYPES } from '@policyme/global-libjs-utils';
import HD_Plan from '@policyme/global-libjs-utils/src/utils/hdPlans/plan_type';
import { updateHealthDentalSessionSelectedQuote } from '../NewActions/hdSession';
import { getCategoriesFromPlans, getPlanCategory, getRouteWithProductType, hasMultipleFamilyMembers } from '../utils/helpers';
import { getHDPlans, isDentalPlan, isDrugCarePlan } from './health-and-dental/plans';
import { sendSegmentIdentifyEvent, sendSegmentTrackEvent } from '../NewActions/analytics';

import {
  PM_PRODUCT_PREFIX,
  ROUTES,
  UNDERWRITING_METHODS,
  SEGMENT_EVENTS,
  HD_PLAN_CATEGORY_TRANSLATIONS,
  COVERAGE_FIT_PLAN_CATEGORY_MAPPING,
  HD_MOBILE_PLAN_CATEGORY_TRANSLATIONS,
  UserType,
  LEGACY_SEGMENT_EVENTS,
} from '../utils/const';
import { getHdComparePlansUrl, getQuotesDiscountCodes } from '../Selectors/quotes';
import { updateHDAppPropertyPrimary } from '../NewActions/hdApp';
import HealthAndDentalPlanCard from '../components/HealthAndDentalPlanCard';
import HealthAndDentalCarousel from '../components/Carousel';
import { State } from '../store/types/State';
import { isGIProduct, shouldHideEconomicPlan } from '../Selectors/hdSession';
import { DISCOUNT_CODES } from '../utils/discounts';
import { onComponentLoad } from '../NewActions/session';
import { handleSetPresciptionDrugFlag } from '../NewActions/handle';
import BottomNavigation from '../components/BottomNavigation';
import DiscountBanner from '../components/DiscountBanner';
import { isPMEnvironment } from '../tenant/helpers';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';

const planTypes = {
  standard: <FormattedMessage id="healthAndDentalCard.chooseStandardPlan.3Yhwg4" />,
  enhanced: <FormattedMessage id="healthAndDentalCard.chooseEnhancedPlan.jN7c2T" />,
  essential: <FormattedMessage id="healthAndDentalCard.chooseEssentialPlan.D8HnRz" />,
  dental_secure: <FormattedMessage id="healthAndDentalCard.chooseDentalSecurePlan.aF9qKp" />,
};

function ComparePlans({ comparePlansUrl }:
  { comparePlansUrl: string }) {
  const intl = useIntl();

  return (
    <Alert
      type="tip"
      icon={<AwardIcon />}
      text={<FormattedMessage
        id="quotesPage.comparePlans.NA5pKZ"
      />}
    >
      <TextButton
        onClick={() => window.open(comparePlansUrl, '_blank')}
        name="compare-plans"
        label={intl.formatMessage({ id: 'quotesPage.comparePlans.n4zD5' })}
      />
    </Alert>
  );
}

function Questionnaire() {
  const { formatMessage } = useIntl();

  return (<>
    <Tooltip
      tooltipButtonName="questionnaire"
      ariaDescribedBy="questionnaire-description"
      ariaLabelledBy="questionnaire-heading"
      tooltipButtonLabel={formatMessage({
        id: 'quotesPage.questionnaire.Bmw2WD',
      })}
      variant="icon-and-text"
      tooltipHeader={formatMessage({
        id: 'quotesPage.questionnaire.modalTitle.BmwM52',
      })}
    >
      <Spacer size="spaceMedium" />
      <Typography
        variant="body1"
        message={<FormattedMessage
          id="quotesPage.questionnaire.modalBody.IzwKK2"
          values={{ b: (chunks) => <strong>{chunks}</strong> }}
        />}
      />
    </Tooltip>
  </>);
}

const HealthAndDentalQuotes = () => {
  const state = useSelector<State, State>((_state) => _state);
  const isGi = useSelector(isGIProduct);
  const coverageFitFlag = state.primary.hdSession.coverage_fit_flag;
  const shouldHideEcoPlan = useSelector(shouldHideEconomicPlan);
  const mainProduct = state.metadata.preAppMainProduct;
  const hdPlans = mainProduct === PM_PRODUCT_PREFIX.HD ? state.userControl.hd_quotes : {};
  const quoteDiscounts = getQuotesDiscountCodes(
    state, state.userControl.currentUser, mainProduct,
  );

  const caaMemberDiscountApplied = quoteDiscounts.includes(DISCOUNT_CODES.CAA_DISCOUNT) ||
    quoteDiscounts.includes(DISCOUNT_CODES.CAA_HD_DISCOUNT);

  const tenantCode = getTenant().code;
  const underwritingMethod = state.primary.hdApp.underwriting_method;
  const defaultPlanSlide = state.metadata.defaultPlanSlide;
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [includeDrugCoverage, setIncludeDrugCoverage] = useState(true);
  const dispatch = useDispatch();
  const tabletBreakpoint = useMediaQuery('(max-width:48rem)');
  const mobileBreakpoint = useMediaQuery('(min-width:36rem)');
  // 3rd slide for mobile as initial state
  const [defaultSlideIdx, setDefaultSlideIdx] = useState(0);
  const comparePlansUrl = useSelector<State, string>(getHdComparePlansUrl);
  const startAppPlanType = useSelector<State, State>((_state) => _state).metadata.planTypeStartApp;
  const startAppPlanCategory = useMemo(() => {
    return getPlanCategory(startAppPlanType, underwritingMethod, tenantCode);
  }, [startAppPlanType, underwritingMethod, tenantCode]);
  const intl = useIntl();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  useEffect(() => {
    if (tenantCode === 'CAA') {
      if (defaultPlanSlide === CAA_HD_PLAN_TYPES.DENTAL_SECURE) {
        if (mobileBreakpoint) {
          setIncludeDrugCoverage(false);
          setDefaultSlideIdx(1);
          setSelectedIndex(1);
        } else {
          setDefaultSlideIdx(0);
        }
      } else if (defaultPlanSlide === CAA_HD_PLAN_TYPES.STANDARD) {
        if (mobileBreakpoint) {
          setDefaultSlideIdx(1);
          setSelectedIndex(1);
        } else {
          setDefaultSlideIdx(2);
          setSelectedIndex(2);
        }
      }
    } else {
      setDefaultSlideIdx(1);
    }
  }, [mobileBreakpoint, defaultPlanSlide, tenantCode]);
  useEffect(() => {
    const plansSet = Boolean(Object.keys(hdPlans ?? {}).length);

    if (plansSet) {
      const hdPlanList = getHDPlans(hdPlans, {
        isJoint: true,
        isGi,
        isMobile: tabletBreakpoint,
        tenantCode,
        underwritingMethod,
        selectedCategory,
        shouldHideEcoPlan,
      });

      setPlans(hdPlanList);

      // Fetched all plans
      if (!selectedCategory) {
        const planCategories = getCategoriesFromPlans(hdPlanList);

        if (planCategories.length > 0) {
          setCategories(planCategories);
          setSelectedCategory(
            planCategories.includes(COVERAGE_FIT_PLAN_CATEGORY_MAPPING[coverageFitFlag]) ?
              COVERAGE_FIT_PLAN_CATEGORY_MAPPING[coverageFitFlag] :
              (startAppPlanCategory || planCategories[0]),
          );
        }
      }
    }
  }, [isGi, tabletBreakpoint, hdPlans, selectedCategory, coverageFitFlag]);
  const getCategoryTranslation = (category: string) => {
    // useMediaQuery returns true if the screen width is larger than the mobile
    // threshold (36rem in this case), meaning `mobileBreakpoint` will be true
    // for screens larger than typical mobile widths.
    if (mobileBreakpoint) {
      return HD_PLAN_CATEGORY_TRANSLATIONS[category];
    }
    return HD_MOBILE_PLAN_CATEGORY_TRANSLATIONS[category];
  };
  return (
    <>
      <PageContainer gap="1.5rem">
        {caaMemberDiscountApplied || quoteDiscounts.length > 0 ?
          <MaxWidthContainer width="lg">
            <UniformSpacingLayout>
              <DiscountBanner
                discountCodes={quoteDiscounts}
                productType={PM_PRODUCT_PREFIX.HD}
              />
            </UniformSpacingLayout>
          </MaxWidthContainer> : null}
        <Typography
          variant="body3"
          align="center"
          message={<FormattedMessage
            id="quotesPage.subtitle.tu8iWo"
          />}
        />
        <Typography
          variant="h1"
          align="center"
          message={underwritingMethod !== UNDERWRITING_METHODS.FULLY_UNDERWRITTEN ?
            <FormattedMessage
              id="quotesPage.giTitle.iO92Hc"
            /> : <FormattedMessage
              id="quotesPage.title.MCTHlG"
            />}
        />
        {underwritingMethod !== UNDERWRITING_METHODS.FULLY_UNDERWRITTEN && (
          <>
            <Typography
              variant="body1"
              align="center"
              message={<FormattedMessage
                id="quotesPage.giSubtitle.XZp1F8"
                values={{
                  span: chunks => <span className="bold-text">{chunks}</span>,
                }}
              />}
            />
            <>
              <Spacer size="spaceSmall" />
              {categories?.length > 0 && (
                <TabsV2
                  name="plan-category"
                  tabsContainerMaxWidth="xl"
                  tabsContainerAlignCenter
                  tabItems={categories?.map((category: string) => ({
                    label: getCategoryTranslation(category),
                    value: category,
                    id: category,
                    dataCy: `plan-category-${category}`,
                    children: <HDPlanCategoryTab
                      plans={plans}
                      defaultSlideIdx={defaultSlideIdx}
                      handleSetSelectIdx={setSelectedIndex}
                      selectedCategory={selectedCategory}
                    />,
                  }))}
                  ariaLabel="Plan Category"
                  defaultValue={selectedCategory}
                  onTabChange={(value) => setSelectedCategory(value)}
                />
              )}
            </>
          </>
        )}
        <MaxWidthContainer width="md">
          <ComparePlans comparePlansUrl={comparePlansUrl} />
          {underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN && (
            <>
              <Spacer size="spaceMedium" />
              <Questionnaire />
            </>
          )}
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation buttonRef={null} />
    </>
  );
};

type HDPlanCategoryTabProps = {
  selectedCategory: string;
  plans: HD_Plan[],
  defaultSlideIdx: number,
  handleSetSelectIdx: (id: number) => void,
}

const HDPlanCategoryTab = (
  { plans,
    selectedCategory,
    defaultSlideIdx,
    handleSetSelectIdx }: HDPlanCategoryTabProps,

) => {
  const state = useSelector<State, State>((_state) => _state);
  const underwritingMethod = state.primary.hdApp.underwriting_method;
  const _hasMultipleFamilyMembers = useSelector(hasMultipleFamilyMembers);
  const dispatch = useDispatch();
  const currentUser = state.userControl.currentUser;
  const onPlanSelected = async (plan: HD_Plan) => {
    // The selected plan may have been shown under a different underwriting method for
    // conversion or sales purposes.
    // We update the state to make sure we send the correct UW to the server.
    dispatch(updateHDAppPropertyPrimary('underwriting_method', plan.underwritingMethod));
    dispatch(updateHealthDentalSessionSelectedQuote(plan.id));
    dispatch(handleSetPresciptionDrugFlag(plan.id));
    dispatch(sendSegmentIdentifyEvent());
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.QUOTE_RECEIVED,
      currentUser as UserType, PM_PRODUCT_PREFIX.HD, {
        plan_selected: plan.planTitle.defaultMessage as string,
        plan_variant_shown: plan.underwritingMethod === UNDERWRITING_METHODS.GUARANTEED_ISSUE ? 'guaranteed_issue' : 'protect',
        plan_coverage_type_shown: selectedCategory,
      }));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.QUOTE_RECEIVED,
      currentUser as UserType, PM_PRODUCT_PREFIX.HD, {
        plan_selected: plan.planTitle.defaultMessage as string,
        plan_variant_shown: plan.underwritingMethod === UNDERWRITING_METHODS.GUARANTEED_ISSUE ? 'guaranteed_issue' : 'protect',
        plan_coverage_type_shown: selectedCategory,
      }));
    }
    // Redirect user to start app page
    dispatch(push(getRouteWithProductType(ROUTES.START_APP, PM_PRODUCT_PREFIX.HD)));
  };
  if (plans.length < 1) {
    return null;
  }
  return (
    <>
      {plans.length === 1 ?
        <div role="tabpanel" id="includeDrugCoverage_false" style={{ padding: '.5rem 0' }}>
          {/* TODO: https://policyme.atlassian.net/browse/PART-1642 */}
          <MaxWidthContainer width="md">
            <UniformSpacingLayout
              justifyContent="start"
            >
              <Typography
                message={
                  <>
                    {
                      selectedCategory &&
                      HD_PLAN_CATEGORY_TRANSLATIONS[selectedCategory]
                    } ({plans.length})
                  </>
                }
                variant="h2"
              />
            </UniformSpacingLayout>
            <Spacer size="spaceSmall" />
            <HealthAndDentalPlanCard
              plan={{
                ...plans[0],
                onChoosePlan: () => onPlanSelected(plans[0]),
                isJoint: _hasMultipleFamilyMembers,
              }}
              isHDFullyUW={underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN}
            />
          </MaxWidthContainer></div> :
        <div role="tabpanel" id="includeDrugCoverage_true">
          <HealthAndDentalCarousel
            plans={plans}
            isHDFullyUW={underwritingMethod === UNDERWRITING_METHODS.FULLY_UNDERWRITTEN}
            defaultSlideIdx={defaultSlideIdx}
            onPlanSelected={onPlanSelected}
            isJoint={_hasMultipleFamilyMembers}
            setSelectedIndex={handleSetSelectIdx}
            isMobileDevice={false}
            selectedCategoryLabel={
              selectedCategory &&
              HD_PLAN_CATEGORY_TRANSLATIONS[selectedCategory]
            }
          />
        </div>}
    </>

  );
};
export default HealthAndDentalQuotes;
