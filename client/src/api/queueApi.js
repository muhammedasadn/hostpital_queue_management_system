import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const queueApi = {
  // Get all active queues
  getQueues: async () => {
    try {
      const response = await axios.get(`${API_URL}/queues`);
      return response.data;
    } catch (error) {
      console.error('Error fetching queues:', error);
      throw error;
    }
  },

  // Get status of all doctor counters
  getCounterStatus: async () => {
    try {
      const response = await axios.get(`${API_URL}/counters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching counter status:', error);
      throw error;
    }
  },

  // Book a patient token
  bookToken: async (patientData) => {
    try {
      const response = await axios.post(`${API_URL}/queue/book`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error booking token:', error);
      throw error;
    }
  },

  // Get individual token pass status
  getTokenStatus: async (tokenId) => {
    try {
      const response = await axios.get(`${API_URL}/token/${tokenId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token status:', error);
      throw error;
    }
  },

  // Call next token for doctor counter
  callNextToken: async (counterId) => {
    try {
      const response = await axios.post(`${API_URL}/counter/next`, { counterId });
      return response.data;
    } catch (error) {
      console.error('Error calling next token:', error);
      throw error;
    }
  },

  // Mark token completed
  completeToken: async (counterId, tokenId) => {
    try {
      const response = await axios.post(`${API_URL}/counter/complete`, { counterId, tokenId });
      return response.data;
    } catch (error) {
      console.error('Error completing token:', error);
      throw error;
    }
  },

  // Reset all hospital queues (Admin)
  resetQueues: async () => {
    try {
      const response = await axios.post(`${API_URL}/queue/reset`);
      return response.data;
    } catch (error) {
      console.error('Error resetting queues:', error);
      throw error;
    }
  },

  // Get hospital operational metrics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching system stats:', error);
      throw error;
    }
  }
};

export default queueApi;
