import apiClient from '../../../shared/services/apiClient';

export const maintenanceService = {
  getMaintenanceRequests: async ({ status = '', priority = '' } = {}) => {
    const response = await apiClient.get('/maintenance', {
      params: { status, priority },
    });
    // Returns: { success: true, data: { data: [...], meta: {...} } }
    return response.data.data.data;
  },

  raiseRequest: async (requestData) => {
    // Expects: { assetId, issueDescription, priority, photoUrl }
    const response = await apiClient.post('/maintenance', requestData);
    return response.data.data.request;
  },

  updateRequestStatus: async (id, actionData) => {
    // Action details can be:
    // - Approve/Reject: { status: 'APPROVED' | 'REJECTED', rejectionReason }
    // - Assign: { status: 'TECHNICIAN_ASSIGNED', technicianId }
    // - Resolve: { status: 'RESOLVED', resolutionNotes }
    const response = await apiClient.patch(`/maintenance/${id}`, actionData);
    return response.data.data.request;
  },
};
