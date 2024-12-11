// server.js or routes/drivers.js

const express = require('express');
const mongoose = require('mongoose');
const Driver = require('../models/Driver'); // Import the Driver model

 const router = express.Router();

// Fetch all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
});

// Add a new driver
router.post('/drivers', async (req, res) => {
  try {
    console.log('Request body:', req.body);  // Inspect the data

    const { name, gender, email, phoneNumber, cnic } = req.body;
    const newDriver = new Driver({ name, gender, email, phoneNumber, cnic });

    console.log('New driver before save:', newDriver);

    // Explicitly call the pre-save hook
    await newDriver.validate();  // Ensure validation is done before saving
    await newDriver.save();      // Save the driver after validation
    res.status(201).json(newDriver);
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ message: 'Error adding driver. Please try again.', error: error.message });
  }
});

  
// Update driver details
router.put('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gender, email, phoneNumber,cnic } = req.body;

  try {
    const driver = await Driver.findByIdAndUpdate(
      id,
      { name, gender, email, phoneNumber,cnic},
      { new: true }
    );
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update driver' });
  }
});

// Delete a driver
router.delete('/drivers/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Driver.findByIdAndDelete(id);
    res.status(200).json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete driver' });
  }
});

module.exports = router;
