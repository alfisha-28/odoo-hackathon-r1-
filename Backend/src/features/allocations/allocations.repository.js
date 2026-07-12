const prisma = require('../../config/prisma');

const INCLUDE_ALLOCATION = {
  asset: { select: { id: true, assetTag: true, name: true, status: true } },
  allocatedToEmp: { select: { id: true, name: true, email: true } },
  allocatedToDept: { select: { id: true, name: true } },
  allocatedBy: { select: { id: true, name: true } },
};

const findAllocations = ({ assetId, employeeId, departmentId, status, overdue, skip, take }) => {
  const where = {
    ...(assetId && { assetId }),
    ...(employeeId && { allocatedToEmpId: employeeId }),
    ...(departmentId && { allocatedToDeptId: departmentId }),
    ...(status && { status }),
    ...(overdue && {
      status: 'ACTIVE',
      expectedReturnDate: { lt: new Date() },
    }),
  };

  return Promise.all([
    prisma.allocation.findMany({
      where,
      include: INCLUDE_ALLOCATION,
      orderBy: { allocationDate: 'desc' },
      skip,
      take,
    }),
    prisma.allocation.count({ where }),
  ]);
};

const findAllocationById = (id) => {
  return prisma.allocation.findUnique({
    where: { id },
    include: INCLUDE_ALLOCATION,
  });
};

const findActiveAllocationByAssetId = (assetId) => {
  return prisma.allocation.findFirst({
    where: { assetId, status: 'ACTIVE' },
    include: INCLUDE_ALLOCATION,
  });
};

const createAllocation = async ({
  assetId, allocatedToEmpId, allocatedToDeptId, expectedReturnDate, allocatedById,
}) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create Allocation
    const allocation = await tx.allocation.create({
      data: {
        assetId,
        allocatedToEmpId,
        allocatedToDeptId,
        allocatedById,
        status: 'ACTIVE',
        allocationDate: new Date(),
        ...(expectedReturnDate && { expectedReturnDate: new Date(expectedReturnDate) }),
      },
      include: INCLUDE_ALLOCATION,
    });

    // 2. Update Asset Status
    await tx.asset.update({
      where: { id: assetId },
      data: { status: 'ALLOCATED' },
    });

    // 3. Create Status History
    await tx.assetStatusHistory.create({
      data: {
        assetId,
        fromStatus: 'AVAILABLE',
        toStatus: 'ALLOCATED',
        reason: allocatedToEmpId ? 'Allocated to employee' : 'Allocated to department',
        changedById: allocatedById,
      },
    });

    // 4. Notification for Employee
    if (allocatedToEmpId) {
      await tx.notification.create({
        data: {
          employeeId: allocatedToEmpId,
          type: 'ASSET_ASSIGNED',
          title: 'Asset Allocated',
          message: `You have been allocated a new asset: ${allocation.asset.name} (${allocation.asset.assetTag})`,
          entityType: 'Allocation',
          entityId: allocation.id,
        },
      });
    }

    return allocation;
  });
};

const returnAllocation = async ({ id, assetId, checkInCondition, checkInNotes, returnedApprovedById }) => {
  return prisma.$transaction(async (tx) => {
    // 1. Update Allocation
    const allocation = await tx.allocation.update({
      where: { id },
      data: {
        status: 'RETURNED',
        actualReturnDate: new Date(),
        checkInCondition,
        checkInNotes,
        returnedApprovedById,
        returnedApprovedAt: new Date(),
      },
      include: INCLUDE_ALLOCATION,
    });

    // 2. Update Asset
    await tx.asset.update({
      where: { id: assetId },
      data: {
        status: 'AVAILABLE',
        condition: checkInCondition,
      },
    });

    // 3. Status History
    await tx.assetStatusHistory.create({
      data: {
        assetId,
        fromStatus: 'ALLOCATED',
        toStatus: 'AVAILABLE',
        reason: 'Returned',
        changedById: returnedApprovedById,
      },
    });

    return allocation;
  });
};

module.exports = {
  findAllocations,
  findAllocationById,
  findActiveAllocationByAssetId,
  createAllocation,
  returnAllocation,
};
