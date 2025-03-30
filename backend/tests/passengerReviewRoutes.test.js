const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const RideReview = require("../models/PassengerReview");
require("dotenv").config({ path: ".env.test" });

let token;
let reviewId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Log in as admin to get auth token
  const res = await request(app)
    .post("/api/admin/login")
    .send({ email: "smartcarpool1@gmail.com", password: "1234" });

  if (res.statusCode === 200) {
    token = res.body.token;
  } else {
    console.error("Admin login failed:", res.body);
  }

  // Create a sample ride review for testing
  const review = new RideReview({
    rideId: new mongoose.Types.ObjectId(),
    driverId: new mongoose.Types.ObjectId(),
    passengerId: new mongoose.Types.ObjectId(),
    driverName: "John Doe",
    driverProfilePicture: "profile-pic-url",
    rating: 5,
    review: "Great ride!",
    resolved: false,
    rideCompositeId: "RC-001",
    driverCompositeId: "DR-001",
    passengerCompositeId: "PC-001",
  });
  const savedReview = await review.save();
  reviewId = savedReview._id;
});

it("Should update review's resolved status", async () => {
  const res = await request(app)
    .put(`/passenger-ride-reviews/resolve/${reviewId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ resolved: true });

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty("message", "Review status updated successfully.");
  expect(res.body.updatedReview).toHaveProperty("resolved", true);
});

it("Should return 400 if resolved status is not a boolean", async () => {
  const res = await request(app)
    .put(`/passenger-ride-reviews/resolve/${reviewId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ resolved: "not-a-boolean" });

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty("message", "Resolved must be a boolean value.");
});

it("Should return 404 if review not found", async () => {
  const nonExistentId = new mongoose.Types.ObjectId();
  const res = await request(app)
    .put(`/passenger-ride-reviews/resolve/${nonExistentId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ resolved: true });

  expect(res.statusCode).toBe(404);
  expect(res.body).toHaveProperty("message", "Review not found.");
});

afterAll(async () => {
  await RideReview.findByIdAndDelete(reviewId);
  await mongoose.connection.close();
  if (server) server.close();
});
