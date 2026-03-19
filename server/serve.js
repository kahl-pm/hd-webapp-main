/**
 * Minimal production Express server for SPA.
 *
 * Serves the build/hd/ static files, handles ELB health checks,
 * and falls back to index.html for SPA client-side routing.
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const cookieParser = require('cookie-parser');

const app = express();
let PORT = 8080;
if (process.env.PM_IS_DOCKER !== undefined && String(process.env.PM_IS_DOCKER) === '1') {
  PORT = 3003;
}

// ELB health check middleware
const healthCheckMiddleware = (req, res, next) => {
  if (req.get('User-Agent') === 'ELB-HealthChecker/2.0') {
    res.sendStatus(200);
    return;
  }
  next();
};

app.use(healthCheckMiddleware);
app.use(cookieParser());

const buildPath = path.resolve(__dirname, '../build/hd');

// Serve static files with long cache (filenames are content-hashed)
app.use('/hd', express.static(buildPath, {
  maxAge: 31536000000, // 1 year in ms — safe because filenames are hashed
  index: false, // Don't auto-serve index.html on /hd/
}));

// SPA fallback: serve index.html for all non-static routes under /hd
app.get('/hd/*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.header({ 'Cache-Control': 'no-cache' });
    res.sendFile(indexPath);
  } else {
    res.status(500).send('Build not found. Run `npm run build` first.');
  }
});

// Redirect root to /hd/
app.get('/', (req, res) => {
  res.redirect('/hd/');
});

// Start server
if (process.env.PM_HTTPS && process.env.PM_HTTPS === 'true') {
  const options = {
    key: fs.readFileSync(path.resolve('./key.pem')),
    cert: fs.readFileSync(path.resolve('./cert.pem')),
  };
  const server = https.createServer(options, app);
  server.listen(PORT, () => {
    console.log(`SPA server listening @ https://localhost:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`SPA server listening @ http://localhost:${PORT}`);
  });
}
