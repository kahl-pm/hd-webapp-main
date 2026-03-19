import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  Button, CheckboxGroup, Form, MaxWidthContainer, PageContainer,
  Spacer, Typography, UniformSpacingLayout, isMobile,
} from '@policyme/global-libjs-designsystem';
import { State } from '../store/types/State';

import { onComponentLoad } from '../NewActions/session';
import { handleInterestNextSteps } from '../NewActions/handle';
import { PM_PRODUCT_PREFIX } from '../utils/const';
import BottomNavigation from '../components/BottomNavigation';

const OTHER_PRODUCTS_VALUES = {
  TERM: 'Term Life Insurance',
  CRITICAL: 'Critical Illness Insurance',
  HEALTH_AND_DENTAL: 'Health and Dental Insurance',
  PERMANENT: 'Permanent Insurance',
  DISABILITY: 'Disability Insurance',
  TRAVEL: 'Travel Insurance',
  HOME: 'Home Insurance',
  AUTO: 'Auto Insurance',
  NONE: 'None of the above',
};

const choices = [
  {
    text: <FormattedMessage
      id="global.titleLife.0bnKLr"
      values={{ isPermanent: false }}
    />,
    value: OTHER_PRODUCTS_VALUES.TERM,
    dataCy: 'term',
  },
  {
    text: <FormattedMessage
      id="intent.homeInsurance.vXGzl0"
    />,
    value: OTHER_PRODUCTS_VALUES.HOME,
    dataCy: 'home',
  },
  {
    text: <FormattedMessage
      id="intent.autoInsurance.z43Flu"
    />,
    value: OTHER_PRODUCTS_VALUES.AUTO,
    dataCy: 'auto',
  },
  {
    text: <FormattedMessage
      id="interest.critialIllnessInsurance.I1fmnM"
    />,
    value: OTHER_PRODUCTS_VALUES.CRITICAL,
    dataCy: 'critical',
  },
  {
    text: <FormattedMessage
      id="interest.healthAndDentalInsurance.zlDGSN"
    />,
    value: OTHER_PRODUCTS_VALUES.HEALTH_AND_DENTAL,
    dataCy: 'h&d',
  },
  {
    text: <FormattedMessage
      id="interest.permanentInsurance.ooqlbZ"
    />,
    value: OTHER_PRODUCTS_VALUES.PERMANENT,
    dataCy: 'permanent',
  },
  {
    text: <FormattedMessage
      id="interest.disabilityInsurance.Tfpqxn"
    />,
    value: OTHER_PRODUCTS_VALUES.DISABILITY,
    dataCy: 'disability',
  },
  {
    text: <FormattedMessage
      id="interest.travelInsurance.Qg6ZHy"
    />,
    value: OTHER_PRODUCTS_VALUES.TRAVEL,
    dataCy: 'travel',
  },
  {
    text: <FormattedMessage
      id="interest.noneOfTheAbove.IZnTX4"
    />,
    value: OTHER_PRODUCTS_VALUES.NONE,
    dataCy: 'none',
  },
];

const Referrer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const initInterests = useSelector((state: State) => {
    const prevInterest = state.metadata.productInterest;
    return prevInterest ? prevInterest.split(';') : [];
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [interest, setInterest] = useState(initInterests);

  // HD-only webapp: filter out Health and Dental since that's the current product
  const filteredChoices = choices.filter(x => x.value !== OTHER_PRODUCTS_VALUES.HEALTH_AND_DENTAL);

  const onInterestChange = (selectedChoices) => {
    if (selectedChoices.includes('None of the above')) {
      // If 'None of the above' is selected, remove all other selections
      if (!interest.includes('None of the above')) {
        setInterest(['None of the above']);
      } else {
        // If 'None of the above' is already selected and user selects something else, remove it
        setInterest(selectedChoices.filter(choice => choice !== 'None of the above'));
      }
    } else {
      // If 'None of the above' is not selected, simply update the selected choices
      setInterest(selectedChoices);
    }
  };

  const multiChoiceOptions = filteredChoices.map((choice) => {
    return {
      value: choice.value,
      text: choice.text,
      name: choice.value,
      dataCy: `user-interest-${choice.dataCy}`,
      checkboxName: choice.value,
    };
  });

  return (
    <>
      <PageContainer fullHeight>
        <Form
          onSubmit={() => {
            dispatch(handleInterestNextSteps(interest));
          }}
          name="interest_form"
        >
          <UniformSpacingLayout flexDirection="column" gap="2rem">
            <Typography
              variant="h1"
              message={<FormattedMessage
                id="referrer.pageTitleOtherProducts.a9lVt7"
              />}
              id="referrer.pageTitleOtherProducts.a9lVt7"
            />
            <Typography
              variant="h2"
              message={<FormattedMessage
                id="referrer.pageTitleOtherProductsSubheading.d62Nv3"
              />}
              component="p"
            />
            <MaxWidthContainer width="md">
              <CheckboxGroup
                ariaDescribedBy="referrer.pageTitleOtherProductsSubheading.d62Nv3"
                ariaLabelledBy="referrer.pageTitleOtherProducts.a9lVt7"
                name="other-insurance-products"
                options={multiChoiceOptions}
                errorMessage={<FormattedMessage id="disclosure.selectOption.IatNRZ" />}
                onChange={onInterestChange}
                selectedValues={interest}
                variant="outlined"
                required
              />
              <Spacer size="spaceLarge" />
              <Button variant="primary" type="submit" name="Next Button" dataCy="submit" ref={buttonRef} hidden={isMobile()}>
                <Typography
                  variant="CTALargePrimary"
                  message={<FormattedMessage id="global.next.Q0fXUP" />}
                />
              </Button>
              {/* <SecureFooter noRelative /> */}
            </MaxWidthContainer>
          </UniformSpacingLayout>
        </Form>
      </PageContainer>
      <BottomNavigation
        buttonRef={buttonRef}
        position="sticky"
      />
    </>
  );
};

export default Referrer;
