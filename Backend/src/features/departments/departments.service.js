const { findAllDepartments, findDepartmentById, upsertDepartment } = require('./departments.repository');
const { mapDepartment } = require('./departments.mapper');
const ApiError = require('../../lib/ApiError');

const listDepartments = async (organizationId) => {
  const departments = await findAllDepartments(organizationId);
  return departments.map(mapDepartment);
};

const saveDepartment = async ({ id, name, parentId, headId, status, organizationId }) => {
  // If updating, verify it exists
  if (id) {
    const existing = await findDepartmentById(id);
    if (!existing) throw ApiError.notFound('Department not found');
  }

  const dept = await upsertDepartment({ id, name, parentId, headId, status, organizationId });
  return mapDepartment(dept);
};

module.exports = { listDepartments, saveDepartment };
