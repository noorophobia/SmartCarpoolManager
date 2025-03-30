const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const CarpoolRide = require("../models/CarpoolRide");
require("dotenv").config({ path: ".env.test" });

let rideId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a sample carpool ride for testing
  const ride = new CarpoolRide({
    _id: new mongoose.Types.ObjectId(),
    car: "Toyota Corolla",
    carNumber: "ABC-123",
    driverID: new mongoose.Types.ObjectId(),
    driverGender: "male",
    driverName: "John Doe",
    driverNumber: "1234567890",
    passengerAccepted: true,
    passengerCurrentLocationLatitude: 24.8607,
    passengerCurrentLocationLongitude: 67.0011,
    requestAccepted: true,
    requestCapacity: 2,
    requestDestination: "Downtown",
    requestFare: 500,
    requestOrigin: "Airport",
    requestType: "carpool",
    requestVehicle: "car",
    status: "pending",
    additionalPassengers: 1,
    dropoff: "Central Park",
    fare: 500,
    mode: "Economy",
    rideStatus: "in-progress",
    rideType: "economy",
    selectedCarpoolers: "User123",
    selectedDriver: "Driver456",
    passengerId: [new mongoose.Types.ObjectId()],
    passengerName: ["Alice"],
    passengerPhone: ["9876543210"],
    pickup: "Terminal 1",
  });

  const savedRide = await ride.save();
  rideId = savedRide._id;
});

describe("Carpool Ride API Tests", () => {
  // Test: Get all carpool rides
  it("Should fetch all carpool rides", async () => {
    const res = await request(app).get("/carpool-rides");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Test: Get a single carpool ride by ID
  it("Should fetch a carpool ride by ID", async () => {
    const res = await request(app).get(`/carpool-rides/${rideId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", rideId.toString());
  });

  // Test: Return 404 if ride is not found
  it("Should return 404 if carpool ride is not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/carpool-rides/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Single Ride not found");
  });

  // Test: Create a new carpool ride
  it("Should create a new carpool ride", async () => {
    const newRide = {
      _id: new mongoose.Types.ObjectId(),
      car: "Honda Civic",
      carNumber: "XYZ-789",
      driverID: new mongoose.Types.ObjectId(),
      driverGender: "female",
      driverName: "Jane Doe",
      driverNumber: "1122334455",
      passengerAccepted: true,
      passengerCurrentLocationLatitude: 25.276987,
      passengerCurrentLocationLongitude: 55.296249,
      requestAccepted: true,
      requestCapacity: 3,
      requestDestination: "City Center",
      requestFare: 600,
      requestOrigin: "Uptown",
      requestType: "carpool",
      requestVehicle: "car",
      status: "pending",
      additionalPassengers: 2,
      dropoff: "Metro Station",
      fare: 600,
      mode: "Luxury",
      rideStatus: "pending",
      rideType: "business",
      selectedCarpoolers: "User456",
      selectedDriver: "Driver789",
      passengerId: [new mongoose.Types.ObjectId()],
      passengerName: ["Bob"],
      passengerPhone: ["5566778899"],
      pickup: "Gate 5",
    };

    const res = await request(app).post("/carpool-rides").send(newRide);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Carpool ride created successfully");
    expect(res.body.ride).toHaveProperty("_id");
  });
});

afterAll(async () => {
  await CarpoolRide.findByIdAndDelete(rideId);
  await mongoose.connection.close();
  if (server) server.close();
});
