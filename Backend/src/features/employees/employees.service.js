const { findEmployees, findEmployeeById, updateEmployee, replaceEmployeeRoles } = require('./employees.repository');
const { mapEmployee } = require('./employees.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const { hashPassword } = require('../../common/utils/password.util');
const ApiError = require('../../lib/ApiError');

const listEmployees = async ({ organizationId, search, role, status, page = 1, limit = 10 }) => {
  const { skip, take } = getPaginationData(page, limit, 0);
  const [employees, total] = await findEmployees({ organizationId, search, role, status, skip, take });
  const { meta } = getPaginationData(page, limit, total);
  return {
    employees: employees.map(mapEmployee),
    meta,
  };
};

const updateEmployeeById = async ({ id, roles, status, password, adminId }) => {
  const existing = await findEmployeeById(id);
  if (!existing) throw ApiError.notFound('Employee not found');

  if (roles && roles.length > 0) {
    await replaceEmployeeRoles(id, roles, adminId);
  }

  const passwordHash = password ? await hashPassword(password) : undefined;
  if (status || passwordHash) {
    await updateEmployee(id, { status, passwordHash });
  }

  const updated = await findEmployeeById(id);
  return mapEmployee(updated);
};

module.exports = { listEmployees, updateEmployeeById };
