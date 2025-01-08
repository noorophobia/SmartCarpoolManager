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

router.post(
  '/vehicles',
  upload.fields([
    { name: 'cnicFront', maxCount: 1 },
    { name: 'cnicBack', maxCount: 1 },
    { name: 'driverPhoto', maxCount: 1 },
    { name: 'vehicleRegistrationFront', maxCount: 1 },
    { name: 'vehicleRegistrationBack', maxCount: 1 },
    { name: 'vehiclePhotos', maxCount: 5 },
  ]),
  verifyToken,
  async (req, res) => {
    try {
      console.log('Request Body:', req.body);
      console.log('Uploaded Files:', req.files);

      const {
        brand,
        vehicleName,
        vehicleColor,
        vehicleType,
        vehicleProductionYear,
        licenseNumber,
        driverId,
      } = req.body;
      console.log('Request Body:', req.body);
      console.log('Uploaded Files:', req.files);
      
      if (!req.files.cnicFront || !req.files.cnicBack || !req.files.driverPhoto) {
        return res.status(400).json({ message: 'Required files are missing.' });
      }

      const vehiclePhotos = req.files.vehiclePhotos
        ? req.files.vehiclePhotos.map(file => file.filename)
        : [];

      // Generate a unique vehicle ID
      const vehicleID = await generateCompositeId();

      // Create a new vehicle instance with all fields, including the generated vehicleID
      const newVehicle = new Vehicle({
        brand,
        vehicleName,
        vehicleColor,
        vehicleType,
        vehicleProductionYear,
        licenseNumber,
        driverId,
        vehicleID, // Assign the generated ID here
        cnicFront: req.files.cnicFront[0].filename,
        cnicBack: req.files.cnicBack[0].filename,
        driverPhoto: req.files.driverPhoto[0].filename,
        vehicleRegistrationFront: req.files.vehicleRegistrationFront
          ? req.files.vehicleRegistrationFront[0].filename
          : '',
        vehicleRegistrationBack: req.files.vehicleRegistrationBack
          ? req.files.vehicleRegistrationBack[0].filename
          : '',
        vehiclePhotos,
      });

      // Save the vehicle to the database
      await newVehicle.save();

      res.status(201).json({
        id: newVehicle._id,
        vehicleID: newVehicle.vehicleID,
        ...newVehicle.toObject(),
      });
    } catch (error) {
      console.error('Error while adding vehicle:', error);
      res.status(500).json({
        message: 'Error adding Vehicle. Please try again.',
        error: error.message,
      });
    }
  }
);

router.put('/vehicles/:id', verifyToken, upload.fields([ // Notice the 'fields' instead of 'array'
  { name: 'cnicFront', maxCount: 1 },
  { name: 'cnicBack', maxCount: 1 },
  { name: 'driverPhoto', maxCount: 1 },
  { name: 'vehicleRegistrationFront', maxCount: 1 },
  { name: 'vehicleRegistrationBack', maxCount: 1 },
  { name: 'vehiclePhotos', maxCount: 5 }
]), async (req, res) => {
  const { id } = req.params;
  console.log('Request Body:', req.body);  // For debugging the request body
  console.log('Uploaded Files:', req.files); // For debugging the uploaded files

  const {
    brand,
    vehicleName,
    vehicleColor,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    driverId,
  } = req.body;

  // Collect the files (check if they exist in req.files)
  const vehiclePhotos = req.files.vehiclePhotos
    ? req.files.vehiclePhotos.map(file => file.filename)
    : [];  // If no files, set an empty array

  // Check if the required files are present
  const updatedData = {
    brand,
    vehicleName,
    vehicleColor,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    driverId,
  };

  // Only update files if they are included in the request
  if (req.files.cnicFront) updatedData.cnicFront = req.files.cnicFront[0].filename;
  if (req.files.cnicBack) updatedData.cnicBack = req.files.cnicBack[0].filename;
  if (req.files.driverPhoto) updatedData.driverPhoto = req.files.driverPhoto[0].filename;
  if (req.files.vehicleRegistrationFront) {
    updatedData.vehicleRegistrationFront = req.files.vehicleRegistrationFront[0].filename;
  }
  if (req.files.vehicleRegistrationBack) {
    updatedData.vehicleRegistrationBack = req.files.vehicleRegistrationBack[0].filename;
  }
  if (vehiclePhotos.length > 0) {
    updatedData.vehiclePhotos = vehiclePhotos;
  }

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(updatedVehicle);
  } catch (error) {
    console.error('Error while updating vehicle:', error);
    res.status(500).json({ message: 'Failed to update vehicle', error: error.message });
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
// Delete all vehicles associated with a specific driverId
router.delete('/vehicles/driver/:driverId', verifyToken, async (req, res) => {
  const { driverId } = req.params;

  try {
    // Delete all vehicles where the driverId matches
    const result = await Vehicle.deleteMany({ driverId });

    // Check if any vehicles were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No vehicles found for the given driver ID' });
    }

    res.status(200).json({ message: 'Vehicles deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete vehicles', error: error.message });
  }
});


module.exports = router;
