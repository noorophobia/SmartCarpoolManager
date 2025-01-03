const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: { type: String, maxlength: 100 },
    vehicleName: { type: String, required: true, maxlength: 100 },
    vehicleColor: { type: String, maxlength: 50 },
    vehicleID: { type: String, unique: true, maxlength: 20 },
    vehicleType: {
      type: String,
      required: true,
      enum: ['AC Car', 'Mini Car', 'Rickshaw', 'Bike'], // Added enum for vehicle types
      maxlength: 50,
    },
    vehicleProductionYear: { type: Number, required: false }, // optional field
    licenseNumber: { type: String, required: true, maxlength: 20 },
     driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: false }, // Linking to Driver
   
    cnicFront: { type: String }, // URL or path to the CNIC image
    cnicBack: { type: String }, // URL or path to the CNIC image
    driverPhoto: { type: String }, // Driver's photo
    vehicleRegistrationFront: { type: String },
    vehicleRegistrationBack: { type: String },
 
    vehiclePhotos: { type: [String] }, // List of vehicle photos ( frontside , backside , inside,etc)
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
