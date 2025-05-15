const Payment = require('../models/Payment');

const generateCompositeId = async () => {
  const paymentCount = await Payment.countDocuments();
  return `PAY-${String(paymentCount + 1).padStart(3, '0')}`;
};

const getAllPayments = async () => {
  return await Payment.find().populate('rideId');
};

const getPaymentById = async (id) => {
  return await Payment.findById(id).populate('rideId');
};

module.exports = {
  generateCompositeId,
  getAllPayments,
  getPaymentById,
};
