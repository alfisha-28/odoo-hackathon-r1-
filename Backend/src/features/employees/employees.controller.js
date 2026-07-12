const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listEmployees, updateEmployeeById } = require('./employees.service');

const list = asyncHandler(async (req, res) => {
  const { page, limit, search, role, status } = req.query;
  const result = await listEmployees({
    organizationId: req.employee.organizationId,
    search,
    role,
    status,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 10,
  });
  ApiResponse.success(res, result);
});

const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { roles, status, password } = req.body;
  const employee = await updateEmployeeById({
    id,
    roles,
    status,
    password,
    adminId: req.employee.id,
  });
  ApiResponse.success(res, { employee }, 'Employee updated');
});

module.exports = { list, update };
