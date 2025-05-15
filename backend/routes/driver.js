const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const driverService = require('../services/driverService');

// Fetch all drivers
router.get('/drivers', verifyToken, async (req, res) => {
  try {
    const drivers = await driverService.getAllDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch drivers' });
  }
});

// Fetch approved drivers
router.get('/drivers/approved', verifyToken, async (req, res) => {
  try {
    const drivers = await driverService.getApprovedDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch approved drivers' });
  }
});

// Fetch not approved drivers with composite IDs assigned
router.get('/drivers/not-approved', verifyToken, async (req, res) => {
  try {
    const drivers = await driverService.getNotApprovedDriversWithCompositeIds();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch not approved drivers', error: error.message });
  }
});

// Fetch driver by ID
router.get('/drivers/:id', verifyToken, async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});

// Fetch driver by compositeId
router.get('/drivers/composite/:compositeId', verifyToken, async (req, res) => {
  try {
    const driver = await driverService.getDriverByCompositeId(req.params.compositeId);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch driver details', error: error.message });
  }
});

// Add new driver
router.post('/drivers', verifyToken, async (req, res) => {
  try {
    const savedDriver = await driverService.addDriver(req.body);
    res.status(201).json({
      id: savedDriver._id,
      compositeId: savedDriver.compositeId,
      ...savedDriver.toObject(),
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Error adding driver' });
  }
});

// Update driver details
router.put('/drivers/:id', verifyToken, async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update driver', error: error.message });
  }
});

// Delete driver
router.delete('/drivers/:id', verifyToken, async (req, res) => {
  try {
    await driverService.deleteDriver(req.params.id);
    res.status(200).json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete driver' });
  }
});

// Update approval status
router.put('/drivers/application/:id', verifyToken, async (req, res) => {
  try {
    const driver = await driverService.updateDriverApproval(req.params.id, req.body.isApproved);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.status(200).json({ message: 'Driver updated successfully', driver });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update driver' });
  }
});

// Get total driver count
router.get('/drivers/api/count', verifyToken, async (req, res) => {
  try {
    const count = await driverService.countDrivers();
    res.status(200).json({ totalDrivers: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get driver count', error: error.message });
  }
});

// Get pending driver applications count
router.get('/drivers/api/pending-count', verifyToken, async (req, res) => {
  try {
    const count = await driverService.countPendingApplications();
    res.status(200).json({ pendingApplications: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get pending applications count', error: error.message });
  }
});

// Get approved drivers count
router.get('/drivers/api/approved-count', verifyToken, async (req, res) => {
  try {
    const count = await driverService.countApprovedDrivers();
    res.status(200).json({ approvedApplications: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get approved drivers count', error: error.message });
  }
});

// Block or unblock driver
router.put('/drivers/block/:id', verifyToken, async (req, res) => {
  try {
    const updatedDriver = await driverService.blockUnblockDriver(req.params.id, req.body.isBlocked);
    if (!updatedDriver) return res.status(404).json({ message: 'Driver not found.' });

    res.status(200).json({
      message: `Driver has been ${req.body.isBlocked ? 'blocked' : 'unblocked'}.`,
      driver: updatedDriver,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || 'Internal Server Error' });
  }
});

module.exports = router;
