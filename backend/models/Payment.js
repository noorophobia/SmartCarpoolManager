const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentID: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ['Jazz Cash', 'Cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      required: true,
    }, 
     compositeId: { type: String, required: false }, // Add compositeId field
     passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }, // Relationship to Ride

    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }, // Relationship to Ride
  });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;
  