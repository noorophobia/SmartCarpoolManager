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
  fare: {
    type: Number,
default:""
  },
  revenue: {
    type: Number,
default:""
  },
  driverID: {
    type: mongoose.Schema.Types.ObjectId, // or String, depending on your model
    default:""  },
    driverCompositeId:{
      type: String,

      default:""  },

    date: { type: Date, default: " " },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CompositeId = mongoose.model("CompositeId", compositeIdSchema);
module.exports = CompositeId;
