// Load express-async-errors first to intercept async route handler errors automatically
require('express-async-errors');

const express = require('express');
const security = require('./middleware/security.middleware');
const requestId = require('./middleware/request-id.middleware');
const requestLogger = require('./middleware/logger.middleware');
const notFound = require('./middleware/not-found.middleware');
const errorHandler = require('./middleware/error.middleware');
const routes = require('./routes');

const app = express();

// Trust proxy for reverse proxies like Nginx/Load Balancers
app.set('trust proxy', 1);

// 1. Core Security Middleware
app.use(security);

// 2. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Context & Request Logging
app.use(requestId);
app.use(requestLogger);

// 4. Routing Layer  (/api/health, /api/auth, /api/departments, ...)
app.use('/api', routes);

// 5. 404 Handler
app.use(notFound);

// 6. Global Centralized Error Handler
app.use(errorHandler);

module.exports = app;
