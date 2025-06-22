const express = require('express');
const router = express.Router();
const {
  getAllPayments,
  getPaymentById
} = require('../controllers/paymentController');

// Get all payments
router.get('/payment', getAllPayments);

// Get a single payment by ID
router.get('/:id', getPaymentById);

module.exports = router;
