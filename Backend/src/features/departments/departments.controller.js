const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listDepartments, saveDepartment } = require('./departments.service');

const list = asyncHandler(async (req, res) => {
  const departments = await listDepartments(req.employee.organizationId);
  ApiResponse.success(res, { departments });
});

const upsert = asyncHandler(async (req, res) => {
  const { id, name, parentId, headId, status } = req.body;
  const department = await saveDepartment({
    id,
    name,
    parentId,
    headId,
    status,
    organizationId: req.employee.organizationId,
  });
  const isNew = !req.body.id;
  if (isNew) {
    ApiResponse.created(res, { department }, 'Department created');
  } else {
    ApiResponse.success(res, { department }, 'Department updated');
  }
});

module.exports = { list, upsert };
