import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CheckIcon, NativeList, Typography, UniformSpacingLayout, XIcon, IconListItem } from '@policyme/global-libjs-designsystem';
import RedX from '../../static/images/Icon_RedX.svg';
import { DISCOUNT_CODES } from '../../utils/discounts';

export interface WhatsCoveredModalProps {
  exclusionsCount: number,
  coverageAmount: string,
  termLength: number,
  isJoint?: boolean,
  discountCodes: typeof DISCOUNT_CODES[keyof typeof DISCOUNT_CODES][],
  isPermanentInsurance: boolean,
}

const WhatsCoveredModal = (props: WhatsCoveredModalProps) => {
  const { coverageAmount, termLength, exclusionsCount, discountCodes, isJoint } = props;
  const ADDITIONAL_FEATURES = [
    <FormattedMessage
      id="WhatsCoveredModal.additionalFeature1.cqL29k"
    />,
    <FormattedMessage
      id="WhatsCoveredModal.additionalFeature2.1iltiB"
    />,
    discountCodes !== undefined &&
    discountCodes.includes(DISCOUNT_CODES.JOINT_DISCOUNT_V2) && (
      <FormattedMessage
        id="WhatsCoveredModal.additionalFeature3.6QJ5nD"
      />
    ),
    isJoint && discountCodes === undefined && (
      <FormattedMessage
        id="WhatsCoveredModal.additionalFeature4.PJla2A"
      />
    ),
    <FormattedMessage
      id="WhatsCoveredModal.additionalFeature5.f815jC"
    />,
  ];

  return (
    <>
      <Typography
        variant="h4"
        align="left"
        message={
          <FormattedMessage
            id="WhatsCoveredModal.policyFeaturesHeading.Uui1tU"
            values={{
              isJoint,
              isPermanent: false,
            }}
          />
            }
      />
      <UniformSpacingLayout flexDirection="column" gap="0.5rem">
        <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start">
          <CheckIcon variant="transparent" interactive />
          <Typography
            variant="body1"
            color="black"
            message={
              <FormattedMessage
                id="WhatsCoveredModal.payout.Nj0mof"
                values={{
                  isJoint,
                  coverageAmount,
                  termLength,
                  isPermanent: false,
                  b: chunks => <strong>{chunks}</strong>,
                }}
              />
          }
          />
        </UniformSpacingLayout>

        <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start">
          <CheckIcon variant="transparent" interactive />
          <Typography
            variant="body1"
            message={<FormattedMessage
              id="WhatsCoveredModal.causesOfDeath.zDxFlr"
            />}
          />
        </UniformSpacingLayout>
        <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start" sx={{ paddingLeft: '2rem' }}>
          <XIcon variant="transparent" />
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="WhatsCoveredModal.suicideExclusion.8SXHLx"
                values={{
                  isPermanent: false,
                }}
              />
              }
          />
        </UniformSpacingLayout>

        {!!exclusionsCount && (
          <UniformSpacingLayout flexDirection="row" gap="0.5rem" sx={{ paddingLeft: '2rem' }} justifyContent="flex-start">
            <XIcon variant="transparent" />
            <Typography
              variant="body1"
              message={
                <FormattedMessage
                  id="WhatsCoveredModal.otherExclusions.IrfIuG"
                  values={{ exclusionsCount, b: chunks => <strong>{chunks}</strong> }}
                />
              }
            />
          </UniformSpacingLayout>
        )}

        <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start">
          <CheckIcon variant="transparent" interactive />
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="WhatsCoveredModal.lockedInRate.ZqLefD"
              />
            }
          />
        </UniformSpacingLayout>

        <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start">
          <CheckIcon variant="transparent" interactive />
          <Typography
            variant="body1"
            message={
              <FormattedMessage
                id="WhatsCoveredModal.policyConversion.dO8h1j"
              />
            }
          />
        </UniformSpacingLayout>
        <Typography
          variant="h4"
          message={
            <FormattedMessage
              id="WhatsCoveredModal.exclusiveFeaturesHeading.8lAcda"
              values={{
                isPermanent: false,
              }}
            />
          }
        />
        {ADDITIONAL_FEATURES.filter(Boolean).map((item) => (
          <UniformSpacingLayout flexDirection="row" gap="0.5rem" fullWidth justifyContent="flex-start">
            <CheckIcon variant="transparent" interactive />
            <Typography
              variant="body1"
              message={item}
            />
          </UniformSpacingLayout>
        ))}
      </UniformSpacingLayout>
    </>);
};

WhatsCoveredModal.propTypes = {
  exclusionsCount: PropTypes.number,
  coverageAmount: PropTypes.string.isRequired,
  termLength: PropTypes.number.isRequired,
  isJoint: PropTypes.bool,
  isPermanentInsurance: PropTypes.bool,
  discountCodes: PropTypes.arrayOf(PropTypes.oneOf(Object.values(DISCOUNT_CODES))),
};

WhatsCoveredModal.defaultProps = {
  exclusionsCount: 0,
  isJoint: false,
  isPermanentInsurance: false,
  discountCodes: [],
};

export default WhatsCoveredModal;
