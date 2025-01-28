const mongoose = require('mongoose');

const carpoolRideSchema = new mongoose.Schema({
  rideID: { type: String, required: true, unique: true },
  pickUpLocation: { type: String, required: true },
  dropOffLocation: { type: [String], required: true },
  rideStatus: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Cancelled'],
    default: 'Ongoing',
  },
  compositeId: { type: String, required: false }, // Unique identifier for carpool
  paymentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  passengerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }], // Array of passenger IDs
  passengerRating: { type: String, required: false },
  passengerReview: { type: String, required: false },
  driverRating: { type: String, required: false },
  driverReview: { type: String, required: false },
  date: { type: Date, default: Date.now },
  commission: { type: Number, required: true },







});

const CarpoolRide = mongoose.model('CarpoolRide', carpoolRideSchema);
module.exports = CarpoolRide;
