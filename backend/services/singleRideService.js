const SingleRide = require('../models/single-rides');

const getAllSingleRides = async () => {
  return await SingleRide.find();
};

const getSingleRideById = async (id) => {
  return await SingleRide.findById(id);
};

const createSingleRide = async (rideData) => {
  const newRide = new SingleRide(rideData);
  return await newRide.save();
};

module.exports = {
  getAllSingleRides,
  getSingleRideById,
  createSingleRide,
};
