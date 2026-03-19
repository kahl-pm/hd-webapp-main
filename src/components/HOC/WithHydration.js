import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { handleHydration } from '../../NewActions/handle';

export default (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(handleHydration());
  }, []);
  return (<WrappedComponent {...props} />);
};
