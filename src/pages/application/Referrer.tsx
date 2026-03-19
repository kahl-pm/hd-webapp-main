import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { segmentTrackEvent } from '@policyme/global-libjs-utils';

import {
  Button, Form, Input, isMobile, MaxWidthContainer, PageContainer, Select, Spacer, Typography,
} from '@policyme/global-libjs-designsystem';
import { nextQuestion, onComponentLoad } from '../../NewActions/session';
import { updateMetadata } from '../../NewActions/metadata';
import { getUserLeadSources, spreadStateFields } from '../../utils/helpers';
import { CRM_LIFE_SESSION_FIELDS, USER_LEAD_SOURCES_VALUES, USER_TYPES } from '../../utils/const';
import { getMainProduct } from '../../Selectors/helpers/productApp';
import { State } from '../../store/types/State';
import BottomNavigation from '../../components/BottomNavigation';

const Referrer = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const USER_LEAD_SOURCE_FIELDS = getUserLeadSources();

  const _props = useSelector((state: State) => spreadStateFields(state.metadata, [
    CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER,
    CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE,
  ]));

  const productType = useSelector((state: State) => getMainProduct(state, USER_TYPES.PRIMARY));
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <PageContainer fullHeight>
        <MaxWidthContainer width="xl">
          <Form
            onSubmit={() => {
              dispatch(nextQuestion());
            }}
            name="referrer_form"
            segmentPayload={{
              name: <FormattedMessage id="referrer.pageTitle.a9lVt7" />,
              product_type: productType,
            }}
          >
            <Typography
              variant="h1"
              message={<FormattedMessage id="referrer.pageTitle.a9lVt7" />}
              align="center"
            />
            <Spacer size="spaceMedium" />
            <Typography
              variant="h2"
              message={<FormattedMessage id="referrer.pageSubTitle.tvN1IZ" />}
              align="center"
            />
            <Spacer size="spaceXL" />
            <MaxWidthContainer width="md">
              <Select
                multiple={false}
                label={<FormattedMessage id="referrer.placeholder.YJGOB5" />}
                options={USER_LEAD_SOURCE_FIELDS}
                value={_props[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE]}
                onChange={(e) => {
                  const selectedSource = e?.value ?? '';
                  dispatch(updateMetadata(
                    CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE,
                    selectedSource,
                  ));
                  if (selectedSource) {
                    segmentTrackEvent(
                      'clicked',
                      {
                        object_name: selectedSource,
                        object_type: 'select',
                      } as any,
                    );
                  }
                }}
                name="referrer_source"
                dataCy="referrerSource"
                required
                requiredMessage={
                  <FormattedMessage id="referrer.requireMessage.gQpqkq" />
                }
                ariaLabel="referrer source"
                analyticsTrackSelection
              />
              {
                [USER_LEAD_SOURCES_VALUES.INFLUENCER.value,
                  USER_LEAD_SOURCES_VALUES.PODCAST_OR_RADIO.value,
                  USER_LEAD_SOURCES_VALUES.OTHER.value]
                  .includes(_props[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE]) &&
                (<>
                  <Spacer size="space2XS" />
                  <Input
                    label={intl.formatMessage({
                      id: 'referrer.pleaseSpecify.L6mBbC',
                    })}
                    value={_props[CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER]}
                    name="other_source"
                    onChange={(e) => dispatch(updateMetadata(
                      CRM_LIFE_SESSION_FIELDS.USER_LEAD_SOURCE_OTHER,
                      e,
                    ))}
                    required
                    requiredMessage={
                      <FormattedMessage id="referrer.enterASource.Nh2qrD" />
                    }
                    data-cy="referrerOther"
                  />
                </>)
              }
              <Spacer size="spaceMedium" />
              <Button name="referral_submit" type="submit" variant="primary" ref={buttonRef} dataCy="submit" hidden={isMobile()}>
                <Typography
                  message={<FormattedMessage id="global.next.Q0fXUP" />}
                  variant="CTALargePrimary"
                />
              </Button>
            </MaxWidthContainer>
            {/* <SecureFooter noRelative /> */}
          </Form>
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>
  );
};

export default Referrer;
