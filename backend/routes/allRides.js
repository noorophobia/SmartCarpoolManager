const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideCompositeController");

router.get("/rides-with-composite-ids", rideController.generateCompositeIdsForRides);
router.get("/composite/ride/:rideID", rideController.getCompositeByRideID);
router.get("/rides-with-composite-ids/:driverCompositeId", rideController.getRidesByDriverCompositeId);
router.get("/rides-with-composite-ids/passenger/:passengerId", rideController.getRidesByPassengerId);

module.exports = router;
