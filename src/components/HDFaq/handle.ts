import React from 'react';
import { sendSegmentTrackEvent } from '../../NewActions/analytics';
import { SEGMENT_EVENTS_HD_FAQS } from '../../utils/const';

export const handleFaqExpanded = (event: React.SyntheticEvent, expanded: boolean, dispatch) => {
  if (expanded) {
    dispatch(sendSegmentTrackEvent(SEGMENT_EVENTS_HD_FAQS[event.currentTarget.id]));
  }
};
