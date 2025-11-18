import axios from 'axios';

// Use environment variable for API URL or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to include auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Request failed';
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      return Promise.reject({
        message,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // Request made but no response received
      return Promise.reject({
        message: 'Network error: Unable to connect to server. Please check if the backend is running.',
        status: 0
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: 'Request failed',
        status: 0
      });
    }
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
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  
  // Booking Management
  getAllBookings: () => api.get('/admin/bookings'),
  
  // Statistics
  getStatistics: () => api.get('/admin/statistics'),
  
  // Guide Management
  listGuides: () => api.get('/admin/guides'),
  approveGuide: (guideId) => api.put(`/admin/guides/${guideId}/approve`),
  getPendingGuides: () => api.get('/admin/guides/pending'),
  
  // Experience Management
  getPendingExperiences: () => api.get('/admin/experiences/pending'),
  approveExperience: (experienceId) => api.put(`/admin/experiences/${experienceId}/approve`),
};

// Health check
export const healthCheck = () => api.get('/health');

// Test connection
export const testConnection = async () => {
  try {
    const response = await healthCheck();
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default api;