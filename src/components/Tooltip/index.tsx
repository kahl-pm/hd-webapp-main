import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@policyme/global-libjs-designsystem';
import { getEnglishMessageWithId } from '../../utils/reactIntlHelpers';
import { PM_PRODUCT_PREFIX } from '../../utils/const';

type ProductPrefix = typeof PM_PRODUCT_PREFIX[keyof typeof PM_PRODUCT_PREFIX];
interface TooltipWrapperProps {
  segmentEventName?: string;
  headerText?: string | { props: { id: string } };
  productType: ProductPrefix;
}

const TooltipWrapper = (props:TooltipWrapperProps) => {
  let eventName = props.segmentEventName;
  // Fix tooltip bug where tooltip toggling fails when passing in FormattedMessage headerText
  // because we attempt to send a segment event with a formattedMessage object instead of string
  if (!eventName) {
    if (typeof props.headerText === 'object') {
      eventName = getEnglishMessageWithId(props.headerText.props.id);
    } else if (typeof props.headerText === 'string') {
      eventName = props.headerText;
    }
  }
  const segmentPayload = {
    name: eventName,
    product_type: props.productType,
  };

  return (
    // @ts-ignore prop type errors as this Tooltip component isn't used
    <Tooltip
      {...props}
      segmentPayload={segmentPayload}
    />
  );
};

TooltipWrapper.propTypes = {
  // @ts-ignore no propTypes
  ...Tooltip.propTypes,
  segmentEventName: PropTypes.string,
  headerText: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  productType: PropTypes.oneOf(Object.values(PM_PRODUCT_PREFIX)).isRequired,
};

TooltipWrapper.defaultProps = {
  segmentEventName: '',
  headerText: undefined,
};

export default TooltipWrapper;
