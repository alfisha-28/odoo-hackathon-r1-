import mockData from '../data/data.json';

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
};
