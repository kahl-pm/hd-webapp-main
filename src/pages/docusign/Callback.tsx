import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Typography } from '@policyme/global-libjs-designsystem';
import { FormattedMessage } from 'react-intl';
import Container from '../../components/Container';
import { handleDocusignCallback, handleDocusignPolicyDownloadCallback, handlePostDocusignRouting } from '../../NewActions/handle';
import { DOCUSIGN_CALLBACK_TYPE, USER_TYPES } from '../../utils/const';

const handleEsign = (userType) => async (dispatch, getState) => {
  await dispatch(handleDocusignCallback(userType));
  dispatch(handlePostDocusignRouting(userType));
};

const CloseWindow = ({ match }:RouteComponentProps<{userType:string}>) => {
  const dispatch = useDispatch();
  const userType = (match && match.params.userType) || USER_TYPES.PRIMARY;
  const docusignCallbackType = useSelector<any>(state => state.metadata.docusignCallbackType);
  useEffect(() => {
    if (docusignCallbackType === DOCUSIGN_CALLBACK_TYPE.REVIEW_ESIGN) {
      dispatch(handleEsign(userType));
    } else if (docusignCallbackType === DOCUSIGN_CALLBACK_TYPE.DOWNLOAD_MY_POLICY) {
      dispatch(handleDocusignPolicyDownloadCallback(userType));
    } else {
      console.error('Invalid Docusign Callback Type', docusignCallbackType);
    }
  }, []);

  return <Container>
    <Typography
      variant="h1"
      message={
        <FormattedMessage
          id="global.loading.S7Y132"
        />
      }
    />
  </Container>;
};

export default CloseWindow;
