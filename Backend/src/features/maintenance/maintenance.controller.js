const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listMaintenance, raiseMaintenance, processMaintenance } = require('./maintenance.service');

// GET /api/maintenance
const list = asyncHandler(async (req, res) => {
  const { assetId, status, priority, page, limit } = req.query;
  const result = await listMaintenance({ assetId, status, priority, page, limit });
  ApiResponse.success(res, result);
});

// POST /api/maintenance
const create = asyncHandler(async (req, res) => {
  const { assetId, issueDescription, priority, photoUrl } = req.body;
  const request = await raiseMaintenance({
    assetId,
    issueDescription,
    priority,
    photoUrl,
    organizationId: req.employee.organizationId,
    raisedById: req.employee.id,
  });
  ApiResponse.created(res, { request }, 'Maintenance request raised successfully');
});

// PATCH /api/maintenance/:id
const update = asyncHandler(async (req, res) => {
  const request = await processMaintenance({
    id: req.params.id,
    payload: req.body,
    employee: req.employee,
  });
  ApiResponse.success(res, { request }, `Maintenance request ${req.body.status.toLowerCase()} successfully`);
});

module.exports = { list, create, update };
