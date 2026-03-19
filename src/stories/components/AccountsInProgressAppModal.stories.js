import React from 'react';
import { Provider } from 'react-redux';
import AccountsInProgressAppModal from '../../components/AccountsInProgressAppModal';
import { createNewStore } from '../../store';

export default {
  title: 'Components/AccountsInProgressAppModal',
  component: AccountsInProgressAppModal,
  // argTypes: {},
};

const stateShortName = {
  primary: {
    household: {
      firstName: 'Kevin',
    },
  },
};

const stateLongName = {
  primary: {
    household: {
      firstName: 'ThisIsAVeryLongNameOverNineTeenChars',
    },
  },
};

const Template = (args) => {
  const { store, ...restArgs } = args;
  return (<div id="main">
    <Provider store={store}>
      <AccountsInProgressAppModal open {...restArgs} />
    </Provider>
  </div>);
};

export const AccountsInProgressModalShortName = Template.bind({});
AccountsInProgressModalShortName.args = {
  store: createNewStore(stateShortName),
};
export const AccountsInProgressModalLongName = Template.bind({});
AccountsInProgressModalLongName.args = {
  store: createNewStore(stateLongName),
};
