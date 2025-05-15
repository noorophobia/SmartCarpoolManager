import axios from 'axios';

const API_URL = 'http://localhost:5000';
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
   headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// ✅ Get passenger by ID
const getPassengerById = async (id) => {
  const response = await axiosInstance.get(`http://localhost:5000/passengers/${id}`);
  return response.data;
};

// ✅ Get rides by passenger ID
const getRidesByPassengerId = async (passengerId) => {
  const response = await axiosInstance.get(`http://localhost:5000/rides-with-composite-ids/passenger/${passengerId}`);
  return response.data.rides;
};

// Other existing functions:
const getAllPassengers = async () => {
  const response = await axiosInstance.get('http://localhost:5000/passengers');
  console.log("Get all passenger"+response)
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
  await axiosInstance.delete(`http://localhost:5000/passengers/${id}`);
};

const PassengerService = {
  getAllPassengers,
  getPassengerById,
  getRidesByPassengerId,
  deletePassengerById,
};

export default PassengerService;
