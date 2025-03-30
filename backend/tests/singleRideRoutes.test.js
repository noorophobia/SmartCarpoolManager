const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const SingleRide = require("../models/single-rides");
require("dotenv").config({ path: ".env.test" });

let rideId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create a sample ride for testing
  const ride = new SingleRide({
    requestOrigin: "123 Main Street",
    requestDestination: "456 Elm Street",
    status: "ongoing",
    paymentId: new mongoose.Types.ObjectId(),
    vehicleId: new mongoose.Types.ObjectId(),
    passengerId: new mongoose.Types.ObjectId(),
    driverID: new mongoose.Types.ObjectId(),
    passengerRating: "5",
    passengerReview: "Smooth ride!",
    driverRating: "4.5",
    driverReview: "Great passenger!",
    date: new Date(),
    isResolved: false,
    requestFare: 500,
  });
  const savedRide = await ride.save();
  rideId = savedRide._id;
});

// Test: Fetch all single rides
it("Should fetch all single rides", async () => {
  const res = await request(app).get("/single-rides");

  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

// Test: Fetch a single ride by ID
it("Should fetch a single ride by ID", async () => {
  const res = await request(app).get(`/single-rides/${rideId}`);

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("_id", rideId.toString());
});

// Test: Return 404 if ride not found
it("Should return 404 if ride not found", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const res = await request(app).get(`/single-rides/${nonExistentId}`);

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("message", "Single Ride not found");
});

// Test: Create a new ride
it("Should create a new ride", async () => {
  const res = await request(app)
    .post("/single-rides")
    .send({
      requestOrigin: "789 Park Avenue",
      requestDestination: "1011 Oak Street",
      status: "ongoing",
      paymentId: new mongoose.Types.ObjectId(),
      vehicleId: new mongoose.Types.ObjectId(),
      passengerId: new mongoose.Types.ObjectId(),
      driverID: new mongoose.Types.ObjectId(),
      passengerRating: "4",
      passengerReview: "Good ride!",
      driverRating: "5",
      driverReview: "Excellent passenger!",
      date: new Date(),
      isResolved: false,
      requestFare: 600,
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("message", "Ride created successfully");
  expect(res.body.ride).toHaveProperty("_id");
});

// Cleanup after tests
afterAll(async () => {
  await SingleRide.findByIdAndDelete(rideId);
  await mongoose.connection.close();
  if (server) server.close();
});
