const mongoose = require("mongoose");

const carpoolRideSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    cancelledAt: { type: Date, default: null },
    completedAt: { type: Date },
    car: { type: String, required: true },
    carNumber: { type: String, required: true },
    driverID: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", required: true },
    driverGender: { type: String, enum: ["male", "female"], required: true },
    driverName: { type: String, required: true },
    driverNumber: { type: String, required: true },
    passengerAccepted: { type: Boolean, default: false },
    passengerCurrentLocationLatitude: { type: Number, required: true },
    passengerCurrentLocationLongitude: { type: Number, required: true },
    requestAccepted: { type: Boolean, default: false },
    requestCapacity: { type: Number, required: true },
    requestDestination: { type: String, required: true },
    requestFare: { type: Number, required: true },
    requestOrigin: { type: String, required: true },
    requestType: { type: String, enum: ["single", "carpool"], required: true },
    requestVehicle: { type: String, enum: ["bike", "car", "ac"], required: true },
    status: { type: String, enum: ["pending", "completed", "cancelled"], required: true },
    additionalPassengers: { type: Number, default: 0 },
    dropoff: { type: String, required: true },
    fare: { type: Number, required: true },
    mode: { type: String, enum: ["Carpool", "Economy", "Luxury"], required: true },
    rideStatus: { type: String, enum: ["pending", "in-progress", "completed"], required: true },
    rideType: { type: String, enum: ["economy", "business", "luxury"], required: true },
    selectedCarpoolers: { type: String, required: true },
    selectedDriver: { type: String, required: true },
    passengerId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Passenger" }],
    passengerName: [{ type: String }],
    passengerPhone: [{ type: String }],
    pickup: { type: String, required: true },
  },
  { timestamps: true }
);

 
const CarpoolRide = mongoose.model('carpool-rides', carpoolRideSchema);
module.exports = CarpoolRide;
