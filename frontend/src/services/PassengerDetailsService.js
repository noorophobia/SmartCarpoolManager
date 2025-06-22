import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create a configured axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const PassengerDetailsService = {
  // Fetch passenger details by ID
  getPassengerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/passengers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching passenger details:', error);
      throw error;
    }
  },

  // Fetch all rides by passenger ID
  getRidesByPassengerId: async (id) => {
    try {
      const response = await axiosInstance.get(`/rides-with-composite-ids/passenger/${id}`);
      return response.data.rides || [];
    } catch (error) {
      console.error('Error fetching rides for passenger:', error);
      throw error;
    }
  },
};

export default PassengerDetailsService;
