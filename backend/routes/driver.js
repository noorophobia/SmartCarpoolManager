
const express = require('express');
const mongoose = require('mongoose');
const Driver = require('../models/Driver');  
const verifyToken= require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
     const driver = await Driver.findById(id);   

     if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);  
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});


// Function to generatappe composite ID
const generateCompositeId = async () => {
  const driverCount = await Driver.countDocuments();
  return `DR-${String(driverCount + 1).padStart(3, '0')}`; 
};

// Add a new driver
router.post('/drivers', verifyToken, async (req, res) => {
  try {
    const { name, gender, email, phoneNumber, cnic, dateOfBirth, ratings,password } = req.body;
    
    if (!dateOfBirth) {
      return res.status(400).json({ message: 'Date of Birth required.' });
    }

     const compositeId = await generateCompositeId();

    const isApproved = false;
    const createdAt = new Date();
const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newDriver = new Driver({
      name,
      gender,
      email,
      password: hashedPassword, 

      phoneNumber,
      cnic,
      dateOfBirth,
      ratings,
      compositeId,   
      isApproved,  
      createdAt,     
    });

     const savedDriver = await newDriver.save();

     res.status(201).json({
      id: savedDriver._id,         // MongoDB's _id
      compositeId: savedDriver.compositeId,  
      ...savedDriver.toObject()    
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
      { new: true }  
    );

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

  console.log("Received compositeId:", compositeId);  

  try {
     const driver = await Driver.findOne({ compositeId: compositeId });   

 console.log(driver);
     if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);   
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});

 router.put('/drivers/application/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;  

  try {
     if (typeof isApproved !== 'boolean') {
      return res.status(400).json({ message: 'Invalid approval status' });
    }

    // Find and update the driver by ID
    const driver = await Driver.findByIdAndUpdate(
      id,
      { isApproved: isApproved },   
      { new: true }  
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json({ message: 'Driver updated successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update driver', error: error.message });
  }
});

 
router.get("/drivers/api/count", verifyToken, async (req, res) => {
  try {
    console.log("Fetching driver count...");
    const count = await Driver.countDocuments();
    console.log("Total drivers:", count);
    res.status(200).json({ totalDrivers: count });
  } catch (error) {
    console.error(" Error fetching driver count:", error);
    res.status(500).json({ message: "Failed to get driver count", error: error.message });
  }
});
router.get("/drivers/api/pending-count", verifyToken, async (req, res) => {
  try {
    console.log("Fetching pending applications count...");
    
    const count = await Driver.countDocuments({ isApproved: false }); 

    console.log("Total pending applications:", count);
    
    res.status(200).json({ pendingApplications: count });
  } catch (error) {
    console.error(" Error fetching pending applications count:", error);
    res.status(500).json({ message: "Failed to get pending applications count", error: error.message });
  }
});
router.get("/drivers/api/approved-count", verifyToken, async (req, res) => {
  try {
    console.log("Fetching approved drivers count...");
    
    const approvedDrivers = await Driver.find({ isApproved: true }); 
    console.log("Approved Drivers Found:", approvedDrivers);  

    const count = approvedDrivers.length; 

    console.log("Total approved drivers:", count);
    
    res.status(200).json({ approvedApplications: count });
  } catch (error) {
    console.error(" Error fetching approved drivers count:", error);
    res.status(500).json({ message: "Failed to get approved drivers count", error: error.message });
  }
});



module.exports = router;
