import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { PageContainer, Typography, Tooltip, Alert, AwardIcon, Form, DatePicker, Button, MaxWidthContainer, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { nextQuestion, onComponentLoad } from '../../NewActions/session';

import { handleEffectiveDate } from '../../NewActions/handle';
import { getCurrentUser } from '../../Selectors/userControl';
import { PM_PRODUCT_PREFIX } from '../../utils/const';
import { State } from '../../store/types/State';

const tooltipModalContent = <Typography
  variant="body1"
  component="div"
  message={<FormattedMessage
    id="effectiveDatePage.tooltipModal.content.8uIL77"
    values={{
      p: chunks => <Typography variant="body1" message={chunks} />,
      b: chunks => <strong>{chunks}</strong>,
      ul: chunks => <Typography variant="body1" message={chunks} component="ul" my="1rem" pl="1rem" />,
      li: chunks => <Typography variant="body1" message={chunks} component="li" />,
      br: null,
    }}
  />}
/>;

const EffectiveDate = () => {
  const [showSameDayDisclaimer, setShowSameDayDisclaimer] = useState(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const currentUser = useSelector(getCurrentUser);
  const applicationLanguage = useSelector(
    (state) => state[currentUser].household.application_language,
  );
  const hdEffectiveDate = useSelector(
    (state: State) => state.primary.hdPolicy.effective_date,
  );

  const onEffectiveDateChange = (effectiveDate) => {
    const formattedDate = `${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}/${new Date().getFullYear()}`;
    const isSameDay = effectiveDate?.formattedDate === formattedDate;
    setShowSameDayDisclaimer(isSameDay);
    dispatch(handleEffectiveDate(effectiveDate));
  };

  return <>
    <PageContainer hasFixedBanner>
      <MaxWidthContainer width="lg">
        <Typography
          variant="h1"
          message={<FormattedMessage id="effectiveDatePage.question.8uIL77" />}
          tooltip={<Tooltip variant="icon-only" tooltipButtonName="More information about coverage start date" ariaLabelledBy="coverageStartHeading" ariaDescribedBy="coverageStartDescription" tooltipHeader={<FormattedMessage id="effectiveDatePage.question.8uIL77" />}>{tooltipModalContent}</Tooltip>}
          mb="1.5rem"
        />
        <MaxWidthContainer width="md">
          <Form
            onSubmit={() => {
              dispatch(nextQuestion());
            }}
            name="Effective Date"
            segmentPayload={{
              name: <FormattedMessage id="effectiveDatePage.tooltipModal.content.8uIL77" />,
              product_type: PM_PRODUCT_PREFIX.HD,
            }}
          >
            <UniformSpacingLayout flexDirection="column" gap="1.5rem">
              <DatePicker
                label={intl.formatMessage({ id: 'hdCheckout.effectiveDateHeader.8l8r6R' })}
                ariaLabel={intl.formatMessage({ id: 'hdCheckout.effectiveDateHeader.8l8r6R' })}
                locale={applicationLanguage}
                disablePast
                disableWeekends
                required
                maxDaysInFuture={90}
                value={hdEffectiveDate?.date.toString()}
                onChange={onEffectiveDateChange}
              />
              {showSameDayDisclaimer && <Alert type="tip" icon={<AwardIcon />} text={<FormattedMessage id="effectiveDatePage.sameDayDisclaimer.kh2H9K" />} />}
              <Button name="Submit" type="submit" dataCy="group-benefits-submit">
                <FormattedMessage id="global.next.Q0fXUP" />
              </Button>
            </UniformSpacingLayout>
          </Form>
        </MaxWidthContainer>
      </MaxWidthContainer>
    </PageContainer>
  </>;
};

export default EffectiveDate;
