import React from 'react';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import DecisionCard from '../../components/DecisionCard/index';
import { createNewStore } from '../../store';
import WithIntlForStories from '../WithIntlForStories';
import ReduxStateMother from '../../../tests/ReduxStateMother';
import { STATES_ENUM } from '../../../tests/ReduxStateMother/const';
import { AURA_DECISION_TYPES } from '../../utils/const';

export default {
  title: 'Components/DecisionCard',
  component: DecisionCard,
  // argTypes: {},
};

const state = {
  primary: {
    household: {
      firstName: 'Policy Me',
    },
  },
};

const Template = (args, { globals: { locale } }) => {
  const { store, ...restArgs } = args;
  return (<div id="main">
    <Provider store={store}>
      <WithIntlForStories lang={locale}>
        <DecisionCard {...restArgs} />
      </WithIntlForStories>
    </Provider>
  </div>);
};

export const ApprovedCard = Template.bind({});
ApprovedCard.args = {
  store: createNewStore(new ReduxStateMother(STATES_ENUM.JOURNEY_1_INDIV_APPROVED)),
  activeDecision: AURA_DECISION_TYPES.APPROVED,
  product: 'hd',
  userType: 'primary',
};

export const InReviewCard = Template.bind({});
InReviewCard.args = {
  store: createNewStore(new ReduxStateMother(STATES_ENUM.JOURNEY_1_INDIV_APPROVED)),
  activeDecision: AURA_DECISION_TYPES.REFER_TO_UNDERWRITER,
  product: 'hd',
  userType: 'primary',
};

export const PostponedCard = Template.bind({});
PostponedCard.args = {
  store: createNewStore(new ReduxStateMother(STATES_ENUM.JOURNEY_1_INDIV_APPROVED)),
  activeDecision: AURA_DECISION_TYPES.POSTPONED,
  product: 'hd',
  userType: 'primary',
};

export const DeclinedCard = Template.bind({});
DeclinedCard.args = {
  store: createNewStore(new ReduxStateMother(STATES_ENUM.JOURNEY_1_INDIV_APPROVED)),
  activeDecision: AURA_DECISION_TYPES.DECLINED,
  product: 'hd',
  userType: 'primary',
};
