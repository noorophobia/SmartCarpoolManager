const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  discount: {
    type: String, // Keeping it as a string to accommodate "15%" or similar formats
    required: true,
    trim: true,
  },
  fee: {
    type: Number,
    required: true,
    min: 0, // Ensure fee is non-negative
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field whenever a document is updated
packageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
