import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Button, RadioGroup, Typography, Form, PageContainer, MaxWidthContainer, Spacer, isMobile } from '@policyme/global-libjs-designsystem';
import { handleCoverPrescriptions } from '../NewActions/handle';
import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { PRESCRIPTION_DRUG_FLAG, WHAT_MATTERS_MOST_TO_YOU_OPTIONS } from '../utils/const';
import { State } from '../store/types/State';
import BottomNavigation from '../components/BottomNavigation';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

const CoverPrescriptions = () => {
  const dispatch = useDispatch();
  const prescriptionDrugFlag = useSelector(
    (state: State) => state.primary.hdSession.prescription_drug_flag,
  );
  const takesPrecriptions = prescriptionDrugFlag !== PRESCRIPTION_DRUG_FLAG.NEITHER;
  const hasPartnerApplication = useSelector(
    (state: State) => state.userControl.hasPartnerApplication,
  );

  const [buttonValue, setButtonValue] = useState(null);

  const onSubmit = async () => {
    dispatch(nextQuestion());
  };

  useEffect(() => {
    dispatch(onComponentLoad(() => { }));
  }, []);

  const onButtonClick = (event) => {
    const val = event.target.value;
    setButtonValue(val);
    const flagValue = val === 'Y' ?
      WHAT_MATTERS_MOST_TO_YOU_OPTIONS.COVER_FUTURE_MEDICATION :
      WHAT_MATTERS_MOST_TO_YOU_OPTIONS.NO_NEED_COVER_MEDICATION_COVERAGE;
    dispatch(handleCoverPrescriptions(flagValue));
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer gap="1.5rem">
      <MaxWidthContainer width="lg">
        <Typography
          variant="h1"
          message={<FormattedMessage
            id="hdPrescriptionDrugCoveragePage.header.mhvdc7"
          />}
          align="center"
          id="hdPrescriptionDrugCoveragePage.header.mhvdc7"
        />
        {!takesPrecriptions && <>
          <Spacer size="spaceMedium" />
          <Typography
            variant="body2"
            message={<FormattedMessage
              id="hdPrescriptionDrugCoveragePage.subtext.d5d38e"
              values={{
                isJoint: hasPartnerApplication,
              }}
            />}
            align="center"
          />
        </>}
      </MaxWidthContainer>
      <MaxWidthContainer width="md">
        <Form
          onSubmit={() => onSubmit()}
          name="Cover Prescription"
        >
          <RadioGroup
            options={YES_NO_Y_N}
            value={buttonValue}
            onChange={onButtonClick}
            name="want_prescription_coverage"
            required
            variant="outlined"
            orientation="horizontal"
            data-cy="want_prescription_coverage"
            labelledBy="hdPrescriptionDrugCoveragePage.header.mhvdc7"
          />
          <Spacer size="spaceMedium" />
          <Button
            type="submit"
            dataCy="cover-prescription-submit"
            name="SubmitCoverPrescriptions"
            variant="primary"
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

export default CoverPrescriptions;
