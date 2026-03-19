import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { LOCALE, sentryError } from '@policyme/global-libjs-utils';
import { getCurrentUser } from '../../Selectors/userControl';
import { loadLocaleData } from '../../store/helpers';

// exported for cypress
export const IntlProviderWithMessages = (props) => {
  const [messages, setMessages] = useState(null);
  useEffect(() => {
    // If language changes, reload messages
    async function _setMessages() {
      setMessages(await loadLocaleData(props.application_language));
    }
    _setMessages();
  }, [props.application_language]);
  return (
    <IntlProvider
      messages={messages}
      locale={props.application_language}
      defaultLocale={LOCALE.EN_CA}
      onError={(err) => {
        // Sends missing translations / translations with bad formats to sentry
        if (process.env.NODE_ENV === 'development') {
          console.log('REACT INTL ERROR: ', err);
        }
        sentryError(err);
      }}
    >
      {/* Prevents message id from flashing for a split second
      on the screen before messages are loaded
      TODO: Replace with LoadingComponent once whitelabelling is merged
      */}
      {messages ? props.children : <div style={{ position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.25)', zIndex: 9999 }}>
        {/* TODO: Add spinner */}
      </div>}
    </IntlProvider>
  );
};

const WithInternationalization = (WrappedComponent) => (props) => {
  const { application_language, ...passThroughProps } = props;
  return (
    <IntlProviderWithMessages application_language={application_language}>
      <WrappedComponent {...passThroughProps} />
    </IntlProviderWithMessages>
  );
};

const mapDispatchToProps = {
};

const mapStateToProps = (state, props) => {
  const currentUser = getCurrentUser(state);
  return {
    application_language: state[currentUser].household.application_language,
  };
};

export default (WrappedComponent) => connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithInternationalization(WrappedComponent));
