import React from 'react';
import { Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SubSectionHeader, SectionDetails } from '../sharedComponents';
import { ExtendedMedicalCare } from '../../HDPlanBaseFields';

export const BaseNursingServices = ({ year1, year2, yearsAfter, formatPrice,
  monthsWait, annualMax, id }:
  {
    year1: number,
    year2: number,
    yearsAfter: number,
    formatPrice: (priceString: number) => string,
    monthsWait: number,
    annualMax: number,
    id: string,
  }) => (year1 && year2 && yearsAfter && (
  <>
    <SubSectionHeader>
      <Typography
        variant="h3"
        message={
          <FormattedMessage id="planDetailsModalContent.medicalServicesHeading.ltlL7j" />
            }
      />
    </SubSectionHeader>
    <Spacer size="spaceXS" />
    <SectionDetails>
      <Typography
        variant="body1"
        id={`medical-services-details-${id}`}
        message={
          <>
            <FormattedMessage
              id="planDetailsModalContent.medicalServicesDetails.TEGOQo"
              values={{
                year1: formatPrice(
                  year1,
                ),
                year2: formatPrice(
                  year2,
                ),
                yearsAfter: yearsAfter && formatPrice(
                  yearsAfter,
                ),
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
    {monthsWait &&
    <SectionDetails>
      <Typography
        variant="body1"
        id={`medical-services-months-wait-${id}`}
        message={
          <FormattedMessage
            id="planDetailsModalContent.medicalMonthsWait.ju1Ug2"
            values={{
              monthsWait,
              annualMax: (annualMax &&
                    formatPrice(annualMax)) || undefined,
              b: (chunks) => <strong>{chunks}</strong>,
            }}
          />
            }
      />
    </SectionDetails>}
  </>)
);

export const NursingServices = ({ plan, renderFunctions, formatPrice }:
  {
    plan: HD_Plan,
    renderFunctions: ExtendedMedicalCare,
    formatPrice: (priceString: number) => string,
  }) => plan?.extendedMedicalCare && renderFunctions && renderFunctions?.year1(
  plan?.extendedMedicalCare && plan?.extendedMedicalCare.year1,
  plan?.planType,
  {
    year2: plan?.extendedMedicalCare && plan?.extendedMedicalCare.year2,
    yearsAfter: plan?.extendedMedicalCare && plan?.extendedMedicalCare.yearsAfter,
    formatPrice,
    monthsWait: plan?.extendedMedicalCare && plan?.extendedMedicalCare.monthsWait,
    annualMax: plan?.extendedMedicalCare && plan?.extendedMedicalCare.annualMax,
  },
);
