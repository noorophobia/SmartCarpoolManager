const express = require('express');
const mongoose = require('mongoose');
const SingleRide = require('../models/SingleRide'); // Import the SingleRide model
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Function to generate a unique composite ride ID
const generateCompositeId = async () => {
  const rideCount = await SingleRide.countDocuments();
  return `SG-RIDE-${String(rideCount + 1).padStart(3, '0')}`; // Generates IDs like SG-RIDE-001, SG-RIDE-002, etc.
};

// Fetch all rides and ensure compositeId is set
router.get('/single-rides', verifyToken, async (req, res) => {
  try {
    // Find all rides that are missing a compositeId
    const ridesWithoutCompositeId = await SingleRide.find({ compositeId: { $exists: false } });

    // Update each ride with a new compositeId
    for (const ride of ridesWithoutCompositeId) {
      ride.compositeId = await generateCompositeId();
      await ride.save();
    }

    // Fetch all rides after ensuring compositeId is set
    const rides = await SingleRide.find()
      .populate('driverId', 'name email phoneNumber') // Populate driver details
      .populate('vehicleId', 'model plateNumber') // Populate vehicle details
      .populate('paymentIds'); // Populate payment details (optional)

    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rides', error: error.message });
  }
});

// Fetch a specific ride by ID
router.get('/single-ride/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const ride = await SingleRide.findById(id)
      .populate('driverId', 'name email phoneNumber')
      .populate('vehicleId', 'model plateNumber')
      .populate('paymentIds');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ride details', error: error.message });
  }
});

module.exports = router;
