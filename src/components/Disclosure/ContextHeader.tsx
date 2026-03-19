import React from 'react';
import { Badge, ChevronRightIcon, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';

type ContextHeaderProps = {
  data: {
    context: string[];
  };
};

const ContextHeader = (props: ContextHeaderProps) => {
  const {
    data: {
      context,
    },
  } = props;

  let displayReferences = <></>;

  if (context) {
    const displayReferenceFirst = context[0];
    const displayReferenceLast = context[context.length - 1];

    if (context.length >= 4) {
      const middleReference = context.length > 2 ? context[context.length - 2].length > 30
        ? `${context[context.length - 2].slice(0, 30)}...`
        : context[context.length - 2]
        : '';

      displayReferences = (
        <Badge
          label={
            <UniformSpacingLayout flexDirection="row" gap="0.1rem" flexWrap="wrap">
              {displayReferenceFirst}
              <ChevronRightIcon variant="plain" />
              ...
              <ChevronRightIcon variant="plain" />
              {middleReference && middleReference}
              <ChevronRightIcon variant="plain" />
              {displayReferenceLast}
            </UniformSpacingLayout>
          }
          type="success"
          variant="filled"
        />
      );
    } else {
      displayReferences = <Badge
        label={
          <UniformSpacingLayout flexDirection="row" gap="0.1rem" flexWrap="wrap">
            {context.map((reference, index) => {
              if (index < context.length - 1) {
                return (
                  <>
                    {reference}
                    <ChevronRightIcon variant="plain" />
                  </>
                );
              }
              return reference;
            })}
          </UniformSpacingLayout>
          }
        type="success"
        variant="filled"
      />;
    }
  }

  return (context && context.length > 0 ? (
    <UniformSpacingLayout textAlign="center">
      {displayReferences}
    </UniformSpacingLayout>
  ) : <></>);
};

export default ContextHeader;
