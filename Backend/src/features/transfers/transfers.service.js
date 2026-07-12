const {
  findTransfers,
  findTransferById,
  createTransferRequest,
  approveTransfer,
  rejectTransfer,
} = require('./transfers.repository');
const { findActiveAllocationByAssetId } = require('../allocations/allocations.repository');
const { mapTransferList, mapTransferDetail } = require('./transfers.mapper');
const { getPaginationData } = require('../../common/helpers/pagination.helper');
const ApiError = require('../../lib/ApiError');

const listTransfers = async ({ employee, assetId, status, page, limit }) => {
  const isManager = employee.roles.some(r => ['ADMIN', 'ASSET_MANAGER'].includes(r));
  const isDeptHead = employee.roles.includes('DEPARTMENT_HEAD');

  let filterRequestedById;
  let filterRequestedToDeptId;

  if (!isManager) {
    if (isDeptHead) {
      // Dept heads see requests by their dept OR directed to their dept
      filterRequestedById = employee.id;
      filterRequestedToDeptId = employee.departmentId;
    } else {
      // Plain employees only see their own
      filterRequestedById = employee.id;
    }
  }

  const { skip, take } = getPaginationData(page, limit, 0);
  const [transfers, total] = await findTransfers({
    assetId,
    requestedById: filterRequestedById,
    requestedToDeptId: filterRequestedToDeptId,
    status,
    skip,
    take,
  });
  const { meta } = getPaginationData(page, limit, total);

  return {
    data: transfers.map(mapTransferList),
    meta,
  };
};

const requestTransfer = async ({
  assetId,
  requestedToEmpId,
  requestedToDeptId,
  reason,
  organizationId,
  requestedById,
}) => {
  // Asset must currently have an ACTIVE allocation
  const activeAllocation = await findActiveAllocationByAssetId(assetId);
  if (!activeAllocation) {
    throw ApiError.badRequest('Asset does not have an active allocation to transfer.');
  }

  // Only the current holder (or an admin) can initiate a transfer
  // (Assuming holder means allocatedToEmp or someone in the allocatedToDept)
  // To keep it simple for the hackathon, we assume any authenticated user can *request* it
  // and the manager will verify when approving.

  const transfer = await createTransferRequest({
    assetId,
    currentAllocationId: activeAllocation.id,
    requestedById,
    requestedToEmpId,
    requestedToDeptId,
    reason,
    organizationId,
  });

  return mapTransferDetail(transfer);
};

const processTransfer = async ({ id, action, reason, employee }) => {
  const transfer = await findTransferById(id);
  if (!transfer) throw ApiError.notFound('Transfer request not found');

  if (transfer.status !== 'REQUESTED') {
    throw ApiError.badRequest(`Transfer is already ${transfer.status}`);
  }

  let result;
  if (action === 'APPROVE') {
    // Need new holder's name for history
    let newHolderName = 'Unknown';
    if (transfer.requestedToEmpId) {
       // Ideally fetch employee name, but we can just say "new employee" for hackathon
       newHolderName = 'New Employee';
    } else if (transfer.requestedToDeptId) {
       newHolderName = 'New Department';
    }

    result = await approveTransfer({
      id,
      approvedById: employee.id,
      transfer,
      newHolderName,
    });
  } else if (action === 'REJECT') {
    result = await rejectTransfer({
      id,
      approvedById: employee.id,
      reason,
      transfer,
    });
  } else {
    throw ApiError.badRequest('Invalid action');
  }

  return mapTransferDetail(result);
};

module.exports = { listTransfers, requestTransfer, processTransfer };
