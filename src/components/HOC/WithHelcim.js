import React from 'react';
import { Helmet } from 'react-helmet';

function Helcim(props) {
  const helmet = (
    <Helmet>
      <script src="https://policyme.myhelcim.com/js/version2.js" />
    </Helmet>
  );

  return <>
    {helmet}
    {props.children}
  </>;
}

const WithHelcim = () => (WrappedComponent) => (props) => <>
  <Helcim />
  <WrappedComponent {...props} />
</>;

export default WithHelcim;
