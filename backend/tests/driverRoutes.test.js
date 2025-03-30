const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, server } = require("../index");
const Driver = require("../models/Driver");
require('dotenv').config({ path: '.env.test' });

let token;
let driverId;

beforeAll(async () => {
    console.log("MongoDB URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "smartcarpool1@gmail.com", password: "1234" });

    if (res.statusCode === 200) {
        token = res.body.token;
    } else {
        console.error("Failed to log in, status code:", res.statusCode, res.body);
    }
});

// Test: Admin Login
it("Admin login - should return a token", async () => {
    expect(token).toBeDefined();
});

// Test: Add a new driver
it("Should create a new driver", async () => {
    await mongoose.connection.db.collection("drivers").deleteMany({});

    const res = await request(app)
        .post("/drivers")
        .set("Authorization", `Bearer ${token}`)
        .send({
            driverFirstName: "John",
            driverLastName: "Doe",
            driverGender: "male",
            driverEmail: "john.doe@example.com",
            driverPhone: "+923144172165",
            driverCnicNumber: "12345-6789012-3",
            driverDOB: "1990-01-01",
            rating: 4.5,
            driverPassword: "password123",
            driverCnicFront: "front-image-url",
            driverCnicBack: "back-image-url",
            driverSelfie: "selfie-url",
            vehicleProductionYear: "2022",
            vehicleType: "Car",
            carType: "Sedan",
            vehicleName: "Toyota Corolla",
            vehicleColor: "Black",
            licenseNumber: "ABC-1234",
            compositeId:"DR-004",
            brand: "Toyota",
            vehicleRegisterationFront: "reg-front-url",
            vehicleRegisterationBack: "reg-back-url",
            vehiclePhotos: ["photo1-url", "photo2-url"]
        });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    driverId = res.body.id;
});
 
  
// Test: Fetch all drivers
it("Should fetch all drivers", async () => {
    const res = await request(app)
        .get("/drivers")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

// Test: Fetch single driver by ID
it("Should fetch a single driver by ID", async () => {
    const res = await request(app)
        .get(`/drivers/${driverId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", driverId);
});

// Test: Update a driver
it("Should update the driver details", async () => {
    const res = await request(app)
        .put(`/drivers/${driverId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            driverFirstName: "John",
            driverLastName: "Doe",
            driverGender: "male",
            driverEmail: "john.doe@example.com",
            driverPhone: "+923144172165",
            driverCnicNumber: "12345-6789012-3",
            driverDOB: "1990-01-02",
            rating: 4.5,
            driverPassword: "password123",
            driverCnicFront: "front-image-url",
            driverCnicBack: "back-image-url",
            driverSelfie: "selfie-url",
            vehicleProductionYear: "2022",
            vehicleType: "Car",
            carType: "Sedan",
            vehicleName: "Toyota Corolla",
            vehicleColor: "Black",
            licenseNumber: "ABC-1234",
            compositeId:"DR-004",
            brand: "Toyota",
            vehicleRegisterationFront: "reg-front-url",
            vehicleRegisterationBack: "reg-back-url",
            vehiclePhotos: ["photo1-url", "photo2-url"]
        });
    expect(res.statusCode).toBe(200);
 });

// Test: Delete a driver
it("Should delete a driver", async () => {
    const res = await request(app)
        .delete(`/drivers/${driverId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Driver deleted");
});

// Cleanup after tests
afterAll(async () => {
    await mongoose.connection.close();
    if (server) {
        server.close();
    }
});
