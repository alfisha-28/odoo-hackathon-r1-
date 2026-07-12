import mockData from '../data/data.json';

export const maintenanceService = {
  getStats: () => {
    return Promise.resolve(mockData.stats);
  },

  getTabs: () => {
    return Promise.resolve(mockData.tabs);
  },

  getPriorities: () => {
    return Promise.resolve(mockData.priorities);
  },

  getStatuses: () => {
    return Promise.resolve(mockData.statuses);
  },

  getCategories: () => {
    return Promise.resolve(mockData.categories);
  },

  getTechnicians: () => {
    return Promise.resolve(mockData.technicians);
  },

  getTickets: () => {
    return Promise.resolve(mockData.tickets);
  },

  getOverview: () => {
    return Promise.resolve(mockData.overview);
  },

  getIssueCategories: () => {
    return Promise.resolve(mockData.issueCategories);
  },
};
