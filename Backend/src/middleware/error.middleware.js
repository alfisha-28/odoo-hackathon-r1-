const logger = require('../config/logger');
const env = require('../config/env');
const { error: errorResponse } = require('../lib/response');
const { AppError } = require('../lib/errors');

/**
 * Centralized error handling middleware for Express.
 * Catches all errors thrown synchronously or asynchronously (via express-async-errors).
 */
function errorHandler(err, req, res, next) {
  // If headers are already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  // Operational, trusted errors (e.g. ValidationError, NotFoundError)
  if (err instanceof AppError) {
    logger.warn(
      {
        id: req.id,
        status: err.statusCode,
        message: err.message,
        errors: err.errors,
      },
      `Operational Error: ${err.message}`
    );

    return res.status(err.statusCode).json(
      errorResponse(err.message, err.errors)
    );
  }

  // Non-operational, unexpected errors (e.g. programmatic bugs, db connection failures)
  logger.error(
    {
      id: req.id,
      err: {
        message: err.message,
        stack: err.stack,
      },
    },
    'Unhandled Exception Error'
  );

  const responseMessage = env.isDev ? err.message : 'Internal Server Error';
  const errorDetails = env.isDev ? { stack: err.stack } : null;

  return res.status(500).json(
    errorResponse(responseMessage, errorDetails)
  );
}

module.exports = errorHandler;
