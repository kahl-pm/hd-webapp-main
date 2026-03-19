import React from 'react';
import { Provider } from 'react-redux';
import { createNewStore } from '../../store';

import ReduxState from '../../../tests/ReduxStateMother';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import JointContextCarousel from '../../components/JointContextCarousel';

export default {
  title: 'Components/JointContextCarousel',
  component: JointContextCarousel,
};

const Template = (args) => {
  const { store, ...restArgs } = args;
  return <Provider store={store}>
    <JointContextCarousel {...restArgs} />
  </Provider>;
};

export const Default = Template.bind({});
Default.args = {
  store: createNewStore(new ReduxState(STATES_ENUM.DEV_INIT)),
};
