const prisma = require('../../config/prisma');

const INCLUDE_MAINTENANCE = {
  asset: { select: { id: true, assetTag: true, name: true, status: true } },
  raisedBy: { select: { id: true, name: true } },
  approvedBy: { select: { id: true, name: true } },
  technician: { select: { id: true, name: true } },
};

const findMaintenanceRequests = ({ assetId, status, priority, skip, take }) => {
  const where = {
    ...(assetId && { assetId }),
    ...(status && { status }),
    ...(priority && { priority }),
  };

  return Promise.all([
    prisma.maintenanceRequest.findMany({
      where,
      include: INCLUDE_MAINTENANCE,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.maintenanceRequest.count({ where }),
  ]);
};

const findMaintenanceById = (id) => {
  return prisma.maintenanceRequest.findUnique({
    where: { id },
    include: INCLUDE_MAINTENANCE,
  });
};

const createMaintenanceRequest = async ({
  assetId,
  raisedById,
  issueDescription,
  priority,
  photoUrl,
  organizationId,
}) => {
  return prisma.$transaction(async (tx) => {
    const request = await tx.maintenanceRequest.create({
      data: {
        assetId,
        raisedById,
        issueDescription,
        ...(priority && { priority }),
        ...(photoUrl && { photoUrl }),
        status: 'PENDING',
      },
      include: INCLUDE_MAINTENANCE,
    });

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
          type: 'MAINTENANCE_STATUS_CHANGED',
          title: 'New Maintenance Request',
          message: `${request.raisedBy.name} raised a maintenance request for ${request.asset.name} (${request.asset.assetTag}).`,
          entityType: 'MaintenanceRequest',
          entityId: request.id,
        })),
      });
    }

    return request;
  });
};

const updateMaintenanceRequest = async ({ id, assetId, updateData, newAssetStatus, changedById, statusReason, notificationConfig }) => {
  return prisma.$transaction(async (tx) => {
    // 1. Update Request
    const request = await tx.maintenanceRequest.update({
      where: { id },
      data: updateData,
      include: INCLUDE_MAINTENANCE,
    });

    // 2. Update Asset & History if status flipped
    if (newAssetStatus) {
      const currentAsset = await tx.asset.findUnique({ where: { id: assetId } });
      await tx.asset.update({
        where: { id: assetId },
        data: { status: newAssetStatus },
      });

      await tx.assetStatusHistory.create({
        data: {
          assetId,
          fromStatus: currentAsset.status,
          toStatus: newAssetStatus,
          reason: statusReason,
          changedById,
        },
      });
    }

    // 3. Notification
    if (notificationConfig) {
      await tx.notification.create({
        data: {
          employeeId: notificationConfig.employeeId,
          type: notificationConfig.type,
          title: notificationConfig.title,
          message: notificationConfig.message,
          entityType: 'MaintenanceRequest',
          entityId: id,
        },
      });
    }

    return request;
  });
};

module.exports = {
  findMaintenanceRequests,
  findMaintenanceById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
};
