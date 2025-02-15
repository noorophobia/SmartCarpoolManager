const express = require('express');
const mongoose = require('mongoose');
const Passenger = require('../models/Passenger'); // Import the Passenger model
const verifyToken = require('../middleware/auth');
const router = express.Router();
 const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure where to store the file
  // Function to generate composite ID// Function to generate a composite ID for Payment
  const bcrypt = require('bcrypt');
const saltRounds = 10;
const generateCompositeId = async () => {
  const passengerCount = await Passenger.countDocuments();
  return `PR-${String(passengerCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
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
    const { name, email, phone ,gender,password} = req.body;
    const photo = req.file; // req.file will contain the uploaded file
console.log(req.body);
    // Generate compositeId before creating the new passenger
    const compositeId = await generateCompositeId();
 // Check for missing fields
 if (!name || !email || !phone|| !gender || !password) {
  return res.status(400).json({ message: 'All fields are required' });
}

// Hash the password
const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newPassenger = new Passenger({
      name,
       email,
      phone
      ,
      gender,

      password: hashedPassword, // Store the hashed password
       compositeId, // Add the compositeId
    });

    const savedPassenger = await newPassenger.save();
    res.status(201).json(savedPassenger);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Error adding passenger. Please try again.', error: error.message });
  }
});

// Define the route for updating the passenger
router.put('/passengers/:id', verifyToken, upload.single('photo'), async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, gender } = req.body; // req.body will contain non-file fields
  const photo = req.file; // req.file will contain the uploaded file
   try {
    const updateFields = {
      ...(name && { name }),
       ...(email && { email }),
      ...(phone && { phone }),
      ...(gender && { gender }),
    };

    if (photo) {
      updateFields.photo = photo.path; // Save the path of the uploaded file
    }

    // Update passenger document
    const passenger = await Passenger.findByIdAndUpdate(id, updateFields, { new: true });

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
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
router.get("/passengers/api/count", verifyToken, async (req, res) => {
  try {
    console.log("Fetching Passenger count...");
    const count = await Passenger.countDocuments();
    console.log("Total Passenger:", count);
    res.status(200).json({ totalPassengers: count });
  } catch (error) {
    console.error("🚨 Error fetching Passenger count:", error);
    res.status(500).json({ message: "Failed to get Passenger count", error: error.message });
  }
});

module.exports = router;
