import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { buildEnvDefines } from './config/envHelper.js';
import fs from 'fs';
import path from 'path';

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
    ...buildEnvDefines(),
  },

  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'],
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
  },
}));
