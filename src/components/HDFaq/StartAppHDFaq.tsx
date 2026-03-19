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
        data-cy="start-app-faq-title"
      />
      <UniformSpacingLayout
        gap="1rem"
        flexDirection="column"
        sx={{
          width: '100%',
        }}
      >
        <Accordion
          id="cancellationPolicy"
          variant="default"
          heading={<FormattedMessage id="startAppFaq.cancellation.xLqIfS" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="startAppFaq.cancellation.C8jZXq"
                values={{ br: <br /> }}
              />
            </div>
        }
        />
        <Accordion
          id="addRemoveFamily"
          variant="default"
          heading={<FormattedMessage id="startAppFaq.change.x2pJ8m" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="startAppFaq.change.i3Sjjc"
                values={{ br: <br /> }}
              />
            </div>
        }
        />
        <Accordion
          id="upgradePolicy"
          variant="default"
          heading={<FormattedMessage id="startAppFaq.upgrade.fy4UZD" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="startAppFaq.upgrade.JtMhBd"
                values={{ br: <br /> }}
              />
            </div>
        }
        />
        <Accordion
          id="coverageAmount"
          variant="default"
          heading={<FormattedMessage id="startAppFaq.amount.Ur3o0W" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="startAppFaq.amount.9KiYqH"
                values={{ br: <br /> }}
              />
            </div>
        }
        />
        <Accordion
          id="ReasonableCustomaryLimits"
          variant="default"
          heading={<FormattedMessage id="startAppFaq.limits.Fqy0HI" />}
          icon={ChevronDownIcon}
          onChange={(event, expanded) => handleFaqExpanded(event, expanded, dispatch)}
          detail={
            <div className="faq-innertext">
              <FormattedMessage
                id="startAppFaq.limits.k00HRn"
                values={{ br: <br /> }}
              />
            </div>
        }
        />
      </UniformSpacingLayout>
    </>
  );
};
