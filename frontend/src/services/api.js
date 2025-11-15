const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
};

// Experiences API  
export const experiencesAPI = {
  getAll: () => api.get('/experiences/'),
  getById: (id) => api.get(`/experiences/${id}/`),
  create: (data) => api.post('/experiences/', data),
};

export default api;