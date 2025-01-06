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


// Route to handle vehicle update
router.put('/vehicles/:id', verifyToken, upload.array('vehiclePhotos'), async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    vehicleName,
    vehicleColor,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    driverId,
    cnicFront,
    cnicBack,
    driverPhoto,
    vehicleRegistrationFront,
    vehicleRegistrationBack,
  } = req.body;

  const vehiclePhotos = req.files.map(file => file.filename);
  console.log("vehiclephtotos at badkend " + vehiclePhotos)

  try {
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      {
        brand,
        vehicleName,
        vehicleColor,
        vehicleType,
        vehicleProductionYear,
        licenseNumber,
        driverId,
        cnicFront,
        cnicBack,
        driverPhoto,
        vehicleRegistrationFront,
        vehicleRegistrationBack,
        vehiclePhotos,
      },
      { new: true }
    );

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
