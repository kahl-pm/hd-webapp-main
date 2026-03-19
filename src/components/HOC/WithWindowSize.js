import React from 'react';

const smBreakpoint = 576;
const mdBreakpoint = 768;
const lgBreakpoint = 992;
const xlBreakpoint = 1200;

export default (WrappedComponent) => {
  return class WithWindowSize extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        width: (typeof window !== 'undefined') ? window.innerWidth : 0,
        height: (typeof window !== 'undefined') ? window.innerHeight : 0,
      };

      this.listener = this.handleResize.bind(this);
    }

    componentDidMount() {
      (typeof window !== 'undefined') && window.addEventListener('resize', this.listener);
    }

    componentWillUnmount() {
      (typeof window !== 'undefined') && window.removeEventListener('resize', this.listener);
    }

    handleResize(e) {
      this.setState((state) => ({
        width: (typeof window !== 'undefined') ? window.innerWidth : 0,
        height: (typeof window !== 'undefined') ? window.innerHeight : 0,
      }));
    }

    render() {
      const windowProps = {
        width: this.state.width,
        height: this.state.height,
        isSmUp: this.state.width >= smBreakpoint,
        isMdUp: this.state.width >= mdBreakpoint,
        isLgUp: this.state.width >= lgBreakpoint,
        isXlUp: this.state.width >= xlBreakpoint,
      };
      return <WrappedComponent
        {...windowProps}
        {...this.props}
      />;
    }
  };
};
