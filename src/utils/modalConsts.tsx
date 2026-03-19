import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckIcon, NativeList, Spacer, Typography, IconListItem } from '@policyme/global-libjs-designsystem';

type CoverageTooltipMessageProps = {
  isPolicymeEmployee: boolean;
};
const CheckIconPlain = () => <CheckIcon variant={'plain'} size="accordionLarge" />;
export const CoverageTooltipMessage = (props: CoverageTooltipMessageProps) => {
  const isPolicyMeEmployeeByBundlingPolicyText = <FormattedMessage id="coverageRedesign.coverageToolTipPara1Employee.ZbMtyu" />;
  return (
    <NativeList paddingInlineStart="0rem" gap="1rem">
      <IconListItem
        renderAs="li"
        icon={CheckIconPlain}
        message={
          props.isPolicymeEmployee ?
            isPolicyMeEmployeeByBundlingPolicyText :
            <FormattedMessage
              id="coverageRedesign.coverageToolTipPara1.qRzq30"
            />
        }
      />
      <IconListItem
        renderAs="li"
        icon={CheckIconPlain}
        message={
          props.isPolicymeEmployee ?
            isPolicyMeEmployeeByBundlingPolicyText :
            <FormattedMessage
              id="coverageRedesign.coverageToolTipPara2.OzXwTc"
            />
        }
      />
      <IconListItem
        renderAs="li"
        icon={CheckIconPlain}
        message={
          props.isPolicymeEmployee ?
            isPolicyMeEmployeeByBundlingPolicyText :
            <FormattedMessage
              id="coverageRedesign.coverageToolTipPara3.vKwILh"
            />
        }
      />
      <IconListItem
        renderAs="li"
        icon={CheckIconPlain}
        message={
          props.isPolicymeEmployee ?
            isPolicyMeEmployeeByBundlingPolicyText :
            <FormattedMessage
              id="partnerCoverage.bothPassAway.hM4KuR"
            />
        }
      />
    </NativeList>
  );
};

export const CICoverageTooltipMessage = (
  <NativeList paddingInlineStart="0rem" gap="1rem">
    <IconListItem
      renderAs="li"
      icon={CheckIconPlain}
      message={
        <FormattedMessage
          id="coverageRedesign.CICoverageToolTipPara1.Toa72V"
        />
      }
    />
    <IconListItem
      renderAs="li"
      icon={CheckIconPlain}
      message={
        <FormattedMessage
          id="coverageRedesign.CICoverageToolTipPara2.jtL5Ke"
        />
      }
    />
    <IconListItem
      renderAs="li"
      icon={CheckIconPlain}
      message={
        <FormattedMessage
          id="coverageRedesign.CICoverageToolTipPara3.EHxvXB"
        />
      }
    />
  </NativeList>
);

export const ChildCoverageTooltip = () => {
  return <>
    <Typography
      variant="h3"
      align="center"
      message={<FormattedMessage
        id="childCoverageTooltip.title1.IIUXeF"
      />}
    />
    <Spacer size="spaceXS" />
    <Typography
      variant="body1"
      message={<FormattedMessage
        id="childCoverageTooltip.body.kRcYKW"
        values={{
          kidsCov: 10000,
        }}
      />}
    />
    <Spacer size="spaceMedium" />
    <Typography
      variant="h3"
      align="center"
      message={<FormattedMessage
        id="childCoverageTooltip.title2.TDBdfu"
      />}
    />
    <NativeList paddingInlineStart="0rem">
      <IconListItem
        icon={CheckIconPlain}
        renderAs="li"
        message={<FormattedMessage
          id="childCoverageTooltip.details1.gyYnsl"
          values={{
            b: chunks => <strong>{chunks}</strong>,
          }}
        />}
      />
      <IconListItem
        icon={CheckIconPlain}
        renderAs="li"
        message={<FormattedMessage
          id="childCoverageTooltip.details2.zyoyXD"
          values={{
            kidsCov: 10000,
          }}
        />}
      />
      <IconListItem
        icon={CheckIconPlain}
        renderAs="li"
        message={<FormattedMessage
          id="childCoverageTooltip.details3.FmgJrX"
        />}
      />
    </NativeList>
  </>;
};
