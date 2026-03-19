import React from 'react';
import { connect } from 'react-redux';
import { Progress } from '@policyme/global-libjs-designsystem';

function Loading(props) {
  return (
    <Progress
      name="loading"
      variant="fullScreen"
      onOverlay
      show={props.isLoading && !props.hasError}
    />
  );
}

const mapStateToProps = state => state.metadata;

export default connect(mapStateToProps)(Loading);
