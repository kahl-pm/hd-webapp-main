import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import { LOCALE } from '@policyme/global-libjs-utils';
import { loadLocaleData } from '../store/helpers';

const WithIntlForStories = (props) => {
  const [locale, setLocale] = useState(props.lang);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    setLocale(props.lang);
    async function _setMessages() {
      setMessages(await loadLocaleData(props.lang));
    }
    _setMessages();
  }, [props.lang]);

  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale={LOCALE.EN_CA}>
      {props.children}
    </IntlProvider>
  );
};

WithIntlForStories.propTypes = {
  lang: PropTypes.oneOf(Object.values(LOCALE)),
  children: PropTypes.node.isRequired,
};

WithIntlForStories.defaultProps = {
  lang: null,
};

export default WithIntlForStories;
