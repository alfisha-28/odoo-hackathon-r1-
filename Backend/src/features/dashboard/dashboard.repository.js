const prisma = require('../../config/prisma');

const getKPICounts = async (organizationId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const now = new Date();

  const [
    assetsAvailable,
    assetsAllocated,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
  ] = await Promise.all([
    prisma.asset.count({ where: { organizationId, status: 'AVAILABLE' } }),
    prisma.asset.count({ where: { organizationId, status: 'ALLOCATED' } }),
    prisma.maintenanceRequest.count({
      where: {
        asset: { organizationId },
        status: { in: ['PENDING', 'APPROVED', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS'] },
        OR: [
          { createdAt: { gte: today } },
          { updatedAt: { gte: today } },
        ]
      }
    }),
    prisma.booking.count({
      where: {
        asset: { organizationId },
        status: { in: ['UPCOMING', 'ONGOING'] }
      }
    }),
    prisma.transferRequest.count({
      where: {
        asset: { organizationId },
        status: 'REQUESTED'
      }
    }),
    prisma.allocation.count({
      where: {
        asset: { organizationId },
        status: 'ACTIVE',
        expectedReturnDate: { gte: now, lte: nextWeek }
      }
    }),
    prisma.allocation.count({
      where: {
        asset: { organizationId },
        status: 'ACTIVE',
        expectedReturnDate: { lt: now }
      }
    }),
  ]);

  return {
    assetsAvailable,
    assetsAllocated,
    maintenanceToday,
    activeBookings,
    pendingTransfers,
    upcomingReturns,
    overdueReturns,
  };
};

const getRecentActivity = async (organizationId) => {
  // Hackathon approach: pull recent from 3 tables and merge in JS
  const [allocations, bookings, maintenance] = await Promise.all([
    prisma.allocation.findMany({
      where: { asset: { organizationId } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { asset: { select: { assetTag: true, name: true } }, allocatedBy: { select: { name: true } } }
    }),
    prisma.booking.findMany({
      where: { asset: { organizationId } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { asset: { select: { assetTag: true, name: true } }, bookedBy: { select: { name: true } } }
    }),
    prisma.maintenanceRequest.findMany({
      where: { asset: { organizationId } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: { asset: { select: { assetTag: true, name: true } }, raisedBy: { select: { name: true } } }
    }),
  ]);

  const activities = [
    ...allocations.map(a => ({
      type: 'ALLOCATION',
      description: `Asset ${a.asset.name} (${a.asset.assetTag}) allocation updated by ${a.allocatedBy.name}`,
      timestamp: a.updatedAt,
    })),
    ...bookings.map(b => ({
      type: 'BOOKING',
      description: `Booking for ${b.asset.name} (${b.asset.assetTag}) updated by ${b.bookedBy.name}`,
      timestamp: b.updatedAt,
    })),
    ...maintenance.map(m => ({
      type: 'MAINTENANCE',
      description: `Maintenance for ${m.asset.name} (${m.asset.assetTag}) updated by ${m.raisedBy.name}`,
      timestamp: m.updatedAt,
    })),
  ];

  return activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
};

const getAnalytics = async (organizationId, departmentId, from, to) => {
  const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const toDate = to ? new Date(to) : new Date();

  const [
    utilizationData,
    maintenanceData,
    mostUsedBookable,
    mostUsedAllocated,
    idleAssets
  ] = await Promise.all([
    prisma.allocation.groupBy({
      by: ['allocatedToDeptId'],
      where: {
        asset: { organizationId },
        status: 'ACTIVE',
        allocatedToDeptId: { not: null },
      },
      _count: { _all: true },
    }),
    prisma.maintenanceRequest.findMany({
      where: {
        asset: { organizationId },
        createdAt: { gte: fromDate, lte: toDate },
      },
      select: { createdAt: true },
    }),
    prisma.booking.groupBy({
      by: ['assetId'],
      where: {
        asset: { organizationId, isBookable: true },
        createdAt: { gte: fromDate, lte: toDate }
      },
      _count: { _all: true },
      orderBy: { _count: { assetId: 'desc' } },
      take: 5,
    }),
    prisma.allocation.groupBy({
      by: ['assetId'],
      where: {
        asset: { organizationId, isBookable: false },
        createdAt: { gte: fromDate, lte: toDate }
      },
      _count: { _all: true },
      orderBy: { _count: { assetId: 'desc' } },
      take: 5,
    }),
    prisma.asset.findMany({
      where: {
        organizationId,
        status: 'AVAILABLE',
        isBookable: true,
        bookings: { none: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }
      },
      select: { id: true, name: true, assetTag: true },
      take: 5,
    }),
  ]);

  return {
    utilizationData,
    maintenanceData,
    mostUsedBookable,
    mostUsedAllocated,
    idleAssets,
  };
};

// Helper exports
const getDepartmentNames = async (deptIds) => {
  return prisma.department.findMany({
    where: { id: { in: deptIds } },
    select: { id: true, name: true }
  });
};

const getAssetDetails = async (assetIds) => {
  return prisma.asset.findMany({
    where: { id: { in: assetIds } },
    select: { id: true, name: true, assetTag: true }
  });
};

module.exports = {
  getKPICounts,
  getRecentActivity,
  getAnalytics,
  getDepartmentNames,
  getAssetDetails,
};
