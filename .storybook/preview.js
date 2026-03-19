import { useEffect, useMemo } from 'react';
import { ThemeProvider, CustomisationProvider } from '@policyme/global-libjs-layout';
import { THEMES, LOCALE } from '@policyme/global-libjs-utils';
import TENANT_CONFIGS from '@policyme/global-libjs-utils/dist/config/tenants';
import GlobalCSS from '../src/GlobalCSS';
import GoogleFonts from '../src/static/fonts';
import { reactIntl } from "./reactIntl";
import { getTenantCustomisationConfig } from '../src/tenant/customisation';

const TENANT_BY_THEME = Object.fromEntries(
  Object
    .values(TENANT_CONFIGS)
    .map((tenant) => [tenant.theme, tenant])
);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    [LOCALE.EN_CA]: 'English',
    [LOCALE.FR_CA]: 'French',
  },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: THEMES.policyme_original,
    toolbar: {
      // The icon for the toolbar item
      icon: 'circlehollow',
      // Array of options
      items: [
        { value: THEMES.policyme_original, title: 'policyme' },
        { value: THEMES.CAA, title: 'caa' },
        { value: THEMES.CIBC, title: 'cibc'},
      ],
      // Property that specifies if the name of the item will be displayed
      showName: true,
    },
  },
};

const getTheme = (context) => context.parameters.theme || context.globals.theme;

const InitTenantContext = (Story, context) => {
  const theme = getTheme(context);
  useMemo(() => {
    const tenant = TENANT_BY_THEME[theme];
    window.__policyme = {
      FLAGS: {},
      PUBLICKEYS: {},
      TENANT: {
        code: tenant.code,
        id: tenant.id,
        name: tenant.name,
      },
      THEME: theme,
      URLS: {},
    }
  }, [ theme ]);
  return <Story />;
};

// Note: Decorators are applied in reverse order
export const decorators = [
  (Story, context) => {
    const theme = getTheme(context);
    return (
      <ThemeProvider theme={theme}>
        <CustomisationProvider
          abTestConfig={[]}
          abTestBand='control'
          tenantConfig={getTenantCustomisationConfig()}
        >
          <div>
            <div dangerouslySetInnerHTML={{__html: GoogleFonts}} />
            <GlobalCSS />
            <Story />
          </div>
        </CustomisationProvider>
      </ThemeProvider>
  )},
  InitTenantContext,
]