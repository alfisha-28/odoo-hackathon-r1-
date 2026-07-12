const { hashPassword, comparePassword } = require('../../common/utils/password.util');
const { signToken } = require('../../common/utils/jwt.util');
const { findEmployeeByEmail, findFirstOrganization, createEmployee } = require('./auth.repository');
const { mapEmployee } = require('./auth.mapper');
const ApiError = require('../../lib/ApiError');

/**
 * Signup — creates new Employee with hashed password and EMPLOYEE role.
 * Does NOT return a token; caller must explicitly login.
 */
const signup = async ({ name, email, password }) => {
  const existing = await findEmployeeByEmail(email);
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  // Use the first (and only) organization — single-tenant for this hackathon scope
  const org = await findFirstOrganization();
  if (!org) {
    throw ApiError.badRequest('No organization found. Run the seed script first.');
  }

  const passwordHash = await hashPassword(password);
  const employee = await createEmployee({ name, email, passwordHash, organizationId: org.id });

  return mapEmployee(employee);
};

/**
 * Login — verifies credentials and issues a JWT.
 */
const login = async ({ email, password }) => {
  const employee = await findEmployeeByEmail(email);
  if (!employee) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (employee.status === 'INACTIVE') {
    throw ApiError.unauthorized('Account is inactive. Please contact an administrator.');
  }

  const passwordMatch = await comparePassword(password, employee.passwordHash);
  if (!passwordMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const roles = employee.roles.map((r) => r.role);
  const token = signToken({ employeeId: employee.id, roles });

  return {
    token,
    employee: mapEmployee(employee),
  };
};

module.exports = { signup, login };
