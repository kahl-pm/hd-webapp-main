import {
  Button,
  Form,
  Input,
  isMobile,
  Link,
  MaxWidthContainer,
  PageContainer,
  RadioGroup,
  Spacer,
  Tooltip,
  Typography,
  UniformSpacingLayout,
} from '@policyme/global-libjs-designsystem';
import React, { useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { LOCALE } from '@policyme/global-libjs-utils';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { USER_TYPES, YES_NO_Y_N } from '../../utils/const';
import BottomNavigation from '../../components/BottomNavigation';
import { nextQuestion } from '../../NewActions/session';
import { updateAirMilesMetadata, handleUpdateAirmilesNumber } from '../../NewActions/metadata';
import { State } from '../../store/types/State';
import { isValidAirMilesNumber } from '../../utils/airmilesNumberValidator';

const AIRMILES_JOIN_URL = {
  [LOCALE.FR_CA]: 'airmiles.ca/fr/adherer',
  [LOCALE.EN_CA]: 'airmiles.ca/join',
} as const;

const AirmilesNumber: React.FC = () => {
  const dispatch = useDispatch();
  const airmiles = useSelector((state: State) => state.metadata.airmiles);

  const [optionSelected, setOptionSelected] = useState(airmiles?.optionSelected || '');
  const [airmilesNumber, setAirmilesNumber] = useState(airmiles?.number || '');
  const [error, setError] = useState<boolean>(false);

  const userType = USER_TYPES.PRIMARY;
  const mainProduct = useSelector((state) => getMainProduct(state, userType));

  const intl = useIntl();

  const airmilesJoinUrl = AIRMILES_JOIN_URL[intl.locale];

  const onSubmit = async () => {
    if (optionSelected === 'Y') {
      if (!airmilesNumber || !isValidAirMilesNumber(airmilesNumber)) {
        setError(true);
        return;
      }
      await dispatch(handleUpdateAirmilesNumber(userType));
    }
    dispatch(nextQuestion());
  };

  const handleOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: 'Y' | 'N',
  ) => {
    setOptionSelected(value);
    dispatch(
      updateAirMilesMetadata(
        value,
        value === 'Y' ? airmilesNumber : '',
      ),
    );
  };

  const handleAirmilesNumberChange = (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setAirmilesNumber(value);
    setError(false);
    if (optionSelected === 'Y') {
      dispatch(updateAirMilesMetadata(optionSelected, value));
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageContainer fullHeight>
        <Form
          onSubmit={onSubmit}
          name="Airmiles Number Form"
          segmentPayload={{
            name: 'Airmiles Number Collection',
            product_type: mainProduct,
          }}
        >
          <MaxWidthContainer width="md">
            <Typography
              variant="h1"
              message={
                <FormattedMessage
                  id="airmilesNumber.question.hfrm3S"
                  values={{ nonBreakingSpace: <>&nbsp;</> }}
                />
              }
              align="center"
              id="airmilesNumberYesNoQuestion"
            />
            <Spacer size="spaceLarge" />
            <RadioGroup
              labelledBy="airmilesNumberYesNoQuestion"
              options={YES_NO_Y_N}
              value={optionSelected}
              onChange={handleOptionChange}
              name="airmiles_number"
              required
              orientation="horizontal"
              data-cy="airmilesNumber"
              variant="outlined"
            />
            {optionSelected === 'Y' && (
              <>
                <Spacer size="spaceMedium" />
                <UniformSpacingLayout
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    variant="h2"
                    message={
                      <FormattedMessage
                        id="airmilesNumber.collectorNumber.0LsVgy"
                        values={{ nonBreakingSpace: <>&nbsp;</> }}
                      />
                    }
                  />
                  <Tooltip
                    variant="icon-only"
                    tooltipButtonName="airmilesNumberInfo"
                    ariaDescribedBy="airmiles-number-description"
                    ariaLabelledBy="airmiles-number-heading"
                    tooltipHeader={
                      <FormattedMessage
                        id="airmilesNumber.collectorNumber.question.Hna50P"
                        values={{ nonBreakingSpace: <>&nbsp;</> }}
                      />
                    }
                  >
                    <Typography
                      variant="body1"
                      message={
                        <FormattedMessage
                          id="airmilesNumber.tooltipContent.lQ26Yu"
                          values={{ nonBreakingSpace: <>&nbsp;</> }}
                        />
                      }
                    />
                  </Tooltip>
                </UniformSpacingLayout>
                <Spacer size="spaceMedium" />
                <Input
                  name="airmilesNumber"
                  data-cy="airmilesNumber"
                  value={airmilesNumber}
                  onChange={handleAirmilesNumberChange}
                  required
                  error={error}
                  errorMessage={
                    <FormattedMessage
                      id="airmilesNumber.errorMessage.QKNl5I"
                      values={{ nonBreakingSpace: <>&nbsp;</> }}
                    />
                  }
                  label={intl.formatMessage({
                    id: 'airmilesNumber.inputLabel.xHNwHw',
                  })}
                />
              </>
            )}
            <Spacer size="spaceSmall" />
            <Button
              variant="primary"
              type="submit"
              name="Next Button"
              dataCy="submit"
              hidden={isMobile()}
              ref={buttonRef}
            >
              <Typography
                variant="CTALargePrimary"
                align="center"
                color="white"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
            <Spacer size="spaceLarge" />
            <Typography
              variant="body2"
              align="left"
              message={
                <FormattedMessage
                  id="airmilesNumber.helperText.bhvIJV"
                  values={{
                    link: <Link href={`https://${airmilesJoinUrl}`} target="_blank" rel="noreferrer" label={airmilesJoinUrl} />,
                  }}
                />
              }
            />
            <Typography
              variant="body2"
              align="left"
              message={
                <FormattedMessage
                  id="airmilesNumber.helperText2.56Uprv"
                  values={{ nonBreakingSpace: <>&nbsp;</> }}
                />
              }
            />
            <Typography
              variant="body2"
              align="left"
              message={
                <FormattedMessage id="airmilesNumber.helperText3.f9jUdI" />
              }
            />
          </MaxWidthContainer>
        </Form>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default AirmilesNumber;
