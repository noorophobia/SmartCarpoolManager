const mongoose = require('mongoose');

const complaintsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Change to ObjectId
    ref: 'Passenger', // Reference the User model
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  complaint: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  compositeId: {
    type: String, 
    unique: true, 
  },
});

module.exports = mongoose.model('Complaints', complaintsSchema);
