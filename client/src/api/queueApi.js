import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:', {
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  DEFAULT_FALLBACK: 'http://localhost:5000/api',
  FINAL_API_URL: API_URL
});

const queueApi = {
  // Get all queues
  getQueues: async () => {
    try {
      const response = await axios.get(`${API_URL}/queues`);
      return response.data;
    } catch (error) {
      console.error('Error fetching queues:', error);
      throw error;
    }
  },

  // Book a token
  bookToken: async (patientData) => {
    try {
      const response = await axios.post(`${API_URL}/queue/book`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error booking token:', error);
      throw error;
    }
  },

  // Get token status
  getTokenStatus: async (tokenId) => {
    try {
      const response = await axios.get(`${API_URL}/token/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token status:', error);
      throw error;
    }
  },

  // Call next token
  callNextToken: async (counterId) => {
    try {
      const response = await axios.post(`${API_URL}/counter/next`, { counterId });
      return response.data;
    } catch (error) {
      console.error('Error calling next token:', error);
      throw error;
    }
  },

  // Get counter status
  getCounterStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/counters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching counter status:', error);
      throw error;
    }
  }
};

export default queueApi;
