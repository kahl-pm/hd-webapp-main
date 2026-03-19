import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';
import { PAGE_NAMES } from '../utils/const';
import { getMainProductEventPrefix } from '../Selectors/helpers/productApp';

class NotFound extends Component {
  componentDidMount() {}

  render() {
    return (
      <center style={{ paddingTop: '2rem' }}>
        <h1 style={{ fontSize: '4.2rem' }}>
          <FormattedMessage
            id="notFound.title.7kuWVv"
          />
        </h1>
        <p style={{ fontSize: '1.5rem' }}>
          <FormattedMessage
            id="notFound.body.pvX6I3"
          />
        </p>
        <Link to="/" style={{ fontSize: '2rem', paddingTop: '1rem', display: 'block' }} href="/">
          <FormattedMessage
            id="notFound.getAdvice.xGwU0j"
          />
        </Link>
      </center>
    );
  }
}

const mapDispatchToProps = {};

const mapStateToProps = state => ({
  router: state.router,
  productPrefix: getMainProductEventPrefix(state, state.userControl.currentUser),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
