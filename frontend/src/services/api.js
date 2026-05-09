import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experts API
export const expertAPI = {
  getExperts: (page = 1, limit = 10, category = null, search = '') => {
    let url = `/experts?page=${page}&limit=${limit}`;
    if (category && category !== 'All') url += `&category=${category}`;
    if (search) url += `&search=${search}`;
    return apiClient.get(url);
  },
  getExpertById: (id) => apiClient.get(`/experts/${id}`),
  createExpert: (data) => apiClient.post('/experts', data),
  login: (data) => apiClient.post('/experts/login', data),
};

// Time Slots API
export const timeSlotsAPI = {
  getTimeSlots: (expertId, date = null) => {
    let url = `/time-slots/${expertId}/slots`;
    if (date) url += `?date=${date}`;
    return apiClient.get(url);
  },
  createTimeSlots: (data) => apiClient.post('/time-slots', data),
  updateTimeSlot: (id, data) => apiClient.patch(`/time-slots/${id}`, data),
};

// Bookings API
export const bookingsAPI = {
  createBooking: (data) => apiClient.post('/bookings', data),
  getBookings: (email) => apiClient.get(`/bookings?email=${email}`),
  getBookingsByExpertId: (expertId) => apiClient.get(`/bookings?expertId=${expertId}`),
  getBookingById: (id) => apiClient.get(`/bookings/${id}`),
  updateBookingStatus: (id, data) => apiClient.patch(`/bookings/${id}/status`, data),
  cancelBooking: (id) => apiClient.patch(`/bookings/${id}/cancel`),
};

export default apiClient;
