import React, { useState, forwardRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';

function Hotjar(props) {
  let helmet;
  if (`${process.env.PM_HOTJAR_ENABLED}` === '1' && props.isHotJarEnabled) {
    helmet = (
      <Helmet>
        <script>{`
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${props.hotjarId},hjsv:${process.env.PM_HOTJAR_SNIPPET_VERSION}};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</script>
      </Helmet>
    );
  }

  return <>
    {helmet}
    {props.children}
  </>;
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

const ConnectedHotjar = connect(mapStateToProps, mapDispatchToProps)(Hotjar);

const ConnectedHotJarWithComponent = forwardRef((props, ref) => {
  const { WrappedComponent, hotjarId, ...rest } = props;
  const [isHotJarEnabled, setIsHotJarEnabled] = useState(false);

  return (
    <>
      {isHotJarEnabled && (
        <ConnectedHotjar
          hotjarId={hotjarId}
          isHotJarEnabled={isHotJarEnabled}
        />
      )}
      <WrappedComponent
        ref={ref}
        {...rest}
        isHotJarEnabled={isHotJarEnabled}
        setIsHotJarEnabled={setIsHotJarEnabled}
      />
    </>
  );
});

const WithHotjar = (hotjarId) => (WrappedComponent) => {
  const HotjarWrapper = forwardRef((props, ref) => (
    <ConnectedHotJarWithComponent
      {...props}
      ref={ref}
      hotjarId={hotjarId}
      WrappedComponent={WrappedComponent}
    />
  ));

  return HotjarWrapper;
};

export default WithHotjar;
