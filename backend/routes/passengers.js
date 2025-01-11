const express = require('express');
const mongoose = require('mongoose');
const Passenger = require('../models/Passenger'); // Import the Passenger model
const verifyToken = require('../middleware/auth');
const router = express.Router();
const Counter = require('./counter');  // Import Counter model

// Function to generate composite ID
const generateCompositeId = async () => {
  try {
    // Find or create a Counter document for 'passengerId'
    const counter = await Counter.findOneAndUpdate(
      { _id: 'passengerId' },
      { $inc: { seq: 1 } }, // Increment the seq field by 1
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    // Format the compositeId with zero padding
    const newCompositeId = `PR-${String(counter.seq).padStart(3, '0')}`;

    console.log(`Generated compositeId: ${newCompositeId}`);
    return newCompositeId;
  } catch (error) {
    console.error('Error generating compositeId:', error.message);
    throw error; // Rethrow error to be handled by the route
  }
};



 // Fetch all passengers
router.get('/passengers', verifyToken, async (req, res) => {
  try {
    const passengers = await Passenger.find();
    console.log(`Found ${passengers.length} passengers`);

    // Check for passengers missing compositeId and update them
    const updatedPassengers = await Promise.all(
      passengers.map(async (passenger) => {
        if (!passenger.compositeId) {
          const newCompositeId = await generateCompositeId();
          passenger.compositeId = newCompositeId;
          console.log(`Updating passenger ${passenger._id} with compositeId: ${newCompositeId}`);
          
          // Save the updated compositeId without triggering full validation
          try {
            await Passenger.updateOne(
              { _id: passenger._id },
              { $set: { compositeId: newCompositeId } }
            );
            console.log(`Passenger ${passenger._id} updated successfully`);
          } catch (error) {
            console.error(`Error saving passenger ${passenger._id}:`, error.message);
            throw error;
          }
        }
        return passenger;
      })
    );

    res.status(200).json(updatedPassengers);
  } catch (error) {
    console.error('Failed to fetch or update passengers:', error.message);
    res.status(500).json({ message: 'Failed to fetch passengers', error: error.message });
  }
});


// Fetch a single passenger by ID
router.get('/passengers/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const passenger = await Passenger.findById(id);

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch passenger details', error: error.message });
  }
});

// Add a new passenger
router.post('/passengers', verifyToken, async (req, res) => {
  try {
    const { name, gender, email, phoneNumber, photo } = req.body;

    // Generate compositeId before creating the new passenger
    const compositeId = await generateCompositeId();

    const newPassenger = new Passenger({
      name,
      gender,
      email,
      phoneNumber,
      photo,
      compositeId, // Add the compositeId
    });

    const savedPassenger = await newPassenger.save();
    res.status(201).json(savedPassenger);
  } catch (error) {
    res.status(500).json({ message: 'Error adding passenger. Please try again.', error: error.message });
  }
});

// Update passenger details
router.put('/passengers/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, gender, email, phoneNumber, photo } = req.body;

  try {
    const updateFields = {
      ...(name && { name }),
      ...(gender && { gender }),
      ...(email && { email }),
      ...(phoneNumber && { phoneNumber }),
      ...(photo && { photo }),
    };

    // Ensure compositeId is not overwritten
    const passenger = await Passenger.findByIdAndUpdate(id, updateFields, { new: true });

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Only add compositeId if it's not already set
    if (!passenger.compositeId) {
      passenger.compositeId = await generateCompositeId();
      await passenger.save(); // Save the updated passenger with compositeId
    }

    res.status(200).json(passenger);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update passenger', error: error.message });
  }
});

// Delete a passenger
router.delete('/passengers/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    await Passenger.findByIdAndDelete(id);
    res.status(200).json({ message: 'Passenger deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete passenger', error: error.message });
  }
});

module.exports = router;
