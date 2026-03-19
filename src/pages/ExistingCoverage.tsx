import {
  Typography,
  PageContainer,
  MaxWidthContainer,
  Spacer,
  Form,
  RadioGroup,
  Modal,
  Button,
  TextButton,
  CircleCheckIcon,
  isMobile,
  NativeList,
  IconListItem,
} from '@policyme/global-libjs-designsystem';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { handleExistingHdCoverage } from '../NewActions/handle';
import { onComponentLoad } from '../NewActions/session';
import { getCurrentUser, isJoint as isJointSelector } from '../Selectors/userControl';
import { EXISTING_HD_PLAN_OPTION, LEGACY_SEGMENT_EVENTS, PM_PRODUCT_PREFIX, SEGMENT_EVENTS, YES_NO_Y_N } from '../utils/const';
import { isQuebecHealthCardProvince } from '../Selectors/household';
import { TENANT_TEXT_KEYS } from '../tenant/consts';
import { getTenantBasedFormattedText, isPMEnvironment } from '../tenant/helpers';
import { sendSegmentTrackEvent } from '../NewActions/analytics';
import { State } from '../store/types/State';
import BottomNavigation from '../components/BottomNavigation';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';

// const PAGE_VIEW_EVENT = 'H&D - Existing H&D Plan Page View';
const PAGE_VIEW_EVENT_HD_QC_BLOCKER = 'H&D - QC Replacing Policy Blocker';

const OPTION_LIST = [
  {
    value: '0',
    text: <FormattedMessage id="hdExistingCoveragePage.manulifeFollowMe.20c13a" />,
    enum_value: EXISTING_HD_PLAN_OPTION.MANULIFE_FOLLOW_ME,
  },
  {
    value: '1',
    text: <FormattedMessage id="hdExistingCoveragePage.SureHealth.94c6d0" />,
    enum_value: EXISTING_HD_PLAN_OPTION.SURE_HEALTH_LINK,
  },
  {
    value: '2',
    text: <FormattedMessage id="hdExistingCoveragePage.SunLife.OQYP8h" />,
    enum_value: EXISTING_HD_PLAN_OPTION.SUN_LIFE,
  },
  {
    value: '3',
    text: <FormattedMessage id="hdExistingCoveragePage.CanadaLife.NosCXM" />,
    enum_value: EXISTING_HD_PLAN_OPTION.CANADA_LIFE,
  },
  {
    value: '4',
    text: <FormattedMessage id="hdExistingCoveragePage.BlueCross.mvMohC" />,
    enum_value: EXISTING_HD_PLAN_OPTION.BLUE_CROSS,
  },
  {
    value: '5',
    text: <FormattedMessage id="hdExistingCoveragePage.EmpireLife.i7IT2r" />,
    enum_value: EXISTING_HD_PLAN_OPTION.EMPIRE,
  },
  {
    value: '6',
    text: <FormattedMessage id="hdExistingCoveragePage.CAA.IEgZSv" />,
    enum_value: EXISTING_HD_PLAN_OPTION.CAA,
  },
  {
    value: '7',
    text: <FormattedMessage id="hdExistingCoveragePage.PolicyMe.aNEh9X" />,
    enum_value: EXISTING_HD_PLAN_OPTION.POLICYME,
  },
  {
    value: '8',
    text: <FormattedMessage id="hdExistingCoveragePage.employeeBenefits.b5b670" />,
    enum_value: EXISTING_HD_PLAN_OPTION.EMPLOYEE_BENEFITS,
  },
  {
    value: '9',
    text: <FormattedMessage id="hdExistingCoveragePage.collegeBenefits.0354cf" />,
    enum_value: EXISTING_HD_PLAN_OPTION.COLLEGE_BENEFITS,
  },
  {
    value: '10',
    text: <FormattedMessage id="hdExistingCoveragePage.other.7869a3" />,
    enum_value: EXISTING_HD_PLAN_OPTION.OTHER,
  },
  {
    value: '11',
    text: <FormattedMessage id="hdExistingCoveragePage.ImNotSure.cCLp6p" />,
    enum_value: EXISTING_HD_PLAN_OPTION.NOT_SURE,
  },
];

const getOptionValueFromEnum = (enumValue) => {
  if (!enumValue) {
    return null;
  }
  return OPTION_LIST.find(option => option.enum_value === enumValue).value;
};

const getHDExistingPlanOptions = () => {
  return OPTION_LIST;
};

const ExistingCoverage = () => {
  const existingPlanFlag = useSelector<State, boolean>(
    state => state.primary.hdSession.existing_hd_plan_flag,
  );
  const existingPlanOption = useSelector<State, string>(
    state => state.primary.hdSession.existing_hd_plan_option,
  );

  const isJoint = useSelector((state: State) => isJointSelector(state));
  const isFamilyInQuebecHealthCardProvince = useSelector(
    state => isQuebecHealthCardProvince(state),
  );
  const currentUser = useSelector((state: State) => getCurrentUser(state));

  const dispatch = useDispatch();
  const [options] = useState(getHDExistingPlanOptions());
  const [yesNoSelected, setYesNoSelected] = useState(existingPlanFlag ? 'Y' : existingPlanFlag === false ? 'N' : null);
  const [optionSelected, setOptionSelected] = useState(
    getOptionValueFromEnum(existingPlanOption),
  );
  const [showBlockerModal, setShowBlockerModal] = useState(false);

  const onOptionSelected = (e) => {
    setOptionSelected(e.target.value);
  };

  useEffect(() => {
    dispatch(onComponentLoad(() => {}));
  }, []);

  const onSubmit = async () => {
    const yesNoBool = yesNoSelected === 'Y';
    if (yesNoSelected && yesNoBool && isFamilyInQuebecHealthCardProvince) {
      setShowBlockerModal(true);
      return;
    }
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE,
        currentUser, PM_PRODUCT_PREFIX.HD));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.HD_EXISTING_COVERAGE_PAGE,
        currentUser, PM_PRODUCT_PREFIX.HD));
    }
    const existing_plan_option = !yesNoBool ?
      null : options[parseInt(optionSelected, 10)].enum_value;
    dispatch(handleExistingHdCoverage(yesNoBool, existing_plan_option));
  };

  const updateYesNoSelected = (event) => {
    const value = event.target.value;
    setYesNoSelected(value);
    if (value === 'Y' && isFamilyInQuebecHealthCardProvince) {
      dispatch(sendSegmentTrackEvent(PAGE_VIEW_EVENT_HD_QC_BLOCKER));
      setShowBlockerModal(true);
    }
  };

  const intl = useIntl();
  const supportEmail =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const supportPhoneNumber =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER);
  const supportPhoneNumberFormatted =
    getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);

  const showHDExistingPlanOptions = !isFamilyInQuebecHealthCardProvince
    && yesNoSelected
    && yesNoSelected === 'Y';

  const buttonRef = useRef<HTMLButtonElement>(null);
  const circleCheckIcon = () => <CircleCheckIcon variant={'tip'} fill={'orange'} size={'step'} />;

  return <>
    <PageContainer fullHeight>
      <MaxWidthContainer width="lg">
        <Typography
          variant="h1"
          message={<FormattedMessage
            id="hdExistingCoveragePage.header.clsp35"
            values={{
              isJoint,
            }}
          />}
          data-cy="existing_hd_cov_header"
        />
        <Spacer size="spaceXL" />
        <Typography
          variant="h2"
          message={<FormattedMessage id="hdExistingCoveragePage.subheading.p1j420" />}
        />
        <Spacer size="spaceMedium" />
        <NativeList gap="1rem">
          <IconListItem
            renderAs="li"
            icon={circleCheckIcon}
            message={<FormattedMessage
              id="hdExistingCoveragePage.modalBody.oWjFKM"
            />}
          />
          <IconListItem
            renderAs="li"
            icon={circleCheckIcon}
            message={<FormattedMessage
              id="hdExistingCoveragePage.modalBody.2iAdMz"
            />}
          />
        </NativeList>
        <Spacer size="spaceMedium" />
      </MaxWidthContainer>
      <MaxWidthContainer width="md">
        <Form
          onSubmit={onSubmit}
          name="determine_plans_form"
        >
          <RadioGroup
            options={YES_NO_Y_N}
            value={yesNoSelected}
            onChange={updateYesNoSelected}
            name="existing_hd_cov"
            required
            variant="outlined"
            orientation="horizontal"
            data-cy="existing_hd_cov"
            labelledBy="hdExistingCoveragePage.mainCopy.rsyQ1e"
          />

          {showHDExistingPlanOptions && <>
            <Spacer size="spaceXL" />
            <Typography
              variant="h2"
              id="hdExistingCoveragePage.subQuestion.gKmq9R"
              message={<FormattedMessage
                id="hdExistingCoveragePage.subQuestion.gKmq9R"
                values={{ isJoint }}
              />}
            />
            <Spacer size="spaceSmall" />
            <RadioGroup
              options={options}
              value={optionSelected}
              onChange={onOptionSelected}
              labelledBy="hdExistingCoveragePage.subQuestion.gKmq9R"
              name="what_matters_most_to_you"
              data-cy={`what-matters-most-to-you`}
              required
              orientation="vertical"
              variant="outlined"
            />
          </>}

          <Spacer size="spaceMedium" />

          <Button
            type="submit"
            name="group-benefits-submit"
            dataCy="group-benefits-submit"
            hidden={isMobile()}
            ref={buttonRef}
          >
            <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.next.Q0fXUP" />} />
          </Button>
        </Form>
      </MaxWidthContainer>
      <Modal
        name="qcBlocker"
        open={showBlockerModal}
        handleClose={() => setShowBlockerModal(false)}
        ariaDescribedBy="qcBlockerBody"
        ariaLabelledBy="qcBlockerHeader"
      >
        <MaxWidthContainer width="md" bgcolor="paper">
          <Typography id="qcBlockerHeader" variant="h2" message={<FormattedMessage id="hdExistingCoveragePage.blockerQCTitle.E3xbGQ" />} align="center" />
          <Spacer size="spaceMedium" />
          <Typography
            id="qcBlockerBody"
            variant="body2"
            message={<FormattedMessage
              id="hdExistingCoveragePage.blockerQCDescription.LvGpP4"
              values={{
                email: (
                  <TextButton
                    name="group-benefits-email"
                    dataCy="group-benefits-email"
                    label={<Typography variant="body2" message={supportEmail} component="span" />}
                    href={`mailto:${supportEmail}`}
                    fullWidth={false}
                    sx={{
                      textTransform: 'none',
                      display: 'inline',
                      verticalAlign: 'baseline',
                      letterSpacing: 0,
                    }}
                    value={supportEmail}
                  />
                ),
                phone: (
                  <TextButton
                    name="group-benefits-phonenumber"
                    dataCy="group-benefits-phonenumber"
                    label={<Typography variant="body2" message={supportPhoneNumberFormatted} component="span" />}
                    href={`tel:+:${supportPhoneNumber}`}
                    fullWidth={false}
                    value={supportPhoneNumberFormatted}
                    sx={{
                      display: 'inline',
                      verticalAlign: 'baseline',
                      letterSpacing: 0,
                    }}
                  />
                ),
              }}
            />}
          />
        </MaxWidthContainer>
      </Modal>
    </PageContainer>
    <BottomNavigation
      buttonRef={buttonRef}
      position="sticky"
    />
  </>;
};

export default ExistingCoverage;
