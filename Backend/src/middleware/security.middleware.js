const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
  // Allow all origins by default in dev, can configure with env variable
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
  credentials: true,
};

// Bundle them together for clean registration in app.js
const security = [
  helmet(),
  cors(corsOptions)
];

module.exports = security;
