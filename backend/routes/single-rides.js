const express = require('express');
const router = express.Router();
const SingleRide = require('../models/single-rides'); // Import SingleRide model

// Get all single rides (GET)
router.get('/single-rides', async (req, res) => {
    try {
        console.log("Fetching all single rides");

        const singleRides = await SingleRide.find();

        console.log("Fetched Single Rides:", singleRides);

        res.status(200).json(singleRides);
    } catch (error) {
        console.error("Error fetching rides:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a single ride by ID (GET)
router.get('/single-rides/:id', async (req, res) => {
    try {
        console.log("req id "+ req.params.id)
        const singleRide = await SingleRide.findById(req.params.id);
         if (!singleRide) return res.status(404).json({ message: 'Single Ride not found' });

        res.status(200).json(singleRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST: Create a new ride
router.post("/single-rides", async (req, res) => {
    try {
      const {
        requestOrigin,
        requestDestination,
        status,
        paymentId,
        vehicleId,
        passengerId,
        driverID,
        passengerRating,
        passengerReview,
        driverRating,
        driverReview,
        date,
        isResolved,
        requestFare
      } = req.body;
  
      const newRide = new SingleRide({
        requestOrigin,
        requestDestination,
        status,
        paymentId,
         passengerId,
        driverID,
        passengerRating,
        passengerReview,
        driverRating,
        driverReview,
        date,
        isResolved,
        requestFare
      });
  
      const savedRide = await newRide.save();
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
