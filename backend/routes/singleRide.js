const express = require('express');
const router = express.Router();
const SingleRide = require('../models/SingleRide'); // Import SingleRide model

// Function to generate a composite single ride ID
const generateCompositeId = async () => {
    const rideCount = await SingleRide.countDocuments();
    return `SINGLE-RIDE-${String(rideCount + 1).padStart(3, '0')}`;
};

// Get all single rides (GET) with composite ID
router.get('/single-rides', async (req, res) => {
    try {
        const singleRides = await SingleRide.find().populate('paymentId vehicleId driverId');
        const ridesWithCompositeId = await Promise.all(
            singleRides.map(async (ride) => {
                if (!ride.compositeId) {
                    ride.compositeId = await generateCompositeId();
                    await ride.save();
                }
                return ride;
            })
        );
        res.status(200).json(ridesWithCompositeId);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single ride by ID (GET) with composite ID
router.get('/single-rides/:id', async (req, res) => {
    try {
        const singleRide = await SingleRide.findById(req.params.id).populate('paymentId vehicleId driverId');
        if (!singleRide) return res.status(404).json({ message: 'Single Ride not found' });
        
        if (!singleRide.compositeId) {
            singleRide.compositeId = await generateCompositeId();
            await singleRide.save();
        }
        
        res.status(200).json(singleRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;