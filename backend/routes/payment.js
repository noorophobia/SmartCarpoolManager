const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment'); // Import Payment model

// Function to generate a composite ID for Payment
const generateCompositeId = async () => {
    const paymentCount = await Payment.countDocuments();
    return `PAY-${String(paymentCount + 1).padStart(3, '0')}`; // Generates IDs like PAY-001, PAY-002, etc.
};

// Create a new payment (POST)
router.post('/', async (req, res) => {
    try {
        const compositeId = await generateCompositeId(); // Generate unique Payment ID
        const newPayment = new Payment({ ...req.body, paymentID: compositeId });
        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all payments (GET)
router.get('/', async (req, res) => {
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

// Update a payment by ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a payment by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) return res.status(404).json({ message: 'Payment not found' });
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
