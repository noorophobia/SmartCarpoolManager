const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');

// Get all payments
router.get('/payment', async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
