const mongoose = require('mongoose');

const rateSettingsSchema = new mongoose.Schema({
  vehicleTypes: [
    {
      type: { 
        type: String, 
        required: true, 
        enum: ['AC Car', 'Economy Car', 'Rickshaw', 'Bike'], // New vehicle types
      },
      distanceRatePerKm: { type: Number, required: true },
      timeRatePerMinute: { type: Number, required: true },
      totalSeatsCapacity: { type: Number, required: true ,    default: 0,
      },

      fixedDriverFee: { type: Number, required: true },
      peakRateMultiplier: { type: Number, required: true },
      discounts: { type: Number, required: true },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }});

const RateSettings = mongoose.model('RateSettings', rateSettingsSchema);
module.exports = RateSettings;
