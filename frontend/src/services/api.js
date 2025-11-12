import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

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

// Reviews
export const getReviews = (experienceId) => api.get(`/reviews/${experienceId}`);

export const createReview = (data) => api.post('/reviews', data);

export default api;