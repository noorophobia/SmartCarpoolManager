const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const Package = require("../models/Packages");
require("dotenv").config({ path: ".env.test" });

let token;
let packageId;

beforeAll(async () => {
    console.log("MongoDB URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const res = await request(app)
        .post("/api/admin/login") // Update this route if necessary
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

// Test: Create a new package
it("Should create a new package", async () => {
    const res = await request(app)
        .post("/packages")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Premium Package",
            duration: 60,
            discount: 15,
            fee: 2000
        });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    packageId = res.body._id;
});

// Test: Fetch all packages
it("Should fetch all packages", async () => {
    const res = await request(app)
        .get("/packages")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

// Test: Fetch a single package by ID
it("Should fetch a single package by ID", async () => {
    const res = await request(app)
        .get(`/packages/${packageId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", packageId);
});

// Test: Update a package
it("Should update package details", async () => {
    const res = await request(app)
        .put(`/packages/${packageId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({  name: "Premium Package",
            duration: 60,
            discount: 15,fee: 2500 });

    expect(res.statusCode).toBe(200);
    expect(res.body.fee).toBe(2500);
});

// Test: Delete a package
it("Should delete a package", async () => {
    const res = await request(app)
        .delete(`/packages/${packageId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Package deleted successfully");
});

// Cleanup after tests
afterAll(async () => {
    await mongoose.connection.close();
    if (server) {
        server.close();
    }
});
