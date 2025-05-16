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
    console.log(rateSettings)
    res.status(200).json(rateSettings);
  } catch (error) {
    console.error('Error fetching rate settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Route to get rate settings by vehicle type
router.get('/rate-settings/:vehicle', verifyToken, async (req, res) => {
  const vehicle = decodeURIComponent(req.params.vehicle).toLowerCase().trim(); // Normalize input
  console.log('Vehicle Type:', vehicle);

  try {
    // Fetch rate settings from the database where vehicleTypes.type matches the vehicle type (case-insensitive)
    const rateSettings = await RateSettings.findOne({
      'vehicleTypes.type': { $regex: new RegExp(`^${vehicle}$`, 'i') } // Case-insensitive exact match
    });

    if (!rateSettings) {
      return res.status(404).json({ message: `Rate settings not found for ${vehicle}` });
    }
    console.log('Fetched Rate Settings:', rateSettings);

    // Find the first matching vehicle type settings object
    const vehicleRateSettings = rateSettings.vehicleTypes.find(v => v.type.toLowerCase() === vehicle);

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

router.get("/rate-settings/commission", verifyToken, async (req, res) => {
  try {
    const rateSettings = await RateSettings.findOne();
    if (!rateSettings) {
      return res.status(404).json({ message: "Rate settings not found" });
    }
    res.status(200).json({ commission: rateSettings.commission });
  } catch (error) {
    console.error("Error fetching commission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/rate-settings/commission", verifyToken, async (req, res) => {
  const { commission } = req.body;

  if (commission < 0 || commission > 100) {
    return res.status(400).json({
      message: "Commission rate must be a percentage between 0 and 100.",
    });
  }

  try {
    let rateSettings = await RateSettings.findOne();

    if (!rateSettings) {
      return res
        .status(404)
        .json({ message: "Rate settings not found to update commission." });
    }

    rateSettings.commission = commission;
    rateSettings.updatedAt = Date.now();

    const updatedRateSettings = await rateSettings.save();
    res.status(200).json({
      message: "Commission updated successfully.",
      commission: updatedRateSettings.commission,
    });
  } catch (error) {
    console.error("Error updating commission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;