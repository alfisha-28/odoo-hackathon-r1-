const {
  findAuditCycles,
  findAuditCycleById,
  createAuditCycle,
  verifyAuditItem,
  closeAuditCycle,
} = require('./audits.repository');
const { mapAuditList, mapAuditDetail } = require('./audits.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const listAudits = async ({ employee, status, page, limit }) => {
  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER'].includes(r));
  const auditorId = isManager ? undefined : employee.id;

  const { skip, take } = getPaginationData(page, limit, 0);
  const [cycles, total] = await findAuditCycles({ auditorId, status, skip, take });
  const { meta } = getPaginationData(page, limit, total);
  
  return {
    data: cycles.map(mapAuditList),
    meta,
  };
};

const initiateAudit = async ({
  name, scopeDepartmentId, scopeLocation, startDate, endDate, auditorIds, organizationId
}) => {
  const cycle = await createAuditCycle({
    name, scopeDepartmentId, scopeLocation, startDate, endDate, auditorIds, organizationId
  });
  return mapAuditDetail(cycle);
};

const processAuditAction = async ({ id, payload, employee }) => {
  const cycle = await findAuditCycleById(id);
  if (!cycle) throw ApiError.notFound('Audit cycle not found');

  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER'].includes(r));

  if (payload.action === 'VERIFY') {
    // Only assigned auditors or managers can verify
    const isAssigned = cycle.assignments.some(a => a.auditor.id === employee.id);
    if (!isAssigned && !isManager) {
      throw ApiError.forbidden('Not authorized to verify items in this audit cycle');
    }
    
    if (cycle.status === 'CLOSED') {
      throw ApiError.badRequest('Cannot verify items in a closed audit cycle');
    }

    const { assetId, result, notes } = payload;
    
    // Check if item exists in this cycle
    const itemExists = cycle.items.some(i => i.asset.id === assetId);
    if (!itemExists) {
       throw ApiError.badRequest('Asset is not part of this audit cycle');
    }

    await verifyAuditItem({
      auditCycleId: id,
      assetId,
      result,
      notes,
      verifiedById: employee.id,
      organizationId: employee.organizationId,
    });

    // Refetch to return full updated cycle
    const updatedCycle = await findAuditCycleById(id);
    return mapAuditDetail(updatedCycle);

  } else if (payload.action === 'CLOSE') {
    if (!isManager) {
      throw ApiError.forbidden('Only managers can close an audit cycle');
    }
    if (cycle.status === 'CLOSED') {
      throw ApiError.badRequest('Audit cycle is already closed');
    }

    const updatedCycle = await closeAuditCycle({
      cycleId: id,
      closedById: employee.id,
      organizationId: employee.organizationId,
    });
    
    return mapAuditDetail(updatedCycle);
  }
};

module.exports = { listAudits, initiateAudit, processAuditAction };
