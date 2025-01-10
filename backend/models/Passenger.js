const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 50 },
  password: { type: String, required: true, maxlength: 50 },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  Photo: { type: String }, 

  phoneNumber: { type: String, required: true }, 

});

const Passenger = mongoose.model('Passenger', passengerSchema);
module.exports = Passenger;
