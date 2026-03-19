import { Button, Form, isMobile, MaxWidthContainer, PageContainer, RadioGroup, Typography } from '@policyme/global-libjs-designsystem';
import React, { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { handleFamilyCompositionResponse } from '../NewActions/handle';
import { nextQuestion, onComponentLoad } from '../NewActions/session';
import { getMainProduct } from '../Selectors/helpers/productApp';
import BottomNavigation from '../components/BottomNavigation';
import { State } from '../store/types/State';
import { FAMILY_COMPOSITION_OPTIONS, LEGACY_SEGMENT_EVENTS, SEGMENT_EVENTS } from '../utils/const';
import { sendSegmentTrackEvent } from '../NewActions/analytics';
import { sendSegmentTrackEventLegacy } from '../NewActions/legacyAnalytics';
import { isPMEnvironment } from '../tenant/helpers';

const FamilyCompositionPage = () => {
  const dispatch = useDispatch();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const familyCompositionOptions = FAMILY_COMPOSITION_OPTIONS;
  const userType = useSelector((state: State) => state.metadata.currentUser);
  const mainProduct = useSelector((state: State) => getMainProduct(state, userType));
  const currentFamilyComposition = useSelector((state: State) => state[userType][`${mainProduct}Session`].family_composition_flag);

  const onFamilyCompositionOptionSelection = (value: string) => {
    dispatch(handleFamilyCompositionResponse(value));
  };

  const onSubmit = async () => {
    dispatch(nextQuestion());
  };

  useEffect(() => {
    dispatch(onComponentLoad());
    if (isPMEnvironment()) {
      dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.HD_FAMILY_COMPOSITION_QUESTION_PAGE));
    } else {
      dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.HD_FAMILY_COMPOSITION_QUESTION_PAGE));
    }
  }, []);
  
  return (
    <>
      <PageContainer gap="1.5rem" fullHeight>
        <MaxWidthContainer width="lg">
          <Typography
            variant="h1"
            message={<FormattedMessage id="family.header.OqqhgS" />}
          />
        </MaxWidthContainer>

        <MaxWidthContainer width="lg">
          <Typography
            variant="h2"
            message={<FormattedMessage id="family.subheading.uO4nwe" />}
          />
        </MaxWidthContainer>

        <MaxWidthContainer width="md">
          <Form
            onSubmit={onSubmit}
            name="Family Composition Question"
          >
            <RadioGroup
              options={familyCompositionOptions}
              name="family_composition_options"
              labelledBy="Family Composition Options"
              required
              onChange={(e) => {
                onFamilyCompositionOptionSelection(e.target.value);
              }}
              orientation="vertical"
              variant="outlined"
              value={currentFamilyComposition}
              data-cy="family_composition_options"
            />

            <Button
              type="submit"
              name="submit_family_composition"
              data-cy="family-composition-submit"
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
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default FamilyCompositionPage;
