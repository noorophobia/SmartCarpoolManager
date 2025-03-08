const express = require('express');
const router = express.Router();
const CarpoolRide = require('../models/CarpoolRide'); // Import CarpoolRide model

// Function to generate a composite carpool ride ID
const generateCompositeId = async () => {
    const rideCount = await CarpoolRide.countDocuments();
    return `CARPOOL-RIDE-${String(rideCount + 1).padStart(3, '0')}`;
};

// Get all carpool rides (GET) with composite ID
router.get('/carpool-rides', async (req, res) => {
    try {
        const carpoolRides = await CarpoolRide.find().populate('paymentIds vehicleId driverId passengerIds');
        const ridesWithCompositeId = await Promise.all(
            carpoolRides.map(async (ride) => {
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

// Get a single carpool ride by ID (GET)
router.get('/carpool-rides/:id', async (req, res) => {
    try {
        const carpoolRide = await CarpoolRide.findById(req.params.id).populate('paymentIds vehicleId driverId passengerIds');
        if (!carpoolRide) return res.status(404).json({ message: 'Carpool Ride not found' });
        
        if (!carpoolRide.compositeId) {
            carpoolRide.compositeId = await generateCompositeId();
            await carpoolRide.save();
        }
        
        res.status(200).json(carpoolRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
