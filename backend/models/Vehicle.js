const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, maxlength: 100 },
    vehicleName: { type: String, required: true, maxlength: 100 },
    vehicleColor: { type: String, maxlength: 50 },
    vehicleID: { type: String, required: true, unique: true, maxlength: 20 },
    vehicleType: {
      type: String,
      required: true,
      enum: ['AC Car', 'Mini Car', 'Rickshaw', 'Bike'], // Added enum for vehicle types
      maxlength: 50,
    },
    licenseNumber: { type: String, required: true, maxlength: 20 },
    totalSeatsCapacity: { type: Number, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false }, // Linking to Driver
  
    cnicDocument: { type: String }, // URL or path to the CNIC image
    licenseDocument: { type: String }, // URL or path to the license image
    otherDocuments: [String], // Array for additional document URLs
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
