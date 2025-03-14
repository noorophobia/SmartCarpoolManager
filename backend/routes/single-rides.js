const express = require('express');
const router = express.Router();
const SingleRide = require('../models/single-rides'); // Import SingleRide model

// Function to generate a composite single ride ID
const generateCompositeId = async () => {
    const rideCount = await SingleRide.countDocuments();
    return `SINGLE-RIDE-${String(rideCount + 1).padStart(3, '0')}`;
};

// Get all single rides (GET) with composite ID
router.get('/single-rides', async (req, res) => {
    try {
        console.log("Fetching all single rides");

        const singleRides = await SingleRide.find();

        console.log("Fetched Single Rides:", singleRides);

        // Loop through rides and ensure they have compositeId
        for (let ride of singleRides) {
            if (!ride.compositeId) {
                ride.compositeId = await generateCompositeId();
                await SingleRide.updateOne({ _id: ride._id }, { $set: { compositeId: ride.compositeId } });
                console.log(`Updated ride ${ride._id} with Composite ID: ${ride.compositeId}`);
            }
        }

        res.status(200).json(singleRides);
    } catch (error) {
        console.error("Error fetching rides:", error.message);
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