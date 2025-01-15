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
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true }, // Driver ID
  passengerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }], // Array of Passenger IDs
  passengerRating:{ type: String, required: true },
  passengerReview:{ type: String, required: true },
  driverRating:{ type: String, required: true },
  driverReview:{ type: String, required: true },
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;
