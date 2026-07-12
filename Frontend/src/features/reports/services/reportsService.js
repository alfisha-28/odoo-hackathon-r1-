import reportsData from '../data/data.json';

/**
 * Service to simulate async API calls for Reports & Analytics module
 */
export const reportsService = {
  getStats: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    // Simulated date filter effect: slightly alter some stats if dates are changed
    if (startDate || endDate) {
      return reportsData.stats.map((s) => {
        // Change total bookings and maintenance tickets values slightly to simulate filtering
        if (s.id === 'total-bookings') {
          return { ...s, value: String(Math.round(parseInt(s.value) * 0.95)) };
        }
        if (s.id === 'maintenance-tickets') {
          return { ...s, value: String(Math.round(parseInt(s.value) * 0.88)) };
        }
        return s;
      });
    }
    return reportsData.stats;
  },

  getAssetUtilization: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (startDate || endDate) {
      // Simulate slightly lower utilization on date filter
      return reportsData.assetUtilization.map((item) => ({
        ...item,
        inUse: Math.round(item.inUse * 0.92),
        available: Math.round(item.available * 1.05),
      }));
    }
    return reportsData.assetUtilization;
  },

  getAssetStatus: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return reportsData.assetStatus;
  },

  getDepartmentAllocation: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return reportsData.departmentAllocation;
  },

  getMaintenanceTrend: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    if (startDate || endDate) {
      // Simulate filtering the trend dates
      return reportsData.maintenanceTrend.map((item) => ({
        ...item,
        created: Math.round(item.created * 0.9),
        resolved: Math.round(item.resolved * 0.92),
      }));
    }
    return reportsData.maintenanceTrend;
  },

  getCategoryUtilization: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return reportsData.categoryUtilization;
  },

  getReportTypes: async () => {
    return reportsData.reportTypes;
  },

  getFrequencies: async () => {
    return reportsData.frequencies;
  },

  getRecipients: async () => {
    return reportsData.recipients;
  }
};
