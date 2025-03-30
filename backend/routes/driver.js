
const express = require('express');
const mongoose = require('mongoose');
const Driver = require('../models/Driver');  
const verifyToken= require('../middleware/auth');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Counter = require('../models/Counter');

// Fetch all drivers
router.get('/drivers',verifyToken, async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
});

 
 
router.get('/drivers/approved', verifyToken, async (req, res) => {
  try {
    await Driver.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: false } });

    const drivers = await Driver.find({ isApproved: true });
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved drivers' });
  }
});

// Fetch not approved drivers

router.get('/drivers/not-approved', verifyToken, async (req, res) => {
  try {
    // Fetch drivers where isApproved is false
    const drivers = await Driver.find({ isApproved: false });

    // Filter drivers missing compositeId
    const missingCompositeIdDrivers = drivers.filter(driver => !driver.compositeId);

    if (missingCompositeIdDrivers.length > 0) {
      const bulkUpdates = await Promise.all(
        missingCompositeIdDrivers.map(async (driver) => ({
          updateOne: {
            filter: { _id: driver._id },
            update: { $set: { compositeId: await generateCompositeId() } },
          },
        }))
      );

      // Perform bulk update in a single operation
      await Driver.bulkWrite(bulkUpdates);
    }

    // Fetch updated drivers to include new compositeId values
    const updatedDrivers = await Driver.find({ isApproved: false });

    res.status(200).json(updatedDrivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch not approved drivers', error: error.message });
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


 
const generateCompositeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "driverCounter" }, 
    { $inc: { value: 1 } },  
    { new: true, upsert: true }  
  );

  // Convert counter value to 3-digit string (e.g., 1 -> "001")
  return `DR-${String(counter.value).padStart(3, '0')}`;
};
 
//  Add a new driver
router.post('/drivers', verifyToken, async (req, res) => {
  try {
    const { 
      driverFirstName, 
      driverLastName, 
      driverGender, 
      driverEmail, 
      driverPhone, 
      driverCnicNumber, 
      driverDOB, 
      rating, 
      driverPassword,
      driverCnicFront,
      driverCnicBack,
      driverSelfie,
      vehicleProductionYear,
      vehicleType,
      carType,
      vehicleName,
      vehicleColor,
      licenseNumber,
      brand,
      vehicleRegisterationFront,
      vehicleRegisterationBack,
      vehiclePhotos
    } = req.body;
     if (!driverDOB) {
      return res.status(400).json({ message: 'Date of Birth is required.' });
    }

    if (!driverPassword) {
      return res.status(400).json({ message: 'Password is required.' });
    }

    // 🔹 Generate a unique composite ID
    const compositeId = await generateCompositeId();
    const isApproved = false;
    const createdAt = new Date();

    // 🔹 Hash the password
    const hashedPassword = await bcrypt.hash(driverPassword, saltRounds);

    // 🔹 Create a new driver object
    const newDriver = new Driver({
      driverFirstName,
      driverLastName,
      driverGender,
      driverEmail,
      driverPhone,
      driverCnicNumber,
      driverDOB,
      rating: rating || 0,  
      driverPassword: hashedPassword, 
      driverCnicFront,
      driverCnicBack,
      driverSelfie,
      vehicleProductionYear,
      vehicleType,
      carType,
      vehicleName,
      vehicleColor,
      licenseNumber,
      brand,
      vehicleRegisterationFront,
      vehicleRegisterationBack,
      vehiclePhotos,
      compositeId,   
      isApproved,  
      createdAt,     
    });

    // 🔹 Save the new driver
    const savedDriver = await newDriver.save();

    res.status(201).json({
      id: savedDriver._id,         
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
  const { 
    driverFirstName,
    driverLastName, 
    driverGender, 
    driverEmail, 
    driverPhone, 
    driverCnicNumber, 
    driverDOB, 
    rating,
    driverCnicFront,
    driverCnicBack,
    driverSelfie,
    vehicleProductionYear,
    vehicleType,
    carType,
    vehicleName,
    vehicleColor,
    licenseNumber,
    brand,
    vehicleRegisterationFront,
    vehicleRegisterationBack,
    vehiclePhotos
  } = req.body;

  try {
    const updateFields = {
      ...(driverFirstName && { driverFirstName }),
      ...(driverLastName && { driverLastName }),
      ...(driverGender && { driverGender }),
      ...(driverEmail && { driverEmail }),
      ...(driverPhone && { driverPhone }),
      ...(driverCnicNumber && { driverCnicNumber }),
      ...(driverDOB && { driverDOB }),
      ...(rating !== undefined && { rating }),  
      ...(driverCnicFront && { driverCnicFront }),
      ...(driverCnicBack && { driverCnicBack }),
      ...(driverSelfie && { driverSelfie }),
      ...(vehicleProductionYear && { vehicleProductionYear }),
      ...(vehicleType && { vehicleType }),
      ...(carType && { carType }),
      ...(vehicleName && { vehicleName }),
      ...(vehicleColor && { vehicleColor }),
      ...(licenseNumber && { licenseNumber }),
      ...(brand && { brand }),
      ...(vehicleRegisterationFront && { vehicleRegisterationFront }),
      ...(vehicleRegisterationBack && { vehicleRegisterationBack }),
      ...(vehiclePhotos && { vehiclePhotos }),
    };
     // 🔹 Update the driver in the database
    const driver = await Driver.findByIdAndUpdate(id, updateFields, { new: true });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.status(200).json(driver);
  } catch (error) {
    console.error('Error updating driver:', error);
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

 

// PUT: Block or unblock driver
router.put("/drivers/block/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "isBlocked must be a boolean." });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      id,
      { isBlocked },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    res.status(200).json({
      message: `Driver has been ${isBlocked ? "blocked" : "unblocked"}.`,
      driver: updatedDriver,
    });
  } catch (error) {
    console.error("Error updating driver block status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

 

module.exports = router;
