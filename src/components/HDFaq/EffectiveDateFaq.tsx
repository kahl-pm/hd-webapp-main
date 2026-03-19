import { Global } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, ChevronDownIcon, Typography, UniformSpacingLayout } from '@policyme/global-libjs-designsystem';
import { useDispatch } from 'react-redux';
import { handleFaqExpanded } from './handle';

export default () => {
  const dispatch = useDispatch();
  return (
    <>
      <Global
        styles={'.faq-innertext { text-align: left; }'}
      />
      <Typography
        variant="h1"
        component="h3"
        align="center"
        message={<FormattedMessage id="global.faq.YtkGdY" />}
        py="1rem"
        data-cy="effective-date-faq-title"
      />
      <UniformSpacingLayout
        gap="1rem"
        flexDirection="column"
        sx={{
          width: '100%',
        }}
      >
        <Accordion
          id="directBilling"
          variant="default"
          heading={<FormattedMessage id="effectiveDateFaq.directBilling.q7a2WZ" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="effectiveDateFaq.directBilling.XsPK0V"
                values={{ br: <br /> }}
              />
            </div>
          }
        />
        <Accordion
          id="startPlan"
          variant="default"
          heading={<FormattedMessage id="effectiveDateFaq.startPlan.o5mO38" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="effectiveDateFaq.startPlan.8aAzby"
                values={{ br: <br /> }}
              />
            </div>
          }
        />
        <Accordion
          id="paymentDate"
          variant="default"
          heading={<FormattedMessage id="effectiveDateFaq.paymentDate.pW2pH1" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="effectiveDateFaq.paymentDate.NEruav"
                values={{ br: <br /> }}
              />
            </div>
          }
        />
      </UniformSpacingLayout>
    </>
  );
};
