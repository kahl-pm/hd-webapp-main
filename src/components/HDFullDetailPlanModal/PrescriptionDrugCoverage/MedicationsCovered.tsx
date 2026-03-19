import React from 'react';
import { Spacer, StyledUnorderedList, Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import { HD_Plan } from '@policyme/global-libjs-utils';
import { SectionDetails, SubSectionHeader } from '../sharedComponents';
import { PrescriptionDrugCoverage } from '../../HDPlanBaseFields';

export const BaseMedicationsCovered = ({ value, id }:
  {
    value: boolean,
    id: string,
  }) => (
    <>
      <SubSectionHeader>
        <Typography
          variant="h3"
          message={<FormattedMessage id="planDetailsModalContent.medicationCoveredHeading.RTU3l3" />}
        />
      </SubSectionHeader><Spacer size="spaceXS" /><SectionDetails>
        <Typography
          variant="body1"
          id={`medication-covered-details-formulary-${id}`}
          message={<> {value ?
            <FormattedMessage
              id="planDetailsModalContent.essentialsFormulary.gQ4rXA"
              values={{
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
            /> :
            <FormattedMessage
              id="planDetailsModalContent.medicationCoveredDetails.ZT1yMJ"
              values={{
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
            />}
          </>}
        />
      </SectionDetails>
    </>
);

export const MedicationsCovered = ({ plan, renderFunctions }:
  {
    plan: HD_Plan,
    renderFunctions: PrescriptionDrugCoverage
  }) => plan?.prescriptionDrugCoverage &&
  renderFunctions &&
  renderFunctions.usesFormulary(plan?.prescriptionDrugCoverage.usesFormulary, plan.planType);
