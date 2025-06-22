const express = require('express');
const router = express.Router();
const {
  getAllSingleRides,
  getSingleRideById,
  createSingleRide
} = require('../controllers/singleRideController');

router.get('/single-rides', getAllSingleRides);
router.get('/single-rides/:id', getSingleRideById);
router.post('/single-rides', createSingleRide);

module.exports = router;
