import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const browseExperiences = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return api.get(`/experiences?${params}`);
};

export const getExperience = (id) => api.get(`/experiences/${id}`);

export const createBooking = (data) => api.post('/bookings', data);

export const getGuideBookings = (guideId) => api.get(`/bookings/guide/${guideId}`);

export const createExperience = (data) => api.post('/experiences', data);

export const setUserRole = (role) => api.post('/auth/set-role', { role });

export const getProfile = () => api.get('/auth/profile');

export const listGuides = () => api.get('/admin/guides');

export const approveGuide = (guideId) => api.post(`/admin/guides/approve/${guideId}`);

export default api;