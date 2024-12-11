// routes/drivers.js

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

router.post('/drivers', async (req, res) => {
  try {
    const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings } = req.body;
    
    // Ensure all required fields are present
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of Birth required.' });
    }

    const newDriver = new Driver({
      name, gender, email, phoneNumber, cnic, dateOfBirth, ratings
    });

    await newDriver.save();
    res.status(201).json(newDriver); // Return the created driver object with the timestamp
  } catch (error) {
    res.status(500).json({ message: 'Error adding driver. Please try again.', error: error.message });
  }
});

// Update driver details
router.put('/drivers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings } = req.body;

  // Validate if all required fields are present
  if (!name || !gender || !email || !phoneNumber || !cnic || !dateOfBirth || ratings === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Update the driver in the database
    const driver = await Driver.findByIdAndUpdate(
      id,
      { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings },
      { new: true } // To return the updated driver
    );

    // If no driver is found, return an error
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

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
