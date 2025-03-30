const express = require('express');
const router = express.Router();
const CarpoolRide = require('../models/CarpoolRide'); 

// Get all single rides (GET)
router.get('/carpool-rides', async (req, res) => {
    try {
 
        const carpoolRides = await CarpoolRide.find();

 
        res.status(200).json(carpoolRides);
    } catch (error) {
        console.error("Error fetching rides:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get a single ride by ID (GET)
router.get('/carpool-rides/:id', async (req, res) => {
    try {
         const carpoolRide = await CarpoolRide.findById(req.params.id);
         if (!carpoolRide) return res.status(404).json({ message: 'Single Ride not found' });

        res.status(200).json(carpoolRide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// POST: Create a new carpool ride
router.post("/carpool-rides", async (req, res) => {
    try {
      const newRide = new CarpoolRide(req.body);
      const savedRide = await newRide.save();
      res.status(201).json({
        message: "Carpool ride created successfully",
        ride: savedRide,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });

module.exports = router;
