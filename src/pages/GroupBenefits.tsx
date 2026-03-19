import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  RadioGroup,
  Typography,
  Button,
  Form,
  MaxWidthContainer,
  Spacer,
  PageContainer,
  Alert,
  CalendarDaysIcon,
  isMobile,
} from '@policyme/global-libjs-designsystem';
import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { handleLosingBenefits } from '../NewActions/handle';
import { HD_PAGE_EVENTS, LEGACY_SEGMENT_EVENTS, PM_PRODUCT_PREFIX, SEGMENT_EVENTS, USER_TYPES } from '../utils/const';
import { getMainProduct } from '../Selectors/helpers/productApp';
import { isCAAEnvironment, isPMEnvironment } from '../tenant/helpers';
import BottomNavigation from '../components/BottomNavigation';
import { sendSegmentPageEvent, sendSegmentTrackEvent } from '../NewActions/analytics';
import { getCurrentUser } from '../Selectors/userControl';
import { State } from '../store/types/State';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

const GroupBenefits = () => {
  const losingBenefitsFlag = useSelector<any, boolean>(
    state => state.primary.hdSession.losing_benefits,
  );
  const hasPartnerApplication = useSelector<any, boolean>(
    state => state.userControl.hasPartnerApplication,
  );
  const productType = useSelector(state => getMainProduct(state, USER_TYPES.PRIMARY));

  const [losingBenefits, setLosingBenefits] = useState<boolean | null>(losingBenefitsFlag);
  const currentUser = useSelector((state: State) => getCurrentUser(state));
  
  const dispatch = useDispatch();

  const onSubmit = async () => {
    await dispatch(handleLosingBenefits(losingBenefits));
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE,
        currentUser, PM_PRODUCT_PREFIX.HD));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.HD_GROUP_BENEFITS_PAGE,
        currentUser, PM_PRODUCT_PREFIX.HD));
    }
    dispatch(nextQuestion());
  };

  useEffect(() => {
    dispatch(onComponentLoad(() => {}));
  }, []);

  const onLosingBenefitsSelection = (_value) => {
    setLosingBenefits(_value);
    dispatch(handleLosingBenefits(_value));
  };

  const getLosingBenefitsValue = () => {
    if (losingBenefits === null) {
      return '';
    }

    return losingBenefits ? 'Y' : 'N';
  };

  const title = (isCAAEnvironment() ?
    <FormattedMessage
      id="groupBenefitsPage.question.8uIL77"
      values={{
        span: (chunks) => (
          <span className="group-benefits-title-highlight">{chunks}</span>
        ),
        isJoint: hasPartnerApplication,
      }}
    /> : <FormattedMessage
      id="groupBenefitsPage.PM.question.kOSbko"
      values={{
        span: (chunks) => (
          <span className="group-benefits-title-highlight">{chunks}</span>
        ),
        isJoint: hasPartnerApplication,
      }}
    />
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer gap="1.5rem" fullHeight>
      <MaxWidthContainer width="lg">
        <Typography
          variant="h1"
          message={title}
          id="GroupBenefitsTitle"
        />
      </MaxWidthContainer>
      <MaxWidthContainer width="md">
        <Form
          onSubmit={() => onSubmit()}
          name="Group Benefits"
          segmentPayload={{
            name: title,
            product_type: productType,
          }}
        >
          <RadioGroup
            options={YES_NO_Y_N}
            value={getLosingBenefitsValue()}
            onChange={(e) => onLosingBenefitsSelection(e.target.value === 'Y')}
            name="lost_group_benefits"
            required
            orientation="horizontal"
            variant="outlined"
            data-cy="groupBenefits"
            labelledBy="GroupBenefitsTitle"
          />

          <Spacer size="spaceMedium" />

          <Alert
            type="tip"
            icon={<CalendarDaysIcon size="accordionLarge" />}
            text={<FormattedMessage
              id="groupBenefitsPage.chooseStartBeforeFinalizePolicy.9VrAtz"
              values={{
                b: chunks => <strong>{chunks}</strong>,
                i: chunks => <i>{chunks}</i>,
              }}
            />}
          />

          <Spacer size="spaceMedium" />

          <Button
            type="submit"
            name="submit_group_benefits"
            data-cy="group-benefits-submit"
            hidden={isMobile()}
            ref={buttonRef}
          >
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="global.next.Q0fXUP" />}
            />
          </Button>
        </Form>
        {/* <SecureFooter noRelative /> */}
      </MaxWidthContainer>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} />
  </>;
};

export default GroupBenefits;
