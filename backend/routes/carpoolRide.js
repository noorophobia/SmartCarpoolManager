const express = require("express");
const router = express.Router();
const carpoolRideService = require("../services/carpoolRideService");

// Get all carpool rides
router.get("/carpool-rides", async (req, res) => {
  try {
    const carpoolRides = await carpoolRideService.getAllCarpoolRides();
    res.status(200).json(carpoolRides);
  } catch (error) {
    console.error("Error fetching rides:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get a single carpool ride by ID
router.get("/carpool-rides/:id", async (req, res) => {
  try {
    const carpoolRide = await carpoolRideService.getCarpoolRideById(req.params.id);
    res.status(200).json(carpoolRide);
  } catch (error) {
    if (error.message === "Carpool Ride not found") {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Create a new carpool ride
router.post("/carpool-rides", async (req, res) => {
  try {
    const savedRide = await carpoolRideService.createCarpoolRide(req.body);
    res.status(201).json({
      message: "Carpool ride created successfully",
      ride: savedRide,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
