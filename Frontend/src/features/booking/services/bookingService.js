import mockData from '../data/data.json';

export const bookingService = {
  getStats: () => {
    return Promise.resolve(mockData.stats);
  },

  getTabs: () => {
    return Promise.resolve(mockData.tabs);
  },

  getResourceTypes: () => {
    return Promise.resolve(mockData.resourceTypes);
  },

  getResources: () => {
    return Promise.resolve(mockData.resources);
  },

  getDepartments: () => {
    return Promise.resolve(mockData.departments);
  },

  getEmployees: () => {
    return Promise.resolve(mockData.employees);
  },

  getBookings: () => {
    return Promise.resolve(mockData.bookings);
  },

  getAvailability: (resourceId) => {
    const avail = mockData.availability.find((a) => a.resourceId === resourceId);
    return Promise.resolve(avail || { availableToday: false, timeSlots: [] });
  },
};
