import React from 'react';
import { Helmet } from 'react-helmet';

function ReviewsIO(props) {
  const helmet = (
    <Helmet>
      <script src="https://widget.reviews.io/badge-modern/dist.js" type="text/javascript" />
      <script src="https://widget.reviews.io/carousel-inline-iframeless/dist.js?_t=2021050517" type="text/javascript" />
      <link rel="stylesheet" href="https://assets.reviews.io/css/widgets/carousel-widget.css?_t=2021050517" />
      <link rel="stylesheet" href="https://assets.reviews.io/iconfont/reviewsio-icons/style.css?_t=2021050517" />
    </Helmet>
  );

  return <>
    {helmet}
    {props.children}
  </>;
}

const WithReviewsIO = () => (WrappedComponent) => (props) => <>
  <ReviewsIO />
  <WrappedComponent {...props} />
</>;

export default WithReviewsIO;
