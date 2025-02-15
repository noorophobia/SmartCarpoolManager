const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle'); // Import the Vehicle model
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Fetch all vehicles
router.get('/vehicles', verifyToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('driverId', 'name email');
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
});

// Function to generate a composite ID
const generateCompositeId = async () => {
  const VehicleCount = await Vehicle.countDocuments();
  return `VH-${String(VehicleCount + 1).padStart(3, '0')}`; // Generate ID like VH-001, VH-002, etc.
};

 router.post('/vehicles', verifyToken, async (req, res) => {
  try {
    console.log('Received Data:', req.body);

    const {
      brand,
      vehicleName,
      vehicleColor,
      vehicleType,
      vehicleProductionYear,
      licenseNumber,
      driverId,
      driverPhoto, // Now expecting URL instead of file
      cnicFront,
      cnicBack,
      vehicleRegistrationFront,
      vehicleRegistrationBack,
      vehiclePhotos, // Array of URLs
    } = req.body;

    // Ensure required images are provided
    if (!driverPhoto || !cnicFront || !cnicBack) {
      return res.status(400).json({ message: 'Required image URLs are missing.' });
    }

    // Generate unique vehicle ID
    const vehicleID = await generateCompositeId();

    // Create a new vehicle record
    const newVehicle = new Vehicle({
      brand,
      vehicleName,
      vehicleColor,
      vehicleType,
      vehicleProductionYear,
      licenseNumber,
      driverId,
      vehicleID,
      driverPhoto,
      cnicFront,
      cnicBack,
      vehicleRegistrationFront: vehicleRegistrationFront || '',
      vehicleRegistrationBack: vehicleRegistrationBack || '',
      vehiclePhotos: vehiclePhotos || [],
    });

    // Save to database
    await newVehicle.save();

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error('Error while adding vehicle:', error);
    res.status(500).json({ message: 'Error adding Vehicle. Please try again.', error: error.message });
  }
});

 router.put('/vehicles/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  console.log('Received Data:', req.body);

  const {
    brand,
    vehicleName,
    vehicleColor,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    driverId,
    driverPhoto,
    cnicFront,
    cnicBack,
    vehicleRegistrationFront,
    vehicleRegistrationBack,
    vehiclePhotos,
  } = req.body;

  const updatedData = {
    brand,
    vehicleName,
    vehicleColor,
    vehicleType,
    vehicleProductionYear,
    licenseNumber,
    driverId,
    driverPhoto,
    cnicFront,
    cnicBack,
    vehicleRegistrationFront: vehicleRegistrationFront || '',
    vehicleRegistrationBack: vehicleRegistrationBack || '',
    vehiclePhotos: vehiclePhotos || [],
  };

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
router.delete('/vehicles/:id', verifyToken, async (req, res) => {
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
router.get('/vehicles/driver/:driverId', verifyToken, async (req, res) => {
  const { driverId } = req.params;

  try {
    const vehicles = await Vehicle.find({ driverId }).populate('driverId', 'name email');
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
    const result = await Vehicle.deleteMany({ driverId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No vehicles found for the given driver ID' });
    }

    res.status(200).json({ message: 'Vehicles deleted successfully', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete vehicles', error: error.message });
  }
});

module.exports = router;
