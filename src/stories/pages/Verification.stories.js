import React from 'react';
import { Provider } from 'react-redux';
import { createNewStore } from '../../store';

import ReduxState from '../../../tests/ReduxStateMother';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import Verification from '../../pages/Verification';

export default {
  title: 'Pages/Verification',
  component: Verification,
};

const Template = (args) => {
  const { store, ...restArgs } = args;
  return <Provider store={store}>
    <Verification {...restArgs} />
  </Provider>;
};

export const VerificationPage = Template.bind({});
VerificationPage.args = {
  store: createNewStore(new ReduxState(STATES_ENUM.DEV_INIT)),
};
