import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/drivers';

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

const DriverService = {
  getDriverById: async (id) => {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  },

  getAllDrivers: async () => {
    const response = await axiosInstance.get('/');
    return response.data;
  },

  getApprovedDrivers: async () => {
    const response = await axiosInstance.get('/approved');
    return response.data;
  },

  deleteDriver: async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  },

  updateDriver: async (id, driverData) => {
    const response = await axiosInstance.put(`/${id}`, driverData);
    return response.data;
  },

  unblockDriver: async (id) => {
    const response = await axiosInstance.put(`/block/${id}`, { isBlocked: false });
    return response.data;
  },

  fetchRidesByCompositeId: async (compositeId) => {
    const response = await axios.get(`http://localhost:5000/rides-with-composite-ids/${compositeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.rides;
  },
  addDriver: async (driverData) => {
    const response = await axiosInstance.post('/', driverData);
    return response.data;
  },

  uploadImageToImgbb: async (file) => {
    const apiKey = '068837d15525cd65b1c49b07e618821b';
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data?.data?.url) {
        return response.data.data.url;
      } else {
        console.error('Imgbb response missing URL:', response.data);
        return null;
      }
    } catch (error) {
      console.error('Image upload to Imgbb failed:', error);
      return null;
    }
  },
};

export default DriverService;
