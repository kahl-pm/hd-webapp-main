import React from 'react';
import { Provider } from 'react-redux';
import PaymentFreqCard from '../../components/PaymentFrequencyCard/index';
import { createNewStore } from '../../store';
import ReduxState from '../../../tests/ReduxStateMother';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import Form from '../../components/Form';

export default {
  title: 'Components/PaymentFreqCard',
  component: PaymentFreqCard,
  // argTypes: {},
};

const Template = (args) => {
  const { store, ...restArgs } = args;
  return (<div id="main">
    <Provider store={store}>
      <Form
        name="Payment"
        disableSlide={false}
        className="wide"
        start="0rem"
        end="1.75rem"
        onSubmit={() => {}}
      >
        <PaymentFreqCard {...restArgs} />
      </Form>
    </Provider>
  </div>);
};

export const card = Template.bind({});
card.args = {
  store: createNewStore(new ReduxState(STATES_ENUM.JOURNEY_1_INDIV_APPROVED)),
  match: {
    params: {
      userType: 'primary',
    },
  },
};
