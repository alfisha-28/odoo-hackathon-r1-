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
    const payload = {
      assetId: allocationData.assetId,
    };

    if (allocationData.allocatedToEmpId && allocationData.allocatedToEmpId.trim() !== '') {
      payload.allocatedToEmpId = allocationData.allocatedToEmpId;
    } else if (allocationData.assigneeId && allocationData.assigneeId.trim() !== '') {
      payload.allocatedToEmpId = allocationData.assigneeId;
    }

    if (allocationData.allocatedToDeptId && allocationData.allocatedToDeptId.trim() !== '') {
      payload.allocatedToDeptId = allocationData.allocatedToDeptId;
    } else if (allocationData.departmentId && allocationData.departmentId.trim() !== '') {
      payload.allocatedToDeptId = allocationData.departmentId;
    }

    const dateStr = allocationData.expectedReturnDate || allocationData.dueDate;
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          payload.expectedReturnDate = date.toISOString();
        }
      } catch (err) {
        console.error("Failed to parse expectedReturnDate:", err);
      }
    }

    const response = await apiClient.post('/allocations', payload);
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
