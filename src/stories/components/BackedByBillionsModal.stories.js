import React from 'react';
import { Provider } from 'react-redux';
import BackedByBillionsModal from '../../components/BackedByBillionsModal';
import ReduxState from '../../../tests/ReduxStateMother';
import { createNewStore } from '../../store';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';

export default {
  title: 'Components/BackedByBillionsModal',
  component: BackedByBillionsModal,
  // argTypes: {},
};

const approvedState = new ReduxState(STATES_ENUM.DEV_INIT);

const Template = (args) => {
  const { store, ...restArgs } = args;
  return (<div id="main">
    <Provider store={store}>
      <BackedByBillionsModal />
    </Provider>
  </div>);
};

export const BackedByBillions = Template.bind({});
BackedByBillions.args = {
  store: createNewStore(approvedState),
};
