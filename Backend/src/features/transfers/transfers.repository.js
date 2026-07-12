const prisma = require('../../config/prisma');

const INCLUDE_TRANSFER = {
  asset: { select: { id: true, assetTag: true, name: true } },
  requestedBy: { select: { id: true, name: true } },
  approvedBy: { select: { id: true, name: true } },
};

const findTransfers = ({ assetId, requestedById, requestedToDeptId, status, skip, take }) => {
  const where = {
    ...(assetId && { assetId }),
    ...(status && { status }),
    ...(requestedById || requestedToDeptId ? {
      OR: [
        ...(requestedById ? [{ requestedById }] : []),
        // If they are a dept head, they might see requests directed TO their dept
        ...(requestedToDeptId ? [{ requestedToDeptId }] : []),
      ],
    } : {}),
  };

  return Promise.all([
    prisma.transferRequest.findMany({
      where,
      include: INCLUDE_TRANSFER,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.transferRequest.count({ where }),
  ]);
};

const findTransferById = (id) => {
  return prisma.transferRequest.findUnique({
    where: { id },
    include: INCLUDE_TRANSFER,
  });
};

const createTransferRequest = async ({
  assetId,
  currentAllocationId,
  requestedById,
  requestedToEmpId,
  requestedToDeptId,
  reason,
  organizationId,
}) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create Transfer Request
    const transfer = await tx.transferRequest.create({
      data: {
        assetId,
        currentAllocationId,
        requestedById,
        requestedToEmpId,
        requestedToDeptId,
        reason,
        status: 'REQUESTED',
      },
      include: INCLUDE_TRANSFER,
    });

    // 2. Notify Asset Managers
    const assetManagers = await tx.employee.findMany({
      where: {
        organizationId,
        roles: { some: { role: 'ASSET_MANAGER' } },
        status: 'ACTIVE',
      },
      select: { id: true },
    });

    if (assetManagers.length > 0) {
      await tx.notification.createMany({
        data: assetManagers.map(mgr => ({
          employeeId: mgr.id,
          type: 'TRANSFER_REQUESTED',
          title: 'Asset Transfer Requested',
          message: `${transfer.requestedBy.name} requested a transfer for ${transfer.asset.name} (${transfer.asset.assetTag}).`,
          entityType: 'TransferRequest',
          entityId: transfer.id,
        })),
      });
    }

    return transfer;
  });
};

const approveTransfer = async ({ id, approvedById, transfer, newHolderName }) => {
  return prisma.$transaction(async (tx) => {
    // 1. Update TransferRequest
    const updatedTransfer = await tx.transferRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById,
        approvedAt: new Date(),
      },
      include: INCLUDE_TRANSFER,
    });

    // 2. Close current allocation
    if (transfer.currentAllocationId) {
      await tx.allocation.update({
        where: { id: transfer.currentAllocationId },
        data: {
          status: 'RETURNED',
          actualReturnDate: new Date(),
          checkInNotes: 'Returned due to approved transfer',
        },
      });
    }

    // 3. Create new allocation
    const newAllocation = await tx.allocation.create({
      data: {
        assetId: transfer.assetId,
        allocatedToEmpId: transfer.requestedToEmpId,
        allocatedToDeptId: transfer.requestedToDeptId,
        allocatedById: approvedById,
        status: 'ACTIVE',
        allocationDate: new Date(),
      },
    });

    // 4. Update AssetStatusHistory (Asset stays ALLOCATED, just changes custody)
    await tx.assetStatusHistory.create({
      data: {
        assetId: transfer.assetId,
        fromStatus: 'ALLOCATED',
        toStatus: 'ALLOCATED',
        reason: `Transferred from ${transfer.requestedBy.name} to ${newHolderName}`,
        changedById: approvedById,
      },
    });

    // 5. Notify original requester and new holder
    await tx.notification.create({
      data: {
        employeeId: transfer.requestedById,
        type: 'TRANSFER_APPROVED',
        title: 'Transfer Approved',
        message: `Your transfer request for ${transfer.asset.name} has been approved.`,
        entityType: 'TransferRequest',
        entityId: id,
      },
    });

    if (transfer.requestedToEmpId) {
      await tx.notification.create({
        data: {
          employeeId: transfer.requestedToEmpId,
          type: 'ASSET_ASSIGNED',
          title: 'Asset Allocated via Transfer',
          message: `You have been allocated a new asset via transfer: ${transfer.asset.name} (${transfer.asset.assetTag})`,
          entityType: 'Allocation',
          entityId: newAllocation.id,
        },
      });
    }

    return updatedTransfer;
  });
};

const rejectTransfer = async ({ id, approvedById, reason, transfer }) => {
  return prisma.$transaction(async (tx) => {
    const updatedTransfer = await tx.transferRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        approvedById, // using this for "rejected by"
        approvedAt: new Date(),
        reason: reason ? `${transfer.reason}\n\nRejection Reason: ${reason}` : transfer.reason,
      },
      include: INCLUDE_TRANSFER,
    });

    await tx.notification.create({
      data: {
        employeeId: transfer.requestedById,
        type: 'TRANSFER_REJECTED',
        title: 'Transfer Rejected',
        message: `Your transfer request for ${transfer.asset.name} was rejected. Reason: ${reason || 'None provided'}`,
        entityType: 'TransferRequest',
        entityId: id,
      },
    });

    return updatedTransfer;
  });
};

module.exports = {
  findTransfers,
  findTransferById,
  createTransferRequest,
  approveTransfer,
  rejectTransfer,
};
