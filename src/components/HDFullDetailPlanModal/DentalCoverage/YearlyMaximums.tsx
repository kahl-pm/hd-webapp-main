import React from 'react';
import { Row, Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { hasValue, HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { DentalCoverage } from '../../HDPlanBaseFields';

export const BaseYearlyMaximums = ({ year1, id, formatPrice, year2, yearsAfter }:
  {
    year1: number;
    id: string;
    formatPrice: (priceString: number) => string
    year2: number;
    yearsAfter: number;
  }) => (!year1 ? <></> : (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          component="h4"
          message={
            <FormattedMessage id="planDetailsModalContent.annualMaximumHeading.ir2NKN" />
        }
        />
      </SubSectionHeader>
      <Spacer size="spaceXS" />
      <SectionDetails>
        <Typography
          variant="body1"
          id={`dental-year-1-max-value-${id}`}
          message={
            <>
              <FormattedMessage
                id="planDetailsModalContent.annualMaximumDetails.50kjNf"
                values={{
                  year1: formatPrice(year1),
                  hasYear2: hasValue(year2),
                  year2: formatPrice(year2),
                  yearsAfter: formatPrice(yearsAfter),
                  b: (chunks) => <strong>{chunks}</strong>,
                  li: (chunks) => <li>
                    <Typography
                      variant="body1"
                      message={chunks}
                    />
                  </li>,
                  ul: (chunks) => <StyledUnorderedList>{chunks}</StyledUnorderedList>,
                  br: <br />,
                }}
              />
            </>
        }
        />
      </SectionDetails>
    </>
));

export const YearlyMaximums = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: DentalCoverage,
    formatPrice: (val: number) => string
  }) => plan?.dentalCoverage && renderFunctions && renderFunctions.year1(
  plan?.dentalCoverage.year1,
  plan.planType,
  {
    year2: plan?.dentalCoverage.year2,
    yearsAfter: plan?.dentalCoverage.yearsAfter,
    formatPrice: (val: number) => formatPrice(val),
  },
);
