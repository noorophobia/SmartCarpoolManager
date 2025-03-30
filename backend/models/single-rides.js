const mongoose = require('mongoose');

const singleRideSchema = new mongoose.Schema({
  // pickUp: { type: String, required: true },
  //dropOff: { type: String, required: true },
  requestOrigin: { type: String, required: true },
  requestDestination: { type: String, required: true },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'cancelled'],
    default: 'ongoing',
  },

  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment',default:null },
    
  passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' },
    driverID: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },

   passengerRating: { type: String, required: false },
  passengerReview: { type: String, required: false },
  driverRating: { type: String, required: false },
  driverReview: { type: String, required: false },
  date: { type: Date, default: Date.now },
  isResolved: { type:Boolean, default:false},
requestFare:{ type: Number, required: true }
 // commission: { type: Number, required: true }

});

const SingleRide = mongoose.model('single-rides', singleRideSchema);
module.exports = SingleRide;
