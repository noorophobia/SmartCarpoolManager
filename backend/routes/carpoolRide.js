const express = require('express');
const router = express.Router();
const CarpoolRide = require('../models/CarpoolRide'); 

// Get all single rides (GET)
router.get('/carpool-rides', async (req, res) => {
    try {
        console.log("Fetching all single rides");

        const carpoolRides = await CarpoolRide.find();

        console.log("Fetched Single Rides:", carpoolRides);

        res.status(200).json(carpoolRides);
    } catch (error) {
        console.error("Error fetching rides:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a single ride by ID (GET)
router.get('/carpool-rides/:id', async (req, res) => {
    try {
        console.log("req id "+ req.params.id)
        const carpoolRide = await CarpoolRide.findById(req.params.id);
        console.log("inside ride"+ carpoolRide)
        if (!carpoolRide) return res.status(404).json({ message: 'Single Ride not found' });

        res.status(200).json(carpoolRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
