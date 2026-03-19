import React from 'react';

export const createAndFetchAccordionRef = (accordionData) => {
  const accordionKeys = accordionData.map((accordion) => accordion.key);
  const createAccordionRef = (acc, key) => ({
    ...acc,
    [key]: React.createRef(),
  });
  return accordionKeys.reduce(createAccordionRef, {});
};
