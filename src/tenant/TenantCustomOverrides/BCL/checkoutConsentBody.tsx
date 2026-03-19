import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Checkbox, Link, Modal, Spacer, Typography } from '@policyme/global-libjs-designsystem';
import { CustomiseOverrideComponent, TenantCustomisationSlot } from '../../../components/Customisation';
import { CheckoutConsentText } from '../../../components/DigitalConsentHtmlComponents/CheckoutConsent';
import { State } from '../../../store/types/State';
import { MARKETING_COMMUNICATIONS_CONSENT_SLOTS } from '../../../utils/const';
import { makeUpdateHouseholdProp } from '../../../NewActions/household';

// HD-only webapp: Life/CI checkout consent messages removed
// BCL-specific marketing consent checkbox is preserved as it may be used in HD flows

const CheckoutConsentTextOverride = (props) => {
  const dispatch = useDispatch();
  const userType = useSelector<any, string>(
    state => state.userControl.dashboardUser,
  );
  const marketingCommunicationsConsent = useSelector<State, boolean>(
    state => state[userType].household.marketingCommunicationsConsent,
  );
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TenantCustomisationSlot
        name={MARKETING_COMMUNICATIONS_CONSENT_SLOTS.COMMUNICATIONS_CHECKBOX_SLOT}
      >
        <Checkbox
          name="marketingCommunicationsConsent"
          checked={marketingCommunicationsConsent}
          onChange={(val) => dispatch(makeUpdateHouseholdProp(userType)('marketingCommunicationsConsent', !JSON.parse(val.currentTarget.value)))}
          label={
            <>
              <Typography
                message={<FormattedMessage
                  id="marketingConsentCheckbox.BCL.0xq5dz"
                  values={{
                    span1: msg => (
                      <Link
                        ariaLabel=""
                        label={msg}
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(true);
                        }}
                        href=""
                        dataCy="mib-modal"
                      />
                    ),
                  }}
                />}
                variant="body3"
                component="span"
              />
              <Typography
                message={<FormattedMessage
                  id="global.optional.3FRWWc"
                />}
                variant="body3"
                secondaryText
                component="span"
              />
              <Modal
                name="bclMarketingConsentModal"
                open={showModal}
                handleClose={() => setShowModal(false)}
                ariaDescribedBy="bclMarketingConsentModalQuestion"
                ariaLabelledBy="bclMarketingConsentModalExplained"
                header={<FormattedMessage id="bclOrganizationModal.header.ohZnZk" />}
              >
                <Typography
                  message={<FormattedMessage
                    id="bclOrganizationModal.body.vo2Cgy"
                  />}
                  variant="body3"
                  component="p"
                />
                <ul>
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.AlbertaBlueCross.EoD4DJ"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.ab.bluecross.ca"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.MaintobaBlueCross.v2gEoG"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.mb.bluecross.ca/"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.MedavieBlueCross.t7bytl"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.medaviebc.ca"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.OntarioBlueCross.TCtPvr"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.on.bluecross.ca"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.PacificBlueCross.lBCHTm"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.pac.bluecross.ca"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                  <Typography
                    message={<FormattedMessage
                      id="bclOrganizationModal.QuebecBlueCross.WPPDoB"
                      values={{
                        i: chunks => <i>{chunks}</i>,
                        b: chunks => <b>{chunks}</b>,
                        br: <br />,
                        link: msg => (
                          <Link
                            label={msg}
                            href="https://www.qc.bluecross.ca"
                          />
                        ),
                      }}
                    />}
                    variant="body3"
                    component="li"
                    align="left"
                  />
                  <Spacer size="spaceMedium" />
                </ul>
                <Button
                  variant="primary"
                  name="Accept bcl organization"
                  dataCy="bcl-organization-confirm"
                  onClick={() => setShowModal(false)}
                >
                  <Typography
                    variant="CTALargePrimary"
                    align="center"
                    message={<FormattedMessage
                      id="global.close.OGkK7o"
                    />}
                  />
                </Button>
              </Modal>
            </>
          }
          data-cy="marketingCommunicationsConsent"
        />
        <Spacer size="spaceSmall" />
      </TenantCustomisationSlot>
    </>
  );
};

export default CustomiseOverrideComponent(CheckoutConsentText, CheckoutConsentTextOverride);
