import apiClient from '../../../shared/services/apiClient';

export const bookingService = {
  getBookings: async ({ assetId = '', start = '', end = '' } = {}) => {
    const response = await apiClient.get('/bookings', {
      params: { assetId, start, end },
    });
    // Returns: { success: true, data: { bookings: [...] } }
    return response.data.data.bookings;
  },

  createBooking: async (bookingData) => {
    // Expects: { assetId, startTime, endTime, purpose }
    const response = await apiClient.post('/bookings', bookingData);
    return response.data.data.booking;
  },

  updateBooking: async (id, updateData) => {
    // Expects: { status: 'CANCELLED' } or { startTime, endTime }
    const response = await apiClient.patch(`/bookings/${id}`, updateData);
    return response.data.data.booking;
  },
};
