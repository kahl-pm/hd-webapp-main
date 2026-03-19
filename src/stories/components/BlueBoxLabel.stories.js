import React from 'react';
import BlueBoxLabel from '../../components/BlueBoxLabel';

export default {
  title: 'Components/BlueBoxLabel',
  component: BlueBoxLabel,
  // argTypes: {},
};

const Template = (args) => {
  return (<div id="main">
    <BlueBoxLabel {...args} />
  </div>);
};

export const BlueBox = Template.bind({});
BlueBox.args = {
  label: 'A few other factors',
};
