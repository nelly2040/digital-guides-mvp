import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data part
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Experiences API
export const experiencesAPI = {
  getAll: (filters = {}) => api.get('/experiences', { params: filters }),
  getById: (id) => api.get(`/experiences/${id}`),
  create: (data) => api.post('/experiences', data),
  update: (id, data) => api.put(`/experiences/${id}`, data),
  delete: (id) => api.delete(`/experiences/${id}`),
  getByGuide: () => api.get('/experiences/guide'),
  getMyExperiences: () => api.get('/experiences/my-experiences'),
};

// Bookings API
export const bookingsAPI = {
  create: (data) => api.post('/bookings', data),
  getUserBookings: () => api.get('/bookings/user'),
  getGuideBookings: () => api.get('/bookings/guide'),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

// Reviews API
export const reviewsAPI = {
  getByExperience: (experienceId) => api.get(`/reviews/experience/${experienceId}`),
  create: (data) => api.post('/reviews', data),
};

// Admin API
export const adminAPI = {
  listGuides: () => api.get('/admin/guides'),
  approveGuide: (guideId) => api.put(`/admin/guides/${guideId}/approve`),
  getPendingGuides: () => api.get('/admin/guides/pending'),
  getPendingExperiences: () => api.get('/admin/experiences/pending'),
  approveExperience: (experienceId) => api.put(`/admin/experiences/${experienceId}/approve`),
};

export default api;