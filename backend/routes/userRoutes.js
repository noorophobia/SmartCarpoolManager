// routes/userRoutes.js
const express = require('express');
const User = require('../models/user');

const router = express.Router();

// POST route to add a user
router.post('/add', async (req, res) => {
  const { name, address, phone } = req.body;

  try {
    const newUser = new User({ name, address, phone });
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: savedUser });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add user', error: error.message });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.send('Test route is working');
});

module.exports = router;
