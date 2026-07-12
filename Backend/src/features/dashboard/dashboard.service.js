const {
  getKPICounts,
  getRecentActivity,
  getAnalytics,
  getDepartmentNames,
  getAssetDetails,
} = require('./dashboard.repository');
const { mapDashboardKPIs, mapDashboardAnalytics } = require('./dashboard.mapper');

const fetchKPIs = async (organizationId) => {
  const [counts, recentActivity] = await Promise.all([
    getKPICounts(organizationId),
    getRecentActivity(organizationId),
  ]);
  return mapDashboardKPIs({ ...counts, recentActivity });
};

const fetchAnalytics = async (organizationId, departmentId, from, to) => {
  const raw = await getAnalytics(organizationId, departmentId, from, to);

  // Map utilization department IDs to names
  const deptIds = raw.utilizationData.map(d => d.allocatedToDeptId);
  const depts = await getDepartmentNames(deptIds);
  const deptMap = Object.fromEntries(depts.map(d => [d.id, d.name]));

  const utilizationByDepartment = raw.utilizationData.map(d => ({
    department: deptMap[d.allocatedToDeptId] || 'Unknown',
    count: d._count._all,
  }));

  // Aggregate maintenance by month for hackathon simplicity
  const mFreq = {};
  raw.maintenanceData.forEach(m => {
    const month = m.createdAt.toISOString().slice(0, 7); // YYYY-MM
    mFreq[month] = (mFreq[month] || 0) + 1;
  });
  const maintenanceFrequency = Object.entries(mFreq).map(([month, count]) => ({ month, count }));

  // Map asset IDs for top assets
  const bAssetIds = raw.mostUsedBookable.map(b => b.assetId);
  const aAssetIds = raw.mostUsedAllocated.map(a => a.assetId);
  const allAssetIds = [...new Set([...bAssetIds, ...aAssetIds])];
  const assets = await getAssetDetails(allAssetIds);
  const assetMap = Object.fromEntries(assets.map(a => [a.id, a]));

  let mostUsedAssets = [];
  if (raw.mostUsedBookable.length > 0) {
    mostUsedAssets = raw.mostUsedBookable.map(b => ({
      name: assetMap[b.assetId]?.name || 'Unknown',
      assetTag: assetMap[b.assetId]?.assetTag || 'Unknown',
      count: b._count._all,
      type: 'Bookings',
    }));
  } else {
    mostUsedAssets = raw.mostUsedAllocated.map(a => ({
      name: assetMap[a.assetId]?.name || 'Unknown',
      assetTag: assetMap[a.assetId]?.assetTag || 'Unknown',
      count: a._count._all,
      type: 'Allocations',
    }));
  }

  const idleAssets = raw.idleAssets.map(a => ({
    name: a.name,
    assetTag: a.assetTag,
    daysIdle: '> 30',
  }));

  // Mock due for maintenance (simplicity heuristic)
  const dueForMaintenanceOrRetirement = [];

  return mapDashboardAnalytics({
    utilizationByDepartment,
    maintenanceFrequency,
    mostUsedAssets,
    idleAssets,
    dueForMaintenanceOrRetirement,
  });
};

module.exports = { fetchKPIs, fetchAnalytics };
