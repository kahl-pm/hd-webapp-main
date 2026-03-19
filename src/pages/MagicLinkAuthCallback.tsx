import React from 'react';
import { useDispatch } from 'react-redux';
import { handleVerifyAuth0EmailMagicLink } from '../NewActions/handle';
import CallbackLoading from '../components/CallbackLoading';

const MagicLinkAuthCallback = () => {
  const dispatch = useDispatch();

  const handleCallback = () => {
    dispatch(handleVerifyAuth0EmailMagicLink());
  };

  return <CallbackLoading callbackLogicHandler={handleCallback} />;
};

export default MagicLinkAuthCallback;
