import {
  Button,
  CircleAlertIcon,
  Form,
  isMobile,
  MaxWidthContainer,
  Modal,
  PageContainer,
  RadioGroup,
  Spacer,
  TextButton,
  Typography,
  UniformSpacingLayout,
  Link,
  NativeList,
  IconListItem,
  CircleCheckIcon,
} from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from '@mui/material';
import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { COVERAGE_FIT_OPTIONS, LEGACY_SEGMENT_EVENTS, SEGMENT_EVENTS } from '../utils/const';
import { handleCoverageFitResponse } from '../NewActions/handle';
import BottomNavigation from '../components/BottomNavigation';
import { sendSegmentTrackEvent } from '../NewActions/analytics';
import { State } from '../store/types/State';
import { getCraEligibilityLink, getCoverageFitOptionsFromState } from '../utils/helpers';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';
import { isPMEnvironment } from '../tenant/helpers';

const circleCheckIcon = () => <CircleCheckIcon variant={'tip'} fill={'orange'} size={'step'} />;

const CoverageFitQuestion = () => {
  const [showModal, setShowModal] = useState(false);
  const coverageFitFlag = useSelector<any, string>(
    state => state.primary.hdSession.coverage_fit_flag,
  );
  const dispatch = useDispatch();
  const [coverageFitResponse, setCoverageFitResponse] = useState(coverageFitFlag);
  // const mobileBreakpoint = theme.breakpoints.values.sm;
  const mobileBreakpoint = useMediaQuery('(min-width:36rem)');
  const options = useSelector(getCoverageFitOptionsFromState);
  const shouldShowCDCP = options.some(
    (option) => option.value === COVERAGE_FIT_OPTIONS.DENTAL_COVERAGE_NOT_NEEDED,
  );
  const craEligibilityLink = getCraEligibilityLink(
    useSelector<State, string>((state) => state.primary.household.application_language),
  );

  useEffect(() => {
    dispatch(onComponentLoad(() => {}));
  }, []);

  const onCoverageFitOptionSelection = (value) => {
    setCoverageFitResponse(value);
    dispatch(handleCoverageFitResponse(value));
  };

  const onSubmit = async () => {
    await dispatch(handleCoverageFitResponse(coverageFitResponse));
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.COVERAGE_FIT_QUESTION_PAGE));
    }
    dispatch(nextQuestion());
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageContainer gap="1.5rem" fullHeight>
        <MaxWidthContainer width="lg">
          <Typography
            variant="h1"
            message={<FormattedMessage id="coverageFitsPage.question.gt6uy5" />}
          />
        </MaxWidthContainer>

        <MaxWidthContainer width="md">
          <Typography
            variant="body1"
            message={<FormattedMessage id="coverageFitsPage.subtitle.D9Viy8" />}
          />

          <Spacer size="spaceMedium" />

          <Form
            onSubmit={() => {
              onSubmit();
            }}
            name="Coverage Fit Question"
          >
            <RadioGroup
              options={options}
              name="coverage_fit_options"
              labelledBy="Coverage Fit Options"
              required
              onChange={(e) => {
                onCoverageFitOptionSelection(e.target.value);
              }}
              orientation="vertical"
              variant="outlined"
              value={coverageFitResponse}
              data-cy="cov_fit_options"
            />

            <Spacer size="spaceMedium" />

            {shouldShowCDCP && (
            <UniformSpacingLayout>
              <TextButton
                label={
                  <UniformSpacingLayout gap="0.5rem" alignItems="center">
                    <Typography
                      variant="body1Bold"
                      message={<FormattedMessage id="coverageFitsPage.cta.cdcp.SsemRm" />}
                    />

                    <CircleAlertIcon
                      variant="interactive"
                      size={'step'}
                    />
                  </UniformSpacingLayout>
                }
                onClick={() => setShowModal(true)}
                name="cdcp_cta"
                data-cy="cdcp_modal_link"
              />
            </UniformSpacingLayout>
            )}

            <Spacer size="spaceMedium" />

            <Button
              type="submit"
              name="submit_coverage_fit"
              data-cy="coverage-fit-submit"
              hidden={isMobile()}
              ref={buttonRef}
            >
              <Typography
                variant="CTALargePrimary"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
          </Form>
        </MaxWidthContainer>
        <Modal
          name="hdCDCP"
          open={showModal}
          handleClose={() => setShowModal(false)}
          ariaDescribedBy="hdCDCPBody-desc hdCDCPBodyWhyHeader hdCDCPBodyWhy-desc"
          ariaLabelledBy="hdCDCPHeader"
        >
          <MaxWidthContainer width="md" bgcolor="paper">
            <Typography
              variant="h2"
              message={<FormattedMessage id="hdCDCP.modalHeader.fuGBRC" />}
              align="center"
              id="hdCDCPHeader"
            />
            <Spacer size="spaceMedium" />
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="hdCDCP.modalBody.ymKg5v"
                  values={{
                    b: (chunks) => <strong>{chunks}</strong>,
                  }}
                />
              }
              id="hdCDCPBody-desc"
            />
            <Spacer size="spaceMedium" />
            <NativeList paddingInlineStart="0rem" gap="0.5rem">
              <IconListItem
                icon={circleCheckIcon}
                renderAs="li"
                message={
                  <FormattedMessage id="hdCDCP.cdcpEligibility.7GEIGg" />
                }
              />
              <IconListItem
                icon={circleCheckIcon}
                renderAs="li"
                message={
                  <FormattedMessage id="hdCDCP.cdcpEligibility.mRK1lM" />
                }
              />
              <IconListItem
                icon={circleCheckIcon}
                renderAs="li"
                message={
                  <FormattedMessage id="hdCDCP.cdcpEligibility.lmpF0S" />
                }
              />
            </NativeList>
            <Spacer size="spaceMedium" />
            <Typography
              variant="h3"
              message={<FormattedMessage id="hdCDCP.modalBody.2Y9V6c" />}
              id="hdCDCPBodyWhyHeader"
            />
            <Spacer size="spaceMedium" />
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="hdCDCP.modalBody.sgbJdJ"
                  values={{
                    a: chunks => <strong><Link
                      href={craEligibilityLink}
                      label={chunks}
                    /></strong>,
                  }}
                />
              }
              id="hdCDCPBodyWhy-desc"
            />
          </MaxWidthContainer>
        </Modal>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} />
    </>
  );
};

export default CoverageFitQuestion;
