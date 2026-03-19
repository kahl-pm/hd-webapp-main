import React from 'react';
import { Provider } from 'react-redux';
import { createNewStore } from '../../store';

import ReduxState from '../../../tests/ReduxStateMother';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import BackToCouplesDashboard from '../../components/BackToCouplesDashboard';

export default {
  title: 'Components/BackToCouplesDashboard',
  component: BackToCouplesDashboard,
};

const Template = (args) => {
  const { store, ...restArgs } = args;
  return <Provider store={store}>
    <div className="approved-thankyou-container">
      <BackToCouplesDashboard {...restArgs} />
    </div>
  </Provider>;
};

export const Default = Template.bind({});
Default.args = {
  store: createNewStore(new ReduxState(STATES_ENUM.DEV_INIT)),
};
