/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Form, MaxWidthContainer, PageContainer, Typography, Modal, Input, Button, Select,
  Spacer, Link,
  isMobile,
} from '@policyme/global-libjs-designsystem';
import { hasFlag, getUrls, TENANT_FLAGS } from '@policyme/global-libjs-utils';

import { onComponentLoad } from '../../NewActions/session';
import { updateHouseholdPropPrimary, updateHouseholdPropSecondary } from '../../NewActions/household';

import { handleSubmitFullAddress, handleNeedsAssessmentRequired } from '../../NewActions/handle';
import {
  getMainProduct,
} from '../../Selectors/helpers/productApp';
import { getRouteWithProductType, hasValue, parsePostalCode, isSocialSignOnFeatureEnabled } from '../../utils/helpers';
import { PROVINCE_TYPES, COUNTRY_TYPES, USER_TYPES, COUNTRIES, PROVINCES, PM_PRODUCT_PREFIX, ROUTES, SEGMENT_EVENTS, PROVINCES_ABBREVIATIONS, LEGACY_SEGMENT_EVENTS } from '../../utils/const';
import { PM_ENABLE_QUEBEC_PRODUCT } from '../../config';

import {
  isQuebecHousehold,
} from '../../Selectors/household';
import { completedNeedsAssesment as completedNeedsAssesmentSelector } from '../../Selectors/session';
import { TENANT_TEXT_KEYS } from '../../tenant/consts';
import { getTenantBasedFormattedText, isPMEnvironment } from '../../tenant/helpers';
import AddressLookup from '../../components/AddressLookup';
import PostalCode from '../../components/PostalCode';
import { State } from '../../store/types/State';
import store from '../../store';
import BottomNavigation from '../../components/BottomNavigation';
import { updateMetadata } from '../../NewActions/metadata';
import { sendSegmentIdentifyEvent, sendSegmentTrackEvent } from '../../NewActions/analytics';
import { sendSegmentTrackEventLegacy } from '../../NewActions/legacyAnalytics';


interface FullAddressProps {
  match?: {
    params: {
      userType?: string;
    }
  }
}

const FullAddress = (props: FullAddressProps) => {
  const userType = (props.match && props.match.params.userType) || USER_TYPES.PRIMARY;
  const user_id = useSelector((state: State) => state[userType].session.user_id);
  const mainProduct = useSelector((state: State) => getMainProduct(state, userType));

  const hasPartnerApplication = useSelector((state: State) => state.userControl.hasPartnerApplication);
  const address_line1 = useSelector((state: State) => state[userType].household.address_line1);
  const address_line2 = useSelector((state: State) => state[userType].household.address_line2);
  const city = useSelector((state: State) => state[userType].household.city);
  const initialProvince = useSelector((state: State) => state[userType].household.province);
  const healthcard_province = useSelector((state: State) => state[userType].household.healthcard_province);
  const _country = useSelector((state: State) => state[userType].household.country);
  const postal_code = useSelector((state: State) => state[userType].household.postal_code);
  const firstName = useSelector((state: State) => state[userType].household.firstName);
  const completedNeedsAssesment = useSelector((state: State) => completedNeedsAssesmentSelector(state, USER_TYPES.PRIMARY, mainProduct));
  const isforceRedoStartApp = useSelector((state: State) => state.metadata.isforceRedoStartApp);
  const isQuebecApplication = useSelector((state: State) => isQuebecHousehold(state));

  const dispatch = useDispatch<typeof store.dispatch>();

  const [showIneligibleBlockerOpen, setShowIneligibleBlockerOpen] = useState(false);
  const [showNeedsAssessmentBlocker, setShowNeedsAssessmentBlocker] = useState(false);
  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [showProvinceMismatchBlocker, setShowProvinceMismatchBlocker] = useState(false);
  const [province, setProvince] = useState(initialProvince);

  useEffect(() => {
    dispatch(onComponentLoad(() => {
      if (isforceRedoStartApp) {
        if (isPMEnvironment()) {
          dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS.LOGIN_SUCCESSFUL));
        } else {
          dispatch(sendSegmentTrackEventLegacy(LEGACY_SEGMENT_EVENTS.LOGIN_SUCCESSFUL));
        }
        dispatch(push(getRouteWithProductType(ROUTES.QUOTES_COMPARE, mainProduct)));
      } else if (!isSocialSignOnFeatureEnabled()) {
          dispatch(sendSegmentIdentifyEvent(user_id));
      }
    }));
  }, []);

  const intl = useIntl();
  const supportEmail = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_EMAIL);
  const supportPhoneNumber = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER);
  const supportPhoneNumberFormatted = getTenantBasedFormattedText(intl, TENANT_TEXT_KEYS.SUPPORT_PHONE_NUMBER_FORMATTED);
  const blockerHeaderText = <FormattedMessage id="address.blockerHeader.tl1oAo" />;
  let householdUpdate = userType === USER_TYPES.PRIMARY ?
    updateHouseholdPropPrimary :
    updateHouseholdPropSecondary;
  const hiddenNBSP = <span style={{ fontSize: 0 }}>&nbsp;</span>;
  const POLICY_DOCUMENT_QUESTION_ADDRESS_DO_NOT_CHANGE =
    <FormattedMessage
      id="policyDocumentQuestion.address.qv2cZL"
      values={{
        hiddenNBSP,
        firstName,
      }}
    />;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleGoBackToEdit = () => {
    // If province was initially Quebec and the province changes,
    // we need to reset the experience level to show Social Sign On
    if (initialProvince === PROVINCES_ABBREVIATIONS.QC) {
      dispatch(updateMetadata('experienceLevel', ''));
    }

    dispatch(updateMetadata('isforceRedoStartApp', true));
    dispatch(updateMetadata('finishedHydrating', false));
    dispatch(push(getRouteWithProductType(ROUTES.QUOTES_COMPARE, mainProduct)));
  };

  return (
    <>
      <PageContainer hasFixedBanner fullHeight>
        <Typography
          variant="h1"
          message={POLICY_DOCUMENT_QUESTION_ADDRESS_DO_NOT_CHANGE}
        />
        <Spacer size="spaceXL" />
        <MaxWidthContainer width="md">
          <Form
            onSubmit={() => {
              if (mainProduct === PM_PRODUCT_PREFIX.HD) {
                if (healthcard_province !== province) {
                  setShowHealthCardModal(true);
                  return;
                }
              }
              if ((initialProvince !== province) && hasValue(province) && mainProduct !== PM_PRODUCT_PREFIX.HD) {
                setShowProvinceMismatchBlocker(true);
              } else if (!hasFlag(TENANT_FLAGS.QUEBEC_DISABLED) && isQuebecApplication && !completedNeedsAssesment && mainProduct !== PM_PRODUCT_PREFIX.HD) {
                setShowNeedsAssessmentBlocker(true);
              } else {
                dispatch(householdUpdate('province', province));
                dispatch(handleSubmitFullAddress(userType)).then(
                  // TS Error is from dispatch type not having thunk as we aren't exporting type from store. Its JS currently so work required
                  // https://stackoverflow.com/questions/67633259/property-then-does-not-exist-on-type-dispatch-any-promiseany-ts2339
                  eligible => {
                    setShowIneligibleBlockerOpen(!eligible);
                  },
                );
              }
            }}
            name="disguised_name"
            segmentPayload={{
              name: POLICY_DOCUMENT_QUESTION_ADDRESS_DO_NOT_CHANGE,
              product_type: mainProduct,
            }}
            dataCy="disguised_name"
          >
            <AddressLookup
              value={address_line1}
              data-cy="Address"
              placeholder={intl.formatMessage({ id: 'global.address.QKRS8h' })}
              usePartner={userType === USER_TYPES.SECONDARY}
              setProvince={setProvince}
              onChange={(field) => {
                userType === USER_TYPES.SECONDARY ?
                  dispatch(updateHouseholdPropSecondary('address_line1', field)) :
                  dispatch(updateHouseholdPropPrimary('address_line1', field));
              }}
            />
            <Input
              placeholder={intl.formatMessage({ id: 'global.apartmentSuite.Tt7uhm' })}
              value={address_line2}
              autoComplete="off"
              onChange={(field) => dispatch(householdUpdate('address_line2', field))}
              name="apartment_suite"
              data-cy="Apartment"
              label={intl.formatMessage({ id: 'global.apartmentSuite.Tt7uhm' })}
            />
            <Input
              placeholder={intl.formatMessage({ id: 'global.city.NRUegx' })}
              value={city}
              name="city_search"
              autoComplete="off"
              onChange={(field) => dispatch(householdUpdate('city', field))}
              validateOnValueChange
              required
              requiredMessage={<FormattedMessage id="address.cityRequired.ArCUYc" />}
              data-cy="City"
              label={intl.formatMessage({ id: 'global.city.NRUegx' })}
            />
            <Select
              autoHighlight
              ariaLabel="Province"
              label={<FormattedMessage id="global.province.pPf9cm" />}
              name="province_search"
              options={PROVINCE_TYPES}
              onChange={(e) => {
                e && setProvince(e.value);
              }}
              value={province in PROVINCES ? province : ''}
              required
              requiredMessage={<FormattedMessage id="address.provinceRequired.fuXlwk" />}
              dataCy="addressProvince"
              multiple={false}
            />
            <Spacer size="spaceSmall" />
            <Select
              autoHighlight
              ariaLabel="Country"
              label={<FormattedMessage id="global.country.exsQhO" />}
              name="country_search"
              options={COUNTRY_TYPES}
              onChange={(e) => e && dispatch(householdUpdate('country', e.value))}
              value={_country in COUNTRIES ? _country : ''}
              required
              requiredMessage={<FormattedMessage id="address.countryRequired.tmnMiz" />}
              dataCy="addressCountry"
              multiple={false}
            />
            <Spacer size="spaceSmall" />
            <PostalCode
              value={postal_code}
              autoComplete="off"
              country={_country}
              onChange={(field) => dispatch(householdUpdate('postal_code',
                parsePostalCode(field, postal_code, _country)))}
              data-cy="postalCode"
            />
            <Spacer size="spaceLarge" />
            <Button type="submit" name="submit" dataCy="address-submit" hidden={isMobile()} ref={buttonRef}>
              <Typography
                variant="CTALargePrimary"
                message={<FormattedMessage id="global.next.Q0fXUP" />}
              />
            </Button>
            <Modal
              name="ineligibleCountryModal"
              open={showIneligibleBlockerOpen}
              handleClose={() => setShowIneligibleBlockerOpen(false)}
              ariaDescribedBy="ineligbleCountryModalBody"
              ariaLabelledBy="ineligbleCountryModalHeader"
            >
              <MaxWidthContainer width="md" bgcolor="paper">
                <Typography variant="h2" message={blockerHeaderText} align="center" data-cy="ineligbleCountryModalHeader" id="ineligbleCountryModalHeader" />
                <Spacer size="spaceMedium" />
                <Typography variant="body2" message={<FormattedMessage id="address.blockerBody1.5e2g4p" />} id="ineligbleCountryModalBody" />
                <Spacer size="spaceMedium" />
                <Typography variant="body2" message={<FormattedMessage id="address.blockerBody2.PPjOav" />} />
                <Spacer size="spaceMedium" />
                <Button name="go-app" variant="primary" onClick={() => setShowIneligibleBlockerOpen(false)}>
                  <Typography variant="CTALargePrimary" message={<FormattedMessage id="global.backToApp.JrBcY9" />} />
                </Button>
                <Spacer size="spaceSmall" />
                <Button name="go-home" variant="secondary" role="link" onClick={() => { window.location.replace(getUrls().homepage); }}>
                  <Typography variant="CTALargeSecondary" message={<FormattedMessage id="global.goToHome.iLqFeJ" />} />
                </Button>
              </MaxWidthContainer>
            </Modal>
            <Modal
              name="provinceMismatchBlockerModal"
              open={showProvinceMismatchBlocker}
              handleClose={() => setShowProvinceMismatchBlocker(false)}
              ariaDescribedBy="provinceMismatchBlockerModalBody"
              ariaLabelledBy="provinceMismatchBlockerModalHeader"
            >
              <MaxWidthContainer width="md" bgcolor="paper">
                <Typography variant="h2" message={<FormattedMessage id="address.provinceMismatchBlockerHeader.NjVlR8" />} align="center" data-cy="provinceMismatchBlockerModalHeader" id="provinceMismatchBlockerModalHeader" />
                <Spacer size="spaceMedium" />
                <Typography
                  variant="body1"
                  message={<FormattedMessage
                    id="address.provinceMismatchBlockerBody.3o01gp"
                    values={{
                      advisorEmail: <Link label={supportEmail} href={`mailto:${supportEmail}`} />,
                      supportPhoneNumber: <Link label={supportPhoneNumberFormatted} href={`tel:${supportPhoneNumber}`} />,
                    }}
                  />}
                />
                <Spacer size="spaceSmall" />
                <Button
                  dataCy="update-province-and-continue"
                  name="Update Province and Continue"
                  variant="primary"
                  onClick={() => {
                    setProvince(initialProvince);
                    setShowProvinceMismatchBlocker(false);
                  }}
                >
                  <Typography
                    variant="CTALargePrimary"
                    message={<FormattedMessage id="address.UpdateProvinceAndContinue.WG4fBI" />}
                  />
                </Button>
                <Spacer size="spaceSmall" />
                <Button
                  dataCy="go-back-to-edit"
                  name="Go Back to Edit"
                  variant="secondary"
                  onClick={handleGoBackToEdit}
                >
                  <Typography
                    variant="CTALargeSecondary"
                    message={<FormattedMessage id="address.GoBackToEdit.OIehMN" />}
                  />
                </Button>
              </MaxWidthContainer>
            </Modal>
            {PM_ENABLE_QUEBEC_PRODUCT === '1' && mainProduct !== PM_PRODUCT_PREFIX.HD &&
            <Modal
              name="quebecNeedsAssessmentModal"
              open={showNeedsAssessmentBlocker}
              handleClose={() => setShowNeedsAssessmentBlocker(false)}
              ariaDescribedBy="quebecNeedsAssessmentModalBody"
              ariaLabelledBy="quebecNeedsAssessmentModalHeader"
            >
              <MaxWidthContainer width="md" bgcolor="paper">
                <Typography
                  variant="h2"
                  message={<FormattedMessage id="address.quebecHeaderText.UxoKP7" />}
                  align="center"
                  data-cy="quebecNeedsAssessmentModal"
                  id="quebecNeedsAssessmentModalHeader"
                />
                <Spacer size="spaceMedium" />
                <Typography
                  variant="body2"
                  message={<FormattedMessage
                    id="address.quebecBlockerBody.dLhcyP"
                    values={{
                      p: msg => <Typography variant="body2" message={msg as any as string} component="span" />,
                      br: <br />,
                    }}
                  />}
                  id="quebecNeedsAssessmentModalBody"
                />
                <Spacer size="spaceMedium" />
                <Button name="get-recommendations-button" onClick={() => dispatch(handleNeedsAssessmentRequired())}>
                  <Typography
                    variant="CTALargePrimary"
                    message={<FormattedMessage
                      id="address.getRecommendations.4dqdbp"
                      values={{
                        hasPartnerApplication,
                      }}
                    />}
                  />
                </Button>
              </MaxWidthContainer>
            </Modal>}
          </Form>
          <Modal
            name="healthCardProvinceErrorModal"
            open={showHealthCardModal}
            handleClose={() => setShowHealthCardModal(false)}
            ariaDescribedBy="healthCardProvinceErrorModalBody"
            ariaLabelledBy="healthCardProvinceErrorModalHeader"
          >
            <MaxWidthContainer width="md" bgcolor="paper">
              <Typography variant="h2" message={<FormattedMessage id="fullAddress.healthCardMissmatch.7haB32" />} align="center" data-cy="healthcardmismatchheader" id="healthCardProvinceErrorModalHeader" />
              <Spacer size="spaceMedium" />
              <Typography
                variant="body2"
                id="healthCardProvinceErrorModalBody"
                message={<FormattedMessage
                  id="fullAddress.healthCardMissmatchContent.5a6ddJ"
                  values={{
                    email: <Link
                      dataCy="support-email"
                      label={supportEmail}
                      href={`mailto:${supportEmail}`}
                    />,
                    phone: <Link
                      dataCy="support-phonenumber"
                      label={supportPhoneNumberFormatted}
                      href={`tel:+:${supportPhoneNumber}`}
                    />,
                  }}
                />}
              />
            </MaxWidthContainer>
          </Modal>
          {/* <SecureFooter noRelative /> */}
        </MaxWidthContainer>
      </PageContainer>
      <BottomNavigation buttonRef={buttonRef} position="sticky" />
    </>);
};

export default FullAddress;
