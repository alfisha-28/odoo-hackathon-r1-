const {
  findMaintenanceRequests,
  findMaintenanceById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
} = require('./maintenance.repository');
const { findAssetById } = require('../assets/assets.repository');
const { mapMaintenanceList, mapMaintenanceDetail } = require('./maintenance.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const listMaintenance = async ({ assetId, status, priority, page, limit }) => {
  const { skip, take } = getPaginationData(page, limit, 0);
  const [requests, total] = await findMaintenanceRequests({ assetId, status, priority, skip, take });
  const { meta } = getPaginationData(page, limit, total);
  
  return {
    data: requests.map(mapMaintenanceList),
    meta,
  };
};

const raiseMaintenance = async ({
  assetId,
  issueDescription,
  priority,
  photoUrl,
  organizationId,
  raisedById,
}) => {
  const asset = await findAssetById(assetId, organizationId);
  if (!asset) throw ApiError.notFound('Asset not found');
  
  if (['UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED'].includes(asset.status)) {
    throw ApiError.badRequest(`Cannot raise maintenance request for asset in status ${asset.status}`);
  }

  const request = await createMaintenanceRequest({
    assetId,
    raisedById,
    issueDescription,
    priority,
    photoUrl,
    organizationId,
  });

  return mapMaintenanceDetail(request);
};

const processMaintenance = async ({ id, payload, employee }) => {
  const request = await findMaintenanceById(id);
  if (!request) throw ApiError.notFound('Maintenance request not found');

  const { status, rejectionReason, technicianId, technicianName, resolutionNotes } = payload;
  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER'].includes(r));
  const isTechnician = request.technicianId === employee.id;

  // Validate state transitions & RBAC
  const current = request.status;
  
  const validTransitions = {
    PENDING: ['APPROVED', 'REJECTED'],
    APPROVED: ['TECHNICIAN_ASSIGNED', 'IN_PROGRESS'],
    TECHNICIAN_ASSIGNED: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED'],
  };

  if (!validTransitions[current]?.includes(status)) {
    throw ApiError.badRequest(`Invalid status transition from ${current} to ${status}`);
  }

  // RBAC checks
  if (['APPROVED', 'REJECTED', 'TECHNICIAN_ASSIGNED'].includes(status) && !isManager) {
    throw ApiError.forbidden(`Only managers can change status to ${status}`);
  }

  if (['IN_PROGRESS', 'RESOLVED'].includes(status) && !isManager && !isTechnician) {
    throw ApiError.forbidden(`Only the assigned technician or a manager can change status to ${status}`);
  }

  // Prepare Update Data
  let updateData = { status };
  let newAssetStatus = null;
  let statusReason = null;
  let notificationConfig = null;

  switch (status) {
    case 'APPROVED':
      updateData.approvedById = employee.id;
      updateData.approvedAt = new Date();
      newAssetStatus = 'UNDER_MAINTENANCE';
      statusReason = 'Maintenance approved';
      notificationConfig = {
        employeeId: request.raisedById,
        type: 'MAINTENANCE_STATUS_CHANGED',
        title: 'Maintenance Approved',
        message: `Your maintenance request for ${request.asset.name} has been approved.`,
      };
      break;

    case 'REJECTED':
      updateData.approvedById = employee.id;
      updateData.approvedAt = new Date();
      updateData.rejectionReason = rejectionReason;
      notificationConfig = {
        employeeId: request.raisedById,
        type: 'MAINTENANCE_REJECTED',
        title: 'Maintenance Rejected',
        message: `Your maintenance request for ${request.asset.name} was rejected. Reason: ${rejectionReason}`,
      };
      break;

    case 'TECHNICIAN_ASSIGNED':
      updateData.technicianId = technicianId;
      updateData.technicianName = technicianName;
      // You could optionally notify the technician here if they are an internal employee
      break;

    case 'IN_PROGRESS':
      // Just a status field update
      break;

    case 'RESOLVED':
      updateData.resolvedAt = new Date();
      updateData.resolutionNotes = resolutionNotes;
      newAssetStatus = 'AVAILABLE';
      statusReason = 'Maintenance resolved';
      notificationConfig = {
        employeeId: request.raisedById,
        type: 'MAINTENANCE_STATUS_CHANGED',
        title: 'Maintenance Resolved',
        message: `Your maintenance request for ${request.asset.name} has been resolved.`,
      };
      break;
  }

  const updatedRequest = await updateMaintenanceRequest({
    id,
    assetId: request.assetId,
    updateData,
    newAssetStatus,
    changedById: employee.id,
    statusReason,
    notificationConfig,
  });

  return mapMaintenanceDetail(updatedRequest);
};

module.exports = { listMaintenance, raiseMaintenance, processMaintenance };
