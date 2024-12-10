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
      fixedDriverFee: { type: Number, required: true },
      peakRateMultiplier: { type: Number, required: true },
      discounts: { type: Number, required: true },
    }
  ],
  lastUpdated: { type: Date, default: Date.now }, // Optional field for tracking updates
});

const RateSettings = mongoose.model('RateSettings', rateSettingsSchema);
module.exports = RateSettings;
