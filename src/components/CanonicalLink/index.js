import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { GLOBAL_ROUTE } from '../../config';

// ST-843: This component is required to dynamically add canonical links to the header of the page.

function CanonicalLink(props) {
  return (
    <Helmet>
      <link rel="canonical" href={`https://${window.location.host}${GLOBAL_ROUTE}${props.route}`} />
    </Helmet>
  );
}

const mapStateToProps = state => ({
  route: state.router.location.pathname,
});

export default connect(mapStateToProps)(CanonicalLink);
