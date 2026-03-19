const path = require('path');

module.exports = {
  "stories": [
    "../src/stories/**/*.stories.js",
  ],
  "addons": [
    "storybook-zeplin/register",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-react-intl"
  ],
  "framework": "@storybook/react",
}
