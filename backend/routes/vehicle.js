const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle'); // Import the Vehicle model
const multer = require('multer');
const verifyToken= require('../middleware/auth');

const router = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Save files to the 'uploads' folder
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`), // Rename file with timestamp
});

const upload = multer({ storage }); // Create multer instance to handle file uploads

// Fetch all vehicles
router.get('/vehicles',verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('driverId', 'name email'); // Populate driver details (optional)
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
});

// Function to generatappe composite ID
const generateCompositeId = async () => {
  const VehicleCount = await Vehicle.countDocuments();
  return `VH-${String(VehicleCount + 1).padStart(3, '0')}`; // Generate ID like DR-001, DR-002, etc.
};

 
// Handle vehicle POST requests with image uploads
router.post(
  '/vehicles',
  upload.fields([ // Keep other fields for CNIC, driverPhoto, etc.
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'driverPhoto', maxCount: 1 },
    { name: 'vehicleRegistrationFront', maxCount: 1 },
    { name: 'vehicleRegistrationBack', maxCount: 1 },
    { name: 'vehiclePhotos', maxCount: 5 }, // Allow multiple vehicle photos
  ]),verifyToken,
  async (req, res) => {
    try {
      // Log incoming data and uploaded files for debugging
      console.log('Request Body:', req.body);
      console.log('Uploaded Files:', req.files);

      // Destructure required fields from the body
      const {
        brand,
        vehicleName,
        vehicleColor,
         
        vehicleType,
        vehicleProductionYear,
        licenseNumber,
        driverId,
      } = req.body;

      // Check if all required files are uploaded
      if (!req.files.cnicFront || !req.files.cnicBack || !req.files.driverPhoto) {
        return res.status(400).json({ message: 'Missing required files.' });
      }

      // Process vehiclePhotos array if photos are uploaded
      const vehiclePhotos = req.files.vehiclePhotos
        ? req.files.vehiclePhotos.map(file => file.filename) // Collect filenames of vehicle photos
        : [];

      // Create a new vehicle instance and set the image paths
      const newVehicle = new Vehicle({
        brand,
        vehicleName,
        vehicleColor,
         vehicleType,
        vehicleProductionYear,
        licenseNumber,
        driverId,
        cnicFront: req.files.cnicFront ? req.files.cnicFront[0].filename : '',
        cnicBack: req.files.cnicBack ? req.files.cnicBack[0].filename : '',
        driverPhoto: req.files.driverPhoto ? req.files.driverPhoto[0].filename : '',
        vehicleRegistrationFront: req.files.vehicleRegistrationFront
          ? req.files.vehicleRegistrationFront[0].filename
          : '',
        vehicleRegistrationBack: req.files.vehicleRegistrationBack
          ? req.files.vehicleRegistrationBack[0].filename
          : '',
        vehiclePhotos, // Assign the vehicle photos array
      });
 
      // Save the new vehicle to the database
      await newVehicle.save();
      const compositeId = await generateCompositeId();
 // Update the driver with the generated composite ID
 const updatedVehicle = await Vehicle.findByIdAndUpdate(
  newVehicle._id,
  { vehicleID: compositeId },
  { new: true }  // Return the updated driver
);

// Send back the updated driver with both compositeId and _id (id)
res.status(201).json({
  id: updatedVehicle._id,        // MongoDB's _id
  vehicleID: updatedVehicle.vehicleID, // The custom composite ID
  ...updatedVehicle.toObject()  // Convert Mongoose document to plain object and spread the rest of the fields
});

} catch (error) {
res.status(500).json({ message: 'Error adding Vehicle. Please try again.', error: error.message });
}
});


// Update vehicle details
router.put('/vehicles/:id', verifyToken,async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    vehicleName,
    vehicleColor,
    vehicleID,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    totalSeatsCapacity,
    driverId,
    cnicFront,
    cnicBack,
    driverPhoto,
    vehicleRegistrationFront,
    vehicleRegistrationBack,
    vehiclePhotos,
  } = req.body;

  // Validate if all required fields are present
  if (!vehicleName || !licenseNumber || totalSeatsCapacity === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Update the vehicle in the database
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        brand,
        vehicleName,
        vehicleColor,
        vehicleID,
        vehicleType,
        vehicleProductionYear,
        licenseNumber,
        totalSeatsCapacity,
        driverId,
        cnicFront,
        cnicBack,
        driverPhoto,
        vehicleRegistrationFront,
        vehicleRegistrationBack,
        vehiclePhotos,
      },
      { new: true } // To return the updated vehicle
    );

    // If no vehicle is found, return an error
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vehicle' });
  }
});

// Delete a vehicle
router.delete('/vehicles/:id', verifyToken,async (req, res) => {
  const { id } = req.params;

  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete vehicle', error: error.message });
  }
});
// Fetch vehicles by driverId
router.get('/vehicles/driver/:driverId', verifyToken,async (req, res) => {
  const { driverId } = req.params;

  try {
    const vehicles = await Vehicle.find({ driverId }).populate('driverId', 'name email'); // Populate driver details
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'No vehicles found for the given driver ID' });
    }
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
});


module.exports = router;
