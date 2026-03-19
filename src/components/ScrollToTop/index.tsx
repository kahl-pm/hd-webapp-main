import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

class ScrollToTop extends React.Component<RouteComponentProps & { children: React.ReactNode}> {
  componentDidUpdate(prevProps) {
    if (process.env.BROWSER && this.props.location !== prevProps.location) {
      document.getElementById('main').scrollTop = 0;
    }
  }

  render() {
    return this.props.children;
  }
}

const ScrollToTopWithRouter = withRouter(ScrollToTop);

export default ScrollToTopWithRouter;
