import React, { useContext } from 'react';
import { css, Global } from '@emotion/react';

export default () => {
  return (<>
    <Global
      styles={css`

    * {
      box-sizing: border-box;
    }

    html {
      background: $white;
      min-width: 18.75rem;
      height: 100%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      -webkit-touch-callout: none;
      -webkit-overflow-scrolling: touch;
      text-rendering: optimizeLegibility;
      text-size-adjust: 100%;
    }

    body {
      margin: 0;
      padding: 0;
      position: relative;
      line-height: 1.5;
      width: 100vw;
      overflow-x: hidden;
      max-height: 100%;
      height: 100%;
    }

    #root {
      height: 100%;
    }

    .App {
      display: -ms-grid;
      display: grid;

      -ms-grid-columns: 1fr;
      -ms-grid-rows: 2.5rem 1fr;
      // minmax(0, 1fr) is to fix mac safari issue with scrolling on input hover
      grid-template-rows: 2.5rem minmax(0, 1fr);

      @media (min-width: 1025px) {
        display: -ms-flexbox;
        display: flex;
      }
      height: 100%;
    }

    p:not(.new-design-system),
    ul li:not(.new-design-system),
    ol li:not(.new-design-system) {
      font-size: 1rem;
      @media #{$md-up} {
        font-size: 1.125rem;
      }
    }
    
    p:not(.new-design-system),
    h1:not(.new-design-system),
    h2:not(.new-design-system),
    h3:not(.new-design-system),
    h4:not(.new-design-system),
    h5:not(.new-design-system),
    h6:not(.new-design-system),
    ul:not(.new-design-system) li,
    ol:not(.new-design-system) li {
      max-width: 70rem;
      margin: auto;
    }

    h1:not(.new-design-system),
    h2:not(.new-design-system),
    h3:not(.new-design-system),
    h4:not(.new-design-system),
    h5:not(.new-design-system),
    h6:not(.new-design-system) {
      line-height: 1.25;
    }

    textarea:not(.new-design-system) {
      overflow-y: auto; /* IE11 */
    }

    button {
      cursor: pointer;
      outline: none;
      border: 0;
      padding: 0;
      background: transparent;
      transition: background-color 0.5s ease;
    }

    fieldset:not(.new-design-system) {
      padding: 0;
      margin: 0;
    }

    // This is similar to ::-webkit-input-placeholder from original css here
    // but since we don't want to apply this to new design system, we'll be using input selector here.
    input:not(.new-design-system)::placeholder,
    textarea:not(.new-design-system)::placeholder {
      opacity: 0.5;
      text-align: center;
    }

    input[type=number]::-webkit-inner-spin-button:not(.new-design-system),
    input[type=number]::-webkit-outer-spin-button:not(.new-design-system) {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }

    input[type='number']:not(.new-design-system) {
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    input[type='radio']:not(.new-design-system) {
      cursor: pointer;
    }

    input::-ms-clear:not(.new-design-system) {
      display: none;
    }

    .bold:not(.new-design-system) {
      font-weight: 700;
    }

    .text-center:not(.new-design-system) {
      text-align: center;
    }

    .ReactModal__Overlay {
      z-index: 200;
    }

    #main.disable-scroll {
      overflow-y: hidden;
    }

    #main {
      display: block;
      overflow-y: auto;
      height: 100%;
      > :global(*) {
        -webkit-transform: translate3d(0,0,0);
      }
    }

    h1:not(.new-design-system) {
      position: relative;
      font-size: 1.375rem;
      font-weight: 700;
      font-family: Lato, serif;
      margin-bottom: 1rem;
      text-align: center;
      @media #{$md-up} {
        font-size: 2rem;
      }
    }

    h2:not(.new-design-system),
    .h2:not(.new-design-system) {
      font-size: 1.1875rem;
      font-weight: 600;
      font-family: Lato, serif;
      margin-bottom: 1rem;
      text-align: center;
      @media #{$md-up} {
        font-size: 1.5rem;
      }
    }

    h3:not(.new-design-system),
    .h3:not(.new-design-system) {
      font-size: 1.0625rem;
      font-weight: 600;
      font-family: Lato, serif;
      margin-bottom: 1rem;
      text-align: center;
      @media #{$md-up} {
        font-size: 1.175rem;
      }
    }

    .sr-only:not(.new-design-system) {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      border: 0;
    }`}
    />
  </>);
};
