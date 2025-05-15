const express = require('express');
const router = express.Router();
const singleRideService = require('../services/singleRideService');

// GET all single rides
router.get('/single-rides', async (req, res) => {
  try {
    const singleRides = await singleRideService.getAllSingleRides();
    res.status(200).json(singleRides);
  } catch (error) {
    console.error("Error fetching rides:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET single ride by ID
router.get('/single-rides/:id', async (req, res) => {
  try {
    const ride = await singleRideService.getSingleRideById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Single Ride not found' });
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create a new ride
router.post('/single-rides', async (req, res) => {
  try {
    const rideData = req.body;
    const savedRide = await singleRideService.createSingleRide(rideData);
    res.status(201).json({
      message: "Ride created successfully",
      ride: savedRide,
    });
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
