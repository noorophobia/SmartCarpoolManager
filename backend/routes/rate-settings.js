const express = require('express');
const RateSettings = require('../models/RateSetting');  
const router = express.Router();
const verifyToken= require('../middleware/auth');

// Fetch rate settings
router.get('/rate-settings',verifyToken, async (req, res) => {
  try {
    const rateSettings = await RateSettings.findOne();
    if (!rateSettings) {
      return res.status(404).json({ message: 'Rate settings not found' });
    }
    res.status(200).json(rateSettings);
  } catch (error) {
    console.error('Error fetching rate settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get rate settings by vehicle type
router.get('/rate-settings/:vehicle', verifyToken,async (req, res) => {
  const vehicle = decodeURIComponent(req.params.vehicle); // Decode the URL-encoded vehicle type (like %20 for spaces)
  console.log('Vehicle Type:', vehicle);  // Debugging: Log decoded vehicle type
  
  try {
    // Fetch rate settings from the database where vehicleTypes.type matches the vehicle type
    const rateSettings = await RateSettings.findOne({
      'vehicleTypes.type': vehicle // Querying the vehicleTypes array for the matching type
    });
 
    if (!rateSettings) {
      return res.status(404).json({ message: `Rate settings not found for ${vehicle}` });
    }
    console.log('Fetched Rate Settings:', rateSettings);

    // Find the first matching vehicle type settings object
    const vehicleRateSettings = rateSettings.vehicleTypes.find(v => v.type === vehicle);

    if (!vehicleRateSettings) {
      return res.status(404).json({ message: `No rate settings found for vehicle type: ${vehicle}` });
    }

    // Send back the matched rate settings (not an array, just a single object)
    res.json(vehicleRateSettings);
  } catch (error) {
    console.error('Error fetching rate settings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Update rate settings
router.put('/rate-settings', verifyToken,async (req, res) => {
  try {
    const { vehicleTypes } = req.body;

    if (!vehicleTypes || !Array.isArray(vehicleTypes)) {
      return res.status(400).json({ message: 'Invalid request body' });
    }

    let rateSettings = await RateSettings.findOne();
    if (!rateSettings) {
      rateSettings = new RateSettings({ vehicleTypes });
    } else {
      rateSettings.vehicleTypes = vehicleTypes;
    }

    const updatedRateSettings = await rateSettings.save();
    res.status(200).json(updatedRateSettings);
  } catch (error) {
    console.error('Error updating rate settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
