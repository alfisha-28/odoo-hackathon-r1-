const crypto = require('crypto');

/**
 * Middleware that assigns a unique request ID to each incoming request.
 * It reads the 'X-Request-Id' header if present, otherwise generates a new UUID.
 * The ID is attached to the request object (req.id) and sent back in the response headers.
 */
function requestId(req, res, next) {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
}

module.exports = requestId;
