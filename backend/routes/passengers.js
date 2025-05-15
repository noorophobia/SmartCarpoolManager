const express = require('express');
const verifyToken = require('../middleware/auth');
const router = express.Router();
const passengerService = require('../services/passengerService');

// GET all passengers
router.get('/passengers', verifyToken, async (req, res) => {
  try {
    const passengers = await passengerService.getAllPassengersAndAssignIds();
    res.status(200).json(passengers);
  } catch (error) {
    console.error('Failed to fetch/update passengers:', error.message);
    res.status(500).json({ message: 'Failed to fetch passengers', error: error.message });
  }
});

// GET single passenger
router.get('/passengers/:id', verifyToken, async (req, res) => {
  try {
    const passenger = await passengerService.getPassengerById(req.params.id);
    if (!passenger) return res.status(404).json({ message: 'Passenger not found' });
    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch passenger', error: error.message });
  }
});

// POST new passenger
router.post('/passengers', verifyToken, async (req, res) => {
  try {
    const passenger = await passengerService.createPassenger(req.body);
    res.status(201).json(passenger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update passenger
router.put('/passengers/:id', verifyToken, async (req, res) => {
  try {
    const updated = await passengerService.updatePassenger(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Passenger not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update passenger', error: error.message });
  }
});

// DELETE passenger
router.delete('/passengers/:id', verifyToken, async (req, res) => {
  try {
    await passengerService.deletePassenger(req.params.id);
    res.status(200).json({ message: 'Passenger deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete passenger', error: error.message });
  }
});

// GET count of passengers
router.get('/passengers/api/count', verifyToken, async (req, res) => {
  try {
    const count = await passengerService.getPassengerCount();
    res.status(200).json({ totalPassengers: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get count', error: error.message });
  }
});

module.exports = router;
