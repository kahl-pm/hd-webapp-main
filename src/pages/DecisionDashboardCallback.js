import React from 'react';
import { useDispatch } from 'react-redux';
import { authGetUserInfo } from '../NewActions/auth';
import { nextQuestion } from '../NewActions/session';
import CallbackLoading from '../components/CallbackLoading';

const DecisionDashboardCallback = () => {
  const dispatch = useDispatch();

  const handler = async () => {
    await dispatch(authGetUserInfo());
    dispatch(nextQuestion());
  };

  return <CallbackLoading callbackLogicHandler={handler} />;
};

export default DecisionDashboardCallback;
