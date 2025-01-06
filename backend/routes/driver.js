// routes/drivers.js

const express = require('express');
const mongoose = require('mongoose');
const Driver = require('../models/Driver'); // Import the Driver model
const verifyToken= require('../middleware/auth');
const router = express.Router();

// Fetch all drivers
router.get('/drivers',verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
});
// Fetch a single driver by ID
router.get('/drivers/:id', verifyToken,async (req, res) => {
  const { id } = req.params;

  try {
    // Find the driver by the compositeId or MongoDB _id
    const driver = await Driver.findById(id);  // MongoDB's findById method

    // If the driver is not found, return a 404 error
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);  // Return the driver details as JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});


// Function to generatappe composite ID
const generateCompositeId = async () => {
  const driverCount = await Driver.countDocuments();
  return `DR-${String(driverCount + 1).padStart(3, '0')}`; // Generate ID like DR-001, DR-002, etc.
};

// Add a new driver
 router.post('/drivers',verifyToken, async (req, res) => {
  try {
    console.log("body"+req.body);
    const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings } = req.body;
     console.log(dateOfBirth);
    // Ensure all required fields are present

    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of Birth required.' });
    }
const isApproved=true;
const createdAt=new Date();
    const newDriver = new Driver({
      name, gender, email, phoneNumber, cnic, dateOfBirth, ratings,
      isApproved,// Explicitly set default if missing
      createdAt, // Ensure createdAt is always set to the current time
    });
     // Save the driver first
    await newDriver.save();

    // Generate the composite ID after the driver has been saved
    const compositeId = await generateCompositeId();

    // Update the driver with the generated composite ID
    const updatedDriver = await Driver.findByIdAndUpdate(
      newDriver._id,
      { compositeId: compositeId },
      { new: true }  // Return the updated driver
    );

    // Send back the updated driver with both compositeId and _id (id)
    res.status(201).json({
      id: updatedDriver._id,        // MongoDB's _id
      compositeId: updatedDriver.compositeId, // The custom composite ID
      ...updatedDriver.toObject()  // Convert Mongoose document to plain object and spread the rest of the fields
    });

  } catch (error) {
    res.status(500).json({ message: 'Error adding driver. Please try again.', error: error.message });
  }
});

// Update driver details
router.put('/drivers/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings } = req.body;

  try {
    // Build the update object dynamically to avoid overwriting missing fields
    const updateFields = {
      ...(name && { name }),
      ...(gender && { gender }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(cnic && { cnic }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(ratings !== undefined && { ratings }),  
     };

    // Update the driver in the database
    const driver = await Driver.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // Return the updated driver
    );

    // If no driver is found, return an error
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update driver', error: error.message });
  }
});


// Delete a driver
router.delete('/drivers/:id',verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await Driver.findByIdAndDelete(id);
    res.status(200).json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete driver' });
  }
});

// Fetch a driver by Composite ID
router.get('/drivers/composite/:compositeId', verifyToken, async (req, res) => {
 
  const { compositeId } = req.params;

  console.log("Received compositeId:", compositeId); // This should log the compositeId value

  try {
    // Find the driver by compositeId
    const driver = await Driver.findOne({ compositeId: compositeId });  // Find driver based on compositeId

 console.log(driver);
    // If the driver is not found, return a 404 error
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);  // Return the driver details as JSON
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});


module.exports = router;
