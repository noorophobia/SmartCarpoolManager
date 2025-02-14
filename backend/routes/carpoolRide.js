const express = require('express');
const mongoose = require('mongoose');
const CarpoolRide = require('../models/CarpoolRide'); // Import the CarpoolRide model
const verifyToken = require('../middleware/auth');

const router = express.Router();
// Function to generate a composite ride ID
const generateCompositeId = async () => {
    const rideCount = await Ride.countDocuments();
    return `CP-RIDE-${String(rideCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
  };

//  Fetch all rides

 router.get('/carpool-rides', verifyToken, async (req, res) => {
    try {
      // Find all rides that are missing a compositeId
      const ridesWithoutCompositeId = await CarpoolRide.find({ compositeId: { $exists: false } });
  
      // Update each ride with a new compositeId
      for (const ride of ridesWithoutCompositeId) {
        ride.compositeId = await generateCompositeId();
        await ride.save();
      }
  
      // Fetch all rides after ensuring compositeId is set
      const rides = await CarpoolRide.find()
        .populate('driverId', 'name email') // Populate driver details
        .populate('passengerIds', 'name email') // Populate passenger details
        .populate('vehicleId', 'model plateNumber'); // Populate vehicle details
  
      res.status(200).json(rides);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
    }
  });

// Fetch a specific ride by ID
router.get('/carpool-ride/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const ride = await CarpoolRide.findById(id)
      .populate('driverId', 'name email') // Populate driver details
      .populate('passengerIds', 'name email') // Populate passenger details
      .populate('vehicleId', 'model plateNumber'); // Populate vehicle details

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ride details', error: error.message });
  }
});

module.exports = router;
