const logger = require('../config/logger');

/**
 * Middleware that logs incoming HTTP requests and their responses.
 * Calculates duration and logs structured data.
 */
function requestLogger(req, res, next) {
  const startTime = process.hrtime();

  // Log incoming request
  logger.debug(
    {
      id: req.id,
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip,
    },
    `Incoming request: ${req.method} ${req.originalUrl || req.url}`
  );

  // Hook into response finish event to log outcome
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

    const logPayload = {
      id: req.id,
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration: `${durationMs}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    if (res.statusCode >= 500) {
      logger.error(logPayload, `HTTP ${res.statusCode} - Server Error`);
    } else if (res.statusCode >= 400) {
      logger.warn(logPayload, `HTTP ${res.statusCode} - Client Error`);
    } else {
      logger.info(logPayload, `HTTP ${res.statusCode} - Success`);
    }
  });

  next();
}

module.exports = requestLogger;
