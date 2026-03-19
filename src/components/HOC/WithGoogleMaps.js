import React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { encodeEnvVar, LOCALE } from '@policyme/global-libjs-utils';
import { getCurrentUser } from '../../Selectors/userControl';

const getMapsLang = (locale) => {
  if (locale === LOCALE.FR_CA) {
    return 'fr';
  }
  return 'en';
};

function GoogleMaps(props) {
  let helmet;
  const sessionToken = shortid.generate();
  const key = process.env[`${encodeEnvVar('PM_GOOGLE_MAPS_API_KEY')}`];
  if (key) {
    const maps_lang = getMapsLang(props.application_language);
    helmet = (
      <Helmet>
        <script async src={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places&sessiontoken=${sessionToken}&language=${maps_lang}`} />
      </Helmet>
    );
  } else {
    console.log('WARNING: missing Google Maps ID, not initializing');
  }

  return <>
    {helmet}
    {props.children}
  </>;
}

const mapStateToProps = state => ({
  application_language: state[getCurrentUser(state)].household.application_language,
});

const mapDispatchToProps = {
};

const ConnectedGoogleMaps = connect(mapStateToProps, mapDispatchToProps)(GoogleMaps);

const WithGoogleMaps = (WrappedComponent) => (props) => <>
  <ConnectedGoogleMaps />
  <WrappedComponent {...props} />
</>;

export default WithGoogleMaps;
