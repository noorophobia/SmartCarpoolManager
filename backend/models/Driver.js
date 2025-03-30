const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverFirstName: { 
    type: String, 
    required: [true, 'First name is required.'], 
    maxlength: [50, 'First name cannot exceed 50 characters.'], 
    trim: true
  },
  driverLastName: { 
    type: String, 
    required: [true, 'Last name is required.'], 
    maxlength: [50, 'Last name cannot exceed 50 characters.'], 
    trim: true
  },
  driverEmail: { 
    type: String, 
    required: [true, 'Email is required.'], 
    unique: true, 
    maxlength: [50, 'Email cannot exceed 50 characters.'], 
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
  },
  driverPassword: { type: String, required: true },

  driverGender: { 
    type: String, 
    enum: {
      values: ['male', 'female'], 
      message: 'Gender must be either male or female.',
    }, 
    required: [true, 'Gender is required.']
  },
  driverCnicNumber: { 
    type: String, 
    unique: true,
    required: [true, 'CNIC is required.'],
   },
  driverCnicFront: { type: String, required: true },
  driverCnicBack: { type: String, required: true },
  driverSelfie: { type: String, required: true },

  driverPhone: { 
    type: String, 
    required: [true, 'Phone number is required.'], 
    match: [
      /^((\+92)|0)(3[0-9]{2})[0-9]{7}$/, 
      'Phone number must be a valid Pakistani number in the format +92XXXXXXXXXX or 03XXXXXXXXX.'
    ]
  },
  driverDOB: { 
    type: Date, 
    required: [true, 'Date of Birth is required.'],
  },
  rating: { 
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
  isApproved: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },

  // 🚗 Vehicle Details
  vehicleProductionYear: { type: String, required: true },
  vehicleType: { type: String, enum: ["car", "bike","Car","Bike"], required: true },
  carType: { type: String, required: true },
  vehicleName: { type: String, required: true },
  vehicleColor: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  brand: { type: String, required: true },
  selectedDriver: { type: String, default:" "},

  vehicleRegisterationFront: { type: String, required: true },
  vehicleRegisterationBack: { type: String, required: true },
  vehiclePhotos: [{ type: String, required: true }]  // Array of images

});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
