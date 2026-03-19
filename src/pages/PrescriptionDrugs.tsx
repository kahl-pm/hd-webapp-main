import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Typography, RadioGroup, Checkbox, Button, MaxWidthContainer, PageContainer, UniformSpacingLayout, Spacer, Form, StyledUnorderedList } from '@policyme/global-libjs-designsystem';
import { onComponentLoad } from '../NewActions/session';
import { handleNeedsPrescriptionDrugs } from '../NewActions/handle';
import { PRESCRIPTION_DRUG_FLAG, PM_PRODUCT_PREFIX } from '../utils/const';
import { State } from '../store/types/State';

const YES_NO_Y_N = [
  { value: 'Y', text: <FormattedMessage id="global.yes.JVS0d0" /> },
  { value: 'N', text: <FormattedMessage id="global.no.nlGQVZ" /> },
];

type PrescriptionDrugsProps = {
  hasPartnerApplication: boolean;
  prescription_drug_flag: PrescriptionDrugFlag;
};

type PrescriptionDrugFlag = typeof PRESCRIPTION_DRUG_FLAG[keyof typeof PRESCRIPTION_DRUG_FLAG];

const checkboxesToAnswerFlag = (primaryCheck: boolean,
  secondaryCheck: boolean): PrescriptionDrugFlag => {
  if (primaryCheck && secondaryCheck) {
    return PRESCRIPTION_DRUG_FLAG.BOTH;
  }
  if (primaryCheck) {
    return PRESCRIPTION_DRUG_FLAG.PRIMARY_ONLY;
  }
  if (secondaryCheck) {
    return PRESCRIPTION_DRUG_FLAG.SECONDARY_ONLY;
  }
  return PRESCRIPTION_DRUG_FLAG.NEITHER;
};

const PrescriptionDrugs = () => {
  const _state = useSelector<State, State>((state) => state);
  const props: PrescriptionDrugsProps = {
    hasPartnerApplication: _state.userControl.hasPartnerApplication,
    prescription_drug_flag: _state.primary.hdSession.prescription_drug_flag,
  };

  const dispatch = useDispatch();

  const flagStartingVal = props.prescription_drug_flag ?
    (props.prescription_drug_flag === PRESCRIPTION_DRUG_FLAG.NEITHER ? 'N' : 'Y') : null;

  const [buttonValue, setButtonValue] = useState(flagStartingVal);
  const [primarySelected, setPrimarySelected] = useState(
    [PRESCRIPTION_DRUG_FLAG.PRIMARY_ONLY,
      PRESCRIPTION_DRUG_FLAG.BOTH].some((flag) => flag === props.prescription_drug_flag),
  );
  const [secondarySelected, setSecondarySelected] = useState(
    [PRESCRIPTION_DRUG_FLAG.SECONDARY_ONLY,
      PRESCRIPTION_DRUG_FLAG.BOTH].some((flag) => flag === props.prescription_drug_flag),
  );

  useEffect(() => {
    dispatch(onComponentLoad(() => { }));
  }, []);

  const handleButtonClick = (event: string) => {
    setButtonValue(event);
    if (!props.hasPartnerApplication && event === 'Y') {
      // set both to true so the flag gets the right value,
      // since we dont show the checkboxes for singel
      setPrimarySelected(true);
      setSecondarySelected(true);
    }
    if (event === 'N') {
      // set both to true so the flag gets the right value,
      // since we dont show the checkboxes for singel
      setPrimarySelected(false);
      setSecondarySelected(false);
    }
  };

  const onSubmit = (primaryCheck: boolean, secondaryCheck: boolean): void => {
    const flag = checkboxesToAnswerFlag(primaryCheck, secondaryCheck);
    dispatch(handleNeedsPrescriptionDrugs(flag));
  };

  const title = (
    <FormattedMessage
      id="prescriptionDrugs.header.YwSqjD"
      values={{
        span: (chunks) => (
          <span className="light-blue-header-section">{chunks}</span>
        ),
        isJoint: props.hasPartnerApplication,
      }}
    />
  );

  return (
    <PageContainer gap="1.5rem">
      <Typography
        variant="h1"
        message={title}
      />
      <Typography
        variant="h3"
        message={<FormattedMessage
          id="prescriptionDrugs.excludeAny.1l0g88"
        />}
        component="h2"
      />

      <MaxWidthContainer width="md">
        <StyledUnorderedList>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.BirthControl.xW0gh9" />}
            />
          </li>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.quittingSmoking.0mrcix" />}
            />
          </li>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.erectileDysfunction.CVdhgi" />}
            />
          </li>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.ivfTreatment.k4xjp7" />}
            />
          </li>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.weightLossTreatments.8BN0jU" />}
            />
          </li>
          <li>
            <Typography
              align="left"
              variant="body2"
              message={<FormattedMessage id="prescriptionDrugs.shortTermTreatments.kNyvu8" />}
              id="prescriptionDrugs.shortTermTreatments.kNyvu8"
            />
          </li>
        </StyledUnorderedList>
        <Spacer size="spaceMedium" />
        <Form
          onSubmit={() => {
            onSubmit(primarySelected, secondarySelected);
          }}
          name="Prescription Drugs"
          segmentPayload={{
            name: title,
            product_type: PM_PRODUCT_PREFIX.HD,
          }}
        >
          <RadioGroup
            variant="outlined"
            options={YES_NO_Y_N}
            value={buttonValue}
            onChange={(e) => handleButtonClick(e.target.value)}
            name="prescriptionDrugs"
            labelledBy="prescriptionDrugs.shortTermTreatments.kNyvu8"
            required
            orientation="horizontal"
            data-cy="prescriptionDrugs"
          />
          <Spacer size="spaceXL" />
          {
            (buttonValue === 'Y' && props.hasPartnerApplication) &&
            <UniformSpacingLayout gap="1rem" flexDirection="column">
              <Typography
                variant="h3"
                message={<FormattedMessage
                  id="prescriptionDrugs.whoApplies.G7b7iB"
                  values={{
                    span: chunks => <span className="light-blue-header-section">{chunks}</span>,
                    isJoint: props.hasPartnerApplication,
                  }}
                />}
              />
              <UniformSpacingLayout
                flexDirection="row"
                gap="0.5rem"
              >
                <Checkbox
                  variant="outlined"
                  name="defaultAddress"
                  label={<FormattedMessage id="global.you.8d4U9b" />}
                  onChange={(e) => { setPrimarySelected(!!e.target.value); }}
                />
                <Checkbox
                  variant="outlined"
                  name="defaultAddress"
                  label={<span style={{ textWrap: 'nowrap' }}>
                    <FormattedMessage id="global.yourPartner.JXFy4p" />
                  </span>}
                  onChange={(e) => { setSecondarySelected(!!e.target.value); }}
                />
              </UniformSpacingLayout>
            </UniformSpacingLayout>
          }
          <Spacer size="spaceMedium" />
          <Button
            name="prescriptionDrugs"
            type="submit"
            data-cy="prescription-drugs-submit"
          >
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="global.next.Q0fXUP" />}
            />
          </Button>
        </Form>
      </MaxWidthContainer>
    </PageContainer>
  );
};

export default PrescriptionDrugs;
