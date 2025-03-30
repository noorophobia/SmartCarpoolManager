import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/login', { email, password });
      return response.data; // { token: '...' }
    } catch (error) {
      throw error.response?.data?.error || 'Failed to login. Please try again.';
    }
  },

  resetPassword: async (email) => {
    try {
      const response = await axiosInstance.post('/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to reset password. Please try again.';
    }
  },
};

export default AuthService;
