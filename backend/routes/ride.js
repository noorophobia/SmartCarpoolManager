const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride'); // Import Ride model

// Function to generate a composite ride ID
const generateCompositeId = async () => {
    const rideCount = await Ride.countDocuments();
    return `RIDE-${String(rideCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
  };

// Create a new ride (POST)
router.post('/', async (req, res) => {
    try {
        const { pickUpLocation, dropOffLocation, rideMode } = req.body;
        
        if (!pickUpLocation || !dropOffLocation || !rideMode) {
            return res.status(400).json({ error: "Missing required fields: pickUpLocation, dropOffLocation, rideMode" });
        }

        const compositeId = await generateCompositeId(pickUpLocation, dropOffLocation, rideMode); // Generate unique Ride ID
        const newRide = new Ride({ ...req.body, rideID: compositeId });
        const savedRide = await newRide.save();
        res.status(201).json(savedRide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all rides (GET)
router.get('/', async (req, res) => {
    try {
        const rides = await Ride.find().populate('paymentIds vehicleId driverId passengerIds');
        res.status(200).json(rides);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single ride by ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id).populate('paymentIds vehicleId driverId passengerIds');
        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.status(200).json(ride);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a ride by ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updatedRide = await Ride.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRide) return res.status(404).json({ message: 'Ride not found' });
        res.status(200).json(updatedRide);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a ride by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedRide = await Ride.findByIdAndDelete(req.params.id);
        if (!deletedRide) return res.status(404).json({ message: 'Ride not found' });
        res.status(200).json({ message: 'Ride deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
