import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { hasFlag, segmentTrackEvent, TENANT_FLAGS } from '@policyme/global-libjs-utils';
import QuotesInputHd from './QuotesInputHd';
import WithHotjar from '../../components/HOC/WithHotjar';
import { onComponentLoad } from '../../NewActions/session';
import ProvinceMismatchBlockerModal from '../../components/ProvinceMismatchBlockerModal';

export interface QuotesInputProps {
  openProvinceMismatchBlockerModal: () => void;
  provinceMismatchCheckEnabled: boolean;
}

const QuotesCompare = () => {
  const dispatch = useDispatch();
  const [
    provinceMismatchBlockerModalOpened,
    setProvinceMismatchBlockerModalOpened,
  ] = useState(false);
  const provinceMismatchCheckEnabled = hasFlag(TENANT_FLAGS.ENABLE_PROVINCE_MISMATCH_CHECK);

  useEffect(() => {
    dispatch(onComponentLoad());
  }, []);

  const openProvinceMismatchBlockerModal = () => {
    setProvinceMismatchBlockerModalOpened(true);
    segmentTrackEvent('Error Modal - Different Provinces', {});
  };

  return (
    <>
      <QuotesInputHd
        openProvinceMismatchBlockerModal={openProvinceMismatchBlockerModal}
        provinceMismatchCheckEnabled={provinceMismatchCheckEnabled}
      />

      <ProvinceMismatchBlockerModal
        opened={provinceMismatchBlockerModalOpened}
        handleClose={() => {
          setProvinceMismatchBlockerModalOpened(false);
        }}
        dataCy="provinceMismatchBlockerModal"
      />
    </>
  );
};

export default WithHotjar(process.env.PM_HOTJAR_SITE_ID1)(
  QuotesCompare,
);
