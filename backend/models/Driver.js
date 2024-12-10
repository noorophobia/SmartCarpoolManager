const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, maxlength: 50 },
  password: { type: String, required: true, maxlength: 50 },
  gender: { type: String, enum: ['Male', 'Female'], required: true },

  cnic: { type: String, required: true, maxlength: 15, unique: true },
  phoneNumber: { type: String, required: true }, // Adjust field  for phone number if required


});

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;
