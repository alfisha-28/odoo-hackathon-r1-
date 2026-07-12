const { NotFoundError } = require('../lib/errors');

/**
 * Fallback middleware for handling undefined endpoints (404 Not Found).
 */
function notFound(req, res, next) {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
