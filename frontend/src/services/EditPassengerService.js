import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const EditPassengerService = {
  // Get passenger details by ID
  getPassengerById: async (id) => {
    try {
      const response = await axiosInstance.get(`/passengers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching passenger details:', error);
      throw error;
    }
  },

  // Update passenger details (with file/image upload)
  updatePassenger: async (id, passengerData, file) => {
    try {
      const formData = new FormData();
      formData.append('name', passengerData.name);
      formData.append('email', passengerData.email);
      formData.append('phoneNumber', passengerData.phone);
      formData.append('gender', passengerData.gender);

      if (file) {
        formData.append('photo', file);
      }

      const response = await axiosInstance.put(`/passengers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating passenger:', error);
      throw error;
    }
  },
};

export default EditPassengerService;
