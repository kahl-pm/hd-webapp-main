import React from 'react';
import { Provider } from 'react-redux';
import WhatsNotCoveredModal from '../../components/WhatsNotCoveredModal';
import ReduxState from '../../../tests/ReduxStateMother';
import { createNewStore } from '../../store';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';

export default {
  title: 'Components/WhatsNotCoveredModal',
  component: WhatsNotCoveredModal,
  // argTypes: {},
};

const approvedState = new ReduxState(STATES_ENUM.DEV_INIT);

const Template = (args) => {
  const { store, ...restArgs } = args;
  return (<div id="main">
    <Provider store={store}>
      <WhatsNotCoveredModal {...restArgs} />
    </Provider>
  </div>);
};

export const WhatsNotCovered = Template.bind({});
WhatsNotCovered.args = {
  store: createNewStore(approvedState),
  exclusions: [
    { description: 'exclusions 11',
      exclusion_id: 'x123' },
    { description: 'exclusions 22',
      exclusion_id: 'x124' },
  ],
};
