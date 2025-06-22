// models/RideReview.js
const mongoose = require("mongoose");

const rideReviewSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Passenger",
    required: true,
  },
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  driverName: {
    type: String,
    required: true,
  },
  driverProfilePicture: {
    type: String,
    default: null,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
  },
  resolved:{
    type:Boolean,
    default:false,
  },
  rideCompositeId: {
    type: String,
    default: "",
  },
  driverCompositeId: {
    type: String,
    default: "",
  },
  passengerCompositeId: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const RideReview = mongoose.model("passengerratings", rideReviewSchema);
module.exports = RideReview;
