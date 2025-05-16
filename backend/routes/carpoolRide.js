const express = require("express");
const router = express.Router();
const carpoolRideController = require("../controllers/carpoolRideController");

router.get("/carpool-rides", carpoolRideController.getAllCarpoolRides);
router.get("/carpool-rides/:id", carpoolRideController.getCarpoolRideById);
router.post("/carpool-rides", carpoolRideController.createCarpoolRide);

module.exports = router;
