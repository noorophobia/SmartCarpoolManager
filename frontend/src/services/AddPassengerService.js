import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization token interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AddPassengerService = {
  getAllPassengers: async () => {
    const response = await axiosInstance.get('/passengers');
    return response.data;
  },

  addPassenger: async (passengerData) => {
    const response = await axiosInstance.post('/passengers', passengerData);
    return response.data;
  },
};

export default AddPassengerService;
