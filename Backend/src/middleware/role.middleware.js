const ApiError = require('../lib/ApiError');

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.employee) {
    return next(ApiError.unauthorized('Not authenticated'));
  }

  const hasRole = req.employee.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }

  next();
};

module.exports = { requireRole };
