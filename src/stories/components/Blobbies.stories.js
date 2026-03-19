import React from 'react';
import { FamilyCompBackgroundWithHumanSvg, CiDefenderSvg, FamilyCompBackground, FamilyCompChild1, FamilyCompChild2, FamilyCompPartner, FamilyCompPuppers } from '../../components/ThemedSvgs/blobbies';

export default {
  title: 'Components/Blobbies',
  component: FamilyCompBackgroundWithHumanSvg,
  // argTypes: {},
};

const FamilyIconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompBackgroundWithHumanSvg {...args} />
  </div>);
};

const FamilyBgIconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompBackground {...args} />
  </div>);
};

const FamilyChild1IconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompChild1 {...args} />
  </div>);
};

const FamilyChild2IconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompChild2 {...args} />
  </div>);
};

const FamilyPartnerIconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompPartner {...args} />
  </div>);
};

const FamilyPuppersIconTemplate = (args) => {
  return (<div id="main">
    <FamilyCompPuppers {...args} />
  </div>);
};

const CiDefenderTemplate = (args) => {
  return (<div>
    <CiDefenderSvg {...args} />
  </div>);
};

export const CiDefenderIcon = CiDefenderTemplate.bind({});
CiDefenderIcon.args = {
  fill: '#E6F9FF',
  stroke: '#004f78',
};

export const CiDefenderIconCaa = CiDefenderTemplate.bind({});
CiDefenderIconCaa.args = {
  fill: '#d5e5ff',
  stroke: '#020c27',
};

export const FamilyIcon = FamilyIconTemplate.bind({});
FamilyIcon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};

export const FamilyIconCaa = FamilyIconTemplate.bind({});
FamilyIconCaa.args = {
  sofaFill: '#be3221',
  stroke: '#020c27',
};

export const FamilyBgIcon = FamilyBgIconTemplate.bind({});
FamilyBgIcon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};

export const FamilyChild1Icon = FamilyChild1IconTemplate.bind({});
FamilyChild1Icon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};

export const FamilyChild2Icon = FamilyChild2IconTemplate.bind({});
FamilyChild2Icon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};

export const FamilyPartnerIcon = FamilyPartnerIconTemplate.bind({});
FamilyPartnerIcon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};

export const FamilyPuppersIcon = FamilyPuppersIconTemplate.bind({});
FamilyPuppersIcon.args = {
  sofaFill: '#E6F9FF',
  stroke: '#004f78',
};
