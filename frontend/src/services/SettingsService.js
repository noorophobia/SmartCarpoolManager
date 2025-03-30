import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const SettingsService = {
  updatePassword: async (email, newPassword) => {
    try {
      const response = await axiosInstance.put('/update-password', { email, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to update password. Please try again.';
    }
  },
};

export default SettingsService;
