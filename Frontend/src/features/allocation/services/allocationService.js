import apiClient from '../../../shared/services/apiClient';

export const allocationService = {
  // --- Allocations ---
  getAllocations: async ({ assetId = '', employeeId = '', departmentId = '', status = '', overdue = '', page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get('/allocations', {
      params: { assetId, employeeId, departmentId, status, overdue, page, limit },
    });
    // Returns: { success: true, data: { allocations: [...], total, page, limit, totalPages } }
    return response.data.data;
  },

  allocateAsset: async (allocationData) => {
    const response = await apiClient.post('/allocations', allocationData);
    return response.data.data.allocation;
  },

  returnAsset: async (id, checkInDetails) => {
    const response = await apiClient.post(`/allocations/${id}/return`, checkInDetails);
    return response.data.data.allocation;
  },

  // --- Transfers ---
  getTransfers: async ({ assetId = '', status = '', page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get('/transfers', {
      params: { assetId, status, page, limit },
    });
    return response.data.data;
  },

  requestTransfer: async (transferData) => {
    const response = await apiClient.post('/transfers', transferData);
    return response.data.data.transfer;
  },

  processTransfer: async (id, action, reason = '') => {
    const response = await apiClient.patch(`/transfers/${id}`, { action, reason });
    return response.data.data.transfer;
  },
};
