const express = require("express");
const router = express.Router();
const rideService = require("../services/rideCompositeService");

router.get("/rides-with-composite-ids", async (req, res) => {
  try {
    const { createdMappings, allMappings } = await rideService.generateCompositeIdsForRides();
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

router.get("/composite/ride/:rideID", async (req, res) => {
  try {
    const compositeEntry = await rideService.getCompositeByRideID(req.params.rideID);
    if (!compositeEntry) {
      return res.status(404).json({ message: "No composite ID found for this rideID" });
    }
    res.status(200).json(compositeEntry);
  } catch (error) {
    console.error("Error fetching composite ID by rideID:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rides-with-composite-ids/:driverCompositeId", async (req, res) => {
  try {
    const rides = await rideService.getRidesByDriverCompositeId(req.params.driverCompositeId);
    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found for this driver." });
    }
    res.status(200).json({ rides });
  } catch (error) {
    console.error("Error fetching rides for driver:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/rides-with-composite-ids/passenger/:passengerId", async (req, res) => {
  try {
    const rides = await rideService.getRidesByPassengerId(req.params.passengerId);
    if (rides.length === 0) {
      return res.status(404).json({ message: "No rides found for this passenger." });
    }
    res.status(200).json({ rides });
  } catch (error) {
    console.error("Error fetching rides for passenger:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
