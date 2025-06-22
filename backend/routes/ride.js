const express = require('express');
const router = express.Router();
const {
  getAllRides,
  getRideById
} = require('../controllers/rideController');

// Get all rides
router.get('/rides', getAllRides);

// Get a single ride by ID
router.get('/rides/:id', getRideById);

module.exports = router;
