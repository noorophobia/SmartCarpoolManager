const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  rideID: { type: String, required: true, unique: true },
  pickUpLocation: { type: String, required: true },
  dropOffLocation: { type: String, required: true },
  rideMode: { type: String, enum: ['Single', 'Carpool'], required: true },
  rideStatus: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Cancelled'],
    default: 'Ongoing',
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // Relationship to Payment
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }, // Relationship to Vehicle
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
