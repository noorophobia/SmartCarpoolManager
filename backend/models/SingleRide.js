const mongoose = require('mongoose');

const singleRideSchema = new mongoose.Schema({
  rideID: { type: String, required: true, unique: true },
  pickUpLocation: { type: String, required: true },
  dropOffLocation: { type: String, required: true },
  rideStatus: {
    type: String,
    enum: ['Ongoing', 'Completed', 'Cancelled'],
    default: 'Ongoing',
  },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  compositeId: { type: String, required: false },  
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  passengerRating: { type: String, required: false },
  passengerReview: { type: String, required: false },
  driverRating: { type: String, required: false },
  driverReview: { type: String, required: false },
  date: { type: Date, default: Date.now },
  isResolved: { type:Boolean, default:false},

  commission: { type: Number, required: true }

});

const SingleRide = mongoose.model('SingleRide', singleRideSchema);
module.exports = SingleRide;
