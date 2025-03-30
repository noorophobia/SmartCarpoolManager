import axios from 'axios';

const API_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// ✅ Get passenger by ID
const getPassengerById = async (id) => {
  const response = await axiosInstance.get(`/passengers/${id}`);
  return response.data;
};

// ✅ Get rides by passenger ID
const getRidesByPassengerId = async (passengerId) => {
  const response = await axiosInstance.get(`/rides-with-composite-ids/passenger/${passengerId}`);
  return response.data.rides;
};

// Other existing functions:
const getAllPassengers = async () => {
  const response = await axiosInstance.get('/passengers');
  return response.data.map((passenger) => ({
    id: passenger._id,
    compositeId: passenger.compositeId,
    name: passenger.name,
    gender: passenger.gender || 'male',
    email: passenger.email,
    phone: passenger.phone,
  }));
};

const deletePassengerById = async (id) => {
  await axiosInstance.delete(`/passengers/${id}`);
};

const PassengerService = {
  getAllPassengers,
  getPassengerById,
  getRidesByPassengerId,
  deletePassengerById,
};

export default PassengerService;
