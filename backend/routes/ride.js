const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const SingleRide = require('../models/single-rides');
const CarpoolRide = require('../models/CarpoolRide'); // Ensure correct model name

// Get rides where the user is a DRIVER
router.get('/rides/driver/:id', async (req, res) => {
    console.log("Received request at /rides/driver/:id");

    try {
        const { id } = req.params;
        console.log(`Fetching all rides where user is driver: ${id}`);

        // Fetch ALL rides from DB
        const [allSingleRides, allCarpoolRides] = await Promise.all([
            SingleRide.find(),
            CarpoolRide.find()
        ]);

        console.log("Total Rides Fetched:", {
            single: allSingleRides.length,
            carpool: allCarpoolRides.length
        });

        // Filter rides where the user is the driver
        const singleRides = allSingleRides.filter(ride => ride.driverID == id);
        const carpoolRides = allCarpoolRides.filter(ride => ride.driverID == id);

        console.log("Filtered Driver Rides:", { singleRides, carpoolRides });

        res.status(200).json({ singleRides, carpoolRides });
    } catch (error) {
        console.error("Error fetching driver rides:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get rides where the user is a PASSENGER
router.get('/rides/passenger/:id', async (req, res) => {
    console.log("Received request at /rides/passenger/:id");

    try {
        const { id } = req.params;
        console.log(`Fetching all rides where user is passenger: ${id}`);

        // Fetch ALL rides from DB
        const [allSingleRides, allCarpoolRides] = await Promise.all([
            SingleRide.find(),
            CarpoolRide.find()
        ]);

        console.log("Total Rides Fetched:", {
            single: allSingleRides.length,
            carpool: allCarpoolRides.length
        });

        // Filter rides where the user is a passenger
        const singlePassengerRides = allSingleRides.filter(ride => ride.passengerId == id);
        const carpoolPassengerRides = allCarpoolRides.filter(ride => ride.passengerId.includes(id)); // Array check

        console.log("Filtered Passenger Rides:", { singlePassengerRides, carpoolPassengerRides });

        res.status(200).json({ singlePassengerRides, carpoolPassengerRides });
    } catch (error) {
        console.error("Error fetching passenger rides:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
