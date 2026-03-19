import React from 'react';
import { CollapseCard } from '@policyme/global-libjs-designsystem';

const RepeatedHeader = (props: {
  removeItem: (id: string) => void;
  title: React.ReactNode;
  id: string;
  children: React.ReactNode;
  length: number;
  customTitle?: React.ReactNode;
  index: number;
}) => {
  const { removeItem, title, id, children, length, customTitle, index } = props;

  return (
    <CollapseCard
      title={customTitle || `${title} ${index + 1}`}
      deleteEnabled={length > 1}
      onCardDelete={() => removeItem(id)}
      hideEditPrompt
      expanded
    >
      {children}
    </CollapseCard>
  );
};

export default RepeatedHeader;
