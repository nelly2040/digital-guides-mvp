// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Add body for non-GET requests
  if (options.body && config.headers['Content-Type'] === 'application/json') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  },

  login: async (credentials) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  getProfile: async () => {
    return apiRequest('/api/auth/profile');
  },
};

// Experiences API calls
export const experiencesAPI = {
  // Get all experiences
  getAll: async () => {
    return apiRequest('/api/experiences');
  },

  // Get single experience by ID
  getById: async (id) => {
    return apiRequest(`/api/experiences/${id}`);
  },

  // Get availability for an experience
  getAvailability: async (experienceId, startDate = null, endDate = null) => {
    let url = `/api/experiences/${experienceId}/availability`;
    
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return apiRequest(url);
  },

  // Search experiences
  search: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.date) params.append('date', filters.date);
    if (filters.availability) params.append('availability', filters.availability);
    
    return apiRequest(`/api/experiences/search?${params.toString()}`);
  },

  // Create experience (for guides)
  create: async (experienceData) => {
    return apiRequest('/api/experiences', {
      method: 'POST',
      body: experienceData,
    });
  },

  // Get guide's experiences
  getMyExperiences: async () => {
    return apiRequest('/api/experiences/my-experiences');
  },
};

// Bookings API calls
export const bookingsAPI = {
  // Create booking
  create: async (bookingData) => {
    return apiRequest('/api/bookings', {
      method: 'POST',
      body: bookingData,
    });
  },

  // Get user's bookings
  getMyBookings: async () => {
    return apiRequest('/api/bookings/my-bookings');
  },

  // Get all bookings (admin only)
  getAll: async () => {
    return apiRequest('/api/admin/bookings');
  },

  // Delete booking
  delete: async (bookingId) => {
    return apiRequest(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },
};

// Admin API calls
export const adminAPI = {
  // Get all users
  getUsers: async () => {
    return apiRequest('/api/admin/users');
  },

  // Get statistics
  getStatistics: async () => {
    return apiRequest('/api/admin/statistics');
  },
};

// Image upload API
export const uploadAPI = {
  // Upload single image
  uploadImage: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },
};

// Contact/messaging API
export const contactAPI = {
  // Send message to guide
  sendMessage: async (guideId, message) => {
    return apiRequest('/api/contact/guide', {
      method: 'POST',
      body: {
        guide_id: guideId,
        message: message,
      },
    });
  },
};

// Utility functions
export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get user role
  getUserRole: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role;
  },

  // Check if user is admin
  isAdmin: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin';
  },

  // Check if user is guide
  isGuide: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'guide';
  },

  // Check if user is traveler
  isTraveler: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'traveler';
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
};
