import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create Axios Instance with default config
const api = axios.create({
  baseURL: API_URL
});

// Interceptor to attach JWT Auth header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carequeue_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const queueApi = {
  // Staff Login API
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error.response?.data?.error || 'Invalid credentials';
    }
  },

  // Fetch current user profile
  getMe: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get profile failed:', error);
      throw error;
    }
  },

  // Admin Register Staff Account
  registerStaff: async (staffData) => {
    try {
      const response = await api.post('/auth/register-staff', staffData);
      return response.data;
    } catch (error) {
      console.error('Register staff failed:', error);
      throw error.response?.data?.error || 'Registration failed';
    }
  },

  // Public Queues
  getQueues: async () => {
    try {
      const response = await api.get('/queues');
      return response.data;
    } catch (error) {
      console.error('Error fetching queues:', error);
      throw error;
    }
  },

  // Public Counters
  getCounterStatus: async () => {
    try {
      const response = await api.get('/counters');
      return response.data;
    } catch (error) {
      console.error('Error fetching counter status:', error);
      throw error;
    }
  },

  // Book Token
  bookToken: async (patientData) => {
    try {
      const response = await api.post('/queue/book', patientData);
      return response.data;
    } catch (error) {
      console.error('Error booking token:', error);
      throw error;
    }
  },

  // Get Token Status
  getTokenStatus: async (tokenId) => {
    try {
      const response = await api.get(`/token/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token status:', error);
      throw error;
    }
  },

  // Doctor Dispatch Actions (Protected)
  callNextToken: async (counterId) => {
    try {
      const response = await api.post('/counter/next', { counterId });
      return response.data;
    } catch (error) {
      console.error('Error calling next token:', error);
      throw error.response?.data?.error || 'Failed to dispatch next token';
    }
  },

  // Complete Token (Protected)
  completeToken: async (counterId, tokenId) => {
    try {
      const response = await api.post('/counter/complete', { counterId, tokenId });
      return response.data;
    } catch (error) {
      console.error('Error completing token:', error);
      throw error.response?.data?.error || 'Failed to complete token';
    }
  },

  // Reset Queues (Admin Protected)
  resetQueues: async () => {
    try {
      const response = await api.post('/queue/reset');
      return response.data;
    } catch (error) {
      console.error('Error resetting queues:', error);
      throw error.response?.data?.error || 'Failed to reset queues';
    }
  },

  // Operational Metrics (Admin Protected)
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }
};

export default queueApi;
