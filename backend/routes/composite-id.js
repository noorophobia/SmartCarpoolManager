const express = require("express");
const router = express.Router();

const SingleRide = require("../models/single-rides");
const CarpoolRide = require("../models/CarpoolRide");
const CompositeId = require("../models/CompositeIds");
const RateSettings = require("../models/RateSetting");
const Driver = require("../models/Driver"); // adjust path if needed

const Counter = require("../models/Counter");

// Composite ID Generator
const generateCompositeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "rideCounter" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return `RIDE-${String(counter.value).padStart(3, "0")}`;
};

// GET route to assign & store composite IDs
router.get("/rides-with-composite-ids", async (req, res) => {
  try {
    const singleRides = await SingleRide.find();
    const carpoolRides = await CarpoolRide.find();

    let createdMappings = [];
    // Add this before processing rides
const rateSettings = await RateSettings.findOne();
const commissionRate = rateSettings ? rateSettings.commission : 10; // default 10%


    const processRide = async (ride, mode) => {
      const existing = await CompositeId.findOne({ rideID: ride._id });
      const date = ride.completedAt || ride.updatedAt || ride.createdAt || new Date();
      if (!existing) {
        const driver = await Driver.findById(ride.driverID);  
    const driverCompositeId = driver?.compositeId || null; 
        const newCompositeId = await generateCompositeId();
        const fare = ride.requestFare || 0;
        const revenue = fare * (commissionRate / 100);
        const newEntry = new CompositeId({
          rideID: ride._id,
          mode,
          compositeId: newCompositeId,
          fare: ride.requestFare,
          revenue,
          driverCompositeId,
          driverID: ride.driverID,
date,
        });

        await newEntry.save();
        createdMappings.push(newEntry);
      }
    };

    // Process single rides
    for (const ride of singleRides) {
      await processRide(ride, "single");
    }

    // Process carpool rides
    for (const ride of carpoolRides) {
      await processRide(ride, "carpool");
    }

    // Return the updated list
    const allMappings = await CompositeId.find();

    res.status(200).json({
      message: `Composite IDs generated for ${createdMappings.length} ride(s).`,
      created: createdMappings,
      allMappings,
    });
  } catch (error) {
    console.error("Error generating composite IDs:", error.message);
    res.status(500).json({ error: error.message });
  }
});
// Get composite ID by rideID
router.get("/composite/ride/:rideID", async (req, res) => {
    const { rideID } = req.params;
  
    try {
      const compositeEntry = await CompositeId.findOne({ rideID });
  
      if (!compositeEntry) {
        return res.status(404).json({ message: "No composite ID found for this rideID" });
      }
  
      res.status(200).json({
        rideID: compositeEntry.rideID,
        compositeId: compositeEntry.compositeId,
        mode: compositeEntry.mode,
        createdAt: compositeEntry.createdAt,
      });
    } catch (error) {
      console.error("Error fetching composite ID by rideID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;
