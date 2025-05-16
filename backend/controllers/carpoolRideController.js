const carpoolRideService = require("../services/carpoolRideService");

const getAllCarpoolRides = async (req, res) => {
  try {
    const carpoolRides = await carpoolRideService.getAllCarpoolRides();
    res.status(200).json(carpoolRides);
  } catch (error) {
    console.error("Error fetching rides:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getCarpoolRideById = async (req, res) => {
  try {
    const carpoolRide = await carpoolRideService.getCarpoolRideById(req.params.id);
    if (!carpoolRide) return res.status(404).json({ message: "Carpool Ride not found" });
    res.status(200).json(carpoolRide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCarpoolRide = async (req, res) => {
  try {
    const savedRide = await carpoolRideService.createCarpoolRide(req.body);
    res.status(201).json({
      message: "Carpool ride created successfully",
      ride: savedRide,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ VERY IMPORTANT: Export the functions correctly
module.exports = {
  getAllCarpoolRides,
  getCarpoolRideById,
  createCarpoolRide,
};
