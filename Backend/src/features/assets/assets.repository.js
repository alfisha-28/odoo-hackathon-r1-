const prisma = require('../../config/prisma');

const INCLUDE_ASSET_LIST = {
  category: { select: { id: true, name: true } },
};

const INCLUDE_ASSET_DETAIL = {
  category: true,
  registeredBy: { select: { id: true, name: true } },
  photos: true,
  allocations: {
    orderBy: { allocationDate: 'desc' },
    take: 10,
    select: {
      id: true,
      status: true,
      allocationDate: true,
      expectedReturnDate: true,
      actualReturnDate: true,
      allocatedToEmp: { select: { id: true, name: true } },
      allocatedToDept: { select: { id: true, name: true } },
    },
  },
  maintenanceRequests: {
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      status: true,
      issueDescription: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  statusHistory: {
    orderBy: { changedAt: 'desc' },
    take: 20,
    select: {
      id: true,
      fromStatus: true,
      toStatus: true,
      reason: true,
      changedById: true,
      changedAt: true,
    },
  },
};

const findAssets = ({ organizationId, search, status, categoryId, departmentId, location, skip, take }) => {
  const where = {
    organizationId,
    ...(status && { status }),
    ...(categoryId && { categoryId }),
    ...(location && { location: { contains: location, mode: 'insensitive' } }),
    ...(search && {
      OR: [
        { assetTag: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(departmentId && {
      allocations: { some: { status: 'ACTIVE', allocatedToDeptId: departmentId } },
    }),
  };

  return Promise.all([
    prisma.asset.findMany({
      where,
      include: INCLUDE_ASSET_LIST,
      orderBy: { assetTag: 'asc' },
      skip,
      take,
    }),
    prisma.asset.count({ where }),
  ]);
};

const findAssetById = (id, organizationId) => {
  return prisma.asset.findFirst({
    where: { id, organizationId },
    include: INCLUDE_ASSET_DETAIL,
  });
};

const findCategoryById = (id, organizationId) => {
  return prisma.assetCategory.findFirst({ where: { id, organizationId } });
};

const createAsset = async ({
  name, categoryId, serialNumber, acquisitionDate, acquisitionCost,
  condition, location, isBookable, photoUrls, organizationId, registeredById,
}) => {
  return prisma.$transaction(async (tx) => {
    const { generateAssetTag } = require('../../common/utils/assetTag.util');
    const assetTag = await generateAssetTag(tx, organizationId);

    const asset = await tx.asset.create({
      data: {
        assetTag,
        name,
        categoryId,
        organizationId,
        registeredById,
        status: 'AVAILABLE',
        condition: condition ?? 'NEW',
        isBookable: isBookable ?? false,
        ...(serialNumber && { serialNumber }),
        ...(acquisitionDate && { acquisitionDate: new Date(acquisitionDate) }),
        ...(acquisitionCost != null && { acquisitionCost }),
        ...(location && { location }),
        photos: photoUrls && photoUrls.length > 0
          ? { create: photoUrls.map(url => ({ fileUrl: url, fileType: 'photo' })) }
          : undefined,
        statusHistory: {
          create: [{
            fromStatus: null,
            toStatus: 'AVAILABLE',
            reason: 'Asset registered',
            changedById: registeredById,
          }],
        },
      },
      include: INCLUDE_ASSET_DETAIL,
    });

    return asset;
  });
};

const updateAsset = async (id, { name, condition, location, isBookable, status, changedById, currentStatus }) => {
  const statusChanged = status && status !== currentStatus;

  return prisma.$transaction(async (tx) => {
    const asset = await tx.asset.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(condition !== undefined && { condition }),
        ...(location !== undefined && { location }),
        ...(isBookable !== undefined && { isBookable }),
        ...(status !== undefined && { status }),
      },
      include: INCLUDE_ASSET_DETAIL,
    });

    if (statusChanged) {
      await tx.assetStatusHistory.create({
        data: {
          assetId: id,
          fromStatus: currentStatus,
          toStatus: status,
          reason: 'Manual status update',
          changedById,
        },
      });
    }

    return asset;
  });
};

module.exports = {
  findAssets,
  findAssetById,
  findCategoryById,
  createAsset,
  updateAsset,
};
