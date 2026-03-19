// this is needed to resolve a circular dependency between utils/helpers and actions/metadata
// caused by withRetry etc. needing to dispatch these actions despite being a utils function

function updateErrorState(retryFn, resolveRetry, rejectRetry, error) {
  return {
    type: '@@metadata/request_error',
    error,
    retryFn,
    resolveRetry,
    rejectRetry,
  };
}

export function updateIsLoading(value) {
  return {
    type: '@@metadata/update_metadata',
    property: 'isLoading',
    value,
  };
}

export function openErrorModal(retryFn, error) {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      dispatch(updateErrorState(retryFn, resolve, reject, error));
    });
  };
}

export function updateSentEappsMessage(value) {
  return {
    type: '@@metadata/update_metadata',
    property: 'sentEappsMessage',
    value,
  };
}
