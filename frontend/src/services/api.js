import axios from 'axios';

const api = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
  console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const browseExperiences = () => {
  return api.get('/experiences');
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