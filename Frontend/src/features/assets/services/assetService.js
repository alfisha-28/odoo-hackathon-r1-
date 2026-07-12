import apiClient from '../../../shared/services/apiClient';

export const assetService = {
  getAssets: async ({ search = '', status = '', categoryId = '', departmentId = '', location = '', isBookable, page = 1, limit = 10 } = {}) => {
    const response = await apiClient.get('/assets', {
      params: { search, status, categoryId, departmentId, location, isBookable, page, limit },
    });
    // Returns: { success: true, data: { assets: [...], total, page, limit, totalPages } }
    return response.data.data;
  },

  getAssetById: async (id) => {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data.data.asset;
  },

  registerAsset: async (assetData) => {
    const response = await apiClient.post('/assets', assetData);
    return response.data.data.asset;
  },

  updateAsset: async (id, updateData) => {
    const response = await apiClient.patch(`/assets/${id}`, updateData);
    return response.data.data.asset;
  },
};
