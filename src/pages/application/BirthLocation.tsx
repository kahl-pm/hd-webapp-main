import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Card, Divider, Form, isMobile, MaxWidthContainer, PageContainer, Select, Spacer, Typography } from '@policyme/global-libjs-designsystem';

import { nextQuestion, onComponentLoad } from '../../NewActions/session';
import {
  updateHDAppPropertyPrimary, updateHDAppPropertySecondary,
} from '../../NewActions/hdApp';
import { spreadStateFields } from '../../utils/helpers';
import {
  COUNTRY_CODES,
  COUNTRY_TYPES,
  APP_FORM_FIELDS,
  ACORD_COUNTRY_TYPES,
  BIRTH_JURISDICTION_CAN,
  BIRTH_JURISDICTION_USA,
  USER_TYPES,
} from '../../utils/const';
import { isJoint } from '../../Selectors/userControl';

import { getMainProduct } from '../../Selectors/helpers/productApp';
import { State } from '../../store/types/State';
import BottomNavigation from '../../components/BottomNavigation';

type AppFormFieldValues = typeof APP_FORM_FIELDS[keyof typeof APP_FORM_FIELDS];
type BirthLocationFields = {
  [key in AppFormFieldValues]: string;
};

type BirthLocationJointProps = {
  primary: {
    firstName: string;
    lastName: string;
  };
  secondary: {
    firstName: string;
    lastName: string;
  };
  partnerFormData: Partial<BirthLocationFields>;
};

const BirthLocationJoint = (props: BirthLocationJointProps) => {
  const dispatch = useDispatch();

  return (
    <>
      <Card
        heading={
          <FormattedMessage
            id="birthLocationJoint.countryOfBirth.1z1Z3b"
            values={{ firstName: props.primary.firstName }}
          />
        }
        headingTypographyTagOverride="h2"
        cardVariant="only-heading"
        body={
          <>
            <Divider />
            <Spacer size="spaceSmall" />
            <Select
              ariaLabel="Country"
              label={<FormattedMessage id="global.country.exsQhO" />}
              name="country"
              options={ACORD_COUNTRY_TYPES}
              onChange={(e) => {
                dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE, e?.value));
                dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, ''));
              }}
              value={props[APP_FORM_FIELDS.BIRTHPLACE]}
              required
              requiredMessage={<FormattedMessage id="address.countryRequired.tmnMiz" />}
              dataCy="Country"
              multiple={false}
            />
            {props[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.US && <>
              <Spacer size="spaceMedium" />
              <Select
                ariaLabel="State"
                label={<FormattedMessage id="global.state.75I0b4" />}
                name="state"
                options={BIRTH_JURISDICTION_USA}
                onChange={(e) => {
                  dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
                }}
                value={props[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
                required
                requiredMessage={<FormattedMessage id="birthLocation.stateRequired.SAtLCl" />}
                dataCy="State"
                multiple={false}
              />
            </>}
            {props[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.CA && <>
              <Spacer size="spaceMedium" />
              <Select
                ariaLabel="Province"
                label={<FormattedMessage id="global.province.pPf9cm" />}
                name="province"
                options={BIRTH_JURISDICTION_CAN}
                onChange={(e) => {
                  dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
                }}
                value={props[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
                required
                requiredMessage={<FormattedMessage id="birthLocation.provinceTerritoryRequired.2SxdzH" />}
                dataCy="Province"
                multiple={false}
              />
            </>}
          </>
        }
      />
      <Spacer size="spaceMedium" />
      <Card
        cardVariant="only-heading"
        headingTypographyTagOverride="h2"
        heading={
          <FormattedMessage
            id="birthLocationJoint.countryOfBirth.1z1Z3b"
            values={{ firstName: props.secondary.firstName }}
          />
        }
        body={
          <>
            <Divider />
            <Spacer size="spaceSmall" />
            <Select
              ariaLabel="Country"
              label={<FormattedMessage id="global.country.exsQhO" />}
              name="partner_country"
              options={COUNTRY_TYPES}
              onChange={(e) => {
                dispatch(updateHDAppPropertySecondary(APP_FORM_FIELDS.BIRTHPLACE, e?.value));
                dispatch(updateHDAppPropertySecondary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, ''));
              }}
              value={props.partnerFormData[APP_FORM_FIELDS.BIRTHPLACE]}
              required
              requiredMessage={<FormattedMessage id="address.countryRequired.tmnMiz" />}
              dataCy="partnerCountry"
              multiple={false}
            />
            {props.partnerFormData[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.US && <>
              <Spacer size="spaceMedium" />
              <Select
                ariaLabel="State"
                label={<FormattedMessage id="global.state.75I0b4" />}
                name="partner_state"
                options={BIRTH_JURISDICTION_USA}
                onChange={(e) => {
                  dispatch(updateHDAppPropertySecondary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
                }}
                value={props.partnerFormData[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
                required
                requiredMessage={<FormattedMessage id="birthLocation.stateRequired.SAtLCl" />}
                dataCy="secState"
                multiple={false}
              />
            </>}
            {props.partnerFormData[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.CA && <>
              <Spacer size="spaceMedium" />
              <Select
                ariaLabel="Province"
                label={<FormattedMessage id="global.province.pPf9cm" />}
                name="partner_province"
                options={BIRTH_JURISDICTION_CAN}
                onChange={(e) => {
                  dispatch(updateHDAppPropertySecondary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
                }}
                value={props.partnerFormData[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
                required
                requiredMessage={<FormattedMessage id="birthLocation.provinceTerritoryRequired.2SxdzH" />}
                dataCy="secProvince"
                multiple={false}
              />
            </>}
          </>
        }
      />
    </>);
};

type BirthLocationSingleProps = {
  [key in (typeof APP_FORM_FIELDS)[keyof typeof APP_FORM_FIELDS]]: string;
};

const BirthLocationSingle = (props: Partial<BirthLocationSingleProps>) => {
  const dispatch = useDispatch();

  return (
    <>
      <Select
        ariaLabel="Country"
        label={<FormattedMessage id="global.country.exsQhO" />}
        name="country"
        options={ACORD_COUNTRY_TYPES}
        onChange={(e) => {
          dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE, e?.value));
          dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, ''));
        }}
        value={props[APP_FORM_FIELDS.BIRTHPLACE]}
        required
        requiredMessage={<FormattedMessage id="address.countryRequired.tmnMiz" />}
        dataCy="Country"
        multiple={false}
      />
      {props[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.US && <>
        <Spacer size="spaceMedium" />
        <Select
          ariaLabel="State"
          label={<FormattedMessage id="global.state.75I0b4" />}
          name="state"
          options={BIRTH_JURISDICTION_USA}
          onChange={(e) => {
            dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
          }}
          value={props[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
          required
          requiredMessage={<FormattedMessage id="birthLocation.stateRequired.SAtLCl" />}
          dataCy="State"
          multiple={false}
        />
      </>}
      {props[APP_FORM_FIELDS.BIRTHPLACE] === COUNTRY_CODES.CA && <>
        <Spacer size="spaceMedium" />
        <Select
          ariaLabel="Province"
          label={<FormattedMessage id="global.province.pPf9cm" />}
          name="province"
          options={BIRTH_JURISDICTION_CAN}
          onChange={(e) => {
            dispatch(updateHDAppPropertyPrimary(APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE, e?.value));
          }}
          value={props[APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE]}
          required
          requiredMessage={<FormattedMessage id="birthLocation.provinceTerritoryRequired.2SxdzH" />}
          dataCy="Province"
          multiple={false}
        />
      </>}
    </>);
};

const BirthLocation = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const state = useSelector<State, State>((_state) => _state);

  const _props = {
    ...spreadStateFields(state.primary.hdApp, [
      APP_FORM_FIELDS.BIRTHPLACE,
      APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE,
    ]),
    partnerFormData: {
      ...spreadStateFields(state.secondary.hdApp, [
        APP_FORM_FIELDS.BIRTHPLACE,
        APP_FORM_FIELDS.BIRTHPLACE_PROVSTATE,
      ]),
    } as Partial<BirthLocationFields>,

    isJoint: isJoint(state),
    primary: {
      firstName: state.primary.household.firstName,
      lastName: state.primary.household.lastName,
    },
    secondary: {
      firstName: state.secondary.household.firstName,
      lastName: state.secondary.household.lastName,
    },
    productType: getMainProduct(state, USER_TYPES.PRIMARY),
  };
  const buttonRef = useRef<HTMLButtonElement>(null);
  return <>
    <PageContainer fullHeight>
      <Typography
        variant="h1"
        message={<FormattedMessage
          id="birthLocation.pageTitle.YbTAMa"
          values={{ isJoint: _props.isJoint }}
        />}
      />
      <Spacer size="spaceLarge" />
      <Form
        onSubmit={() => {
          dispatch(nextQuestion());
        }}
        name="Birth Location"
        segmentPayload={{
          name: (
            <FormattedMessage
              id="birthLocation.pageTitle.YbTAMa"
              values={{ isJoint: _props.isJoint }}
            />
          ),
          product_type: _props.productType,
        }}
      >
        <MaxWidthContainer width="md">
          {_props.isJoint ?
            <BirthLocationJoint {..._props} /> :
            <BirthLocationSingle {..._props as Partial<BirthLocationSingleProps>} />}
          <Spacer size="spaceMedium" />
          <Button
            type="submit"
            variant="primary"
            name="Next Button"
            dataCy="submit"
            hidden={isMobile()}
            ref={buttonRef}
          >
            <Typography
              variant="CTALargePrimary"
              message={<FormattedMessage id="global.next.Q0fXUP" />}
            />
          </Button>
        </MaxWidthContainer>
        {/* <SecureFooter noRelative /> */}
      </Form>
    </PageContainer>
    <BottomNavigation buttonRef={buttonRef} position="sticky" />
  </>;
};

export default BirthLocation;
