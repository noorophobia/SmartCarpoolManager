const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Import Payment model

// Function to generate a composite ID for Payment
const generateCompositeId = async () => {
    const paymentCount = await Payment.countDocuments();
    return `PAY-${String(paymentCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
};

 

// Get all payments (GET)
router.get('/payment', async (req, res) => {
    try {
        const payments = await Payment.find().populate('rideId'); // Populate Ride details
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single payment by ID (GET)
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('rideId');
        if (!payment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

 
 

module.exports = router;