import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load .env into process.env BEFORE buildEnvDefines() reads it.
// Vite does not populate process.env from .env files at config-load time,
// so without this, buildEnvDefines() would only see shell env vars and
// none of the PM_*, LOCAL_TENANT_*, etc. values from .env.
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });

const { buildEnvDefines } = require('./config/envHelper.js');
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig(({ mode }) => ({
  base: '/hd/',

  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        presets: [
          ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
          '@emotion/babel-preset-css-prop',
        ],
        plugins: [
          [
            'formatjs',
            {
              idInterpolationPattern: '[sha512:contenthash:base64:6]',
              ast: true,
            },
          ],
        ],
      },
    }),
    // Copy environment.js to build output for EB runtime injection
    {
      name: 'copy-environment-js',
      closeBundle() {
        const src = path.resolve(__dirname, 'server/environment.js');
        const dest = path.resolve(__dirname, 'build/hd/environment.js');
        if (fs.existsSync(src)) {
          fs.mkdirSync(path.dirname(dest), { recursive: true });
          fs.copyFileSync(src, dest);
          console.log('Copied server/environment.js to build/hd/environment.js');
        }
      },
    },
    mode === 'production' &&
      sentryVitePlugin({
        authToken: process.env.SENTRY_AUTH_TOKEN,
        org: 'policyme',
        project: 'hd-webapp-main',
      }),
  ].filter(Boolean),

  define: {
    'process.env.BROWSER': JSON.stringify(true),
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.RELEASE_VERSION': JSON.stringify(pkg.version),
    'process.env.GLOBAL_ROUTE': JSON.stringify('/hd'),
    // LOCAL_TENANT* vars are needed by getTenantInfo() in @policyme/global-libjs-utils
    // but don't match the PM_*/SENTRY_*/CLIENT_* prefixes in buildEnvDefines()
    ...(process.env.LOCAL_TENANT_ID && {
      'process.env.LOCAL_TENANT_ID': JSON.stringify(process.env.LOCAL_TENANT_ID),
    }),
    ...(process.env.LOCAL_TENANT && {
      'process.env.LOCAL_TENANT': JSON.stringify(process.env.LOCAL_TENANT),
    }),
    ...(process.env.LOCAL_TENANT_SUBORGANIZATION_ID && {
      'process.env.LOCAL_TENANT_SUBORGANIZATION_ID': JSON.stringify(process.env.LOCAL_TENANT_SUBORGANIZATION_ID),
    }),
    ...(process.env.LOCAL_TENANT_SUBORGANIZATION && {
      'process.env.LOCAL_TENANT_SUBORGANIZATION': JSON.stringify(process.env.LOCAL_TENANT_SUBORGANIZATION),
    }),
    ...buildEnvDefines(),
  },

  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'],
  },

  // Treat .js files as JSX since the codebase uses JSX in .js files throughout
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://test.policyme.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },

  build: {
    outDir: 'build/hd',
    sourcemap: process.env.GENERATE_SOURCEMAP === '1',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'redux', 'react-redux', 'react-router-dom'],
        },
      },
    },
  },

  css: {
    // CSS is handled natively by Vite - no loaders needed
  },

  // Ensure Vite doesn't try to optimize CJS deps that cause issues
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-redux', 'redux', 'connected-react-router'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
}));
