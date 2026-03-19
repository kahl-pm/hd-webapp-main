import React from 'react';
import { useDispatch } from 'react-redux';
import { handleSkipEmailMagicLink } from '../NewActions/handle';
import CallbackLoading from '../components/CallbackLoading';

const SkipMagicLinkCallback = (props) => {
  const dispatch = useDispatch();

  const handleCallback = () => {
    dispatch(handleSkipEmailMagicLink());
  };

  return <CallbackLoading callbackLogicHandler={handleCallback} />;
};

export default SkipMagicLinkCallback;
