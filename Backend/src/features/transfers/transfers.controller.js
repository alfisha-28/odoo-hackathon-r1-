const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listTransfers, requestTransfer, processTransfer } = require('./transfers.service');

// GET /api/transfers
const list = asyncHandler(async (req, res) => {
  const { assetId, status, page, limit } = req.query;
  const result = await listTransfers({
    employee: req.employee,
    assetId,
    status,
    page,
    limit,
  });
  ApiResponse.success(res, result);
});

// POST /api/transfers
const create = asyncHandler(async (req, res) => {
  const { assetId, requestedToEmpId, requestedToDeptId, reason } = req.body;
  const transfer = await requestTransfer({
    assetId,
    requestedToEmpId,
    requestedToDeptId,
    reason,
    organizationId: req.employee.organizationId,
    requestedById: req.employee.id,
  });
  ApiResponse.created(res, { transfer }, 'Transfer request submitted');
});

// PATCH /api/transfers/:id
const update = asyncHandler(async (req, res) => {
  const { action, reason } = req.body;
  const transfer = await processTransfer({
    id: req.params.id,
    action,
    reason,
    employee: req.employee,
  });
  ApiResponse.success(res, { transfer }, `Transfer ${action.toLowerCase()}d successfully`);
});

module.exports = { list, create, update };
