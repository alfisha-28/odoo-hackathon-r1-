import mockData from '../data/data.json';
import apiClient from '../../../shared/services/apiClient';

export const auditService = {
  getStats: () => {
    return Promise.resolve(mockData.stats);
  },

  getAuditTypes: () => {
    return Promise.resolve(mockData.auditTypes);
  },

  getStatuses: () => {
    return Promise.resolve(mockData.statuses);
  },

  getLocations: () => {
    return Promise.resolve(mockData.locations);
  },

  getAuditors: () => {
    return Promise.resolve(mockData.auditors);
  },

  getTabs: () => {
    return Promise.resolve(mockData.tabs);
  },

  getCompliance: () => {
    return Promise.resolve(mockData.compliance);
  },

  getAuditTypeBreakdown: () => {
    return Promise.resolve(mockData.auditTypeBreakdown);
  },

  getUpcomingAudits: () => {
    return Promise.resolve(mockData.upcomingAudits);
  },

  getChecklists: () => {
    return Promise.resolve(mockData.checklists);
  },

  getAudits: () => {
    return Promise.resolve(mockData.audits);
  },

  getAuditCycles: async () => {
    const response = await apiClient.get('/audits');
    return response.data.data.cycles;
  },

  startAuditCycle: async (auditData) => {
    const response = await apiClient.post('/audits', auditData);
    return response.data.data.cycle;
  },

  verifyAsset: async (cycleId, verificationData) => {
    const response = await apiClient.patch(`/audits/${cycleId}`, {
      action: 'VERIFY',
      ...verificationData,
    });
    return response.data.data;
  },

  closeAuditCycle: async (cycleId) => {
    const response = await apiClient.patch(`/audits/${cycleId}`, { action: 'CLOSE' });
    return response.data.data.cycle;
  },
};
