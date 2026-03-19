import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Card, Typography, UniformSpacingLayout, VerticalStepper, Spacer } from '@policyme/global-libjs-designsystem';
import { getTenant, hasValue, PM_PRODUCT_PREFIX } from '@policyme/global-libjs-utils';
import { State } from '../../store/types/State';
import { usePricing } from '../HOC/WithPricing';
import { getHDAppPlanType, getMainProduct } from '../../Selectors/helpers/productApp';
import { getRoutePageOptions } from '../../config/pageOptionsConfig';
import { ROUTE_REGEX, ROUTES, USER_TYPES } from '../../utils/const';
import { isJoint } from '../../Selectors/userControl';
import { getABTestBand } from '../../Selectors/metadata';
import { doesAppIdExist, doesPolicyIdExist } from '../../Selectors/session';
import { NAME_MAP } from '../../pages/health-and-dental/plans';
import { getRouteWithProductType, hasMultipleFamilyMembers } from '../../utils/helpers';
import { routes as applicationRoutes } from '../Routing/Application';

const STEP_INDEX = {
  ESTIMATE_RATE: 0,
  CHECK_ELIGIBILITY: 1,
  REVIEW_CHECKOUT: 2,
};

const listOfAllApplicationRoutes = applicationRoutes.map(route => route.route);

const ProgressCard = () => {
  const { pricing } = usePricing();
  const currPath = useSelector<State, string>((state) => state.router.location.pathname);
  const abTestBand = useSelector<State, string>(getABTestBand);
  const pageOption = getRoutePageOptions(abTestBand, currPath);
  const mainProduct = useSelector<State, string>(
    (state) => getMainProduct(state, USER_TYPES.PRIMARY),
  );
  const isJointUser = useSelector<State, boolean>(
    state => isJoint(state) || hasMultipleFamilyMembers(state),
  );
  const preDecisionPricePrimary = pricing.primary[mainProduct].preDecisionFirstPaymentCurrency;
  const preDecisionPriceSecondary = isJointUser ?
    pricing.secondary[mainProduct].preDecisionFirstPaymentCurrency : null;
  const hasPolicy = useSelector<State, boolean>(
    state => doesPolicyIdExist(state, USER_TYPES.PRIMARY),
  );
  const hasApplication = useSelector<State, boolean>(
    state => doesAppIdExist(state, USER_TYPES.PRIMARY),
  );
  const price = mainProduct === PM_PRODUCT_PREFIX.HD ? pricing.overall.hd.totalFirstPayment :
    pricing.primary[mainProduct].preDecisionFirstPayment;
  const hdPriceCurrency = pricing.overall.hd.totalFirstPaymentCurrency;

  const showPredecisionPrices = price && hasValue(price) && !hasPolicy
    && pricing.primary[mainProduct].coverageAmt
    && currPath !== getRouteWithProductType(ROUTES.QUOTES_COMPARE_CONTINUED, mainProduct);

  const [activeStep, setActiveStep] = React.useState(STEP_INDEX.ESTIMATE_RATE);
  const isApplicationRoute = !!currPath.match(ROUTE_REGEX.APPLICATION_DISCLOSURE_INTEGRATION)
  || !!currPath.match(ROUTE_REGEX.APPLICATION_FULL_ADDRESS)
  || !!currPath.match(ROUTE_REGEX.APPLICATION_TRUSTEE)
  || !!currPath.match(ROUTE_REGEX.APPLICATION_BEGIN_DISCLOSURE)
  || listOfAllApplicationRoutes.includes(currPath);
  useEffect(() => {
    if (hasPolicy) {
      setActiveStep(STEP_INDEX.REVIEW_CHECKOUT);
    } else if (hasApplication && isApplicationRoute) {
      setActiveStep(STEP_INDEX.CHECK_ELIGIBILITY);
    } else {
      setActiveStep(STEP_INDEX.ESTIMATE_RATE);
    }
  }, [hasPolicy, hasApplication, currPath, isApplicationRoute]);

  const selectedHdPlan = useSelector<State, string>(state => getHDAppPlanType(state));
  const hideEstimateRateExpanded = !!pageOption.hideProgressCardEstimateRateExpanded;
  const steps = [
    {
      label: mainProduct === PM_PRODUCT_PREFIX.HD ?
        <FormattedMessage id="sideNavProgress.chooseAPlan.1MYsJt" /> :
        <FormattedMessage id="sideNavProgress.estimateRate.BQ51Sx" />,
      name: 'Estimate-my-rate',
      description: !hideEstimateRateExpanded && showPredecisionPrices ? <UniformSpacingLayout
        flexDirection="column"
        justifyContent="flex-start"
      >
        <Typography
          variant="body3"
          secondaryText
          message={<FormattedMessage id="sideNavProgress.quoteFor.7vXIlS" />}
        />
        <Typography
          variant="body3"
          message={
            mainProduct === PM_PRODUCT_PREFIX.HD ?
              <FormattedMessage
                id="sideNavProgress.hdPlans.4ZTHWP"
                values={{ hdPlan: NAME_MAP[getTenant().code][selectedHdPlan] }}
              /> :
              <FormattedMessage
                id="sideNavProgress.coverageAndTerm.PutOe3"
                values={{ coverage: pricing.primary[mainProduct].coverageAmtCurrency,
                  term: pricing.primary[mainProduct].term }}
              />
          }
        />
        <Spacer size="spaceSmall" />
        <Typography
          variant="body3"
          secondaryText
          message={mainProduct === PM_PRODUCT_PREFIX.HD ?
            <FormattedMessage id="sideNavProgress.yourPremium.0vxVkO" values={{ isJoint: isJointUser }} /> :
            <FormattedMessage id="sideNavProgress.yourEstimatedRate.HFMTce" />}
        />
        <UniformSpacingLayout gap="0rem" flexDirection="row" justifyContent="flex-start">
          <Typography
            variant="body3"
            message={mainProduct === PM_PRODUCT_PREFIX.HD ?
              hdPriceCurrency : preDecisionPricePrimary}
          />
          <Typography
            variant="body3"
            message={
              <FormattedMessage
                id="global.perMonthExpanded.ax14a4"
              />
            }
          />
        </UniformSpacingLayout>
        {mainProduct !== PM_PRODUCT_PREFIX.HD && preDecisionPriceSecondary && (
          <>
            <Spacer size="spaceSmall" />
            <Typography
              variant="body3"
              secondaryText
              message={<FormattedMessage id="sideNavProgress.partnerEstimatedRate.sZJUuI" />}
            />
            <UniformSpacingLayout gap="0rem" flexDirection="row" justifyContent="flex-start">
              <Typography variant="body3" message={preDecisionPriceSecondary} />
              <Typography
                variant="body3"
                message={
                  <FormattedMessage
                    id="global.perMonthExpanded.ax14a4"
                  />
                }
              />
            </UniformSpacingLayout>
          </>
        )}
      </UniformSpacingLayout> : undefined,
      showDescription: !hideEstimateRateExpanded && showPredecisionPrices,
    },
    {
      label: mainProduct === PM_PRODUCT_PREFIX.HD ?
        <FormattedMessage id="sideNavProgress.provideDetails.iLnEIw" /> :
        <FormattedMessage id="sideNavProgress.checkEligibility.r8o6IS" />,
      name: mainProduct === PM_PRODUCT_PREFIX.HD ? 'Provide-my-details' : 'Check-my-eligibility',
    },
    {
      label: <FormattedMessage id="sideNavProgress.reviewCheckout.lRnvwE" />,
      name: 'Review-and-checkout',
    },
  ];

  const ProgressBarContent = (
    <>
      <Typography
        variant="body3"
        message={<FormattedMessage id="sideNavProgress.yourProgress.vfh8B7" />}
        secondaryText
      />
      <Spacer size="spaceSmall" />
      <VerticalStepper
        steps={steps}
        activeStep={activeStep}
      />
    </>
  );
  return (
    <UniformSpacingLayout>
      <Card
        cardVariant="empty"
        body={ProgressBarContent}
        noShadow
      />
    </UniformSpacingLayout>
  );
};

export default ProgressCard;
