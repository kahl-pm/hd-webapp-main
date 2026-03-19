import * as Sentry from '@sentry/node';
import { simpleHash } from '../src/utils/helpers';
import { SENTRY_ERROR_THROTTLE_LIMIT } from '../src/utils/const';

Sentry.init({
  dsn: process.env.SENTRY_DSK,
  environment: process.env.PM_ENVIRONMENT,
});

const eventCounts = new Map();

export const handleRenderError = (res, message) => {
  const fullMessage = `fatal server-side javascript error - ${message}`;
  console.error(fullMessage);

  const hash = simpleHash(fullMessage);
  const eventCount = eventCounts.get(hash) ?? 0;
  if (eventCount < SENTRY_ERROR_THROTTLE_LIMIT) {
    Sentry.withScope((scope) => {
      scope.setLevel('fatal');
      Sentry.captureMessage(fullMessage);
    });
    eventCounts.set(hash, eventCount + 1);
  }

  res.header({
    'Cache-Control': 'no-cache',
  });
  res.send(`
  <!doctype html>
  <html lang="en">
    <head></head>
    <body>
      <p>
        Our servers are having trouble right now, but we'll be back soon!
      </p>
    </body>
  </html>
  `);
};
