const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 50 },
  password: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  Photo: { type: String }, 
  compositeId: { type: String, required: false }, 
  rating: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5,   
  },
    phone: { type: String, required: true }, 
  resetToken: { type: String },
  resetCode: { type: Number },
  tokenExpiry: { type: Date },
  isBlocked: { type:Boolean, default:false},

}, { timestamps: true });


const Passenger = mongoose.model('Passenger', passengerSchema);
module.exports = Passenger;
