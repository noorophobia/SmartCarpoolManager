const mongoose = require("mongoose");

const compositeIdSchema = new mongoose.Schema({
  rideID: {
    type: String,
    required: true,
    unique: true,
  },
  mode: {
    type: String,
    enum: ["single", "carpool"],
    required: true,
  },
  compositeId: {
    type: String,
    required: true,
    unique: true,
    default:null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CompositeId = mongoose.model("CompositeId", compositeIdSchema);
module.exports = CompositeId;
