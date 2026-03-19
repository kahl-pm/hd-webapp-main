import React from 'react';

export default function PointsCircle() {
  return (
    <svg
      width="100px"
      height="100px"
      viewBox="0 0 100 100"
      version="1.1"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient
          x1="22.1367188%"
          y1="11.0546875%"
          x2="100%"
          y2="106.867188%"
          id="a"
        >
          <stop stopColor="#FAD961" offset="0%" />
          <stop stopColor="#F76B1C" offset="100%" />
        </linearGradient>
      </defs>
      <circle fill="url(#a)" cx={50} cy={50} r={50} fillRule="evenodd" />
    </svg>
  );
}
