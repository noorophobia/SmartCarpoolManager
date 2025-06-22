const mongoose = require('mongoose');

const compositeIdSchema = new mongoose.Schema({
  rideID: { type: mongoose.Schema.Types.ObjectId, required: true},  
  mode: { type: String, enum: ['single', 'carpool'], required: true },
  status: { type: String, enum: ['ongoing', 'completed', 'cancelled'], required: true },

  passengerId: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Passenger',
    required: true
  }],

  compositeId: { type: String, required: true },   // e.g., "RIDE-025"
  fare: { type: Number, required: true },
  revenue: { type: Number },

  driverID: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  driverCompositeId: { type: String },

  date: { type: Date, required: true },
}, { timestamps: true });

 

const CompositeId = mongoose.model("compositeids", compositeIdSchema);
module.exports = CompositeId;
