import reportsData from '../data/data.json';
import apiClient from '../../../shared/services/apiClient';

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
    return reportsData.assetUtilization;
  },

  getAssetStatus: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return reportsData.assetStatus;
  },

  getDepartmentAllocation: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return reportsData.departmentAllocation;
  },

  getMaintenanceTrend: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return reportsData.maintenanceTrend;
  },

  getCategoryUtilization: async (startDate, endDate) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return reportsData.categoryUtilization;
  },

  getReportTypes: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return reportsData.reportTypes;
  },

  getFrequencies: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return reportsData.frequencies;
  },

  getRecipients: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return reportsData.recipientsList;
  },

  getDashboardKPIs: async () => {
    try {
      const response = await apiClient.get('/dashboard/kpis');
      return response.data.data;
    } catch (e) {
      return null;
    }
  },

  getAnalyticsData: async () => {
    try {
      const response = await apiClient.get('/dashboard/analytics');
      return response.data.data;
    } catch (e) {
      return null;
    }
  },
};
