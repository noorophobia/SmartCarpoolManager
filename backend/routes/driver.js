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
// Fetch approved drivers
router.get('/drivers/approved', verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find({ isApproved: true });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved drivers' });
  }
});

// Fetch not approved drivers
router.get('/drivers/not-approved', verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find({ isApproved: false });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch not approved drivers' });
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
router.post('/drivers', verifyToken, async (req, res) => {
  try {
    const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings } = req.body;
    
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of Birth required.' });
    }

    // Generate the composite ID before saving the driver
    const compositeId = await generateCompositeId();

    const isApproved = false;
    const createdAt = new Date();

    const newDriver = new Driver({
      name,
      gender,
      email,
      phoneNumber,
      cnic,
      dateOfBirth,
      ratings,
      compositeId,  // Include compositeId when creating the driver
      isApproved,   // Explicitly set default if missing
      createdAt,    // Ensure createdAt is always set to the current time
    });

    // Save the driver with compositeId
    const savedDriver = await newDriver.save();

    // Send back the newly created driver, including compositeId and _id
    res.status(201).json({
      id: savedDriver._id,         // MongoDB's _id
      compositeId: savedDriver.compositeId, // The custom composite ID
      ...savedDriver.toObject()    // Convert Mongoose document to plain object and spread the rest of the fields
    });

  } catch (error) {
    console.error('Error saving driver:', error);
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

// Update driver details (including isApproved)
// Update driver's approval status (accept/reject)
router.put('/drivers/application/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body; // isApproved is either true or false

  try {
    // Ensure the isApproved field is provided and is a boolean
    if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    // Find and update the driver by ID
    const driver = await Driver.findByIdAndUpdate(
      id,
      { isApproved: isApproved },  // Update isApproved field
      { new: true }  // Return the updated driver
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver updated successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update driver', error: error.message });
  }
});


module.exports = router;
