// models/Driver.js

const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required.'], 
    maxlength: [50, 'Name cannot exceed 50 characters.'], 
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required.'], 
    unique: true, 
    maxlength: [50, 'Email cannot exceed 50 characters.'], 
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  gender: { 
    type: String, 
    enum: {
      values: ['Male', 'Female'], 
      message: 'Gender must be either Male or Female.',
    }, 
    required: [true, 'Gender is required.']
  },
  cnic: { 
    type: String, 
    maxlength: [15, 'CNIC cannot exceed 15 characters.'], 
    required: [true, 'CNIC is required.'], 
    unique: true,
    match: [/^\d{5}-\d{7}-\d{1}$/, 'CNIC must be in the format XXXXX-XXXXXXX-X.']
  },
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is required.'], 
    match: [
      /^((\+92)|0)(3[0-9]{2})[0-9]{7}$/, 
      'Phone number must be a valid Pakistani number in the format +92XXXXXXXXXX or 03XXXXXXXXX.'
    ]
  },
  dateOfBirth: { 
    type: Date, 
    required: [true, 'Date of Birth is required.'],
  },
  ratings: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 5,   
  },
  createdAt: { 
    type: Date, 
    default: Date.now   
  },
  compositeId: { type: String, unique: true }, 
  isApproved: { type:Boolean, default:false},

});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
