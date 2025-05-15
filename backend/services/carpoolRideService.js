const CarpoolRide = require("../models/CarpoolRide");

const getAllCarpoolRides = async () => {
  return await CarpoolRide.find();
};

const getCarpoolRideById = async (id) => {
  const ride = await CarpoolRide.findById(id);
  if (!ride) throw new Error("Carpool Ride not found");
  return ride;
};

const createCarpoolRide = async (rideData) => {
  const newRide = new CarpoolRide(rideData);
  return await newRide.save();
};

module.exports = {
  getAllCarpoolRides,
  getCarpoolRideById,
  createCarpoolRide,
};
