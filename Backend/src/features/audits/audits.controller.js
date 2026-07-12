const asyncHandler = require('../../lib/asyncHandler');
const ApiResponse = require('../../lib/ApiResponse');
const { listAudits, initiateAudit, processAuditAction } = require('./audits.service');

// GET /api/audits
const list = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await listAudits({ employee: req.employee, status, page, limit });
  ApiResponse.success(res, result);
});

// POST /api/audits
const create = asyncHandler(async (req, res) => {
  const { name, scopeDepartmentId, scopeLocation, startDate, endDate, auditorIds } = req.body;
  const cycle = await initiateAudit({
    name,
    scopeDepartmentId,
    scopeLocation,
    startDate,
    endDate,
    auditorIds,
    organizationId: req.employee.organizationId,
  });
  ApiResponse.created(res, { cycle }, 'Audit cycle initiated');
});

// PATCH /api/audits/:id
const update = asyncHandler(async (req, res) => {
  const cycle = await processAuditAction({
    id: req.params.id,
    payload: req.body,
    employee: req.employee,
  });
  
  if (req.body.action === 'CLOSE') {
    const unverified = cycle.items.filter(i => i.result === 'PENDING').length;
    let msg = `Audit cycle closed. ${cycle.flaggedCount} assets flagged.`;
    if (unverified > 0) msg += ` (${unverified} items remained unverified)`;
    ApiResponse.success(res, { cycle }, msg);
  } else {
    ApiResponse.success(res, { cycle }, 'Audit item verified');
  }
});

module.exports = { list, create, update };
