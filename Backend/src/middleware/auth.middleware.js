const { verifyToken } = require('../common/utils/jwt.util');
const ApiError = require('../lib/ApiError');
const prisma = require('../config/prisma');

/**
 * Verifies the JWT bearer token and attaches req.employee with roles array.
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No token provided'));
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    // Fetch fresh employee + roles from DB so revoked/inactive accounts are caught
    const employee = await prisma.employee.findUnique({
      where: { id: payload.employeeId },
      include: { roles: { select: { role: true } } },
    });

    if (!employee || employee.status === 'INACTIVE') {
      return next(ApiError.unauthorized('Account not found or inactive'));
    }

    req.employee = {
      ...employee,
      roles: employee.roles.map((r) => r.role),
    };

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

module.exports = { authenticate };
