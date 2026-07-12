const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listAllocations, allocateAsset, returnAsset } = require('./allocations.service');

// GET /api/allocations
const list = asyncHandler(async (req, res) => {
  const { assetId, employeeId, departmentId, status, overdue, page, limit } = req.query;
  const result = await listAllocations({
    employee: req.employee, // Passed for RBAC logic
    assetId,
    employeeId,
    departmentId,
    status,
    overdue,
    page,
    limit,
  });
  ApiResponse.success(res, result);
});

// POST /api/allocations
const create = asyncHandler(async (req, res) => {
  const { assetId, allocatedToEmpId, allocatedToDeptId, expectedReturnDate } = req.body;
  const allocation = await allocateAsset({
    assetId,
    allocatedToEmpId,
    allocatedToDeptId,
    expectedReturnDate,
    organizationId: req.employee.organizationId,
    allocatedById: req.employee.id,
  });
  ApiResponse.created(res, { allocation }, 'Asset allocated successfully');
});

// POST /api/allocations/:id/return
const returnAlloc = asyncHandler(async (req, res) => {
  const { checkInCondition, checkInNotes } = req.body;
  const allocation = await returnAsset({
    id: req.params.id,
    checkInCondition,
    checkInNotes,
    returnedApprovedById: req.employee.id,
  });
  ApiResponse.success(res, { allocation }, 'Asset returned successfully');
});

module.exports = { list, create, returnAlloc };
