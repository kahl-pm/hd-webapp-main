/**
 * This is a part of the UW flow,
 * We don't use it right now but this has still been migrated
 * incase we turn UW back on in the future
 */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Row, Typography, Form, Tooltip, Checkbox, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

export default function HospitalPrivacyCard({
  formattedPrice,
  formattedPeriod,
  selected,
  onChange,
  applicantsCount = 1,
}) {
  const { formatMessage } = useIntl();

  return (<>
    <div className="hp-card">
      <UniformSpacingLayout>
        <Typography
          variant="body1"
          message={<FormattedMessage
            id="healthAndDentalCard.hospitalPrivacyCoverage.9zsqQ7"
          />}
        />
        <Tooltip
          tooltipButtonName="About Hospital Privacy Coverage"
          ariaDescribedBy="Hospital Privacy Coverage Modal Description"
          ariaLabelledBy="Hospital Privacy Coverage Modal Header"
          variant="icon-only"
          tooltipHeader={formatMessage({
            id: 'healthAndDentalCard.hospitalPrivacyCoverageModalHeader.uX62nw',
          })}
        >
          <FormattedMessage
            id="healthAndDentalCard.hospitalPrivacyCoverageModalBody.RpmEze"
          />
        </Tooltip>
      </UniformSpacingLayout>
      <Row>
        <Form
          name="hospitalPrivacyForm"
          onSubmit={() => {}}
        >
          <Checkbox
            name="hospitalPrivacySelected"
            // value={selected}
            onChange={onChange}
            label={<>
              <Typography
                variant="body1"
                message={<FormattedMessage
                  id="healthAndDentalCard.hospitalPrivacyCoverageCheckboxLabel.fm4nEC"
                />}
              />
              <Typography
                variant="body1"
                message={<FormattedMessage
                  id="healthAndDentalCard.hospitalPrivacyCoverageCheckboxPrice.we2pCd"
                  values={{ formattedPrice:
                    (formattedPrice * applicantsCount),
                  formattedPeriod,
                  applicantsCount }}
                />}
              />
            </>}
          />
        </Form>
      </Row>
    </div>

  </>);
}

HospitalPrivacyCard.propTypes = {
  onChange: PropTypes.func,
  formattedPrice: PropTypes.string,
  formattedPeriod: PropTypes.string,
  selected: PropTypes.bool,
};

HospitalPrivacyCard.defaultProps = {
  onChange: () => {},
  formattedPrice: '$10.00',
  formattedPeriod: 'month',
  selected: false,
};
